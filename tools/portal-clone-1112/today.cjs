const {chromium}=require('playwright');
function cookie(email='maya.okafor@example.com'){const id=email.includes('owner')?'55555555-5555-4555-8555-555555555555':'44444444-4444-4444-8444-444444444444',exp=Math.floor(Date.now()/1000)+3600;const token=Buffer.from(JSON.stringify({alg:'HS256',typ:'JWT'})).toString('base64url')+'.'+Buffer.from(JSON.stringify({sub:id,email,exp,aud:'authenticated',role:'authenticated'})).toString('base64url')+'.fixture';return{name:'sb-127-auth-token',value:'base64-'+Buffer.from(JSON.stringify({access_token:token,refresh_token:'fixture-refresh',token_type:'bearer',expires_in:3600,expires_at:exp,user:{id,email,aud:'authenticated',app_metadata:{},user_metadata:{}}})).toString('base64url'),domain:'127.0.0.1',path:'/',sameSite:'Lax'};}
const tz={name:'tz',value:'Australia/Sydney',domain:'127.0.0.1',path:'/',sameSite:'Lax'};
module.exports={cookie,tz};
if(require.main===module)(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1440,height:1400},timezoneId:'Australia/Sydney'});
await ctx.addCookies([cookie(process.env.EMAIL||undefined),tz]);await ctx.route('**/*',r=>['127.0.0.1','localhost'].includes(new URL(r.request().url()).hostname)?r.continue():r.abort());
await ctx.addInitScript(t=>{try{localStorage.setItem('theme-v2',t)}catch{}},process.env.THEME||'light');
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,150))});
const r=await p.goto('http://127.0.0.1:3181'+(process.argv[2]||'/today'),{waitUntil:'networkidle',timeout:240000});await p.waitForTimeout(1500);
await p.addStyleTag({content:'nextjs-portal{display:none}'});
await p.screenshot({path:process.argv[3]});console.log(r.status(),p.url(),errs.slice(0,5));await b.close()})();
