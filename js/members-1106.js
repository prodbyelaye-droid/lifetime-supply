/* members-1106: the screenshots wall opens at a fixed height with "see all"; without script every screenshot shows. */
(function () {
  'use strict';
  Array.prototype.forEach.call(document.querySelectorAll('.ms1106'), function (section) {
    var grid = section.querySelector('[data-ms]'), more = section.querySelector('.ms-more');
    if (!grid || !more) return;
    grid.classList.add('is-collapsed');
    more.hidden = false;
    more.addEventListener('click', function () { grid.classList.remove('is-collapsed'); more.hidden = true; });
  });
})();
