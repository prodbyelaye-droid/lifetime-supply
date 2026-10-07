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
  // This planner is deliberately in memory: no account, storage or submission calls.
  var today=new Date();today.setHours(12,0,0,0);
  var dateFormat=new Intl.DateTimeFormat('en-AU',{weekday:'long',day:'numeric',month:'long'});
  document.querySelectorAll('[data-today]').forEach(function(el){el.textContent=dateFormat.format(today);});
  var monday=new Date(today);monday.setDate(today.getDate()-(today.getDay()+6)%7);
  var days=Array.from({length:7},function(_,i){var day=new Date(monday);day.setDate(monday.getDate()+i);return day;});
  var todayIndex=(today.getDay()+6)%7;
  var tasks=[{id:1,body:'finish a beat',day:todayIndex,done:false},{id:2,body:'pick sounds for a pack',day:null,done:false}];
  var nextTask=3;
  var dayPanel=document.getElementById('dp-1');
  var week=document.getElementById('demo-week');
  function element(tag,className,text){var el=document.createElement(tag);el.className=className;if(text!==undefined)el.textContent=text;return el;}
  function taskRow(task,inWeek){
    var row=element('li','d-task'+(task.done?' is-done':''));row.dataset.task=task.id;
    var label=element('label','d-task-label');
    var check=element('input','');check.type='checkbox';check.checked=task.done;
    check.addEventListener('change',function(){task.done=check.checked;renderTasks();document.getElementById('demo-task').focus({preventScroll:true});});
    label.append(check,element('span','',task.body+(task.day===null?' · inbox':'')));row.append(label);
    var actions=element('div','d-task-actions');
    var move=element('select','');move.setAttribute('aria-label','Move to: '+task.body);
    [{value:'inbox',label:'inbox'}].concat(days.map(function(day,i){return{value:String(i),label:i===todayIndex?'today':new Intl.DateTimeFormat('en-AU',{weekday:'short',day:'numeric'}).format(day)};})).forEach(function(option){var el=element('option','',option.label);el.value=option.value;move.append(el);});
    move.value=task.day===null?'inbox':String(task.day);
    move.addEventListener('change',function(){task.day=move.value==='inbox'?null:Number(move.value);renderTasks();document.getElementById('demo-task').focus({preventScroll:true});});
    actions.append(move);
    if(!inWeek){var remove=element('button','d-text-button','×');remove.type='button';remove.setAttribute('aria-label','Remove: '+task.body);remove.addEventListener('click',function(){tasks=tasks.filter(function(t){return t.id!==task.id;});renderTasks();document.getElementById('demo-task').focus({preventScroll:true});});actions.append(remove);}
    row.append(actions);return row;
  }
  function renderTasks(){
    var list=document.getElementById('demo-tasks');list.replaceChildren();
    var open=tasks.filter(function(t){return !t.done&&(t.day===null||t.day<=todayIndex);});
    open.forEach(function(task){list.append(taskRow(task,false));});
    var done=tasks.filter(function(t){return t.done;}).length;
    document.getElementById('demo-done').textContent=(!open.length&&done?'all done. go make something. ':'')+done+' done today';
    week.replaceChildren();
    days.forEach(function(day,i){
      var cell=element('li','d-day'+(i===todayIndex?' is-today':''));
      if(i===todayIndex)cell.setAttribute('aria-current','date');
      var heading=element('h4','d-day-heading');heading.append(element('span','',new Intl.DateTimeFormat('en-AU',{weekday:'short'}).format(day).toLowerCase()),element('b','',day.getDate()));
      if(i===todayIndex)heading.append(element('span','d-small','today'));
      cell.append(heading);var dayTasks=tasks.filter(function(t){return t.day===i;});
      if(dayTasks.length){var list=element('ul','d-task-list');dayTasks.forEach(function(task){list.append(taskRow(task,true));});cell.append(list);}else cell.append(element('p','d-small','nothing planned'));
      week.append(cell);
    });
  }
  renderTasks();
  function alignToday(){var cell=week.querySelector('[aria-current="date"]');week.scrollLeft=cell.offsetLeft-week.firstElementChild.offsetLeft;}
  // Tabs reveal the strip after initial render; align only its own scroll box.
  tabs[1].addEventListener('click',alignToday);
  picker.addEventListener('change',function(){if(picker.value==='1')alignToday();});
  document.querySelectorAll('[data-demo-go="1"]').forEach(function(link){link.addEventListener('click',alignToday);});
  document.getElementById('demo-task-form').addEventListener('submit',function(event){event.preventDefault();var input=document.getElementById('demo-task');var body=input.value.trim();if(!body)return;tasks.push({id:nextTask++,body:body,day:todayIndex,done:false});input.value='';renderTasks();});
  dayPanel.querySelectorAll('.d-habit input').forEach(function(check){check.addEventListener('change',function(){check.closest('label').querySelector('[data-streak]').textContent=check.checked?'2 days':'1 day';});});
  var wins=0;
  document.getElementById('demo-win-form').addEventListener('submit',function(event){
    event.preventDefault();var input=this.querySelector('input');var body=input.value.trim();if(!body)return;
    var win=element('li','d-win');win.append(element('span','',body),element('small','d-small',this.querySelector('select').value));document.getElementById('demo-wins').prepend(win);
    wins++;document.getElementById('demo-win-count').textContent=wins+' '+(wins===1?'win':'wins')+' this month';input.value='';this.closest('details').open=false;this.closest('details').querySelector('summary').focus();
  });
  var calendar=document.getElementById('demo-calendar');
  var calendarStatus=document.getElementById('demo-calendar-status');
  var calendarLink=document.getElementById('demo-calendar-link');
  var generation=0,confirmReset=false;
  function resetConfirmation(value){confirmReset=value;document.getElementById('demo-calendar-confirm').hidden=!value;calendar.querySelector('[data-calendar-cancel]').hidden=!value;}
  function exampleLink(){generation++;calendarLink.value='https://example.invalid/calendar/demo-'+generation+'.ics';calendar.querySelector('[data-calendar-copy]').textContent='copy link';}
  function calendarEnabled(enabled){document.getElementById('demo-calendar-off').hidden=enabled;document.getElementById('demo-calendar-on').hidden=!enabled;resetConfirmation(false);calendarStatus.textContent='';if(enabled)exampleLink();else calendarLink.value='';calendar.querySelector(enabled?'[data-calendar-app]':'[data-calendar-enable]').focus();}
  dayPanel.querySelector('[data-calendar-open]').addEventListener('click',function(){calendarStatus.textContent='';calendar.showModal();});
  calendar.querySelector('[data-calendar-close]').addEventListener('click',function(){calendar.close();});
  calendar.addEventListener('click',function(event){if(event.target===calendar)calendar.close();});
  calendar.addEventListener('close',function(){resetConfirmation(false);});
  calendar.querySelector('[data-calendar-enable]').addEventListener('click',function(){calendarEnabled(true);});
  calendar.querySelector('[data-calendar-disable]').addEventListener('click',function(){calendarEnabled(false);});
  calendar.querySelector('[data-calendar-reset]').addEventListener('click',function(){if(!confirmReset){resetConfirmation(true);return;}exampleLink();resetConfirmation(false);calendarStatus.textContent='example link reset.';});
  calendar.querySelector('[data-calendar-cancel]').addEventListener('click',function(){resetConfirmation(false);calendar.querySelector('[data-calendar-reset]').focus();});
  calendar.querySelectorAll('[data-calendar-app]').forEach(function(button){button.addEventListener('click',function(){calendarStatus.textContent='in the members portal, '+button.textContent+' opens so you can subscribe. this example stays here.';});});
  calendar.querySelector('[data-calendar-copy]').addEventListener('click',async function(){
    try{await navigator.clipboard.writeText(calendarLink.value);this.textContent='copied';calendarStatus.textContent='example link copied. it does not contain a calendar feed.';}
    catch(_){calendarLink.select();calendarStatus.textContent='select and copy the example link above.';}
  });
  var deadline=new Date(today);deadline.setDate(today.getDate()+3);
  document.querySelector('[data-brief-deadline]').textContent=dateFormat.format(deadline);
  document.querySelectorAll('[data-brief-calendar]').forEach(function(button){button.addEventListener('click',function(){button.closest('details').querySelector('[role="status"]').textContent='in the members portal, '+button.textContent+' opens a single deadline event. this example stays here.';});});
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
