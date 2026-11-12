(function(){

const q=Object.fromEntries(new URLSearchParams(location.hash.slice(1)));
const H=document.documentElement;
if(q.theme==='dark')H.classList.add('dark');
if(q.opt==='b')H.classList.add('optb');
if(q.dev==='phone')H.classList.add('phone');
if(q.state==='tucked')H.classList.add('tucked');
const ic=(n,c='i')=>`<svg class="${c}"><use href="#${n}"/></svg>`;
const page=q.page||'home';
const row=(icon,label,on,n)=>`<a class="row${on?' on':''}">${ic(icon)}<span>${label}</span>${n?`<span class="n">${n}</span>`:''}</a>`;
const side=`
 <div class="sb-head"><button class="acct" aria-haspopup="menu"><span class="tile"><svg><use href="#mk"/></svg></span><span class="name">lifetime supply</span>${ic('down','i chev')}</button>
 <button class="tuck" aria-label="tuck the sidebar">${ic('panel')}</button></div>
 <nav class="nav">
  ${row('home','home',page==='home')}${row('clock','your day')}
  <div class="grp">the board</div>${row('file','briefs',false,'161')}${row('arrow','submissions')}
  <div class="grp">your library</div>${row('vault','vault')}${row('box','kits')}
  <div class="grp">your membership</div>${row('cap','mentorship')}${row('book','guides')}${row('users','the room')}
  <div class="sep"></div>${row('brief','business',page==='business')}
 </nav>
 <div class="sb-foot"><div class="news"><b>a whole new lifetime supply.</b><p>the new portal is live.</p><div class="acts"><span>dismiss</span></div></div></div>`;
const L=(a,b)=>`<div><span>${a}</span><span>${b}</span></div>`;
const card=(t,p,rows)=>`<div class="card"><h3>${t}</h3><p>${p}</p><div class="lst">${rows}</div></div>`;
const cards=[
 card('briefs','the briefs i’m working on with artists. new ones every day.',L('<span class="blur">late-night r&amp;b</span>','r&amp;b, urgent')+L('<span class="blur">nova reign</span>','r&amp;b, urgent')+L('the board','161 live')),
 card('the vault','3,500+ samples with stems.',L('solos + starters','')+L('the kit vault','4 kits')+L('every sample','3,500+')),
 card('kits','a members-only kit lands every month and never goes public.',L('members only kit, vol. 1','new')+L('octaves creator suite','7 kits')+L('analog alchemy','one-shots')),
 card('the room','my private members discord. feedback, flips, wins and drops. the team, pushing together.',L('feedback on your beats','')+L('flips and collabs','')+L('your wins','')),
 card('mentorship','videos land as they’re filmed. every module is written out today.',L('the producer blueprint','18 modules')+L('the psychology of the close','16 modules')+L('introduction','')),
 card('guides','the written playbooks behind my career.',L('the 2026 producer guide','')+L('how to get placements as a music producer','')+L('the inner game of selling beats','')),
 card('your day','your day, planned around the briefs. today, habits, wins and the week.',L('today','6 to do')+L('the week','6 tasks')+L('every day','2 habits')),
 card('submissions','every status moved by hand, and my feedback on each one.',L('new','1')+L('in review','0')+L('sent to artist','0')+L('placed','0')),
];
let body;
if(page==='business') body=`<div class="state"><svg class="mark-s"><use href="#mk"/></svg><h2>coming soon.</h2><p>invoices, clients, splits and placements in one place. we’re finishing it now.</p></div>`;
else if(page==='notfound') body=`<div class="state"><svg class="mark-s"><use href="#mk"/></svg><h2>page not found.</h2><p>that page moved or never existed.</p><span class="pill">back to home</span></div>`;
else { const B=(n,m,g)=>`<div class="brow"><b class="blur">${n}</b><span>${g}</span><small>${m}</small><span>urgent</span></div>`;
 const wide=`<div class="card wide"><div class="tabs"><span class="tab on">urgent <i>36</i></span><span class="tab">hot <i>60</i></span><span class="tab">warm <i>40</i></span><span class="tab">cold <i>25</i></span></div>
 ${B('nova reign','closes nov 13','r&amp;b')}${B('sable lane','posted 3 days ago','soul')}${B('orin avery','posted 5 days ago','dancehall')}${B('zion rivers','posted 8 days ago','amapiano')}${B('ayla reign','closes nov 16','r&amp;b')}</div>`;
 body= q.dev==='phone' ? `<div class="cols">${wide}${cards[6]}</div>` : `<div class="cols"><div class="stack">${cards[6]}${cards[1]}</div>${wide}<div class="stack">${cards[7]}${cards[2]}</div></div>`; }
const crumb=page==='home'?'home':page==='business'?'business':'not found';
const desk=q.dev!=='phone';
const top=desk?`<header class="tb"><div class="crumbs"><button class="nav-b" aria-label="back">${ic('left')}</button><button class="nav-b off" aria-label="forward">${ic('right')}</button>${ic('home')}<span class="slash">/</span><span class="here">${crumb}</span></div>
 <div class="tb-r"><button class="search">${ic('search')}<span>search</span><kbd>⌘K</kbd></button><button class="ib" aria-label="theme">${ic(H.classList.contains('dark')?'sun':'moon')}</button><button class="help">help</button></div></header>`
 :`<header class="tb"><div class="crumbs"><button class="ib" aria-label="menu">${ic('menu')}</button><span class="tile" style="width:26px;height:26px"><svg><use href="#mk"/></svg></span><span class="here" style="margin-left:8px">${crumb}</span></div><div class="tb-r" style="gap:2px"><button class="ib">${ic('search')}</button><button class="ib">${ic(H.classList.contains('dark')?'sun':'moon')}</button><button class="help">help</button></div></header>`;
document.getElementById('root').innerHTML=`<div class="app"><aside class="sb">${side}</aside><main class="panel">${top}<div class="content"><div class="inner">${body}</div></div></main></div>`;
let ov='';
const isB=H.classList.contains('optb');
if(q.state==='account'){const x=isB?14:24,y=isB?52:76;ov=`<div class="menu" style="left:${x}px;top:${y}px;width:264px"><div class="mh"><span class="av"><span class="blur">J</span></span><div><b class="blur">jordan reyes</b><small class="blur">member@example.test</small></div></div><div class="g">
 <div class="mi">${ic('user')}profile</div><div class="mi hov">${ic('plus')}referrals</div><div class="mi">${ic('sliders')}settings</div><div class="mi">${ic('msg')}send feedback</div><div class="mi">${ic('sun')}theme<span class="seg"><span class="${H.classList.contains('dark')?'':'on'}">light</span><span class="${H.classList.contains('dark')?'on':''}">dark</span></span></div></div><div class="hr"></div><div class="g"><div class="mi">${ic('out')}sign out</div></div></div>`;}
if(q.state==='search'){ov=`<div class="scrim"></div><div class="menu pal"><div class="in">${ic('search')}<span>kit</span></div><div class="lab">pages</div><div class="g" style="padding-top:0"><div class="mi hov">${ic('box')}<span class="p">your library</span>${ic('right')}<span>kits</span></div></div><div class="hr"></div><div class="lab">kits</div><div class="g" style="padding-top:0">
 <div class="mi">${ic('box')}<span class="p">kits</span>${ic('right')}<span>members only kit, vol. 1</span><span class="v">68 files</span></div>
 <div class="mi">${ic('box')}<span class="p">kits</span>${ic('right')}<span>octaves creator suite: part two</span><span class="v">171 files</span></div>
 <div class="mi">${ic('box')}<span class="p">kits</span>${ic('right')}<span>octaves creator suite</span><span class="v">1,337 files</span></div>
 <div class="mi">${ic('box')}<span class="p">kits</span>${ic('right')}<span>analog alchemy</span><span class="v">346 files</span></div>
 <div class="mi">${ic('wave')}<span class="p">kits</span>${ic('right')}<span class="blur">breakthespell kit demo</span><span class="v">composition</span></div></div>
 <div class="foot"><span><kbd>↑</kbd><kbd>↓</kbd>navigate</span><span><kbd>↵</kbd>open</span><span style="margin-left:auto"><kbd>esc</kbd>close</span></div></div>`;}
if(q.state==='help'){ov=`<div class="scrim"></div><div class="dlg"><button class="x">${ic('x')}</button><h2>get help.</h2><p>tell me what you’re stuck on. i read every one.</p><p class="u" style="font-size:14px">replay the tour</p>
 <div class="lbl">mail me at</div><div style="font-weight:500;font-size:15px">hi@elaye.store</div><div class="soc"><span>${ic('ig')}</span><span>${ic('yt')}</span><span>${ic('xl')}</span><span>${ic('bag')}</span></div><div class="hr2"></div>
 <div class="lbl" style="color:var(--ink)">or leave me a message</div><div class="two"><div><div class="lbl" style="margin-top:4px">your name</div><div class="fld"><span class="blur">jordan reyes</span></div></div><div><div class="lbl" style="margin-top:4px"><span>email</span><span>i reply here</span></div><div class="fld"><span class="blur">member@example.test</span></div></div></div>
 <div class="lbl">what’s going on</div><div class="fld ta">the more specific, the better.</div><div class="lbl" style="justify-content:flex-end;margin-top:6px">1,500 characters left</div>
 <div class="lbl" style="margin-top:6px">what it’s about</div><div class="chips"><span class="chip">beat feedback</span><span class="chip">placements</span><span class="chip">career plan</span><span class="chip">mixing</span><span class="chip">business</span><span class="chip">other</span></div>
 <button class="send">send</button><p style="font-size:13px;margin-top:14px">not stuck, just an idea? <span class="u">send feedback</span></p></div>`;}
if(q.state==='toast'){ov=`<div class="toast">${ic('ok','i')}<div><b>saved</b><small>kept on this device.</small></div><span class="x">${ic('x')}</span></div>`;}
if(q.state==='sheet'){ov=`<div class="scrim"></div><aside class="sheet">${side}</aside>`;}
document.body.insertAdjacentHTML('beforeend',ov);

})();
