/* Run with PLAYWRIGHT_MODULE pointing to an installed Playwright package. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
process.chdir(path.join(__dirname, '..'));
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const {render} = require('../api/landing');
const output = process.env.SHOTS_DIR || '/tmp/lifetime-landing-shots';
fs.mkdirSync(output, {recursive:true});
const types = {'.css':'text/css','.js':'application/javascript','.svg':'image/svg+xml','.webp':'image/webp','.jpg':'image/jpeg','.mp4':'video/mp4','.woff2':'font/woff2'};
const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  if (pathname === '/' || pathname === '/index.html') {
    res.writeHead(200, {'Content-Type':'text/html'});res.end(render());return;
  }
  if (pathname === '/api/muso') {res.writeHead(200,{'Content-Type':'application/json'});res.end('{}');return;}
  const file = path.join(process.cwd(), decodeURIComponent(pathname));
  if (!file.startsWith(process.cwd() + path.sep)) {res.writeHead(403);res.end();return;}
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {res.writeHead(404);res.end();return;}
  res.writeHead(200, {'Content-Type':types[path.extname(file)] || 'application/octet-stream'});
  fs.createReadStream(file).pipe(res);
});
(async () => {
  server.listen(0,'127.0.0.1');
  await new Promise(resolve => server.once('listening',resolve));
  const browser = await chromium.launch({headless:true});
  const base = process.env.TEST_URL || `http://127.0.0.1:${server.address().port}`;
  const results=[];
  try {
    for (const width of [1440,390]) for (const reducedMotion of ['no-preference','reduce']) {
      const context=await browser.newContext({viewport:{width,height:width===390?844:1000},reducedMotion});
      const page=await context.newPage();
      const errors=[],missing=[],videoRequests=[];
      page.on('pageerror',e=>errors.push(e.message));
      page.on('response',r=>{if(r.status()===404)missing.push(r.url());});
      page.on('request',r=>{if(r.url().endsWith('.mp4'))videoRequests.push(r.url());});
      await page.goto(base,{waitUntil:'networkidle'});
      await page.screenshot({path:`${output}/${width}-${reducedMotion}-hero.png`});
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width,'page width');
      assert.equal(await page.locator('[role="tabpanel"]:visible').count(),1);
      assert.equal(await page.locator('.d-toast').count(),0);
      const portalY=await page.locator('#portal').evaluate(el=>el.offsetTop);
      const tabs=page.getByRole('tab');
      for(let i=0;i<9;i++) {
        if(width===390)await page.locator('#demo-section').selectOption(String(i));
        else await tabs.nth(i).click();
        assert.equal(await page.locator('[role="tabpanel"]:visible').getAttribute('id'),`dp-${i}`);
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width,`tab ${i} width`);
        assert(await page.locator(`#dp-${i}`).evaluate(el=>el.scrollWidth<=el.clientWidth),`tab ${i} overflow`);
        if(i===1){assert(await page.locator('#dp-1').getByText('made music',{exact:true}).isVisible());assert(await page.locator('#dp-1').getByText('wins',{exact:true}).isVisible());assert.equal(await page.locator('.d-week .d-day:visible').count(),7);}
        if(i===5){assert(await page.locator('#dp-5').getByText('analog alchemy',{exact:true}).isVisible());assert(await page.locator('#dp-5').getByText('octaves creator suite · part two (unreleased)',{exact:true}).isVisible());}
        if(i===7)assert.equal(await page.locator('#dp-7 .d-row:visible').count(),7);
        await page.locator('#portal').scrollIntoViewIfNeeded();
        await page.screenshot({path:`${output}/${width}-${reducedMotion}-tab-${i}.png`});
      }
      if(width===1440){await tabs.nth(0).focus();await page.keyboard.press('End');assert.equal(await tabs.nth(8).getAttribute('aria-selected'),'true');await page.keyboard.press('Home');assert.equal(await tabs.nth(0).getAttribute('aria-selected'),'true');}
      await page.locator('[data-demo-go="6"]').first().click();
      assert.equal(await page.locator('#dp-6').isVisible(),true);
      await page.locator('.vault-media').scrollIntoViewIfNeeded();
      if(reducedMotion==='no-preference') {
        await page.waitForFunction(()=>document.querySelector('.vault-media video').readyState>=2);
        assert(await page.locator('.vault-media video').evaluate(v=>!v.paused));
      }
      await page.locator('#learning').scrollIntoViewIfNeeded();
      await page.locator('.syllabi summary').first().click();
      assert.equal(await page.locator('.syllabi details').first().getAttribute('open'),'');
      await page.screenshot({path:`${output}/${width}-${reducedMotion}-learning.png`});
      await page.locator('#price').scrollIntoViewIfNeeded();
      assert(await page.locator('video').evaluateAll(v=>v.every(x=>x.paused)),'offscreen plates pause');
      await page.screenshot({path:`${output}/${width}-${reducedMotion}-price.png`});
      await page.locator('#price [data-checkout]').focus();
      await page.keyboard.press('Tab');
      await page.keyboard.press('Shift+Tab');
      const focus=await page.locator('#price [data-checkout]').evaluate(el=>getComputedStyle(el).outlineColor);
      assert.equal(focus,'rgb(11, 11, 11)');
      await page.locator('#portal').scrollIntoViewIfNeeded();
      if(reducedMotion==='reduce') {
        assert.equal(videoRequests.length,0,'reduced motion must not download videos');
        assert(await page.locator('video').evaluateAll(v=>v.every(x=>x.paused)));
        assert.equal(await page.locator('[data-motion-toggle]:visible').count(),0);
      } else {
        await page.locator('.portal-motion').click();
        assert(await page.locator('video').evaluateAll(v=>v.every(x=>x.paused)));
        await page.emulateMedia({reducedMotion:'reduce'});
        assert(await page.locator('video').evaluateAll(v=>v.every(x=>x.paused)));
        await page.emulateMedia({reducedMotion:'no-preference'});
      }
      assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
      results.push({width,reducedMotion,portalY,errors,missing,videoRequests:videoRequests.length});
      await context.close();
    }
    for(const failure of ['no-js','homer-blocked','media-blocked']) {
      const context=await browser.newContext({viewport:{width:390,height:844},javaScriptEnabled:failure!=='no-js'});
      const page=await context.newPage();
      if(failure==='homer-blocked')await page.route('**/js/homer.js',r=>r.abort());
      if(failure==='media-blocked')await page.route('**/assets/launch/*.mp4',r=>r.abort());
      await page.goto(base,{waitUntil:'networkidle'});
      assert(await page.locator('#inside').isVisible());
      assert(await page.locator('#learning').isVisible());
      assert(await page.locator('.inside-card').evaluateAll(v=>v.every(el=>getComputedStyle(el).opacity==='1')));
      assert.equal(await page.locator('#price [data-checkout]').getAttribute('href'),'https://buy.stripe.com/6oU5kEaEYgMQ86jbqa9AA03');
      await page.screenshot({path:`${output}/390-${failure}.png`,fullPage:true});
      await context.close();
    }
    fs.writeFileSync(`${output}/results.json`,JSON.stringify(results,null,2));
    console.log(JSON.stringify(results,null,2));
  } finally {await browser.close();server.close();}
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
