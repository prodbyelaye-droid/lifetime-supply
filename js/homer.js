/* ═══════════════════════════════════════════════════════════════════════════
   homer.js · lifetime.elaye.store (the Homer landing), no libraries.
   1. Reveals: .reveal fades up once near the viewport (only while html.js).
   2. The footer band's wordmark powers its dots on when it scrolls in.
   3. The portal stage (#show). With html.motion (JS on, no reduced motion,
      a viewport 520px+ tall) one sticky stage plays, all scroll-linked:
        unlock  the shackle lifts (--lift), the badge drops (--drop), the
                folder opens (.is-open); captions 01 / 02 / 03 by beat
        rise    (--rise) the demo window climbs out of the open folder to
                full width while the folder and captions fall away
        demo    .is-live: each stretch of scroll selects the next tab; a
                tab click or arrow key jumps the scroll to that step
      Without html.motion nothing pins: the markup's final state stands
      (open folder, caption 03, the demo below) and the tabs just switch.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function stillPlease() { return !!(mq && mq.matches); }

  /* ── 1 + 2: reveals and the band ─────────────────────────────────────── */
  var reveals = document.querySelectorAll('.reveal');
  var band = document.querySelector('.wm-wait');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px 240px 0px' });
    Array.prototype.forEach.call(reveals, function (el) { io.observe(el); });

    if (band) {
      var bo = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          band.classList.add('is-live');
          bo.disconnect();
        }
      }, { threshold: 0.35 });
      bo.observe(band);
    }
  } else {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add('visible'); });
    if (band) band.classList.add('is-live');
  }

  /* ── 3: the portal stage ─────────────────────────────────────────────── */
  var show = document.getElementById('show');
  if (!show) return;

  var stage = show.querySelector('.stage');
  var folder = show.querySelector('.unlock-object .folder');
  var caps = show.querySelectorAll('.unlock-cap');
  var countEl = show.querySelector('[data-unlock-count]');
  var win = show.querySelector('.window');
  var tablist = show.querySelector('.demo-tabs');
  var tabs = Array.prototype.slice.call(show.querySelectorAll('.demo-tab'));
  var panels = Array.prototype.slice.call(show.querySelectorAll('.demo-panel'));
  var stepEl = show.querySelector('[data-demo-step]');
  var nameEl = show.querySelector('[data-demo-name]');
  var textEl = show.querySelector('[data-demo-text]');
  var header = document.querySelector('.site-header');
  var N = tabs.length;

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function ramp(v, a, b) { return clamp01((v - a) / (b - a)); }
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  /* the demo: one tab selected, its panel shown, the caption under it */
  var step = -1;
  function select(i) {
    i = Math.max(0, Math.min(N - 1, i));
    if (i === step) return;
    step = i;
    tabs.forEach(function (t, k) {
      var on = k === i;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach(function (p, k) { p.classList.toggle('is-on', k === i); });
    stepEl.textContent = pad(i + 1) + ' / ' + pad(N);
    nameEl.textContent = panels[i].getAttribute('data-name');
    textEl.textContent = panels[i].getAttribute('data-text');
    /* keep the selected tab in view when the tab strip scrolls (phone) */
    if (tablist.scrollWidth > tablist.clientWidth + 1) {
      var t = tabs[i];
      var left = t.offsetLeft - (tablist.clientWidth - t.offsetWidth) / 2;
      if (tablist.scrollTo) tablist.scrollTo({ left: left, behavior: stillPlease() ? 'auto' : 'smooth' });
      else tablist.scrollLeft = left;
    }
  }

  /* motion state: lengths in px, from the stage's own height */
  var motion = false;
  var top0 = 0, U = 0, R = 0, S = 0;
  var dx = 0, dy = 0, s0 = 0.3;
  var last = {};
  var ticking = false;

  function wantMotion() { return !stillPlease() && window.innerHeight >= 520; }

  function setMotion(on) {
    motion = on;
    root.classList.toggle('motion', on);
    last = {};
    if (on) {
      folder.classList.remove('is-open');
      folder.classList.add('has-lock');
    } else {
      folder.classList.add('is-open');
      folder.classList.remove('has-lock');
      show.style.height = '';
      win.style.transform = '';
      win.style.opacity = '';
      stage.classList.remove('is-live');
      ['--lift', '--drop', '--rise'].forEach(function (p) { stage.style.removeProperty(p); });
      Array.prototype.forEach.call(caps, function (c, k) { c.classList.toggle('is-on', k === 2); });
      countEl.textContent = '03';
    }
  }

  function measure() {
    if (!motion) return;
    var stageH = stage.offsetHeight;
    U = stageH * 1.3; /* the unlock: lift, drop, open, a beat to read it */
    R = stageH * 0.9; /* the rise */
    S = stageH * 0.5; /* one demo step */
    show.style.height = Math.round(stageH + U + R + N * S) + 'px';
    var headerH = header ? header.offsetHeight : 0;
    top0 = show.getBoundingClientRect().top + window.pageYOffset - headerH;
    /* where the window starts: small, over the open folder's sheets */
    stage.classList.add('is-measuring');
    var w = win.getBoundingClientRect();
    var f = folder.getBoundingClientRect();
    stage.classList.remove('is-measuring');
    s0 = Math.min(0.5, (f.width * 0.5) / Math.max(1, w.width));
    dx = f.left + f.width / 2 - (w.left + w.width / 2);
    dy = f.top + f.height * 0.3 - (w.top + w.height / 2);
    last = {};
  }

  function setVar(name, v) {
    v = Math.round(v * 1000) / 1000;
    if (last[name] !== v) {
      last[name] = v;
      stage.style.setProperty(name, v);
    }
  }

  function update() {
    ticking = false;
    if (!motion) return;
    var y = window.pageYOffset - top0;
    var lock = clamp01(y / U);
    var rise = clamp01((y - U) / R);

    setVar('--lift', ramp(lock, 0.14, 0.4));
    setVar('--drop', ramp(lock, 0.4, 0.66));
    var open = lock >= 0.68;
    if (last.open !== open) {
      last.open = open;
      folder.classList.toggle('is-open', open);
    }
    var c = lock < 0.14 ? 0 : lock < 0.68 ? 1 : 2;
    if (last.cap !== c) {
      last.cap = c;
      Array.prototype.forEach.call(caps, function (el, k) { el.classList.toggle('is-on', k === c); });
      countEl.textContent = pad(c + 1);
    }

    setVar('--rise', rise);
    var e = Math.round(ease(rise) * 1000) / 1000;
    if (last.e !== e) {
      last.e = e;
      if (e >= 1) {
        win.style.transform = 'none';
      } else {
        var sc = s0 + (1 - s0) * e;
        win.style.transform = 'translate3d(' + (dx * (1 - e)).toFixed(1) + 'px,' + (dy * (1 - e)).toFixed(1) + 'px,0) scale(' + sc.toFixed(4) + ')';
      }
      win.style.opacity = Math.min(1, rise / 0.22).toFixed(3);
    }
    var live = rise >= 1;
    if (last.live !== live) {
      last.live = live;
      stage.classList.toggle('is-live', live);
    }

    select(y < U + R ? 0 : Math.floor((y - U - R) / S));
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  /* a step's scroll position: the middle of its stretch */
  function stepY(i) { return Math.round(top0 + U + R + i * S + S * 0.5); }

  function go(i) {
    i = (i + N) % N;
    if (motion) window.scrollTo(0, stepY(i));
    select(i);
    return i;
  }

  tabs.forEach(function (t, k) {
    t.addEventListener('click', function () { go(k); });
  });
  tablist.addEventListener('keydown', function (e) {
    var map = { ArrowRight: step + 1, ArrowLeft: step - 1, Home: 0, End: N - 1 };
    if (!(e.key in map)) return;
    e.preventDefault();
    var i = go(map[e.key]);
    tabs[i].focus({ preventScroll: true });
  });
  /* keyboard users who tab into the window before it has risen land on it */
  win.addEventListener('focusin', function () {
    if (motion && !stage.classList.contains('is-live')) window.scrollTo(0, stepY(Math.max(step, 0)));
  });

  var lastW = window.innerWidth;
  var lastH = window.innerHeight;
  var resizeT = 0;
  function relayout(force) {
    var w = window.innerWidth;
    var h = window.innerHeight;
    var want = wantMotion();
    /* a phone's toolbar showing or hiding is not a relayout */
    if (!force && want === motion && w === lastW && Math.abs(h - lastH) < 120) return;
    lastW = w;
    lastH = h;
    if (want !== motion) setMotion(want);
    measure();
    update();
  }
  window.addEventListener('resize', function () {
    clearTimeout(resizeT);
    resizeT = setTimeout(function () { relayout(false); }, 150);
  });
  if (mq) {
    var onPref = function () { relayout(true); };
    if (mq.addEventListener) mq.addEventListener('change', onPref);
    else if (mq.addListener) mq.addListener(onPref);
  }

  select(0);
  setMotion(wantMotion());
  measure();
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  /* fonts and late layout move the stage's top: measure again */
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { relayout(true); });
  window.addEventListener('load', function () { relayout(true); });
})();
