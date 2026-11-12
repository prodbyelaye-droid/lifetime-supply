/* The hero window's theme, as frame.js chose it (?t=light|dark, else the viewer's setting). The frame itself is static markup now:
   the real P9 shell, cloned from the portal (p9-shell-live.css). */
(function () {
  var t = new URLSearchParams(location.search).get('t');
  var dark = t === 'dark' || (t !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
})();
