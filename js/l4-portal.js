/* LANDING4 (5 Nov): the hero window is the portal itself. Owner 00:15 "the interactive portal on the landing page 1:1"; 00:29 "we need
   to have this sign-in screen too" and "some sort of showcase on the landing page for the light and dark mode".
   Built from captures of the signed-off portal (js/l4-portal-data.js), not an iframe and not re-coded UI. It opens on the sign-in
   screen; "log in" opens home; the sidebar's own items swap pages (quick crossfade); the content column scrolls inside the window
   once a visitor has used it; the portal's own theme switches (the moon on the sign-in bar, the theme row in the account menu) flip
   the whole window between the light and dark captures with the portal's circular reveal (ref 270: a circle clip from the switch,
   400 ms ease-in-out). The landing itself stays light. Short auto-play once in view: light, dark, light, then log in.
   Reduced motion or "pause motion": no auto-play, instant swaps. Phone: a pill row under the window.
   window-v2 (5 Nov, owner 12:46): a cue by "log in" (no auto log-in now, so the cue gets to do its job); the toggle in the title bar with a
   one-time "try dark mode." after sign-in; first sign-in = the portal's own hello splash (components/assembly/blot/hello-splash.tsx + blot.css:
   words rise 8 px, .32 s, cubic-bezier(.22,1,.36,1), 70 ms apart; leaves with a .32 s fade; the real blot engine, js/l4-portal-hello.js,
   loaded only when it's needed), then home's text and blots come in with the portal's own entrances (ls-route-in .24 s cubic-bezier(.23,1,.32,1);
   h2-card-in .24 s cubic-bezier(.22,1,.36,1), 30 ms apart), cut from the home capture so nothing extra loads. */
(() => {
  const D = window.L4P, root = document.querySelector('[data-l4]');
  if (!D || !root) return;
  const stage = root.querySelector('.l4-stage'), view = root.querySelector('.l4-view'), hots = root.querySelector('.l4-hots');
  const say = root.querySelector('.l4-live'), crumb = document.querySelector('.portal-preview .hw-now'), pills = document.querySelector('.l4-pills');
  const preview = root.closest('.portal-preview'), bar = preview.querySelector('.computer-titlebar'), tgl = bar.querySelector('.l4-theme');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const held = () => reduce.matches || document.documentElement.hasAttribute('data-motion-paused');
  const st = { page: 'login', theme: 'light', menu: false, busy: false, queued: null, touched: false, timer: 0, hello: null, greeted: false, hinted: false, fade: null };
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
  // ---- first sign-in: home's text and blots, cut from the home capture (no extra pictures), waiting under the pop-up
  const firstHome = (s, t) => {
    const P = D.pages.home, F = D.first, sc = s.querySelector('.l4-scroll'), b = sc && sc.querySelector('.l4-body');
    if (!F || !b) return null;
    const bw = D.W - P.x0, bh = P.bh[t], u = url(`home-${t}-body`);
    const wrap = document.createElement('div'); wrap.className = 'l4-first'; wrap.style.background = F.bg[t]; wrap.style.aspectRatio = `${bw} / ${bh}`;
    const cut = (r) => { const e = document.createElement('div'), [x, y, w, h] = r; e.className = 'l4-cut';
      e.style.cssText = `left:${x / bw * 100}%;top:${y / bh * 100}%;width:${w / bw * 100}%;height:${h / bh * 100}%;background-image:url("${u}");background-size:${bw / w * 100}% ${bh / h * 100}%;background-position:${x / (bw - w || 1) * 100}% ${y / (bh - h || 1) * 100}%`;
      wrap.append(e); return e; };
    const pad = (r, p) => [Math.max(0, r[0] - p), Math.max(0, r[1] - p), r[2] + 2 * p, r[3] + 2 * p];
    const tiles = F.tiles.map((r) => pad(r, 2)), hd = [tiles[0][0], F.head[1] - 8, tiles[3][0] + tiles[3][2] - tiles[0][0], F.head[3] + 16];
    const last = tiles[7], lo = last[1] + last[3], hi = last[0] + last[2];
    // what never fades: the page's top bar, its edges and whatever sits below the tiles
    cut([0, 0, bw, hd[1]]); cut([0, hd[1], tiles[0][0], lo - hd[1]]); cut([hi, hd[1], bw - hi, lo - hd[1]]); cut([0, lo, bw, bh - lo]);
    const head = cut(hd), cards = tiles.map(cut); [head, ...cards].forEach((e) => { e.style.opacity = '0'; });
    b.style.visibility = 'hidden'; sc.append(wrap);
    return () => {
      const k = stage.clientWidth / D.W, rise = `translateY(${6 * k}px)`, kf = { opacity: [0, 1], transform: [rise, 'none'] };
      const done = () => { b.style.visibility = ''; wrap.remove(); };
      if (held()) return done();
      const an = [head.animate(kf, { duration: 240, easing: 'cubic-bezier(.23,1,.32,1)', fill: 'backwards' })]
        .concat(cards.map((e, i) => e.animate(kf, { duration: 240, delay: i * 30, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' })));
      [head, ...cards].forEach((e) => { e.style.opacity = ''; });
      Promise.all(an.map((a) => a.finished)).then(done, () => {});
    };
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
    st.fade = how === 'first' && !held() ? firstHome(s, t) : null;
    if (old) old.classList.remove('is-on'); s.classList.add('is-on');
    st.page = p; st.theme = t; stage.dataset.page = p; stage.dataset.theme = t; paint(true);
    let a = null, ghost = null;
    if (old && !held()) {
      if (how === 'reveal') {
        const w = stage.clientWidth, h = stage.clientHeight, o = from ? [from[0] * w / D.W, from[1] * h / D.H] : [w / 2, h / 2];
        const r = Math.hypot(Math.max(o[0], w - o[0]), Math.max(o[1], h - o[1]));
        const opt = { duration: 400, easing: 'ease-in-out' };
        a = s.animate({ clipPath: [`circle(0px at ${o[0]}px ${o[1]}px)`, `circle(${r}px at ${o[0]}px ${o[1]}px)`] }, opt);
        // the same circle carries on across the title bar, so the flip reads as one reveal over the whole window
        if (bar.dataset.l4Bar !== t) {
          const bh = bar.offsetHeight, y = o[1] + bh, R = Math.hypot(Math.max(o[0], w - o[0]), Math.max(y, bh - y));
          ghost = bar.cloneNode(true); ghost.classList.add('l4-bar-ghost'); ghost.dataset.l4Bar = t; ghost.setAttribute('aria-hidden', 'true'); ghost.inert = true; preview.append(ghost);
          ghost.animate({ clipPath: [`circle(0px at ${o[0]}px ${y}px)`, `circle(${R}px at ${o[0]}px ${y}px)`] }, opt);
        }
      } else if (how !== 'first') a = s.animate({ opacity: [0, 1] }, { duration: 180, easing: 'cubic-bezier(0,0,.2,1)' });
    }
    preview.dataset.l4Theme = t;
    if (a) await a.finished.catch(() => {});
    bar.dataset.l4Bar = t; if (ghost) ghost.remove();
    view.querySelectorAll('.l4-screen:not(.is-on)').forEach((x) => x.remove());
    st.busy = false;
    if (st.queued) { const q = st.queued; st.queued = null; show(...q); }
  };
  const flip = (r) => show(st.page, other(), 'reveal', mid(r));
  // the title-bar switch sits above the stage: its centre in the capture's px (y is negative, the circle starts up in the bar)
  const barPoint = () => { const a = tgl.getBoundingClientRect(), b = stage.getBoundingClientRect(); return [(a.left + a.width / 2 - b.left) / b.width * D.W, (a.top + a.height / 2 - b.top) / b.height * D.H]; };
  const themeOrigin = () => { const P = D.pages[st.page]; if (P.full) return P.toggle && P.toggle[st.theme]; const M = D.menu && D.menu[st.theme]; return M && M.summary; };
  // ---- hotspots: measured rects of the real sidebar, sign-in button, theme switches
  const paint = (changed) => {
    const P = D.pages[st.page], t = st.theme, a = document.activeElement, fk = a && hots.contains(a) ? a.dataset.k : null;
    hots.textContent = '';
    const name = t === 'light' ? 'switch the portal to dark mode' : 'switch the portal to light mode';
    tgl.setAttribute('aria-label', name); tgl.title = name;
    cue.toggleAttribute('data-on', st.page === 'login' && !st.hello);
    if (st.hello) { if (crumb) crumb.textContent = label('home'); return; }
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
      (P.hots[t] || []).forEach((h, i) => { const hb = add(`go-${h.go}-${i}`, h.r, st.page === 'login' ? 'log in to the portal' : `open ${label(h.go)}`,
        () => (st.page === 'login' ? enter() : h.go === st.page ? null : show(h.go, t, 'fade')), { cur: h.go === st.page && !P.full, pre: () => { ready(h.go, t); if (st.page === 'login' && !st.greeted) engine().then((E) => E.blotField()).catch(() => {}); } });
        if (st.page === 'login') hb.setAttribute('aria-describedby', cue.id); });
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
  stage.addEventListener('keydown', (e) => { if (e.key !== 'Escape') return; if (st.hello) { e.preventDefault(); st.hello.close(); } else if (st.menu) { e.preventDefault(); closeMenu(true); } });
  stage.addEventListener('click', (e) => { if (st.menu && !e.target.closest('.l4-hot')) closeMenu(false); });
  stage.addEventListener('pointerdown', touch, { passive: true });
  // ---- phone: the pages as the landing's pill row, plus the theme switch
  if (pills) {
    const mk = (txt, cls, fn) => { const b = document.createElement('button'); b.type = 'button'; b.className = cls; b.textContent = txt; b.addEventListener('click', () => { touch(); fn(); }); pills.append(b); return b; };
    const tb = mk('dark mode', 'l4-pill l4-pill-theme', () => { unhint(); flip(themeOrigin()); }); tb.setAttribute('aria-pressed', 'false');
    D.order.forEach((p) => { const b = mk(label(p), 'l4-pill', () => { if (st.hello) return; if (st.page === 'login') enter(); else show(p, st.theme, 'fade'); }); b.dataset.go = p; });
    pills.hidden = false;
  }
  // ---- the cues: by "log in", and one time by the title-bar switch after sign-in
  const tip = (cls, text, host) => { const p = document.createElement('p'); p.className = `l4-tip ${cls}`; p.textContent = text; host.append(p); return p; };
  const cue = tip('l4-cue', "click log in to look around. it's a demo, nothing is sent.", stage); cue.id = 'l4-cue';
  const hint = tip('l4-hint', 'try dark mode.', preview);
  const unhint = () => { st.hinted = true; clearTimeout(hint.t); hint.removeAttribute('data-on'); };
  const showHint = () => { if (st.hinted) return; st.hinted = true; hint.setAttribute('data-on', ''); hint.t = setTimeout(unhint, 9000); };
  tgl.addEventListener('click', () => { touch(); unhint(); show(st.page, other(), 'reveal', barPoint()); });
  // ---- first sign-in: the portal's own hello splash, then home's text and blots
  let engineP = null;
  const engine = () => (engineP = engineP || new Promise((res, rej) => { if (window.L4Blot) return res(window.L4Blot); const s = document.createElement('script'); s.src = 'js/l4-portal-hello.js'; s.onload = () => res(window.L4Blot); s.onerror = rej; document.head.append(s); }));
  const hello = () => {
    const el = document.createElement('div'), kb = document.activeElement && hots.contains(document.activeElement);
    el.className = 'l4-bh'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-labelledby', 'l4-bh-title'); el.tabIndex = -1;
    el.innerHTML = '<div class="bh-field" aria-hidden="true"></div><span class="bh-logo">lifetime supply</span><div class="bs-slot" aria-hidden="true"><canvas></canvas></div><h2 id="l4-bh-title" class="bh-title">hi there</h2><p class="bh-line">your board is ready.</p><button type="button" class="bh-go">let\u2019s go</button>';
    const fit = () => { const w = stage.clientWidth, h = stage.clientHeight, small = w < 600, k = small ? w / 520 : w / D.W; el.classList.toggle('is-small', small); el.style.width = `${w / k}px`; el.style.height = `${h / k}px`; el.style.transform = `scale(${k})`; };
    fit(); const ro = 'ResizeObserver' in window ? new ResizeObserver(fit) : null; if (ro) ro.observe(stage);
    let stop = null, gone = false, closing = false;
    const slot = el.querySelector('.bs-slot'), canvas = el.querySelector('canvas');
    const still = (E) => { if (!E || slot.querySelector('svg')) return; slot.dataset.still = '1'; slot.insertAdjacentHTML('beforeend', `<svg class="bs-still" viewBox="0 0 256 256"><g transform="translate(128 128) scale(.7) translate(-128 -128)"><path d="${E.BLOT_PATH}" fill="${E.SPLASH_FILL}"/>${E.EYE_SVG_RECTS.map((r) => `<rect x="${r.x}" y="${r.y}" width="${r.width}" height="${r.height}" rx="${r.rx}" ry="${r.ry}" fill="#fff"/>`).join('')}</g></svg>`); };
    // the blot starts once the pop-up's own fade has run, so its first frame never stalls the fade; it comes in softly (.2 s)
    const after = (v) => new Promise((r) => setTimeout(() => r(v), held() ? 0 : 200));
    engine().then((E) => E.blotField().then(after).then((f) => {
      if (gone) return;
      const b = new E.Blot(canvas, f, { seed: 1, fill: E.SPLASH_FILL, wink: 'loop', size: 0.95, floatAmp: 0.012, eyeScale: E.EYE_SCALE.splash, still: held() }, E.rand());
      if (b.dead) return still(E);
      b.nextBlink = 1e9; stop = E.runScene(el, [b], () => {}, held()); slot.dataset.live = '1';
      // "pause motion" pressed while it's up: the flat blot holds still
      const mo = new MutationObserver(() => { if (held() && stop) { stop(); stop = null; still(E); mo.disconnect(); } }); mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion-paused'] }); el.mo = mo;
    })).catch(() => {});
    const close = async () => {
      if (closing) return; closing = true;
      const inside = el.contains(document.activeElement);
      await ready('home', st.theme);
      while (st.busy) await new Promise((r) => setTimeout(r, 40));   // a theme flip still running
      await show('home', st.theme, 'first');
      st.hello = null; delete stage.dataset.hello; paint(true);
      if (inside) { const f = hots.querySelector('[data-k^="go-home-"][aria-current]') || hots.querySelector('.l4-hot'); if (f) f.focus({ preventScroll: true }); }
      const end = () => { gone = true; if (ro) ro.disconnect(); if (el.mo) el.mo.disconnect(); if (stop) stop(); el.remove(); };
      const go = () => { const f = st.fade; st.fade = null; if (f) f(); };
      if (held()) { go(); end(); setTimeout(showHint, 0); return; }
      el.classList.add('is-leaving');   // the splash's own leave: .32 s, in place
      setTimeout(go, 200); setTimeout(end, 340); setTimeout(showHint, 900);
    };
    el.querySelector('button').addEventListener('click', close);
    st.hello = { close }; stage.dataset.hello = ''; stage.insertBefore(el, hots); paint(true);
    if (say) say.textContent = 'hi there. your board is ready.';
    if (!held()) { el.classList.add('is-in'); el.animate({ opacity: [0, 1] }, { duration: 180, easing: 'cubic-bezier(0,0,.2,1)' }); }
    const fb = el.querySelector('button'); (kb ? fb : el).focus({ preventScroll: true });
  };
  const enter = () => { touch(); if (st.greeted) return show('home', st.theme, 'fade'); st.greeted = true; ready('home', st.theme); hello(); };
  void cue.offsetHeight;   // so the cue's own transition runs on load
  paint(true);
  // ---- the showcase: once, when the window is well in view
  const play = () => {
    if (held() || st.touched) return;
    const T = D.pages.login.toggle || {};
    const steps = [[1400, () => show('login', 'dark', 'reveal', mid(T.light))], [2200, () => show('login', 'light', 'reveal', mid(T.dark))]];
    setTimeout(() => { if (!st.touched && !held()) ready('login', 'dark'); }, 700);
    let i = 0;
    const next = () => { if (i >= steps.length) return; const [ms, fn] = steps[i++]; st.timer = setTimeout(() => { if (st.touched || held() || document.hidden || st.page !== 'login') return; fn(); next(); }, ms); };
    next();
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); play(); } }, { threshold: 0.6 });
    io.observe(stage);
  }
})();
