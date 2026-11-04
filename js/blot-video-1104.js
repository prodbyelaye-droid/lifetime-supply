// Blot videos 1104. Every video.bv-video stays a poster (its own first frame) until it is near the
// viewport; then its <source data-src> become real sources and it autoplays muted and looped while on screen. It pauses
// off screen, on a hidden tab and with the header's "pause motion" (html[data-motion-paused]). Under prefers-reduced-motion
// or Save-Data nothing is fetched and the first frame stays. Standalone on purpose: it works even if assembly.js fails.
(() => {
  const videos = [...document.querySelectorAll('video.bv-video')];
  if (!videos.length || !('IntersectionObserver' in window)) return;
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = !!(navigator.connection && navigator.connection.saveData);
  const state = new Map(videos.map((v) => [v, {near: false, visible: false}]));
  const still = () => reduced.matches || saveData;
  const held = () => root.hasAttribute('data-motion-paused') || document.hidden;
  function attach(v) {
    if (v.dataset.bvState) return;
    for (const s of v.querySelectorAll('source[data-src]')) s.src = s.dataset.src;
    v.dataset.bvState = 'loading';
    v.muted = true; v.defaultMuted = true; v.playsInline = true;
    v.load();
  }
  function sync(v) {
    const s = state.get(v);
    if (still()) { if (!v.paused) v.pause(); return; }
    if (s.near) attach(v);
    if (!v.dataset.bvState || v.dataset.bvState === 'failed') return;
    if (s.visible && !held()) {
      if (v.paused) { const p = v.play(); if (p && p.catch) p.catch(() => {}); }
    } else if (!v.paused) v.pause();
  }
  const syncAll = () => videos.forEach(sync);
  const nearby = new IntersectionObserver((entries) => {
    for (const e of entries) { state.get(e.target).near = e.isIntersecting; sync(e.target); }
  }, {rootMargin: '320px 0px', threshold: 0});
  const onscreen = new IntersectionObserver((entries) => {
    for (const e of entries) { state.get(e.target).visible = e.isIntersecting; sync(e.target); }
  }, {threshold: 0.01});
  for (const v of videos) {
    v.muted = true;
    nearby.observe(v); onscreen.observe(v);
    v.addEventListener('playing', () => { v.dataset.bvState = 'playing'; if (still() || held() || !state.get(v).visible) v.pause(); });
    v.addEventListener('pause', () => { if (v.dataset.bvState === 'playing') v.dataset.bvState = 'paused'; });
    v.addEventListener('canplay', () => sync(v));
    // a <source> error only counts once no source is left (a missing WebM falls through to the MP4)
    v.addEventListener('error', () => setTimeout(() => { if (v.networkState === 3) v.dataset.bvState = 'failed'; }, 0), true);
  }
  new MutationObserver(syncAll).observe(root, {attributes: true, attributeFilter: ['data-motion-paused']});
  document.addEventListener('visibilitychange', syncAll);
  if (reduced.addEventListener) reduced.addEventListener('change', syncAll);
  window.blotVideos = {state: () => videos.map((v) => ({id: v.id, state: v.dataset.bvState || 'poster', paused: v.paused, time: v.currentTime, src: v.currentSrc}))};
})();
