(() => {
  const labels = document.querySelectorAll('[data-open-briefs]');
  if (!labels.length) return;

  const source = 'https://portal.elaye.store/api/public/brief-count';
  const minute = 60_000;
  const sydneyDay = new Intl.DateTimeFormat('en-CA', {timeZone: 'Australia/Sydney'});
  const sydneyClock = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Australia/Sydney', hourCycle: 'h23', hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  let timer;
  let controller;

  function show(label) {
    for (const node of labels) node.textContent = label;
  }

  async function refresh() {
    clearTimeout(timer);
    controller?.abort();
    show('artist briefs');
    if (document.hidden) return;

    const request = new AbortController();
    controller = request;
    const timeout = setTimeout(() => request.abort(), 8000);
    let delay = minute;
    try {
      const response = await fetch(source, {credentials: 'omit', cache: 'no-store', signal: request.signal});
      if (!response.ok) return;
      const {open, checkedAt, countedAt} = await response.json();
      const now = Date.now();
      if (controller !== request || !Number.isSafeInteger(open) || open < 0 ||
          !Number.isSafeInteger(checkedAt) || !Number.isSafeInteger(countedAt) ||
          checkedAt > countedAt || countedAt > now + minute || now - checkedAt >= 10 * minute ||
          now - countedAt >= 5 * minute || sydneyDay.format(countedAt) !== sydneyDay.format(now)) return;

      const figure = open < 10 ? String(open) : Math.floor(open / 10) * 10 + '+';
      show(figure + ' live ' + (open === 1 ? 'brief' : 'briefs'));
      const [h, m, s] = sydneyClock.format(now).split(':').map(Number);
      const midnight = (86400 - h * 3600 - m * 60 - s) * 1000 - now % 1000;
      delay = Math.min(midnight, countedAt + 5 * minute - now, checkedAt + 10 * minute - now);
    } catch {
      // The Board link and the count-free wording work when the feed is unavailable.
    } finally {
      clearTimeout(timeout);
      if (controller === request && !document.hidden) timer = setTimeout(refresh, Math.max(1, delay));
    }
  }

  document.addEventListener('visibilitychange', refresh);
  window.addEventListener('pageshow', event => { if (event.persisted) refresh(); });
  refresh();
})();
