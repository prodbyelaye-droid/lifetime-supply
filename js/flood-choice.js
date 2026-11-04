// clanding 012: A is the default, with no separate flood section.
// Review-only alternative: ?flood=short&floodStage=start|middle|full.
// Static states only. Timing and scroll swelling are reserved for the motion lane.
(() => {
  const query = new URLSearchParams(location.search);
  if (query.get('flood') !== 'short') return;
  document.documentElement.dataset.floodChoice = 'short';
  const stage = query.get('floodStage');
  document.documentElement.dataset.floodStage = ['start', 'middle', 'full'].includes(stage) ? stage : 'full';
})();
