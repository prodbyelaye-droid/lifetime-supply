// Landing task 008: Stats, How it works and Downloads.
// Stats (171, 179): the figures roll odometer-style once as they come into view, in one fixed colour throughout
//   (26 Oct 17:07: they never change colour while rolling).
// How it works (181, 178, 191): 191's line "skip 12 different tools, we do it all" is a variant, ?how=191 (off).
// Downloads (34): 34's arched gradient, drawn in code with colour, moving like liquid; paused off screen.
export function createSections(reduced, howVariant = 'off') {
  document.querySelector('.steps-section').dataset.how = howVariant === '191' ? '191' : 'off';

  // odometer: each digit is a column of 0-9 that rolls to its value; separators and "+" stay still
  for (const el of document.querySelectorAll('.odo')) {
    const text = el.dataset.to;
    el.setAttribute('aria-label', text);
    // the figure itself stays as real text for readers and copy; the rolling digits are drawn in CSS (pseudo-content)
    el.innerHTML = `<span class="odo-sr">${text}</span>` + [...text].map((ch, i) => /\d/.test(ch)
      ? `<span class="odo-d" aria-hidden="true"><span class="odo-col" style="--n:${ch};--i:${i}"></span></span>`
      : `<span class="odo-c" aria-hidden="true" data-c="${ch}"></span>`).join('');
  }
  const io = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting) { e.target.classList.add('is-rolled'); io.unobserve(e.target); } }, {threshold: 0.5});
  document.querySelectorAll('.odo').forEach((el) => reduced.matches ? el.classList.add('is-rolled') : io.observe(el));

  // 34's arch: three coloured bands rising from the bottom centre, their edges swaying slowly like liquid
  const svg = document.querySelector('.arch34'), bands = ['.a34-c', '.a34-b', '.a34-a'].map((s) => svg.querySelector(s));
  const shape = (t, k, w, h) => {
    const sway = (x) => Math.sin(t * 0.5 + k * 1.7 + x * 3.1) * 14 + Math.sin(t * 0.31 + k + x * 5.3) * 8;
    const cx = 600 + Math.sin(t * 0.23 + k) * 30, top = 520 - h, l = cx - w, r = cx + w;
    return `M${l - 260} 520C${l} ${520 - h * 0.2 + sway(0.1)} ${cx - w * 0.45} ${top + sway(0.4)} ${cx} ${top + sway(0.5)}C${cx + w * 0.45} ${top + sway(0.6)} ${r} ${520 - h * 0.2 + sway(0.9)} ${r + 260} 520Z`;
  };
  let t = 0, raf = 0, live = false, paused = false, last = 0;
  const draw = () => { bands[0].setAttribute('d', shape(t, 0, 470, 330)); bands[1].setAttribute('d', shape(t, 1, 360, 290)); bands[2].setAttribute('d', shape(t, 2, 250, 250)); };
  const frame = (now) => { raf = 0; if (!live || paused || reduced.matches || document.hidden) return; if (now - last > 33) { t += Math.min(0.1, (now - last) / 1000) || 0; last = now; draw(); } raf = requestAnimationFrame(frame); };
  const wake = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } };
  new IntersectionObserver((es) => { live = es[0].isIntersecting; if (live) wake(); }).observe(svg);
  document.addEventListener('visibilitychange', wake);
  draw();
  return {setPaused(v) { paused = v; if (!v) wake(); }, renderAt(time) { t = time; draw(); }};
}
