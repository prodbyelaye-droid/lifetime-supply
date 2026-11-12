/* D9 · P7/P8 · the app frame = P9's frame v1 (out/P9-shell/STATUS.md "frame:" block and work/shell.js, 13:19 AEDT).
   Markup copied from P9's shell.js so every P screen sits in the same frame; P9 owns it. Profile and referrals live in
   P9's account fold-down, so they have no sidebar row. Query: ?t=light|dark  ?o=a|b */
(function () {
  var q = new URLSearchParams(location.search);
  var H = document.documentElement;
  var dark = q.get('t') === 'dark' || (q.get('t') !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches);
  H.setAttribute('data-theme', dark ? 'dark' : 'light'); if (dark) H.classList.add('dark');
  if (innerWidth < 700) H.classList.add('phone');
  H.setAttribute('data-o', q.get('o') || 'a');
  document.body.insertAdjacentHTML('afterbegin', `<svg width="0" height="0" style="position:absolute"><defs>
<symbol id="mk" viewBox="-456 -300 912 600"><path d="M-57.732 283.449 A355 355 0 0 1 -148.880 181.861 A182 182 0 1 1 27.236 0 A127 127 0 0 0 118.383 121.301 A300 300 0 1 0 -57.732 283.449 Z"/><path d="M57.732 -283.449 A355 355 0 0 1 148.880 -181.861 A182 182 0 1 1 -27.236 0 A127 127 0 0 0 -118.383 -121.301 A300 300 0 1 0 57.732 -283.449 Z"/></symbol>
<symbol id="home" viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/></symbol>
<symbol id="clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></symbol>
<symbol id="file" viewBox="0 0 24 24"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></symbol>
<symbol id="arrow" viewBox="0 0 24 24"><path d="M7 17 17 7M8 7h9v9"/></symbol>
<symbol id="vault" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 10v10"/></symbol>
<symbol id="box" viewBox="0 0 24 24"><path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/></symbol>
<symbol id="cap" viewBox="0 0 24 24"><path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/></symbol>
<symbol id="book" viewBox="0 0 24 24"><path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/></symbol>
<symbol id="users" viewBox="0 0 24 24"><circle cx="9" cy="8" r="4"/><path d="M2 21v-1a6 6 0 0 1 12 0v1"/><path d="M16 4a4 4 0 0 1 0 8M22 21v-1a6 6 0 0 0-4-5.6"/></symbol>
<symbol id="brief" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/></symbol>
<symbol id="user" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></symbol>
<symbol id="plus" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></symbol>
<symbol id="sliders" viewBox="0 0 24 24"><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></symbol>
<symbol id="msg" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></symbol>
<symbol id="sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></symbol>
<symbol id="moon" viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></symbol>
<symbol id="out" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></symbol>
<symbol id="search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></symbol>
<symbol id="down" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></symbol>
<symbol id="left" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></symbol>
<symbol id="right" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></symbol>
<symbol id="panel" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M9 4v16"/></symbol>
<symbol id="x" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></symbol>
<symbol id="menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></symbol>
<symbol id="ok" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/></symbol>
<symbol id="ig" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></symbol>
<symbol id="yt" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3z"/></symbol>
<symbol id="xl" viewBox="0 0 24 24"><path d="M4 4l16 16M20 4 4 20"/></symbol>
<symbol id="bag" viewBox="0 0 24 24"><path d="M6 7h12l-1 13H7z"/><path d="M9 7a3 3 0 0 1 6 0"/></symbol>
<symbol id="wave" viewBox="0 0 24 24"><path d="M3 12h2M7 8v8M11 5v14M15 9v6M19 11v2"/></symbol>
</defs></svg>`);
  var I = {
    briefs: '<path d="M6 3h9l4 4v14H6z"/><path d="M9 11h7M9 15h7M9 7h3"/>',
    subs: '<path d="M7 17 17 7M9 7h8v8"/>', day: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    room: '<circle cx="9" cy="9" r="3.2"/><circle cx="16.5" cy="9.5" r="2.6"/><path d="M3.5 19c.6-3.4 3-5 5.5-5s4.9 1.6 5.5 5"/><path d="M15 14.2c2.6-.3 4.8 1.2 5.5 4.8"/>',
    profile: '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c1-4 4-5.5 7-5.5s6 1.5 7 5.5"/>',
    tuck: '<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="M9.5 4.5v15"/>',
    chev: '<path d="m9 6 6 6-6 6"/>', mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6 8.5-6"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l2 2M15 8l2 2"/>'
  };
  window.D9I = function (n, s) { return '<svg class="ic" width="' + (s || 18) + '" height="' + (s || 18) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + I[n] + '</svg>'; };
  var page = document.body.getAttribute('data-page'), crumb = document.body.getAttribute('data-crumb');
  var ic = function (n, c) { return '<svg class="' + (c || 'i') + '"><use href="#' + n + '"/></svg>'; };
  var row = function (icon, label, id, n) { return '<a class="row' + (page === id ? ' on' : '') + '">' + ic(icon) + '<span>' + label + '</span>' + (n ? '<span class="n">' + n + '</span>' : '') + '</a>'; };
  var side = '<div class="sb-head"><button class="acct" aria-haspopup="menu"><span class="p9tile"><svg><use href="#mk"/></svg></span><span class="name">lifetime supply</span>' + ic('down', 'i chev') + '</button>' +
    '<button class="tuck" aria-label="tuck the sidebar">' + ic('panel') + '</button></div><nav class="nav">' +
    row('home', 'home', 'home') + row('clock', 'your day', 'day') +
    '<div class="grp">the board</div>' + row('file', 'briefs', 'briefs', '161') + row('arrow', 'submissions', 'submissions') +
    '<div class="grp">your library</div>' + row('vault', 'vault', 'vault') + row('box', 'kits', 'kits') +
    '<div class="grp">your membership</div>' + row('cap', 'mentorship', 'mentorship') + row('book', 'guides', 'guides') + row('users', 'the room', 'room') +
    '<div class="sep"></div>' + row('brief', 'business', 'business') + '</nav>' +
    '<div class="sb-foot"><div class="news"><b>a whole new lifetime supply.</b><p>the new portal is live.</p><div class="acts"><span>dismiss</span></div></div></div>';
  var desk = !H.classList.contains('phone');
  var top = desk ? '<header class="tb"><div class="crumbs"><button class="nav-b" aria-label="back">' + ic('left') + '</button><button class="nav-b off" aria-label="forward">' + ic('right') + '</button>' + ic('home') + '<span class="slash">/</span><span class="here">' + crumb + '</span></div>' +
      '<div class="tb-r"><button class="search">' + ic('search') + '<span>search</span><kbd>⌘K</kbd></button><button class="ib" aria-label="theme">' + ic(dark ? 'sun' : 'moon') + '</button><button class="help">help</button></div></header>'
    : '<header class="tb"><div class="crumbs"><button class="ib" aria-label="menu">' + ic('menu') + '</button><span class="p9tile" style="width:26px;height:26px"><svg><use href="#mk"/></svg></span><span class="here" style="margin-left:8px">' + crumb + '</span></div><div class="tb-r" style="gap:2px"><button class="ib">' + ic('search') + '</button><button class="ib">' + ic(dark ? 'sun' : 'moon') + '</button><button class="help">help</button></div></header>';
  var main = document.getElementById('screen');
  var app = document.createElement('div'); app.className = 'app';
  app.innerHTML = '<aside class="sb">' + side + '</aside><main class="panel">' + top + '<div class="content"><div class="inner"></div></div></main>';
  main.parentNode.insertBefore(app, main);
  app.querySelector('.inner').appendChild(main);
  document.querySelectorAll('[data-ic]').forEach(function (el) { el.innerHTML = D9I(el.getAttribute('data-ic'), +el.getAttribute('data-s') || 18); });
  var o = q.get('o') || 'a';
  document.querySelectorAll('[data-only]').forEach(function (el) { if (el.getAttribute('data-only') !== o) el.remove(); });
})();
