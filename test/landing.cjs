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
const BLOT_VIDEOS = ['bv-keys', 'bv-workflow']; // page order
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
      page.on('request', (r) => { if (/\.(mp4|webm)$/.test(new URL(r.url()).pathname)) videos.push(r.url()); });
      await page.goto(base, {waitUntil: 'domcontentloaded'});
      await page.waitForFunction(() => window.assembly);
      await page.evaluate(() => window.assembly.skip());
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width, 'page width');
      // the hero: the heading, log in and the checkout CTA
      assert.match(await page.locator('h1').innerText(), /the whole setup\s*i run my career from\./);
      assert.equal(await page.locator('.header-login').getAttribute('href'), 'https://portal.elaye.store/login');
      await page.screenshot({path: `${output}/${width}-${reducedMotion}-hero.png`});
      // payments: one checkout CTA, the buy card (Elaye 6 Nov 18:08: hero, step 1 and the close link to #price), opening safely in a new tab
      const ctas = page.locator('a[data-checkout]');
      assert.equal(await ctas.count(), 1, 'one checkout CTA');
      assert.equal(await page.locator('.hero-cta').getAttribute('href'), '#price');
      for (let i = 0; i < 1; i++) {
        assert.equal(await ctas.nth(i).getAttribute('href'), LIVE);
        assert.equal(await ctas.nth(i).getAttribute('target'), '_blank');
        assert.match(await ctas.nth(i).getAttribute('rel'), /noopener/);
      }
      // the film: one player, a poster frame, metadata only until it is on screen
      const film = page.locator('.film-player');
      // Owner decision (Elaye, 4 Nov 14:53 and 15:09): his blot clips play on the page. They are whitelisted by id here; any
      // other <video> still fails. #studio-film-video is the 1101 studio film (the same blot mixer clip); the bv-* ids
      // are the 1104 clips (js/blot-video-1104.js): muted, looped, inline, poster = first frame, sources only near view.
      assert.equal(await page.locator('video:not(#studio-film-video):not(#bv-keys):not(#bv-workflow)').count(), 1, 'the launch film is the only video besides the whitelisted blot clips');
      assert.deepEqual(await page.locator('video.bv-video').evaluateAll((vs) => vs.map((v) => v.id)), BLOT_VIDEOS, 'exactly the whitelisted blot clips');
      for (const v of await page.locator('video.bv-video').evaluateAll((vs) => vs.map((v) => ({id: v.id, muted: v.muted, loop: v.loop, inline: v.playsInline, auto: v.autoplay, preload: v.preload, controls: v.controls, hidden: v.getAttribute('aria-hidden'), poster: v.getAttribute('poster'), sources: [...v.querySelectorAll('source')].map((s) => s.dataset.src)})))) {
        assert(v.muted && v.loop && v.inline && v.auto && !v.controls && v.hidden === 'true' && v.preload === 'none', v.id + ' is a silent decorative loop');
        assert.match(v.poster, /^brand\/current\/blot-video\/bv-[a-z]+-\d+-poster\.jpg$/, v.id + ' poster');
        assert(v.sources.length === 2 && v.sources.every((src) => /^brand\/current\/blot-video\/bv-[a-z]+-\d+\.(webm|mp4)$/.test(src)), v.id + ' sources');
      }
      assert.equal(await film.getAttribute('preload'), 'metadata');
      assert.equal(await film.getAttribute('poster'), 'assets/launch/lifetime-film-poster-1105.jpg');
      assert.equal(await film.evaluate((v) => v.controls), false, 'the scripted preview hides native controls');
      // the film is out for now (Elaye 5 Nov 15:18, the new trailer posts tonight): the block stays in the markup, hidden, one attribute from coming back
      assert.equal(await page.locator('#demo').getAttribute('hidden'), '', 'the film block carries the hidden attribute');
      assert.equal(await page.locator('#demo').isVisible(), false, 'the film block does not show');
      // the trusted-by strip: one section, the exact heading, 33 unique names in three rows of 11, a photo on every tile,
      // the line under the rows with his meme, no YSN Fab anywhere
      const strip = page.locator('#trusted');
      assert.equal(await strip.count(), 1, 'one trusted-by strip');
      assert.equal((await page.locator('#trusted-title').textContent()).replace(/\s+/g, ' ').trim(), TRUSTED_HEADING, 'the trusted heading, exact');
      const names = await trustedNames(page);
      assert.equal(new Set(names).size, 33, '33 unique artist names');
      assert.deepEqual(names, TRUSTED, 'the artists in his order');
      assert.deepEqual(await page.locator('#trusted .tr1104__row').evaluateAll((rs) => rs.map((r) => r.querySelectorAll('.tr1104__set:not([aria-hidden="true"]) .tr1104__tile').length)), [11, 11, 11], 'three rows of 11');
      assert(!NO_YSN.test(await strip.evaluate((el) => el.outerHTML)), 'no YSN Fab in the strip');
      const photos = await page.locator('#trusted .tr1104__set:not([aria-hidden="true"]) .tr1104__tile').evaluateAll((ts) => ts.map((t) => { const img = t.querySelector('.tr1104__slot--photo img'); return img && img.getAttribute('src'); }));
      assert(photos.every((src) => /^assets\/trusted-1104\/[a-z0-9-]+\.webp$/.test(src || '')), 'a photo on every tile');
      assert.equal(new Set(photos).size, 33, 'a different photo for each artist');
      assert.deepEqual(await trustedMore(page), {text: TRUSTED_MORE, alt: MEME_ALT}, 'the unreleased-artists line with his meme');
      assert(!NO_YSN.test(await page.evaluate(() => document.body.innerText)), 'no YSN Fab on the page');
      // the loop copy is aria-hidden, so a screen reader hears each name once
      for (const r of await page.locator('#trusted .tr1104__row').evaluateAll((rs) => rs.map((row) => [...row.querySelectorAll('.tr1104__set')].map((set) => ({hidden: set.getAttribute('aria-hidden'), text: set.textContent}))))) {
        assert(r.length === 2 && r[0].hidden === null && r[1].hidden === 'true' && r[0].text === r[1].text, 'one spoken set and one aria-hidden copy per row');
      }
      await strip.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width, 'no side scroll at the strip');
      const overlap = await page.evaluate(() => document.querySelector('#trusted').getBoundingClientRect().top - document.querySelector('#founder').getBoundingClientRect().bottom);
      assert(overlap >= 0, 'the strip sits after the founder block, clear of it (' + overlap + ')');
      const tracks = page.locator('#trusted .tr1104__track');
      const shift = () => tracks.evaluateAll((ts) => ts.map((t) => new DOMMatrix(getComputedStyle(t).transform).m41));
      await page.waitForFunction(() => [...document.querySelectorAll('#trusted .tr1104__set:not([aria-hidden="true"]) img, #trusted .tr1104__meme')].every((i) => i.complete && i.naturalWidth > 0), null, {timeout: 8000});
      const s1 = await shift(); await page.waitForTimeout(600); const s2 = await shift();
      if (reducedMotion === 'reduce') {
        assert.deepEqual([s1, s2], [[0, 0, 0], [0, 0, 0]], 'reduced motion: the rows stand still');
        assert.deepEqual(await tracks.evaluateAll((ts) => ts.map((t) => getComputedStyle(t).animationName)), ['none', 'none', 'none'], 'reduced motion: no marquee');
        assert.deepEqual(await page.locator('#trusted .tr1104__set[aria-hidden="true"]').evaluateAll((ss) => ss.map((x) => getComputedStyle(x).display)), ['none', 'none', 'none'], 'reduced motion: no loop copy');
        assert(await page.locator('#trusted .tr1104__row').first().evaluate((r) => getComputedStyle(r).overflowX === 'auto' && r.scrollWidth > r.clientWidth), 'reduced motion: a static row that scrolls by hand');
      } else {
        assert(s1.every((x, i) => x !== s2[i]), 'all three trusted rows scroll on their own');
        assert.deepEqual(await tracks.evaluateAll((ts) => ts.map((t) => getComputedStyle(t).animationName)), ['tr1104-left', 'tr1104-right', 'tr1104-left'], 'the rows alternate direction');
        // the header "pause motion" stops the strip, and "play motion" starts it again
        await page.evaluate(() => document.querySelector('#motion-toggle').click());
        await page.waitForTimeout(150);
        const p1 = await shift(); await page.waitForTimeout(600); const p2 = await shift();
        assert.deepEqual(p1, p2, 'the header pause control stops the strip');
        await page.evaluate(() => document.querySelector('#motion-toggle').click());
        await page.waitForTimeout(150);
        const q1 = await shift(); await page.waitForTimeout(600); const q2 = await shift();
        assert(q1[0] !== q2[0], 'play motion starts the strip again');
        if (width === 1440) { // hover pauses (pointer devices only)
          const box = await page.locator('#trusted .tr1104__rows').boundingBox();
          await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
          await page.waitForTimeout(150);
          const h1 = await shift(); await page.waitForTimeout(600); const h2 = await shift();
          assert.deepEqual(h1, h2, 'hover pauses the strip');
          await page.mouse.move(0, 0);
        }
      }
      await strip.screenshot({path: `${output}/${width}-${reducedMotion}-trusted.png`});
      // the muso cover float: present only with 6+ covers, decorative (aria-hidden), and at rest under reduced motion
      const float = page.locator('#founder > .mf1104');
      assert.equal(await float.count(), MUSO_COVERS >= 6 ? 1 : 0, 'the cover float only with 6 or more covers');
      if (MUSO_COVERS >= 6) {
        assert.equal(await float.getAttribute('aria-hidden'), 'true');
        assert.equal(await float.locator('.mf1104__item').count(), Math.min(MUSO_COVERS, 12));
        if (reducedMotion === 'reduce') assert((await float.locator('.mf1104__item').evaluateAll((xs) => xs.map((x) => x.style.transform))).every((t) => !t), 'reduced motion: the covers rest');
      }
      // the price: card, buy button, inclusions open, the note, and the details toggle by mouse and keyboard
      await page.locator('#price').scrollIntoViewIfNeeded();
      const includes = page.locator('.price-includes');
      const faq = page.locator('.faq details').first(), summary = faq.locator('summary');
      assert(await includes.isVisible(), 'inclusions permanently visible');
      assert.equal(await includes.locator('summary').count(), 0, 'no unnecessary inclusions disclosure');
      assert.equal(await page.locator('.price-list li').count(), 9);
      assert.equal(await page.locator('.price-note').count(), 0, 'unsolicited disclaimer removed by copy 082');
      assert.equal(await page.locator('.price-card a[data-checkout]').getAttribute('href'), LIVE);
      await page.locator('.price-card a[data-checkout]').focus();
      assert.notEqual(await page.locator('.price-card a[data-checkout]').evaluate((el) => getComputedStyle(el).outlineStyle), 'none', 'the buy button shows focus');
      for (const key of ['Enter', 'Space']) {
        await summary.focus(); await summary.press(key); await page.waitForTimeout(1100);
        assert.equal(await faq.evaluate((el) => el.open), true);
        await summary.press(key); await page.waitForTimeout(1100);
        assert.equal(await faq.evaluate((el) => el.open), false);
        assert(await includes.isVisible(), 'FAQ state cannot hide included items');
      }
      // the inclusions are a labelled region; nothing scrolls sideways at any width, so it is never a tab stop
      const region = page.locator('.price-scroll[role="region"][aria-label="everything included"]');
      assert.equal(await region.count(), 1);
      assert.equal(await region.getAttribute('tabindex'), null, 'no extra tab stop where nothing scrolls');
      assert.equal(await region.evaluate((el) => el.scrollWidth > el.clientWidth + 1), false, 'every included line shows without a sideways scroll');
      await page.screenshot({path: `${output}/${width}-${reducedMotion}-price.png`});
      // the blot clips play once on screen (two reads of currentTime differ), and never load under reduced motion
      await page.locator('#close').scrollIntoViewIfNeeded();
      await page.waitForTimeout(1500);
      const clipTime = async () => page.locator('#bv-workflow').evaluate((v) => v.currentTime);
      const t1 = await clipTime(); await page.waitForTimeout(700); const t2 = await clipTime();
      if (reducedMotion === 'reduce') assert(t1 === 0 && t2 === 0, 'reduced motion keeps the first frame');
      else assert(t2 > t1, 'the closing blot clip is playing');
      // no other video: only the launch film, the studio film and the whitelisted blot clips may be requested
      const allowedVideo = (url) => url.endsWith('/assets/launch/lifetime-film.mp4') || url.endsWith('/assets/studio-1101/studio-mixer-review.mp4') ||
        /\/brand\/current\/blot-video\/bv-(keys|workflow)-\d+\.(webm|mp4)$/.test(new URL(url).pathname);
      assert(videos.every(allowedVideo), 'no unlisted video downloads');
      if (reducedMotion === 'reduce') assert(!videos.some((url) => url.includes('/brand/current/blot-video/')), 'no blot clip downloads under reduced motion');
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
      await page.goto(base, {waitUntil: 'domcontentloaded'});
      assert(await page.locator('h1').isVisible());
      for (const id of ['#inside', '#features', '#price']) assert(await page.locator(id).isVisible(), id + ' visible');
      assert(await page.locator('.price-includes').isVisible());
      assert.equal(await page.locator('.price-list li').count(), 9);
      assert.equal(await page.locator('.price-card a[data-checkout]').getAttribute('href'), LIVE);
      assert.equal(await page.locator('a[data-checkout]').count(), 1);
      assert(await page.locator('#trusted').isVisible(), '#trusted visible');
      assert.equal((await page.locator('#trusted-title').textContent()).replace(/\s+/g, ' ').trim(), TRUSTED_HEADING);
      assert.deepEqual(await trustedNames(page), TRUSTED, 'the strip lists all 33 without the marquee');
      assert.deepEqual(await trustedMore(page), {text: TRUSTED_MORE, alt: MEME_ALT});
      if (failure === 'no-js') {
        assert.equal(await page.locator('.film-cover').isVisible(), false, 'no cover over the player without scripts');
        assert.equal(await page.locator('.film-player').evaluate((v) => v.controls && !v.inert), true, 'the film plays with native controls');
      }
      await page.screenshot({path: `${output}/390-${failure}.png`, fullPage: true});
      results.push({failure, ok: true});
      await context.close();
    }
    fs.writeFileSync(`${output}/results.json`, JSON.stringify(results, null, 2));
    console.log('Landing contract: hero, three live checkout CTAs, film, price and inclusions at 1440 and 390 with and without reduced motion; no-js, script-blocked and media-blocked fallbacks: passed.');
  } finally { await browser.close(); server.close(); }
})().catch((error) => { console.error(error); server.close(); process.exitCode = 1; });
