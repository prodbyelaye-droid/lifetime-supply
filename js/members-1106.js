/* members-1106: the screenshots wall opens at a fixed height with "see all"; without script every screenshot shows. */
(function () {
  'use strict';
  Array.prototype.forEach.call(document.querySelectorAll('.ms1106'), function (section) {
    var grid = section.querySelector('[data-ms]'), more = section.querySelector('.ms-more');
    if (!grid || !more) return;
    // Q3 QC22: collapsed, each column fills to one height (css/q3-landing-a.css), so the columns end at different
    // heights. Q5 L13: with several columns the wall fades to white over 84 px starting where its shortest column
    // ends, and is cut at the fade's foot, so every column dissolves on one line; "see all" sits 32 px under the cut.
    // One column (a phone) keeps the QC22 fade: 120 px above the end of the column. On a phone the first card is
    // marked when it is capped at 480 px, so it fades the same way.
    var fit = function () {
      var shots = Array.prototype.slice.call(grid.querySelectorAll('.ms-shot'));
      if (shots[0]) shots[0].classList.toggle('is-capped', shots[0].scrollHeight > shots[0].clientHeight + 1);
      grid.style.marginBottom = '';
      grid.style.removeProperty('--ms-low');
      grid.style.removeProperty('--ms-fade');
      if (!grid.classList.contains('is-collapsed')) return;
      // Q5 L13: the wall is measured after the old cut is cleared. Clearing it gives back the negative margin, and the
      // browser's scroll anchoring can move the page by that much, so a box read before the reset sat that far off the
      // shots and every resize cut the wall 59 px shorter.
      var box = grid.getBoundingClientRect(), low = box.top, ends = {};
      shots.forEach(function (s) {
        var r = s.getBoundingClientRect(), col = Math.round(r.left);
        if (!r.height || r.left >= box.right - 1 || r.bottom > box.bottom + 1) return;
        low = Math.max(low, r.bottom);
        ends[col] = Math.max(ends[col] || box.top, r.bottom);
      });
      var cols = Object.keys(ends).map(function (k) { return ends[k]; }), cut = low;
      if (cols.length > 1) {
        cut = Math.min(box.bottom, Math.min.apply(null, cols) + 84);
        grid.style.setProperty('--ms-fade', '84px');
      }
      grid.style.setProperty('--ms-low', Math.ceil(cut - box.top) + 'px');
      grid.style.marginBottom = -Math.max(0, Math.floor(box.bottom - cut)) + 'px';
    };
    grid.classList.add('is-collapsed');
    more.hidden = false;
    more.addEventListener('click', function () { grid.classList.remove('is-collapsed'); more.hidden = true; fit(); });
    fit();
    addEventListener('resize', fit, {passive: true});
    addEventListener('load', fit);
  });
})();
