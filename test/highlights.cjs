/* Run against the local preview or deployed site with TEST_URL. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.TEST_URL || 'http://127.0.0.1:8765';
const output = process.env.SHOTS_DIR || '/tmp/lifetime-highlights-review';
fs.mkdirSync(output,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true});
 try {
  for(const width of [1440,390,320]) for(const reducedMotion of ['no-preference','reduce']) {
   const context=await browser.newContext({viewport:{width,height:width===1440?1000:844},reducedMotion});
   const page=await context.newPage(),errors=[],requests=[];
   page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.url().endsWith('.mp4'))requests.push(r.url());});
   await page.goto(base,{waitUntil:'networkidle'});
   const links=page.locator('.highlight-watch'),dialog=page.locator('.highlight-dialog'),player=page.locator('.highlight-player');
   assert.equal(await links.count(),8);
   await page.locator('#highlights').scrollIntoViewIfNeeded();
   await page.locator('.highlight-art img').first().evaluate(img=>img.decode());
   assert.equal(requests.length,0,'no film downloaded before choosing to watch');
   if(width>=390)assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width,'no page overflow');
   assert(await page.locator('#highlights').evaluate(el=>el.getBoundingClientRect().right<=innerWidth),'section stays in viewport');
   await page.locator('#highlights').screenshot({path:`${output}/${width}-${reducedMotion}-section.png`});
   assert(await page.getByRole('button',{name:'previous films',exact:true}).isDisabled());
   await page.getByRole('button',{name:'next films',exact:true}).click();
   await page.waitForFunction(()=>document.querySelector('.highlight-list').scrollLeft>100);
   const count=width===1440&&reducedMotion==='no-preference'?8:1;
   for(let i=0;i<count;i++) {
    await links.nth(i).focus();await page.keyboard.press('Enter');
    assert(await dialog.isVisible());
    assert.equal(await dialog.locator('h2').innerText(),await links.nth(i).getAttribute('data-highlight-title'));
    await page.waitForFunction(()=>document.querySelector('.highlight-player').currentTime>0);
    assert(await player.evaluate(v=>!v.paused&&v.videoWidth===720&&v.videoHeight===1280));
    if(i===0)await page.screenshot({path:`${output}/${width}-${reducedMotion}-player.png`});
    if(i%2)await page.getByRole('button',{name:'close film',exact:true}).click();else await page.keyboard.press('Escape');
    await page.waitForFunction(()=>!document.querySelector('.highlight-dialog').open&&!document.querySelector('.highlight-player').hasAttribute('src')); 
    assert.equal(await player.getAttribute('src'),null,'closing unloads media');
    assert.equal(await page.evaluate(()=>document.body.style.overflow),'');
    assert(await links.nth(i).evaluate(el=>el===document.activeElement),'focus returns to chosen film');
   }
   assert.deepEqual(errors,[]);console.log(`PASS highlights ${width} ${reducedMotion}; ${count} playback checks`);
   await context.close();
  }
  for(const mode of ['no-js','script-blocked','video-blocked']) {
   const context=await browser.newContext({viewport:{width:390,height:844},javaScriptEnabled:mode!=='no-js'}),page=await context.newPage();
   if(mode==='script-blocked')await page.route('**/js/highlights.js',r=>r.abort());
   if(mode==='video-blocked')await page.route('**/assets/highlights/*.mp4',r=>r.abort());
   await page.goto(base,{waitUntil:'networkidle'});
   assert.equal(await page.locator('.highlight-watch').count(),8);
   assert(await page.locator('.highlight-watch').evaluateAll(links=>links.every(a=>a.href.endsWith('.mp4'))));
   if(mode==='video-blocked') {await page.locator('.highlight-watch').first().click();await page.locator('.highlight-error:visible').waitFor();assert(await page.locator('.highlight-direct').isVisible());await page.keyboard.press('Escape');}
   else assert.equal(await page.locator('.highlights-arrows').isVisible(),false);
   console.log('PASS fallback '+mode);await context.close();
  }
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
