/* reveal-1105: the one reveal for the page. Every section's heading, text and card group fades and unblurs in once,
   as it enters the viewport: opacity, translateY 14px and blur 10px over 650 ms, 70 ms apart within a group, threshold .2.
   Runs from <head> so nothing flashes before it hides; with no script, or under reduced motion, the page is simply there.
   "pause motion" and a reduced-motion change land everything at once. Sizes and timings for the hero's load are in
   css/system-1105.css. To add a block, add its selector to a group below. */
(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches || !('IntersectionObserver' in window)) return;

  const DURATION = 650, STAGGER = 70, MAX_RANK = 6;
  const GROUPS = [
    {items: '#demo > .demo-film, #demo > .film-caption, #demo > .demo-links'},
    {items: '.portal-cue'},
    {items: '#how-the-board-works > h2, #how-the-board-works > p, #how-the-board-works > ul'},
    {items: '#inside-title, #inside .split-copy > div > p, #inside .inside-kits, #inside .blend'},
    {items: '#flow .day96-head > *'},
    {items: '#flow .day96-label, #flow .day96-what > h3, #flow .day96-what > p, #flow .day96-what > figure'},
    {items: '#stats-title, #stats .l2-stats__lead, #stats .stats-chips > li'},
    {items: '#features .mv-group'},
    {items: '#more-title, #more .config-more__rows'},
    {items: '#founder .fs1105-card, #founder .fs1101-heard'},
    {items: '#trusted-title, #trusted .tr1104__more, #trusted .tr1104__rows'},
    {items: '#producer-wall-title, .producer-wall__intro > p, .producer-wall__grid'}, // the whole window: its quotes loop inside it
    {items: '#download-title, .dl17-copy > p, .dl17-row, .dl17-copy > .dl-login'},
    {items: '#steps-title'},
    {items: '#steps .step-grid > article', stagger: 180}, // his 1, 2, 3 land one by one
    {items: '#price-h, #price .price-intro > p, #price .price-card, #price .price-includes, #price .price-worth, #price .price-faq'},
    {items: '#questions-title, #questions .faq > details, #questions .dm-line'},
    {items: '#close-title, #close .close-cta, #close .close-note'},
    {items: '#contact .contact-stage > *'},
    {items: '#footer .footer-top, #footer .footer-bottom'},
  ];

  const root = document.documentElement;
  root.classList.add('r1105');
  const hide = document.createElement('style');
  hide.textContent = `@media screen{html.r1105 :is(${GROUPS.map((g) => g.items).join(',')}):not(.r1105-in){opacity:0!important;transform:translateY(14px)!important;filter:blur(10px)!important}}`;
  document.head.append(hide);

  let io = null;
  const stop = () => { root.classList.remove('r1105'); if (io) io.disconnect(); };
  reduced.addEventListener('change', () => { if (reduced.matches) stop(); });

  const start = () => {
    const groupOf = new Map();
    for (const group of GROUPS) for (const el of document.querySelectorAll(group.items)) groupOf.set(el, group);
    // what is on screen at load comes in just behind the hero
    let lead = 200;
    const land = (list) => {
      list.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
      const ranks = new Map();
      for (const el of list) {
        const group = groupOf.get(el), rank = ranks.get(group) || 0;
        ranks.set(group, rank + 1);
        const delay = lead + Math.min(rank, MAX_RANK) * (group.stagger || STAGGER);
        el.style.setProperty('--r1105-d', delay + 'ms');
        el.classList.add('r1105-in');
        setTimeout(() => { el.classList.add('r1105-done'); el.style.removeProperty('--r1105-d'); }, DURATION + delay + 60);
      }
      lead = 0;
    };
    io = new IntersectionObserver((entries) => {
      const now = [];
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        // a block too tall to ever show 20% of itself lands as soon as it arrives
        if (e.intersectionRatio >= .2 || e.boundingClientRect.height * .2 > innerHeight * .5) { io.unobserve(e.target); now.push(e.target); }
      }
      if (now.length) land(now);
    }, {threshold: [0, .2]});
    for (const el of groupOf.keys()) io.observe(el);
    document.querySelector('#motion-toggle')?.addEventListener('click', stop);
  };
  const safeStart = () => { try { start(); } catch (e) { stop(); throw e; } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', safeStart, {once: true});
  else safeStart();
})();
