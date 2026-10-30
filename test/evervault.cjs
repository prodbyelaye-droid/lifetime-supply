// Start a local server and set TEST_URL. Writes evidence only to SHOTS_DIR.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const out = process.env.SHOTS_DIR;
const base = process.env.TEST_URL || 'http://127.0.0.1:8914';
(async () => {
  const browser = await chromium.launch({headless:true, channel:process.env.PW_CHANNEL || 'chrome'});
  try {
    for (const width of [1440,390,320]) {
      const context = await browser.newContext({viewport:{width,height:width<700?844:900},reducedMotion:'no-preference'});
      const page = await context.newPage(), errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      await page.goto(base,{waitUntil:'domcontentloaded'});
      await page.waitForFunction(()=>window.ready);
      await page.evaluate(()=>window.assembly.skip());
      const section=page.locator('#features'),surface=page.locator('.ev-surface').first();
      await section.scrollIntoViewIfNeeded();await page.waitForTimeout(1700);
      assert.equal(await page.locator('.ev-title').count(),7);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      const before=await surface.locator('.ev-noise p').textContent();
      await surface.hover({position:{x:72,y:80}});await page.waitForTimeout(600);
      const after=await surface.locator('.ev-noise p').textContent();assert.notEqual(before,after);
      assert.equal(after.length,1500);
      assert.equal(await surface.evaluate(e=>e.style.getPropertyValue('--ev-x')),'72px');
      const still=after;await page.waitForTimeout(150);
      assert.equal(await surface.locator('.ev-noise p').textContent(),still,'no idle scrambling');
      if(out && width!==320) {
        fs.mkdirSync(out,{recursive:true});
        // Use the same cursor point as the original 1440 capture.
        await surface.hover({position:{x:width===1440?90:72,y:width===1440?95:80}});await page.waitForTimeout(600);
        await page.screenshot({path:path.join(out,`option-A-${width}.png`)});
        await surface.screenshot({path:path.join(out,`build-art-${width}.png`)});
        await surface.locator('..').locator('..').screenshot({path:path.join(out,`build-card-${width}.png`)});
        await section.screenshot({path:path.join(out,`section-${width}.png`)});
        const rects=await section.evaluate(s=>{const r=s.getBoundingClientRect();return [...s.querySelectorAll('h2,h3,.feature-copy p,header p,.feature-copy a')].map(e=>{const a=e.getBoundingClientRect(),c=getComputedStyle(e);return {text:e.textContent,x:a.x-r.x,y:a.y-r.y,w:a.width,h:a.height,color:c.color,size:c.fontSize};});});
        await page.addStyleTag({content:'#features h2,#features h3,#features h3 span,#features .feature-copy p,#features header p,#features a{color:transparent!important;-webkit-text-fill-color:transparent!important}'});
        await section.screenshot({path:path.join(out,`background-${width}.png`)});
        fs.writeFileSync(path.join(out,`text-${width}.json`),JSON.stringify(rects));
      }
      await page.emulateMedia({reducedMotion:'reduce'});
      const reduced=await surface.locator('.ev-noise p').textContent();
      await surface.hover({position:{x:150,y:150}});
      assert.equal(await surface.locator('.ev-noise p').textContent(),reduced,'reduced motion is a still');
      await page.emulateMedia({reducedMotion:'no-preference'});
      await page.getByRole('button',{name:'pause motion',exact:true}).click();
      const paused=await surface.locator('.ev-noise p').textContent();
      await surface.hover({position:{x:170,y:150}});
      assert.equal(await surface.locator('.ev-noise p').textContent(),paused,'site pause freezes scrambling');
      const link=page.locator('.f-board a');await link.focus();
      assert.equal(await link.evaluate(e=>e===document.activeElement),true);
      assert.equal(await link.getAttribute('href'),'#steps');
      assert.deepEqual(errors,[]);console.log(`PASS Evervault ${width}: pointer, idle, reduced motion, pause, keyboard, overflow, JS errors`);
      await context.close();
    }
    for (const js of [true,false]) {
      const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,javaScriptEnabled:js});
      const page=await context.newPage();await page.goto(base,{waitUntil:'domcontentloaded'});
      if(js)await page.waitForFunction(()=>window.ready);
      await page.locator('#features').scrollIntoViewIfNeeded();
      assert.equal(await page.locator('.ev-title').count(),7);
      const field=page.locator('.rest-field').first();
      assert.equal(await field.evaluate(e=>getComputedStyle(e).opacity),'1');
      const x=await page.evaluate(()=>scrollY);
      await page.evaluate(()=>window.scrollBy(0,200));assert(await page.evaluate(()=>scrollY)>x);
      console.log(`PASS touch, JS=${js}: static reveal, readable titles, native scroll`);
      await context.close();
    }
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
