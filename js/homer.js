/* Native portal preview. No account data or submission endpoints. */
(function () {
  'use strict';
  var root=document.documentElement;
  var mq=window.matchMedia('(prefers-reduced-motion: reduce)');
  var demo=document.getElementById('demo');
  var tabs=Array.from(demo.querySelectorAll('[role="tab"]'));
  var panels=Array.from(demo.querySelectorAll('[role="tabpanel"]'));
  var picker=document.getElementById('demo-section');
  var step=0;
  function select(index) {
    step=(index+tabs.length)%tabs.length;
    tabs.forEach(function(tab,i){tab.setAttribute('aria-selected',String(i===step));tab.tabIndex=i===step?0:-1;});
    panels.forEach(function(panel,i){panel.hidden=i!==step;panel.classList.toggle('is-on',i===step);});
    picker.value=String(step);
    document.querySelector('[data-demo-step]').textContent=String(step+1).padStart(2,'0')+' / 09';
    document.querySelector('[data-demo-name]').textContent=panels[step].dataset.name;
    document.querySelector('[data-demo-text]').textContent=panels[step].dataset.text;
  }
  tabs.forEach(function(tab,i){tab.addEventListener('click',function(){select(i);});});
  demo.querySelector('[role="tablist"]').addEventListener('keydown',function(event){
    var next={ArrowRight:step+1,ArrowLeft:step-1,Home:0,End:tabs.length-1};
    if(!(event.key in next))return;
    event.preventDefault();select(next[event.key]);tabs[step].focus();
  });
  picker.addEventListener('change',function(){select(Number(picker.value));});
  document.querySelectorAll('[data-demo-go]').forEach(function(link){link.addEventListener('click',function(){select(Number(link.dataset.demoGo));});});
  select(0);root.classList.add('demo-ready');
  // Illustrative calendar; no member tasks or progress are copied.
  var today=new Date();
  document.querySelectorAll('[data-today]').forEach(function(element){element.textContent=new Intl.DateTimeFormat('en-AU',{weekday:'long',day:'numeric',month:'long'}).format(today);});
  var monday=new Date(today);monday.setDate(today.getDate()-(today.getDay()+6)%7);
  document.querySelectorAll('.d-week .d-day').forEach(function(cell,i){var day=new Date(monday);day.setDate(monday.getDate()+i);cell.querySelector('b').textContent=day.getDate();cell.classList.toggle('is-today',day.toDateString()===today.toDateString());});
  // Load plates near the viewport. Failure and reduced motion keep posters.
  var paused=false;
  var videos=Array.from(document.querySelectorAll('video[data-motion]'));
  var controls=Array.from(document.querySelectorAll('[data-motion-toggle]'));
  function allowed(){return !paused&&!mq.matches&&!document.hidden;}
  function updateVideo(video){
    if(!allowed()||!video._near||(!video.loop&&video.ended)){video.pause();video.parentElement.classList.remove('is-playing');return;}
    if(!video.src)video.src=video.dataset.motion;
    video.play().catch(function(){video.parentElement.classList.remove('is-playing');});
  }
  function updateMotion(){
    controls.forEach(function(button){button.hidden=mq.matches;button.setAttribute('aria-pressed',String(paused));button.textContent=paused?'play motion':'pause motion';});
    videos.forEach(updateVideo);
  }
  videos.forEach(function(video){
    video.addEventListener('playing',function(){video.parentElement.classList.add('is-playing');});
    video.addEventListener('ended',function(){video.parentElement.classList.remove('is-playing');});
    video.addEventListener('error',function(){video.parentElement.classList.remove('is-playing');});
  });
  controls.forEach(function(button){button.addEventListener('click',function(){paused=!paused;updateMotion();});});
  if('IntersectionObserver' in window){
    var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){var video=entry.target.querySelector('video');video._near=entry.isIntersecting;updateVideo(video);});},{rootMargin:'120px 0px',threshold:0});
    videos.forEach(function(video){observer.observe(video.parentElement);});
  }
  mq.addEventListener('change',updateMotion);
  document.addEventListener('visibilitychange',updateMotion);
  updateMotion();
  // A failed API retains the dated career snapshot, never a false live label.
  function short(n){var units=[[1e9,'B'],[1e6,'M'],[1e3,'K']];for(var i=0;i<units.length;i++){if(n>=units[i][0]){var value=n/units[i][0];return(value>=100?Math.floor(value):Math.floor(value*10)/10)+units[i][1]+'+';}}return String(Math.floor(n));}
  fetch('/api/muso').then(function(r){return r.ok?r.json():null;}).then(function(data){if(!data)return;document.querySelectorAll('[data-muso]').forEach(function(element){var n=data[element.dataset.muso];if(typeof n==='number'&&Number.isFinite(n)&&n>0)element.textContent=short(n);});}).catch(function(){});
})();
