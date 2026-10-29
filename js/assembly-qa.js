// Development-only stress harness. Imported only for loopback + ?qa=1.
const selector=['.feature h3','.feature p','.numbers strong','.numbers span','.profile span','.hero-copy>p:first-of-type','.step-copy h3','.step-copy p'].join(',');
const fields=[...document.querySelectorAll(selector)],original=fields.map(e=>e.textContent);
const fixtures={
  worst:{title:'Benachrichtigungseinstellungen',body:'A complete collection of recorded textures, layered instruments and carefully organised session files for independent producers working across languages and time zones. '.repeat(5),number:'1,000,000+',profile:'@independentproducercollective'},
  unicode:{title:'Đặng Thị Ngọc Hân · 王秀英 · 👩🏽‍💻',body:'نور الهدى عبد الرحمن — Aleksandra Wiśniewska-Kowalczyk. 音楽制作のためのサンプルコレクション。',number:'1.284',profile:'@ÓlafurDarriÓlafsson'},
  empty:{title:'',body:'',number:'0',profile:''},
  one:{title:'J',body:'One file.',number:'1',profile:'@a'}
};
const nav=document.createElement('nav');nav.setAttribute('aria-label','Development data');nav.className='qa-toggle';nav.innerHTML='<strong>Demo data / Worst case</strong>';
const style=document.createElement('style');style.textContent='.qa-toggle{position:fixed;bottom:12px;left:50%;transform:translateX(-50%);z-index:70;display:flex;flex-wrap:wrap;justify-content:center;gap:5px;max-width:calc(100% - 20px);width:max-content;background:#e5e5e5;border:1px solid #bbb;padding:6px;border-radius:15px;font:12px system-ui;box-shadow:0 3px 15px #0002}.qa-toggle strong{width:100%;text-align:center;font-size:11px}.qa-toggle button{border:0;border-radius:9px;padding:10px;background:transparent;font:12px system-ui;min-height:40px}.qa-toggle button[aria-pressed=true]{background:white}';document.head.append(style);
function set(mode){fields.forEach((el,i)=>{const f=fixtures[mode];el.textContent=!f?original[i]:el.matches('h3')?f.title:el.matches('.numbers strong')?f.number:el.matches('.profile span')?f.profile:f.body;el.dir='auto';});for(const b of nav.querySelectorAll('button'))b.setAttribute('aria-pressed',String(b.dataset.mode===mode));const url=new URL(location.href);url.searchParams.set('data',mode);history.replaceState(null,'',url);window.qaMode=mode;}
for(const [mode,label] of [['demo','Demo'],['worst','Worst case'],['unicode','Unicode'],['empty','Empty'],['one','One']]){const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.mode=mode;b.addEventListener('click',()=>set(mode));nav.append(b);}document.body.append(nav);set(new URLSearchParams(location.search).get('data')||'demo');window.setQAData=set;
