/* Selected Downloads B: single publication switch across static, server and JS. No network. */
const assert = require('node:assert/strict');
const test = require('node:test');
const vm = require('node:vm');
const {read, sourceFor, gate, server, dynamic} = require('./contact-download-fixtures.cjs');
const {PRICE_CHANGE, CHECKOUT_599} = require('../lib/offer');
const expected = [
  'https://github.com/prodbyelaye-droid/lifetime-supply-desktop/releases/download/v1.0.3/Lifetime-Supply-mac.dmg',
  'https://github.com/prodbyelaye-droid/lifetime-supply-desktop/releases/download/v1.0.3/Lifetime-Supply-windows.exe',
];
const block = /<!-- desktop-downloads:start -->([\s\S]*?)<!-- desktop-downloads:end -->/;
function check(html, enabled) {
  const links = [...html.matchAll(/href="([^"]*lifetime-supply-desktop[^"]*)"/g)].map(m => m[1]);
  assert.deepEqual(links, enabled ? expected : []);
  // redesign 1112 (L7): the live block sets 'download for' small over the platform name
  for (const label of ['mac', 'windows']) assert(html.includes(enabled ? '<small>download for</small><b>' + label + '</b>' : 'download for ' + label));
  assert(!html.includes('v1.0.0/'));
  assert(!/releases\/download\/v1\.0\.[12]\//.test(html), 'published downloads use v1.0.3');
  assert(!html.includes('/releases/latest/'));
  if (!enabled) {
    assert(html.includes('href="https://portal.elaye.store/login"'));
    assert(!html.includes('github.com'), 'no installer URL in unavailable markup');
    assert.equal((html.match(/disabled aria-disabled="true"/g) || []).length, 2);
    assert(html.includes('downloads are not available yet.'));
    assert(html.includes('use the portal in your browser.'));
    assert(!html.includes('lifetime supply for mac and windows.'));
    assert(html.includes('the portal,</span>'), 'today\'s heading until publication');
    for (const button of html.match(/<button class="dl-btn"[^>]*>/g) || []) {
      assert(!/href|tabindex|onclick/.test(button));
      assert(button.includes('type="button"'));
    }
  } else {
    assert(!html.includes('downloads are not available yet.'));
    assert(!html.includes('aria-disabled="true"'));
    assert(html.includes('lifetime supply for mac and windows.'));
    assert(html.includes('the whole setup.<br>now an <em>app</em>.'), 'copy check row 1 heading when live (L7 markup)');
    assert(html.includes('open anyway in privacy &amp; security.'), 'L1: the one-time open-anyway line in the live state');
  }
}
test('only exact string true enables publication; all other values fail closed', () => {
  for (const value of ['false', '', 'TRUE', 'True', '1', ' true ', true, false, 1, null, undefined]) {
    const context = {module: {exports: {}}};
    vm.runInNewContext(sourceFor(value), context);
    assert.equal(context.module.exports.enabled, false);
    check(context.module.exports.render(), false);
  }
  assert.equal(gate('true').enabled, true);
  check(gate('true').render(), true);
});
test('checked-in static/noJS fallback is ON (release 1105 publication) and generated exactly from the switch', () => {
  const downloads = require('../js/desktop-downloads');
  assert.equal(downloads.enabled, true);
  assert.equal(downloads.applyToTemplate(read('index.html')), read('index.html'));
  check(read('index.html'), true);
  assert.equal(read('index.html').match(block)[1], downloads.render());
});
test('static, server and JS agree in both states; generation is idempotent', () => {
  for (const value of ['false', 'true']) {
    const downloads = gate(value);
    const staticHTML = downloads.applyToTemplate(read('index.html'));
    for (const html of [staticHTML, server(downloads).render(), dynamic(downloads, gate().render())]) {
      check(html, downloads.enabled);
      assert(html.includes(downloads.render()));
    }
    assert.equal(downloads.applyToTemplate(staticHTML), staticHTML);
  }
});
test('server corrects stale markup before the current-offer early return', () => {
  assert(!read('index.html').includes(CHECKOUT_599));
  for (const value of ['false', 'true']) {
    const downloads = gate(value), other = gate(value === 'true' ? 'false' : 'true');
    const stale = other.applyToTemplate(read('index.html'));
    check(server(downloads, stale).render(), downloads.enabled);
  }
});
test('legacy offer path also renders the publication gate', () => {
  const legacy = read('index.html').replaceAll('https://buy.stripe.com/00w8wQdRa0NS5Ybbqa9AA04', CHECKOUT_599);
  for (const value of ['false', 'true']) for (const now of [PRICE_CHANGE - 1, PRICE_CHANGE]) {
    check(server(gate(value), legacy).render(now), value === 'true');
  }
});
test('browser module is frozen and ignores query, storage, environment and render arguments', () => {
  for (const value of ['false', 'true']) {
    const context = {
      window: {location: {search: '?desktopDownloads=true&downloads=preview'}, localStorage: {getItem: () => 'true'}},
      process: {env: {PUBLICATION: 'true', DESKTOP_DOWNLOADS_ENABLED: 'true'}},
    };
    vm.runInNewContext(sourceFor(value), context);
    assert.equal(context.window.LSDownloads.enabled, value === 'true');
    assert.equal(context.window.LSDownloads.render('true'), gate(value).render());
    assert(Object.isFrozen(context.window.LSDownloads));
  }
});
test('missing browser gate retains safe static fallback; JS corrects stale enabled controls', () => {
  const fallback = read('index.html').match(block)[1];
  assert.equal(dynamic(undefined, fallback), fallback);
  check(dynamic(gate(), gate('true').render()), false);
  const query = '?downloads=preview&desktopDownloads=true&dl=a&dlplace=under&dlphone=1';
  assert.equal(dynamic(gate('true'), fallback, query), fallback);
});
test('redesign 1112: the download section is L7, after founder and before the price band, no historical hooks', () => {
  const html = read('index.html');
  const section = html.match(/<section class="l7-dl"[\s\S]*?<\/section>/)[0];
  assert.equal((html.match(/id="download"/g) || []).length, 1);
  assert(!section.includes('data-launch-gate'));
  assert(!html.includes('data-downloads="shown"'));
  assert(!section.includes('phone app soon'));
  assert(html.indexOf('id="founder"') < html.indexOf('id="download"'));
  assert(html.indexOf('id="download"') < html.indexOf('id="steps"'));
  assert(!html.includes('js/downloads-017.js'), 'nothing rewrites the block in the browser');
});
test('missing or duplicate publication blocks fail closed', () => {
  assert.throws(() => gate().applyToTemplate(''), /Expected one/);
  assert.throws(() => gate().applyToTemplate(read('index.html').repeat(2)), /Expected one/);
});
test('HTTP GET/HEAD remain no-store and reject POST in both publication states', () => {
  for (const value of ['false', 'true']) for (const method of ['GET', 'HEAD', 'POST']) {
    const response = {headers: {}, setHeader(k, v) {this.headers[k] = v;}, status(code) {this.code = code; return this;}, send(body) {this.body = body;}, end() {this.body = '';}};
    server(gate(value))({method}, response);
    assert.equal(response.code, method === 'POST' ? 405 : 200);
    if (method === 'POST') assert.equal(response.headers.Allow, 'GET, HEAD');
    else {
      assert.equal(response.headers['Cache-Control'], 'no-store');
      assert.equal(response.headers['Content-Type'], 'text/html; charset=utf-8');
      if (method === 'HEAD') assert.equal(response.body, '');
      else check(response.body, value === 'true');
    }
  }
});

test('selected section has no orphaned unconditional display-none rule', () => {
  assert(!/\.dl17\s*\{\s*display\s*:\s*none/.test(read('css/downloads-017.css')));
});
