/* L2 · a day in my workflow. (row 191 features tab): one row open at a time, the field shows that row's window. No timers, no motion. */
(() => {
  const root = document.getElementById('flow');
  if (!root) return;
  const steps = [...root.querySelectorAll('.ls-step')];
  steps.forEach(li => {
    li.querySelector('button').addEventListener('click', () => {
      steps.forEach(o => {
        const on = o === li;
        o.classList.toggle('is-open', on);
        o.querySelector('button').setAttribute('aria-expanded', String(on));
        const s = root.querySelector('.ls-surf[data-step="' + o.dataset.step + '"]');
        if (s) s.classList.toggle('is-on', on);
      });
    });
  });
})();
