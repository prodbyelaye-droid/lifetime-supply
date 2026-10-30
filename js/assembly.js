import {createHeroDesign} from './hero-design.js';
import {LANDING} from './landing-config.js';
import {createGrads} from './grad.js';
// The one shared cartoon blot (task 003; Elaye 00:24 "they need to be like fucking cartoonish"). The PENS blot.js is retired.
import {mountAll,manualClock,renderAt as blotAt,setPaused as pauseBlots,setShape} from './blot2.js';
import {createOpening} from './opening.js';
import {createFeatures} from './evervault-features.js';
import {createDemo} from './demo.js';
import {createSections} from './sections008.js';
import {setPaused as pauseFields,renderAt as fieldsAt,resume as resumeFields} from './lightfield.js';
const hero=document.querySelector('.hero');
function setHero(value){if(!['cloud','full'].includes(value))throw new Error('Unknown hero treatment');hero.dataset.hero=value;}
setHero(LANDING.hero);
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
// 012: Deep is Codex's grad-183 by default; ?deep=sabo keeps 010's Sabo material (it must leave before the material
// system collects its hosts).
// 019: ?downloads=hidden hides the download section (Codex 012: the GitHub v1.0.0 build has the cleanup bug, and 1.0.1
// fails Gatekeeper); the download links stay as they are, and the header's "the portal" goes to the portal itself (021).
if(new URLSearchParams(location.search).get('downloads')==='hidden'){document.getElementById('portal').hidden=true;document.querySelector('a[href="#portal"]').href='https://portal.elaye.store';}
const deepMode=new URLSearchParams(location.search).get('deep');
if(deepMode!=='sabo')document.querySelector('.deep-sabo')?.remove();
// 016: the Sabo material (and its 2 MB of Three) loads only when a host is on the page (?deep=sabo); the default page
// has none. Until then, and without one, this stand-in answers every call.
let realMaterial=null,materialPaused=false;
const material={renderAt(t){realMaterial?.renderAt(t)},resume(){realMaterial?.resume()},setPaused(v){materialPaused=v;realMaterial?.setPaused(v)},
  dispose(){realMaterial?.dispose()},stats(){return realMaterial?realMaterial.stats():{contexts:0,paused:materialPaused,reduced:reduced.matches,scheduled:false,hosts:[],loaded:false}}};
if(document.querySelector('[data-material]'))import('./material.js').then(({createMaterialSystem})=>{realMaterial=createMaterialSystem(undefined,reduced);realMaterial.setPaused(materialPaused);});
// 016: the inclusions scroll sideways only on a phone; only then is their labelled region a tab stop
{const sc=document.querySelector('.price-scroll');const fit=()=>{if(!sc)return;sc.scrollWidth>sc.clientWidth+1?sc.setAttribute('tabindex','0'):sc.removeAttribute('tabindex');};fit();addEventListener('resize',fit);}
const grads=createGrads(reduced);
// 010: V1 is an exact static asset; replaced fields no longer allocate hidden WebGL contexts.
const gradcode={renderAt(){},setPaused(){}};
// 155's pixel symbols are a variant (task 004): LANDING.pixels, or ?pixels=on|face to preview.
const opening=createOpening(reduced,new URLSearchParams(location.search).get('pixels')||LANDING.pixels);
// Features boxes (012): A, white with ink and colour only in the vault and one more (default); ?boxes=bloom gives each
// box its own GRADCODE bloom from a corner.
createFeatures(new URLSearchParams(location.search).get('boxes')==='bloom'?'bloom':'restraint',new URLSearchParams(location.search).get('vault')==='bloom'?'bloom':'arch');
// 010: the split card uses the approved V1 asset in CSS.
// 012, 019: the download panel on 34's own glow, turned to 150's violet; the closing call on 192's frosted field.
// Closing call options (task 009, 019): ?close=a|b|c|192 (192 is option d), default b; read before its field is drawn.
{const v=new URLSearchParams(location.search).get('close');if(['a','b','c','d','192'].includes(v))document.querySelector('.close-call').dataset.variant=v==='192'?'d':v;if(v==='c')document.querySelector('.close-blot').dataset.colour='magenta';}
// 010: white download section; the close uses 030's V1 glow asset.
// The film: full width by default; ?demo=window previews row 12's rounded glowing window.
const demo=createDemo(reduced,new URLSearchParams(location.search).get('demo')||'full');
// Stats odometer, 34's liquid arch, and the How-it-works variant (?how=191).
const sections=createSections(reduced,new URLSearchParams(location.search).get('how')||'off');
{const q=new URLSearchParams(location.search);if(q.get('pricetype')==='white')document.documentElement.dataset.pricetype='white';if(q.get('band')==='text')document.documentElement.dataset.band='text';if(q.get('footblot')==='magenta')document.querySelector('.footer-blob').dataset.colour='magenta';
 // 011: the original blot edge is the default; ?blot=lumps keeps 006's smooth lumps. The walkthrough links sit under the
 // film (his 19:34 "under the text in the walkthrough"); ?links=hero keeps them under the price.
 if(q.get('blot')==='lumps'){setShape('lumps');document.documentElement.dataset.blot='lumps';}
 // 013: the white blot on the flood is 160 px on a phone (200 px from 700 up).
 if(innerWidth<700)document.querySelector('.flood-rider')?.setAttribute('data-size','160');
 // 014, 019: the deep tile's white blot is 100 px on a phone, so it sits whole on the green, clear of the sky and the logo.
 if(innerWidth<700)document.querySelector('.deep-b2')?.setAttribute('data-size','100');
 if(q.get('links')!=='hero'){const m=document.querySelector('.hero-more'),d=document.querySelector('.demo');if(m&&d){m.classList.add('demo-links');d.append(m);}}}
let blotsMounted=false;
const fine=matchMedia('(hover: hover) and (pointer: fine)');
const gsap=window.gsap;
let paused=false,manual=false;
const root=document.documentElement;
const opener=document.querySelector('#opener'),main=document.querySelector('main'),footer=document.querySelector('footer'),skip=document.querySelector('.skip');
const intro=gsap.timeline({paused:true,defaults:{ease:'power3.out'}});
let failSafe;
function finishIntro(){
  const hadFocus=opener.contains(document.activeElement);
  opener.hidden=true;main.inert=false;footer.inert=false;skip.hidden=false;root.classList.remove('intro-lock');
  clearTimeout(failSafe);
  if(hadFocus)document.querySelector('.wordmark').focus({preventScroll:true});
  if(!blotsMounted){blotsMounted=true;mountAll();}
}
function startIntro(){
  opener.hidden=false;main.inert=true;footer.inert=true;skip.hidden=true;root.classList.add('intro-lock');
  // No pet blot (R2): the 145 gradient opens as a blot from the centre, then gives way to the hero's own 145 blot.
  gsap.set('.intro-white',{opacity:1});gsap.set('.intro-flood',{clipPath:'circle(0% at 50% 52%)'});gsap.set(opener,{opacity:1});
  intro.clear();
  intro.to('.intro-flood',{clipPath:'circle(18% at 50% 52%)',duration:.7,ease:'back.out(1.6)'},.2)
    .to('.intro-flood',{clipPath:'circle(80% at 50% 52%)',duration:.75,ease:'power3.inOut'},1.0)
    .to(opener,{opacity:0,duration:.6},1.85)
    .call(finishIntro,null,2.5);
  intro.play(0);failSafe=setTimeout(finishIntro,5000);
}
const alreadyVisited=sessionStorage.getItem('landing-assembly-intro');
// Task 001: the opener stays off. Its pet blot is gone and its 145 flood was the blue gradient Elaye rejected (00:23); a new opening comes with the later gradient task.
void alreadyVisited;finishIntro();
const heroDesign=createHeroDesign(reduced);
document.querySelector('.intro-skip').addEventListener('click',()=>{intro.pause();finishIntro();});
document.addEventListener('keydown',e=>{root.dataset.keyboard='true';if(e.key==='Escape'&&!opener.hidden){intro.pause();finishIntro();}});
document.addEventListener('pointerdown',()=>delete root.dataset.keyboard,{passive:true});

// Section-owned loops pause outside their own viewport and on hidden documents.
const loops=new Map(),visible=new Set();
function addLoop(section,animation){const list=loops.get(section)||[];list.push(animation.pause());loops.set(section,list);}
addLoop(document.querySelector('.inside'),gsap.to('.product',{y:-10,duration:5.2,ease:'sine.inOut',repeat:-1,yoyo:true}));
// 183R source scale/rotation, slowed to a continuous breath; overlapping original
// silhouettes move independently so the outer contour changes without path repaint.
// Task 005: 183R "barely moves" -> the white blot travels a slow loop across the field while it glows and morphs.
addLoop(document.querySelector('.deep-wrap'),gsap.timeline({repeat:-1,defaults:{ease:'sine.inOut',duration:3.2}}).to('.deep-symbol',{x:90,y:-46,rotation:10,scale:1.08}).to('.deep-symbol',{x:20,y:40,rotation:-6,scale:.94}).to('.deep-symbol',{x:-80,y:-20,rotation:8,scale:1.05}).to('.deep-symbol',{x:0,y:0,rotation:0,scale:1}));
function syncMotion(){
  const stopped=paused||reduced.matches||document.hidden||manual;
  if(stopped)root.dataset.motionPaused='true';else delete root.dataset.motionPaused;
  for(const [section,animations] of loops)for(const a of animations){if(!stopped&&visible.has(section))a.resume();else a.pause();}
  material.setPaused(paused||document.hidden);
  grads.setPaused(paused||document.hidden);gradcode.setPaused(paused||document.hidden);
  pauseBlots(paused||document.hidden);pauseFields(paused||document.hidden);demo.setPaused(paused||document.hidden);sections.setPaused(paused||document.hidden);opening.setPaused(paused||document.hidden);
  if(reduced.matches){intro.pause();finishIntro();for(const animations of loops.values())for(const a of animations)a.progress(0).pause();}
  heroDesign.sync(stopped,paused);
  wakeDecorations();
}
const observer=new IntersectionObserver(entries=>{for(const e of entries){e.target.classList.toggle('in-view',e.isIntersecting);if(e.isIntersecting)visible.add(e.target);else visible.delete(e.target);}syncMotion();},{threshold:0});
for(const section of document.querySelectorAll('[data-section]'))observer.observe(section);
const motionButton=document.querySelector('#motion-toggle');
motionButton.addEventListener('click',()=>{paused=!paused;motionButton.setAttribute('aria-pressed',String(paused));motionButton.textContent=paused?'play motion':'pause motion';syncMotion();});
// Subscribe after the first paint as well as checking the initial preference.
// This keeps browser media emulation and OS changes on the same control path.
let motionPreferenceEvents;
requestAnimationFrame(()=>{motionPreferenceEvents=matchMedia('(prefers-reduced-motion: reduce)');motionPreferenceEvents.addEventListener('change',syncMotion);syncMotion();});
document.addEventListener('visibilitychange',syncMotion);

// Row 040 profile navigation: semantic disclosure, no width animation.
const toggle=document.querySelector('#profile-toggle'),links=document.querySelector('#profile-links');
function profile(open){links.hidden=!open;if(open&&!reduced.matches)gsap.from('#profile-links a',{x:-14,opacity:0,duration:.32,stagger:.05,ease:'power3.out',overwrite:true});toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Hide profile links':'Show profile links');}
toggle.addEventListener('click',()=>profile(links.hidden));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!links.hidden){profile(false);toggle.focus();}});
document.addEventListener('click',e=>{if(!e.target.closest('.profile-nav'))profile(false);});

// The cursor-follow light is removed (22:39). The row 020 logo lines still react to the pointer.
let lineMouse={x:-1000,y:-1000};
footer.addEventListener('pointermove',e=>{if(!fine.matches||paused||reduced.matches)return;const l=lines.getBoundingClientRect();lineMouse={x:e.clientX-l.left,y:e.clientY-l.top};},{passive:true});
footer.addEventListener('pointerleave',()=>{lineMouse={x:-1000,y:-1000};});

// Row 011 strands are static, as before Fix round 1; the blots that travelled on them are removed (22:39).
// Row 002 halftone equation ported, recoloured from 034. Canvas redraw is bounded to footer.
const wave=document.querySelector('.footer-wave'),wc=wave.getContext('2d');
// Task 005: row 002's halftone band at the original's scale (its own strip under the footer, ~42% of a screen):
// fine ink dots (5 px grid) sized by a slow flowing field, so the shape reads as the original's moving wave.
function drawWave(t){const w=wave.clientWidth,h=wave.clientHeight,d=Math.min(2,devicePixelRatio||1);if(wave.width!==Math.round(w*d)||wave.height!==Math.round(h*d)){wave.width=Math.round(w*d);wave.height=Math.round(h*d);}wc.setTransform(d,0,0,d,0,0);wc.clearRect(0,0,w,h);wc.fillStyle='#151517';
 // task 010: the dot screen runs at 45 degrees, like row 002's
 const c=Math.SQRT1_2,step=5,R=Math.hypot(w,h)/2+step,cx=w/2,cy=h/2;
 for(let u=-R;u<R;u+=step)for(let v=-R;v<R;v+=step){const x=cx+(u-v)*c,y=cy+(u+v)*c;if(x<-4||y<-4||x>w+4||y>h+4)continue;const nx=x/w,ny=y/h,field=Math.sin(nx*5.2+t*.22+Math.sin(ny*3.1+t*.13)*1.4)+.8*Math.cos(ny*4.4-nx*2.3-t*.17)+.3*Math.sin(nx*11-ny*6+t*.3),q=Math.max(0,Math.min(1,(field+.15)*.9+.5)),q2=q*q*(3-2*q),vv=q2*q2*(3-2*q2),r=3.1*vv;if(r>.2){wc.beginPath();wc.arc(x,y,r,0,Math.PI*2);wc.fill();}}
}
// Row 020 sampled vertical-line logo, retains its original scatter/reassemble method.
const lines=document.querySelector('#logo-lines'),lc=lines.getContext('2d'),logo=new Image();let points=[];
logo.src='assets/assembly/blot.png';
logo.onload=()=>{const off=document.createElement('canvas');off.width=200;off.height=160;const c=off.getContext('2d');c.drawImage(logo,20,0,160,160);const data=c.getImageData(0,0,200,160).data;
 for(let x=0;x<200;x+=5){let start=-1;for(let y=0;y<=160;y++){const a=y<160?data[(y*200+x)*4+3]:0;if(a>90&&start<0)start=y;if(a<=90&&start>=0){points.push({x:x+30,y:start+10,h:y-start,dx:0,dy:0});start=-1;}}}drawLines();};
function drawLines(){if(!lines.clientWidth)return;if(lines.width!==260||lines.height!==180){lines.width=260;lines.height=180;}lc.clearRect(0,0,260,180);lc.strokeStyle='#14161a';lc.lineCap='round';lc.lineWidth=3;
 const localX=lineMouse.x,localY=lineMouse.y;
 for(const [i,p] of points.entries()){const d=Math.hypot(p.x-localX,p.y+p.h/2-localY),force=paused||reduced.matches?0:Math.max(0,1-d/150);p.dx+=(Math.cos(i*2.1)*force*35-p.dx)*.13;p.dy+=(Math.sin(i*1.3)*force*30-p.dy)*.13;lc.beginPath();lc.moveTo(p.x+p.dx,p.y+p.dy);lc.lineTo(p.x+p.dx,p.y+p.dy+p.h);lc.stroke();}
}
let decorationRaf=0,decorationTime=0,lastFrame=0,previous=performance.now();
function decorate(now){decorationRaf=0;if(manual||paused||reduced.matches||document.hidden)return;const dt=Math.min(.1,(now-previous)/1000);previous=now;decorationTime+=dt;if(now-lastFrame>33){if(visible.has(footer)){drawWave(decorationTime);drawLines();}lastFrame=now;}if(visible.has(footer))decorationRaf=requestAnimationFrame(decorate);}
function wakeDecorations(){if(!decorationRaf&&!manual&&!paused&&!reduced.matches&&!document.hidden&&visible.has(footer)){previous=performance.now();decorationRaf=requestAnimationFrame(decorate);}}
drawWave(0);
const featureGrid=document.querySelector('.feature-grid');
if(!reduced.matches&&'IntersectionObserver' in window){
  const boxes=featureGrid.querySelectorAll('.feature'),heads=document.querySelectorAll('.features header>*');
  gsap.set(boxes,{y:70,scale:.95,opacity:0});gsap.set(heads,{y:40,opacity:0});gsap.set('.feature-art svg.art',{scale:1.12});
  const reveal=new IntersectionObserver(es=>{if(!es.some(e=>e.isIntersecting))return;reveal.disconnect();
    gsap.to(heads,{y:0,opacity:1,duration:.8,stagger:.08,ease:'power3.out'});
    gsap.to(boxes,{y:0,scale:1,opacity:1,duration:.9,stagger:.09,ease:'power3.out',delay:.1,clearProps:'transform,opacity'});
    gsap.to('.feature-art svg.art',{scale:1,duration:1.4,stagger:.09,ease:'power2.out',delay:.1,clearProps:'transform'});},{threshold:.12});
  reveal.observe(featureGrid);
}
window.assembly={material,intro,setHero,skip:finishIntro,
  renderAt(t,{opener:showIntro=false}={}){manual=true;heroDesign.renderAt(t);cancelAnimationFrame(decorationRaf);decorationRaf=0;material.renderAt(t);gradcode.renderAt(t);manualClock(true);blotAt(t);fieldsAt(t);opening.renderAt(t);sections.renderAt(t);const seeked=grads.renderAt(t);for(const animations of loops.values())for(const a of animations)a.totalTime(t).pause();drawWave(t);drawLines();
    if(showIntro){startIntro();intro.pause(t);clearTimeout(failSafe);}else{intro.pause();finishIntro();}syncMotion();return seeked;},
  resume(){manual=false;heroDesign.resume();material.resume();grads.resume();opening.resume();resumeFields();manualClock(false);syncMotion();},
  stats:()=>({...material.stats(),heroDesign:heroDesign.stats()})
};
window.addEventListener('pagehide',()=>{motionPreferenceEvents?.removeEventListener('change',syncMotion);intro.pause();finishIntro();observer.disconnect();cancelAnimationFrame(decorationRaf);material.dispose();heroDesign.dispose();for(const animations of loops.values())for(const a of animations)a.kill();},{once:true});
window.ready=true;
if(['localhost','127.0.0.1','[::1]'].includes(location.hostname)&&new URLSearchParams(location.search).get('qa')==='1')import('./assembly-qa.js');
