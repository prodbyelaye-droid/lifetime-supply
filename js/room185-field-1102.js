/* The positions below are 4fps centroid samples from original185, 1.25–3.5s.
   Linear interpolation + alternating replay are disclosed adaptations, not the
   unknown original shader/easing. No icon bounce or logo-collapse choreography. */
(()=>{
  const art=document.querySelector('#features.main-value .f-room .mv-art');
  if(!art)return;
  const root=document.documentElement;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const paths={"mint":[{"transform":"translate(13.38%, 16.94%)","offset":0.0},{"transform":"translate(12.9%, 16.1%)","offset":0.111111},{"transform":"translate(12.82%, 15.47%)","offset":0.222222},{"transform":"translate(12.27%, 15.63%)","offset":0.333333},{"transform":"translate(11.81%, 16.25%)","offset":0.444444},{"transform":"translate(12.13%, 15.92%)","offset":0.555556},{"transform":"translate(12.47%, 14.66%)","offset":0.666667},{"transform":"translate(12.72%, 14.44%)","offset":0.777778},{"transform":"translate(13.76%, 15.65%)","offset":0.888889},{"transform":"translate(15.76%, 16.72%)","offset":1.0}],"warm":[{"transform":"translate(36.38%, 30.27%)","offset":0.0},{"transform":"translate(36.68%, 29.41%)","offset":0.111111},{"transform":"translate(36.7%, 28.04%)","offset":0.222222},{"transform":"translate(36.91%, 27.23%)","offset":0.333333},{"transform":"translate(37.21%, 26.44%)","offset":0.444444},{"transform":"translate(37.67%, 25.72%)","offset":0.555556},{"transform":"translate(38.14%, 25.02%)","offset":0.666667},{"transform":"translate(38.28%, 24.48%)","offset":0.777778},{"transform":"translate(38.63%, 23.93%)","offset":0.888889},{"transform":"translate(39.0%, 23.22%)","offset":1.0}],"pink":[{"transform":"translate(39.39%, 53.32%)","offset":0.0},{"transform":"translate(37.2%, 60.14%)","offset":0.111111},{"transform":"translate(36.58%, 63.73%)","offset":0.222222},{"transform":"translate(36.78%, 64.58%)","offset":0.333333},{"transform":"translate(36.17%, 68.24%)","offset":0.444444},{"transform":"translate(35.14%, 72.16%)","offset":0.555556},{"transform":"translate(34.57%, 76.26%)","offset":0.666667},{"transform":"translate(35.02%, 77.39%)","offset":0.777778},{"transform":"translate(35.85%, 78.19%)","offset":0.888889},{"transform":"translate(37.48%, 77.98%)","offset":1.0}],"blue":[{"transform":"translate(53.69%, 38.98%)","offset":0.0},{"transform":"translate(55.42%, 39.0%)","offset":0.111111},{"transform":"translate(58.09%, 39.13%)","offset":0.222222},{"transform":"translate(61.94%, 39.64%)","offset":0.333333},{"transform":"translate(65.82%, 39.93%)","offset":0.444444},{"transform":"translate(67.24%, 39.47%)","offset":0.555556},{"transform":"translate(67.17%, 39.12%)","offset":0.666667},{"transform":"translate(66.03%, 39.21%)","offset":0.777778},{"transform":"translate(63.26%, 40.41%)","offset":0.888889},{"transform":"translate(59.43%, 42.82%)","offset":1.0}]};
  const animations=[];
  let visible=false;
  for(const layer of art.querySelectorAll('.room185-field')){
    const frames=paths[layer.dataset.field];
    if(!frames||typeof layer.animate!=='function')continue;
    const animation=layer.animate(frames,{duration:2250,iterations:Infinity,direction:'alternate',easing:'linear',fill:'both'});
    animation.pause(); animation.currentTime=0; animations.push(animation);
  }
  const sync=()=>{
    const stopped=reduced.matches||document.hidden||!visible||root.hasAttribute('data-motion-paused')||root.classList.contains('motion-paused');
    for(const animation of animations){
      if(stopped)animation.pause(); else animation.play();
      if(reduced.matches)animation.currentTime=0;
    }
  };
  new IntersectionObserver(entries=>{visible=entries.some(entry=>entry.isIntersecting);sync();},{threshold:0}).observe(art);
  new MutationObserver(sync).observe(root,{attributes:true,attributeFilter:['data-motion-paused','class']});
  reduced.addEventListener('change',sync);
  document.addEventListener('visibilitychange',sync);
  window.addEventListener('pagehide',()=>animations.forEach(animation=>animation.pause()));
  window.addEventListener('pageshow',sync);
  sync();
})();
