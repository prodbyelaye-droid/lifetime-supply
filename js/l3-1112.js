/* L3 · the eight areas as tabs (row 191's list). WAI-ARIA tabs: click, arrows, Home, End. Agent D2, 12 Nov 2026.
   On a phone the open row and the rows above it come before the screen (flex order), so the screen sits under the open row. */
(function () {
  var list = document.querySelector('.l3-list[role=tablist]'); if (!list) return;
  var tabs = [].slice.call(list.querySelectorAll('[role=tab]'));
  function pick(t, focus) {
    var idx = tabs.indexOf(t);
    tabs.forEach(function (x, j) {
      var on = x === t;
      x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; x.style.order = j <= idx ? 1 : 3;
      document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) t.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { pick(t); });
    t.addEventListener('keydown', function (e) {
      var n = null, k = e.key;
      if (k === 'ArrowDown' || k === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
      if (k === 'ArrowUp' || k === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (k === 'Home') n = tabs[0]; if (k === 'End') n = tabs[tabs.length - 1];
      if (n) { e.preventDefault(); pick(n, true); }
    });
  });
  pick(list.querySelector('[aria-selected=true]') || tabs[0]);
})();
