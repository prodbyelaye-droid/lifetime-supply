/* The hero window is the portal itself, from captures of the signed-off portal (js/l4-portal-data.js, 1280x800), not an iframe and not re-coded UI.
   Owner 5 Nov 00:15 "the interactive portal on the landing page 1:1", 12:46 "full interactive portal", 15:15 the Mac menu bar, the cue order, the size, streamers.
   It opens on the sign-in screen. "log in" plays the portal's first sign-in: the hello splash (components/assembly/blot/hello-splash.tsx + blot.css: words rise 8 px,
   .32 s, cubic-bezier(.22,1,.36,1), 70 ms apart; leaves with a .32 s fade; the real blot engine, js/l4-portal-hello.js, loaded only when it's needed), then the streamers
   (confetti.ts) and home's text and blots coming in with the portal's own entrances (ls-route-in .24 s cubic-bezier(.23,1,.32,1); h2-card-in .24 s cubic-bezier(.22,1,.36,1),
   30 ms apart), cut from the home capture so nothing extra loads. One cue at a time: log in, then the briefs, then dark mode.
   The sidebar, and whatever a page offers inside it, swap screens with a quick crossfade; the theme switch flips the window with the portal's circular reveal (ref 270:
   his 21st.dev Animated Theme Toggler: a circle clip from the switch, 700 ms ease-in-out). The sidebar blob's eyes follow the pointer (brand-blot.tsx). The landing itself stays light.
   Short auto-play once in view: light, dark, light, on the sign-in screen only. Reduced motion or "pause motion": no auto-play, instant swaps.
   Phone: pill rows under the window, the pages and then what the current page offers. */
(() => {
  const D = window.L4P, root = document.querySelector('[data-l4]');
  if (!D || !root) return;
  const stage = root.querySelector('.l4-stage'), view = root.querySelector('.l4-view'), hots = root.querySelector('.l4-hots'), say = root.querySelector('.l4-live');
  const preview = root.closest('.portal-preview'), bar = preview.querySelector('.computer-titlebar'), tgl = bar.querySelector('.l4-theme'), crumb = preview.querySelector('.hw-now');
  const pills = document.querySelector('.l4-pills'), macbar = preview.querySelector('.l4-macbar');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const held = () => reduce.matches || document.documentElement.hasAttribute('data-motion-paused');
  const st = { page: 'login', theme: 'light', menu: false, busy: false, queued: null, touched: false, timer: 0, hello: null, greeted: false, fade: null, flow: null, flowT: 0, darkTried: false };
  const pct = (v, t) => (v / t * 100) + '%';
  const box = (el, r) => { el.style.left = pct(r[0], D.W); el.style.top = pct(r[1], D.H); el.style.width = pct(r[2], D.W); el.style.height = pct(r[3], D.H); return el; };
  const mid = (r) => (r ? [r[0] + r[2] / 2, r[1] + r[3] / 2] : null);
  const other = () => (st.theme === 'light' ? 'dark' : 'light');
  const label = (p) => D.label[p] || p;
  const div = (cls) => { const e = document.createElement('div'); e.className = cls; return e; };
  const navHots = (P) => (P.full ? P.hots : (D.nav[P.nav] || {}).hots) || [];
  // pictures sized for the window's real pixel width
  const url = (n) => D.base + n + (stage.clientWidth * (window.devicePixelRatio || 1) > 1150 ? '@2x' : '') + '.webp';
  const cache = new Map();
  const fetchImg = (n) => {
    const u = url(n);
    if (!cache.has(u)) {
      const im = new Image(); im.decoding = 'async'; im.src = u;
      cache.set(u, (im.decode ? im.decode() : new Promise((r, j) => { im.onload = r; im.onerror = j; })).then(() => u, () => u));
    }
    return cache.get(u);
  };
  const parts = (p, t) => { const P = D.pages[p]; if (!P) return []; return P.full ? [`${p}-${t}-full`] : [`${p}-${t}-body`, `${P.nav}-${t}-side`].concat(P.top > 0 ? [`${p}-${t}-top`] : []); };
  const ready = (p, t) => Promise.all(parts(p, t).map(fetchImg));
  const pic = (n, cls, alt) => { const i = new Image(); i.className = cls; i.alt = alt || ''; i.decoding = 'async'; i.draggable = false; i.src = url(n); return i; };
  // ---- the sidebar blob: the same flat blot, drawn over its own picture so its eyes can follow the pointer (brand-blot.tsx: 1.5 px at most, easing to 0 within 48 px)
  const BLOT = 'M 113.000 17.000 C 119.970 15.640 120.240 15.640 125.000 17.000 C 129.760 18.360 135.390 23.300 141.000 25.000 C 146.610 26.700 146.950 21.900 158.000 27.000 C 169.050 32.100 193.760 45.480 206.000 55.000 C 218.240 64.520 224.050 73.650 230.000 83.000 C 235.950 92.350 238.790 99.800 241.000 110.000 C 243.210 120.200 244.870 132.290 243.000 143.000 C 241.130 153.710 240.200 159.910 230.000 173.000 C 219.800 186.090 196.600 208.950 183.000 220.000 C 169.400 231.050 165.130 236.130 150.000 238.000 C 134.870 239.870 108.620 234.570 94.000 231.000 C 79.380 227.430 72.330 221.930 64.000 217.000 C 55.670 212.070 49.590 207.780 45.000 202.000 C 40.410 196.220 40.910 188.780 37.000 183.000 C 33.090 177.220 24.550 174.800 22.000 168.000 C 19.450 161.200 23.530 150.140 22.000 143.000 C 20.470 135.860 12.320 136.370 13.000 126.000 C 13.680 115.630 20.050 92.370 26.000 82.000 C 31.950 71.630 42.900 70.780 48.000 65.000 C 53.100 59.220 49.880 54.800 56.000 48.000 C 62.120 41.200 74.310 30.270 84.000 25.000 C 93.690 19.730 106.030 18.360 113.000 17.000 Z';
  const VB = '12.96 15.98 230.85 222.41';
  const blob = (r) => {
    const s = box(div('l4-blob'), r); s.setAttribute('aria-hidden', 'true');
    s.innerHTML = `<svg viewBox="${VB}" focusable="false"><path d="${BLOT}"/></svg><svg class="l4-blob-eyes" viewBox="${VB}" focusable="false"><rect x="101.4" y="65" width="18.2" height="19.7" rx="9.1" ry="9.85"/><rect x="136.4" y="65" width="18.2" height="19.7" rx="9.1" ry="9.85"/></svg>`;
    return s;
  };
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let raf = 0, px = 0, py = 0;
    const aim = () => {
      raf = 0; if (held()) return;
      const e = view.querySelector('.l4-screen.is-on .l4-blob'); if (!e) return;
      const r = e.getBoundingClientRect(); if (!r.width || r.bottom < 0 || r.top > innerHeight) return;
      const dx = px - (r.left + r.width / 2), dy = py - (r.top + r.height * 0.265), d = Math.hypot(dx, dy), k = d < 0.5 ? 0 : (1.5 * Math.min(1, d / 48)) / d;
      e.querySelector('.l4-blob-eyes').style.transform = `translate(${(dx * k).toFixed(2)}px,${(dy * k).toFixed(2)}px)`;
    };
    addEventListener('pointermove', (ev) => { if (ev.pointerType === 'touch') return; px = ev.clientX; py = ev.clientY; if (!raf) raf = requestAnimationFrame(aim); }, { passive: true });
  }
  const screen = (p, t) => {
    const P = D.pages[p], s = div('l4-screen'), alt = `the portal: ${label(p)}, ${t} mode`;
    s.dataset.page = p; s.dataset.theme = t;
    if (P.full) { s.append(pic(`${p}-${t}-full`, 'l4-full', alt)); return s; }
    const bw = D.W - P.x0, sc = box(div('l4-scroll'), [P.x0, P.top, bw, D.H - P.top]);
    const b = pic(`${p}-${t}-body`, 'l4-body', alt); b.width = bw; b.height = P.bh[t]; sc.append(b);
    const layer = div('l4-bodyhots'); layer.style.aspectRatio = `${bw} / ${P.bh[t]}`; sc.append(layer);
    s.append(sc, box(pic(`${P.nav}-${t}-side`, 'l4-part'), [0, 0, P.x0, D.H]));
    if (P.top > 0) s.append(box(pic(`${p}-${t}-top`, 'l4-part'), [P.x0, 0, bw, P.top]));
    const N = D.nav[P.nav]; if (N && N.blot) s.append(blob(N.blot));
    return s;
  };
  // ---- first sign-in: home's text and blots, cut from the home capture (no extra pictures), waiting under the pop-up
  const firstHome = (s, t) => {
    const P = D.pages.home, F = D.first, sc = s.querySelector('.l4-scroll'), b = sc && sc.querySelector('.l4-body');
    if (!F || !b) return null;
    const bw = D.W - P.x0, bh = P.bh[t], u = url(`home-${t}-body`);
    const wrap = div('l4-first'); wrap.style.background = F.bg[t]; wrap.style.aspectRatio = `${bw} / ${bh}`;
    const cut = (r) => { const e = div('l4-cut'), [x, y, w, h] = r;
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
  // ---- the account menu (the portal's own theme row is in it): its own capture over the sidebar
  const menuLayer = div('l4-menu'); menuLayer.hidden = true; stage.insertBefore(menuLayer, hots);
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
    st.busy = true; st.flipping = how === 'reveal'; if (st.menu) { st.menu = false; menuLayer.hidden = true; menuLayer.textContent = ''; }
    const old = view.querySelector('.l4-screen.is-on'), osc = old && old.querySelector('.l4-scroll');
    const keep = how === 'reveal' && old && old.dataset.page === p && osc ? osc.scrollTop / osc.clientWidth : 0;
    await ready(p, t);
    const s = screen(p, t); view.append(s);
    const sc = s.querySelector('.l4-scroll'); if (sc && keep) sc.scrollTop = keep * sc.clientWidth;
    st.fade = how === 'first' && !held() ? firstHome(s, t) : null;
    if (old) old.classList.remove('is-on'); s.classList.add('is-on');
    st.page = p; st.theme = t; stage.dataset.page = p; stage.dataset.theme = t; paint(true); arrive(p);
    let a = null, ghost = null;
    if (old && !held()) {
      if (how === 'reveal') {
        const w = stage.clientWidth, h = stage.clientHeight, o = from ? [from[0] * w / D.W, from[1] * h / D.H] : [w / 2, h / 2];
        const r = Math.hypot(Math.max(o[0], w - o[0]), Math.max(o[1], h - o[1]));
        const opt = { duration: 700, easing: 'ease-in-out' };
        a = s.animate({ clipPath: [`circle(0px at ${o[0]}px ${o[1]}px)`, `circle(${r}px at ${o[0]}px ${o[1]}px)`] }, opt);
        // the same circle carries on across the title bar, so the flip reads as one reveal over the whole window
        if (bar.dataset.l4Bar !== t) {
          ghost = [bar, macbar].filter(Boolean).map((el) => {
            const g = el.cloneNode(true), y = o[1] + (stage.getBoundingClientRect().top - el.getBoundingClientRect().top), R = Math.hypot(Math.max(o[0], w - o[0]), Math.max(y, el.offsetHeight - y));
            g.classList.add('l4-bar-ghost'); g.dataset.l4Bar = t; g.setAttribute('aria-hidden', 'true'); g.inert = true; g.style.top = `${el.offsetTop}px`; preview.append(g);
            g.animate({ clipPath: [`circle(0px at ${o[0]}px ${y}px)`, `circle(${R}px at ${o[0]}px ${y}px)`] }, opt);
            return g;
          });
        }
      } else if (how !== 'first') a = s.animate({ opacity: [0, 1] }, { duration: 180, easing: 'cubic-bezier(0,0,.2,1)' });
    }
    preview.dataset.l4Theme = t; icon(t);
    if (a) await a.finished.catch(() => {});
    bar.dataset.l4Bar = t; if (macbar) macbar.dataset.l4Bar = t; if (ghost) ghost.forEach((g) => g.remove());
    view.querySelectorAll('.l4-screen:not(.is-on)').forEach((x) => x.remove());
    st.busy = false; st.flipping = false;
    if (st.queued) { const q = st.queued; st.queued = null; show(...q); }
  };
  const flip = (r) => show(st.page, other(), 'reveal', mid(r));
  // the switch's icon, as his ref animates it: the old one fades out (.33 s), then the new one comes in from 55% and 25 degrees (.33 s). Framer Motion's default ease-in-out
  const ics = { light: tgl.querySelector('.l4-moon'), dark: tgl.querySelector('.l4-sun') }; let shown = 'light', iconRun = 0;
  const icon = (t) => {
    if (t === shown) return; const from = ics[shown], to = ics[t], run = ++iconRun; shown = t;
    Object.values(ics).forEach((e) => e.getAnimations().forEach((x) => x.cancel()));
    const settle = () => { Object.values(ics).forEach((e) => e.classList.toggle('is-on', e === to)); };
    if (held()) return settle();
    from.classList.add('is-on'); to.classList.remove('is-on');
    from.animate({ opacity: [1, 0] }, { duration: 330, easing: 'ease-in-out', fill: 'forwards' }).finished.then(() => {
      if (run !== iconRun) return; from.getAnimations().forEach((x) => x.cancel()); settle();
      to.animate({ opacity: [0, 1], transform: [`scale(.55) rotate(${t === 'dark' ? 25 : -25}deg)`, 'none'] }, { duration: 330, easing: 'ease-in-out' });
    }, () => {});
  };
  // the title-bar switch sits above the stage: its centre in the capture's px (y is negative, the circle starts up in the bar)
  const barPoint = () => { const a = tgl.getBoundingClientRect(), b = stage.getBoundingClientRect(); return [(a.left + a.width / 2 - b.left) / b.width * D.W, (a.top + a.height / 2 - b.top) / b.height * D.H]; };
  const themeOrigin = () => { const P = D.pages[st.page]; if (P.full) return P.toggle && P.toggle[st.theme]; const M = D.menu && D.menu[st.theme]; return M && M.summary; };
  const go = (p) => { if (st.hello) return; if (st.page === 'login') enter(); else if (p === 'login') show('login', st.theme, 'fade'); else if (p !== st.page) show(p, st.theme, 'fade'); };
  // ---- the title-card film in the mentorship slot: the blot, his title. One clickable video
  const playVideo = () => {
    const P = D.pages[st.page], layer = view.querySelector('.l4-screen.is-on .l4-bodyhots'); if (!P.player || !layer) return;
    let v = layer.querySelector('video');
    if (!v) { const bw = D.W - P.x0, bh = P.bh[st.theme], [x, y, w, h] = P.player; v = document.createElement('video'); v.className = 'l4-video'; v.src = `${D.base}mentorship-title-card.mp4`; v.controls = true; v.muted = true; v.playsInline = true; v.preload = 'auto'; v.setAttribute('aria-label', 'how to get placements as a blob 2026'); v.style.cssText = `left:${x / bw * 100}%;top:${y / bh * 100}%;width:${w / bw * 100}%;height:${h / bh * 100}%`; v.addEventListener('ended', () => v.remove()); layer.append(v); }
    const pl = v.play(); if (pl && pl.catch) pl.catch(() => {});
    v.focus({ preventScroll: true });
    const sc = layer.closest('.l4-scroll'); if (sc && sc.scrollTop > 0) sc.scrollTop = 0;
  };
  // ---- hotspots: the measured rects of the real sidebar, sign-in button, theme switches, and of what each page offers
  const paint = (changed) => {
    const P = D.pages[st.page], t = st.theme, a = document.activeElement, fk = a && stage.contains(a) ? a.dataset.k : null;
    const layer = view.querySelector('.l4-screen.is-on .l4-bodyhots');
    hots.textContent = ''; if (layer) layer.querySelectorAll('.l4-hot').forEach((h) => h.remove());
    const name = t === 'light' ? 'switch the portal to dark mode' : 'switch the portal to light mode';
    tgl.setAttribute('aria-label', name); tgl.title = name;
    cue.toggleAttribute('data-on', st.page === 'login' && !st.hello);
    placeBriefsCue();
    if (changed) { const m = view.querySelector('.l4-screen.is-on'); stage.classList.toggle('is-full', !!(m && P.full)); }
    if (st.hello) { if (crumb) crumb.textContent = label('home'); return; }
    const make = (k, name, fn, opts = {}) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'l4-hot'; b.dataset.k = k; b.setAttribute('aria-label', name);
      if (opts.cur) b.setAttribute('aria-current', 'page');
      if (opts.expanded !== undefined) { b.setAttribute('aria-expanded', String(opts.expanded)); b.setAttribute('aria-haspopup', 'menu'); }
      if (opts.pre) { b.addEventListener('pointerenter', opts.pre); b.addEventListener('focus', opts.pre); }
      b.addEventListener('click', (e) => { touch(); fn(e); });
      return b;
    };
    const add = (k, r, name, fn, opts) => { if (!r) return null; const b = box(make(k, name, fn, opts), r); hots.append(b); return b; };
    if (st.menu) {
      const M = D.menu[t];
      M.items.forEach((it, i) => add(`m-${i}`, it.r, it.do === 'theme' ? `theme: switch the portal to ${other()} mode` : it.do === 'login' ? 'log out (back to the sign-in screen)' : `open ${label(it.do)}`,
        () => { if (it.do === 'theme') { st.darkTried = true; if (st.flow === 'dark') flowEnd(); flip(it.r); } else show(it.do, t, 'fade'); }, { pre: () => (it.do === 'theme' ? ready(st.page, other()) : ready(it.do, t)) }));
      add('menu', M.summary, 'close the account menu', () => closeMenu(true), { expanded: true });
    } else {
      navHots(P).forEach((h, i) => { const hb = add(`go-${h.go}-${i}`, h.r, st.page === 'login' ? 'log in to the portal' : `open ${label(h.go)}`,
        () => (st.page === 'login' ? enter() : h.go === st.page ? null : show(h.go, t, 'fade')), { cur: h.go === st.page && !P.full, pre: () => { ready(h.go, t); if (st.page === 'login' && !st.greeted) engine().then((E) => E.blotField()).catch(() => {}); } });
        if (hb && st.page === 'login') hb.setAttribute('aria-describedby', cue.id); });
      if (P.toggle) add('theme', P.toggle[t], `switch the portal to ${other()} mode`, () => { st.darkTried = true; flip(P.toggle[t]); }, { pre: () => ready(st.page, other()) });
      else if (!P.full && D.menu && D.menu[t]) add('menu', D.menu[t].summary, 'open the account menu (theme switch inside)', (e) => openMenu(e.detail === 0), { expanded: false, pre: () => fetchImg(`menu-${t}`) });
      if (layer && !P.full) {
        const bw = D.W - P.x0, bh = P.bh[t], put = (b, r) => { b.style.left = pct(r[0], bw); b.style.top = pct(r[1], bh); b.style.width = pct(r[2], bw); b.style.height = pct(r[3], bh); layer.append(b); };
        (P.body || []).forEach((h, i) => put(make(`b-${h.go}-${i}`, `open ${D.sub[h.go] || label(h.go)}`, () => show(h.go, t, 'fade'), { pre: () => ready(h.go, t) }), h.r));
        if (P.player) put(make('video', 'play the video: how to get placements as a blob 2026', playVideo), P.player);
      }
    }
    if (fk) { const f = stage.querySelector(`[data-k="${fk}"]`) || (fk.startsWith('go-') && hots.querySelector(`[data-k^="go-${fk.split('-').slice(1, -1).join('-')}-"]`)) || hots.querySelector('[aria-current]'); if (f) f.focus({ preventScroll: true }); }
    if (changed) {
      if (crumb) crumb.textContent = label(P.nav || st.page);
      if (say) say.textContent = `${label(st.page)}, ${t} mode`;
      paintPills();
    }
  };
  stage.addEventListener('keydown', (e) => { if (e.key !== 'Escape') return; if (st.hello) { e.preventDefault(); st.hello.close(); } else if (st.menu) { e.preventDefault(); closeMenu(true); } });
  stage.addEventListener('click', (e) => { if (st.menu && !e.target.closest('.l4-hot')) closeMenu(false); });
  stage.addEventListener('pointerdown', touch, { passive: true });
  // ---- phone: the pages as the landing's pill row with the theme switch first, then what the current page offers
  let sub = null, subKey = null;
  const paintPills = () => {
    if (!pills) return;
    const P = D.pages[st.page], navKey = P.nav || st.page;
    pills.querySelectorAll('[data-go]').forEach((b) => { if (b.dataset.go === navKey || (D.navOf[navKey] && b.dataset.go === D.navOf[navKey])) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
    const tb = pills.querySelector('.l4-pill-theme'); if (tb) { tb.textContent = `${other()} mode`; tb.setAttribute('aria-pressed', String(st.theme === 'dark')); }
    const cur = pills.querySelector('[aria-current]');
    if (pills.offsetParent && pills.scrollWidth > pills.clientWidth) pills.scrollTo({ left: !cur || cur === pills.querySelector('[data-go]') ? 0 : Math.max(0, cur.offsetLeft - 48), behavior: held() ? 'auto' : 'smooth' });
    if (!sub) return;
    const grpKey = D.navOf[navKey] || navKey, list = D.group[grpKey] || null;
    if (subKey !== grpKey) { subKey = grpKey; sub.textContent = ''; (list || []).forEach((k) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'l4-pill'; b.textContent = D.sub[k] || label(k); b.dataset.sub = k; b.addEventListener('click', () => { touch(); if (k === 'play') playVideo(); else go(k); }); sub.append(b); }); sub.scrollLeft = 0; }
    sub.hidden = !list || st.page === 'login';
    sub.querySelectorAll('[data-sub]').forEach((b) => { if (b.dataset.sub === st.page) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
    const c2 = sub.querySelector('[aria-current]'); if (c2 && sub.offsetParent && sub.scrollWidth > sub.clientWidth) sub.scrollTo({ left: Math.max(0, c2.offsetLeft - 48), behavior: held() ? 'auto' : 'smooth' });
  };
  if (pills) {
    const mk = (txt, cls, fn) => { const b = document.createElement('button'); b.type = 'button'; b.className = cls; b.textContent = txt; b.addEventListener('click', () => { touch(); fn(); }); pills.append(b); return b; };
    const tb = mk('dark mode', 'l4-pill l4-pill-theme', () => { st.darkTried = true; if (st.flow === 'dark') flowEnd(); flip(themeOrigin()); }); tb.setAttribute('aria-pressed', 'false');
    D.order.forEach((p) => { const b = mk(label(p), 'l4-pill', () => go(p)); b.dataset.go = p; });
    pills.hidden = false;
    sub = document.createElement('div'); sub.className = 'l4-pills l4-subpills'; sub.setAttribute('role', 'group'); sub.setAttribute('aria-label', 'in this page'); sub.hidden = true; pills.after(sub);
  }
  // ---- one cue at a time: log in, then the briefs, then dark mode
  const tip = (cls, text, host) => { const p = document.createElement('p'); p.className = `l4-tip ${cls}`; p.textContent = text; host.append(p); return p; };
  const cue = tip('l4-cue', "click log in to look around. it's a demo, nothing is sent.", stage); cue.id = 'l4-cue';
  const LOG = (D.pages.login.hots || [])[0], CARD = D.pages.login.card;
  if (LOG) { cue.style.setProperty('--cx', pct(LOG.r[0] + LOG.r[2] + 12, D.W)); cue.style.setProperty('--cy', pct(LOG.r[1] + LOG.r[3] / 2, D.H)); }
  if (CARD) cue.style.setProperty('--py', pct(CARD[1] + CARD[3] + 8, D.H));
  const cueBriefs = tip('l4-cue2', 'check out the briefs.', stage), hint = tip('l4-hint', 'try dark mode.', preview);
  function placeBriefsCue() {
    const P = D.pages[st.page], h = !P.full && navHots(P).find((x) => x.go === 'briefs');
    if (st.flow !== 'briefs' || st.hello) { cueBriefs.removeAttribute('data-on'); return; }
    if (!h) { cueBriefs.removeAttribute('data-on'); return; }
    cueBriefs.style.setProperty('--cx', pct(h.r[0] + h.r[2] + 8, D.W)); cueBriefs.style.setProperty('--cy', pct(h.r[1] + h.r[3] / 2, D.H)); if (cueBriefs.dataset.live) cueBriefs.setAttribute('data-on', '');
  }
  const flowEnd = () => { clearTimeout(st.flowT); st.flow = 'done'; cueBriefs.removeAttribute('data-on'); hint.removeAttribute('data-on'); };
  const flowDark = (wait) => { clearTimeout(st.flowT); cueBriefs.removeAttribute('data-on'); if (st.flow === 'done') return; st.flow = 'dark'; if (st.darkTried) return flowEnd(); st.flowT = setTimeout(() => { hint.setAttribute('data-on', ''); st.flowT = setTimeout(flowEnd, 9000); }, wait); };
  const flowStart = () => { if (st.flow) return; st.flow = 'briefs'; st.flowT = setTimeout(() => { cueBriefs.dataset.live = '1'; placeBriefsCue(); const b = pills && pills.querySelector('[data-go="briefs"]'); if (b && pills.offsetParent && pills.scrollWidth > pills.clientWidth) pills.scrollTo({ left: Math.max(0, b.offsetLeft - 48), behavior: held() ? 'auto' : 'smooth' }); st.flowT = setTimeout(() => flowDark(0), 7000); }, held() ? 0 : 900); };
  const arrive = (p) => { if (st.flow === 'briefs' && D.pages[p].nav === 'briefs') flowDark(700); else if (p === 'login' && st.flow && st.flow !== 'done') flowEnd(); };
  tgl.addEventListener('click', () => { touch(); if (st.flipping) return; st.darkTried = true; if (st.flow === 'dark') flowEnd(); show(st.page, other(), 'reveal', barPoint()); });   // a click during a flip is ignored, as in the portal
  // ---- first sign-in: the portal's own hello splash, then the streamers, home's text and blots
  let engineP = null;
  const engine = () => (engineP = engineP || new Promise((res, rej) => { if (window.L4Blot) return res(window.L4Blot); const s = document.createElement('script'); s.src = 'js/l4-portal-hello.js'; s.onload = () => res(window.L4Blot); s.onerror = rej; document.head.append(s); }));
  const hello = () => {
    const el = div('l4-bh'), kb = document.activeElement && hots.contains(document.activeElement);
    el.setAttribute('role', 'dialog'); el.setAttribute('aria-labelledby', 'l4-bh-title'); el.tabIndex = -1;
    el.innerHTML = '<div class="bh-field" aria-hidden="true"></div><span class="bh-logo">lifetime supply</span><div class="bs-slot" aria-hidden="true"><canvas></canvas></div><h2 id="l4-bh-title" class="bh-title">hi there</h2><p class="bh-line">your board is ready.</p><button type="button" class="bh-go">let’s go</button>';
    const fit = () => { const w = stage.clientWidth, h = stage.clientHeight, small = w < 600, k = small ? w / 520 : w / D.W; el.classList.toggle('is-small', small); el.style.width = `${w / k}px`; el.style.height = `${h / k}px`; el.style.transform = `scale(${k})`; };
    fit(); const ro = 'ResizeObserver' in window ? new ResizeObserver(fit) : null; if (ro) ro.observe(stage);
    let stop = null, gone = false, closing = false, mo = null;
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
      mo = new MutationObserver(() => { if (held() && stop) { stop(); stop = null; still(E); mo.disconnect(); } }); mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion-paused'] });
    })).catch(() => {});
    const close = async () => {
      if (closing) return; closing = true;
      const inside = el.contains(document.activeElement);
      await ready('home', st.theme);
      while (st.busy) await new Promise((r) => setTimeout(r, 40));   // a theme flip still running
      await show('home', st.theme, 'first');
      st.hello = null; delete stage.dataset.hello; paint(true);
      if (inside) { const f = hots.querySelector('[data-k^="go-home-"][aria-current]') || hots.querySelector('.l4-hot'); if (f) f.focus({ preventScroll: true }); }
      const end = () => { gone = true; if (ro) ro.disconnect(); if (mo) mo.disconnect(); if (stop) stop(); el.remove(); };
      const fade = () => { const f = st.fade; st.fade = null; if (f) f(); };
      if (held()) { fade(); end(); flowStart(); return; }
      el.classList.add('is-leaving');   // the splash's own leave: .32 s, in place
      // the portal's first-visit burst (confetti.ts), over the window; the same physics, scaled to the window
      engine().then((E) => { if (!held() && E.burst) E.burst({ host: stage, scale: Math.max(stage.clientWidth / 1440, 0.42) }); }).catch(() => {});
      setTimeout(fade, 200); setTimeout(end, 340); flowStart();
    };
    el.querySelector('button').addEventListener('click', close);
    st.hello = { close }; stage.dataset.hello = ''; stage.insertBefore(el, hots); paint(true);
    if (say) say.textContent = 'hi there. your board is ready.';
    if (!held()) { el.classList.add('is-in'); el.animate({ opacity: [0, 1] }, { duration: 180, easing: 'cubic-bezier(0,0,.2,1)' }); }
    const fb = el.querySelector('button'); (kb ? fb : el).focus({ preventScroll: true });
  };
  const enter = () => { touch(); if (st.greeted) return show('home', st.theme, 'fade'); st.greeted = true; ready('home', st.theme); hello(); };
  // ---- the Mac's menu bar across the top of the window (ref: 21st.dev MacOS Menu Bar: the look, the dropdown, a live clock). The menus do what's real in the window
  const clock = macbar && macbar.querySelector('.l4-mac-clock');
  if (clock) { const tick = () => { clock.textContent = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }); }; tick(); setInterval(tick, 30000); document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); }); }
  if (macbar) {
    const off = (t, s) => ({ t, s, off: true }), sep = { sep: true }, logout = { t: 'Log Out', fn: () => go('login'), when: () => st.page !== 'login' };
    const MENUS = {
      apple: () => [off('About This Mac'), sep, off('Sleep'), off('Restart...'), off('Shut Down...'), sep, logout],
      File: () => [off('New Window', '⌘N'), off('Close Window', '⌘W'), sep, logout],
      Edit: () => [off('Undo', '⌘Z'), off('Redo', '⇧⌘Z'), sep, off('Cut', '⌘X'), off('Copy', '⌘C'), off('Paste', '⌘V')],
      View: () => [{ t: st.theme === 'light' ? 'Dark Mode' : 'Light Mode', fn: () => tgl.click() }],
      Window: () => D.order.map((p) => ({ t: label(p), fn: () => go(p), cur: (D.pages[st.page].nav || st.page) === p })),
      Help: () => [{ t: 'Update Board', fn: () => go('updates') }, { t: 'Get Help', fn: () => go('help') }],
    };
    let drop = null, from = null;
    const closeDrop = (refocus) => { if (!drop) return; drop.remove(); drop = null; if (from) { from.setAttribute('aria-expanded', 'false'); if (refocus) from.focus({ preventScroll: true }); from = null; } };
    const openDrop = (btn, kb) => {
      const same = from === btn; closeDrop(false); if (same) return;
      from = btn; btn.setAttribute('aria-expanded', 'true');
      drop = div('l4-drop'); drop.setAttribute('role', 'menu'); drop.setAttribute('aria-label', btn.getAttribute('aria-label') || btn.textContent);
      MENUS[btn.dataset.menu]().forEach((it) => {
        if (it.sep) { const s = div('l4-drop-sep'); drop.append(s); return; }
        const b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'menuitem'); b.textContent = it.t; const dead = it.off || (it.when && !it.when());
        if (dead) { b.setAttribute('aria-disabled', 'true'); b.tabIndex = -1; } if (it.cur) b.setAttribute('aria-current', 'page');
        if (it.s) { const k = document.createElement('kbd'); k.textContent = it.s; b.append(k); }
        b.addEventListener('click', () => { if (dead) return; closeDrop(true); touch(); it.fn(); });
        drop.append(b);
      });
      const pr = preview.getBoundingClientRect(), br = btn.getBoundingClientRect();
      drop.style.left = `${Math.max(4, br.left - pr.left - 1)}px`; drop.style.top = `${macbar.offsetHeight + 2}px`; preview.append(drop);
      const over = drop.getBoundingClientRect().right - pr.right + 4; if (over > 0) drop.style.left = `${parseFloat(drop.style.left) - over}px`;
      if (!held()) drop.animate([{ opacity: 0, transform: 'scale(.95) translateY(-5px)' }, { opacity: 1, transform: 'none' }], { duration: 150, easing: 'cubic-bezier(.23,1,.32,1)' });
      if (kb) { const f = drop.querySelector('button:not([aria-disabled])'); if (f) f.focus({ preventScroll: true }); }
    };
    macbar.querySelectorAll('[data-menu]').forEach((b) => {
      b.addEventListener('click', (e) => openDrop(b, e.detail === 0));
      b.addEventListener('pointerenter', () => { if (drop && from !== b) openDrop(b, false); });
    });
    document.addEventListener('pointerdown', (e) => { if (drop && !drop.contains(e.target) && !e.target.closest('[data-menu]')) closeDrop(false); }, { passive: true });
    preview.addEventListener('keydown', (e) => {
      if (!drop) return;
      if (e.key === 'Escape') { e.preventDefault(); closeDrop(true); return; }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); const it = [...drop.querySelectorAll('button:not([aria-disabled])')]; if (!it.length) return; const i = it.indexOf(document.activeElement); it[(i + (e.key === 'ArrowDown' ? 1 : -1) + it.length) % it.length].focus({ preventScroll: true }); }
    });
  }
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
