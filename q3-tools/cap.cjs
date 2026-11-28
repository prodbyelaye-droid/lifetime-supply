// usage: node cap.cjs <url> <selector> <width> <out.png> [dsf] [wait ms]
const {chromium}=require('playwright');
(async()=>{
  const [url,sel,w,out,dsf='1',wait='1500']=process.argv.slice(2);const width=+w;
  const b=await chromium.launch();
  const ctx=await b.newContext({viewport:{width,height:width<700?844:900},deviceScaleFactor:+dsf});
  if(/127\.0\.0\.1|localhost/.test(url))await ctx.route('**/*',r=>['127.0.0.1','localhost'].includes(new URL(r.request().url()).hostname)?r.continue():r.abort());
  const p=await ctx.newPage();
  await p.goto(url,{waitUntil:'load',timeout:90000});
  await p.waitForTimeout(800);
  // walk the page so lazy images and reveals fire
  const H=await p.evaluate(()=>document.documentElement.scrollHeight);
  for(let y=0;y<H;y+=600){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(60);}
  const el=p.locator(sel).first();await el.scrollIntoViewIfNeeded();await p.waitForTimeout(+wait);
  await el.screenshot({path:out});
  const box=await el.boundingBox();console.log(out,JSON.stringify(box));
  await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
