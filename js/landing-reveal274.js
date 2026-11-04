/* Text reveal 274: native port of Magic UI TextReveal (MIT License, Copyright (c) Magic UI).
   200vh track, sticky scene of 50% track height, word i opacity over [i/n,(i+1)/n] of
   progress = clamp(-trackRect.top / (trackHeight - viewportHeight), 0, 1). */
(() => {
  'use strict';

  const track = document.querySelector('[data-reveal274-track]');
  const p = track && track.querySelector('[data-text-reveal-274]');
  const scene = track && track.querySelector('#founder');
  if (!p || !scene || p.hasAttribute('data-reveal274-ready')) return;
  if (!window.matchMedia || !window.requestAnimationFrame) return;
  if (!(window.CSS && CSS.supports && CSS.supports('position', 'sticky'))) return;

  const root = document.documentElement;
  const mq = window.matchMedia('(prefers-reduced-motion: reduce), (forced-colors: active)');

  const text = p.textContent;
  const sr = document.createElement('span');
  sr.className = 'r274-sr';
  sr.textContent = text;
  const vis = document.createElement('span');
  vis.setAttribute('aria-hidden', 'true');
  const fgs = [];
  for (const token of text.split(/(\s+)/)) {
    if (!token) continue;
    if (/^\s+$/.test(token)) {
      vis.appendChild(document.createTextNode(token));
      continue;
    }
    const w = document.createElement('span');
    w.className = 'r274-w';
    const b = document.createElement('span');
    b.className = 'r274-b';
    b.textContent = token;
    const f = document.createElement('span');
    f.className = 'r274-f';
    f.textContent = token;
    w.appendChild(b);
    w.appendChild(f);
    vis.appendChild(w);
    fgs.push(f);
  }
  if (!fgs.length) return;
  p.textContent = '';
  p.appendChild(sr);
  p.appendChild(vis);
  p.setAttribute('data-reveal274-ready', '');

  const n = fgs.length;
  const last = new Array(n).fill(-1);
  let on = false;
  let raf = 0;
  let refit = true;
  let active = true;
  const clamp = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const paused = () => root.hasAttribute('data-motion-paused');

  const setOn = v => {
    if (v === on) return;
    on = v;
    track.toggleAttribute('data-reveal274-on', v);
    if (!v) {
      for (let i = 0; i < n; i++) {
        fgs[i].style.removeProperty('--r274-o');
        last[i] = -1;
      }
    }
  };

  // Pin only when the complete founder scene fits the viewport; otherwise stay static.
  const fit = () => {
    if (mq.matches) return setOn(false);
    if (on) {
      if (scene.scrollHeight > scene.clientHeight + 1) setOn(false);
    } else if (scene.offsetHeight <= root.clientHeight) {
      setOn(true);
    }
  };

  const paint = () => {
    if (!on || paused()) return;
    const r = track.getBoundingClientRect();
    const range = r.height - window.innerHeight;
    const progress = range > 0 ? clamp(-r.top / range) : 1;
    for (let i = 0; i < n; i++) {
      const o = Math.round(clamp(progress * n - i) * 1000) / 1000;
      if (o !== last[i]) {
        last[i] = o;
        fgs[i].style.setProperty('--r274-o', String(o));
      }
    }
  };

  const run = () => {
    raf = 0;
    if (!active) return;
    if (refit) {
      refit = false;
      fit();
    }
    paint();
  };
  const schedule = () => {
    if (!raf && active && !document.hidden) raf = window.requestAnimationFrame(run);
  };
  const resize = () => {
    refit = true;
    schedule();
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', resize);
  window.addEventListener('pagehide', () => {
    active = false;
    if (raf) window.cancelAnimationFrame(raf);
    raf = 0;
  });
  window.addEventListener('pageshow', () => {
    active = true;
    resize();
  });
  if (mq.addEventListener) mq.addEventListener('change', resize);
  else if (mq.addListener) mq.addListener(resize);
  if ('MutationObserver' in window) {
    new MutationObserver(schedule).observe(root, { attributes: true, attributeFilter: ['data-motion-paused'] });
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(resize);
  resize();
})();
