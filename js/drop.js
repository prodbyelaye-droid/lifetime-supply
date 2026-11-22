/* The drop on the page (fix-landing-drop, 22 Nov 2026).
 * Reads the portal's public changelog feed (/api/public/activity, the same records as portal.elaye.store/changelog)
 * and writes the shipped features, dated, into two places:
 *   [data-drop-list]     the drop band after "a day in my workflow.": everything shipped in the last 14 days
 *                        (Sydney dates), or the newest one when nothing shipped in that window.
 *   [data-shipped-list]  the "live now" head of the update board: the two newest shipped features.
 * Only entries the portal has published are shown, with their published title and line. No clock time, no counts.
 * The markup ships with the entries that were public when it was written, so the page reads right with no script,
 * with the feed down, or with a malformed answer: the script only ever replaces it with a valid, newer list. */
(() => {
  const drop = document.querySelector('[data-drop-list]');
  const shipped = document.querySelector('[data-shipped-list]');
  if (!drop && !shipped) return;

  const source = 'https://portal.elaye.store/api/public/activity';
  const sydneyDay = new Intl.DateTimeFormat('en-CA', {timeZone: 'Australia/Sydney'});
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const changelog = 'https://portal.elaye.store/changelog';
  const isDate = (s) => typeof s === 'string' && /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(s);
  const isText = (s) => typeof s === 'string' && s.trim().length > 0 && s.length <= 240;
  const label = (iso) => { const [, m, d] = iso.split('-').map(Number); return d + ' ' + months[m - 1]; };

  function entries(feed) {
    if (!feed || !Array.isArray(feed.weeks)) return [];
    const seen = new Set();
    const list = [];
    for (const week of feed.weeks) {
      if (!week || !Array.isArray(week.shipped)) continue;
      for (const e of week.shipped) {
        if (!e || !isDate(e.date) || !isText(e.title) || !isText(e.line)) continue;
        const key = e.date + '|' + e.title.trim();
        if (seen.has(key)) continue;
        seen.add(key);
        list.push({date: e.date, title: e.title.trim(), line: e.line.trim()});
      }
    }
    return list.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  }

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function time(iso, cls) {
    const t = el('time', cls, label(iso));
    t.dateTime = iso;
    return t;
  }

  function paintDrop(list, today) {
    const [y, m, d] = today.split('-').map(Number);
    const cutoff = sydneyDay.format(Date.UTC(y, m - 1, d) - 13 * 86400000);
    let recent = list.filter((e) => e.date >= cutoff && e.date <= today);
    if (!recent.length) recent = list.slice(0, 1);
    recent = recent.slice(0, 8);
    const rows = recent.map((e) => {
      const li = el('li', 'ls-drop__row');
      li.append(time(e.date, 'ls-drop__date'));
      const body = el('div', 'ls-drop__body');
      body.append(el('p', 'ls-drop__t', e.title), el('p', 'ls-drop__l', e.line));
      li.append(body);
      return li;
    });
    drop.replaceChildren(...rows);
  }

  function paintShipped(list) {
    const rows = list.slice(0, 2).map((e, i) => {
      const row = el('div', 'l8-shipped');
      row.append(time(e.date));
      const body = el('div');
      body.append(el('p', 'l8-shipped__title', e.title), el('p', null, e.line));
      if (i === 0) {
        const a = el('a', 'l8-update-link', 'public changelog');
        a.href = changelog;
        body.append(a);
      }
      row.append(body);
      return row;
    });
    shipped.replaceChildren(...rows);
  }

  async function refresh() {
    const request = new AbortController();
    const timeout = setTimeout(() => request.abort(), 8000);
    try {
      const response = await fetch(source, {credentials: 'omit', cache: 'no-store', signal: request.signal});
      if (!response.ok) return;
      const feed = await response.json();
      const list = entries(feed);
      if (!list.length) return;
      const today = sydneyDay.format(Date.now());
      const live = list.filter((e) => e.date <= today);   // never show a dated entry ahead of today
      if (!live.length) return;
      if (drop) paintDrop(live, today);
      if (shipped) paintShipped(live);
    } catch {
      // The markup already holds the entries that were public when it was written.
    } finally {
      clearTimeout(timeout);
    }
  }

  refresh();
})();
