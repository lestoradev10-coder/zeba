/* ============================================================
   GLAM AI - Glam by Zebaish virtual beauty assistant (widget)
   - Answers only from the website knowledge base (glamai-kb.js)
   - No forms: users just type, tap options or use the mic
   - Support = WhatsApp / Email / Call buttons (message pre-filled)
   - Mute / End chat / New chat in the header menu, sound on messages
   - Home, Conversation history, FAQs and Articles tabs
   - If the answer is not in the knowledge base it says it is not
     confident enough and hands over to the team
   ============================================================ */
(function () {
  'use strict';
  if (window.__glamaiLoaded) return;
  window.__glamaiLoaded = true;

  var CFG = {
    name: 'Glam AI',
    org: 'Glam by Zebaish',
    phone: '+919505777790',
    phoneShow: '+91 95057 77790',
    wa: '919505777790',
    email: 'hello@glambyzebaish.com',
    address: 'Hyderabad, Telangana — serving Hyderabad, Bangalore & Kochi',
    avatar: '',
    max: { convs: 25, msgs: 80 }
  };
  var LS = { convs: 'glamai.convs.v1', cur: 'glamai.current.v1', mute: 'glamai.mute.v1' };
  var BASE = (function () {
    var s = document.currentScript || document.querySelector('script[src*="glamai.js"]');
    return s && s.src ? s.src.replace(/[^\/]*(\?.*)?$/, '') : '';
  })();

  CFG.avatar = BASE + '../images/glam-ai-avatar.webp';
  CFG.empty = BASE + '../images/glam-ai-empty.webp';

  /* ---------------- conversational booking form ---------------- */
  function opt(list) { return list.map(function (x) { return Array.isArray(x) ? { v: x[0], l: x[1] } : { v: x, l: x }; }); }
  var OPT = { city: opt(['Hyderabad', 'Bangalore', 'Kochi']), pkg: [] };
  var FLOWS = {
    booking: {
      name: 'Booking / Consultation Request', done: 'Your booking request is ready.',
      intro: 'Lovely! I’ll note a few details so our team can confirm your booking — it takes about a minute. For optional questions you can tap Skip, and you can Cancel at any time.',
      fields: [
        { k: 'name', l: 'Full Name', q: 'May I know your full name?', t: 'text', req: 1, ph: 'Your full name' },
        { k: 'phone', l: 'Mobile Number', q: 'Please share your 10-digit mobile number so our team can reach you.', t: 'phone', req: 1, sec: 1, ph: '10-digit mobile number' },
        { k: 'city', l: 'City', q: 'Which city is the event in? (We currently serve Hyderabad, Bangalore and Kochi.)', t: 'select', o: 'city', req: 1 },
        { k: 'package', l: 'Package', q: 'Which package are you interested in?', t: 'select', o: 'pkg', req: 1 },
        { k: 'event_date', l: 'Event Date', q: 'What is your event date? (e.g. 15 Dec, 15/12/2026 or Tomorrow)', t: 'date', req: 0, ph: 'e.g. 15 Dec (optional)', quick: ['Tomorrow'] },
        { k: 'people', l: 'People needing makeup', q: 'How many people need makeup? (e.g. 1 bride + 3 family members)', t: 'text', req: 0, ph: 'Optional' },
        { k: 'notes', l: 'Notes', q: 'Any look, saree colour or special request you’d like us to know about?', t: 'text', req: 0, long: 1, ph: 'Optional notes' }
      ]
    }
  };

  /* ---------------- helpers ---------------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k)); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }
  function uid() { return 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function ago(ts) {
    var d = (Date.now() - ts) / 1000;
    if (d < 60) return 'Just now';
    if (d < 3600) return Math.floor(d / 60) + ' min ago';
    if (d < 86400) return Math.floor(d / 3600) + ' hr ago';
    if (d < 172800) return 'Yesterday';
    return new Date(ts).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
  }
  function clip(s, n) { s = String(s || '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1).trim() + '…' : s; }
  function pageHref(p) { return p; }

  var IC = {
    back: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    close: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    dots: '<svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="19" r="2" fill="currentColor"/></svg>',
    send: '<svg viewBox="0 0 24 24"><path d="M3.4 20.4l17.1-7.4a1 1 0 000-1.8L3.4 3.6a1 1 0 00-1.4 1.2L4 11l9 1-9 1-2 6.2a1 1 0 001.4 1.2z" fill="currentColor"/></svg>',
    mic: '<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M5 11a7 7 0 0014 0M12 18v3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    mute: '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M17 9l5 6M22 9l-5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    sound: '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    power: '<svg viewBox="0 0 24 24"><path d="M12 3v9M6.3 7.3a8 8 0 1011.4 0" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    home: '<svg viewBox="0 0 24 24"><path d="M3 11l9-8 9 8v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9z" fill="currentColor"/></svg>',
    chat: '<svg viewBox="0 0 24 24"><path d="M4 4h16a1 1 0 011 1v11a1 1 0 01-1 1H9l-5 4V5a1 1 0 011-1z" fill="currentColor"/></svg>',
    faq: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9.5 9.5a2.5 2.5 0 114 2c-.9.6-1.5 1-1.5 2M12 17h.01" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    article: '<svg viewBox="0 0 24 24"><path d="M6 3h9l4 4v14H6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 12h7M9 16h7M9 8h3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    wa: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm5.2 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 .9-2.3c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.4.1.6-.1l.8-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.8-.2 1.5z"/></svg>',
    mail: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3.5 6.5L12 13l8.5-6.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    call: '<svg viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" fill="currentColor"/></svg>',
    bubble: '<svg viewBox="0 0 24 24"><path d="M5 3.5h14A2.5 2.5 0 0121.5 6v9.2a2.5 2.5 0 01-2.5 2.5h-7.2l-4.6 3.6a.6.6 0 01-1-.5v-3.1H5A2.5 2.5 0 012.5 15.2V6A2.5 2.5 0 015 3.5z" fill="currentColor"/><circle cx="8.2" cy="10.6" r="1.25" fill="#4a1766"/><circle cx="12" cy="10.6" r="1.25" fill="#4a1766"/><circle cx="15.8" cy="10.6" r="1.25" fill="#4a1766"/></svg>',
    bot: '<svg viewBox="0 0 24 24"><rect x="4" y="8" width="16" height="11" rx="4" fill="currentColor"/><circle cx="9" cy="13.5" r="1.4" fill="#4a1766"/><circle cx="15" cy="13.5" r="1.4" fill="#4a1766"/><path d="M12 8V5M10 5h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    chev: '<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    ext: '<svg viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  /* ---------------- sound ---------------- */
  var actx = null, muted = !!store(LS.mute);
  function audio() {
    if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { actx = false; } }
    if (actx && actx.state === 'suspended') { try { actx.resume(); } catch (e) {} }
    return actx;
  }
  function tone(freq, start, dur, vol) {
    var c = audio(); if (!c) return;
    var o = c.createOscillator(), g = c.createGain(), t = c.currentTime + start;
    o.type = 'sine'; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + 0.02);
  }
  function sound(kind) {
    if (muted) return;
    try {
      if (kind === 'send') { tone(620, 0, 0.09, 0.05); }
      else if (kind === 'recv') { tone(880, 0, 0.1, 0.06); tone(1175, 0.09, 0.14, 0.05); }
      else if (kind === 'mic') { tone(740, 0, 0.08, 0.05); }
    } catch (e) {}
  }

  /* ---------------- state ---------------- */
  var KB = null, kbLoading = false, kbWaiters = [];
  var S = { open: false, view: 'home', convs: store(LS.convs) || [], cur: store(LS.cur) || null, menuOpen: false, busy: false, listening: false, rec: null, flow: null, typer: null, greeted: {} };
  var R = {}; // dom refs

  function conv() { for (var i = 0; i < S.convs.length; i++) if (S.convs[i].id === S.cur) return S.convs[i]; return null; }
  function save() {
    S.convs.sort(function (a, b) { return b.updated - a.updated; });
    S.convs = S.convs.slice(0, CFG.max.convs);
    store(LS.convs, maskConvs(S.convs)); store(LS.cur, S.cur);
  }
  function newConv() {
    var c = { id: uid(), title: 'New chat', created: Date.now(), updated: Date.now(), ended: false, ctx: { menu: null }, msgs: [] };
    S.convs.unshift(c); S.cur = c.id; S.flow = null; save(); return c;
  }

  function loadKB(cb) {
    if (KB) return cb();
    kbWaiters.push(cb);
    if (kbLoading) return;
    kbLoading = true;
    var s = document.createElement('script');
    s.charset = 'utf-8'; s.src = BASE + 'glamai-kb.js?v=2';
    s.onload = function () { KB = window.GLAMAI_KB; if (window.GlamAIEngine) window.GlamAIEngine.init(KB); kbWaiters.splice(0).forEach(function (f) { f(); }); };
    s.onerror = function () { kbLoading = false; KB = { chunks: [], programs: [], partners: [], articles: [] }; if (window.GlamAIEngine) window.GlamAIEngine.init(KB); kbWaiters.splice(0).forEach(function (f) { f(); }); };
    document.head.appendChild(s);
  }

  /* ---------------- UI skeleton ---------------- */
  function build() {
    var root = el('div'); root.id = 'gai-root';
    root.innerHTML =
      '<button type="button" id="gai-launch" aria-label="Chat with ' + CFG.name + '" title="Chat with ' + CFG.name + '">' + IC.bubble + '<i class="gai-dot"></i></button>' +
      '<section id="gai-panel" role="dialog" aria-label="' + CFG.name + ' chat" aria-hidden="true">' +
        '<header id="gai-head"></header>' +
        '<main id="gai-body"></main>' +
        '<nav id="gai-tabs" aria-label="Sections"></nav>' +
      '</section>';
    document.body.appendChild(root);
    R.root = root; R.launch = $('#gai-launch'); R.panel = $('#gai-panel'); R.head = $('#gai-head'); R.body = $('#gai-body'); R.tabs = $('#gai-tabs');
    R.launch.addEventListener('click', function () { open(); });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || !S.open) return;
      if (S.menuOpen) toggleMenu(false); else close();
    });
    document.addEventListener('click', function (e) {
      if (S.menuOpen && !e.target.closest('.gai-menu') && !e.target.closest('[data-act="menu"]')) toggleMenu(false);
    });
    if (window.visualViewport) {
      var vv = function () { if (S.open) R.panel.style.setProperty('--gai-vh', window.visualViewport.height + 'px'); };
      window.visualViewport.addEventListener('resize', vv); window.visualViewport.addEventListener('scroll', vv);
    }
  }

  function open(view) {
    S.open = true;
    R.root.classList.add('gai-open');
    R.panel.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('gai-lock');
    audio();
    loadKB(function () {});
    go(view || S.view || 'home');
  }
  function close() {
    S.open = false; stopMic();
    toggleMenu(false);
    R.root.classList.remove('gai-open');
    R.panel.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('gai-lock');
  }

  function tabs() {
    var items = [['home', 'Home', IC.home], ['convs', 'Conversation', IC.chat], ['faqs', 'FAQs', IC.faq], ['articles', 'Articles', IC.article]];
    R.tabs.innerHTML = items.map(function (t) {
      return '<button type="button" data-view="' + t[0] + '" class="' + (S.view === t[0] ? 'on' : '') + '">' + t[2] + '<span>' + t[1] + '</span></button>';
    }).join('');
    $$('button', R.tabs).forEach(function (b) { b.onclick = function () { go(b.getAttribute('data-view')); }; });
  }

  function go(view) {
    S.view = view; toggleMenu(false);
    R.panel.setAttribute('data-view', view);
    if (view !== 'chat') stopMic();
    ({ home: viewHome, chat: viewChat, convs: viewConvs, faqs: viewFaqs, articles: viewArticles }[view] || viewHome)();
    if (view !== 'chat') tabs();
  }

  function headSimple(title, sub) {
    R.head.className = 'gai-head-simple';
    R.head.innerHTML = '<div class="gai-hl"><div class="gai-title">' + esc(title) + '</div>' + (sub ? '<div class="gai-sub">' + esc(sub) + '</div>' : '') + '</div>' +
      '<button type="button" class="gai-ic" data-act="close" aria-label="Close chat">' + IC.close + '</button>';
    $('[data-act="close"]', R.head).onclick = close;
  }

  /* ---------------- HOME ---------------- */
  function viewHome() {
    R.head.className = 'gai-head-home';
    R.head.innerHTML = '<div class="gai-hl"><div class="gai-brand"><span class="gai-av gai-av-lg"><img src="' + CFG.avatar + '" alt="" onerror="this.style.display=\'none\'"><i class="gai-dot"></i></span>' + CFG.name + '</div>' +
      '<div class="gai-hello">Hi there! 👋<br>How can we help you today?</div></div>' +
      '<button type="button" class="gai-ic" data-act="close" aria-label="Close chat">' + IC.close + '</button>';
    $('[data-act="close"]', R.head).onclick = close;
    var last = S.convs[0];
    var html = '<div class="gai-home">';
    if (last && last.msgs.length) {
      var lb = null; for (var i = last.msgs.length - 1; i >= 0; i--) { if (last.msgs[i].t) { lb = last.msgs[i]; break; } }
      html += '<button type="button" class="gai-card gai-recent" data-open="' + last.id + '"><span class="gai-av"><img src="' + CFG.avatar + '" alt="" onerror="this.style.display=\'none\'"></span>' +
        '<span class="gai-ct"><b>' + CFG.name + '</b><em>' + esc(clip(lb ? lb.t : '', 60)) + '</em></span><span class="gai-meta">' + ago(last.updated) + '</span></button>';
    }
    html += '<button type="button" class="gai-card gai-start" data-act="new"><span class="gai-ct"><b>Start a new chat</b><em>Ask about packages, pricing, bridal looks or booking</em></span><span class="gai-go">' + IC.chev + '</span></button>';
    html += '<div class="gai-sect">Popular topics</div><div class="gai-topics">';
    [['Our Packages', 'menu:1'], ['Book a Consultation', 'menu:2'], ['Pricing', 'menu:3'], ['Bridal Makeup', 'menu:4'], ['Groom Styling', 'menu:5'], ['Contact Us', 'menu:9']].forEach(function (t) {
      html += '<button type="button" class="gai-topic" data-topic="' + t[1] + '">' + esc(t[0]) + '</button>';
    });
    html += '</div></div>';
    R.body.innerHTML = html;
    var rec = $('[data-open]', R.body); if (rec) rec.onclick = function () { S.cur = rec.getAttribute('data-open'); save(); go('chat'); };
    $('[data-act="new"]', R.body).onclick = function () { startFresh(); };
    $$('.gai-topic', R.body).forEach(function (b) {
      b.onclick = function () { var n = b.getAttribute('data-topic').split(':')[1]; startFresh(function () { menuSelect(n, true); }); };
    });
  }

  function startFresh(after) {
    var c = conv();
    if (!c || c.ended || c.msgs.length > 0) c = newConv();
    go('chat');
    loadKB(function () {
      if (!c.msgs.length) greet(c);
      if (after) after();
    });
  }

  /* ---------------- CONVERSATIONS ---------------- */
  function viewConvs() {
    headSimple('Conversations', 'Your previous chats with ' + CFG.name);
    var list = S.convs.filter(function (c) { return c.msgs.length; });
    var newBtn = '<button type="button" class="gai-btn gai-btn-primary gai-full" data-act="new">' + IC.plus + ' New conversation</button>';
    var html = '<div class="gai-pad">';
    if (!list.length) html += '<div class="gai-noconv"><img src="' + CFG.empty + '" alt="" onerror="this.style.display=\'none\'"><p>No ongoing conversation</p>' + newBtn + '</div>';
    else {
      html += newBtn;
      html += '<div class="gai-list">';
      list.forEach(function (c) {
        var lb = null; for (var i = c.msgs.length - 1; i >= 0; i--) { if (c.msgs[i].t) { lb = c.msgs[i]; break; } }
        html += '<button type="button" class="gai-row" data-open="' + c.id + '"><span class="gai-av"><img src="' + CFG.avatar + '" alt="" onerror="this.style.display=\'none\'"></span>' +
          '<span class="gai-ct"><b>' + esc(clip(c.title, 42)) + '</b><em>' + esc(clip(lb ? lb.t : '', 56)) + '</em></span>' +
          '<span class="gai-meta">' + ago(c.updated) + (c.ended ? '<br><i>Ended</i>' : '') + '</span></button>';
      });
      html += '</div><button type="button" class="gai-link" data-act="clear">Clear all conversations</button>';
    }
    html += '</div>';
    R.body.innerHTML = html;
    $('[data-act="new"]', R.body).onclick = function () { newConv(); startFresh(); };
    $$('[data-open]', R.body).forEach(function (b) { b.onclick = function () { S.cur = b.getAttribute('data-open'); save(); go('chat'); }; });
    var cl = $('[data-act="clear"]', R.body);
    if (cl) cl.onclick = function () { if (confirm('Delete all saved conversations on this device?')) { S.convs = []; S.cur = null; save(); viewConvs(); } };
  }

  /* ---------------- FAQS ---------------- */
  function viewFaqs() {
    headSimple('FAQs', 'Tap a question to get the answer');
    R.body.innerHTML = '<div class="gai-pad"><input type="search" class="gai-search" placeholder="Search FAQs…" aria-label="Search FAQs"><div class="gai-list" id="gai-faqlist"><div class="gai-empty">Loading…</div></div></div>';
    loadKB(function () {
      var faqs = window.GlamAIEngine.faqList(), box = $('#gai-faqlist', R.body), inp = $('.gai-search', R.body);
      function paint(q) {
        q = (q || '').toLowerCase().trim();
        var rows = faqs.filter(function (f) { return !q || f.h.toLowerCase().indexOf(q) > -1 || f.x.toLowerCase().indexOf(q) > -1; });
        box.innerHTML = rows.length ? rows.map(function (f, i) { return '<button type="button" class="gai-row gai-faq" data-i="' + faqs.indexOf(f) + '"><span class="gai-ct"><b>' + esc(f.h) + '</b></span><span class="gai-go">' + IC.chev + '</span></button>'; }).join('') : '<div class="gai-empty">No matching questions. Try the chat – just ask in your own words.</div>';
        $$('.gai-faq', box).forEach(function (b) { b.onclick = function () { askFromList(faqs[+b.getAttribute('data-i')].h); }; });
      }
      paint(''); inp.oninput = function () { paint(inp.value); };
    });
  }
  function askFromList(q) {
    var c = conv();
    if (!c || c.ended) c = newConv();
    go('chat');
    loadKB(function () { if (!c.msgs.length) { greet(c, true); } userSay(q); });
  }

  /* ---------------- ARTICLES ---------------- */
  function viewArticles() {
    headSimple('Articles', 'Tips from the Glam by Zebaish blog');
    R.body.innerHTML = '<div class="gai-pad"><div class="gai-list" id="gai-artlist"><div class="gai-empty">Loading…</div></div><a class="gai-link" href="index.html#blog">View all articles ' + IC.ext + '</a></div>';
    loadKB(function () {
      var arts = (KB && KB.articles) || [];
      $('#gai-artlist', R.body).innerHTML = arts.length ? arts.map(function (a) {
        return '<a class="gai-row gai-art" href="' + esc(pageHref(a.u)) + '"' + (/^https?:/.test(a.u) ? ' target="_blank" rel="noopener noreferrer"' : '') + '><span class="gai-ct"><b>' + esc(a.t) + '</b><em>' + esc(clip(a.d, 90)) + '</em></span><span class="gai-go">' + IC.ext + '</span></a>';
      }).join('') : '<div class="gai-empty">No articles available right now.</div>';
    });
  }

  /* ---------------- CHAT VIEW ---------------- */
  function viewChat() {
    var c = conv(); if (!c) c = newConv();
    R.head.className = 'gai-head-chat';
    R.head.innerHTML =
      '<button type="button" class="gai-ic" data-act="back" aria-label="Back">' + IC.back + '</button>' +
      '<span class="gai-av gai-av-lg"><img src="' + CFG.avatar + '" alt="" onerror="this.style.display=\'none\'"><i class="gai-dot"></i></span>' +
      '<div class="gai-hl"><div class="gai-title">' + CFG.name + '</div><div class="gai-sub gai-caps">GLAM BY ZEBAISH</div></div>' +
      '<span class="gai-pill"><i></i>AI ONLINE</span>' +
      '<button type="button" class="gai-ic" data-act="menu" aria-label="More actions" aria-haspopup="true">' + IC.dots + '</button>' +
      '<div class="gai-menu" role="menu" hidden></div>';
    $('[data-act="back"]', R.head).onclick = function () { go('home'); };
    $('[data-act="menu"]', R.head).onclick = function (e) { e.stopPropagation(); toggleMenu(); };
    buildMenu();

    R.body.innerHTML =
      '<div class="gai-msgs" id="gai-msgs" aria-live="polite"></div>' +
      '<div class="gai-ended" id="gai-ended" hidden>This chat has ended. <button type="button" data-act="new">Start a new chat</button></div>' +
      '<form class="gai-input" id="gai-form" autocomplete="off">' +
        '<button type="button" class="gai-mic" id="gai-mic" aria-label="Speak your question" title="Speak your question">' + IC.mic + '</button>' +
        '<input type="text" id="gai-field" placeholder="Type or tap the mic to speak…" enterkeyhint="send" maxlength="1000" aria-label="Type your message">' +
        '<button type="submit" class="gai-sendbtn" aria-label="Send">' + IC.send + '</button>' +
      '</form>';
    R.msgs = $('#gai-msgs'); R.field = $('#gai-field'); R.form = $('#gai-form'); R.mic = $('#gai-mic'); R.ended = $('#gai-ended');
    R.form.onsubmit = function (e) { e.preventDefault(); var v = R.field.value.trim(); if (!v) return; R.field.value = ''; userSay(v); };
    $('[data-act="new"]', R.ended).onclick = function () { newConv(); go('chat'); loadKB(function () { greet(conv()); }); };
    setupMic();
    setField(S.flow && S.flow.cur ? S.flow.cur : null);
    R.tabs.innerHTML = '';
    c.msgs.forEach(function (m, i) { renderMsg(m, i === c.msgs.length - 1, false); });
    setEnded(c.ended);
    if (!c.msgs.length) loadKB(function () { if (!c.msgs.length) greet(c); });
    scrollDown(true);
    if (!('ontouchstart' in window) && !c.ended) setTimeout(function () { R.field && R.field.focus(); }, 60);
  }

  function setEnded(on) {
    if (!R.ended) return;
    R.ended.hidden = !on; R.form.hidden = !!on;
  }

  function buildMenu() {
    var m = $('.gai-menu', R.head); if (!m) return;
    m.innerHTML =
      '<button type="button" role="menuitem" data-m="mute">' + (muted ? IC.sound : IC.mute) + '<span>' + (muted ? 'Unmute' : 'Mute') + '</span></button>' +
      '<button type="button" role="menuitem" data-m="new">' + IC.plus + '<span>New chat</span></button>' +
      '<button type="button" role="menuitem" data-m="end">' + IC.power + '<span>End chat</span></button>';
    m.onclick = function (e) {
      var b = e.target.closest('[data-m]'); if (!b) return;
      var a = b.getAttribute('data-m'); toggleMenu(false);
      if (a === 'mute') { muted = !muted; store(LS.mute, muted); buildMenu(); toast(muted ? 'Sound muted' : 'Sound on'); if (!muted) sound('recv'); }
      else if (a === 'new') { newConv(); go('chat'); loadKB(function () { greet(conv()); }); }
      else if (a === 'end') { endChat(); }
    };
  }
  function toggleMenu(on) {
    var m = $('.gai-menu', R.head); if (!m) { S.menuOpen = false; return; }
    S.menuOpen = on === undefined ? !S.menuOpen : !!on;
    m.hidden = !S.menuOpen;
  }
  function toast(t) {
    var n = el('div', 'gai-toast', esc(t)); R.panel.appendChild(n);
    setTimeout(function () { n.classList.add('out'); setTimeout(function () { n.remove(); }, 300); }, 1800);
  }
  function scrollDown(now) {
    if (!R.msgs) return;
    var go = function () { R.msgs.scrollTo ? R.msgs.scrollTo({ top: R.msgs.scrollHeight, behavior: now ? 'auto' : 'smooth' }) : (R.msgs.scrollTop = R.msgs.scrollHeight); };
    go(); setTimeout(go, 60);
  }

  /* ---------------- messages ---------------- */
  function maskConvs(list) {
    return list.map(function (c) {
      var cc = {}; for (var k in c) cc[k] = c[k];
      cc.msgs = c.msgs.map(function (m) { if (!m.sec) return m; var x = {}; for (var k in m) x[k] = m[k]; x.t = '••••••••'; return x; });
      return cc;
    });
  }

  function addMsg(m, animate, done) {
    var c = conv(); if (!c) { if (done) done(); return; }
    m.ts = Date.now();
    c.msgs.push(m);
    if (c.msgs.length > CFG.max.msgs) c.msgs.splice(0, c.msgs.length - CFG.max.msgs);
    c.updated = Date.now();
    if (m.r === 'u' && c.title === 'New chat' && !m.sec) c.title = clip(m.t, 40);
    save();
    if (m.r === 'b') sound('recv'); else sound('send');
    if (R.msgs && S.view === 'chat') {
      $$('.gai-chips', R.msgs).forEach(function (n) { n.remove(); });
      renderMsg(m, true, animate !== false, done);
    } else if (done) done();
  }

  function typeText(node, text, cb) {
    finishTyper();
    var i = 0, n = text.length, step = Math.max(1, Math.ceil(n / 80)), timer, fin = false;
    function done() { if (fin) return; fin = true; clearInterval(timer); node.textContent = text; S.typer = null; cb(); }
    S.typer = { finish: done };
    timer = setInterval(function () {
      i += step;
      if (i >= n) { done(); return; }
      node.textContent = text.slice(0, i);
      scrollDown(true);
    }, 24);
  }
  function finishTyper() { if (S.typer) { var f = S.typer.finish; S.typer = null; f(); } }

  function renderMsg(m, isLast, animate, done) {
    var row = el('div', 'gai-m ' + (m.r === 'u' ? 'gai-u' : 'gai-b') + (animate ? ' gai-in' : ''));
    if (m.r === 'b') row.appendChild(el('span', 'gai-av gai-av-sm', '<img src="' + CFG.avatar + '" alt="" onerror="this.style.display=\'none\'">'));
    var col = el('div', 'gai-mc'), tx = null;
    if (m.t || m.h) {
      var b = el('div', 'gai-bubble' + (m.big ? ' gai-big' : ''));
      if (m.h) b.appendChild(el('div', 'gai-bh', esc(m.h)));
      if (m.t) { tx = el('div', 'gai-tx'); b.appendChild(tx); }
      col.appendChild(b);
    }
    row.appendChild(col);
    R.msgs.appendChild(row);
    function tail() {
      if (m.actions && m.actions.length) {
        var ac = el('div', 'gai-actions');
        m.actions.forEach(function (a) { ac.appendChild(actionEl(a)); });
        col.appendChild(ac);
      }
      if (m.r === 'b' && m.ts) col.appendChild(el('div', 'gai-time', new Date(m.ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })));
      if (isLast && m.chips && m.chips.length) {
        var cw = el('div', 'gai-chips' + (m.chipStyle === 'list' ? ' gai-list-chips' : ''));
        m.chips.forEach(function (ch) { cw.appendChild(chipEl(ch)); });
        R.msgs.appendChild(cw);
      }
      scrollDown();
      if (done) done();
    }
    if (tx) {
      if (animate && m.r === 'b') typeText(tx, m.t, tail); else { tx.textContent = m.t; tail(); }
    } else tail();
  }

  function actionEl(a) {
    var n = el('a', 'gai-act gai-act-' + a.k, (a.k === 'wa' ? IC.wa : a.k === 'mail' ? IC.mail : a.k === 'call' ? IC.call : IC.ext) + '<span>' + esc(a.l) + '</span>');
    n.href = a.u;
    if (/^https?:/.test(a.u)) { n.target = '_blank'; n.rel = 'noopener noreferrer'; }
    return n;
  }
  function chipEl(ch) {
    var n;
    if (ch.a === 'link') { n = el('a', 'gai-chip'); n.href = ch.v; n.innerHTML = esc(ch.l) + ' ' + IC.ext; return n; }
    n = el('button', 'gai-chip' + (ch.n ? ' gai-num' : '') + (ch.g ? ' gai-ghost' : ''));
    n.type = 'button';
    n.innerHTML = (ch.n ? '<b>' + esc(ch.n) + '</b>' : '') + '<span>' + esc(ch.l) + '</span>';
    n.onclick = function () { onChip(ch); };
    return n;
  }

  /* ---------------- bot output queue (typing dots + typewriter, one message at a time) ---------------- */
  var outQ = [], draining = false, drainTok = 0;
  function typing(on) {
    $$('.gai-typing', R.msgs || document).forEach(function (n) { n.remove(); });
    if (on && R.msgs && S.view === 'chat') {
      var t = el('div', 'gai-m gai-b gai-typing', '<span class="gai-av gai-av-sm"><img src="' + CFG.avatar + '" alt="" onerror="this.style.display=\'none\'"></span><div class="gai-bubble gai-dots"><i></i><i></i><i></i></div>');
      R.msgs.appendChild(t); scrollDown();
    }
  }
  function say(m) { m.r = 'b'; outQ.push(m); if (!draining) { draining = true; drain(true); } }
  function drain(first) {
    var tok = drainTok, m = outQ.shift();
    if (!m) { draining = false; typing(false); return; }
    typing(true);
    setTimeout(function () {
      if (tok !== drainTok) return;
      typing(false);
      addMsg(m, true, function () { if (tok === drainTok) setTimeout(function () { if (tok === drainTok) drain(false); }, 220); });
    }, first ? 600 + Math.random() * 300 : 380 + Math.random() * 220);
  }
  function flushOut() {
    drainTok++; finishTyper(); typing(false);
    draining = false;
    var rest = outQ.splice(0);
    rest.forEach(function (m) { addMsg(m, false); });
  }
  function reply(fn) { try { fn(); } catch (e) { if (window.console) console.error(e); } }

  function lastUserQuestion() {
    var c = conv(); if (!c) return '';
    for (var i = c.msgs.length - 1; i >= 0; i--) if (c.msgs[i].r === 'u' && !c.msgs[i].sec && !/^(main menu|talk to support|skip|cancel|\d+\.\s)/i.test(c.msgs[i].t) && c.msgs[i].t.length > 3) return c.msgs[i].t;
    return '';
  }

  /* ---------------- chip actions ---------------- */
  function onChip(ch) {
    var c = conv(); if (!c) return;
    if (c.ended && ch.a !== 'rate' && ch.a !== 'new') return;
    flushOut();
    if (ch.a === 'send') userSay(ch.v);
    else if (ch.a === 'menu') { addMsg({ r: 'u', t: ch.n ? ch.n + '. ' + ch.l : ch.l }); reply(function () { menuSelect(ch.v); }); }
    else if (ch.a === 'prog') { addMsg({ r: 'u', t: ch.l }); reply(function () { programDetail(+ch.v); }); }
    else if (ch.a === 'home') { addMsg({ r: 'u', t: 'Main menu' }); S.flow = null; reply(function () { showMenu(); }); }
    else if (ch.a === 'support') { addMsg({ r: 'u', t: 'Talk to support' }); reply(function () { supportCard(lastUserQuestion()); }); }
    else if (ch.a === 'more') { addMsg({ r: 'u', t: 'Show more' }); reply(showMore); }
    else if (ch.a === 'flow') { addMsg({ r: 'u', t: ch.l.replace(/^[^\w]+/, '') }); reply(function () { startFlow(ch.v); }); }
    else if (ch.a === 'fopt') { addMsg({ r: 'u', t: ch.l, sec: ch.sec }); reply(function () { flowAnswer(ch.v, ch.l); }); }
    else if (ch.a === 'fskip') { addMsg({ r: 'u', t: 'Skip' }); reply(function () { flowAnswer('', ''); }); }
    else if (ch.a === 'fcancel') { addMsg({ r: 'u', t: 'Cancel' }); reply(cancelFlow); }
    else if (ch.a === 'fsubmit') { addMsg({ r: 'u', t: 'Send my request' }); reply(submitFlow); }
    else if (ch.a === 'fedit') { addMsg({ r: 'u', t: 'Change a detail' }); reply(editList); }
    else if (ch.a === 'feditkey') { addMsg({ r: 'u', t: ch.l }); reply(function () { askField(+ch.v, true); }); }
    else if (ch.a === 'end') { endChat(); }
    else if (ch.a === 'new') { newConv(); go('chat'); loadKB(function () { greet(conv()); }); }
    else if (ch.a === 'rate') { rate(ch.v); }
  }

  /* ---------------- menus & intents ---------------- */
  var MENU = [
    ['1', 'Our Packages'], ['2', 'Book a Consultation'], ['3', 'Pricing'], ['4', 'Bridal Makeup'], ['5', 'Groom & Party Looks'],
    ['6', 'How Booking Works'], ['7', 'Cities & Travel'], ['8', 'Join as a Makeup Artist'], ['9', 'Contact & Support']
  ];
  function menuChips() { return MENU.map(function (m) { return { a: 'menu', v: m[0], n: m[0], l: m[1] }; }); }
  function tailChips(extra) {
    var c = (extra || []).slice();
    c.push({ a: 'home', l: 'Main menu' }); c.push({ a: 'support', l: 'Talk to support' });
    return c;
  }

  function greet(c, quiet) {
    if (!c || c.msgs.length || S.greeted[c.id]) return;
    S.greeted[c.id] = 1;
    c.ctx = { menu: 'main' };
    say({ t: 'Hello! I’m Glam AI.', big: true });
    say({ t: 'Your beauty assistant at Glam by Zebaish. How can I help you today?' });
    say({ t: 'Ask me anything about bridal, party or groom makeup, packages, pricing or booking...' });
    if (!quiet) say({ t: 'Please choose an option below (tap it or type its number), or type your question:', chips: menuChips(), chipStyle: 'list' });
  }
  function showMenu() {
    var c = conv(); if (c) c.ctx = { menu: 'main' };
    say({ t: 'Here are the main topics. Choose an option or type your question:', chips: menuChips(), chipStyle: 'list' });
  }
  function showMenuWithHello() {
    var c = conv(); if (c) c.ctx = { menu: 'main' };
    say({ t: 'Hello! 👋 Welcome to Glam by Zebaish. These are the topics I can help with — choose an option or type your question:', chips: menuChips(), chipStyle: 'list' });
  }

  function userSay(text) {
    var c = conv(); if (!c || c.ended) return;
    text = String(text).replace(/\s+/g, ' ').trim(); if (!text) return;
    flushOut();
    var sec = !!(S.flow && S.flow.cur && S.flow.cur.sec);
    addMsg({ r: 'u', t: text, sec: sec });
    loadKB(function () { reply(function () { respond(text); }); });
  }

  var RE = {
    bye: /^(bye+|good ?bye|see you|see ya|end( the)?( chat| conversation)?|exit chat|close chat|that'?s all|nothing( else)?|no(,)? thanks?( you)?|no thank you|i'?m (done|good))\b/,
    thanks: /^(thanks?|thank you|thankyou|thx|ty|ok(ay)? thanks?|great|awesome|nice|cool|got it|perfect)\b/,
    greet: /^(hi+|hello+|hey+|hii+|hola|namaste|salaam|good (morning|afternoon|evening|day)|start)\b/,
    menu: /^(menu|main menu|options|help|home|show (me )?(the )?(menu|options)|what can you do)\b/,
    human: /\b(human|real person|live agent|agent|customer (care|support|service)|talk to (a |an |the )?(someone|person|team|support|staff|artist|zeba)|speak (to|with) (a |an |the )?(someone|person|team|support|staff|artist|zeba))\b/,
    contact: /\b(contact( details| us| number| info)?|phone( number)?|mobile( number)?|call you|email( id| address)?|e-?mail you|whatsapp|address|location|located|where (are|is) (you|glam)|reach you|how (can|do) i reach)\b/,
    about: /^(what( is|'s) (glam( by zeba(ish)?)?|glam ai)|who (are|is) (you|zeba(ish)?|glam( by zeba(ish)?)?)|tell me about (glam( by zeba(ish)?)?|yourself|the company|your company)|about (glam|us|the company))\b/,
    programs: /^((our|all|your|the) )*(packages?|services|price list|package list|list of (all )?(packages?|services)|view (all )?packages?)\??$|^(list|show|view|see|tell me|give me)( me)?( all| the| your| our| of)* (packages?|services)\b|^(what|which) (packages?|services) (do you|are|does|you)\b|^(what|which) (are )?(your|the|all)( the)? (packages?|services)\b|^what (do|can) you (offer|provide|do)\??$/,
    cancel: /^(cancel|stop|exit|quit|abort|never ?mind|forget it|not now|no thanks?)$/,
    skip: /^(skip|pass|na|n\/a|none|no|nil|-)$/,
    back: /^(back|previous|go back|undo)$/
  };
  var FR = {
    booking: /\b(book|booking|bookings|appointment|reserve|consult\w*|schedule|quote|enquiry|inquiry|enquire|call back|callback|call me|get in touch)\b/
  };
  var INFO_START = /^(what|how|why|who|which|when|where|is|are|do|does|did|can|could|will|would|tell me|explain|list|show|about|give me)\b/;
  var ACTION = /\b(i want|i need|i would like|i'd like|i am interested|i'm interested|interested in|help me|book|schedule|reserve|enquire|enquiry|inquiry|call me|callback|call back|get in touch)\b/;
  var INFO_WORD = /\b(fees?|cost|price|prices|pricing|charges?|rates?|process|documents?|polic(y|ies)|offers?|timings?|hours|how|what|why|benefits?|details|about|include[sd]?|included|brands?|products?|trial)\b/;
  function flowIntent(t) {
    var w = t.split(' ').length, info = INFO_START.test(t) || (INFO_WORD.test(t) && !ACTION.test(t)), act = ACTION.test(t);
    var go = act || (!info && w <= 5);
    if (!go) return null;
    // single word (incl. common typos): book / booking / consultation -> booking flow
    if (w === 1 && /^(book|booking|bookin|consul|appoint|reserve|enquir|inquir)/.test(t)) return 'booking';
    if (FR.booking.test(t)) {
      var pk = pkgFromText(t);
      return pk ? 'booking:' + pk : 'booking';
    }
    return null;
  }
  function pkgFromText(t) {
    var map = [['royal-groom', /\bgroom\b/], ['luxury-bridal', /\bluxury\b/], ['sangeet-reception', /\breception\b/], ['sangeet-glam', /\bsangeet\b/], ['bridal-signature', /\b(bridal|bride|wedding)\b/], ['basic-makeup', /\b(party|signature|basic)\b/]];
    for (var i = 0; i < map.length; i++) if (map[i][1].test(t)) return map[i][0];
    return '';
  }

  function respond(text) {
    var c = conv(), t = text.toLowerCase().replace(/[^\w\s'&@./-]/g, ' ').replace(/\s+/g, ' ').trim();
    var E = window.GlamAIEngine;
    // inside the conversational form every message is an answer (or Skip / Cancel / Back)
    if (S.flow) return flowInput(text, t);
    // numbered options
    var mnum = t.match(/^(?:option\s*|no\.?\s*|number\s*)?(\d{1,2})\.?$/);
    if (mnum && c && c.ctx && c.ctx.menu) {
      if (c.ctx.menu === 'programs') { var pn = +mnum[1]; if (pn >= 1 && pn <= KB.programs.length) return programDetail(pn - 1); }
      else if (c.ctx.menu === 'main') { if (+mnum[1] >= 1 && +mnum[1] <= MENU.length) return menuSelect(String(+mnum[1])); }
      return say({ t: 'Please choose one of the listed numbers, or type your question.', chips: tailChips() });
    }
    if (/^\d{1,2}\.?$/.test(t)) return say({ t: 'Numbers work when I show you a list of options. Here is the main menu — tap an option or type your question:', chips: menuChips(), chipStyle: 'list' });
    if (RE.bye.test(t) || /\b(bye|goodbye)\b/.test(t)) return endChat();
    if (RE.thanks.test(t)) return say({ t: 'You’re most welcome! 😊 Is there anything else I can help you with?', chips: [{ a: 'home', l: 'Main menu' }, { a: 'end', l: 'End chat' }] });
    if (RE.greet.test(t) && t.split(' ').length <= 4) return showMenuWithHello();
    if (RE.menu.test(t)) return showMenu();
    if (RE.programs.test(t)) return programsList();
    if (RE.about.test(t)) { var ab = E.findDoc(/what is glam by zebaish/i); if (ab) return answerChunk(ab, []); }
    var fi = flowIntent(t); if (fi) return startFlow(fi);
    if (RE.human.test(t)) return supportCard(lastUserQuestion(), true);
    if (RE.contact.test(t)) return contactCard();

    var r = E.search(text);
    if (!r.confident) return fallback(text);
    var top = r.hits[0].c, rel = [];
    r.hits.slice(1).forEach(function (h) { if ((h.c.k === 'f' || h.c.k === 'd') && h.c !== top && h.cov >= 0.5 && rel.length < 3 && rel.indexOf(h.c.h) < 0 && h.c.h !== top.h) rel.push(h.c.h); });
    answerChunk(top, rel);
  }

  function trimText(s, n) {
    if (s.length <= n) return { head: s, rest: '' };
    var cut = s.lastIndexOf('\n', n); if (cut < n * 0.5) cut = s.lastIndexOf('. ', n) + 1; if (cut < n * 0.5) cut = n;
    return { head: s.slice(0, cut).trim(), rest: s.slice(cut).trim() };
  }
  function answerChunk(ch, related) {
    var c = conv(); if (c) c.ctx = { menu: null };
    var body = ch.x, actions = [];
    if (ch.k === 'p') {
      var nx = window.GlamAIEngine.nextChunk(ch);
      if (nx && body.length < 320 && nx.h !== ch.h && nx.p === ch.p && /what is included/i.test(nx.h)) body += '\n\n' + nx.x;
    }
    var tr = trimText(body, 900);
    if (c) c.ctx.more = tr.rest;
    if (ch.p && ch.k !== 'd') actions.push({ k: 'link', l: ch.k === 'b' ? 'Read the article' : 'Read more on the website', u: pageHref(ch.p) });
    var key = (ch.h + ' ' + (ch.t || '') + ' ' + (ch.x || '')).toLowerCase();
    if (/become a makeup artist|register as an artist|artist registration/.test(ch.h.toLowerCase())) actions.push({ k: 'link', l: 'Open artist registration', u: 'login.html?role=artist&mode=register' });
    var chips = [];
    if (tr.rest) chips.push({ a: 'more', l: 'Show more' });
    (related || []).forEach(function (q) { chips.push({ a: 'send', l: q, v: q }); });
    var pk = (ch.p || '').match(/^package\.html\?id=(.+)$/);
    if (pk) chips.push({ a: 'flow', v: 'booking:' + pk[1], l: '📅 Book this package' });
    else if (!/artist/.test(ch.h.toLowerCase()) && /book|package|price|bridal|groom|sangeet|reception|makeup|hair|consult|city|cities|doorstep|travel|payment|trial/.test(key)) chips.push({ a: 'flow', v: 'booking', l: '📅 Book a consultation' });
    say({ h: ch.k === 'f' || ch.k === 'd' ? ch.h : (ch.h && ch.h !== ch.t ? ch.h : ch.t), t: tr.head, actions: actions, chips: tailChips(chips) });
  }
  function showMore() {
    var c = conv(), rest = c && c.ctx && c.ctx.more;
    if (!rest) return say({ t: 'That’s everything I have on this topic.', chips: tailChips() });
    var tr = trimText(rest, 900);
    c.ctx.more = tr.rest;
    var chips = []; if (tr.rest) chips.push({ a: 'more', l: 'Show more' });
    say({ t: tr.head, chips: tailChips(chips) });
  }

  function waLink(q, extra) {
    var msg = extra && !q ? 'Hi Glam by Zeba, I’d like to book a makeup service. Here are my details:' : 'Hi Glam by Zeba, I need some help.' + (q ? ' My question: ' + q : '');
    if (extra) msg += '\n\n' + extra;
    return 'https://wa.me/' + CFG.wa + '?text=' + encodeURIComponent(msg);
  }
  function mailLink(q, extra) {
    var sub = extra && !q ? 'Booking request from Glam AI chat' : 'Enquiry from Glam AI chat' + (q ? ': ' + clip(q, 50) : '');
    var body = 'Hello Glam by Zebaish team,\n\n' + (q ? 'I asked Glam AI: "' + q + '" and would like some help.' : extra ? 'I would like to book a makeup service. My details are below.' : 'I would like some help with your makeup packages.') + (extra ? '\n\n' + extra : '') + '\n\nThank you.';
    return 'mailto:' + CFG.email + '?subject=' + encodeURIComponent(sub) + '&body=' + encodeURIComponent(body);
  }
  function supportActions(q, extra) {
    return [{ k: 'wa', l: 'Chat on WhatsApp', u: waLink(q, extra) }, { k: 'mail', l: 'Send an email', u: mailLink(q, extra) }, { k: 'call', l: 'Call ' + CFG.phoneShow, u: 'tel:' + CFG.phone }];
  }
  function fallback(q) {
    var c = conv(); if (c) c.ctx = { menu: null };
    say({ t: 'I’m not confident enough to answer that from the current knowledge base. Please contact our support team and they will be happy to help:', actions: supportActions(q), chips: [{ a: 'flow', v: 'booking', l: '📅 Book a consultation' }, { a: 'home', l: 'Main menu' }] });
  }
  function supportCard(q, withCallback) {
    var c = conv(); if (c) c.ctx = { menu: null };
    var chips = []; if (withCallback) chips.push({ a: 'flow', v: 'booking', l: '📞 Request a call-back / booking' });
    chips.push({ a: 'home', l: 'Main menu' });
    say({ t: 'Our support team is happy to help. Choose how you would like to reach us — your question is already filled in, so there is nothing to type:', actions: supportActions(q), chips: chips });
  }
  function contactCard() {
    var c = conv(); if (c) c.ctx = { menu: null };
    say({ h: 'Contact Glam by Zebaish', t: '📞 ' + CFG.phoneShow + '\n💬 WhatsApp: ' + CFG.phoneShow + '\n📧 ' + CFG.email + '\n📍 ' + CFG.address + '\n📷 Instagram: @glambyzebaish', actions: supportActions(lastUserQuestion()), chips: tailChips([{ a: 'flow', v: 'booking', l: '📅 Book a consultation' }]) });
  }

  function menuSelect(n, fromHome) {
    var c = conv(), E = window.GlamAIEngine;
    function faq(re, rel) {
      var f = E.findFaq(re) || E.findDoc(re);
      if (!f) return fallback(re.source);
      var relq = []; (rel || []).forEach(function (r) { var x = E.findFaq(r); if (x) relq.push(x.h); });
      answerChunk(f, relq);
    }
    if (fromHome) addMsg({ r: 'u', t: n + '. ' + MENU[+n - 1][1] });
    if (n === '1') return programsList();
    if (n === '2') return startFlow('booking');
    if (n === '3') return faq(/how much do your makeup packages cost/i, [/which package is best for a bride/i, /payment methods/i]);
    if (n === '4') return faq(/which package is best for a bride/i, [/can i get a consultation/i, /which products do you use/i]);
    if (n === '5') return faq(/groom makeup and styling/i, [/sangeet glam package/i, /signature glam makeup/i]);
    if (n === '6') return faq(/how does booking work/i, [/payment methods/i, /makeup trial/i]);
    if (n === '7') return faq(/outside hyderabad/i, [/does the artist come/i]);
    if (n === '8') return faq(/how do i register as an artist/i, []);
    if (n === '9') return contactCard();
  }

  function programsList() {
    var c = conv(); if (c) c.ctx = { menu: 'programs' };
    say({ t: 'These are our makeup packages. Choose a number to know more:', chips: KB.programs.map(function (p, i) { return { a: 'prog', v: String(i), n: String(i + 1), l: p.t + ' · ' + p.d.split(' · ')[1] }; }).concat([{ a: 'home', l: 'Main menu' }]), chipStyle: 'list', actions: [{ k: 'link', l: 'View all packages on the website', u: 'packages.html' }] });
  }
  function programDetail(i) {
    var c = conv(), E = window.GlamAIEngine, p = KB.programs[i]; if (!p) return programsList();
    if (c) c.ctx = { menu: 'programs' };
    var parts = [];
    E.pageChunks(p.u).forEach(function (ch) { if (parts.length < 2) parts.push(ch.x); });
    var tr = trimText(parts.join('\n\n'), 900);
    var id = p.u.split('id=')[1];
    say({ h: p.t, t: tr.head + (tr.rest ? ' …' : ''), actions: [{ k: 'link', l: 'Open ' + p.t, u: pageHref(p.u) }], chips: [{ a: 'flow', v: 'booking:' + id, l: '📅 Book this package' }, { a: 'home', l: 'Main menu' }] });
    say({ t: 'Want to know about another package?', chips: KB.programs.map(function (q, k) { return { a: 'prog', v: String(k), n: String(k + 1), l: q.t }; }), chipStyle: 'list' });
  }

  /* ---------------- conversational forms ---------------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function normPhone(s) { var d = String(s).replace(/\D/g, ''); if (/^91\d{10}$/.test(d)) d = d.slice(2); if (/^0\d{10}$/.test(d)) d = d.slice(1); return d; }
  var MON = 'jan feb mar apr may jun jul aug sep oct nov dec'.split(' ');
  function iso(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function mkDate(y, mo, da) { var d = new Date(y, mo - 1, da); return d.getFullYear() === y && d.getMonth() === mo - 1 && d.getDate() === da ? d : null; }
  function parseDate(s) {
    s = s.toLowerCase().trim().replace(/,/g, ' ').replace(/\s+/g, ' ');
    var today = new Date(), d = null, m; today.setHours(0, 0, 0, 0);
    if (s === 'today') d = today;
    else if (s === 'tomorrow') { d = new Date(today); d.setDate(d.getDate() + 1); }
    else if ((m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/))) d = mkDate(+m[1], +m[2], +m[3]);
    else if ((m = s.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})$/))) { var y = +m[3]; if (y < 100) y += 2000; d = mkDate(y, +m[2], +m[1]); }
    else if ((m = s.match(/^(\d{1,2})(?:st|nd|rd|th)? ?(?:of )?([a-z]{3,9})(?: (\d{4}))?$/)) && MON.indexOf(m[2].slice(0, 3)) > -1) {
      var mo = MON.indexOf(m[2].slice(0, 3)) + 1, yy = m[3] ? +m[3] : today.getFullYear(); d = mkDate(yy, mo, +m[1]);
      if (d && !m[3] && d < today) d = mkDate(yy + 1, mo, +m[1]);
    } else if ((m = s.match(/^([a-z]{3,9}) (\d{1,2})(?:st|nd|rd|th)?(?: (\d{4}))?$/)) && MON.indexOf(m[1].slice(0, 3)) > -1) {
      var mo2 = MON.indexOf(m[1].slice(0, 3)) + 1, y2 = m[3] ? +m[3] : today.getFullYear(); d = mkDate(y2, mo2, +m[2]);
      if (d && !m[3] && d < today) d = mkDate(y2 + 1, mo2, +m[2]);
    }
    if (!d) return { err: 'I couldn’t read that date. Please type it like “15 Nov” or “15/11/2026”, or tap Skip.' };
    if (d < today) return { err: 'That date has already passed. Please give a date from today onwards, or tap Skip.' };
    return { v: iso(d) };
  }
  function matchOpt(list, text) {
    var t = String(text).toLowerCase().replace(/\s+/g, ' ').trim(), n = +t, i;
    if (/^\d{1,2}$/.test(t) && n >= 1 && n <= list.length) return list[n - 1];
    for (i = 0; i < list.length; i++) if (list[i].l.toLowerCase() === t || String(list[i].v).toLowerCase() === t) return list[i];
    var hits = list.filter(function (o) { return o.l.toLowerCase().indexOf(t) === 0; });
    if (hits.length === 1 && t.length >= 2) return hits[0];
    hits = list.filter(function (o) { return t.length >= 3 && o.l.toLowerCase().indexOf(t) > -1; });
    if (hits.length === 1) return hits[0];
    return null;
  }

  function startFlow(spec) {
    var id = String(spec).split(':')[0], pre = String(spec).split(':')[1], def = FLOWS[id];
    if (!def) return;
    var c = conv(); if (c) c.ctx = { menu: null };
    S.flow = { id: id, def: def, step: -1, data: {}, labels: {}, mode: 'ask', cur: null, edit: false };
    var known = KB && KB.programs ? KB.programs.filter(function (p) { return p.u.split('id=')[1] === pre; })[0] : null;
    if (id === 'booking' && known) { S.flow.pre = 1; S.flow.data['package'] = pre; S.flow.labels['package'] = known.t; }
    say({ h: def.name, t: def.intro + (S.flow.pre ? '\n\nPackage selected: ' + known.t + '.' : ''), chips: [{ a: 'fcancel', l: 'Cancel', g: 1 }] });
    nextField();
  }
  function fields() { return S.flow.def.fields; }
  function nextField() {
    var f = S.flow, i = f.step + 1, fl = fields();
    while (i < fl.length && f.data[fl[i].k] !== undefined && fl[i].k === 'package') i++;
    if (i >= fl.length) return reviewFlow();
    askField(i);
  }
  function optsFor(fd) {
    if (fd.o === 'pkg') {
      return ((KB && KB.programs) || []).map(function (p) { return { v: p.u.split('id=')[1], l: p.t }; }).concat([{ v: 'not-sure', l: 'Not sure — help me choose' }]);
    }
    return OPT[fd.o] || [];
  }
  function askField(i, editing) {
    var f = S.flow, fd = fields()[i]; if (!f || !fd) return;
    f.step = i; f.cur = fd; f.mode = 'ask'; f.edit = !!editing;
    var pre = f.pre ? 1 : 0, total = fields().length - pre;
    var chips = [], list = optsFor(fd);
    if (fd.t === 'select') {
      var inline = fd.inline || list.length <= 3;
      list.forEach(function (o, k) { chips.push({ a: 'fopt', v: o.v, l: o.l, n: inline ? '' : String(k + 1), sec: fd.sec }); });
    }
    if (fd.quick) fd.quick.forEach(function (qk) { chips.push({ a: 'fopt', v: qk, l: qk }); });
    if (!fd.req) chips.push({ a: 'fskip', l: 'Skip', g: 1 });
    chips.push({ a: 'fcancel', l: 'Cancel', g: 1 });
    say({ t: fd.q + (fd.req ? '' : ' (optional)'), chips: chips, chipStyle: fd.t === 'select' && !(fd.inline || list.length <= 3) ? 'list' : '' });
    setField(fd);
  }
  function setField(fd) {
    if (!R.field) return;
    R.field.placeholder = fd ? (fd.ph || (fd.t === 'select' ? 'Tap an option or type it…' : 'Type your answer…')) : 'Type or tap the mic to speak…';
    R.field.type = 'text';
    try { R.field.inputMode = fd && (fd.t === 'phone' || fd.t === 'mobile' || fd.t === 'pin') ? 'tel' : fd && fd.t === 'email' ? 'email' : 'text'; } catch (e) {}
  }

  function flowInput(text, t) {
    var f = S.flow;
    if (RE.cancel.test(t)) return cancelFlow();
    if (f.mode === 'submitting') return say({ t: 'One moment — I’m submitting your details…' });
    if (f.mode === 'review') {
      if (/^(yes|y|submit|confirm|ok|okay|send|correct|looks good)$/.test(t)) return submitFlow();
      if (/^(edit|change|no|modify|update)/.test(t)) return editList();
      return say({ t: 'Tap “Looks good” to continue, or Change a detail to edit something.', chips: reviewChips() });
    }
    if (f.mode === 'edit') {
      var fl = fields(), hit = null;
      fl.forEach(function (fd, i) { if (fd.l.toLowerCase().indexOf(t) > -1 && t.length > 2) hit = i; });
      if (/^\d{1,2}$/.test(t) && +t >= 1 && +t <= fl.length) hit = +t - 1;
      if (hit !== null) return askField(hit, true);
      return say({ t: 'Please choose which detail to change:', chips: editChips(), chipStyle: 'list' });
    }
    // ask mode
    var fd = f.cur;
    if (RE.back.test(t)) { if (f.step > 0 && !f.edit) { var pi = f.step - 1; if (fields()[pi].k === 'package' && f.pre) pi = Math.max(0, pi - 1); return askField(pi); } return say({ t: 'This is the first question.', chips: [{ a: 'fcancel', l: 'Cancel', g: 1 }] }); }
    if (RE.skip.test(t) && !fd.req) return flowAnswer('', '');
    if (RE.skip.test(t) && fd.req && /^(skip|pass)$/.test(t)) return say({ t: 'This detail is required for your request. ' + fd.q, chips: [{ a: 'fcancel', l: 'Cancel', g: 1 }] });
    flowAnswer(text, text);
  }

  function flowAnswer(raw, label) {
    var f = S.flow, fd = f.cur; if (!f || !fd) return;
    raw = String(raw == null ? '' : raw).trim();
    var val = raw, lab = raw, err = null;
    if (!raw) { if (fd.req) return say({ t: 'This detail is required. ' + fd.q }); val = ''; lab = ''; }
    else if (fd.t === 'text') {
      var min = fd.long ? 2 : 2; if (raw.length < min) err = 'Please enter at least ' + min + ' characters.';
      if (raw.length > (fd.long ? 1000 : 200)) err = 'That is a bit too long — please keep it shorter.';
      val = raw; lab = raw;
    } else if (fd.t === 'phone' || fd.t === 'mobile') {
      var d = normPhone(raw), cc = f.data.country_code;
      var ok = fd.t === 'mobile' && cc && cc !== '+91' ? /^\d{6,14}$/.test(d) : /^[6-9]\d{9}$/.test(d);
      if (!ok) err = 'That doesn’t look like a valid ' + (fd.t === 'mobile' && cc && cc !== '+91' ? 'mobile number' : '10-digit Indian mobile number') + '. Please check and type it again.';
      val = d; lab = d;
    } else if (fd.t === 'email') {
      if (!EMAIL_RE.test(raw)) err = 'That email address doesn’t look right. Please type it again (for example name@example.com).';
      val = raw.toLowerCase(); lab = val;
    } else if (fd.t === 'url') {
      if (!/^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(raw)) err = 'That doesn’t look like a valid website address. Please type it like https://www.example.com, or tap Skip.';
    } else if (fd.t === 'pin') {
      if (!/^[A-Za-z0-9][A-Za-z0-9 -]{1,10}$/.test(raw)) err = 'Please enter a valid pincode.';
    } else if (fd.t === 'date') {
      var pr = parseDate(raw); if (pr.err) err = pr.err; else { val = pr.v; lab = raw; }
    } else if (fd.t === 'select') {
      var o = matchOpt(optsFor(fd), raw);
      if (!o) err = 'Please choose one of the options below (tap it, or type its number).';
      else { val = o.v; lab = o.l; }
    }
    if (err) {
      var chips = [];
      if (fd.t === 'select') { var inl = fd.inline || optsFor(fd).length <= 3; optsFor(fd).forEach(function (op, k) { chips.push({ a: 'fopt', v: op.v, l: op.l, n: inl ? '' : String(k + 1), sec: fd.sec }); }); }
      if (!fd.req) chips.push({ a: 'fskip', l: 'Skip', g: 1 });
      chips.push({ a: 'fcancel', l: 'Cancel', g: 1 });
      return say({ t: err, chips: chips, chipStyle: fd.t === 'select' && !(fd.inline || optsFor(fd).length <= 3) ? 'list' : '' });
    }
    f.data[fd.k] = val; f.labels[fd.k] = lab || (val ? val : '');
    if (f.edit) { f.edit = false; return reviewFlow(); }
    nextField();
  }

  function reviewChips() { return [{ a: 'fsubmit', l: '✅ Looks good' }, { a: 'fedit', l: '✏️ Change a detail' }, { a: 'fcancel', l: 'Cancel', g: 1 }]; }
  function reviewFlow() {
    var f = S.flow; f.mode = 'review'; f.cur = null; setField(null);
    var lines = [];
    fields().forEach(function (fd) { var v = f.labels[fd.k]; if (v) lines.push('• ' + fd.l + ': ' + v); });
    say({ h: 'Please review your details', t: lines.join('\n') + '\n\nShall I prepare this request for our team?', chips: reviewChips() });
  }
  function editChips() { return fields().map(function (fd, i) { return { a: 'feditkey', v: String(i), n: String(i + 1), l: fd.l }; }).concat([{ a: 'fsubmit', l: '✅ Looks good as is' }]); }
  function editList() {
    var f = S.flow; f.mode = 'edit';
    say({ t: 'Which detail would you like to change?', chips: editChips(), chipStyle: 'list' });
  }
  function cancelFlow() {
    var f = S.flow; S.flow = null; setField(null);
    say({ t: 'No problem — I’ve cancelled that' + (f ? ' (' + f.def.name + ')' : '') + '. Nothing was sent. Is there anything else I can help with?', chips: tailChips() });
  }


  function detailsText() {
    var f = S.flow, out = [f.def.name];
    fields().forEach(function (fd) { var v = f.labels[fd.k]; if (v) out.push(fd.l + ': ' + v); });
    return out.join('\n');
  }
  function submitFlow() {
    var f = S.flow; if (!f) return;
    // Glam by Zebaish has no booking server behind this site yet: the request is handed to the team on WhatsApp / email, pre-filled.
    var extra = detailsText(), first = String(f.data.name || '').split(' ')[0];
    var def = f.def;
    S.flow = null; setField(null);
    say({ h: '✅ Your request is ready', t: 'Thank you' + (first ? ', ' + first : '') + '! ' + def.done + ' Tap WhatsApp below to send it to our team — it’s already filled in with your details, so you only need to press send. You can also email or call us.\n\nOur team will confirm availability and the final quote with you.', actions: supportActions('', extra), chips: [{ a: 'home', l: 'Main menu' }, { a: 'end', l: 'End chat' }] });
  }

  /* ---------------- end chat + feedback ---------------- */
  function endChat() {
    var c = conv(); if (!c || c.ended) return;
    flushOut(); S.flow = null; setField(null);
    c.ended = true; c.ctx = { menu: null };
    say({ t: 'Goodbye! Feel free to reach out if you have any questions in the future.' });
    say({ t: 'Was this helpful?', chips: [{ a: 'rate', v: 'yes', l: '👍 Yes' }, { a: 'rate', v: 'no', l: '👎 No' }, { a: 'new', l: 'Start a new chat' }] });
    setEnded(true);
  }
  function rate(v) {
    var c = conv(); if (!c) return;
    c.rating = v; save();
    $$('.gai-chips', R.msgs).forEach(function (n) { n.remove(); });
    addMsg({ r: 'u', t: v === 'yes' ? '👍 Yes' : '👎 No' });
    if (v === 'yes') say({ t: 'Thank you for your feedback! 😊', chips: [{ a: 'new', l: 'Start a new chat' }] });
    else say({ t: 'Sorry we couldn’t help fully. Our support team can assist you directly:', actions: supportActions(lastUserQuestion()), chips: [{ a: 'new', l: 'Start a new chat' }] });
  }

  /* ---------------- microphone ---------------- */
  function setupMic() {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { R.mic.hidden = true; return; }
    R.mic.onclick = function () { S.listening ? stopMic() : startMic(SR); };
  }
  function startMic(SR) {
    var c = conv(); if (!c || c.ended) return;
    try {
      var rec = new SR(); S.rec = rec;
      rec.lang = 'en-IN'; rec.interimResults = true; rec.continuous = false; rec.maxAlternatives = 1;
      var finalText = '';
      rec.onstart = function () { S.listening = true; R.mic.classList.add('on'); R.field.placeholder = 'Listening… speak now'; sound('mic'); };
      rec.onresult = function (e) {
        var interim = '';
        for (var i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) finalText += e.results[i][0].transcript; else interim += e.results[i][0].transcript;
        }
        R.field.value = (finalText + interim).trim();
      };
      rec.onerror = function (e) {
        var msg = e.error === 'not-allowed' || e.error === 'service-not-allowed' ? 'Microphone access is blocked. Please allow it in your browser settings.' : e.error === 'no-speech' ? 'I didn’t hear anything. Please try again.' : e.error === 'network' ? 'Voice input needs an internet connection.' : 'Voice input is not available right now.';
        toast(msg);
      };
      rec.onend = function () {
        var wasOn = S.listening; S.listening = false; S.rec = null;
        if (R.mic) R.mic.classList.remove('on');
        var v = (R.field && R.field.value || '').trim();
        // keep the spoken text in the box so it can be edited; the user presses Send / Enter
        if (v) { try { R.field.focus(); var L = R.field.value.length; R.field.setSelectionRange(L, L); } catch (e) {} toast('Edit if needed, then press Send.'); }
        else if (R.field) setField(S.flow && S.flow.cur ? S.flow.cur : null);
      };
      rec.start();
    } catch (err) { toast('Voice input is not available on this browser.'); }
  }
  function stopMic() {
    if (S.rec) { try { S.rec.stop(); } catch (e) {} }
    S.listening = false;
  }

  /* ---------------- public API ---------------- */
  window.GLAMAI = {
    open: function (v) { if (R.root) open(v); }, close: close,
    toggle: function () { S.open ? close() : open(); },
    ask: function (q) { open('chat'); startFresh(function () { userSay(q); }); }
  };
  // keep old inline buttons (onclick="toggleChatbot()") working
  window.toggleChatbot = function () { window.GLAMAI.toggle(); };
  window.openChatbot = function () { window.GLAMAI.open(); };

  function boot() {
    build();
    if (/[?&]glamai=open\b/.test(location.search) || document.documentElement.hasAttribute('data-glamai-open')) open('home');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
