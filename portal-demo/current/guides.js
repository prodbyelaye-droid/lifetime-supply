/* Source-derived, public sample. See SOURCE.json. No fetch, storage or account writes. */
(() => {
  const { guides, template, route } = window.GUIDE_DEMO;
  const $ = id => document.getElementById(id);
  document.documentElement.dataset.theme = new URLSearchParams(location.search).get('t') === 'dark' ? 'dark' : 'light';
  addEventListener('message', event => {
    if (event.source === parent && event.origin === location.origin && event.data?.type === 'l4-demo-theme' && ['light', 'dark'].includes(event.data.theme)) document.documentElement.dataset.theme = event.data.theme;
  });
  const el = (tag, text, cls) => { const n = document.createElement(tag); if (text != null) n.textContent = text; if (cls) n.className = cls; return n; };
  function library() {
    const language = $('language-form').elements.lang.value;
    $('guide-list').replaceChildren(); $('reading-note').textContent = '';
    $('guide-count').textContent = `${guides.length} guides`;
    guides.forEach(guide => {
      const li = el('li'); li.append(el('h2', guide[language === 'de' ? 'de' : 'en']));
      const nav = el('nav'); nav.setAttribute('aria-label', `${guide.en} languages`);
      (language === 'all' ? ['en', 'de'] : [language]).forEach(lang => {
        const button = el('button', lang === 'de' ? 'Deutsch' : 'English', 'gr-bar-btn'); button.type = 'button'; button.lang = lang;
        button.addEventListener('click', () => { $('reading-note').textContent = `${guide[lang]} · ${guide.pages[lang]} pages. ${lang === 'de' ? 'Read this guide and download its German PDF in the member portal.' : 'Read this guide in the member portal.'}`; }); nav.append(button);
      }); li.append(nav); $('guide-list').append(li);
    });
  }
  $('language-form').addEventListener('submit', event => { event.preventDefault(); library(); }); library();
  function page() { const session = location.hash === '#session'; $('library').hidden = session; $('session').hidden = !session; }
  addEventListener('hashchange', page); page();
  $('goal').addEventListener('change', () => { $('goal-help').textContent = $('goal').value ? `${template.chooseWhen} ${route.help}` : ''; });
  let current = null, pending = null;
  function chooseSession(goal, minutes, preference) {
    if (!/^[0-9]{1,4}$/.test(minutes) || !['small', 'deeper'].includes(preference)) return null;
    const available = Number(minutes);
    if (goal !== template.id || available < 1 || available > 1440 || !template.variants.length) return null;
    const ordered = [...template.variants].sort((a, b) => a.suggestedElapsedMin - b.suggestedElapsedMin);
    const fitting = ordered.filter(item => item.suggestedElapsedMin <= available);
    return { variant: (preference === 'deeper' ? fitting.at(-1) : fitting[0]) ?? null, available, smallest: ordered[0].suggestedElapsedMin, preference };
  }
  function sheet(variant, available) {
    return [`My available window: ${available} minutes`, 'My start time:', 'My stop time:', '', `${template.name}: ${variant.size}: ${variant.label}`, '', 'Date / time zone:', 'Wake time / current time / earliest start:', 'Ready to work:', 'Finish / wind-down:', 'Fixed commitments:', 'Actually free windows:', 'Energy / focus / listening capacity:', 'Project / version:', 'Actual deadline + source + time zone:', 'Dependencies / missing information:', '', ...template.memberInputs.map(input => `${input}:`), '', `Choose this when: ${template.chooseWhen}`, `Outcome: ${variant.done}`, `Scope: ${variant.scope}`, `Why this option: ${variant.choiceRationale}`, `Example total: ${variant.suggestedElapsedMin} minutes. Edit all durations; choose a smaller outcome if it does not fit.`, 'Place commitments, breaks, meals and buffer first. No times are booked automatically.', '', ...variant.blocks.flatMap((block, i) => [`${i + 1}. ${block.name}: ${block.kind}; ${block.requirement}`, `Chosen start/end:                 Example duration: ${block.durationMin} min`, block.instruction, `Done: ${block.done}`, block.durationGuidance, 'Actual result / blocker:', '']), `Protect the work: ${template.blockProtection}`, `If the day changes: ${template.disruptedDay}`, `Change workflow when: ${template.changeWhen}`, '', 'Output location / accurate state:', 'Optional work dropped or moved:', `Next action: ${variant.nextAction}`, 'My next action + realistic window:', 'When [cue] happens, I will open [file/project] and [first action].'].join('\n');
  }
  function install(choice) {
    current = choice; pending = null; $('replace').hidden = true;
    const result = $('result'), v = choice.variant; result.replaceChildren(); result.hidden = false;
    result.append(el('h2', v ? v.label : 'this window is smaller than the complete session'), el('p', `${template.name} · ${choice.available} minutes available · ${choice.preference === 'small' ? 'keep it small' : 'go deeper'}`));
    if (!v) { result.append(el('p', `the smallest complete ${template.name.toLowerCase()} session has ${choice.smallest} minutes of example blocks. we have not shortened its checks or removed its breaks to make it fit.`), el('h3', 'preparation only'), el('p', route.preparation), el('p', 'preparing a project or note does not complete the full session. return with a longer window. the full member portal has other outcomes to choose from.')); result.focus(); return; }
    result.append(el('p', `${v.suggestedElapsedMin} minutes of example blocks. ${choice.available > v.suggestedElapsedMin ? `${choice.available - v.suggestedElapsedMin} minutes remain unassigned. keep that room for your own commitments or recovery.` : 'this uses the full window. choose a smaller outcome or a later window if you need more room.'}`), el('p', v.scope), el('h3', 'why this session'), el('p', `${choice.preference === 'small' ? 'this is the smallest complete version for your outcome.' : 'this is the fullest complete version within your available minutes.'} ${v.choiceRationale}`), el('p', 'durations are examples, not a guarantee. all required checks and recovery blocks are retained. adapt the scope if the work takes longer.'), el('h3', 'bring these first'));
    const inputs = el('ul'); template.memberInputs.forEach(input => inputs.append(el('li', input))); result.append(inputs, el('h3', 'your next actions, in order'));
    const blocks = el('ol'); v.blocks.forEach(block => { const li = el('li'); li.append(el('h4', `${block.name} · ${block.durationMin} min`), el('p', `${block.kind} · ${block.requirement}`), el('p', block.instruction), el('p', `done: ${block.done}`)); blocks.append(li); }); result.append(blocks, el('h3', 'what you will leave with'), el('p', v.done), el('p', `after this: ${v.nextAction}`));
    const details = el('details', null, 'mp-card'); details.open = true; details.append(el('summary', 'edit your working sheet'));
    const help = el('p', 'this draft stays in this tab only. copy it before leaving or reloading. it does not save to your account, send messages or book calendar time.', 'mp-meta'); help.id = 'worksheet-help';
    const label = el('label', `working sheet: ${v.label}`, 'mp-label'); label.htmlFor = 'worksheet'; const field = el('textarea', null, 'field'); field.id = 'worksheet'; field.rows = 20; field.value = sheet(v, choice.available); field.setAttribute('aria-describedby', help.id);
    const button = el('button', 'copy worksheet', 'btn btn-secondary'); button.type = 'button'; const notice = el('p', '', 'mp-meta'); notice.setAttribute('role', 'status');
    field.addEventListener('input', () => { button.disabled = !field.value.trim(); notice.textContent = ''; });
    button.addEventListener('click', async () => { const snapshot = field.value; button.disabled = true; try { await navigator.clipboard.writeText(snapshot); notice.textContent = field.value === snapshot ? 'copied. paste it into your own notes or calendar to keep it.' : 'copied the earlier version. you edited the sheet while copying; copy again to keep your latest edits.'; } catch { field.focus(); field.select(); notice.textContent = 'automatic copy was unavailable. the worksheet is selected; use your usual copy command.'; } finally { button.disabled = !field.value.trim(); } });
    const actions = el('div', null, 'mp-actions'); actions.append(button); details.append(help, label, field, actions, notice); result.append(details); result.focus();
  }
  $('session-form').addEventListener('submit', event => {
    event.preventDefault(); const next = chooseSession($('goal').value, $('minutes').value, $('scope').value);
    if (!next) { $('session-error').textContent = 'choose an outcome and enter a whole number of minutes from 1 to 1440.'; return; }
    $('session-error').textContent = ''; if (current?.variant) { pending = next; $('replace').hidden = false; } else install(next);
  });
  ['goal','minutes','scope'].forEach(id => $(id).addEventListener('change', () => { pending = null; $('replace').hidden = true; $('session-error').textContent = ''; }));
  $('replace-yes').addEventListener('click', () => { if (pending) install(pending); });
  $('replace-no').addEventListener('click', () => { pending = null; $('replace').hidden = true; });
})();
