/* l4-live-2211.js · the interactive portal window on the sales page, rebuilt 22 Nov 2026.
   Live HTML, not screenshots. Opens on home (no sign-in frame), dates are worked out from today,
   the vault rows play the public kit previews already embedded on this page (SoundCloud),
   and a brief can be sent end to end without anything leaving the page.
   Every public word is in WORDS below so he can change any of them in one place. */
(function () {
  'use strict';
  var mount = document.querySelector('[data-ltw]');
  if (!mount) return;

  /* ---------- words (his to change; see WORDS-PROPOSED.md for which are new) ---------- */
  var W = {
    app: 'lifetime supply',
    menuApp: 'Lifetime Supply',
    tryDark: 'try dark mode.',
    search: 'search',
    help: 'help',
    helpTitle: 'this is a demo of the portal.',
    helpBody: 'in the real one, help sends me a message and i answer it myself.',
    groups: { board: 'the board', library: 'your library', membership: 'your membership' },
    nav: { home: 'home', day: 'your day', briefs: 'briefs', subs: 'submissions', vault: 'vault', kits: 'kits', mentor: 'mentorship', guides: 'guides', room: 'the room', business: 'business' },
    soon: 'in the new update',
    welcome: 'welcome back',
    welcomeSub: 'your workspace is ready. my whole workflow. yours forever.',
    statNew: 'new this week', statReview: 'in review', statKit: 'newest kit', statModule: 'next module',
    newestKit: 'members only kit, vol. 1', nextModule: 'build your network',
    dayCardSub: 'your day, planned around the briefs. today, habits, wins and the week.',
    today: 'today', theWeek: 'the week', everyDay: 'every day', toDo: 'to do', tasks: 'tasks', habits: 'habits',
    subsCardSub: 'every status moved by hand, and my feedback on each one.',
    stNew: 'new', stReview: 'in review', stSent: 'sent to artist', stPlaced: 'placed', stPassed: 'passed',
    briefsCardSub: "the briefs i'm working on with artists.",
    vaultTitle: 'the vault', vaultCardSub: 'samples with stems.', searchVault: 'search the vault',
    roomCardSub: 'my private members discord. feedback, flips, wins and drops. the team, pushing together.',
    kitsCardSub: 'members-only kits, as i make them. they never go public.',
    mentorCardSub: 'every module is written out.',
    blueprint: 'the producer blueprint', psychology: 'the psychology of the close', modules: 'modules',
    dayTitle: 'your day', toDoToday: 'to do today', habitsLeft: 'habits left', addTask: 'add task', planDay: 'plan this day',
    newTaskPh: 'what are you doing today?',
    allDone: 'all done. go make something.',
    workingOn: 'working on', closes: 'closes', daysLeft: 'days left', dayLeft: 'day left', noTime: 'no time planned',
    readBrief: 'read brief and submit', manage: 'manage', doneToday: 'done today',
    tasksDemo: ['pull three loops for the r&b brief', 'finish the hook and bounce it', 'send it before it closes'],
    habitsDemo: ['make one idea', 'listen back to yesterday'],
    planTitle: 'plan this day',
    planBlocks: [['10:00', '12:00', 'make it'], ['13:00', '14:00', 'mix it'], ['16:00', '16:30', 'send it']],
    planSaved: 'saved to your day.',
    daySub: ['today', 'the week', 'every day', 'wins', 'your plan', 'working on', 'find something useful', 'your week', 'overview'],
    getHelp: 'get help from ELAYE', addCal: 'add to your calendar',
    boardTitle: 'the board.', boardSub: 'new artist briefs, straight from my pipeline.',
    liveBriefs: 'live briefs', examples: 'example briefs. artist names hidden.',
    lanes: ['urgent', 'hot', 'warm', 'cold'], allLanes: 'all lanes',
    posted: 'posted', hrsAgo: 'hrs ago', hrAgo: 'hr ago',
    tagDirect: 'direct', tagPlaced: 'placement confirmed', tagSound: 'your sound',
    allBriefs: 'all briefs', after: "what they're after", refs: 'references', nameHidden: 'artist name hidden',
    sendTitle: 'send your beat', drop: 'drop a file here, or click to choose one', dropKinds: 'wav, mp3 or zip, up to 10 files.', more: 'more',
    orLink: 'or paste a link', linkPh: 'https://', note: 'a note for me (optional)', submit: 'submit',
    demoNote: "it's a demo, nothing is sent.",
    sending: 'sending', queued: "it's in the queue.", heard: 'every send, heard.',
    seeSubs: 'see it in my submissions', sendAnother: 'back to the board',
    subsTitle: 'my submissions.', subsSub: 'every status moved by hand, and my feedback on each one. this page updates on its own.',
    yourSubs: 'your submissions', overWeeks: 'over the last 13 weeks', submission: 'submission', submissions: 'submissions',
    less: 'less', more: 'more', submitted: 'submitted', listened: 'listened', justNow: 'just now',
    passedSee: 'passed, see my feedback', myNoteBelow: 'my note is below, under “passed”.', myNote: 'my note',
    demoNoteText: 'the bounce is clean and the melody sits right. the drums fight the vocal in the hook. pull them back and send me the next one.',
    yourSendNote: "you'll see when i've listened, and my note lands here.",
    playerTitle: 'the player.', playerSub: 'one place to find any sound in the vault, hear it, and pull it.',
    kinds: ['all', 'loops', 'midi'], bpm: 'bpm', mood: 'mood', sortBy: 'sort by', newest: 'newest',
    yourTempo: 'your tempo', crate: 'crate', inCrate: 'in crate', newTag: 'new',
    play: 'play', pause: 'pause', loading: 'loading', noAudio: "this preview didn't load. try the next one.",
    pullMembers: 'pulling the file is for members.',
    previewsFrom: 'previews from the kits on this page.',
    kitsTitle: 'kits', kitPreviews: 'hear its previews', membersFirst: 'members first',
    roomTitle: 'the room', roomDiscord: 'members-only discord', roomChannels: ['feedback on your beats', 'flips and collabs', 'your wins', 'loop briefs and drops'],
    mentorTitle: 'mentorship', guidesTitle: 'guides', businessTitle: 'business',
    guidesHeld: 'every guide is in the new update.',
    businessHeld: 'invoices, quotes and your rate card are in the new update.',
    nothingFound: 'nothing matches that.',
    pages: 'pages', briefsLabel: 'briefs', soundsLabel: 'sounds', modulesLabel: 'modules'
  };

  /* ---------- dates, always from today ---------- */
  var DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  var MONS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
  function day(n) { var d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + n); return d; }
  function longDate(d) { return DAYS[d.getDay()] + ' ' + d.getDate() + ' ' + MONS[d.getMonth()]; }
  function shortDate(d) { return DAYS[d.getDay()].slice(0, 3) + ' ' + d.getDate() + ' ' + MONS[d.getMonth()].slice(0, 3); }
  function closesLine(n) { return W.closes + ' ' + shortDate(day(n)) + ' · ' + n + ' ' + (n === 1 ? W.dayLeft : W.daysLeft); }
  function clock() {
    var d = new Date(), h = d.getHours(), m = d.getMinutes();
    var hh = ((h + 11) % 12) + 1;
    return DAYS[d.getDay()].slice(0, 3).replace(/^./, function (c) { return c.toUpperCase(); }) + ' ' + d.getDate() + ' ' +
      MONS[d.getMonth()].slice(0, 3).replace(/^./, function (c) { return c.toUpperCase(); }) + '  ' + hh + ':' + (m < 10 ? '0' : '') + m + (h < 12 ? ' am' : ' pm');
  }

  /* ---------- demo data ---------- */
  var BRIEFS = [
    { id: 'b1', lane: 'urgent', genre: 'r&b', bpm: '90–100 bpm', ago: 1, close: 2, tags: ['tagSound'], blur: [64, 38] },
    { id: 'b4', lane: 'urgent', genre: 'afro', bpm: '100–108 bpm', ago: 2, close: 1, tags: [], blur: [48, 50] },
    { id: 'b9', lane: 'urgent', genre: 'pop', bpm: '118–124 bpm', ago: 4, close: 2, tags: ['tagDirect'], blur: [57, 42] },
    { id: 'b2', lane: 'hot', genre: 'pop', bpm: '120–128 bpm', ago: 3, close: 3, tags: ['tagDirect'], blur: [52, 44] },
    { id: 'b3', lane: 'hot', genre: 'hip-hop', bpm: '140–150 bpm', ago: 5, close: 4, tags: ['tagPlaced'], blur: [70, 30] },
    { id: 'b10', lane: 'hot', genre: 'r&b', bpm: '85–95 bpm', ago: 7, close: 5, tags: ['tagSound'], blur: [46, 36] },
    { id: 'b5', lane: 'warm', genre: 'r&b', bpm: '80–90 bpm', ago: 9, close: 6, tags: ['tagSound'], blur: [58, 34] },
    { id: 'b6', lane: 'warm', genre: 'pop', bpm: '100–110 bpm', ago: 12, close: 8, tags: [], blur: [66, 40] },
    { id: 'b11', lane: 'warm', genre: 'afro', bpm: '105–112 bpm', ago: 15, close: 9, tags: [], blur: [50, 46] },
    { id: 'b7', lane: 'cold', genre: 'drill', bpm: '140–145 bpm', ago: 20, close: 11, tags: [], blur: [44, 52] },
    { id: 'b8', lane: 'cold', genre: 'hip-hop', bpm: '85–95 bpm', ago: 26, close: 13, tags: [], blur: [60, 36] },
    { id: 'b12', lane: 'cold', genre: 'pop', bpm: '96–104 bpm', ago: 31, close: 14, tags: [], blur: [54, 40] }
  ];
  var AFTER = { b1: 'melodic loops and drums. warm keys, room for a vocal.', b2: 'full beats. bright, big hook energy.', b3: 'loops and full beats. dark, bouncy.', b4: 'drums and percussion loops. dry, no reverb.', b5: 'loops. guitar or keys, slow and open.', b6: 'full beats. clean, radio-ready.', b7: 'drums and 808s. sliding, hard.', b8: 'loops. dusty samples, soul chops.', b9: 'full beats. bright synths, a big drop into the hook.', b10: 'loops. slow keys, space for a vocal.', b11: 'drums and percussion loops. bouncy, light.', b12: 'loops and full beats. clean, minimal.' };
  /* public kit previews already on this page (the "hear the kits" SoundCloud playlists) */
  var SOUNDS = [
    { id: 's1', title: 'garden', bpm: 85, kind: 'loops', kit: 'part two', pl: '2265357845', track: 2356146917, fresh: true },
    { id: 's2', title: 'bliss', bpm: 93, kind: 'loops', kit: 'analog alchemy', pl: '2265337055', track: 2356125536, fresh: true },
    { id: 's3', title: 'retry', bpm: 95, kind: 'loops', kit: 'part two', pl: '2265357845', track: 2356146908 },
    { id: 's4', title: 'nightsto', bpm: 82, kind: 'loops', kit: 'analog alchemy', pl: '2265337055', track: 2356125512 },
    { id: 's5', title: '2night', bpm: 80, kind: 'loops', kit: 'analog alchemy', pl: '2265337055', track: 2356125509 }
  ];
  var KITS = [
    { name: 'members only kit, vol. 1', meta: W.newTag, cover: 'assets/r2-1112/L4/cover-members-only-v1-sky.jpg' },
    { name: 'octaves creator suite', meta: '', cover: 'assets/r2-1112/L4/cover-octaves.jpg', pl: '2265272528' },
    { name: 'octaves creator suite: part two', meta: W.membersFirst, cover: 'assets/r2-1112/L4/cover-octaves-two.jpg', pl: '2265357845' },
    { name: 'analog alchemy', meta: 'one-shots', cover: 'assets/r2-1112/L4/cover-analog.jpg', pl: '2265337055' }
  ];

  /* ---------- state ---------- */
  var S = {
    page: 'home', brief: null, hist: ['home'], hi: 0, theme: 'light',
    tasks: W.tasksDemo.map(function (t, i) { return { t: t, done: i === 0 }; }),
    habits: W.habitsDemo.map(function (t) { return { t: t, done: false }; }),
    sent: [], send: { file: '', link: '', stage: 'idle' }, planSaved: false,
    lane: 'all', kind: 'all', q: '', tempo: '', crate: {}, playing: null, state: 'idle', pos: 0, dur: 0,
    drawer: false, tip: true
  };
  var briefCount = '160+';

  /* ---------- tiny helpers ---------- */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function ic(name) { return '<svg class="ltw-ic" viewBox="0 0 16 16" aria-hidden="true">' + (ICONS[name] || '') + '</svg>'; }
  var ICONS = {
    home: '<path d="M2.5 7.2 8 2.8l5.5 4.4V13a.5.5 0 0 1-.5.5H9.6V9.8H6.4v3.7H3a.5.5 0 0 1-.5-.5Z"/>',
    day: '<circle cx="8" cy="8" r="5.6"/><path d="M8 4.8V8l2.2 1.4"/>',
    briefs: '<rect x="3.2" y="2.2" width="9.6" height="11.6" rx="1.2"/><path d="M5.6 5.4h4.8M5.6 8h4.8M5.6 10.6h3"/>',
    subs: '<path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10"/>',
    vault: '<rect x="2.5" y="2.5" width="11" height="11" rx="1.2"/><path d="M2.5 6h11M6 6v7.5"/>',
    kits: '<rect x="3" y="4.6" width="10" height="8.4" rx="1.2"/><path d="M5.6 4.6V3.4h4.8v1.2"/>',
    mentor: '<path d="M8 2.4 13 5.2v5.6L8 13.6 3 10.8V5.2Z"/><path d="M8 5.6 10.4 7v2.6L8 11 5.6 9.6V7Z"/>',
    guides: '<path d="M2.5 3.6c1.9-.5 3.7-.3 5.5.8v9c-1.8-1.1-3.6-1.3-5.5-.8ZM13.5 3.6c-1.9-.5-3.7-.3-5.5.8v9c1.8-1.1 3.6-1.3 5.5-.8Z"/>',
    room: '<circle cx="5.8" cy="5.6" r="2"/><circle cx="11" cy="6.2" r="1.6"/><path d="M2.2 12.6c.4-2.2 1.8-3.4 3.6-3.4s3.2 1.2 3.6 3.4M10 9.4c1.9-.2 3.3.9 3.8 3"/>',
    business: '<rect x="3.2" y="2.2" width="9.6" height="11.6" rx="1.2"/><path d="M5.6 5.4h4.8M5.6 8h4.8M5.6 10.6h2"/>',
    back: '<path d="M10 3.5 5.5 8l4.5 4.5"/>', fwd: '<path d="M6 3.5 10.5 8 6 12.5"/>',
    find: '<circle cx="7" cy="7" r="4.25"/><path d="M10.2 10.2 13 13"/>',
    moon: '<path d="M8 2.2a4.6 4.6 0 0 0 5.8 5.8A5.9 5.9 0 1 1 8 2.2Z"/>',
    sun: '<circle cx="8" cy="8" r="2.6"/><path d="M8 1.6v1.3M8 13.1v1.3M1.6 8h1.3M13.1 8h1.3M3.5 3.5l.9.9M11.6 11.6l.9.9M3.5 12.5l.9-.9M11.6 4.4l.9-.9"/>',
    arrow: '<path d="M5.5 10.5 10.5 5.5M6.5 5.5h4v4"/>',
    plus: '<path d="M8 3.2v9.6M3.2 8h9.6"/>', check: '<path d="M4 8.3 6.8 11 12 5.2"/>',
    play: '<path class="ltw-fill" d="M5.4 3.4v9.2c0 .4.4.6.7.4l6.9-4.6c.3-.2.3-.6 0-.8L6.1 3c-.3-.2-.7 0-.7.4Z"/>',
    pause: '<rect class="ltw-fill" x="4.2" y="3.2" width="2.6" height="9.6" rx=".8"/><rect class="ltw-fill" x="9.2" y="3.2" width="2.6" height="9.6" rx=".8"/>',
    prev: '<path class="ltw-fill" d="M12 3.6v8.8c0 .4-.4.6-.7.4L5.6 8.4c-.3-.2-.3-.6 0-.8l5.7-4.4c.3-.2.7 0 .7.4Z"/><rect class="ltw-fill" x="3.4" y="3.4" width="1.6" height="9.2" rx=".6"/>',
    next: '<path class="ltw-fill" d="M4 3.6v8.8c0 .4.4.6.7.4l5.7-4.4c.3-.2.3-.6 0-.8L4.7 3.2c-.3-.2-.7 0-.7.4Z"/><rect class="ltw-fill" x="11" y="3.4" width="1.6" height="9.2" rx=".6"/>',
    heart: '<path d="M8 13s-5.2-3-5.2-6.6A2.8 2.8 0 0 1 8 4.8a2.8 2.8 0 0 1 5.2 1.6C13.2 10 8 13 8 13Z"/>',
    down: '<path d="M8 2.8v7.4M4.8 7.2 8 10.4l3.2-3.2M3.4 13.2h9.2"/>',
    menu: '<path d="M2.8 4.6h10.4M2.8 8h10.4M2.8 11.4h10.4"/>', close: '<path d="M4 4l8 8M12 4l-8 8"/>',
    wave: '<path d="M3 8h1M5 6v4M7 4.5v7M9 6v4M11 5v6M13 7.5v1"/>', midi: '<rect x="2.5" y="4" width="11" height="8" rx="1"/><path d="M5.5 4v4.5M8 4v4.5M10.5 4v4.5"/>',
    file: '<path d="M4 2.5h5l3 3v8H4Z"/><path d="M9 2.5v3h3"/>', link: '<path d="M7 9a2.6 2.6 0 0 0 3.7 0l2-2a2.6 2.6 0 0 0-3.7-3.7l-.6.6M9 7a2.6 2.6 0 0 0-3.7 0l-2 2a2.6 2.6 0 0 0 3.7 3.7l.6-.6"/>',
    flag: '<path d="M4 13.5V2.8M4 3.2h7.5l-1.6 2.4 1.6 2.4H4"/>', target: '<circle cx="8" cy="8" r="5.4"/><circle cx="8" cy="8" r="2.4"/>',
    cal: '<rect x="2.6" y="3.4" width="10.8" height="10" rx="1.2"/><path d="M2.6 6.4h10.8M5.4 2.2v2.2M10.6 2.2v2.2"/>',
    loop: '<path d="M3 7a4 4 0 0 1 7-2.6L12 6M13 9a4 4 0 0 1-7 2.6L4 10"/><path d="M12 3.4V6H9.4M4 12.6V10h2.6"/>'
  };
  var RINGS = '<svg viewBox="-456 -300 912 600" aria-hidden="true"><path d="M-57.732 283.449 A355.000 355.000 0 0 1 -148.880 181.861 A182.000 182.000 0 1 1 27.236 0.000 A127.000 127.000 0 0 0 118.383 121.301 A300.000 300.000 0 1 0 -57.732 283.449 Z"/><path d="M57.732 -283.449 A355.000 355.000 0 0 1 148.880 -181.861 A182.000 182.000 0 1 1 -27.236 0.000 A127.000 127.000 0 0 0 -118.383 -121.301 A300.000 300.000 0 1 0 57.732 -283.449 Z"/></svg>';
  function blurName(w, h) { return '<span class="ltw-blur" style="width:' + w + '%" role="img" aria-label="' + esc(W.nameHidden) + '"></span>' + (h ? '<span class="ltw-blur ltw-blur-2" style="width:' + h + '%" aria-hidden="true"></span>' : ''); }
  function tag(k) { return '<span class="ltw-tag ltw-tag-' + k + '">' + esc(W[k] || k) + '</span>'; }
  function laneTag(l) { return '<span class="ltw-tag ltw-lane-' + l + '">' + esc(l) + '</span>'; }
  function hashBars(seed, n) { var h = 0, out = []; for (var i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0; for (var j = 0; j < n; j++) { h = (h * 1103515245 + 12345) >>> 0; out.push(28 + (h % 72)); } return out; }

  /* ---------- shell ---------- */
  var NAV = [
    ['home', 'home'], ['day', 'day'], ['g', 'board'], ['briefs', 'briefs'], ['subs', 'subs'], ['g', 'library'], ['vault', 'vault'], ['kits', 'kits'],
    ['g', 'membership'], ['mentor', 'mentor'], ['guides', 'guides'], ['room', 'room'], ['business', 'business']
  ];
  function sidebar() {
    var h = '<div class="ltw-brand"><span class="ltw-mark">' + RINGS + '</span><span>' + esc(W.app) + '</span></div><nav class="ltw-nav" aria-label="portal pages">';
    NAV.forEach(function (n) {
      if (n[0] === 'g') { h += '<p class="ltw-group">' + esc(W.groups[n[1]]) + '</p>'; return; }
      var on = S.page === n[0] || (n[0] === 'briefs' && S.page === 'brief');
      var extra = n[0] === 'briefs' ? '<span class="ltw-count" data-ltw-count>' + esc(briefCount) + '</span>' : (n[0] === 'guides' || n[0] === 'business') ? '<span class="ltw-soon">new</span>' : '';
      h += '<button type="button" class="ltw-navi' + (on ? ' is-on' : '') + '" data-go="' + n[0] + '"' + (on ? ' aria-current="page"' : '') + '>' + ic(n[1]) + '<span>' + esc(W.nav[n[0]]) + '</span>' + extra + '</button>';
    });
    return h + '</nav>';
  }
  function crumb() { var p = S.page === 'brief' ? 'briefs' : S.page; return esc(W.nav[p] || p); }
  function shell() {
    return '<div class="ltw-menubar"><span class="ltw-mb-rings">' + RINGS + '</span><b>' + esc(W.menuApp) + '</b><span class="ltw-mb-clock" data-ltw-clock>' + esc(clock()) + '</span></div>' +
      '<div class="ltw-app"><aside class="ltw-side">' + sidebar() + '</aside>' +
      '<div class="ltw-main"><header class="ltw-top">' +
      '<button type="button" class="ltw-ib ltw-burger" data-act="drawer" aria-label="open the portal menu">' + ic('menu') + '</button>' +
      '<button type="button" class="ltw-ib ltw-hist" data-act="back" aria-label="back"' + (S.hi > 0 ? '' : ' disabled') + '>' + ic('back') + '</button>' +
      '<button type="button" class="ltw-ib ltw-hist" data-act="fwd" aria-label="forward"' + (S.hi < S.hist.length - 1 ? '' : ' disabled') + '>' + ic('fwd') + '</button>' +
      '<button type="button" class="ltw-ib ltw-homeb" data-go="home" aria-label="home">' + ic('home') + '</button><span class="ltw-crumb"><i>/</i>' + crumb() + '</span>' +
      '<button type="button" class="ltw-find" data-act="find" aria-label="search the portal">' + ic('find') + '<span>' + esc(W.search) + '</span><kbd>⌘K</kbd></button>' +
      '<button type="button" class="ltw-ib ltw-theme" data-act="theme" aria-label="switch the portal to ' + (S.theme === 'dark' ? 'light' : 'dark') + ' mode" aria-pressed="' + (S.theme === 'dark') + '">' + ic(S.theme === 'dark' ? 'sun' : 'moon') + '</button>' +
      (S.tip ? '<span class="ltw-tip" aria-hidden="true">' + esc(W.tryDark) + '</span>' : '') +
      '<button type="button" class="ltw-help" data-act="help">' + esc(W.help) + '</button></header>' +
      '<div class="ltw-scroll" tabindex="-1"><div class="ltw-page" data-page="' + S.page + '">' + page() + '</div></div>' + player() + '</div></div>' +
      '<div class="ltw-drawer"' + (S.drawer ? '' : ' hidden') + '><div class="ltw-drawer-in">' + '<button type="button" class="ltw-ib ltw-drawer-x" data-act="drawer" aria-label="close the menu">' + ic('close') + '</button>' + sidebar() + '</div></div>' +
      '<p class="ltw-sr" aria-live="polite" data-ltw-live></p>';
  }

  /* ---------- pages ---------- */
  function page() {
    switch (S.page) {
      case 'day': return pDay();
      case 'briefs': return pBoard();
      case 'brief': return pBrief();
      case 'subs': return pSubs();
      case 'vault': return pVault();
      case 'kits': return pKits();
      case 'mentor': return pMentor();
      case 'guides': return pHeld('guidesTitle', 'guidesHeld');
      case 'room': return pRoom();
      case 'business': return pHeld('businessTitle', 'businessHeld');
      default: return pHome();
    }
  }
  function todo() { return S.tasks.filter(function (t) { return !t.done; }).length; }
  function habitsLeft() { return S.habits.filter(function (t) { return !t.done; }).length; }
  function inReview() { return 0; } /* a new send sits under "new" until he moves it */
  function card(go, title, sub, body, cls) {
    return '<div class="ltw-card ' + (cls || '') + '"><button type="button" class="ltw-card-h" data-go="' + go + '"><h3>' + esc(title) + '</h3><span class="ltw-arr">' + ic('arrow') + '</span></button>' + (sub ? '<p class="ltw-sub">' + esc(sub) + '</p>' : '') + body + '</div>';
  }
  function row(l, r, go) { return '<button type="button" class="ltw-row" data-go="' + go + '"><span>' + esc(l) + '</span><span class="ltw-dim">' + esc(r) + '</span></button>'; }
  function pHome() {
    var stats = '<div class="ltw-stats"><div><p>' + esc(W.statNew) + '</p><b>' + BRIEFS.length + '</b></div><div><p>' + esc(W.statReview) + '</p><b>' + inReview() + '</b></div><div><p>' + esc(W.statKit) + '</p><b>' + esc(W.newestKit) + '</b></div><div><p>' + esc(W.statModule) + '</p><b>' + esc(W.nextModule) + '</b></div></div>';
    var hero = '<div class="ltw-card ltw-welcome"><span class="ltw-avatar" aria-hidden="true">' + RINGS + '</span><div><h2>' + esc(W.welcome) + '</h2><p>' + esc(W.welcomeSub) + '</p></div>' + stats + '</div>';
    var dayC = card('day', W.dayTitle, W.dayCardSub, '<button type="button" class="ltw-today" data-go="day">' + ic('check') + '<span>' + esc(W.today) + '</span><span class="ltw-dim">' + todo() + ' ' + esc(W.toDo) + '</span></button>' + row(W.theWeek, (S.planSaved ? 3 : 0) + ' ' + W.tasks, 'day') + row(W.everyDay, S.habits.length + ' ' + W.habits, 'day'));
    var subsC = card('subs', W.nav.subs, W.subsCardSub, row(W.stNew, S.sent.length, 'subs') + row(W.stReview, 0, 'subs') + row(W.stSent, 0, 'subs') + row(W.stPlaced, 0, 'subs'));
    var b = findBrief('b2');
    var briefsC = '<div class="ltw-skycard"><button type="button" class="ltw-sky" data-brief="' + b.id + '" aria-label="open a ' + b.lane + ' ' + b.genre + ' brief"><span class="ltw-sky-panel"><span class="ltw-sky-row"><span class="ltw-sky-name">' + blurName(55) + '<small>' + esc(b.genre) + '</small></span>' + laneTag(b.lane) + '<b>' + esc(W.submit) + ' ›</b></span><span class="ltw-sky-row ltw-sky-foot"><span>' + esc(W.groups.board) + '</span><span class="ltw-dim"><span data-ltw-count>' + esc(briefCount) + '</span> live</span></span></span></button><button type="button" class="ltw-sky-t" data-go="briefs"><h3>' + esc(W.briefsLabel) + '</h3><p>' + esc(W.briefsCardSub) + '</p></button></div>';
    var vaultC = '<div class="ltw-skycard ltw-sky-s"><button type="button" class="ltw-sky" data-go="vault" aria-label="open the vault"><span class="ltw-sky-panel"><span class="ltw-sky-search">' + ic('find') + esc(W.searchVault) + '</span><span class="ltw-sky-row"><span>garden</span><span class="ltw-dim">85 bpm</span></span><span class="ltw-sky-row ltw-sky-foot"><span>the kit vault</span></span></span></button><button type="button" class="ltw-sky-t" data-go="vault"><h3>' + esc(W.vaultTitle) + '</h3><p>' + esc(W.vaultCardSub) + '</p></button></div>';
    var roomC = '<div class="ltw-skycard ltw-sky-s"><button type="button" class="ltw-sky" data-go="room" aria-label="open the room"><span class="ltw-sky-panel"><span class="ltw-sky-pill">' + esc(W.roomDiscord) + ' ›</span>' + W.roomChannels.slice(0, 3).map(function (c) { return '<span class="ltw-sky-row"><span>' + esc(c) + '</span></span>'; }).join('') + '</span></button><button type="button" class="ltw-sky-t" data-go="room"><h3>' + esc(W.roomTitle) + '</h3><p>' + esc(W.roomCardSub) + '</p></button></div>';
    var kitsC = card('kits', W.kitsTitle, W.kitsCardSub, KITS.map(function (k) { return row(k.name, k.meta, 'kits'); }).join(''));
    var mentorC = card('mentor', W.mentorTitle, W.mentorCardSub, row(W.blueprint, '18 ' + W.modules, 'mentor') + row(W.psychology, '16 ' + W.modules, 'mentor'));
    return hero + '<div class="ltw-grid"><div class="ltw-col">' + dayC + subsC + '</div><div class="ltw-col ltw-col-mid">' + briefsC + '<div class="ltw-pair">' + vaultC + roomC + '</div></div><div class="ltw-col">' + kitsC + mentorC + '</div></div>';
  }
  function pDay() {
    var sub = '<nav class="ltw-subnav" aria-label="your day"><button type="button" class="ltw-addtask" data-act="addtask">' + ic('plus') + esc(W.addTask) + '</button>' +
      W.daySub.map(function (s, i) { var n = i === 0 ? todo() : i === 2 ? habitsLeft() : i === 5 ? 1 : ''; return '<button type="button" class="ltw-subi' + (i === 0 ? ' is-on' : '') + '" data-act="daysub">' + esc(s) + '<span class="ltw-dim">' + n + '</span></button>'; }).join('') +
      '<button type="button" class="ltw-pill-ghost" data-act="help">' + esc(W.getHelp) + '</button><div class="ltw-cal"><span class="ltw-cal-ic">' + ic('cal') + '</span><button type="button" class="ltw-pill-ghost" data-act="cal">' + esc(W.addCal) + '</button></div></nav>';
    var tasks = S.tasks.map(function (t, i) { return '<li><button type="button" class="ltw-tick' + (t.done ? ' is-done' : '') + '" data-task="' + i + '" aria-pressed="' + t.done + '">' + ic('check') + '</button><span' + (t.done ? ' class="is-done"' : '') + '>' + esc(t.t) + '</span></li>'; }).join('');
    var b = BRIEFS[0];
    var plan = S.planOpen ? '<div class="ltw-plan"><p class="ltw-plan-h">' + esc(W.planTitle) + ' · ' + esc(longDate(day(0))) + '</p>' + W.planBlocks.map(function (p) { return '<p class="ltw-block"><b>' + p[0] + '–' + p[1] + '</b><span>' + esc(p[2]) + '</span></p>'; }).join('') + '<button type="button" class="ltw-pill" data-act="saveplan">' + esc(S.planSaved ? W.planSaved : 'save the plan') + '</button></div>' : '';
    var main = '<div class="ltw-day"><h2>' + esc(W.dayTitle) + '</h2><p class="ltw-date">' + esc(longDate(day(0))) + '</p><p class="ltw-dim">' + todo() + ' ' + esc(W.toDoToday) + ' · ' + habitsLeft() + ' ' + esc(W.habitsLeft) + '</p>' +
      '<div class="ltw-todaybox"><p class="ltw-todaybox-h"><span>' + esc(W.today) + '</span><span>' + (S.tasks.length - todo()) + '/' + S.tasks.length + '</span></p><ul class="ltw-tasks">' + tasks + '</ul>' + (todo() === 0 ? '<p class="ltw-dim">' + esc(W.allDone) + '</p>' : '') + '</div>' +
      (S.adding ? '<form class="ltw-newtask" data-form="task"><input type="text" maxlength="60" placeholder="' + esc(W.newTaskPh) + '" aria-label="' + esc(W.newTaskPh) + '"><button type="submit" class="ltw-pill">' + esc(W.addTask) + '</button></form>' : '<button type="button" class="ltw-line" data-act="addtask">' + ic('plus') + esc(W.addTask) + '</button>') +
      '<button type="button" class="ltw-line" data-act="plan">' + ic('target') + esc(W.planDay) + '</button>' + plan +
      '<h3 class="ltw-h3">' + esc(W.workingOn) + '</h3><div class="ltw-work">' + ic('flag') + '<div><p>' + laneTag(b.lane) + ' ' + esc(b.genre) + ' ' + blurName(30) + '</p><p class="ltw-dim">' + esc(closesLine(b.close)) + ' <b>' + esc(S.planSaved ? W.planBlocks[0][0] + '–' + W.planBlocks[0][1] : W.noTime) + '</b></p><p class="ltw-btns"><button type="button" class="ltw-pill-ghost" data-brief="' + b.id + '">' + esc(W.readBrief) + '</button><button type="button" class="ltw-pill-ghost" data-act="plan">' + esc(W.planDay) + '</button></p></div></div>' +
      '<h3 class="ltw-h3">' + esc(W.nav.subs) + '</h3>' + subRows(true) +
      '<h3 class="ltw-h3 ltw-h3-split"><span>' + esc(W.everyDay) + '</span><button type="button" class="ltw-link" data-act="daysub">' + esc(W.manage) + '</button></h3><ul class="ltw-tasks">' +
      S.habits.map(function (t, i) { return '<li><button type="button" class="ltw-tick' + (t.done ? ' is-done' : '') + '" data-habit="' + i + '" aria-pressed="' + t.done + '">' + ic('check') + '</button><span>' + esc(t.t) + '</span></li>'; }).join('') + '</ul>' +
      '<p class="ltw-split ltw-dim"><span>' + (S.habits.length - habitsLeft()) + ' ' + esc(W.doneToday) + '</span></p></div>';
    return '<div class="ltw-daywrap">' + sub + main + '</div>';
  }
  function lanesBar() {
    return '<div class="ltw-lanes" role="group" aria-label="lanes">' + ['all'].concat(W.lanes).map(function (l) { return '<button type="button" class="ltw-chip' + (S.lane === l ? ' is-on ltw-chip-' + l : '') + '" data-lane="' + l + '" aria-pressed="' + (S.lane === l) + '">' + esc(l === 'all' ? W.allLanes : l) + '</button>'; }).join('') + '</div>';
  }
  function briefCard(b) {
    return '<button type="button" class="ltw-bcard" data-brief="' + b.id + '"><span class="ltw-bcard-t"><span>' + esc(b.genre) + '</span><span class="ltw-dim">' + esc(W.posted + ' ' + b.ago + ' ' + (b.ago === 1 ? W.hrAgo : W.hrsAgo)) + '</span></span><span class="ltw-bname">' + blurName(b.blur[0]) + '</span><span class="ltw-dim ltw-bclose">' + esc(closesLine(b.close)) + '</span><span class="ltw-btags">' + laneTag(b.lane) + b.tags.map(tag).join('') + '</span></button>';
  }
  function pBoard() {
    var list = BRIEFS.filter(function (b) { return S.lane === 'all' || b.lane === S.lane; });
    var groups = (S.lane === 'all' ? W.lanes : [S.lane]).map(function (l) {
      var items = list.filter(function (b) { return b.lane === l; });
      if (!items.length) return '';
      return '<div class="ltw-laneg"><h3>' + esc(l) + '</h3><div class="ltw-bgrid">' + items.map(briefCard).join('') + '</div></div>';
    }).join('');
    return '<div class="ltw-boardhead"><div><h2 class="ltw-big">' + esc(W.boardTitle) + '</h2><p>' + esc(W.boardSub) + '</p></div><div class="ltw-boardstat"><p><b><span data-ltw-count>' + esc(briefCount) + '</span> ' + esc(W.liveBriefs) + '</b></p><p class="ltw-dim">' + esc(W.allLanes) + '</p></div></div>' + lanesBar() + '<p class="ltw-examples">' + esc(W.examples) + '</p>' + groups;
  }
  function findBrief(id) { for (var i = 0; i < BRIEFS.length; i++) if (BRIEFS[i].id === id) return BRIEFS[i]; return BRIEFS[0]; }
  function pBrief() {
    var b = findBrief(S.brief), s = S.send, already = S.sent.some(function (x) { return x.brief === b.id; });
    var send;
    if (s.stage === 'done' || already) {
      send = '<div class="ltw-receipt" role="status"><span class="ltw-receipt-ic">' + ic('check') + '</span><p class="ltw-receipt-h">' + esc(W.queued) + '</p><p class="ltw-dim">' + esc(W.heard) + ' ' + esc(W.yourSendNote) + '</p><p class="ltw-btns"><button type="button" class="ltw-pill" data-go="subs">' + esc(W.seeSubs) + '</button><button type="button" class="ltw-pill-ghost" data-go="briefs">' + esc(W.sendAnother) + '</button></p><p class="ltw-demo">' + esc(W.demoNote) + '</p></div>';
    } else {
      var has = !!(s.file || s.link.trim());
      send = '<form class="ltw-send" data-form="send"><p class="ltw-send-h">' + esc(W.sendTitle) + '</p>' +
        '<label class="ltw-dropz' + (s.file ? ' has-file' : '') + '" data-drop><input type="file" multiple accept="audio/*,.mp3,.wav,.zip" class="ltw-file" data-file>' +
        (s.file ? '<span class="ltw-chosen">' + ic('file') + '<b>' + esc(s.file) + '</b></span>' : '<span>' + ic('down') + esc(W.drop) + '</span><small>' + esc(W.dropKinds) + '</small>') + '</label>' +
        '<label class="ltw-field"><span>' + ic('link') + esc(W.orLink) + '</span><input type="url" inputmode="url" placeholder="' + esc(W.linkPh) + '" value="' + esc(s.link) + '" data-link></label>' +
        '<label class="ltw-field"><span>' + esc(W.note) + '</span><input type="text" maxlength="120" data-note></label>' +
        '<p class="ltw-btns"><button type="submit" class="ltw-pill ltw-submit' + (s.stage === 'sending' ? ' is-sending' : '') + '"' + (has && s.stage !== 'sending' ? '' : ' disabled') + '>' + (s.stage === 'sending' ? '<span class="ltw-wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>' + esc(W.sending) : esc(W.submit)) + '</button><span class="ltw-demo">' + esc(W.demoNote) + '</span></p></form>';
    }
    return '<button type="button" class="ltw-back" data-go="briefs">' + ic('back') + esc(W.allBriefs) + '</button>' +
      '<div class="ltw-bdetail"><div class="ltw-bmain"><p class="ltw-btags">' + laneTag(b.lane) + b.tags.map(tag).join('') + '</p><h2 class="ltw-bh">' + blurName(b.blur[0], b.blur[1]) + '</h2><p class="ltw-dim">' + esc(b.genre + ' · ' + b.bpm + ' · ' + closesLine(b.close)) + '</p>' +
      '<h3 class="ltw-h3">' + esc(W.after) + '</h3><p>' + esc(AFTER[b.id]) + '</p><h3 class="ltw-h3 ltw-refs-h">' + esc(W.refs) + '</h3><ul class="ltw-refs">' +
      [0, 1, 2].map(function (i) { return '<li><span class="ltw-refart" aria-hidden="true"></span>' + blurName(40 + i * 12) + '<span class="ltw-dim">' + ['3:12', '2:48', '3:31'][i] + '</span></li>'; }).join('') + '</ul></div><div class="ltw-bside">' + send + '</div></div>';
  }
  function subRows(compact) {
    var rows = S.sent.map(function (x, i) { return '<button type="button" class="ltw-subrow' + (S.subOpen === 'n' + i ? ' is-on' : '') + '" data-sub="n' + i + '"><span><b>' + esc(x.title) + '</b><span class="ltw-dim">' + esc(W.stNew) + ' · ' + esc(W.justNow) + '</span></span></button>'; }).join('');
    rows += '<button type="button" class="ltw-subrow' + (S.subOpen === 'ex' ? ' is-on' : '') + '" data-sub="ex"><span><b>' + esc(EX.title) + '</b><span class="ltw-dim">' + esc(W.passedSee) + '</span></span>' + (compact ? '' : '<span class="ltw-dim">' + esc(W.listened + ' ' + shortDate(day(-4))) + '</span>') + '</button>';
    return '<div class="ltw-subrows">' + rows + '</div>';
  }
  var EX = { title: 'hot · pop · 124 bpm', file: 'press.wav' };
  function heat() {
    var cells = '';
    for (var c = 0; c < 13; c++) for (var r = 0; r < 7; r++) {
      var v = 0; if (c === 12 && r === (day(-5).getDay() + 6) % 7) v = 1; if (c === 12 && r === (day(0).getDay() + 6) % 7 && S.sent.length) v = 2;
      cells += '<i class="ltw-h' + v + '" style="grid-column:' + (c + 1) + ';grid-row:' + (r + 1) + '"></i>';
    }
    return '<div class="ltw-heat" aria-hidden="true">' + cells + '</div><p class="ltw-heat-k ltw-dim">' + esc(W.less) + ' <i class="ltw-h0"></i><i class="ltw-h1"></i><i class="ltw-h2"></i> ' + esc(W.more) + '</p>';
  }
  function pSubs() {
    var n = S.sent.length + 1;
    if (!S.subOpen) S.subOpen = S.sent.length ? 'n0' : 'ex';
    var open = S.subOpen, det;
    if (open !== 'ex') {
      var x = S.sent[+open.slice(1)] || S.sent[0];
      det = '<p class="ltw-dim">#' + (n + 2) + ', ' + esc(W.submitted) + ' ' + esc(shortDate(day(0))) + '</p><p class="ltw-dt">' + esc(x.title) + '</p><p class="ltw-file">' + esc(x.file) + ' ›</p>' +
        '<ol class="ltw-tl"><li class="is-on"><b>' + esc(W.stNew) + '</b><span>' + esc(W.justNow) + '</span></li><li><b>' + esc(W.listened) + '</b><span class="ltw-dim">' + esc(W.yourSendNote) + '</span></li></ol><p class="ltw-demo">' + esc(W.demoNote) + '</p>';
    } else {
      det = '<p class="ltw-dim">#' + (n + 1) + ', ' + esc(W.submitted) + ' ' + esc(shortDate(day(-5))) + '</p><p class="ltw-dt">' + esc(EX.title) + '</p><p class="ltw-file">' + esc(EX.file) + ' ›</p><p>' + esc(W.myNoteBelow) + '</p>' +
        '<ol class="ltw-tl"><li class="is-on"><b>' + esc(W.stNew) + '</b><span>' + esc(shortDate(day(-5))) + '</span><span>' + esc(W.listened + ' ' + shortDate(day(-4))) + '</span></li><li class="is-on"><b>' + esc(W.stPassed) + '</b><span>' + esc(shortDate(day(-3))) + '</span><div class="ltw-note"><b>' + esc(W.myNote) + '</b><p>' + esc(W.demoNoteText) + '</p></div></li></ol>';
    }
    return '<div class="ltw-subshead"><div><h2 class="ltw-big">' + esc(W.subsTitle) + '</h2><p>' + esc(W.subsSub) + '</p></div><div class="ltw-heatcard"><p><b>' + esc(W.yourSubs) + '</b></p><p class="ltw-dim"><b>' + n + ' ' + esc(n === 1 ? W.submission : W.submissions) + '</b> ' + esc(W.overWeeks) + '</p>' + heat() + '</div></div>' +
      '<div class="ltw-subsbody">' + subRows(false) + '<div class="ltw-subdet">' + det + '</div></div>';
  }
  function soundRows() {
    var q = S.q.trim().toLowerCase(), t = parseInt(S.tempo, 10);
    var list = SOUNDS.filter(function (s) { return (S.kind === 'all' || s.kind === S.kind) && (!q || (s.title + ' ' + s.kit + ' ' + s.bpm).indexOf(q) > -1); });
    if (t > 40 && t < 220) list = list.slice().sort(function (a, b) { return Math.abs(a.bpm - t) - Math.abs(b.bpm - t); });
    if (!list.length) return '<p class="ltw-dim ltw-empty">' + esc(W.nothingFound) + '</p>';
    return '<ul class="ltw-sounds">' + list.map(function (s) {
      var on = S.playing === s.id, near = t > 40 && Math.abs(s.bpm - t) <= 5;
      return '<li class="ltw-sound' + (on ? ' is-on' : '') + (near ? ' is-near' : '') + '"><button type="button" class="ltw-sp" data-play="' + s.id + '" aria-label="' + esc((on && S.state === 'playing' ? W.pause : W.play) + ' ' + s.title) + '">' + (on && S.state === 'loading' ? '<span class="ltw-spin"></span>' : ic(on && S.state === 'playing' ? 'pause' : 'play')) + '</button>' +
        '<span class="ltw-sname"><b>' + esc(s.title) + '</b>' + (s.fresh ? '<sup>' + esc(W.newTag) + '</sup>' : '') + '<small class="ltw-dim">' + esc(s.kit) + '</small></span><span class="ltw-sbpm">' + s.bpm + ' ' + esc(W.bpm) + '</span><span class="ltw-dim ltw-skind">' + esc(s.kind) + '</span><span class="ltw-dim ltw-skit">' + esc(s.kit) + '</span>' +
        '<button type="button" class="ltw-ib" data-like="' + s.id + '" aria-label="like ' + esc(s.title) + '" aria-pressed="' + !!S.crate['l' + s.id] + '">' + ic('heart') + '</button><button type="button" class="ltw-crate" data-crate="' + s.id + '" aria-pressed="' + !!S.crate[s.id] + '">' + (S.crate[s.id] ? esc(W.inCrate) : '+ ' + esc(W.crate)) + '</button><button type="button" class="ltw-ib" data-pull aria-label="pull ' + esc(s.title) + '">' + ic('down') + '</button></li>';
    }).join('') + '</ul>';
  }
  function pVault() {
    return '<div class="ltw-vault"><h2 class="ltw-player-h">' + esc(W.playerTitle) + '</h2><p class="ltw-player-sub">' + esc(W.playerSub) + '</p>' +
      '<div class="ltw-vsearch"><label class="ltw-vq">' + ic('find') + '<input type="search" placeholder="' + esc(W.searchVault) + '" aria-label="' + esc(W.searchVault) + '" value="' + esc(S.q) + '" data-vq></label><span class="ltw-kinds" role="group">' +
      W.kinds.map(function (k) { return '<button type="button" class="ltw-chip' + (S.kind === k ? ' is-on' : '') + '" data-kind="' + k + '" aria-pressed="' + (S.kind === k) + '">' + esc(k) + '</button>'; }).join('') + '</span></div>' +
      '<p class="ltw-vfilters ltw-dim"><span>' + esc(W.bpm) + ' ⌄</span><span>' + esc(W.mood) + '</span><span>' + esc(W.sortBy) + ' <b>' + esc(W.newest) + '</b> ⌄</span></p>' +
      '<label class="ltw-tempo"><span class="ltw-dim">' + esc(W.yourTempo) + '</span><input type="text" inputmode="numeric" maxlength="3" value="' + esc(S.tempo) + '" data-tempo aria-label="' + esc(W.yourTempo) + '"><span class="ltw-dim">' + esc(W.bpm) + '</span></label>' +
      '<div data-ltw-rows>' + soundRows() + '</div><p class="ltw-dim ltw-vnote">' + esc(W.previewsFrom) + '</p></div>';
  }
  function pKits() {
    return '<h2 class="ltw-big">' + esc(W.kitsTitle) + '</h2><p class="ltw-sub">' + esc(W.kitsCardSub) + '</p><div class="ltw-kits">' + KITS.map(function (k) {
      return '<div class="ltw-kit"><img src="' + k.cover + '" alt="' + esc(k.name) + ' cover" loading="lazy" decoding="async" width="160" height="160"><p><b>' + esc(k.name) + '</b><span class="ltw-dim">' + esc(k.meta) + '</span></p>' + (k.pl ? '<button type="button" class="ltw-pill-ghost" data-go="vault">' + esc(W.kitPreviews) + '</button>' : '') + '</div>';
    }).join('') + '</div>';
  }
  function pMentor() {
    return '<h2 class="ltw-big">' + esc(W.mentorTitle) + '</h2><p class="ltw-sub">' + esc(W.mentorCardSub) + '</p><div class="ltw-list">' + row(W.blueprint, '18 ' + W.modules, 'mentor') + row(W.psychology, '16 ' + W.modules, 'mentor') + '</div>';
  }
  function pRoom() {
    return '<h2 class="ltw-big">' + esc(W.roomTitle) + '</h2><p class="ltw-sub">' + esc(W.roomCardSub) + '</p><div class="ltw-list"><p class="ltw-row ltw-row-pill"><span>' + esc(W.roomDiscord) + ' ›</span></p>' + W.roomChannels.map(function (c) { return '<p class="ltw-row"><span># ' + esc(c) + '</span></p>'; }).join('') + '</div>';
  }
  function pHeld(t, b) { return '<h2 class="ltw-big">' + esc(W[t]) + '</h2><p><span class="ltw-tag ltw-tag-soon">' + esc(W.soon) + '</span></p><p class="ltw-sub">' + esc(W[b]) + '</p>'; }

  /* ---------- bottom player ---------- */
  function cur() { for (var i = 0; i < SOUNDS.length; i++) if (SOUNDS[i].id === S.playing) return SOUNDS[i]; return null; }
  function player() {
    var s = cur(); if (!s) return '';
    var bars = hashBars(s.title, 44), pct = S.dur ? S.pos / S.dur : 0;
    return '<div class="ltw-player" role="group" aria-label="now playing: ' + esc(s.title) + '"><button type="button" class="ltw-pb" data-act="prev" aria-label="previous sound">' + ic('prev') + '</button><button type="button" class="ltw-pb ltw-pb-main" data-play="' + s.id + '" aria-label="' + (S.state === 'playing' ? W.pause : W.play) + '">' + (S.state === 'loading' ? '<span class="ltw-spin"></span>' : ic(S.state === 'playing' ? 'pause' : 'play')) + '</button><button type="button" class="ltw-pb" data-act="next" aria-label="next sound">' + ic('next') + '</button>' +
      '<span class="ltw-pt"><b>' + esc(s.title) + '</b><small>' + s.bpm + ' ' + esc(W.bpm) + ' · ' + esc(s.kit) + '</small></span><span class="ltw-pw" aria-hidden="true">' + bars.map(function (h, i) { return '<i style="height:' + h + '%"' + (i / bars.length < pct ? ' class="is-p"' : '') + '></i>'; }).join('') + '</span>' +
      (S.err ? '<span class="ltw-perr">' + esc(W.noAudio) + '</span>' : '') + '</div>';
  }

  /* ---------- SoundCloud (the public playlists this page already embeds) ---------- */
  var widgets = {}, wantPlay = null;
  function scReady(cb) {
    if (window.SC && window.SC.Widget) return cb();
    var t = document.querySelector('script[src*="w.soundcloud.com/player/api.js"]');
    if (!t) { t = document.createElement('script'); t.src = 'https://w.soundcloud.com/player/api.js'; t.async = true; document.head.appendChild(t); }
    var n = 0, iv = setInterval(function () { if (window.SC && window.SC.Widget) { clearInterval(iv); cb(); } else if (++n > 60) { clearInterval(iv); fail(); } }, 100);
  }
  function widget(pl, cb) {
    var w = widgets[pl];
    if (w && w.ready) return cb(w);
    if (w) { w.q.push(cb); return; }
    w = widgets[pl] = { q: [cb], ready: false, ids: [] };
    scReady(function () {
      var f = document.createElement('iframe');
      f.className = 'ltw-sc'; f.title = 'kit previews'; f.allow = 'autoplay; encrypted-media'; f.tabIndex = -1; f.setAttribute('aria-hidden', 'true');
      f.src = 'https://w.soundcloud.com/player/?url=' + encodeURIComponent('https://api.soundcloud.com/playlists/' + pl) + '&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false';
      mount.appendChild(f);
      var api = window.SC.Widget(f); w.api = api;
      api.bind(window.SC.Widget.Events.READY, function () {
        api.getSounds(function (list) {
          w.ids = (list || []).map(function (x) { return x && x.id; }); w.ready = true;
          api.bind(window.SC.Widget.Events.PLAY, function () { if (w.cur === S.playing) { S.state = 'playing'; S.err = false; paint(); } });
          api.bind(window.SC.Widget.Events.PAUSE, function () { if (w.cur === S.playing && S.state === 'playing') { S.state = 'paused'; paint(); } });
          api.bind(window.SC.Widget.Events.FINISH, function () { if (w.cur === S.playing) step(1); });
          api.bind(window.SC.Widget.Events.PLAY_PROGRESS, function (e) { if (w.cur !== S.playing) return; S.pos = e.currentPosition; S.dur = e.relativePosition ? e.currentPosition / e.relativePosition : S.dur; paintProgress(); });
          var q = w.q; w.q = []; q.forEach(function (fn) { fn(w); });
        });
      });
      setTimeout(function () { if (!w.ready) fail(); }, 9000);
    });
  }
  function fail() { if (S.state === 'loading') { S.state = 'idle'; S.err = true; paint(); } }
  function preload() { SOUNDS.forEach(function (s) { widget(s.pl, function () {}); }); }
  function stopAll() { Object.keys(widgets).forEach(function (k) { var w = widgets[k]; if (w.api && w.ready) { try { w.api.pause(); } catch (e) {} } }); }
  function play(id) {
    var s = null; SOUNDS.forEach(function (x) { if (x.id === id) s = x; });
    if (!s) return;
    if (S.playing === id && (S.state === 'playing' || S.state === 'paused')) {
      var w0 = widgets[s.pl]; if (w0 && w0.api) { if (S.state === 'playing') w0.api.pause(); else w0.api.play(); }
      S.state = S.state === 'playing' ? 'paused' : 'playing'; paint(); return;
    }
    stopAll(); S.playing = id; S.state = 'loading'; S.err = false; S.pos = 0; S.dur = 0; paint(); say(W.play + ' ' + s.title);
    wantPlay = id;
    widget(s.pl, function (w) {
      if (wantPlay !== id) return;
      var i = w.ids.indexOf(s.track);
      if (i < 0) { fail(); return; }
      w.cur = id; w.api.skip(i); w.api.play();
    });
  }
  function step(d) { var i = 0; SOUNDS.forEach(function (x, k) { if (x.id === S.playing) i = k; }); play(SOUNDS[(i + d + SOUNDS.length) % SOUNDS.length].id); }
  function paintProgress() {
    var bars = mount.querySelectorAll('.ltw-pw i'); if (!bars.length || !S.dur) return;
    var pct = S.pos / S.dur; for (var i = 0; i < bars.length; i++) bars[i].classList.toggle('is-p', i / bars.length < pct);
  }

  /* ---------- search palette ---------- */
  function palette() {
    var q = (S.pq || '').trim().toLowerCase();
    var items = [];
    ['home', 'day', 'briefs', 'subs', 'vault', 'kits', 'mentor', 'room'].forEach(function (p) { items.push([W.pages, W.nav[p], 'go', p]); });
    BRIEFS.slice(0, 4).forEach(function (b) { items.push([W.briefsLabel, b.lane + ' · ' + b.genre + ' · ' + b.bpm, 'brief', b.id]); });
    SOUNDS.forEach(function (s) { items.push([W.soundsLabel, s.title + ' · ' + s.bpm + ' bpm', 'sound', s.id]); });
    items.push([W.modulesLabel, W.nextModule, 'go', 'mentor'], [W.modulesLabel, W.blueprint, 'go', 'mentor'], [W.modulesLabel, W.psychology, 'go', 'mentor']);
    var hits = items.filter(function (it) { return !q || it[1].toLowerCase().indexOf(q) > -1 || it[0].indexOf(q) > -1; }).slice(0, 9);
    return hits.length ? hits.map(function (it, i) { return '<button type="button" class="ltw-pal-i' + (i === 0 ? ' is-on' : '') + '" data-pal="' + it[2] + ':' + it[3] + '"><span class="ltw-dim">' + esc(it[0]) + '</span><b>' + esc(it[1]) + '</b></button>'; }).join('') : '<p class="ltw-dim ltw-empty">' + esc(W.nothingFound) + '</p>';
  }
  function openPalette() {
    closePops();
    var d = document.createElement('div'); d.className = 'ltw-pop ltw-pal'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', W.search);
    d.innerHTML = '<label class="ltw-pal-q">' + ic('find') + '<input type="search" placeholder="' + esc(W.search) + '" aria-label="' + esc(W.search) + '" data-pq></label><div class="ltw-pal-list">' + palette() + '</div>';
    mount.querySelector('.ltw-main').appendChild(d); d.querySelector('input').focus();
  }
  function openHelp() {
    closePops();
    var d = document.createElement('div'); d.className = 'ltw-pop ltw-helppop'; d.setAttribute('role', 'dialog');
    d.innerHTML = '<button type="button" class="ltw-ib ltw-pop-x" data-act="closepop" aria-label="close">' + ic('close') + '</button><p><b>' + esc(W.helpTitle) + '</b></p><p class="ltw-dim">' + esc(W.helpBody) + '</p>';
    mount.querySelector('.ltw-main').appendChild(d);
  }
  function closePops() { var p = mount.querySelectorAll('.ltw-pop'); for (var i = 0; i < p.length; i++) p[i].remove(); }

  /* ---------- render ---------- */
  var live, shellEl;
  function paint(keepScroll) {
    var sc = mount.querySelector('.ltw-scroll'), top = sc ? sc.scrollTop : 0, ae = document.activeElement, focusSel = null, caret = 0;
    if (ae && mount.contains(ae)) { ['data-vq', 'data-tempo', 'data-link', 'data-note'].forEach(function (k) { if (ae.hasAttribute(k)) focusSel = '[' + k + ']'; }); caret = ae.selectionStart || 0; }
    mount.setAttribute('data-theme', S.theme);
    shellEl.innerHTML = shell();
    var sc2 = mount.querySelector('.ltw-scroll'); if (sc2) sc2.scrollTop = keepScroll === false ? 0 : top;
    if (focusSel) { var f = mount.querySelector(focusSel); if (f) { f.focus(); try { f.setSelectionRange(caret, caret); } catch (x) {} } }
    live = mount.querySelector('[data-ltw-live]');
  }
  function say(t) { if (live) live.textContent = t; }
  function go(p, push) {
    if (p !== 'brief') S.brief = null;
    if (push !== false) { S.hist = S.hist.slice(0, S.hi + 1); S.hist.push(p === 'brief' ? 'brief:' + S.brief : p); S.hi = S.hist.length - 1; }
    S.page = p; S.drawer = false; closePops();
    if (p === 'vault') preload();
    paint(false); say(p === 'brief' ? W.briefsLabel : (W.nav[p] || p));
  }
  function openBrief(id) {
    if (S.brief !== id) S.send = { file: '', link: '', stage: 'idle' };
    S.brief = id; go('brief');
  }
  function travel(d) {
    var n = S.hi + d; if (n < 0 || n >= S.hist.length) return;
    S.hi = n; var e = S.hist[n];
    if (e.indexOf('brief:') === 0) { S.brief = e.slice(6); S.page = 'brief'; S.drawer = false; paint(false); } else go(e, false);
  }

  /* ---------- events ---------- */
  mount.addEventListener('click', function (e) {
    var t = e.target.closest('button, [data-drop]'); if (!t || !mount.contains(t)) { if (!e.target.closest('.ltw-pop')) closePops(); return; }
    if (S.tip) { S.tip = false; var tip = mount.querySelector('.ltw-tip'); if (tip) tip.remove(); }
    var a = t.getAttribute('data-act');
    if (t.hasAttribute('data-go')) return go(t.getAttribute('data-go'));
    if (t.hasAttribute('data-brief')) return openBrief(t.getAttribute('data-brief'));
    if (t.hasAttribute('data-play')) return play(t.getAttribute('data-play'));
    if (t.hasAttribute('data-lane')) { S.lane = t.getAttribute('data-lane'); return paint(); }
    if (t.hasAttribute('data-kind')) { S.kind = t.getAttribute('data-kind'); return paint(); }
    if (t.hasAttribute('data-task')) { var k = +t.getAttribute('data-task'); S.tasks[k].done = !S.tasks[k].done; return paint(); }
    if (t.hasAttribute('data-habit')) { var h = +t.getAttribute('data-habit'); S.habits[h].done = !S.habits[h].done; return paint(); }
    if (t.hasAttribute('data-sub')) { S.subOpen = t.getAttribute('data-sub'); return paint(); }
    if (t.hasAttribute('data-crate')) { var c = t.getAttribute('data-crate'); S.crate[c] = !S.crate[c]; return paint(); }
    if (t.hasAttribute('data-like')) { var l = 'l' + t.getAttribute('data-like'); S.crate[l] = !S.crate[l]; return paint(); }
    if (t.hasAttribute('data-pull')) { return say(W.pullMembers), flash(t, W.pullMembers); }
    if (t.hasAttribute('data-pal')) { var v = t.getAttribute('data-pal').split(':'); closePops(); if (v[0] === 'brief') return openBrief(v[1]); if (v[0] === 'sound') { go('vault'); return play(v[1]); } return go(v[1]); }
    switch (a) {
      case 'back': return travel(-1);
      case 'fwd': return travel(1);
      case 'theme': S.theme = S.theme === 'dark' ? 'light' : 'dark'; return paint();
      case 'drawer': S.drawer = !S.drawer; return paint();
      case 'find': return openPalette();
      case 'help': return openHelp();
      case 'closepop': return closePops();
      case 'addtask': S.adding = true; paint(); var inp = mount.querySelector('.ltw-newtask input'); if (inp) inp.focus(); return;
      case 'plan': S.planOpen = !S.planOpen; return paint();
      case 'saveplan': S.planSaved = true; return paint();
      case 'prev': return step(-1);
      case 'next': return step(1);
      case 'daysub': case 'cal': return;
    }
  });
  function names(fs) { var n = Math.min(fs.length, 10); return fs[0].name + (n > 1 ? ' + ' + (n - 1) + ' ' + W.more : ''); }
  function flash(el, text) {
    var f = document.createElement('span'); f.className = 'ltw-flash'; f.textContent = text; el.parentNode.appendChild(f);
    setTimeout(function () { f.remove(); }, 2200);
  }
  mount.addEventListener('submit', function (e) {
    var f = e.target.getAttribute('data-form'); if (!f) return; e.preventDefault();
    if (f === 'task') { var v = e.target.querySelector('input').value.trim(); if (v) S.tasks.push({ t: v, done: false }); S.adding = false; return paint(); }
    if (f === 'send') {
      if (!(S.send.file || S.send.link.trim()) || S.send.stage === 'sending') return;
      S.send.stage = 'sending'; paint();
      var b = findBrief(S.brief);
      setTimeout(function () {
        S.sent.unshift({ brief: b.id, title: b.lane + ' · ' + b.genre + ' · ' + b.bpm.split('–')[0] + ' bpm', file: S.send.file || S.send.link.replace(/^https?:\/\//, '').slice(0, 32) });
        S.send.stage = 'done'; S.subOpen = 'n0'; paint(); say(W.queued);
      }, 1400);
    }
  });
  mount.addEventListener('input', function (e) {
    var t = e.target;
    if (t.hasAttribute('data-vq')) { S.q = t.value; var r = mount.querySelector('[data-ltw-rows]'); if (r) r.innerHTML = soundRows(); return; }
    if (t.hasAttribute('data-tempo')) { t.value = t.value.replace(/\D/g, ''); S.tempo = t.value; var r2 = mount.querySelector('[data-ltw-rows]'); if (r2) r2.innerHTML = soundRows(); return; }
    if (t.hasAttribute('data-link')) { var had = !!(S.send.file || S.send.link.trim()); S.send.link = t.value; var has = !!(S.send.file || S.send.link.trim()); if (had !== has) { var sb = mount.querySelector('.ltw-submit'); if (sb) sb.disabled = !has; } return; }
    if (t.hasAttribute('data-pq')) { S.pq = t.value; var l = mount.querySelector('.ltw-pal-list'); if (l) l.innerHTML = palette(); return; }
  });
  mount.addEventListener('change', function (e) {
    var t = e.target; if (!t.hasAttribute('data-file')) return;
    var fs = t.files; if (fs && fs.length) { S.send.file = names(fs); t.value = ''; paint(); }
  });
  ['dragenter', 'dragover'].forEach(function (ev) { mount.addEventListener(ev, function (e) { var z = e.target.closest && e.target.closest('[data-drop]'); if (!z) return; e.preventDefault(); z.classList.add('is-over'); }); });
  mount.addEventListener('dragleave', function (e) { var z = e.target.closest && e.target.closest('[data-drop]'); if (z) z.classList.remove('is-over'); });
  mount.addEventListener('drop', function (e) {
    var z = e.target.closest && e.target.closest('[data-drop]'); if (!z) return; e.preventDefault();
    var fs = e.dataTransfer && e.dataTransfer.files; if (fs && fs.length) { S.send.file = names(fs); paint(); }
  });
  mount.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); openPalette(); return; }
    if (e.key === 'Escape') { if (mount.querySelector('.ltw-pop')) { closePops(); return; } if (S.drawer) { S.drawer = false; paint(); } return; }
    if (e.key === 'Enter' && e.target.hasAttribute && e.target.hasAttribute('data-pq')) { var first = mount.querySelector('.ltw-pal-i'); if (first) first.click(); }
  });
  document.addEventListener('click', function (e) { if (!mount.contains(e.target)) closePops(); });

  /* ---------- boot ---------- */
  shellEl = document.createElement('div'); shellEl.className = 'ltw-shell';
  mount.innerHTML = ''; mount.appendChild(shellEl);
  function readCount() {
    var src = document.querySelector('[data-open-briefs]:not([data-ltw-count])');
    var t = src && src.textContent.trim();
    if (t && /^\d[\d,]*\+$/.test(t) && t !== briefCount) { briefCount = t; var els = mount.querySelectorAll('[data-ltw-count]'); for (var i = 0; i < els.length; i++) els[i].textContent = t; }
  }
  paint(false);
  readCount(); setTimeout(readCount, 1500); setTimeout(readCount, 5000);
  setInterval(function () { var c = mount.querySelector('[data-ltw-clock]'); if (c) c.textContent = clock(); }, 30000);
  mount.classList.add('is-ready');
})();
