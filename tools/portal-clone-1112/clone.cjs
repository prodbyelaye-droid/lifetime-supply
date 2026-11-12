// Clone a portal page (the .accent-ui root, zoom .8) into static markup + one CSS file of computed styles, light then dark diffs.
// node clone.cjs ROUTE OUTDIR NAME   (portal fixture on 127.0.0.1:3181, member session, recording mode on)
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const {cookie,tz}=require('./today.cjs');
const [,,route,outDir,name]=process.argv;
const PROPS=['-webkit-font-smoothing','align-content','align-items','align-self','appearance','backdrop-filter','background-attachment','background-blend-mode','background-clip','background-color','background-image','background-origin','background-position','background-repeat','background-size',
'border-bottom-color','border-bottom-left-radius','border-bottom-right-radius','border-bottom-style','border-bottom-width','border-left-color','border-left-style','border-left-width','border-right-color','border-right-style','border-right-width','border-top-color','border-top-left-radius','border-top-right-radius','border-top-style','border-top-width',
'bottom','box-shadow','box-sizing','caret-color','clip-path','color','column-count','column-gap','cursor','direction','display','fill','fill-opacity','filter','flex-basis','flex-direction','flex-grow','flex-shrink','flex-wrap','float',
'font-family','font-feature-settings','font-kerning','font-optical-sizing','font-size','font-stretch','font-style','font-variant-caps','font-variant-ligatures','font-variant-numeric','font-variation-settings','font-weight',
'grid-auto-columns','grid-auto-flow','grid-auto-rows','grid-column-end','grid-column-start','grid-row-end','grid-row-start','grid-template-areas','grid-template-columns','grid-template-rows',
'height','isolation','justify-content','justify-items','justify-self','left','letter-spacing','line-height','list-style-position','list-style-type','margin-bottom','margin-left','margin-right','margin-top','mask-image','mask-position','mask-repeat','mask-size','max-height','max-width','min-height','min-width','mix-blend-mode',
'object-fit','object-position','opacity','order','outline-color','outline-offset','outline-style','outline-width','overflow-wrap','overflow-x','overflow-y','padding-bottom','padding-left','padding-right','padding-top','pointer-events','position','right','row-gap','scrollbar-width',
'stroke','stroke-dasharray','stroke-dashoffset','stroke-linecap','stroke-linejoin','stroke-opacity','stroke-width','table-layout','text-align','text-decoration-color','text-decoration-line','text-decoration-style','text-decoration-thickness','text-indent','text-overflow','text-rendering','text-transform','text-underline-offset','text-wrap-mode','text-wrap-style','top','transform','transform-box','transform-origin','user-select','vertical-align','visibility','white-space-collapse','width','word-break','word-spacing','z-index','-webkit-line-clamp','-webkit-box-orient','-webkit-mask-image','-webkit-mask-size','-webkit-mask-position','-webkit-mask-repeat','content'];
const INHERITED=new Set(['-webkit-font-smoothing','caret-color','color','cursor','direction','fill','fill-opacity','font-family','font-feature-settings','font-kerning','font-optical-sizing','font-size','font-stretch','font-style','font-variant-caps','font-variant-ligatures','font-variant-numeric','font-variation-settings','font-weight','letter-spacing','line-height','list-style-position','list-style-type','overflow-wrap','pointer-events','stroke','stroke-dasharray','stroke-dashoffset','stroke-linecap','stroke-linejoin','stroke-opacity','stroke-width','text-align','text-indent','text-rendering','text-transform','text-wrap-mode','text-wrap-style','visibility','white-space-collapse','word-break','word-spacing']);
async function snap(theme){
  const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1440,height:1400},timezoneId:'Australia/Sydney'});
  await ctx.addCookies([cookie('upload-member@portal-e2e.test'),tz]);
  await ctx.route('**/*',r=>['127.0.0.1','localhost'].includes(new URL(r.request().url()).hostname)?r.continue():r.abort());
  await ctx.addInitScript(t=>{try{localStorage.setItem('theme-v2',t)}catch{}},theme);
  const p=await ctx.newPage();await p.goto('http://127.0.0.1:3181'+route,{waitUntil:'networkidle',timeout:240000});await p.waitForTimeout(2500);
  const res=await p.evaluate(({PROPS,INH})=>{
    const INHERITED=new Set(INH);
    document.documentElement.dataset.recording='on';
    document.querySelectorAll('nextjs-portal').forEach(e=>e.remove());
    // transient: the new-briefs toast and the sidebar's announcement card (the board window's shell clone has neither)
    [...document.querySelectorAll('body *')].filter(e=>/see the new briefs/.test(e.textContent||'')&&e.querySelectorAll('*').length<40&&getComputedStyle(e).position==='fixed').forEach(e=>e.remove());
    [...document.querySelectorAll('aside *, nav *, [class*=side] *')].filter(e=>/the new portal is live/.test(e.textContent||'')&&e.children.length&&e.getBoundingClientRect().height<260&&e.getBoundingClientRect().height>80).slice(0,1).forEach(e=>e.remove());
    document.getAnimations().forEach(a=>{try{a.finish()}catch{}});
    const root=document.querySelector('.accent-ui');
    const defs={};const blank=document.createElement('iframe');document.body.appendChild(blank);const bd=blank.contentDocument;
    const def=(tag,ns)=>{const k=ns+tag;if(defs[k])return defs[k];const e=ns?bd.createElementNS(ns,tag):bd.createElement(tag);(ns&&tag!=='svg'?(()=>{const s=bd.createElementNS('http://www.w3.org/2000/svg','svg');bd.body.appendChild(s);return s})():bd.body).appendChild(e);const cs=getComputedStyle(e);const o={};for(const pr of PROPS)o[pr]=cs.getPropertyValue(pr);defs[k]=o;return o};
    let n=0;const rules=[],pseudo=[];
    const read=(el,ps)=>{const cs=getComputedStyle(el,ps);const o={};for(const pr of PROPS)o[pr]=cs.getPropertyValue(pr);return o};
    function walk(el,parentVals,isRoot){
      if(el.nodeType===3)return el.textContent.replace(/&/g,'&amp;').replace(/</g,'&lt;');
      if(el.nodeType!==1)return '';
      const tag=el.tagName.toLowerCase();if(['script','style','noscript','template','iframe','link','meta'].includes(tag))return '';
      const cs=getComputedStyle(el);
      const ns=el.namespaceURI==='http://www.w3.org/2000/svg'?el.namespaceURI:'';
      const id=n++;const v=read(el);const d=def(tag,ns);const keep={};
      for(const pr of PROPS){const val=v[pr];if(val===''||val==null)continue;
        if(isRoot){keep[pr]=val;continue}
        if(INHERITED.has(pr)){if(val!==parentVals[pr])keep[pr]=val}
        else if(val!==d[pr]||['width','height','display','position'].includes(pr)||(tag==='input'&&/^(margin|padding|border|appearance|background)/.test(pr)))keep[pr]=val;}
      if(['inline'].includes(v.display)&&!ns){delete keep.width;delete keep.height}
      {const rc=el.getBoundingClientRect();rules.push({id,keep,all:v,rect:[rc.left,rc.top,rc.width,rc.height].map(x=>Math.round(x*100)/100)});}
      for(const ps of ['::before','::after','::marker']){if(ps==='::marker')continue;const pc=getComputedStyle(el,ps);if(pc.content&&pc.content!=='none'&&pc.content!=='normal'){const pv=read(el,ps);const pk={};const dd=def('span','');for(const pr of PROPS){const val=pv[pr];if(!val)continue;if(INHERITED.has(pr)){if(val!==v[pr])pk[pr]=val}else if(val!==dd[pr]||pr==='content'||pr==='width'||pr==='height'||pr==='display'||pr==='position')pk[pr]=val}pseudo.push({id,ps,keep:pk,all:pv})}}
      // tag mapping: links become spans, controls inert
      let t=tag,attrs=` class="c${id}"`;
      if(tag==='a')t='span';
      if(ns){for(const a of el.attributes){if(['class','style','id'].includes(a.name)||a.name.startsWith('data-')||a.name.startsWith('aria-')&&a.name!=='aria-hidden')continue;attrs+=` ${a.name}="${a.value.replace(/"/g,'&quot;')}"`}}
      if(tag==='button')attrs+=' type="button" tabindex="-1"';if(tag==='details'&&el.open)attrs+=' open';
      if(tag==='input'||tag==='textarea'){attrs+=' tabindex="-1" readonly';if(el.placeholder)attrs+=` placeholder="${el.placeholder.replace(/"/g,'&quot;')}"`;if(el.type&&tag==='input')attrs+=` type="${el.type==='password'?'text':el.type}"`;if(el.type==='checkbox'&&el.checked)attrs+=' checked';if(el.value&&el.type!=='checkbox')attrs+=` value="${el.value.replace(/"/g,'&quot;')}"`}
      if(tag==='img'){attrs+=` src="${el.currentSrc||el.src}" alt=""`}
      if(['input','img','br','hr'].includes(tag))return `<${t}${attrs}>`;
      if(tag==='textarea')return `<textarea${attrs}></textarea>`;
      const kids=[...el.childNodes].map(c=>walk(c,v,false)).join('');
      return `<${t}${attrs}>${kids}</${t}>`;
    }
    const rr=root.getBoundingClientRect();
    const html=walk(root,null,true);
    return {html,rules,pseudo,count:n,root:{w:root.offsetWidth,h:root.offsetHeight,zoom:getComputedStyle(root).zoom},
      imgs:[...root.querySelectorAll('img')].map(i=>i.currentSrc),bodyBg:getComputedStyle(document.body).backgroundColor,htmlBg:getComputedStyle(document.documentElement).backgroundColor,
      fonts:[...new Set(rules.map(r=>r.all['font-family']+' '+r.all['font-weight']))].slice(0,40)};
  },{PROPS,INH:[...INHERITED]});
  await b.close();return res;
}
(async()=>{
  const L=await snap('light');const D=await snap('dark');
  console.log('nodes',L.count,D.count,'root',JSON.stringify(L.root),'imgs',L.imgs,'bg',L.htmlBg,D.htmlBg);console.log(L.fonts.join('\n'));
  const decl=o=>Object.entries(o).map(([k,v])=>`${k}:${v}`).join(';');
  const CC=['border-top-color','border-right-color','border-bottom-color','border-left-color','outline-color','text-decoration-color','caret-color'];
  const prune=(o,all,lightKeep)=>{for(const pr of CC)if(pr in o&&o[pr]===all.color&&(!lightKeep||!(pr in lightKeep)))delete o[pr];
    for(const sd of ['top','right','bottom','left'])if(all[`border-${sd}-width`]==='0px'){delete o[`border-${sd}-style`];delete o[`border-${sd}-color`]}
    if(all['outline-style']==='none'){delete o['outline-color'];delete o['outline-width'];delete o['outline-offset']}
    if(all['text-decoration-line']==='none'){delete o['text-decoration-color'];delete o['text-decoration-style'];delete o['text-decoration-thickness']}
    if(all.transform==='none')delete o['transform-origin'];
    for(const k in o)if(typeof o[k]==='string')o[k]=o[k].replace(/http:\/\/127\.0\.0\.1:3181\/(?:brand\/current|brand\/lifetime\/your-day|textures\/finegraypaper)\//g,'a/');
    return o};
  let css=`/* your day, cloned from the redesigned portal (faf8f47) /today on the local fixture build (loopback only, fictional records,
   recording mode on), 1440 x 1400. Each rule is that element's computed style (inherited values only where they change), light first,
   then what dark changes. Generated by clone.cjs (landing fix-sizing-1112, row 11); do not edit by hand. The portal renders at zoom .8. */
@font-face{font-family:AlbertSansBrand;src:url("fonts/AlbertSans-Regular.woff2") format("woff2");font-weight:400;font-display:block}
@font-face{font-family:AlbertSansBrand;src:url("fonts/AlbertSans-Medium.woff2") format("woff2");font-weight:500;font-display:block}
@font-face{font-family:AlbertSansBrand;src:url("fonts/AlbertSans-SemiBold.woff2") format("woff2");font-weight:600;font-display:block}
@font-face{font-family:"AlbertSansBrand Fallback";src:local("Arial");ascent-override:90.91%;descent-override:23.92%;line-gap-override:0%;size-adjust:104.49%}
html,body{margin:0;background:${L.htmlBg}}html[data-theme="dark"],html[data-theme="dark"] body{background:${D.htmlBg}}
body{overflow:hidden}
.p9s{position:absolute;left:0;top:0;width:${L.root.w}px;height:1750px;zoom:${L.root.zoom};overflow:hidden;pointer-events:none}
.p9s *{animation:none!important;transition:none!important}
`;
  for(const r of L.rules){const k=prune({...r.keep},r.all);r.kept=k;if(r.id===0){delete k.zoom;k.width=L.root.w+'px';k.height='1750px';k['min-height']='0px'}css+=`.p9s .c${r.id}{${decl(k)}}\n`}
  for(const r of L.pseudo){r.kept=prune({...r.keep},r.all);css+=`.p9s .c${r.id}${r.ps}{${decl(r.kept)}}\n`}
  let dark=0;
  if(L.count===D.count){
    for(let i=0;i<L.rules.length;i++){const a=L.rules[i].all,b=D.rules[i].all;const diff={};for(const pr of PROPS)if(a[pr]!==b[pr]&&!['width','height','left','top','right','bottom'].includes(pr))diff[pr]=b[pr];prune(diff,b,L.rules[i].kept);if(Object.keys(diff).length){css+=`html[data-theme="dark"] .p9s .c${L.rules[i].id}{${decl(diff)}}\n`;dark++}}
    const pd=new Map(D.pseudo.map(x=>[x.id+x.ps,x]));for(const x of L.pseudo){const y=pd.get(x.id+x.ps);if(!y)continue;const diff={};for(const pr of PROPS)if(x.all[pr]!==y.all[pr])diff[pr]=y.all[pr];prune(diff,y.all,x.kept);if(Object.keys(diff).length)css+=`html[data-theme="dark"] .p9s .c${x.id}${x.ps}{${decl(diff)}}\n`}
  } else console.log('DARK SKIPPED: node counts differ');
  const html=`<!doctype html>
<html lang="en" data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>your day, in the P9 shell</title>
<link rel="stylesheet" href="${name}.css"><script src="p9-shell-live.js"></script>
</head>
<body data-page="today" data-crumb="your day">
<div class="p9s" aria-hidden="true">${L.html.replace(/^<div class="c0">|<\/div>$/g,'')}</div>
</body></html>
`;
  // the root's own rule goes on .p9s's single child: keep the root element (c0) inside .p9s
  const html2=html.replace(`<div class="p9s" aria-hidden="true">${L.html.replace(/^<div class="c0">|<\/div>$/g,'')}</div>`,`<div class="p9s" aria-hidden="true">${L.html}</div>`);
  fs.writeFileSync(path.join(outDir,'..',name+'-rects.json'),JSON.stringify({light:L.rules.map(r=>r.rect),dark:D.rules.map(r=>r.rect)}));fs.writeFileSync(path.join(outDir,name+'.css'),css);fs.writeFileSync(path.join(outDir,name+'.html'),html2);
  console.log('rules',L.rules.length,'dark rules',dark,'css bytes',css.length,'html bytes',html2.length);
})();
