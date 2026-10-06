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
  document.querySelectorAll('[data-demo-go]').forEach(function(link){link.addEventListener('click',function(event){
    event.preventDefault();select(Number(link.dataset.demoGo));
    var destination=window.matchMedia('(max-width: 640px)').matches?picker:tabs[step];
    destination.focus({preventScroll:true});
    demo.scrollIntoView({behavior:mq.matches?'instant':'smooth',block:'start'});
    history.replaceState(null,'','#portal');
  });});
  select(0);root.classList.add('demo-ready');
  var filmStage=document.querySelector('.film-stage');
  if(filmStage){
    var film=filmStage.querySelector('video');
    filmStage.querySelector('.film-cover').addEventListener('click',function(){
      filmStage.classList.remove('is-ready');film.inert=false;film.focus();film.play().catch(function(){});
    });
    film.inert=true;filmStage.classList.add('is-ready');
  }
  // Illustrative calendar; no member tasks or progress are copied.
  var today=new Date();
  document.querySelectorAll('[data-today]').forEach(function(element){element.textContent=new Intl.DateTimeFormat('en-AU',{weekday:'long',day:'numeric',month:'long'}).format(today);});
  var monday=new Date(today);monday.setDate(today.getDate()-(today.getDay()+6)%7);
  document.querySelectorAll('.d-week .d-day').forEach(function(cell,i){var day=new Date(monday);day.setDate(monday.getDate()+i);cell.querySelector('b').textContent=day.getDate();cell.classList.toggle('is-today',day.toDateString()===today.toDateString());});
  // Finite entrances only. Without JS or with reduced motion, everything stays visible.
  var entrances=Array.from(document.querySelectorAll('[data-enter]'));
  if('IntersectionObserver' in window){
    var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){
      if(!entry.isIntersecting)return;
      entry.target.classList.add('is-entered');observer.unobserve(entry.target);
    });},{threshold:0.25});
    entrances.forEach(function(element){observer.observe(element);});
  }
  // A failed API retains the dated career snapshot, never a false live label.
  function short(n){var units=[[1e9,'B'],[1e6,'M'],[1e3,'K']];for(var i=0;i<units.length;i++){if(n>=units[i][0]){var value=n/units[i][0];return(value>=100?Math.floor(value):Math.floor(value*10)/10)+units[i][1]+'+';}}return String(Math.floor(n));}
  fetch('/api/muso').then(function(r){return r.ok?r.json():null;}).then(function(data){if(!data)return;document.querySelectorAll('[data-muso]').forEach(function(element){var n=data[element.dataset.muso];if(typeof n==='number'&&Number.isFinite(n)&&n>0)element.textContent=short(n);});}).catch(function(){}).finally(function(){
    if(mq.matches||!('IntersectionObserver' in window))return;
    var box=document.querySelector('.credits-live');
    var observer=new IntersectionObserver(function(entries){if(!entries[0].isIntersecting)return;observer.disconnect();
      var cells=Array.from(box.querySelectorAll('[data-muso]'));
      var targets=cells.map(function(cell){var text=cell.textContent;var match=text.match(/^(\d+(?:\.\d+)?)(.*)$/);return{value:Number(match[1]),suffix:match[2],digits:match[1].includes('.')?1:0,text:text};});
      var start;
      function tick(now){if(start===undefined)start=now;var progress=Math.min((now-start)/1000,1);var eased=1-Math.pow(1-progress,3);
        cells.forEach(function(cell,i){var target=targets[i];cell.textContent=progress===1?target.text:(target.value*eased).toFixed(target.digits)+target.suffix;});
        if(progress<1)requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    },{threshold:.35});
    observer.observe(box);
  });
})();
