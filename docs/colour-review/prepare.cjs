const fs=require('fs'),path=require('path');
const mods='/Volumes/Extreme SSD/Codex-assembly/portal-1029/node_modules';
const sharp=require(mods+'/sharp');
const {chromium}=require(mods+'/@playwright/test');
const base=__dirname,wiki='/Users/elaye/Desktop/wiki/membership-portal/builds';
const assets=base+'/assets';fs.mkdirSync(assets,{recursive:true});
(async()=>{
 const refs=[['005',wiki+'/2026-10-29-element-lab/GRADCODE/005/reference-crop.jpg'],['010',wiki+'/2026-10-29-element-lab/GRADCODE/010/reference-crop.jpg'],['037',wiki+'/2026-10-29-element-lab/GRADCODE/037/reference-crop.jpg'],['044',wiki+'/2026-10-29-element-lab/GRADCODE/044/reference-crop.jpg'],['145',wiki+'/2026-10-29-element-lab/GRADCODE/145/reference-crop.jpg'],['150',wiki+'/2026-10-29-element-lab/GRADCODE/150/reference-crop.jpg'],['183',wiki+'/2026-10-29-element-lab/GRADCODE/183/reference-crop.jpg'],['189',wiki+'/2026-10-29-element-lab/GRADCODE/189/reference-crop.jpg']];
 const tiles=[];
 for(let i=0;i<refs.length;i++){
   const [id,file]=refs[i];
   tiles.push({input:await sharp(file).resize(340,290,{fit:'contain',background:'#fff'}).jpeg().toBuffer(),left:i%4*360,top:Math.floor(i/4)*330+30});
   tiles.push({input:Buffer.from(`<svg width="340" height="30"><text x="8" y="21" font-family="Arial" font-size="18">Reference ${id}</text></svg>`),left:i%4*360,top:Math.floor(i/4)*330});
 }
 await sharp({create:{width:1440,height:660,channels:3,background:'#fff'}}).composite(tiles).png().toFile(base+'/references.png');
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 const page=await browser.newPage({viewport:{width:1600,height:1000},reducedMotion:'reduce'});
 await page.goto('http://127.0.0.1:8283/2026-10-29-element-lab/GRADCODE/harness.html');
 for(const [id] of refs){
   const uri=await page.evaluate(async id=>{
     const {mount}=await import(`/2026-10-29-element-lab/GRADCODE/grad-${id}.js`);
     const host=document.createElement('div');document.body.replaceChildren(host);
     const s=mount(host,{size:{width:1920,height:1440},manual:true,deep:1});
     s.pause();s.renderAt(id==='150'?6:id==='145'?4:0);
     const uri=s.canvas.toDataURL('image/png');s.destroy();return uri;
   },id);
   await sharp(Buffer.from(uri.split(',')[1],'base64')).webp({quality:95}).toFile(`${assets}/field-${id}.webp`);
 }
 for(const [name,id] of [['037-plum','037'],['150-blue-magenta','150'],['183-green','183'],['189-rose','189']]){
   await sharp(wiki+`/2026-10-30-blots-higgsfield/blot-${name}.png`).trim().resize(640,640,{fit:'inside'}).webp({quality:90}).toFile(`${assets}/blot-${id}.webp`);
 }
 const p=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
 await p.goto('http://127.0.0.1:8281');await p.waitForFunction(()=>window.assembly);await p.evaluate(()=>assembly.renderAt(3));
 await p.screenshot({path:base+'/base-landing.png',fullPage:true});
 await browser.close();console.log('Prepared reference sheet, 8 source fields, 4 supplied blots and base capture');
})();
