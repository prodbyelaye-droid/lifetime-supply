// The accepted film is only attached near the viewport. The image is the permanent fallback.
export function createStudioFilm(reduced) {
  const section = document.querySelector('#deep.studio-film');
  if (!section) return {setPaused() {}, dispose() {}}; // unit L2: #deep shows the portal now, no film
  const video = section.querySelector('video');
  const button = section.querySelector('button');
  let near = false, visible = false, globalPaused = false, userPaused = false;
  let explicitPlay = false, blocked = false, failed = false, disposed = false, pending = false;
  video.muted = true;
  const allowed = () => !disposed && !failed && !blocked && !globalPaused && !userPaused &&
    !document.hidden && visible && (!reduced.matches || explicitPlay);
  function render() {
    section.dataset.filmState = failed ? 'unavailable' : blocked ? 'blocked' : video.paused ? 'paused' : 'playing';
    button.textContent = failed ? 'film unavailable' : globalPaused ? 'motion paused' :
      (!video.paused || pending) ? 'pause film' : 'play film';
    button.disabled = failed || globalPaused || disposed;
  }
  function sync() {
    if (disposed) return;
    if (near && !failed && !globalPaused && !userPaused && !document.hidden &&
        (!reduced.matches || explicitPlay) && !video.hasAttribute('src')) {
      video.src = video.dataset.src;
      video.load();
    }
    if (!allowed()) video.pause();
    else if (video.hasAttribute('src') && video.paused && !pending) {
      pending = true;
      video.play().then(() => {
        pending = false;
        if (!allowed()) video.pause();
        render();
      }, error => {
        pending = false;
        if (!disposed && error.name !== 'AbortError') {
          blocked = true;
          delete section.dataset.filmFrame;
        }
        render();
      });
    }
    render();
  }
  function toggle() {
    if (!video.paused || pending) { userPaused = true; explicitPlay = false; }
    else { userPaused = false; explicitPlay = true; blocked = false; }
    sync();
  }
  function playing() {
    if (!allowed()) { video.pause(); return; }
    section.dataset.filmFrame = '';
    render();
  }
  function error() {
    failed = true;
    pending = false;
    video.pause();
    delete section.dataset.filmFrame;
    render();
  }
  function preferenceChanged() {
    if (reduced.matches) { explicitPlay = false; delete section.dataset.filmFrame; }
    sync();
  }
  const nearby = new IntersectionObserver(entries => {
    near = entries[0].isIntersecting;
    sync();
  }, {rootMargin:'240px 0px', threshold:0});
  const viewport = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting && entries[0].intersectionRatio > 0;
    sync();
  }, {threshold:0});
  nearby.observe(video);
  viewport.observe(video);
  button.addEventListener('click', toggle);
  video.addEventListener('playing', playing);
  video.addEventListener('pause', render);
  video.addEventListener('error', error);
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', preferenceChanged);
  button.hidden = false;
  render();
  return {
    setPaused(value) { globalPaused = value; sync(); },
    dispose() {
      if (disposed) return;
      disposed = true;
      nearby.disconnect();
      viewport.disconnect();
      button.removeEventListener('click', toggle);
      video.removeEventListener('playing', playing);
      video.removeEventListener('pause', render);
      video.removeEventListener('error', error);
      document.removeEventListener('visibilitychange', sync);
      reduced.removeEventListener('change', preferenceChanged);
      video.pause();
      video.removeAttribute('src');
      video.load();
      delete section.dataset.filmFrame;
      render();
    }
  };
}
