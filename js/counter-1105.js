/* counter-1105: "6,000+" rolls its digits upward with a blur and lands on the infinity sign, once, when it comes on screen.
   The real text stays in the element, so readers and copy still get "6,000+ files today."; the reel and the sign are drawn in CSS.
   Reduced motion or "pause motion": no roll, the sign sits beside the number. */
(() => {
  'use strict';
  const el = document.querySelector('[data-counter-1105]');
  if (!el) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const number = el.textContent;
  const toggle = document.querySelector('#motion-toggle');
  const paused = () => reduced.matches || (toggle && toggle.getAttribute('aria-pressed') === 'true');

  const still = () => { el.dataset.state = 'still'; };
  if (reduced.matches || !('IntersectionObserver' in window)) { el.innerHTML = `<span class="c1105-number">${number}</span><span class="c1105-sign" aria-hidden="true"></span>`; still(); return; }

  // one column per character. Digits get a strip to roll through, ending on an empty line so everything leaves upward.
  const LINES = 14;
  const reel = [...number].map((ch, i) => {
    let strip = ch;
    if (/\d/.test(ch)) for (let n = 1; n < LINES; n++) strip += '\n' + ((Number(ch) + n * (i + 3)) % 10);
    return `<span class="c1105-col" data-strip="${strip}\n "></span>`;
  }).join('');
  el.innerHTML = `<span class="c1105-number">${number}</span><span class="c1105-reel" aria-hidden="true">${reel}</span><span class="c1105-sign" aria-hidden="true"></span>`;
  el.dataset.state = 'rest';

  const line = el.closest('.ls-heading-b__line');
  const sign = el.querySelector('.c1105-sign'), box = el.querySelector('.c1105-reel');
  const EASE = 'cubic-bezier(.16,1,.3,1)';
  const running = [];
  const run = () => {
    if (paused()) return still();
    el.dataset.state = 'rolling';
    const lineHeight = box.getBoundingClientRect().height;
    [...box.children].forEach((col, i) => {
      const rows = (col.dataset.strip.match(/\n/g) || []).length;
      running.push(col.animate({transform: ['translateY(0)', `translateY(${-rows * lineHeight}px)`]}, {duration: 1100 + i * 90, delay: 350, easing: 'cubic-bezier(.5,0,.15,1)', fill: 'both'}));
    });
    running.push(box.animate({filter: ['blur(0)', 'blur(6px)', 'blur(6px)', 'blur(0)']}, {duration: 1500, delay: 350, easing: 'linear', fill: 'both'}));
    // the sign arrives from below as the digits leave. It is narrower than the number, so the whole line eases back to centre.
    const boxWidth = el.getBoundingClientRect().width, signWidth = sign.getBoundingClientRect().width;
    const land = {duration: 650, delay: 1150, easing: EASE, fill: 'both'};
    running.push(sign.animate({opacity: [0, 1], transform: ['translateY(70%)', 'translateY(0)'], filter: ['blur(10px)', 'blur(0)']}, land));
    if (line) running.push(line.animate({transform: ['translateX(0)', `translateX(${-(boxWidth - signWidth) / 2}px)`]}, {...land, fill: 'forwards'}));
    Promise.allSettled(running.map((a) => a.finished)).then(() => { if (el.dataset.state === 'rolling') el.dataset.state = 'landed'; });
  };
  const toStill = () => {
    if (el.dataset.state === 'landed' || el.dataset.state === 'still') return;
    for (const a of running) a.cancel();
    still();
  };
  const io = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    io.disconnect();
    run();
  }, {threshold: .6});
  io.observe(el);
  if (toggle) toggle.addEventListener('click', () => { io.disconnect(); toStill(); });
  reduced.addEventListener('change', () => { if (reduced.matches) { io.disconnect(); toStill(); } });
})();
