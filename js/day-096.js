// opus 096 · "a day in my workflow": the line fills in V1 as you scroll, and a small eyeless blot rides its tip.
// The tip sits where the sticky labels sit (the anchor), so the blot holds its place beside the label while the line
// grows under it; each step's dot stays on the line and turns solid when the tip passes it (Origin UI). The blot follows the tip with a short critically damped
// lag measured in real milliseconds (no per-frame steps), so a jump in scroll glides instead of zapping (STANDING 5),
// and it stretches a little along the line with its speed, then settles. Under reduced motion the line is simply full.
// Dev switch for the critic: ?day-label=his (his words where copy 02 gives them, otherwise the number) or ?day-label=num.
(() => {
  const root = document.querySelector('.day96');
  if (!root) return;
  const body = root.querySelector('.day96-body'), track = root.querySelector('.day96-track');
  const fill = root.querySelector('.day96-fill'), rider = root.querySelector('.day96-rider');
  const steps = [...root.querySelectorAll('.day96-step')];

  const mode = new URLSearchParams(location.search).get('day-label');
  if (mode === 'his' || mode === 'num') {
    root.dataset.label = mode;
    steps.forEach((s, i) => { const t = s.querySelector('.day96-time'); t.textContent = mode === 'num' ? `0${i + 1}` : t.dataset.his; });
  }

  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let geo = null, y = null, v = 0, last = 0, raf = 0, target = 0, raw = 0;

  // natural (unstuck) dot centre and the furthest a sticky dot can travel, both in .day96-body coordinates
  function measure() {
    const cs = getComputedStyle(root.closest('.flow'));
    const dy = parseFloat(cs.getPropertyValue('--d96-dy')) || 0;
    const bodyTop = body.getBoundingClientRect().top + scrollY;
    const rows = steps.map((s) => {
      const when = s.querySelector('.day96-when'), sticky = getComputedStyle(when).position === 'sticky';
      const top = s.getBoundingClientRect().top + scrollY - bodyTop;
      const d = s.querySelector('.day96-dot').getBoundingClientRect(); // dots never stick
      const natural = d.top + d.height / 2 + scrollY - bodyTop;
      const max = sticky ? top + s.offsetHeight - parseFloat(getComputedStyle(s).paddingBottom) - when.offsetHeight + dy : natural;
      return {natural, max: Math.max(natural, max)};
    });
    const t0 = rows[0].natural, t1 = rows[rows.length - 1].max;
    track.style.setProperty('--d96-t0', `${t0}px`);
    track.style.setProperty('--d96-len', `${t1 - t0}px`);
    const anchor = parseFloat(getComputedStyle(steps[0].querySelector('.day96-when')).top);
    geo = {rows, t0, t1, bodyTop, dy, anchor: Number.isFinite(anchor) ? anchor : innerHeight * 0.24};
  }

  // where the tip should be, in track coordinates (0 … length)
  function aim() {
    const {t0, t1, bodyTop, anchor, dy} = geo;
    const sticky = getComputedStyle(steps[0].querySelector('.day96-when')).position === 'sticky';
    const a = sticky ? anchor + dy : innerHeight * 0.42; // phone: the tip leads at 42% of the screen
    raw = scrollY + a - bodyTop;
    return Math.min(Math.max(raw, t0), t1) - t0;
  }

  function paint(tip) {
    const len = geo.t1 - geo.t0;
    fill.style.setProperty('--d96-p', len ? (tip / len).toFixed(5) : 1);
    rider.style.setProperty('--d96-y', `${tip.toFixed(2)}px`);
    const s = Math.min(Math.abs(v) / 2.2, 1) * 0.16; // px/ms → up to 16% stretch along the line
    rider.style.setProperty('--d96-sy', (1 + s).toFixed(4));
    rider.style.setProperty('--d96-sx', (1 - s * 0.6).toFixed(4));
    const at = Math.min(tip + geo.t0, raw) + 0.5; // a step turns solid once the tip has truly reached it
    steps.forEach((st, i) => st.classList.toggle('is-reached', geo.rows[i].natural <= at));
  }

  function frame(now) {
    raf = 0;
    const dt = Math.min(Math.max(now - last, 0), 64); last = now;
    target = aim();
    if (y === null) { y = target; v = 0; }
    else if (dt > 0) {
      // critically damped spring, ω = 2π/0.18 s: settles in about 200 ms, never overshoots
      const w = (2 * Math.PI) / 180, x = y - target, e = Math.exp(-w * dt);
      const nx = (x + (v + w * x) * dt) * e; v = (v - w * (v + w * x) * dt) * e; y = target + nx;
      if (Math.abs(y - target) < 0.05 && Math.abs(v) < 0.001) { y = target; v = 0; }
    }
    paint(y);
    if (y !== target || v !== 0) raf = requestAnimationFrame(frame);
  }
  const kick = () => { if (!raf && geo) { last = performance.now(); raf = requestAnimationFrame(frame); } };

  function full() { // reduced motion (and no JS): the line is simply full, every step reached, the blot rests at the end
    root.classList.add('is-live');
    v = 0; y = geo.t1 - geo.t0; raw = Infinity; paint(y);
  }

  function start() {
    measure();
    if (reduce.matches) return full();
    root.classList.add('is-live');
    y = null; kick();
  }

  addEventListener('scroll', () => { if (!reduce.matches) kick(); }, {passive: true});
  const re = () => { measure(); reduce.matches ? full() : kick(); };
  addEventListener('resize', re);
  new ResizeObserver(re).observe(body);
  reduce.addEventListener?.('change', start);
  document.fonts?.ready.then(re);
  start();
  window.day96 = {measure, aim, get y() { return y; }};
})();
