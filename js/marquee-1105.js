/* marquee-1105: the page's auto-scrolling rows and the testimonials columns.
   and so much more (three rows, left, right, left) and the heard-on logos get their hidden loop copies here; the artists
   keep theirs in the markup. The testimonials run as vertical columns, one column on a phone.
   Base speed 40 px/s, a little faster while the page scrolls. Rows pause on hover, the columns slow down.
   Everything is static under reduced motion; "pause motion" stops it through html.motion-paused in the CSS. */
(() => {
  'use strict';
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const SPEED = 40; // px per second
  const hiddenCopy = (set) => {
    const copy = set.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    copy.removeAttribute('aria-label');
    return copy;
  };

  // and so much more: one copy per row, so the CSS -50% loop is seamless
  for (const track of document.querySelectorAll('#more .config-more__track')) {
    const set = track.querySelector('.config-more__set');
    if (set) track.append(hiddenCopy(set));
  }

  // heard on: six logos are narrower than the window, so as many copies as it takes to fill it
  const logos = document.querySelector('#founder .fs1101-marquee');
  const fitLogos = () => {
    const track = logos.querySelector('.fs1101-track'), set = track.querySelector('.fs1101-logos');
    for (const copy of track.querySelectorAll('[aria-hidden="true"]')) copy.remove();
    const width = set.getBoundingClientRect().width;
    if (!width) return;
    const copies = Math.ceil(logos.clientWidth / width) + 1;
    for (let i = 0; i < copies - 1; i++) track.append(hiddenCopy(set));
    track.style.setProperty('--mq-sets', copies);
    track.style.setProperty('--mq-duration', (width / SPEED).toFixed(1) + 's');
    logos.classList.add('mq-ready');
  };

  // why producers choose: every column loops its own quotes; a phone runs all of them in one column
  const wall = document.querySelector('.producer-wall__grid');
  const columns = wall ? [...wall.querySelectorAll('.producer-wall__column')] : [];
  const quotes = columns.map((column) => [...column.querySelectorAll('.producer-quote')]);
  const phone = matchMedia('(max-width: 700px)');
  const COLUMN_SPEED = [26, 20, 23]; // px per second, so the columns never run in step
  const fitWall = () => {
    if (!wall) return;
    wall.classList.remove('pw-live');
    for (const copy of wall.querySelectorAll('.producer-quote[aria-hidden="true"]')) copy.remove();
    const layout = phone.matches ? [quotes.flat(), [], []] : quotes;
    columns.forEach((column, i) => {
      column.hidden = !layout[i].length;
      column.append(...layout[i]);
      column.style.removeProperty('--pw-sets');
    });
    wall.classList.add('pw-live');
    const windowHeight = wall.clientHeight;
    columns.forEach((column, i) => {
      if (column.hidden) return;
      const gap = parseFloat(getComputedStyle(column).rowGap) || 0;
      const setHeight = layout[i].reduce((sum, q) => sum + q.getBoundingClientRect().height + gap, 0);
      const copies = Math.ceil(windowHeight / setHeight) + 1;
      for (let c = 1; c < copies; c++) for (const q of layout[i]) column.append(hiddenCopy(q));
      column.style.setProperty('--pw-sets', copies);
      column.style.setProperty('--pw-duration', (setHeight / COLUMN_SPEED[i]).toFixed(1) + 's');
    });
  };
  if (wall) {
    const rate = (value) => { for (const column of columns) for (const a of column.getAnimations()) a.updatePlaybackRate(value); };
    wall.addEventListener('pointerenter', () => rate(.25));
    wall.addEventListener('pointerleave', () => rate(1));
    phone.addEventListener('change', fitWall);
  }

  // the rows pick up speed while the page scrolls (ref 275), in steps: changing the rate every frame would hold them still
  let lastY = scrollY, lastT = performance.now(), level = 1, idle = 0;
  const setLevel = (value) => {
    if (value === level) return;
    level = value;
    for (const track of document.querySelectorAll('.config-more__track, .tr1104__track, .fs1101-track')) for (const a of track.getAnimations()) a.updatePlaybackRate(value);
  };
  addEventListener('scroll', () => {
    const now = performance.now(), velocity = Math.abs(scrollY - lastY) / Math.max(now - lastT, 1); // px per ms
    lastY = scrollY; lastT = now;
    const target = velocity > 3 ? 2.4 : velocity > .6 ? 1.6 : 1;
    if (target > level) setLevel(target);
    clearTimeout(idle);
    idle = setTimeout(() => setLevel(1), 220);
  }, {passive: true});

  const fitAll = () => { if (logos) fitLogos(); fitWall(); };
  let resizeTimer = 0, lastWidth = innerWidth;
  addEventListener('resize', () => {
    if (innerWidth === lastWidth) return; // a phone's address bar, not a new layout
    lastWidth = innerWidth;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fitAll, 150);
  }, {passive: true});
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitAll); else fitAll();
})();
