// Source: 21st.dev/@hammamikhairi/components/animated-gradient-background
// "Animated Gradient Background" by 0xkhairi Khairi. MIT License (per source page).
// Vanilla port of the manager-supplied Component.tsx (ledger 203).
// Same stops, radial geometry, 0.02/frame step, +/-5 range and 2s entrance.
// Task 007: unchanged 030 V1-field asset. The source-203 radial controls the white dome,
// not new colour stops; one field spans the hero and film to remove a section seam.
export const STOPS = [35, 50, 60, 70, 80, 90, 100];
export const COLOURS = ["#fff", "#ffffffeb", "#ffffff7a", "#ffffff00", "#ffffff00", "#ffffff00", "#ffffff00"];
export function createHeroGradient(host, reduced) {
  const layer = document.createElement('div');
  layer.className = 'hero-gradient-203';
  layer.setAttribute('aria-hidden', 'true');
  host.prepend(layer);
  let width = 125, direction = 1, paused = false, raf = 0, visible = true, frames = 0, manual = false;
  const stops = STOPS.map((stop, i) => `${COLOURS[i]} ${stop}%`).join(', ');
  const paint = () => { layer.style.setProperty('--hero-white-dome', `radial-gradient(${width}% ${width}% at 50% 20%, ${stops})`); };
  paint();
  const entrance = reduced.matches ? null : layer.animate(
    [{opacity: 0, transform: 'scale(1.5)'}, {opacity: 1, transform: 'scale(1)'}],
    {duration: 2000, easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)', fill: 'both'}
  );
  function tick() {
    raf = 0;
    if (manual || paused || reduced.matches || !visible || document.hidden) return;
    if (width >= 130) direction = -1;
    if (width <= 120) direction = 1;
    width += direction * 0.02;
    paint(); frames++;
    raf = requestAnimationFrame(tick);
  }
  function sync() {
    const stopped = manual || paused || reduced.matches || !visible || document.hidden;
    if (stopped) { cancelAnimationFrame(raf); raf = 0; entrance?.pause(); }
    else { if (!raf) raf = requestAnimationFrame(tick); if (entrance?.playState !== 'finished') entrance?.play(); }
    if (reduced.matches) { width = 125; paint(); if (entrance) entrance.currentTime = 2000; }
  }
  const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); });
  observer.observe(host);
  reduced.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  sync();
  return {
    setPaused(value) { paused = value; sync(); },
    renderAt(t) {
      manual = true;
      cancelAnimationFrame(raf); raf = 0;
      // Deterministic 60 Hz sample of the original per-frame loop, including its boundaries.
      width = 125; direction = 1;
      for (let i = 0; i < Math.round(Math.max(0, t) * 60); i++) {
        if (width >= 130) direction = -1;
        if (width <= 120) direction = 1;
        width += direction * 0.02;
      }
      paint(); entrance?.pause(); if (entrance) entrance.currentTime = Math.min(t * 1000, 2000);
    },
    resume() { manual = false; sync(); },
    stats() { return {width, frames, manual, running: !!raf, paused, reduced: reduced.matches, visible, entranceTime: entrance?.currentTime ?? 2000}; },
    dispose() { cancelAnimationFrame(raf); entrance?.cancel(); observer.disconnect(); reduced.removeEventListener('change', sync); document.removeEventListener('visibilitychange', sync); }
  };
}
