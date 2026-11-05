/* Ref 235: 500ms ease-in-out, answer rises 8px while fading and opening.
   Semantic details remains usable without JS; user content determines final height. */
(() => {
  const items = [...document.querySelectorAll('.faq details')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const running = new WeakMap();
  function setOpen(item, opening) {
    const answer = item.querySelector('.faq-answer');
    const previous = running.get(item);
    const wasOpen = item.open, style = getComputedStyle(answer);
    const from = wasOpen ? style.maxHeight : '0px';
    const opacity = wasOpen ? style.opacity : '0';
    const transform = wasOpen ? style.transform : 'translateY(-8px)';
    const padding = wasOpen ? style.paddingTop : '0px';
    previous?.cancel();
    if (reduced.matches) { item.open = opening; delete item.dataset.expanded; return; }
    item.open = true;
    item.dataset.expanded = String(opening);
    const end = opening ? Math.max(300, answer.scrollHeight) : 0;
    const animation = answer.animate([
      { maxHeight: from === 'none' ? Math.max(300, answer.scrollHeight) + 'px' : from, paddingTop:padding, opacity, transform },
      { maxHeight:end + 'px', paddingTop:opening ? '16px' : '0px', opacity:opening ? 1 : 0, transform:opening ? 'translateY(0)' : 'translateY(-8px)' }
    ], { duration:500, easing:'ease-in-out', fill:'both' });
    running.set(item, animation);
    animation.onfinish = () => {
      item.open = opening; animation.cancel(); running.delete(item); delete item.dataset.expanded;
    };
  }
  // Manage one open item ourselves so the old answer can close with the source motion.
  items.forEach(item => {
    item.removeAttribute('name');
    item.querySelector('summary').addEventListener('click', event => {
      event.preventDefault();
      const opening = item.dataset.expanded === 'false' || (!item.open && item.dataset.expanded !== 'true');
      if (opening) items.filter(other => other !== item && other.open && other.closest('.faq') === item.closest('.faq')).forEach(other => setOpen(other, false));
      setOpen(item, opening);
    });
  });
})();
