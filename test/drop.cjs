/* js/drop.js (fix-landing-drop, 22 Nov 2026): the drop band and the update board head follow the public changelog feed.
 * Run: node --test test/drop.cjs */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../js/drop.js'), 'utf8');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const now = Date.parse('2026-11-22T04:00:00Z');   // 15:00 Sunday 22 Nov, Sydney

function node(tag) {
  return {tag, className: '', textContent: '', children: [], dateTime: '', href: '',
    append(...k) { this.children.push(...k); }, replaceChildren(...k) { this.children = k; }};
}
const text = (n) => [n.textContent, ...n.children.map(text)].join(' ').replace(/\s+/g, ' ').trim();

async function run(feed, {ok = true, at = now} = {}) {
  const drop = node('ol'), shipped = node('div');
  drop.children = [node('li')]; shipped.children = [node('div')];   // the shipped markup stays unless replaced
  const document = {querySelector: (s) => (s === '[data-drop-list]' ? drop : s === '[data-shipped-list]' ? shipped : null),
    createElement: node};
  vm.runInNewContext(source, {document, Intl, AbortController, setTimeout: () => 0, clearTimeout() {},
    Date: Object.assign(function () {}, {now: () => at, UTC: Date.UTC}),
    fetch: async (url, init) => {
      assert.equal(url, 'https://portal.elaye.store/api/public/activity');
      assert.equal(init.credentials, 'omit');
      return {ok, json: async () => feed};
    }});
  await new Promise((r) => setImmediate(r));
  await new Promise((r) => setImmediate(r));
  return {drop, shipped};
}
const week = (shipped) => ({weeks: [{shipped}]});
const e = (date, title, line = 'a line.') => ({date, title, line});

test('The page ships with the 22 Nov entry from the public changelog, dated, and no clock time', () => {
  assert.match(html, /data-drop-list><li class="ls-drop__row"><time class="ls-drop__date" datetime="2026-11-22">22 Nov<\/time>/);
  assert.match(html, /<p class="ls-drop__t">plan a studio day<\/p>/);
  assert.match(html, /data-shipped-list>\s*<div class="l8-shipped">\s*<time datetime="2026-11-22">22 Nov<\/time>/);
  const bandStart = html.indexOf('id="drop"');
  const band = html.slice(bandStart, html.indexOf('</section>', bandStart));
  assert.doesNotMatch(band, /\b\d{1,2}(:\d{2})?\s?(am|pm)\b|\b\d{1,2}:\d{2}\b/i, 'no clock time in the drop band');
  assert.doesNotMatch(band, /120\+|\blive\b/, 'no feature count and no "live" claim in the drop band');
});

test('The band lists the last 14 days newest first; the board head takes the two newest; dates read "22 Nov"', async () => {
  const {drop, shipped} = await run({weeks: [
    {shipped: [e('2026-11-22', 'plan a studio day'), e('2026-11-21', 'the vault player')]},
    {shipped: [e('2026-11-08', 'too old for the band')]},
    {shipped: [e('2026-10-22', 'upload to a brief')]}]});
  assert.deepEqual(drop.children.map((li) => li.children[0].textContent), ['22 Nov', '21 Nov']);
  assert.equal(drop.children[0].children[0].dateTime, '2026-11-22');
  assert.match(text(drop), /plan a studio day/);
  assert.doesNotMatch(text(drop), /too old/);
  assert.equal(shipped.children.length, 2);
  assert.match(text(shipped.children[0]), /22 Nov plan a studio day .* public changelog/);
  assert.doesNotMatch(text(shipped.children[1]), /public changelog/);
});

test('Nothing in the last 14 days: the band shows the newest one only', async () => {
  const {drop} = await run(week([e('2026-10-22', 'upload to a brief'), e('2026-10-01', 'older')]));
  assert.equal(drop.children.length, 1);
  assert.match(text(drop), /22 Oct upload to a brief/);
});

test('Failures, empty or malformed feeds and future dates leave the shipped markup alone', async () => {
  for (const [feed, opts] of [[null, {ok: false}], [{}, {}], [{weeks: 'x'}, {}], [week([{date: '22 Nov', title: 'x', line: 'y'}]), {}],
    [week([e('2026-11-22', '')]), {}], [week([e('2026-11-29', 'not yet')]), {}]]) {
    const {drop, shipped} = await run(feed, opts);
    assert.equal(drop.children[0].tag, 'li');
    assert.equal(drop.children[0].className, '', 'the original row is untouched');
    assert.equal(shipped.children[0].className, '');
  }
});

test('Titles and lines are written as text, never as markup', async () => {
  const {drop} = await run(week([e('2026-11-22', '<img src=x onerror=alert(1)>', '<b>bold</b>')]));
  const row = drop.children[0].children[1];
  assert.equal(row.children[0].textContent, '<img src=x onerror=alert(1)>');
  assert.equal(row.children[1].textContent, '<b>bold</b>');
});
