// Vanilla port of Aceternity's EvervaultCard, ledger 204.
// Source: https://ui.aceternity.com/components/evervault-card (2026-10-30).
// Retains the source's 1500-character alphabet, cursor coordinates and 250px mask.
// Explicit task 014 requests this source interaction. No autonomous/new motion.
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function characters() {
  let result = '';
  for (let i = 0; i < 1500; i++) result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  return result;
}
export function createFeatures() {
  const choice = new URLSearchParams(location.search).get('featureEffect');
  document.querySelector('.ev-features')?.setAttribute('data-effect', /^[ABCD]$/.test(choice || '') ? choice : 'A');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const paused = () => reduced.matches || document.documentElement.hasAttribute('data-motion-paused');
  document.querySelectorAll('.ev-surface').forEach(surface => {
    const noise = surface.querySelector('.ev-noise p');
    noise.textContent = characters();
    function move(event) {
      if (event.pointerType === 'touch' || paused()) return;
      const {left, top} = surface.getBoundingClientRect();
      surface.style.setProperty('--ev-x', `${event.clientX - left}px`);
      surface.style.setProperty('--ev-y', `${event.clientY - top}px`);
      if (surface.closest(".ev-features").dataset.effect === "A") noise.textContent = characters();
    }
    surface.addEventListener('pointerenter', event => {
      if (event.pointerType === 'touch') return;
      // Reduced motion gets a still version of the same reveal at its centre.
      if (paused()) {
        surface.style.setProperty('--ev-x', '72px');
        surface.style.setProperty('--ev-y', '80px');
      } else move(event);
      surface.setAttribute('data-active', '');
    });
    surface.addEventListener('pointermove', move);
    surface.addEventListener('pointerleave', () => surface.removeAttribute('data-active'));
    surface.closest('article').addEventListener('focusin', () => {
      surface.style.setProperty('--ev-x', '72px');
      surface.style.setProperty('--ev-y', '80px');
    });
  });
}
