/* hear-1106: a kit's SoundCloud previews load only when you press play (no third-party request before that). */
(function () {
  'use strict';
  var buttons = document.querySelectorAll('.hk-play[data-sc]');
  Array.prototype.forEach.call(buttons, function (button) {
    button.addEventListener('click', function () {
      var id = button.getAttribute('data-sc');
      if (!/^\d+$/.test(id)) return;
      var frame = document.createElement('iframe');
      frame.className = 'hk-frame';
      frame.title = button.getAttribute('aria-label') || 'kit previews';
      frame.allow = 'autoplay';
      frame.src = 'https://w.soundcloud.com/player/?url=' + encodeURIComponent('https://api.soundcloud.com/playlists/' + id) +
        '&color=%23151517&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false';
      button.replaceWith(frame);
    });
  });
})();
