/* LANDING4 (5 Nov): the hero window is the portal itself. Owner 00:15 "the interactive portal on the landing page 1:1"; 00:29 "we need
   to have this sign-in screen too" and "some sort of showcase on the landing page for the light and dark mode".
   Built from captures of the signed-off portal (js/l4-portal-data.js), not an iframe and not re-coded UI. It opens on the sign-in
   screen; "log in" opens home; the sidebar's own items swap pages (quick crossfade); the content column scrolls inside the window
   once a visitor has used it; the portal's own theme switches (the moon on the sign-in bar, the theme row in the account menu) flip
   the whole window between the light and dark captures with the portal's circular reveal (ref 270: a circle clip from the switch,
   400 ms ease-in-out). The landing itself stays light. Short auto-play once in view: light, dark, light, then log in.
   Reduced motion or "pause motion": no auto-play, instant swaps. Phone: a pill row under the window. */
(() => {
  const D = window.L4P, root = document.querySelector('[data-l4]');
  if (!D || !root) return;
  const stage = root.querySelector('.l4-stage'), view = root.querySelector('.l4-view'), hots = root.querySelector('.l4-hots');
  const say = root.querySelector('.l4-live'), crumb = document.querySelector('.portal-preview .hw-now'), pills = document.querySelector('.l4-pills');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const held = () => reduce.matches || document.documentElement.hasAttribute('data-motion-paused');
  const st = { page: 'login', theme: 'light', menu: false, busy: false, queued: null, touched: false, timer: 0 };
  const pct = (v, t) => (v / t * 100) + '%';
  const box = (el, r) => { el.style.left = pct(r[0], D.W); el.style.top = pct(r[1], D.H); el.style.width = pct(r[2], D.W); el.style.height = pct(r[3], D.H); return el; };
  const mid = (r) => (r ? [r[0] + r[2] / 2, r[1] + r[3] / 2] : null);
  const other = () => (st.theme === 'light' ? 'dark' : 'light');
  const label = (p) => D.label[p] || p;
  // 1x (1192 px) or 2x (2384 px) pictures, by the window's real pixel width
  const url = (n) => D.base + n + (stage.clientWidth * (window.devicePixelRatio || 1) > 1300 ? '@2x' : '') + '.webp';
  const cache = new Map();
  const fetchImg = (n) => {
    const u = url(n);
    if (!cache.has(u)) {
      const im = new Image(); im.decoding = 'async'; im.src = u;
      cache.set(u, (im.decode ? im.decode() : new Promise((r, j) => { im.onload = r; im.onerror = j; })).then(() => u, () => u));
    }
    return cache.get(u);
  };
  const parts = (p, t) => { const P = D.pages[p]; if (!P) return []; return P.full ? [`${p}-${t}-full`] : [`${p}-${t}-body`, `${p}-${t}-side`].concat(P.top > 0 ? [`${p}-${t}-top`] : []); };
  const ready = (p, t) => Promise.all(parts(p, t).map(fetchImg));
  const pic = (n, cls, alt) => { const i = new Image(); i.className = cls; i.alt = alt || ''; i.decoding = 'async'; i.draggable = false; i.src = url(n); return i; };
  const screen = (p, t) => {
    const P = D.pages[p], s = document.createElement('div'), alt = `the portal: ${label(p)}, ${t} mode`;
    s.className = 'l4-screen'; s.dataset.page = p; s.dataset.theme = t;
    if (P.full) { s.append(pic(`${p}-${t}-full`, 'l4-full', alt)); return s; }
    const sc = box(document.createElement('div'), [P.x0, P.top, D.W - P.x0, D.H - P.top]); sc.className = 'l4-scroll';
    const b = pic(`${p}-${t}-body`, 'l4-body', alt); b.width = D.W - P.x0; b.height = P.bh[t]; sc.append(b);
    s.append(sc, box(pic(`${p}-${t}-side`, 'l4-part'), [0, 0, P.x0, D.H]));
    if (P.top > 0) s.append(box(pic(`${p}-${t}-top`, 'l4-part'), [P.x0, 0, D.W - P.x0, P.top]));
    return s;
  };
  const touch = () => { if (st.touched) return; st.touched = true; clearTimeout(st.timer); stage.dataset.live = ''; };
  // ---- the account menu (where the portal keeps its theme switch): its own capture over the sidebar
  const menuLayer = document.createElement('div'); menuLayer.className = 'l4-menu'; menuLayer.hidden = true; stage.insertBefore(menuLayer, hots);
  const closeMenu = (refocus) => {
    if (!st.menu) return; st.menu = false; menuLayer.hidden = true; menuLayer.textContent = ''; paint();
    if (refocus) { const s = hots.querySelector('[data-k="menu"]'); if (s) s.focus({ preventScroll: true }); }
  };
  const openMenu = (kb) => {
    const M = D.menu && D.menu[st.theme]; if (!M) return;
    st.menu = true; menuLayer.textContent = ''; menuLayer.append(box(pic(`menu-${st.theme}`, 'l4-part'), M.box)); menuLayer.hidden = false; paint();
    if (kb) { const f = hots.querySelector('[data-k^="m-"]'); if (f) f.focus({ preventScroll: true }); }
  };
  // ---- page / theme changes
  const show = async (p, t, how, from) => {
    if (!D.pages[p]) return;
    if (st.busy) { st.queued = [p, t, how, from]; return; }
    st.busy = true; if (st.menu) { st.menu = false; menuLayer.hidden = true; menuLayer.textContent = ''; }
    const old = view.querySelector('.l4-screen.is-on'), osc = old && old.querySelector('.l4-scroll');
    const keep = how === 'reveal' && old && old.dataset.page === p && osc ? osc.scrollTop / osc.clientWidth : 0;
    await ready(p, t);
    const s = screen(p, t); view.append(s);
    const sc = s.querySelector('.l4-scroll'); if (sc && keep) sc.scrollTop = keep * sc.clientWidth;
    if (old) old.classList.remove('is-on'); s.classList.add('is-on');
    st.page = p; st.theme = t; stage.dataset.page = p; stage.dataset.theme = t; paint(true);
    let a = null;
    if (old && !held()) {
      if (how === 'reveal') {
        const w = stage.clientWidth, h = stage.clientHeight, o = from ? [from[0] * w / D.W, from[1] * h / D.H] : [w / 2, h / 2];
        const r = Math.hypot(Math.max(o[0], w - o[0]), Math.max(o[1], h - o[1]));
        a = s.animate({ clipPath: [`circle(0px at ${o[0]}px ${o[1]}px)`, `circle(${r}px at ${o[0]}px ${o[1]}px)`] }, { duration: 400, easing: 'ease-in-out' });
      } else a = s.animate({ opacity: [0, 1] }, { duration: 180, easing: 'cubic-bezier(0,0,.2,1)' });
    }
    if (a) await a.finished.catch(() => {});
    view.querySelectorAll('.l4-screen:not(.is-on)').forEach((x) => x.remove());
    st.busy = false;
    if (st.queued) { const q = st.queued; st.queued = null; show(...q); }
  };
  const flip = (r) => show(st.page, other(), 'reveal', mid(r));
  const themeOrigin = () => { const P = D.pages[st.page]; if (P.full) return P.toggle && P.toggle[st.theme]; const M = D.menu && D.menu[st.theme]; return M && M.summary; };
  // ---- hotspots: measured rects of the real sidebar, sign-in button, theme switches
  const paint = (changed) => {
    const P = D.pages[st.page], t = st.theme, a = document.activeElement, fk = a && hots.contains(a) ? a.dataset.k : null;
    hots.textContent = '';
    const add = (k, r, name, fn, opts = {}) => {
      if (!r) return null;
      const b = box(document.createElement('button'), r); b.type = 'button'; b.className = 'l4-hot'; b.dataset.k = k; b.setAttribute('aria-label', name);
      if (opts.cur) b.setAttribute('aria-current', 'page');
      if (opts.expanded !== undefined) { b.setAttribute('aria-expanded', String(opts.expanded)); b.setAttribute('aria-haspopup', 'menu'); }
      if (opts.pre) { b.addEventListener('pointerenter', opts.pre); b.addEventListener('focus', opts.pre); }
      b.addEventListener('click', (e) => { touch(); fn(e); });
      hots.append(b); return b;
    };
    if (st.menu) {
      const M = D.menu[t];
      M.items.forEach((it, i) => add(`m-${i}`, it.r, it.do === 'theme' ? `theme: switch the portal to ${other()} mode` : it.do === 'login' ? 'log out (back to the sign-in screen)' : `open ${label(it.do)}`,
        () => (it.do === 'theme' ? flip(it.r) : show(it.do, t, 'fade')), { pre: () => (it.do === 'theme' ? ready(st.page, other()) : ready(it.do === 'login' ? 'login' : it.do, t)) }));
      add('menu', M.summary, 'close the account menu', () => closeMenu(true), { expanded: true });
    } else {
      (P.hots[t] || []).forEach((h, i) => add(`go-${h.go}-${i}`, h.r, st.page === 'login' ? 'log in to the portal' : `open ${label(h.go)}`,
        () => (h.go === st.page ? null : show(h.go, t, 'fade')), { cur: h.go === st.page && !P.full, pre: () => ready(h.go, t) }));
      if (P.full) add('theme', P.toggle && P.toggle[t], `switch the portal to ${other()} mode`, () => flip(P.toggle[t]), { pre: () => ready(st.page, other()) });
      else if (D.menu && D.menu[t]) add('menu', D.menu[t].summary, 'open the account menu (theme switch inside)', (e) => openMenu(e.detail === 0), { expanded: false, pre: () => fetchImg(`menu-${t}`) });
    }
    if (fk) { const f = hots.querySelector(`[data-k="${fk}"]`) || (fk.startsWith('go-') && hots.querySelector(`[data-k^="go-${fk.split('-')[1]}-"]`)); if (f) f.focus({ preventScroll: true }); }
    if (changed) {
      if (crumb) crumb.textContent = label(st.page);
      if (say) say.textContent = `${label(st.page)}, ${t} mode`;
      if (pills) {
        pills.querySelectorAll('[data-go]').forEach((b) => { if (b.dataset.go === st.page) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
        const tb = pills.querySelector('.l4-pill-theme'); if (tb) { tb.textContent = `${other()} mode`; tb.setAttribute('aria-pressed', String(t === 'dark')); }
        const cur = pills.querySelector('[aria-current]');
        if (cur && pills.offsetParent && pills.scrollWidth > pills.clientWidth) pills.scrollTo({ left: Math.max(0, cur.offsetLeft - 48), behavior: held() ? 'auto' : 'smooth' });
      }
    }
  };
  stage.addEventListener('keydown', (e) => { if (e.key === 'Escape' && st.menu) { e.preventDefault(); closeMenu(true); } });
  stage.addEventListener('click', (e) => { if (st.menu && !e.target.closest('.l4-hot')) closeMenu(false); });
  stage.addEventListener('pointerdown', touch, { passive: true });
  // ---- phone: the pages as the landing's pill row, plus the theme switch
  if (pills) {
    const mk = (txt, cls, fn) => { const b = document.createElement('button'); b.type = 'button'; b.className = cls; b.textContent = txt; b.addEventListener('click', () => { touch(); fn(); }); pills.append(b); return b; };
    const tb = mk('dark mode', 'l4-pill l4-pill-theme', () => flip(themeOrigin())); tb.setAttribute('aria-pressed', 'false');
    D.order.forEach((p) => { const b = mk(label(p), 'l4-pill', () => show(p, st.theme, 'fade')); b.dataset.go = p; });
    pills.hidden = false;
  }
  paint(true);
  // ---- the showcase: once, when the window is well in view
  const play = () => {
    if (held() || st.touched) return;
    const T = D.pages.login.toggle || {};
    const steps = [[1400, () => show('login', 'dark', 'reveal', mid(T.light))], [2200, () => show('login', 'light', 'reveal', mid(T.dark))], [1500, () => show('home', 'light', 'fade')]];
    ready('login', 'dark'); ready('home', 'light');
    let i = 0;
    const next = () => { if (i >= steps.length) return; const [ms, fn] = steps[i++]; st.timer = setTimeout(() => { if (st.touched || held() || document.hidden) return; fn(); next(); }, ms); };
    next();
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); play(); } }, { threshold: 0.6 });
    io.observe(stage);
  }
})();
