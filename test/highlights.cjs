/* Film and keyboard contract (task 016: the retired eight-card highlights section is gone from the page; its checks
 * are replaced by the current page's media and keyboard paths). "watch the demo" plays the launch film from the
 * start with sound and controls; the phone inclusions scroll from the keyboard; and the film still plays with no
 * script, with its script blocked, and shows its frame when the video is blocked.
 * Run against a server with TEST_URL, or it serves the worktree itself. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
process.chdir(path.join(__dirname, '..'));
const output = process.env.SHOTS_DIR || '/tmp/lifetime-film-review';
fs.mkdirSync(output, {recursive: true});
const types = {'.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.mp4': 'video/mp4', '.woff2': 'font/woff2'};
const server = http.createServer((req, res) => {
  let pathname = new URL(req.url, 'http://localhost').pathname;
  if (pathname === '/') pathname = '/index.html';
  const file = path.join(process.cwd(), decodeURIComponent(pathname));
  if (!file.startsWith(process.cwd() + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, {'Content-Type': types[path.extname(file)] || 'text/html'});
  fs.createReadStream(file).pipe(res);
});
(async () => {
  server.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  const base = process.env.TEST_URL || `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({headless: true, channel: process.env.PW_CHANNEL || undefined});
  try {
    for (const width of [1440, 390]) {
      const context = await browser.newContext({viewport: {width, height: width === 1440 ? 1000 : 844}, reducedMotion: 'no-preference'});
      const page = await context.newPage(), errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto(base, {waitUntil: 'domcontentloaded'});
      await page.waitForFunction(() => window.assembly); await page.evaluate(() => window.assembly.skip());
      const film = page.locator('.film-player');
      // "watch the demo": the film from the start, with sound and controls
      await page.locator('.watch-demo').first().click();
      await page.waitForFunction(() => { const v = document.querySelector('.film-player'); return !v.paused && v.currentTime > 0; }, null, {timeout: 15000});
      assert.deepEqual(await film.evaluate((v) => [v.muted, v.controls, v.currentTime < 5]), [false, true, true]);
      assert.equal(await page.locator('.film-cover').isVisible(), false);
      await page.screenshot({path: `${output}/${width}-watch.png`});
      await film.evaluate((v) => v.pause());
      // the phone inclusions: a labelled region that scrolls from the keyboard
      if (width === 390) {
        const region = page.locator('.price-scroll');
        await region.scrollIntoViewIfNeeded(); await region.focus();
        assert.equal(await page.evaluate(() => document.activeElement.getAttribute('aria-label')), 'everything included');
        const before = await region.evaluate((el) => el.scrollLeft);
        await page.keyboard.press('ArrowRight'); await page.waitForTimeout(400);
        assert(await region.evaluate((el) => el.scrollLeft) > before, 'arrow keys scroll the inclusions');
      }
      assert.deepEqual(errors, []); console.log(`PASS film and keyboard ${width}`);
      await context.close();
    }
    for (const mode of ['no-js', 'script-blocked', 'video-blocked']) {
      const context = await browser.newContext({viewport: {width: 390, height: 844}, javaScriptEnabled: mode !== 'no-js'}), page = await context.newPage();
      if (mode === 'script-blocked') await page.route('**/js/demo.js', (r) => r.abort());
      if (mode === 'video-blocked') await page.route('**/assets/launch/*.mp4', (r) => r.abort());
      await page.goto(base, {waitUntil: 'domcontentloaded'});
      const film = page.locator('.film-player');
      assert.equal(await film.count(), 1);
      assert.equal(await film.getAttribute('poster'), 'assets/launch/lifetime-film-poster.jpg');
      if (mode === 'no-js') {
        assert.equal(await film.evaluate((v) => v.controls), true, 'native controls without scripts');
        assert.equal(await page.locator('.film-cover').isVisible(), false);
      } else assert(await page.locator('.film-cover').isVisible() || await film.evaluate((v) => v.controls), 'the frame shows, or the player can be used');
      assert.equal(await film.locator('a[href="assets/launch/lifetime-film.mp4"]').count(), 1, 'a direct link for browsers without video');
      console.log('PASS fallback ' + mode); await context.close();
    }
  } finally { await browser.close(); server.close(); }
})().catch((e) => { console.error(e); server.close(); process.exitCode = 1; });
