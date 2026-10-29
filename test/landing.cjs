/* Landing page contract (task 016: the old-layout checks for the retired bundle links, portal demo tabs, quotes and
 * folder hero are replaced by checks of the current page). Every payment and fallback check is kept: four CTAs on
 * the live checkout, the price card and its inclusions, the CTA focus ring, no background video, and the page with no
 * script, with the page script blocked and with the launch media blocked.
 * Run: node test/landing.cjs (set PLAYWRIGHT_MODULE / PW_CHANNEL=chrome if needed; SHOTS_DIR for captures). */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
process.chdir(path.join(__dirname, '..'));
const {render} = require('../api/landing');
const LIVE = 'https://buy.stripe.com/00w8wQdRa0NS5Ybbqa9AA04';
const output = process.env.SHOTS_DIR || '/tmp/lifetime-landing-review';
fs.mkdirSync(output, {recursive: true});
const types = {'.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.mp4': 'video/mp4', '.woff2': 'font/woff2', '.json': 'application/json'};
const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  if (pathname === '/' || pathname === '/index.html') { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(render()); return; }
  const file = path.join(process.cwd(), decodeURIComponent(pathname));
  if (!file.startsWith(process.cwd() + path.sep)) { res.writeHead(403); res.end(); return; }
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, {'Content-Type': types[path.extname(file)] || 'application/octet-stream'});
  fs.createReadStream(file).pipe(res);
});
const NOTE = 'your music and rights stay yours. sending is never a guaranteed placement.';
(async () => {
  server.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  const browser = await chromium.launch({headless: true, channel: process.env.PW_CHANNEL || undefined});
  const base = process.env.TEST_URL || `http://127.0.0.1:${server.address().port}`;
  const results = [];
  try {
    for (const width of [1440, 390]) for (const reducedMotion of ['no-preference', 'reduce']) {
      const context = await browser.newContext({viewport: {width, height: width === 390 ? 844 : 1000}, reducedMotion});
      const page = await context.newPage();
      const errors = [], missing = [], videos = [];
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('response', (r) => { if (r.status() === 404) missing.push(r.url()); });
      page.on('request', (r) => { if (r.url().endsWith('.mp4')) videos.push(r.url()); });
      await page.goto(base, {waitUntil: 'networkidle'});
      await page.waitForFunction(() => window.assembly);
      await page.evaluate(() => window.assembly.skip());
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width, 'page width');
      // the hero: the heading, log in and the checkout CTA
      assert.match(await page.locator('h1').innerText(), /my whole setup\.\s*yours forever\./);
      assert.equal(await page.locator('.hero-login').getAttribute('href'), 'https://portal.elaye.store/login');
      await page.screenshot({path: `${output}/${width}-${reducedMotion}-hero.png`});
      // payments: four CTAs, all the live checkout, opening safely in a new tab
      const ctas = page.locator('a[data-checkout]');
      assert.equal(await ctas.count(), 4, 'four checkout CTAs');
      for (let i = 0; i < 4; i++) {
        assert.equal(await ctas.nth(i).getAttribute('href'), LIVE);
        assert.equal(await ctas.nth(i).getAttribute('target'), '_blank');
        assert.match(await ctas.nth(i).getAttribute('rel'), /noopener/);
      }
      // the film: one player, a poster frame, metadata only until it is on screen
      const film = page.locator('.film-player');
      assert.equal(await page.locator('video').count(), 1, 'the launch film is the only video');
      assert.equal(await film.getAttribute('preload'), 'metadata');
      assert.equal(await film.getAttribute('poster'), 'assets/launch/lifetime-film-frame.jpg');
      assert.equal(await film.evaluate((v) => v.controls), false, 'the scripted preview hides native controls');
      await page.locator('.demo-film').scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      assert(await page.locator('.film-cover').isVisible() || (await film.evaluate((v) => v.currentTime)) >= 6, 'the film shows its own frame until the preview is past the intro');
      // the price: card, buy button, inclusions open, the note, and the details toggle by mouse and keyboard
      await page.locator('#price').scrollIntoViewIfNeeded();
      const includes = page.locator('.price-includes'), summary = includes.locator('summary'), note = page.locator('.price-note');
      assert.equal(await includes.evaluate((el) => el.open), true, 'inclusions open on load');
      assert.equal(await page.locator('.price-list li').count(), 8);
      assert.equal(await note.innerText(), NOTE);
      assert.equal(await page.locator('.price-card a[data-checkout]').getAttribute('href'), LIVE);
      await page.locator('.price-card a[data-checkout]').focus();
      assert.notEqual(await page.locator('.price-card a[data-checkout]').evaluate((el) => getComputedStyle(el).outlineStyle), 'none', 'the buy button shows focus');
      await summary.click(); assert.equal(await includes.evaluate((el) => el.open), false); assert(await note.isVisible());
      await summary.click(); assert.equal(await includes.evaluate((el) => el.open), true);
      await summary.focus();
      for (const key of ['Enter', 'Space']) {
        await summary.press(key); assert.equal(await includes.evaluate((el) => el.open), false);
        await summary.press(key); assert.equal(await includes.evaluate((el) => el.open), true);
      }
      // the inclusions are a labelled region; on a phone, where they scroll sideways, it is a tab stop
      const region = page.locator('.price-scroll[role="region"][aria-label="everything included"]');
      assert.equal(await region.count(), 1);
      if (width === 390) {
        assert.equal(await region.getAttribute('tabindex'), '0');
        assert(await region.evaluate((el) => el.scrollWidth > el.clientWidth), 'the phone list scrolls sideways');
      } else assert.equal(await region.getAttribute('tabindex'), null, 'no extra tab stop where nothing scrolls');
      await page.screenshot({path: `${output}/${width}-${reducedMotion}-price.png`});
      // no background video: only the launch film may be requested
      assert(videos.every((url) => url.endsWith('/assets/launch/lifetime-film.mp4')), 'no background video downloads');
      assert.deepEqual(errors, []); assert.deepEqual(missing, []);
      results.push({width, reducedMotion, errors, missing, videoRequests: videos.length});
      await context.close();
    }
    // fallbacks: the page works with no script, with the page script blocked, and with the launch media blocked
    for (const failure of ['no-js', 'script-blocked', 'media-blocked']) {
      const context = await browser.newContext({viewport: {width: 390, height: 844}, javaScriptEnabled: failure !== 'no-js'});
      const page = await context.newPage();
      if (failure === 'script-blocked') await page.route('**/js/assembly.js', (r) => r.abort());
      if (failure === 'media-blocked') await page.route('**/assets/launch/*', (r) => r.abort());
      await page.goto(base, {waitUntil: 'networkidle'});
      assert(await page.locator('h1').isVisible());
      for (const id of ['#inside', '#features', '#price']) assert(await page.locator(id).isVisible(), id + ' visible');
      assert.equal(await page.locator('.price-includes').evaluate((el) => el.open), true);
      assert.equal(await page.locator('.price-list li').count(), 8);
      assert.equal(await page.locator('.price-card a[data-checkout]').getAttribute('href'), LIVE);
      assert.equal(await page.locator('a[data-checkout]').count(), 4);
      if (failure === 'no-js') {
        assert.equal(await page.locator('.film-cover').isVisible(), false, 'no cover over the player without scripts');
        assert.equal(await page.locator('.film-player').evaluate((v) => v.controls && !v.inert), true, 'the film plays with native controls');
      }
      await page.screenshot({path: `${output}/390-${failure}.png`, fullPage: true});
      results.push({failure, ok: true});
      await context.close();
    }
    fs.writeFileSync(`${output}/results.json`, JSON.stringify(results, null, 2));
    console.log('Landing contract: hero, four live CTAs, film, price and inclusions at 1440 and 390 with and without reduced motion; no-js, script-blocked and media-blocked fallbacks: passed.');
  } finally { await browser.close(); server.close(); }
})().catch((error) => { console.error(error); server.close(); process.exitCode = 1; });
