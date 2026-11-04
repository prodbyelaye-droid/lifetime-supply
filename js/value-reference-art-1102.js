/* Magic UI AnimatedList: finite reverse insertion at 1000ms intervals.
   Spring 350/40 is sampled analytically; no framework dependency or fake activity. */
(()=>{const list=document.querySelector('.mv-notification-list');if(!list)return;
const items=[...list.children], reduced=matchMedia('(prefers-reduced-motion: reduce)');
let started=false,timers=[],animations=[];
const paused=()=>reduced.matches||document.documentElement.hasAttribute('data-motion-paused')||document.documentElement.classList.contains('motion-paused');
const settle=()=>{timers.forEach(clearTimeout);timers=[];animations.forEach(a=>a.cancel());animations=[];items.forEach(item=>{item.hidden=false;item.style.display='';});};
const frames=Array.from({length:41},(_,i)=>{const t=i/40*.8,r1=(-40+Math.sqrt(200))/2,r2=(-40-Math.sqrt(200))/2;const y=1+(r2*Math.exp(r1*t)-r1*Math.exp(r2*t))/(r1-r2);return {transform:`scale(${y})`,opacity:y,offset:i/40};});
const show=(item)=>{const old=[...list.children].filter(x=>x.style.display!=='none').map(x=>[x,x.getBoundingClientRect().top]);item.style.display='';list.prepend(item);animations.push(item.animate(frames,{duration:800,easing:'linear'}));old.forEach(([el,top])=>{const dy=top-el.getBoundingClientRect().top;if(dy)animations.push(el.animate([{transform:`translateY(${dy}px)`},{transform:'translateY(0)'}],{duration:600,easing:'cubic-bezier(.2,.8,.2,1)'}));});};
const observer=new IntersectionObserver(entries=>{if(!entries.some(e=>e.isIntersecting)||started)return;started=true;observer.disconnect();if(paused())return;items.forEach(x=>x.style.display='none');items.forEach((item,i)=>timers.push(setTimeout(()=>{if(paused()){settle();return;}show(item);},i*1000)));},{threshold:.3});observer.observe(list);
new MutationObserver(()=>{if(paused())settle();}).observe(document.documentElement,{attributes:true,attributeFilter:['data-motion-paused','class']});reduced.addEventListener('change',()=>{if(reduced.matches)settle();});
})();
