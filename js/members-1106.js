/* members-1106: the screenshots wall opens at a fixed height with "see all"; without script every screenshot shows. */
(function () {
  'use strict';
  Array.prototype.forEach.call(document.querySelectorAll('.ms1106'), function (section) {
    var grid = section.querySelector('[data-ms]'), more = section.querySelector('.ms-more');
    if (!grid || !more) return;
    // Q3 QC22: collapsed, each column fills to one height (css/q3-landing-a.css), so the columns end at different
    // heights; the wall fades to white over the 120 px above the end of its longest column, and "see all" sits right
    // under that. On a phone the first card is marked when it is capped at 480 px, so it fades the same way.
    var fit = function () {
      var shots = Array.prototype.slice.call(grid.querySelectorAll('.ms-shot')), box = grid.getBoundingClientRect(), low = box.top;
      if (shots[0]) shots[0].classList.toggle('is-capped', shots[0].scrollHeight > shots[0].clientHeight + 1);
      grid.style.marginBottom = '';
      grid.style.removeProperty('--ms-low');
      if (!grid.classList.contains('is-collapsed')) return;
      shots.forEach(function (s) {
        var r = s.getBoundingClientRect();
        if (r.height && r.left < box.right - 1 && r.bottom <= box.bottom + 1) low = Math.max(low, r.bottom);
      });
      grid.style.setProperty('--ms-low', Math.ceil(low - box.top) + 'px');
      grid.style.marginBottom = -Math.max(0, Math.floor(box.bottom - low)) + 'px';
    };
    grid.classList.add('is-collapsed');
    more.hidden = false;
    more.addEventListener('click', function () { grid.classList.remove('is-collapsed'); more.hidden = true; fit(); });
    fit();
    addEventListener('resize', fit, {passive: true});
    addEventListener('load', fit);
  });
})();
