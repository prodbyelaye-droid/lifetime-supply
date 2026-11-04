(() => {
  'use strict';
  const footer = document.querySelector('#footer.ls-footer');
  if (!footer || footer.dataset.footerSlapReady) return;
  footer.dataset.footerSlapReady = 'true';
  const scene = footer.querySelector('.footer-scene');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const blobs = [...scene.querySelectorAll('.blob')].map(button => ({button, x:0, y:0, restX:0, restY:0, moved:false, drag:null}));
  const clamp = (value, low, high) => Math.min(Math.max(value, low), Math.max(low, high));
  function move(item, x, y) {
    item.x = clamp(x, 2, scene.clientWidth - item.button.offsetWidth - 2);
    item.y = clamp(y, 2, scene.clientHeight - item.button.offsetHeight - 2);
    item.button.style.transform = `translate3d(${item.x}px,${item.y}px,0)`;
  }
  function release(item, cancel = false) {
    if (!item.drag) return;
    const drag = item.drag;
    item.drag = null;
    item.button.classList.remove('is-dragging');
    if (cancel) move(item, drag.x, drag.y);
    if (item.button.hasPointerCapture(drag.id)) item.button.releasePointerCapture(drag.id);
  }
  // Exact approved design coordinates, scaled uniformly with the live scene.
  const rests = {
    desktop: {width:1344, points:[[1150,8,150]]}, // unit L2: one brand blot, resting on the wordmark's end
    phone: {width:342, points:[[268,0,66]]}
  };
  function layout() {
    const design = innerWidth > 700 ? rests.desktop : rests.phone;
    const scale = scene.clientWidth / design.width;
    blobs.forEach((item, i) => {
      release(item, true);
      const [x,y,size] = design.points[i];
      item.button.style.setProperty('--size',size*scale+'px');
      item.restX = x*scale;
      item.restY = y*scale;
      move(item,item.moved ? item.x : item.restX,item.moved ? item.y : item.restY);
      item.button.dataset.ready = '';
    });
  }
  blobs.forEach(item => {
    const button = item.button;
    button.addEventListener('pointerdown', event => {
      if (item.drag || (event.pointerType === 'mouse' && event.button !== 0)) return;
      button.classList.add('is-touched');
      item.drag = {id:event.pointerId, clientX:event.clientX, clientY:event.clientY, x:item.x, y:item.y};
      button.setPointerCapture(event.pointerId);
      button.classList.add('is-dragging');
      button.focus({preventScroll:true});
      event.preventDefault();
    });
    button.addEventListener('pointermove', event => {
      if (!item.drag || item.drag.id !== event.pointerId) return;
      move(item, item.drag.x + event.clientX - item.drag.clientX, item.drag.y + event.clientY - item.drag.clientY);
      item.moved = true;
    });
    button.addEventListener('pointerup', event => { if (item.drag?.id === event.pointerId) release(item); });
    button.addEventListener('pointercancel', event => { if (item.drag?.id === event.pointerId) release(item, true); });
    button.addEventListener('lostpointercapture', event => { if (item.drag?.id === event.pointerId) release(item, true); });
    button.addEventListener('keydown', event => {
      const step = event.shiftKey ? 24 : 8;
      const arrows = {ArrowLeft:[-step,0], ArrowRight:[step,0], ArrowUp:[0,-step], ArrowDown:[0,step]};
      if (event.key !== 'Escape' && !arrows[event.key]) return;
      event.preventDefault();
      button.classList.add('is-touched');
      release(item, true);
      if (event.key === 'Escape') { item.moved = false; move(item, item.restX, item.restY); }
      else { item.moved = true; move(item, item.x + arrows[event.key][0], item.y + arrows[event.key][1]); }
    });
  });
  let entered = false;
  const root = document.documentElement;
  const paused = () => motion.matches || document.hidden || root.classList.contains('motion-paused') || root.hasAttribute('data-motion-paused');
  function enter() {
    if (entered) return;
    entered = true;
    if (!paused()) scene.classList.add('is-settling');
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { enter(); observer.disconnect(); }
    }, {threshold:.15});
    observer.observe(scene);
  } else enter();
  const changedMotion = () => { if (paused()) scene.classList.remove('is-settling'); };
  motion.addEventListener('change',changedMotion);
  new MutationObserver(changedMotion).observe(root,{attributes:true,attributeFilter:['class','data-motion-paused']});
  document.addEventListener('visibilitychange',changedMotion);
  window.addEventListener('blur', () => blobs.forEach(item => release(item, true)));
  if ('ResizeObserver' in window) new ResizeObserver(layout).observe(scene);
  window.addEventListener('resize',layout);
  layout();
  const toggle = footer.querySelector('#profile-toggle');
  const links = footer.querySelector('#profile-links');
  if (!toggle || !links) return; // unit L2: the profile tabs moved to js/l2-1104.js
  function closeLinks(returnFocus) {
    links.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Show profile links');
    if (returnFocus) toggle.focus({preventScroll:true});
  }
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    links.hidden = expanded;
    toggle.setAttribute('aria-expanded', String(!expanded));
    toggle.setAttribute('aria-label', expanded ? 'Show profile links' : 'Hide profile links');
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !links.hidden) closeLinks(links.contains(document.activeElement));
  });
  document.addEventListener('pointerdown', event => {
    if (!links.hidden && !toggle.parentElement.contains(event.target)) closeLinks(false);
  });
})();
