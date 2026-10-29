// R2 gradients: every section gradient is a GRAD loop (Elaye 23:55, "use the GRAD set, don't re-derive").
// Loops play only while on screen and motion is allowed; otherwise the still (poster) shows.

export function createGrads(reduced){
  const videos=[...document.querySelectorAll('video[data-grad]')],onScreen=new Set();
  let paused=false,manual=false;
  const sync=()=>{for(const v of videos){if(!paused&&!manual&&!reduced.matches&&!document.hidden&&onScreen.has(v))v.play().catch(()=>{});else v.pause();}};
  const io=new IntersectionObserver(es=>{for(const e of es){if(e.isIntersecting)onScreen.add(e.target);else onScreen.delete(e.target);}sync();},{rootMargin:'200px 0px'});
  videos.forEach(v=>io.observe(v));

  document.addEventListener('visibilitychange',sync);

  return {
    setPaused(v){paused=v;sync();},
    // Deterministic frame for captures: each on-screen loop seeked to t.
    renderAt(t){manual=true;sync();
      return Promise.all(videos.filter(v=>onScreen.has(v)&&v.readyState>=1).map(v=>new Promise(res=>{const to=setTimeout(res,1500);v.addEventListener('seeked',()=>{clearTimeout(to);res();},{once:true});v.currentTime=t%(v.duration||8);})));},
    resume(){manual=false;sync();}
  };
}
