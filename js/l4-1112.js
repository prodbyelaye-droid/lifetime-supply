/* L4 · agent D2, 12 Nov 2026 · option B, pending his pick.
   1) "and so much more." rows drift (275, Scroll Based Velocity): a base speed, alternate rows the other way, scrolling adds speed that decays.
      Still under reduced motion, under the page's "pause motion" (#motion-toggle, aria-pressed) and while off screen.
   2) "hear the kits.": the live soundcloud playlists stay the source. Each kit row drives its own hidden widget with soundcloud's
      widget api (https://w.soundcloud.com/player/api.js). UNTESTED here: w.soundcloud.com is not reachable from the design workspace. */
(function () {
  var reduced = matchMedia('(prefers-reduced-motion: reduce)');
  function paused() {
    var t = document.querySelector('#motion-toggle');
    return reduced.matches || (t && t.getAttribute('aria-pressed') === 'true') || !!document.querySelector('.is-paused');
  }
  // 1 · the drift
  var rows = [].slice.call(document.querySelectorAll('.l4-row')).map(function (r) {
    return { el: r, tr: r.querySelector('.l4-track'), set: r.querySelector('.l4-set'), dir: r.dataset.dir === 'right' ? 1 : -1, x: -(+r.dataset.off || 0), vis: true };
  });
  rows.forEach(function (s) { s.tr.style.transform = 'translateX(' + s.x + 'px)'; });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { rows.forEach(function (s) { if (s.el === e.target) s.vis = e.isIntersecting; }); }); });
    rows.forEach(function (s) { io.observe(s.el); });
  }
  var BASE = 28, MAX = 420, boost = 0, lastY = scrollY, last = performance.now();       // px per second; no reference for the exact numbers
  addEventListener('scroll', function () { var d = Math.abs(scrollY - lastY); lastY = scrollY; boost = Math.min(boost + d * 2.2, MAX); }, { passive: true });
  function tick(t) {
    var dt = Math.min((t - last) / 1000, 0.05); last = t; boost *= Math.pow(0.04, dt);
    if (!paused() && !document.hidden) rows.forEach(function (s) {
      if (!s.vis) return; var w = s.set.offsetWidth; s.x += s.dir * (BASE + boost) * dt;
      if (s.x <= -w) s.x += w; if (s.x > 0) s.x -= w; s.tr.style.transform = 'translateX(' + s.x + 'px)';
    });
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // 2 · the kits
  var kits = [].slice.call(document.querySelectorAll('.l4-kit[data-playlist]'));
  if (!kits.length) return;
  function fmt(ms) { var s = Math.round(ms / 1000); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  function boot() {
    var widgets = new Map();
    kits.forEach(function (k) {
      var frame = k.querySelector('iframe.l4-sc'); if (!frame || !window.SC) return;
      var w = SC.Widget(frame), dur = 0, cap = k.querySelector('.l4-cap'), tm = cap.querySelector('.tm'), trk = cap.querySelector('.trk');
      var play = k.querySelector('.l4-play'), art = cap.querySelector('.art');
      widgets.set(k, w);
      function stopOthers() { widgets.forEach(function (other, row) { if (row !== k) other.pause(); }); }
      play.addEventListener('click', function () { stopOthers(); k.classList.add('is-playing'); w.play(); art.focus(); });
      art.addEventListener('click', function () { w.isPaused(function (p) { if (p) { stopOthers(); w.play(); } else w.pause(); }); });
      trk.addEventListener('click', function (e) { var r = trk.getBoundingClientRect(); if (dur) w.seekTo(dur * (e.clientX - r.left) / r.width); });
      w.bind(SC.Widget.Events.PLAY, function () {
        stopOthers();
        k.classList.add('is-playing'); art.setAttribute('aria-label', 'pause');
        w.getDuration(function (d) { dur = d; });
      });
      w.bind(SC.Widget.Events.PAUSE, function () { art.setAttribute('aria-label', 'play'); art.innerHTML = art.innerHTML.replace(/<svg[\s\S]*<\/svg>/, PLAY); });
      w.bind(SC.Widget.Events.PLAY, function () { art.innerHTML = art.innerHTML.replace(/<svg[\s\S]*<\/svg>/, PAUSE); });
      w.bind(SC.Widget.Events.PLAY_PROGRESS, function (e) {
        cap.style.setProperty('--p', (e.relativePosition * 100).toFixed(2) + '%');
        if (dur) tm.textContent = fmt(e.currentPosition) + ' / ' + fmt(dur);
      });
    });
  }
  var PLAY = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3.2v9.6c0 .4.4.6.7.4l7.4-4.8c.3-.2.3-.6 0-.8L5.7 2.8c-.3-.2-.7 0-.7.4z"/></svg>';
  var PAUSE = '<svg viewBox="0 0 18 18" aria-hidden="true"><rect x="4" y="3" width="3.5" height="12" rx="1"/><rect x="10.5" y="3" width="3.5" height="12" rx="1"/></svg>';
  if (window.SC) boot(); else { var s = document.createElement('script'); s.src = 'https://w.soundcloud.com/player/api.js'; s.onload = boot; document.head.appendChild(s); }
})();
