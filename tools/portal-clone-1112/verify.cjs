const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const [,,url,rects,theme]=process.argv;const R=JSON.parse(fs.readFileSync(rects))[theme||'light'];const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:1400},colorScheme:theme==='dark'?'dark':'light'});
await p.goto(url+(theme==='dark'?'?t=dark':'?t=light'),{waitUntil:'networkidle'});await p.waitForTimeout(800);
const got=await p.evaluate(n=>{const o=[];for(let i=0;i<n;i++){const e=document.querySelector('.c'+i);if(!e){o.push(null);continue}const r=e.getBoundingClientRect();o.push([r.left,r.top,r.width,r.height])}return o},R.length);
let bad=[],max=0,vis=0;for(let i=0;i<R.length;i++){const a=R[i],g=got[i];if(!g){bad.push(i+' missing');continue}if(a[2]===0&&a[3]===0)continue;vis++;const d=Math.max(...a.map((x,k)=>Math.abs(x-g[k])));max=Math.max(max,d);if(d>0.6)bad.push(i+' d'+d.toFixed(2)+' '+JSON.stringify(a)+' '+JSON.stringify(g.map(x=>Math.round(x*100)/100)))}
console.log(theme||'light','elements',R.length,'with boxes',vis,'max diff',max.toFixed(2),'off >0.6px',bad.length);console.log(bad.slice(0,15).join('\n'));await b.close()})();
