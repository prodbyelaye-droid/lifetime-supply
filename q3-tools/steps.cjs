// node steps.cjs <base> <prefix>: the five L08 windows at 1440 and 390, stitched per width
const {chromium}=require('playwright');const {execSync}=require('child_process');
(async()=>{const [base,pre]=process.argv.slice(2);const b=await chromium.launch();
for(const w of [1440,390]){const p=await b.newPage({viewport:{width:w,height:w<700?844:900}});
await p.route('**/*',r=>['127.0.0.1'].includes(new URL(r.request().url()).hostname)?r.continue():r.abort());
await p.goto(base);await p.waitForTimeout(800);const files=[];
for(const st of ['morning','day','afternoon','evening','night']){await p.locator('#flow [data-step='+st+'] button').click();await p.waitForTimeout(1500);const f=pre+'-'+w+'-'+st+'.png';await p.locator('#flow .ls-field').screenshot({path:f});files.push(f);}
await p.close();}
await b.close()})();
