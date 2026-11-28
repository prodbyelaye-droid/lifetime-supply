// prints every text line box (and chip box) in the first lane sheet of board.html at 1440x900
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('http://127.0.0.1:8302/portal-demo/p9/board.html');await p.waitForTimeout(1200);
const r=await p.evaluate(()=>{const sheet=document.querySelector('section.sheet');const sr=sheet.getBoundingClientRect();
 const out={sheet:[sr.x,sr.y,sr.width,sr.height].map(Math.round),lines:[],cells:[]};
 const w=document.createTreeWalker(sheet,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){if(!n.textContent.trim())continue;const rg=document.createRange();rg.selectNodeContents(n);
  for(const q of rg.getClientRects()){if(q.width<1)continue;const el=n.parentElement;const cs=getComputedStyle(el);out.lines.push([Math.round(q.x),Math.round(q.y),Math.round(q.right),Math.round(q.bottom),cs.filter!=='none'?'blur':'',n.textContent.trim().slice(0,24)]);}}
 for(const t of sheet.querySelectorAll('.tile, [class*=tile]')){const q=t.getBoundingClientRect();if(q.width>150&&q.width<300)out.cells.push([q.x,q.y,q.right,q.bottom].map(Math.round));}
 return out});
console.log(JSON.stringify(r.sheet));console.log('cells',JSON.stringify(r.cells.slice(0,12)));for(const l of r.lines)if(l[1]<1200)console.log(l.join(' '));await b.close()})();
