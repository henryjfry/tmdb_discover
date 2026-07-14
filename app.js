const D='edde6b5e41246ab79a2697cd125e1781';const p=new URLSearchParams(location.search);const g=(k,d='')=>p.get(k)||d;let movies=[],genres={};let total=1;async function loadGenres(){const r=await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${g('api_key',D)}`).then(x=>x.json());genre.innerHTML='<option value="">All Genres</option>';(r.genres||[]).forEach(z=>{genres[z.id]=z.name;genre.innerHTML+=`<option value="${z.id}">${z.name}</option>`})}function showMovie(i){const m=movies[i];if(!m)return;const gs=(m.genre_ids||[]).map(x=>genres[x]).filter(Boolean).join(', ');detailsPanel.innerHTML=`<h3>${m.title}</h3><p><b>${gs}</b></p><p>${m.overview||''}</p><p>⭐ ${m.vote_average} | Votes ${m.vote_count}</p><p>${m.release_date||''} | ${m.original_language||''}</p>`;const dd=document.getElementById('detailsDetails');if(dd) dd.open=true;}window.showMovie=showMovie;async function load(){let u=`https://api.themoviedb.org/3/discover/movie?api_key=${g('api_key',D)}&sort_by=${g('sort','popularity.desc')}&page=${g('page','1')}`;if(g('genres'))u+=`&with_genres=${g('genres')}`;if(g('language'))u+=`&with_original_language=${g('language')}`;if(g('votes_min'))u+=`&vote_count.gte=${g('votes_min')}`;if(g('year_min'))u+=`&primary_release_date.gte=${g('year_min')}-01-01`;if(g('year_max'))u+=`&primary_release_date.lte=${g('year_max')}-12-31`;const d=await fetch(u).then(r=>r.json());movies=d.results||[];total=d.total_pages||1;movieGrid.innerHTML=movies.map((m,i)=>`<div class="movie" onmouseover="showMovie(${i})" ontouchstart="showMovie(${i})" onclick="showMovie(${i})"><img src="https://image.tmdb.org/t/p/w342${m.poster_path||''}"><div>${m.title}</div></div>`).join('');if(movies.length)showMovie(0);pageInfo.textContent=`${g('page','1')} of ${total}`;}apply.onclick=()=>{const n=new URLSearchParams();[['apiKey','api_key'],['sort','sort'],['yearMin','year_min'],['yearMax','year_max'],['genre','genres'],['language','language'],['votesMin','votes_min']].forEach(a=>{let v=document.getElementById(a[0]).value;if(v)n.set(a[1],v)});n.set('page','1');location.search=n.toString()};reset.onclick=()=>location.search='';goBtn.onclick=()=>{p.set('page',jumpPage.value||1);location.search=p.toString()};nextBtn.onclick=()=>{p.set('page',(+g('page',1)+1));location.search=p.toString()};prevBtn.onclick=()=>{p.set('page',Math.max(1,+g('page',1)-1));location.search=p.toString()};window.onload=async()=>{apiKey.value=g('api_key',D);sort.value=g('sort','popularity.desc');yearMin.value=g('year_min','');yearMax.value=g('year_max','');language.value=g('language','');votesMin.value=g('votes_min','');await loadGenres();await load(); setInitialDetailsState(); setupMobileDetailsToggle();}; 

function setInitialDetailsState(){
  const isMobile = window.innerWidth <= 768;
  const filtersD = document.getElementById('filtersDetails');
  const detailsD = document.getElementById('detailsDetails');
  if(filtersD) filtersD.open = !isMobile;
  if(detailsD) detailsD.open = !isMobile;
}

let currentMovieIndex = -1;
function showMovie(i){
  const m=movies[i];if(!m)return;
  const gs=(m.genre_ids||[]).map(x=>genres[x]).filter(Boolean).join(', ');
  detailsPanel.innerHTML=`<h3>${m.title}</h3><p><b>${gs}</b><p>${m.original_title||''}</p></p><p>${m.overview||''}</p><p>⭐ ${m.vote_average} | Votes ${m.vote_count}</p><p>${m.release_date||''} | ${m.original_language||''}</p>`;
  const dd=document.getElementById('detailsDetails');
  if(dd){
    // Mobile: Update content + FORCE COLLAPSE on movie tap (scrolling/selection). 
    // Expand ONLY by clicking the header summary.
    const isMobile = window.innerWidth <= 768;
    dd.open = !isMobile;
    currentMovieIndex = i;
  }
}
window.showMovie=showMovie;

function setupMobileDetailsToggle(){
  const isMobile = window.innerWidth <= 768;
  if(!isMobile) return;
  const grid = document.getElementById('movieGrid');
  const details = document.getElementById('detailsDetails');
  if(!grid || !details) return;

  // Strict mobile rule: Collapse on ANY non-header interaction.
  // Header click toggles via native <details>. Movie tap updates + collapses.
  document.addEventListener('click', function(e){
    if(!details.open) return;
    const movieCard = e.target.closest('.movie');
    const isDetailsArea = e.target.closest('#detailsDetails') || e.target.closest('details.movie-details');
    if(!movieCard && !isDetailsArea){
      details.open = false;
      currentMovieIndex = -1;
    }
    // Inside details or summary: native toggle allowed
  }, true);

  // Touch scroll on grid forces collapse
  let touchStartY = 0;
  grid.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, {passive: true});

  grid.addEventListener('touchend', (e) => {
    if (!details.open) return;
    const touchEndY = e.changedTouches[0].clientY;
    if (Math.abs(touchEndY - touchStartY) > 15) {
      details.open = false;
      currentMovieIndex = -1;
    }
  }, {passive: true});
}