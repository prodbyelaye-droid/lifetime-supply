// L-demo (task 005): the film comes down full width, not boxed (X13), playing muted on a loop while it's on screen,
// with no play button and a poster that is a frame of the film itself (never the folder, X10). "watch the demo"
// (under the hero text, 19:34) takes you to it and plays it from the start with sound and controls.
// Variant behind ?demo=window: row 12's rounded, glowing window. Never pinned.
// The film opens on a folder (X10), so the muted preview starts and loops from 6 s; "watch the demo" plays it all.
const PREVIEW_FROM = 6;
export function createDemo(reduced, variant = 'full') {
  const section = document.querySelector('.demo'), video = section.querySelector('video');
  // 016: the markup carries native controls so the film plays without scripts; the scripted preview hides them
  video.controls = false;
  section.dataset.variant = variant;
  let paused = false, chosen = false, onScreen = false;
  // the film's own frame covers the preview until it is past the folder intro (holds even where seeking is slow)
  const cover = section.querySelector('.film-cover');
  video.addEventListener('timeupdate', () => { cover.hidden = chosen || video.currentTime >= PREVIEW_FROM; });
  const toStart = () => { if (!chosen && video.currentTime < PREVIEW_FROM) video.currentTime = PREVIEW_FROM; };
  video.addEventListener('loadedmetadata', toStart);
  video.addEventListener('ended', () => { if (chosen) return; video.currentTime = PREVIEW_FROM; video.play().catch(() => {}); });
  const sync = () => { if (chosen) return; if (onScreen && !paused && !reduced.matches && !document.hidden) { toStart(); video.play().catch(() => {}); } else video.pause(); };
  new IntersectionObserver((es) => { onScreen = es[0].isIntersecting; sync(); }, {threshold: 0.25}).observe(video);
  document.addEventListener('visibilitychange', sync);
  for (const a of document.querySelectorAll('.watch-demo')) a.addEventListener('click', (e) => {
    e.preventDefault(); chosen = true;
    section.scrollIntoView({behavior: reduced.matches ? 'auto' : 'smooth', block: 'center'});
    cover.hidden = true; video.muted = false; video.controls = true; video.currentTime = 0; video.play().catch(() => {});
  });
  return {setPaused(v) { paused = v; sync(); }};
}
