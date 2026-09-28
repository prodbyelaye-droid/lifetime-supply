/* ═══════════════════════════════════════════════════════════════════════════
   homer.js · lifetime.elaye.store (the Homer landing), no libraries.
   1. Reveals: .reveal fades up once near the viewport (only while html.js).
   2. The footer band's wordmark powers its dots on when it scrolls in.
   3. The unlock (#top). With html.motion (JS on, no reduced motion, a
      viewport 520px+ tall) the hero stage pins for a short stretch of
      scroll, all scroll-linked: the hero hands over to the captions, the
      folder turns gold (--gold), the shackle snaps open (--lift), the broken
      lock rises away (--float), the folder opens on 03. Then it lets go.
      Without html.motion: the hero and its locked folder, nothing pinned.
   4. The portal demo (#portal): a normal section. Tabs switch on click and
      with the arrow keys; the caption under the window follows.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function stillPlease() { return !!(mq && mq.matches); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function ramp(v, a, b) { return clamp01((v - a) / (b - a)); }

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

  /* ── 4: the portal demo ──────────────────────────────────────────────── */
  var demo = document.getElementById('demo');
  if (demo) {
    var header = demo.querySelector('.demo-header');
    var strip = demo.querySelector('.demo-tabs');
    var tabs = Array.prototype.slice.call(demo.querySelectorAll('[role="tab"]'));
    var panels = Array.prototype.slice.call(demo.querySelectorAll('.demo-panel'));
    var stepEl = document.querySelector('[data-demo-step]');
    var nameEl = document.querySelector('[data-demo-name]');
    var textEl = document.querySelector('[data-demo-text]');
    var N = tabs.length;
    var step = 0;

    var select = function (i) {
      i = (i + N) % N;
      step = i;
      tabs.forEach(function (t, k) {
        var on = k === i;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
      });
      panels.forEach(function (p, k) {
        var on = k === i;
        if (on && !p.classList.contains('is-on')) p.scrollTop = 0;
        p.classList.toggle('is-on', on);
      });
      stepEl.textContent = pad(i + 1) + ' / ' + pad(N);
      nameEl.textContent = panels[i].getAttribute('data-name');
      textEl.textContent = panels[i].getAttribute('data-text');
      /* keep the selected tab in view when the tab strip scrolls (phone) */
      if (strip.scrollWidth > strip.clientWidth + 1) {
        var t = tabs[i];
        var left = strip.contains(t) ? t.offsetLeft - (strip.clientWidth - t.offsetWidth) / 2 : 0;
        if (strip.scrollTo) strip.scrollTo({ left: left, behavior: stillPlease() ? 'auto' : 'smooth' });
        else strip.scrollLeft = left;
      }
      return i;
    };

    tabs.forEach(function (t, k) {
      t.addEventListener('click', function () { select(k); });
    });
    header.addEventListener('keydown', function (e) {
      var map = { ArrowRight: step + 1, ArrowLeft: step - 1, Home: 0, End: N - 1 };
      if (!(e.key in map)) return;
      e.preventDefault();
      tabs[select(map[e.key])].focus();
    });

    /* the urgent pop-up: slides in at the window's bottom right once the
       demo is on screen; "view" opens the board, × dismisses it */
    var toast = demo.querySelector('.d-toast');
    if (toast) {
      var hideToast = function () {
        toast.classList.remove('is-in');
        toast.hidden = true;
      };
      toast.querySelector('.d-toast-go').addEventListener('click', function () {
        select(parseInt(this.getAttribute('data-go'), 10));
        hideToast();
      });
      toast.querySelector('.d-toast-x').addEventListener('click', hideToast);
      var showToast = function () {
        toast.hidden = false;
        toast.classList.add('is-in');
      };
      if ('IntersectionObserver' in window) {
        var to = new IntersectionObserver(function (entries) {
          if (entries[0].isIntersecting) {
            to.disconnect();
            setTimeout(showToast, 1600);
          }
        }, { threshold: 0.45 });
        to.observe(demo);
      } else {
        showToast();
      }
    }
  }

  /* the demo's "your day" wears today's date and this week, like the portal */
  (function () {
    var now = new Date();
    var DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var today = document.querySelector('[data-today]');
    if (today) {
      var d = DAYS[now.getDay()];
      today.textContent = d.charAt(0).toUpperCase() + d.slice(1) + ' ' + now.getDate() + ' ' + MONTHS[now.getMonth()];
    }
    var cells = document.querySelectorAll('.d-week .d-day');
    if (cells.length === 7) {
      var monday = new Date(now);
      monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
      Array.prototype.forEach.call(cells, function (cell, k) {
        var day = new Date(monday);
        day.setDate(monday.getDate() + k);
        var b = cell.querySelector('b');
        if (b) b.textContent = day.getDate();
        cell.classList.toggle('is-today', day.toDateString() === now.toDateString());
      });
    }
  })();

  /* ── 3: the unlock ───────────────────────────────────────────────────── */
  var show = document.getElementById('top');
  if (!show) return;
  var stage = show.querySelector('.stage');
  var folder = show.querySelector('.unlock-object .folder');
  var caps = show.querySelectorAll('.unlock-cap');
  var countEl = show.querySelector('[data-unlock-count]');
  var header = document.querySelector('.site-header');

  var motion = false;
  var top0 = 0;
  var U = 0;
  var last = {};
  var ticking = false;

  function wantMotion() { return !stillPlease() && window.innerHeight >= 520; }

  function setVar(name, v) {
    v = Math.round(v * 1000) / 1000;
    if (last[name] !== v) {
      last[name] = v;
      stage.style.setProperty(name, v);
    }
  }

  function setMotion(on) {
    motion = on;
    root.classList.toggle('motion', on);
    last = {};
    if (!on) {
      show.style.height = '';
      stage.classList.remove('is-beats');
      folder.classList.remove('is-open');
      ['--gold', '--lift', '--float'].forEach(function (p) { stage.style.removeProperty(p); });
    }
  }

  function measure() {
    if (!motion) return;
    var stageH = stage.offsetHeight;
    U = stageH * 1.6; /* the whole unlock, start to "and this is inside." */
    show.style.height = Math.round(stageH + U) + 'px';
    var headerH = header ? header.offsetHeight : 0;
    top0 = show.getBoundingClientRect().top + window.pageYOffset - headerH;
    last = {};
  }

  function update() {
    ticking = false;
    if (!motion) return;
    var p = clamp01((window.pageYOffset - top0) / U);

    var beats = p >= 0.05;
    if (last.beats !== beats) {
      last.beats = beats;
      stage.classList.toggle('is-beats', beats);
    }
    setVar('--gold', ramp(p, 0.05, 0.3));
    setVar('--lift', ramp(p, 0.34, 0.47));
    setVar('--float', ramp(p, 0.47, 0.72));

    var c = p < 0.34 ? 0 : p < 0.74 ? 1 : 2;
    if (last.cap !== c) {
      last.cap = c;
      Array.prototype.forEach.call(caps, function (el, k) { el.classList.toggle('is-on', k === c); });
      countEl.textContent = pad(c + 1);
    }
    var open = p >= 0.74;
    if (last.open !== open) {
      last.open = open;
      folder.classList.toggle('is-open', open);
    }
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

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

  setMotion(wantMotion());
  measure();
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { relayout(true); });
  window.addEventListener('load', function () { relayout(true); });
})();
