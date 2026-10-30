/* 073: progressively enhanced product tabs.
   102 (critic 101 §1.6): the pictures crossfade in place (180ms, css/hero-094.css) and one tab shape
   slides under the labels (200ms). Nothing else moves. Without this script all three pictures stay listed. */
(() => {
  const root = document.querySelector('.portal-preview');
  if (!root) return;
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
  if (!tabs.length || panels.some(panel => !panel)) return;
  const list = root.querySelector('[role="tablist"]');
  const ink = root.querySelector('.tab-ink');
  let current = 0;
  const place = () => {
    if (!ink) return;
    const tab = tabs[current];
    list.style.setProperty('--ink-x', tab.offsetLeft + 'px');
    list.style.setProperty('--ink-w', tab.offsetWidth + 'px');
    list.style.setProperty('--ink-h', (tab.offsetHeight + 1) + 'px');
  };
  const select = (index, focus = false) => {
    const previous = current;
    current = index;
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = false;
      panels[i].classList.toggle('is-active', i === index);
      panels[i].classList.toggle('is-leaving', i === previous && i !== index);
    });
    place();
    if (focus) tabs[index].focus({preventScroll:true});
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(i));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      select(next, true);
    });
  });
  root.dataset.enhanced = 'true';
  select(0);
  // The first placement and any resize jump straight to place; only a tab change slides.
  if ('ResizeObserver' in window) new ResizeObserver(() => {
    delete root.dataset.inkReady; place();
    requestAnimationFrame(() => requestAnimationFrame(() => { root.dataset.inkReady = ''; }));
  }).observe(list);
  else requestAnimationFrame(() => { root.dataset.inkReady = ''; });
})();
