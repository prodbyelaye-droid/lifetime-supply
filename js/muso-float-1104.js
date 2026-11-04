// Muso cover float 1104: the covers behind the #founder muso.ai proof drift at their own depth. On a pointer device they
// ease away from the pointer and drift with the scroll; on touch only the gentle scroll drift runs. Nothing moves under
// prefers-reduced-motion, with the header "pause motion" (html[data-motion-paused] / .motion-paused), on a hidden tab or
// off screen: the covers rest in their CSS slots. The layer exists only when tools/muso-covers-1104.cjs found 6+ covers.
(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const touch = matchMedia('(hover: none), (pointer: coarse)');
  const POINTER = 16, SCROLL = 28, SCROLL_TOUCH = 14, EASE = 0.06; // px per unit of depth; per-frame easing
  let layer = null, section = null, frameEl = null, items = [], raf = 0, visible = false, px = 0, py = 0;
  const held = () => reduced.matches || document.hidden || root.hasAttribute('data-motion-paused') || root.classList.contains('motion-paused');
  function frame() {
    raf = 0;
    if (!visible || held()) return rest();
    const r = frameEl.getBoundingClientRect(); // the scroll position is read from the reveal track: #founder is sticky inside it
    const drift = Math.max(-1.5, Math.min(1.5, (r.top + r.height / 2 - innerHeight / 2) / innerHeight));
    const pointer = !touch.matches, scroll = pointer ? SCROLL : SCROLL_TOUCH;
    let moving = false;
    for (const it of items) {
      const tx = pointer ? -px * it.depth * POINTER : 0;
      const ty = (pointer ? -py * it.depth * POINTER : 0) + drift * it.depth * scroll;
      it.x += (tx - it.x) * EASE; it.y += (ty - it.y) * EASE;
      if (Math.abs(tx - it.x) > 0.05 || Math.abs(ty - it.y) > 0.05) moving = true;
      it.el.style.transform = `translate3d(${it.x.toFixed(2)}px,${it.y.toFixed(2)}px,0)`;
    }
    if (moving) raf = requestAnimationFrame(frame);
  }
  const kick = () => { if (!raf && layer && visible && !held()) raf = requestAnimationFrame(frame); };
  function rest() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    for (const it of items) { it.x = 0; it.y = 0; it.el.style.transform = ''; }
  }
  function init() {
    layer = document.querySelector('#founder > .mf1104');
    if (!layer || layer.hasAttribute('data-mf-ready') || !('IntersectionObserver' in window)) return;
    section = layer.parentElement;
    frameEl = section.closest('[data-reveal274-track]') || section;
    items = [...layer.querySelectorAll('.mf1104__item')].map((el) => ({el, depth: parseFloat(el.dataset.depth) || 1, x: 0, y: 0}));
    layer.setAttribute('data-mf-ready', '');
    new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; visible ? kick() : rest(); }, {rootMargin: '120px 0px'}).observe(section);
    addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch' || touch.matches) return;
      px = e.clientX / innerWidth * 2 - 1; py = e.clientY / innerHeight * 2 - 1; kick();
    }, {passive: true});
    addEventListener('scroll', kick, {passive: true});
    const sync = () => (held() ? rest() : kick());
    new MutationObserver(sync).observe(root, {attributes: true, attributeFilter: ['class', 'data-motion-paused']});
    document.addEventListener('visibilitychange', sync);
    if (reduced.addEventListener) reduced.addEventListener('change', sync);
  }
  init();
  window.musoFloat = {init, state: () => ({on: !!layer, visible, held: held(), items: items.map((it) => it.el.style.transform || 'rest')})};
})();
