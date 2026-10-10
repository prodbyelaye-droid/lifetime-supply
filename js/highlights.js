(function () {
  var section = document.getElementById('highlights');
  if (!section) return;
  var rail = section.querySelector('.highlight-list');
  var dialog = section.querySelector('dialog');
  if (!dialog.showModal) return; // Direct MP4 links remain usable in older browsers.
  var player = dialog.querySelector('video');
  var error = dialog.querySelector('.highlight-error');
  var previousOverflow;
  section.querySelectorAll('.highlight-watch').forEach(function (link) {
    link.addEventListener('click', function (event) {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      document.querySelectorAll('video').forEach(function (video) { video.pause(); });
      dialog.querySelector('h2').textContent = link.dataset.highlightTitle;
      dialog.querySelector('.highlight-dialog-description').textContent = link.dataset.highlightDescription;
      dialog.querySelector('.highlight-direct').href = link.href;
      player.setAttribute('aria-label', 'watch ' + link.dataset.highlightTitle);
      player.poster = link.querySelector('img').src;
      player.src = link.href;
      error.hidden = true;
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      dialog.showModal();
      player.play().catch(function () { /* Native play controls remain available. */ });
    });
  });
  player.addEventListener('error', function () { if (player.hasAttribute('src')) error.hidden = false; });
  dialog.addEventListener('close', function () {
    player.pause();
    player.removeAttribute('src');
    player.load();
    document.body.style.overflow = previousOverflow;
  });
  dialog.addEventListener('click', function (event) {
    var box = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
  });
  document.addEventListener('visibilitychange', function () { if (document.hidden) player.pause(); });
  // A visitor can only hear one film, including the existing launch film.
  document.addEventListener('play', function (event) {
    if (event.target.tagName === 'VIDEO') document.querySelectorAll('video').forEach(function (video) { if (video !== event.target) video.pause(); });
  }, true);
  var arrows = section.querySelector('.highlights-arrows');
  var buttons = arrows.querySelectorAll('button');
  function updateArrows() {
    buttons[0].disabled = rail.scrollLeft < 2;
    buttons[1].disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2;
  }
  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      var card = rail.querySelector('li');
      var step = card.getBoundingClientRect().width + parseFloat(getComputedStyle(rail).columnGap);
      rail.scrollBy({left: Number(button.dataset.highlightScroll) * step, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
    });
  });
  arrows.hidden = false;
  rail.addEventListener('scroll', updateArrows, {passive: true});
  window.addEventListener('resize', updateArrows);
  updateArrows();
})();
