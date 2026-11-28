// node rules.cjs <url> <width> <selector>...: matched CSS rules (file:line, selector, declarations) per element
const {chromium}=require('playwright');
(async()=>{const [url,w,...sels]=process.argv.slice(2);const b=await chromium.launch();const p=await b.newPage({viewport:{width:+w,height:900}});
await p.route('**/*',r=>['127.0.0.1'].includes(new URL(r.request().url()).hostname)?r.continue():r.abort());
await p.goto(url);await p.waitForTimeout(800);const c=await p.context().newCDPSession(p);await c.send('DOM.enable');await c.send('CSS.enable');
const sheets={};c.on('CSS.styleSheetAdded',e=>sheets[e.header.styleSheetId]=e.header.sourceURL);await c.send('CSS.enable');
const {root}=await c.send('DOM.getDocument',{depth:-1});
for(const s of sels){const {nodeId}=await c.send('DOM.querySelector',{nodeId:root.nodeId,selector:s});if(!nodeId){console.log('NO',s);continue;}
 const m=await c.send('CSS.getMatchedStylesForNode',{nodeId});console.log('== '+s);
 for(const r of m.matchedCSSRules){const sel=r.rule.selectorList.text;if(sel.length>200||r.rule.origin!=='regular')continue;const f=(sheets[r.rule.styleSheetId]||'inline').split('/').pop();
  const d=r.rule.style.cssProperties.filter(x=>x.text).map(x=>x.text).join(' ');const media=(r.rule.media||[]).map(x=>x.text).join(',');console.log(`  ${f}${media?' @'+media:''} | ${sel} | ${d.slice(0,260)}`);}}
await b.close()})();
