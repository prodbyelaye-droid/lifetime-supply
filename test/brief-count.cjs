const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../js/brief-count.js'), 'utf8');
const now = Date.parse('2026-11-22T02:12:00Z');

async function display(payload, currentTime = now) {
  const labels = Array.from({length: 7}, () => ({textContent: 'artist briefs'}));
  const document = {hidden: false, querySelectorAll: () => labels, addEventListener() {}};
  const delays = [];
  vm.runInNewContext(source, {
    document, window: {addEventListener() {}}, Intl, AbortController, Date: {now: () => currentTime},
    fetch: async (url, init) => {
      assert.equal(url, 'https://portal.elaye.store/api/public/brief-count');
      assert.equal(init.credentials, 'omit');
      return {ok: payload !== null, json: async () => payload};
    },
    setTimeout: (_, delay) => { delays.push(delay); }, clearTimeout() {},
  });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(new Set(labels.map(label => label.textContent)).size, 1);
  return {label: labels[0].textContent, next: delays.at(-1)};
}

test('Every landing count rounds down to ten, and small totals keep their exact value', async () => {
  for (const [open, label] of [[162, '160+ live briefs'], [10, '10+ live briefs'], [2, '2 live briefs'], [1, '1 live brief'], [0, '0 live briefs']]) {
    assert.equal((await display({open, checkedAt: now, countedAt: now})).label, label);
  }
});
test('Failures, outdated reads, invalid figures and a previous Board day use count-free copy', async () => {
  const midnight = Date.parse('2026-11-22T13:00:00Z');
  for (const payload of [null, {}, {open:-1,checkedAt:now,countedAt:now}, {open:162,checkedAt:now-600000,countedAt:now},
    {open:162, checkedAt:now-400000,countedAt:now-400000}]) assert.equal((await display(payload)).label,'artist briefs');
  const snapshot = {open:162,checkedAt:midnight-1000,countedAt:midnight-1000};
  assert.equal((await display(snapshot,midnight-1000)).next,1000);
  assert.equal((await display(snapshot,midnight)).label,'artist briefs');
});
test('Raw HTML and search metadata carry no dated numeric brief claim', () => {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'),'utf8');
  // COPYOUT (27 Nov, his 21:49 words, relayed): "200+" and "by the end of the week" are cut from both landing lines.
  // This replaces the 22 Nov (21:09) exception that kept "200+ live briefs by the end of the week" in "what i'm building":
  // no figure is allowed anywhere; the live count is the only number shown for today.
  assert.doesNotMatch(html,/\d+\+ live (?:artist )?briefs/);
  // 22 Nov (fix-landing-drop): the board tab's figure line was the one fixed "160+" left; it now follows the count too.
  // WORDS-PROPOSED (22 Nov): with the "and so much more." marquee cut, its two copies of the board chip go too.
  // JOB7 (22 Nov): the new update map adds two, on the board card's line and its first name.
  // COPYFIX (22 Nov, COPY-OUT fix 8): the first name goes back to plain words, so the count shows once on that card.
  assert.equal((html.match(/data-open-briefs/g) || []).length,7);
  assert.doesNotMatch(html.replace(/<[^>]+>/g,''),/\d+\+\s*live (?:artist )?briefs/);
  assert.match(html,/href="https:\/\/portal\.elaye\.store\/briefs" data-open-briefs/);
});
