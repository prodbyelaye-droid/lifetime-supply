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
  // Disposable example data only: no account, storage, feed or submission calls.
  var clockZone=Intl.DateTimeFormat().resolvedOptions().timeZone||'UTC';
  var calendarZone=clockZone;
  function dayIn(iso,zone){var parts=new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(iso));function part(type){return parts.find(function(p){return p.type===type;}).value;}return part('year')+'-'+part('month')+'-'+part('day');}
  function timeIn(iso){return new Intl.DateTimeFormat('en-GB',{timeZone:calendarZone,hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(iso));}
  function shiftDay(day,n){var date=new Date(day+'T12:00:00Z');date.setUTCDate(date.getUTCDate()+n);return date.toISOString().slice(0,10);}
  function weekDays(day){var offset=(new Date(day+'T12:00:00Z').getUTCDay()+6)%7;return Array.from({length:7},function(_,i){return shiftDay(day,i-offset);});}
  function instantFor(day,time){
    if(!/^\d{4}-\d{2}-\d{2}$/.test(day)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(time))return null;
    var wall=Date.parse(day+'T'+time+':00Z');
    var format=new Intl.DateTimeFormat('en-CA',{timeZone:calendarZone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
    function localEpoch(ms){var parts=format.formatToParts(new Date(ms));function n(type){return Number(parts.find(function(p){return p.type===type;}).value);}return Date.UTC(n('year'),n('month')-1,n('day'),n('hour'),n('minute'),n('second'));}
    var offsets=new Set();for(var h=-24;h<=24;h+=6){var probe=wall+h*3600000;offsets.add(localEpoch(probe)-probe);}
    var matches=Array.from(offsets).map(function(offset){return wall-offset;}).filter(function(instant){return localEpoch(instant)===wall;});
    return matches.length===1?new Date(matches[0]).toISOString():null;
  }
  var today=dayIn(new Date().toISOString(),clockZone),anchor=today,days=weekDays(today);
  var dateFormat=new Intl.DateTimeFormat('en-AU',{weekday:'long',day:'numeric',month:'long',timeZone:'UTC'});
  var shortFormat=new Intl.DateTimeFormat('en-AU',{weekday:'short',day:'numeric',timeZone:'UTC'});
  var rangeFormat=new Intl.DateTimeFormat('en-AU',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});
  function namedDay(day,format){return format.format(new Date(day+'T12:00:00Z'));}
  document.querySelectorAll('[data-today]').forEach(function(el){el.textContent=namedDay(today,dateFormat);});
  var tasks=[{id:1,body:'finish a beat',day:today,done:false,startAt:null,minutes:null},{id:2,body:'pick sounds for a pack',day:null,done:false,startAt:null,minutes:null}];
  var nextTask=3,lastCompleted=null;
  var exampleBrief={title:'example artist',day:shiftDay(today,3)};
  var dayPanel=document.getElementById('dp-1'),week=document.getElementById('demo-week'),weekDate=document.getElementById('demo-week-date');
  var plan=document.getElementById('demo-task-plan'),planId=null,planBody=document.getElementById('demo-plan-body'),planDay=document.getElementById('demo-plan-day'),planTime=document.getElementById('demo-plan-time'),planLength=document.getElementById('demo-plan-length');
  function element(tag,className,text){var el=document.createElement(tag);el.className=className;if(text!==undefined)el.textContent=text;return el;}
  function taskDay(task){return task.startAt?dayIn(task.startAt,calendarZone):task.day;}
  function planFields(){planTime.disabled=!planDay.value;planLength.disabled=!planDay.value||!planTime.value;document.getElementById('demo-plan-choose-day').hidden=!!planDay.value;plan.querySelector('[data-plan-clear]').hidden=!planTime.value;}
  function openPlan(task){planId=task.id;planBody.value=task.body;planDay.value=taskDay(task)||'';planTime.value=task.startAt?timeIn(task.startAt):'';planLength.value=String(task.minutes||30);plan.querySelector('[data-plan-zone]').textContent='times are in '+calendarZone;document.getElementById('demo-plan-error').textContent='';planFields();plan.showModal();}
  function taskRow(task,inWeek){
    var row=element('li','d-task'+(task.done?' is-done':''));row.dataset.task=task.id;
    var label=element('label','d-task-label');
    var check=element('input','');check.type='checkbox';check.checked=task.done;
    check.addEventListener('change',function(){task.done=check.checked;lastCompleted=task.done?task.id:null;renderTasks();document.getElementById('demo-task').focus({preventScroll:true});});
    var words=element('span','');if(task.startAt)words.append(element('span','d-task-time',timeIn(task.startAt)+' '));words.append(document.createTextNode(task.body+(task.minutes?' · '+task.minutes+' min':'')+(task.day===null?' · inbox':'')));label.append(check,words);row.append(label);
    var actions=element('div','d-task-actions');
    var move=element('select','');move.setAttribute('aria-label','Move to: '+task.body);
    var options=[{value:'inbox',label:'inbox'}].concat(days.map(function(day){return{value:day,label:day===today?'today':namedDay(day,shortFormat)};}));
    var current=taskDay(task);if(current&&days.indexOf(current)===-1)options.push({value:current,label:namedDay(current,rangeFormat)});
    options.push({value:'choose',label:'choose another day'});
    options.forEach(function(option){var el=element('option','',option.label);el.value=option.value;move.append(el);});move.value=current||'inbox';
    move.addEventListener('change',function(){if(move.value==='choose'){move.value=current||'inbox';openPlan(task);return;}var target=move.value==='inbox'?null:move.value;if(task.startAt&&target){var instant=instantFor(target,timeIn(task.startAt));if(!instant){openPlan(task);document.getElementById('demo-plan-error').textContent='Didn’t save. If the clocks change on this day, choose another time.';return;}task.startAt=instant;}if(!target){task.startAt=null;task.minutes=null;}task.day=target;renderTasks();document.getElementById('demo-task').focus({preventScroll:true});});
    actions.append(move);
    var edit=element('button','d-text-button','plan');edit.type='button';edit.setAttribute('aria-label','plan task: '+task.body);edit.addEventListener('click',function(){openPlan(task);});actions.append(edit);
    if(!inWeek){var remove=element('button','d-text-button','×');remove.type='button';remove.setAttribute('aria-label','Remove: '+task.body);remove.addEventListener('click',function(){tasks=tasks.filter(function(t){return t.id!==task.id;});renderTasks();document.getElementById('demo-task').focus({preventScroll:true});});actions.append(remove);}
    row.append(actions);return row;
  }
  function renderTasks(){
    days=weekDays(anchor);weekDate.value=anchor;
    document.getElementById('demo-week-range').textContent=namedDay(days[0],rangeFormat)+' to '+namedDay(days[6],rangeFormat);
    var list=document.getElementById('demo-tasks');list.replaceChildren();
    var open=tasks.filter(function(t){return !t.done&&(taskDay(t)===null||taskDay(t)<=today);}).sort(function(a,b){return(a.startAt||'9999').localeCompare(b.startAt||'9999');});
    open.forEach(function(task){list.append(taskRow(task,false));});
    var done=tasks.filter(function(t){return t.done;});
    document.getElementById('demo-done').textContent=(!open.length&&done.length?'all done. go make something. ':'')+done.length+' done today';
    var completed=document.getElementById('demo-completed');completed.hidden=!done.length;completed.querySelector('summary').textContent='completed ('+done.length+') · last 90 days';var doneList=document.getElementById('demo-completed-tasks');doneList.replaceChildren();done.forEach(function(task){doneList.append(taskRow(task,false));});
    var undo=document.getElementById('demo-task-undo'),finished=tasks.find(function(task){return task.id===lastCompleted&&task.done;});undo.hidden=!finished;if(finished)undo.querySelector('span').textContent='completed: '+finished.body;
    week.replaceChildren();
    days.forEach(function(day){
      var cell=element('li','d-day'+(day===today?' is-today':''));cell.dataset.day=day;
      if(day===today)cell.setAttribute('aria-current','date');
      var heading=element('h4','d-day-heading');heading.append(element('span','',new Intl.DateTimeFormat('en-AU',{weekday:'short',timeZone:'UTC'}).format(new Date(day+'T12:00:00Z')).toLowerCase()),element('b','',Number(day.slice(8))));
      if(day===today)heading.append(element('span','d-small','today'));
      cell.append(heading);var dayTasks=tasks.filter(function(t){return taskDay(t)===day;}).sort(function(a,b){return(a.startAt||'9999').localeCompare(b.startAt||'9999');});
      if(dayTasks.length){var taskList=element('ul','d-task-list');dayTasks.forEach(function(task){taskList.append(taskRow(task,true));});cell.append(taskList);}
      if(exampleBrief.day===day){var deadline=element('a','d-week-deadline');deadline.href='https://example.invalid/briefs/demo';deadline.append(element('span','',exampleBrief.title),element('small','d-small','brief deadline'));deadline.addEventListener('click',function(event){event.preventDefault();select(2);var detail=document.querySelector('.d-brief-calendar details');detail.open=true;detail.querySelector('summary').focus();});cell.append(deadline);}
      if(!dayTasks.length&&exampleBrief.day!==day)cell.append(element('p','d-small','nothing planned'));
      week.append(cell);
    });
  }
  function alignToday(){var cell=week.querySelector('[aria-current="date"]')||week.firstElementChild;if(cell)week.scrollLeft=cell.offsetLeft-week.firstElementChild.offsetLeft;}
  renderTasks();
  tabs[1].addEventListener('click',alignToday);picker.addEventListener('change',function(){if(picker.value==='1')alignToday();});
  document.querySelectorAll('[data-demo-go="1"]').forEach(function(link){link.addEventListener('click',alignToday);});
  weekDate.addEventListener('change',function(){if(weekDate.value){anchor=weekDate.value;renderTasks();alignToday();}});
  dayPanel.querySelectorAll('[data-week-go]').forEach(function(button){button.addEventListener('click',function(){anchor=shiftDay(anchor,Number(button.dataset.weekGo));renderTasks();alignToday();});});
  dayPanel.querySelector('[data-week-today]').addEventListener('click',function(){anchor=today;renderTasks();alignToday();});
  document.getElementById('demo-task-undo').querySelector('button').addEventListener('click',function(){var task=tasks.find(function(t){return t.id===lastCompleted;});if(task)task.done=false;lastCompleted=null;renderTasks();document.getElementById('demo-task').focus({preventScroll:true});});
  planDay.addEventListener('change',function(){if(!planDay.value)planTime.value='';planFields();});planTime.addEventListener('input',planFields);
  plan.querySelector('[data-plan-clear]').addEventListener('click',function(){planTime.value='';planFields();});
  plan.querySelector('[data-plan-close]').addEventListener('click',function(){plan.close();});plan.addEventListener('click',function(event){if(event.target===plan)plan.close();});
  document.getElementById('demo-task-plan-form').addEventListener('submit',function(event){event.preventDefault();var task=tasks.find(function(t){return t.id===planId;});if(!task)return;var body=planBody.value.trim();if(!body)return;var instant=planDay.value&&planTime.value?instantFor(planDay.value,planTime.value):null;if(planTime.value&&!instant){document.getElementById('demo-plan-error').textContent='Didn’t save. If the clocks change on this day, choose another time.';return;}task.body=body;task.day=planDay.value||null;task.startAt=instant;task.minutes=instant?Number(planLength.value):null;if(task.day)anchor=task.day;plan.close();renderTasks();alignToday();document.getElementById('demo-task').focus({preventScroll:true});});
  document.getElementById('demo-task-form').addEventListener('submit',function(event){event.preventDefault();var input=document.getElementById('demo-task'),body=input.value.trim();if(!body)return;tasks.push({id:nextTask++,body:body,day:today,done:false,startAt:null,minutes:null});input.value='';renderTasks();});
  dayPanel.querySelectorAll('.d-habit input').forEach(function(check){check.addEventListener('change',function(){check.closest('label').querySelector('[data-streak]').textContent=check.checked?'2 days':'1 day';});});
  var wins=0;
  document.getElementById('demo-win-form').addEventListener('submit',function(event){event.preventDefault();var input=this.querySelector('input'),body=input.value.trim();if(!body)return;var win=element('li','d-win');win.append(element('span','',body),element('small','d-small',this.querySelector('select').value));document.getElementById('demo-wins').prepend(win);wins++;document.getElementById('demo-win-count').textContent=wins+' '+(wins===1?'win':'wins')+' this month';input.value='';this.closest('details').open=false;this.closest('details').querySelector('summary').focus();});
  var calendar=document.getElementById('demo-calendar'),calendarStatus=document.getElementById('demo-calendar-status'),calendarLink=document.getElementById('demo-calendar-link'),feedChoice=document.getElementById('demo-calendar-feed');
  var generation=0,confirmReset=false;
  var includes={all:'your plan and the board, with the choices below.',plan:'your dated tasks and time blocks. inbox tasks, habits and wins stay in the portal.',deadlines:'current board briefs with a real deadline. briefs without a deadline are left out.'};
  function resetConfirmation(value){confirmReset=value;document.getElementById('demo-calendar-confirm').hidden=!value;calendar.querySelector('[data-calendar-cancel]').hidden=!value;}
  function exampleLink(){calendarLink.value='https://example.invalid/calendar/demo-'+generation+'/'+feedChoice.value+'.ics';calendar.querySelector('[data-calendar-copy]').textContent='copy link';document.getElementById('demo-calendar-includes').textContent=includes[feedChoice.value];document.getElementById('demo-calendar-options').hidden=feedChoice.value!=='all';}
  function calendarEnabled(enabled){document.getElementById('demo-calendar-off').hidden=enabled;document.getElementById('demo-calendar-on').hidden=!enabled;resetConfirmation(false);calendarStatus.textContent='';if(enabled){generation++;exampleLink();}else calendarLink.value='';calendar.querySelector(enabled?'#demo-calendar-feed':'[data-calendar-enable]').focus();}
  dayPanel.querySelector('[data-calendar-open]').addEventListener('click',function(){calendarStatus.textContent='';calendar.showModal();});
  calendar.querySelector('[data-calendar-close]').addEventListener('click',function(){calendar.close();});calendar.addEventListener('click',function(event){if(event.target===calendar)calendar.close();});calendar.addEventListener('close',function(){resetConfirmation(false);editZone(false);});
  calendar.querySelector('[data-calendar-enable]').addEventListener('click',function(){calendarEnabled(true);});calendar.querySelector('[data-calendar-disable]').addEventListener('click',function(){calendarEnabled(false);});
  feedChoice.addEventListener('change',function(){exampleLink();calendarStatus.textContent='';});
  calendar.querySelectorAll('[data-feed-plan],[data-feed-deadlines]').forEach(function(check){check.addEventListener('change',function(){calendarStatus.textContent='example feed options updated. your private link stays the same.';});});
  calendar.querySelector('[data-calendar-reset]').addEventListener('click',function(){if(!confirmReset){resetConfirmation(true);return;}generation++;exampleLink();resetConfirmation(false);calendarStatus.textContent='example link reset.';});
  calendar.querySelector('[data-calendar-cancel]').addEventListener('click',function(){resetConfirmation(false);calendar.querySelector('[data-calendar-reset]').focus();});
  calendar.querySelectorAll('[data-calendar-app]').forEach(function(button){button.addEventListener('click',function(){calendarStatus.textContent='in the members portal, '+button.textContent+' opens so you can subscribe. this example stays here.';if(button.textContent==='outlook')calendar.querySelector('.d-calendar-instructions').open=true;});});
  calendar.querySelector('[data-calendar-copy]').addEventListener('click',async function(){try{await navigator.clipboard.writeText(calendarLink.value);this.textContent='copied';calendarStatus.textContent='example link copied. it does not contain a calendar feed.';}catch(_){calendarLink.select();calendarStatus.textContent='select and copy the example link above.';}});
  var timezonePicker=document.getElementById('demo-calendar-timezone');
  Array.from(new Set([calendarZone,'UTC'].concat(typeof Intl.supportedValuesOf==='function'?Intl.supportedValuesOf('timeZone'):['Australia/Sydney','America/New_York','Europe/London']))).sort().forEach(function(zone){var option=element('option','',zone);option.value=zone;timezonePicker.append(option);});timezonePicker.value=calendarZone;
  function editZone(edit){calendar.querySelector('[data-calendar-zone-form]').hidden=!edit;calendar.querySelector('[data-calendar-zone-change]').hidden=edit;timezonePicker.value=calendarZone;}
  function showZone(){calendar.querySelector('[data-calendar-zone]').textContent='times are in '+calendarZone;var clock=calendar.querySelector('[data-calendar-clock-zone]');clock.hidden=calendarZone===clockZone;clock.textContent='your clock says '+clockZone+'. use it ›';}
  function saveZone(zone){calendarZone=zone;showZone();editZone(false);renderTasks();calendarStatus.textContent='example timezone updated. time blocks keep the same instant.';}
  showZone();calendar.querySelector('[data-calendar-zone-change]').addEventListener('click',function(){editZone(true);timezonePicker.focus();});calendar.querySelector('[data-calendar-zone-save]').addEventListener('click',function(){saveZone(timezonePicker.value);});calendar.querySelector('[data-calendar-clock-zone]').addEventListener('click',function(){saveZone(clockZone);});
  document.querySelector('[data-brief-deadline]').textContent=namedDay(exampleBrief.day,dateFormat);
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
