/* Landing page contract (task 016: the old-layout checks for the retired bundle links, portal demo tabs, quotes and
 * folder hero are replaced by checks of the current page). Every payment and fallback check is kept: four CTAs on
 * the live checkout, the price card and its inclusions, the CTA focus ring, no video beyond the launch film and the
 * whitelisted blot clips (owner decision 4 Nov 14:53/15:09: his blot clips play on the page), and the page with no
 * script, with the page script blocked and with the launch media blocked.
 * The trusted-by strip (4 Nov 15:50-17:17): the exact heading, 33 unique names in his order in three rows of 11, a photo
 * per tile, the unreleased-artists line with his meme, no YSN Fab, a loop copy that
 * is aria-hidden, paused by the header control and by hover, and standing still (scroll by hand) under reduced motion.
 * Run: node test/landing.cjs (set PLAYWRIGHT_MODULE / PW_CHANNEL=chrome if needed; SHOTS_DIR for captures). */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
process.chdir(path.join(__dirname, '..'));
const {render} = require('../api/landing');
const LIVE = 'https://buy.stripe.com/00w8wQdRa0NS5Ybbqa9AA04';
// the trusted-by strip (Elaye, 4 Nov 15:50-16:03, photos 17:17): his exact heading and his 33 artists in his order, each
// with his photo. Never YSN Fab.
const TRUSTED_HEADING = "artists i've produced for.";
const TRUSTED = ['Lil Durk', 'Tory Lanez', 'Yung Bleu', 'Antonio Brown', 'Toosii', 'Yungeen Ace', 'Glokknine', 'Jim Jones',
  'YFN Lucci', 'D Savage', 'Smiley', 'Foolio', 'DC The Don', 'A-Reece', 'Nasty C', 'YK Osiris', 'Lil Poppa', 'CJ',
  'Too $hort', 'ONEFOUR', 'Jai Waetford', 'Moneyman', 'OMB Peezy', 'KCAMP', 'Omeretta', 'Ann Marie',
  'Derez Deshon', 'FCG Heem', 'K-Trap', 'Kidszn', 'Krispylife Kidd', 'Slatt Zy', 'SSG Splurge'];
const TRUSTED_MORE = 'not counting the unreleased artists in the vault.';
const MEME_ALT = 'meme: me carrying a giant backpack labelled unreleased music';
const trustedMore = async (page) => ({text: (await page.locator('#trusted .tr1104__more').textContent()).replace(/\s+/g, ' ').trim(), alt: await page.locator('#trusted .tr1104__more img.tr1104__meme').getAttribute('alt')});
const NO_YSN = /ysn[\s_-]*fab/i;
// the muso cover float (Elaye 15:59) renders only with 6+ of his covers in assets/muso-covers-1104/; else #founder is untouched
const MUSO_COVERS = fs.existsSync('assets/muso-covers-1104') ? fs.readdirSync('assets/muso-covers-1104').filter((f) => !f.startsWith('.') && /\.(jpe?g|webp|png)$/i.test(f)).length : 0;
const trustedNames = (page) => page.locator('#trusted .tr1104__set:not([aria-hidden="true"]) .tr1104__tile').evaluateAll((ts) => ts.map((t) => (t.querySelector('.tr1104__name') || t.querySelector('.tr1104__type')).textContent.trim()));
const output = process.env.SHOTS_DIR || '/tmp/lifetime-landing-review';
fs.mkdirSync(output, {recursive: true});
const types = {'.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.mp4': 'video/mp4', '.webm': 'video/webm', '.woff2': 'font/woff2', '.json': 'application/json'};
const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  if (pathname === '/' || pathname === '/index.html') { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(render()); return; }
  const file = path.join(process.cwd(), decodeURIComponent(pathname));
  if (!file.startsWith(process.cwd() + path.sep)) { res.writeHead(403); res.end(); return; }
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, {'Content-Type': types[path.extname(file)] || 'application/octet-stream'});
  fs.createReadStream(file).pipe(res);
});
(async () => {
  // redesign 1112 (L1 to L10 from the finals): the old-layout checks are replaced by the redesigned page's contract.
  server.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  const base = process.env.TEST_URL || `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({headless: true, channel: process.env.PW_CHANNEL || undefined});
  try {
    for (const width of [1440, 390]) {
      for (const reducedMotion of ['no-preference', 'reduce']) {
        const context = await browser.newContext({viewport: {width, height: width < 700 ? 844 : 900}, reducedMotion});
        await context.route('**/*', (r) => ['127.0.0.1', 'localhost'].includes(new URL(r.request().url()).hostname) ? r.continue() : r.abort());
        const page = await context.newPage(), errors = [];
        page.on('pageerror', (e) => errors.push(e.message));
        await page.goto(base, {waitUntil: 'load'});
        await page.waitForTimeout(400);
        // one checkout, the live link, opening in a new tab
        const checkouts = await page.locator('a[href*="buy.stripe.com"]').evaluateAll((as) => as.map((a) => [a.href, a.target, a.hasAttribute('data-checkout'), a.textContent.trim()]));
        assert.deepEqual(checkouts, [[LIVE, '_blank', true, 'get lifetime access']]);
        assert.equal((await page.locator('[data-price] .l8-price__n').textContent()).trim(), '$699');
        // no video but the launch film; no blot clips, no blot images
        assert.equal(await page.locator('video.bv-video, .bv-box').count(), 0, 'no blot clips (his 14:39 call)');
        assert.equal(await page.locator('img[src*="blot"]').count(), 0, 'no blob anywhere');
        // the sections in page order, every nav anchor lands
        const order = await page.evaluate(() => ['top', 'portal', 'how-the-board-works', 'flow', 'inside', 'more', 'hear', 'founder', 'trusted', 'why-producers-choose', 'members-say', 'giveaways', 'we-got-one', 'download', 'steps', 'price', 'updates', 'questions', 'close', 'contact', 'footer'].map((id) => { const e = document.getElementById(id); return e ? e.getBoundingClientRect().top + scrollY : null; }));
        assert(order.every((y) => y !== null), 'every section id is on the page');
        for (const href of await page.locator('a[href^="#"]').evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute('href')))])) assert(href === '#' || await page.locator(href).count() === 1, href + ' lands');
        // the trusted strip keeps his heading, his 33 names in order and the unreleased line; never YSN Fab
        assert.equal((await page.locator('#trusted-title').textContent()).trim(), TRUSTED_HEADING);
        assert.deepEqual(await trustedNames(page), TRUSTED);
        assert(!NO_YSN.test(await page.locator('body').innerText()));
        // no sideways scroll, no script errors
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, 'no sideways scroll at ' + width);
        assert.deepEqual(errors, []);
        console.log(`PASS ${width} ${reducedMotion}`);
        await context.close();
      }
    }
    // without scripts the checkout and the contact fallback still work
    const context = await browser.newContext({viewport: {width: 390, height: 844}, javaScriptEnabled: false}), page = await context.newPage();
    await page.goto(base, {waitUntil: 'load'});
    assert.equal(await page.locator('a[data-checkout]').getAttribute('href'), LIVE);
    assert.equal(await page.locator('form[data-contact-mailto]').getAttribute('action'), 'mailto:hi@elaye.store');
    console.log('PASS no-js'); await context.close();
  } finally {
    await browser.close(); server.close();
  }
})().catch((error) => { console.error(error); process.exit(1); });
