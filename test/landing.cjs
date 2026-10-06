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
      assert.equal(await page.locator('.bundle-summary a').count(),6,'five bundle links and one forever panel');
      const sheet=page.locator('.hero-folder-stage .folder-sheet');
      if(reducedMotion==='no-preference') {
        const sheetY=()=>sheet.evaluate(el=>parseFloat(getComputedStyle(el).translate.split(' ')[1])||0);
        const startY=await sheetY();
        await page.evaluate(()=>scrollTo({top:400,behavior:'instant'}));
        await page.waitForTimeout(100);
        assert(await sheetY()<startY-5,'paper rises with scrolling');
        await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
        await page.waitForTimeout(100);
        assert(Math.abs(await sheetY()-startY)<2,'paper returns on reverse scroll');
      } else assert.equal(await sheet.evaluate(el=>getComputedStyle(el).animationName),'none');
      const film=page.locator('.film-player');
      assert.equal(await film.count(),1);
      assert.equal(await film.getAttribute('preload'),'none');
      assert.equal(await film.evaluate(el=>el.paused),true);
      await page.locator('#film').scrollIntoViewIfNeeded();
      assert(await page.locator('.film-cover').isVisible());
      assert.equal(await film.evaluate(el=>el.inert),true);
      await page.screenshot({path:`${output}/${width}-${reducedMotion}-film.png`});
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width,'film width');
      assert.equal(await page.locator('[role="tabpanel"]:visible').count(),1);
      assert.equal(await page.locator('.d-toast').count(),0);
      const portalY=await page.locator('#portal').evaluate(el=>el.offsetTop);
      await page.locator('.film-next').click();
      assert.equal(await page.evaluate(()=>document.activeElement.id),width===390?'demo-section':'dt-0');
      const streamsTarget=await page.locator('[data-muso="streams"]').innerText();
      await page.locator('.credits-live').scrollIntoViewIfNeeded();
      if(reducedMotion==='no-preference') {
        await page.waitForFunction(target=>document.querySelector('[data-muso="streams"]').textContent!==target,streamsTarget);
        await page.waitForFunction(target=>document.querySelector('[data-muso="streams"]').textContent===target,streamsTarget);
      } else assert.equal(await page.locator('[data-muso="streams"]').innerText(),streamsTarget);
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
        await page.locator(`#dp-${i}`).evaluate(el=>Promise.all(el.getAnimations().map(a=>a.finished)));
        await page.screenshot({path:`${output}/${width}-${reducedMotion}-tab-${i}.png`});
      }
      if(width===1440){await tabs.nth(0).focus();await page.keyboard.press('End');assert.equal(await tabs.nth(8).getAttribute('aria-selected'),'true');await page.keyboard.press('Home');assert.equal(await tabs.nth(0).getAttribute('aria-selected'),'true');}
      await page.locator('[data-demo-go="6"]').first().click();
      assert.equal(await page.locator('#dp-6').isVisible(),true);
      await page.locator('.vault-media').scrollIntoViewIfNeeded();
      assert.equal(await page.locator('video').count(),1,'the film is the only video');
      assert.equal(await page.locator('[data-motion-toggle]').count(),0,'quiet plates use stills');
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
      assert.equal(videoRequests.length,0,'no background video downloads');
      await page.locator('.hero-folder-link').click();
      assert.equal(await page.locator('#dp-0').isVisible(),true);
      assert.equal(await page.evaluate(()=>document.activeElement.id),width===390?'demo-section':'dt-0');
      await page.waitForFunction(()=>Math.abs(document.querySelector('#demo').getBoundingClientRect().top-(innerWidth===390?80:104))<3);
      await page.locator('.d-door[data-demo-go="4"]').click();
      assert.equal(await page.locator('#dp-4').isVisible(),true,'preview doors open their section');
      await page.locator('.room-scene').scrollIntoViewIfNeeded();
      await page.waitForFunction(()=>document.querySelector('.room-scene').classList.contains('is-entered'));
      await page.locator('.room-message').last().evaluate(el=>Promise.all(el.getAnimations().map(a=>a.finished)));
      assert(await page.getByText('a feel for the room. illustrative messages.').isVisible());
      await page.screenshot({path:`${output}/${width}-${reducedMotion}-room.png`});
      const moreMessages=page.locator('.talk-more');
      assert.equal(await page.locator('.quote:visible').count(),8);
      await moreMessages.locator('summary').click();
      assert.equal(await page.locator('.quote:visible').count(),12);
      const lastQuote=page.locator('.quote').last();
      await lastQuote.scrollIntoViewIfNeeded();
      await page.waitForFunction(()=>document.querySelector('.talk-more .quote:last-child').classList.contains('is-entered'));
      assert.equal(await lastQuote.evaluate(el=>getComputedStyle(el).animationName),reducedMotion==='reduce'?'none':'quote-arrive');
      await lastQuote.evaluate(el=>Promise.all(el.getAnimations().map(a=>a.finished)));
      await page.screenshot({path:`${output}/${width}-${reducedMotion}-more-messages.png`});
      await moreMessages.locator('summary').focus();
      await page.keyboard.press('Enter');
      assert.equal(await page.locator('.quote:visible').count(),8);
      await page.locator('#price').scrollIntoViewIfNeeded();
      const includes=page.locator('.price-includes');
      const summary=includes.locator('summary');
      const note=page.locator('.price-note');
      assert.equal(await includes.evaluate(el=>el.open),true,'inclusions open on load');
      assert.equal(await page.locator('.price-list li:visible').count(),8);
      assert.equal(await note.count(),1);
      assert.equal(await note.innerText(),'your music and rights stay yours. sending is never a guaranteed placement.');
      assert.equal(await note.locator('li').count(),0);
      assert.equal(await note.evaluate(el=>getComputedStyle(el,'::before').content),'none');
      assert(await page.evaluate(()=>document.querySelector('.price-intro').getBoundingClientRect().bottom<=document.querySelector('.price-card').getBoundingClientRect().top),'purchase card sits below the introduction');
      if(width===1440) assert(await page.locator('.price-card').evaluate(el=>el.getBoundingClientRect().width>1100),'desktop purchase card uses the full content width');
      await page.locator('.price-intro span').last().evaluate(el=>Promise.all(el.getAnimations().map(a=>a.finished)));
      await page.screenshot({path:`${output}/${width}-${reducedMotion}-price.png`});
      await page.locator('#price').screenshot({path:`${output}/${width}-${reducedMotion}-price-section.png`});
      await summary.click();assert.equal(await includes.evaluate(el=>el.open),false);assert(await note.isVisible());
      await summary.click();assert.equal(await includes.evaluate(el=>el.open),true);
      await summary.focus();
      for(const key of ['Enter','Space']) {
        await summary.press(key);assert.equal(await includes.evaluate(el=>el.open),false);assert(await note.isVisible());
        await summary.press(key);assert.equal(await includes.evaluate(el=>el.open),true);
      }
      if(reducedMotion==='reduce') {
        assert.equal(await page.locator('.room-message').first().evaluate(el=>getComputedStyle(el).animationName),'none');
        assert.equal(await page.locator('.price-intro span').first().evaluate(el=>getComputedStyle(el).animationName),'none');
      }
      if(reducedMotion==='no-preference') {
        await page.locator('.film-cover').click();
        assert.equal(await page.locator('.film-cover').isVisible(),false);
        assert.equal(await film.evaluate(el=>el.inert),false);
        await page.waitForFunction(()=>document.querySelector('.film-player').currentTime>0);
        assert.equal(await film.evaluate(el=>el.paused),false);
        await film.evaluate(el=>el.pause());
      }
      assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
      results.push({width,reducedMotion,portalY,errors,missing,videoRequests:videoRequests.length});
      await context.close();
    }
    for(const failure of ['no-js','homer-blocked','media-blocked']) {
      const context=await browser.newContext({viewport:{width:390,height:844},javaScriptEnabled:failure!=='no-js'});
      const page=await context.newPage();
      if(failure==='homer-blocked')await page.route('**/js/homer.js',r=>r.abort());
      if(failure==='media-blocked')await page.route('**/assets/launch/*',r=>r.abort());
      await page.goto(base,{waitUntil:'networkidle'});
      assert(await page.locator('#inside').isVisible());
      assert(await page.locator('#learning').isVisible());
      assert(await page.locator('.inside-card').evaluateAll(v=>v.every(el=>getComputedStyle(el).opacity==='1')));
      assert.equal(await page.locator('.price-includes').evaluate(el=>el.open),true);
      assert.equal(await page.locator('.price-list li:visible').count(),8);
      assert.equal(await page.locator('.film-cover').isVisible(),failure!=='no-js'&&failure!=='homer-blocked');
      if(failure==='no-js')assert.equal(await page.locator('.film-player').evaluate(el=>el.inert),false);
      await page.locator('.talk-more summary').click();
      assert.equal(await page.locator('.quote:visible').count(),12,'more testimonials work without scripts');
      assert(await page.locator('.room-message').evaluateAll(v=>v.every(el=>getComputedStyle(el).visibility!=='hidden')));
      assert.equal(await page.locator('#price [data-checkout]').getAttribute('href'),'https://buy.stripe.com/6oU5kEaEYgMQ86jbqa9AA03');
      await page.screenshot({path:`${output}/390-${failure}.png`,fullPage:true});
      await context.close();
    }
    fs.writeFileSync(`${output}/results.json`,JSON.stringify(results,null,2));
    console.log(JSON.stringify(results,null,2));
  } finally {await browser.close();server.close();}
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
