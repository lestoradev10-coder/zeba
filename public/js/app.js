/* Glam by Zebaish — shared UI: header, footer, cart drawer, favourites, account, search, chat */
(function () {
  "use strict";
  var P = {
    heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/>',
    cart: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    chev: '<path d="m6 9 6 6 6-6"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowUR: '<path d="M7 17 17 7M8 7h9v9"/>',
    left: '<path d="m15 18-6-6 6-6"/>',
    right: '<path d="m9 18 6-6-6-6"/>',
    box: '<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    login: '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    brush: '<path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    gem: '<path d="M6 3h12l4 6-10 13L2 9z"/><path d="M11 3 8 9l4 13 4-13-3-6M2 9h20"/>',
    camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    sparkle: '<path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2zM19 3v4M21 5h-4"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    insta: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/>',
    fb: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
    upi: '<path d="M4 5h16v14H4z"/><path d="M8 10v4a2 2 0 0 0 4 0v-4M15 14l2-4"/>',
    cash: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    pause: '<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>',
    play: '<path d="m7 4 13 8-13 8z"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    truck: '<path d="M1 3h15v13H1zM16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>'
  };
  window.ic = function (n, c) { return '<svg class="i ' + (c || "") + '" viewBox="0 0 24 24" aria-hidden="true">' + (P[n] || "") + "</svg>"; };
  var ic = window.ic;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  window.$ = $; window.$$ = $$;
  window.money = function (n) { return "₹" + Number(n).toLocaleString("en-IN"); };

  /* ---------- storage ---------- */
  var KEY = { cart: "glamCart", fav: "glamFavorites", user: "glamUser", orders: "glamOrders", addr: "glamAddresses", theme: "glamTheme" };
  function rd(k, d) { try { var r = localStorage.getItem(k); return r ? JSON.parse(r) : d; } catch (e) { return d; } }
  function wr(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  window.store = { KEY: KEY, rd: rd, wr: wr };
  var Cart = {
    list: function () { return rd(KEY.cart, []).filter(getPackageById); },
    has: function (id) { return this.list().indexOf(id) > -1; },
    add: function (id, open) { var l = this.list(); if (l.indexOf(id) < 0) l.push(id); wr(KEY.cart, l); sync(); if (open !== false) openDrawer("cart"); },
    remove: function (id) { wr(KEY.cart, this.list().filter(function (x) { return x !== id; })); sync(); },
    clear: function () { wr(KEY.cart, []); sync(); },
    total: function () { return this.list().reduce(function (s, id) { return s + getPackageById(id).price; }, 0); }
  };
  var Fav = {
    list: function () { return rd(KEY.fav, []).filter(getPackageById); },
    has: function (id) { return this.list().indexOf(id) > -1; },
    toggle: function (id) {
      var l = this.list(), i = l.indexOf(id);
      if (i < 0) { l.push(id); toast("Saved to favourites"); } else { l.splice(i, 1); toast("Removed from favourites"); }
      wr(KEY.fav, l); sync();
    }
  };
  var Auth = {
    /* Same keys as the Zeba backend pages: user, userToken, userRole */
    user: function () {
      var u = rd("user", null); if (!u || !localStorage.getItem("userToken")) return null;
      return { name: u.name || (u.email || "").split("@")[0] || "there", email: u.email, role: localStorage.getItem("userRole") === "artist" ? "artist" : "customer" };
    },
    out: function () { ["user", "userToken", "userRole", "rememberedEmail", "glamUser"].forEach(function (k) { try { localStorage.removeItem(k); } catch (e) {} }); }
  };
  window.Cart = Cart; window.Fav = Fav; window.Auth = Auth;

  /* ---------- theme: light only (dark mode removed) ---------- */
  document.documentElement.setAttribute("data-theme", "light");
  try { localStorage.removeItem(KEY.theme); } catch (e) {}

  /* ---------- toast ---------- */
  var toastEl;
  window.toast = function (msg) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "toast"; toastEl.setAttribute("role", "status"); (document.querySelector(".gz-shell") || document.body).appendChild(toastEl); }
    toastEl.innerHTML = ic("check") + msg; toastEl.classList.add("show");
    clearTimeout(toastEl._t); toastEl._t = setTimeout(function () { toastEl.classList.remove("show"); }, 2200);
  };

  /* ---------- shared card ---------- */
  window.pkgHref = function (id) { return "package.html?id=" + id; };
  /* ratings: nothing shown until real reviews exist. Fill window.GLAM_RATINGS = { "<package-id>": { avg: 4.8, count: 12 } } (from the reviews API) and the stars appear. */
  window.GLAM_RATINGS = window.GLAM_RATINGS || {};
  window.pkgCard = function (p) {
    var f = Fav.has(p.id), r = window.GLAM_RATINGS[p.id];
    var rate = r && r.count > 0 ? '<div class="rate"><b>★ ' + Number(r.avg).toFixed(1) + "</b><span>(" + r.count + ")</span></div>" : "";
    return '<article class="pc rv-in"><div class="pc-media"><a class="ph" href="' + pkgHref(p.id) + '"><img loading="lazy" src="images/' + p.image + '" alt="' + p.name + '"></a>' +
      '<button class="fav' + (f ? " on" : "") + '" data-fav="' + p.id + '" aria-label="Add ' + p.name + ' to favourites">' + ic("heart") + "</button>" +
      '<div class="pc-hover"><button class="rbtn ghost" data-add="' + p.id + '">Add to cart</button><button class="rbtn" data-book="' + p.id + '">Book now</button></div></div>' +
      '<div class="pc-i"><div><h3><a href="' + pkgHref(p.id) + '">' + p.name + "</a></h3><p>" + p.short + '</p></div></div>' +
      '<div class="pc-pr"><span class="pr">' + p.priceLabel + "</span>" + rate + "</div></article>";
  };

  /* ---------- header / footer ---------- */
  var NAV = [["Home", "index.html"], ["About us", "about.html"], ["Why choose us", "index.html#why"], ["Packages", "packages.html"], ["Blog", "blog.html"], ["FAQ", "index.html#faq"], ["Contact us", "contact.html"]];
  var page = document.body.dataset.page || "home";

  function headerHTML() {
    var nav = NAV.map(function (n) {
      var on = (page === "home" && n[0] === "Home") || (page === "about" && n[0] === "About us") || ((page === "blog" || page === "post") && n[0] === "Blog") || ((page === "packages" || page === "package") && n[0] === "Packages");
      return '<li><a href="' + n[1] + '"' + (on ? ' class="on"' : "") + ">" + n[0] + "</a></li>";
    }).join("");
    return '<a class="skip" href="#main">Skip to content</a>' +
      '<header class="hdr"><div class="hdr-in">' +
      '<button class="ic-btn menu-btn" data-act="menu" aria-label="Open menu">' + ic("menu") + "</button>" +
      '<a class="logo" href="index.html" aria-label="Glam by Zebaish home"><img src="images/logo.png" alt="Glam by Zebaish"></a>' +
      '<ul class="nav">' + nav + "</ul>" +
      '<div class="hdr-r"><button class="search-pill" data-act="search" aria-label="Search">' + ic("search") + "<span>Search</span><kbd>⌘K</kbd></button>" +
      '<button class="ic-btn sbtn" data-act="search" aria-label="Search">' + ic("search") + "</button>" +
      '<div class="pop-wrap"><button class="ic-btn" data-act="acct" aria-label="Account" aria-expanded="false">' + ic("user") + '<span class="dot" hidden></span>' + ic("chev") + '</button><div class="pop" id="acctPop" role="menu"></div></div>' +
      '<button class="ic-btn" data-act="cart" aria-label="Open cart">' + ic("cart") + '<span class="badge" id="cartBadge" data-n="0">0</span></button>' +
      "</div></div></header>";
  }
  function footerHTML() {
    var noNews = document.body.hasAttribute("data-auth"); /* login / register / reset pages: no newsletter */
    return (noNews ? '' : '<section class="news-wrap"><div class="news"><div><h2>New looks first.</h2><p>New packages, offers and the odd beauty note from our artists. </p></div>' +
      '<form id="newsForm" novalidate><label for="nemail">Email address</label><div class="row"><input id="nemail" type="email" placeholder="you@example.com" autocomplete="email"><button class="btn" type="submit">Sign up</button></div><small>Unsubscribe any time. We never share your email.</small></form></div></section>') +
      '<footer class="ftr"><div class="ftr-g"><div><a class="logo" href="index.html"><img src="images/logo.png" alt="Glam by Zebaish"></a>' +
      '<p class="bl">Professional makeup artistry at your doorstep. Empowering beauty, creating careers, building futures.</p>' +
      '<div class="soc"><a href="https://www.instagram.com/glambyzebaish" target="_blank" rel="noopener" aria-label="Instagram">' + ic("insta") + '</a><a href="https://www.facebook.com/people/Glam-by-Zebaish/61594240403449/" target="_blank" rel="noopener" aria-label="Facebook">' + ic("fb") + '</a></div></div>' +
      '<div><h4>Quick links</h4><ul><li><a href="index.html">Home</a></li><li><a href="about.html">About us</a></li><li><a href="packages.html">Packages</a></li><li><a href="blog.html">Blog</a></li><li><a href="contact.html">Contact</a></li></ul></div>' +
      '<div><h4>Support</h4><ul><li><a href="index.html#faq">FAQ</a></li><li><a href="index.html#why">Why choose us</a></li><li><a href="privacy-policy.html">Privacy policy</a></li><li><a href="terms.html">Terms &amp; conditions</a></li></ul></div>' +
      '<div><h4>Contact</h4><ul class="ct"><li>' + ic("mail") + '<a href="mailto:' + EMAIL + '">' + EMAIL + '</a></li><li>' + ic("phone") + '<a href="tel:+919505777790">' + PHONE + "</a></li><li>" + ic("pin") + "Hyderabad, Telangana</li></ul></div></div>" +
      '<div class="ftr-b"><span>© 2026 <b style="color:var(--head)">Glam by Zebaish</b>. All rights reserved.</span><span>Designed &amp; Developed by <a href="#">Lestora Technologies</a></span></div></footer>';
  }
  function overlaysHTML() {
    var wa = document.body.dataset.header === "min" ? "" : '<a class="wa-float" href="' + WA_LINK + '" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp"><svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16.04 3C9.4 3 4 8.35 4 14.95c0 2.35.7 4.54 1.9 6.39L4 29l7.85-1.85a12.1 12.1 0 0 0 4.19.74C22.66 27.9 28 22.55 28 15.95S22.66 3 16.04 3zm0 22.1c-1.33 0-2.62-.34-3.76-.97l-.27-.15-4.66 1.1 1.14-4.5-.18-.29a9.1 9.1 0 0 1-1.4-4.85c0-5.02 4.12-9.1 9.2-9.1s9.2 4.08 9.2 9.1-4.12 9.66-9.27 9.66zm5.04-6.9c-.28-.14-1.64-.8-1.9-.9-.25-.09-.44-.14-.62.14-.18.27-.72.9-.88 1.08-.16.18-.32.2-.6.07-.27-.14-1.16-.42-2.2-1.34-.82-.72-1.37-1.6-1.53-1.87-.16-.27-.02-.42.12-.55.12-.12.27-.32.4-.48.14-.16.18-.27.27-.46.09-.18.05-.34-.02-.48-.07-.14-.62-1.48-.85-2.03-.22-.53-.45-.46-.62-.47h-.53c-.18 0-.48.07-.73.34-.25.27-.96.93-.96 2.28s.98 2.64 1.12 2.82c.14.18 1.93 2.93 4.67 4.1.65.28 1.16.45 1.56.58.65.2 1.25.18 1.72.11.52-.08 1.64-.67 1.87-1.31.23-.64.23-1.19.16-1.31-.07-.12-.25-.18-.53-.32z"/></svg></a>';
    return wa + '<div class="scrim" id="scrim"></div>' +
      '<aside class="drawer" id="drCart" aria-label="Cart" role="dialog" aria-modal="true"></aside>' +
      '<aside class="drawer" id="drFav" aria-label="Saved packages" role="dialog" aria-modal="true"></aside>' +
      '<div class="modal" id="mdSign" role="dialog" aria-modal="true" aria-label="Sign in"><button class="circle x" data-close aria-label="Close">' + ic("x") + "</button>" +
      "<h3>Welcome back</h3><p>Choose how you would like to sign in.</p><div class=\"choice\">" +
      '<a href="login.html"><span class="ico">' + ic("user") + "</span><h4>Customer login</h4><p>Book packages, track orders and keep your favourites.</p><span class=\"go\">Continue " + ic("arrow") + "</span></a>" +
      '<a href="artist-login.html"><span class="ico">' + ic("brush") + "</span><h4>Makeup artist login</h4><p>Open your artist dashboard and accept bookings.</p><span class=\"go\">Continue " + ic("arrow") + "</span></a></div></div>" +
      '<div class="modal search-modal" id="mdSearch" role="dialog" aria-modal="true" aria-label="Search"><input id="sInput" type="search" placeholder="Search packages, services, pages…" autocomplete="off"><div class="sr-list" id="sList"></div></div>' +
      '<nav class="mnav" id="mnav" aria-label="Menu"><button class="circle x" data-close aria-label="Close menu">' + ic("x") + "</button>" +
      '<a href="index.html">Home</a><a href="about.html">About us</a><a href="index.html#why">Why choose us</a><a href="packages.html">Packages</a>' +
      '<a href="blog.html">Blog</a><a href="index.html#faq">FAQ</a><a href="contact.html">Contact us</a>' +
      '<a href="login.html" data-act="login">Login</a></nav>';
  }

  var mount = document.createElement("div");
  var minimal = document.body.dataset.header === "min";
  var scoped = document.body.dataset.shell === "scoped"; /* pages with their own design (checkout): shell styles are scoped to .gz-shell */
  var W = function (h) { return scoped ? '<div class="gz-shell">' + h + "</div>" : h; };
  if (!minimal) document.body.insertAdjacentHTML("afterbegin", W(headerHTML()));
  var main = document.querySelector("main");
  if (main && !main.id) main.id = "main";
  if (!minimal && document.body.dataset.footer !== "none") document.body.insertAdjacentHTML("beforeend", W(footerHTML()));
  document.body.insertAdjacentHTML("beforeend", W(overlaysHTML()));

  /* ---------- open / close ---------- */
  var scrim = $("#scrim");
  var layers = { cart: $("#drCart"), fav: $("#drFav"), sign: $("#mdSign"), search: $("#mdSearch"), menu: $("#mnav") };
  function closeAll() {
    Object.keys(layers).forEach(function (k) { layers[k].classList.remove("open"); });
    scrim.classList.remove("open"); document.body.style.overflow = "";
    var pop = $("#acctPop"); if (pop) pop.classList.remove("open");
  }
  function openDrawer(k) {
    closeAll(); renderDrawers();
    layers[k].classList.add("open"); scrim.classList.add("open"); document.body.style.overflow = "hidden";
    if (k === "search") { var i = $("#sInput"); i.value = ""; renderSearch(""); setTimeout(function () { i.focus(); }, 60); }
  }
  window.openLayer = openDrawer;
  scrim.addEventListener("click", closeAll);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeAll(); }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openDrawer("search"); }
  });

  /* ---------- drawers ---------- */
  function lineItem(p, mode) {
    return '<div class="li"><a href="' + pkgHref(p.id) + '"><img src="images/' + p.image + '" alt=""></a><div><b>' + p.name + "</b><small>" + p.tag + '</small><a class="rm" href="#" data-' + (mode === "fav" ? "unfav" : "rm") + '="' + p.id + '">Remove</a>' +
      (mode === "fav" ? ' <a class="rm" href="#" data-add="' + p.id + '" style="margin-left:12px">Add to cart</a>' : "") + '</div><div class="p">' + p.priceLabel + "</div></div>";
  }
  function renderDrawers() {
    var c = Cart.list().map(getPackageById);
    $("#drCart").innerHTML = '<div class="dr-h"><h3>Your cart<small>(' + c.length + ')</small></h3><button class="circle" data-close aria-label="Close cart">' + ic("x") + "</button></div>" +
      '<div class="dr-b">' + (c.length ? c.map(function (p) { return lineItem(p, "cart"); }).join("") :
        '<div class="empty">' + ic("cart") + "<h4>Your cart is empty</h4><p>Pick a package and it will wait for you here.</p><a class=\"btn\" href=\"packages.html\">Browse packages</a></div>") + "</div>" +
      (c.length ? '<div class="dr-f"><div class="dr-row"><span>Subtotal</span><span>' + (c.some(function (p) { return p.from; }) ? "from " : "") + money(Cart.total()) + '</span></div><p class="dr-note">Packages marked “From” are starting prices. Our team confirms the final quote with you.</p><a class="btn block" href="book-now.html">Checkout ' + ic("arrow") + '</a><button class="btn ghost block" data-close>Continue browsing</button></div>' : "");
    var f = Fav.list().map(getPackageById);
    $("#drFav").innerHTML = '<div class="dr-h"><h3>Saved<small>(' + f.length + ')</small></h3><button class="circle" data-close aria-label="Close saved">' + ic("x") + "</button></div>" +
      '<div class="dr-b">' + (f.length ? f.map(function (p) { return lineItem(p, "fav"); }).join("") :
        '<div class="empty">' + ic("heart") + "<h4>Nothing saved yet</h4><p>Tap the heart on any package to keep it here.</p><a class=\"btn\" href=\"packages.html\">Browse packages</a></div>") + "</div>";
  }

  /* ---------- account popover ---------- */
  function renderAcct() {
    var u = Auth.user(), n = Fav.list().length;
    if (!$("#acctPop")) return;
    $("#acctPop").innerHTML = '<div class="pop-h"><b>' + (u ? "Hi, " + u.name.split(" ")[0] : "Your account") + "</b><span>" + (u ? (u.role === "artist" ? "Makeup artist account" : "Customer account") : "Sign in to track orders and subscriptions") + "</span></div>" +
      '<div class="pop-l"><button data-act="fav">' + ic("heart") + 'Saved<span class="cnt">' + n + '</span></button>' +
      '<a href="' + (u && u.role === "artist" ? "/artist-dashboard" : "/dashboard#orders") + '">' + ic("box") + (u && u.role === "artist" ? "Bookings" : "Orders") + "</a>" + (u && u.role === "artist" ? "" : '<a href="/dashboard#addresses">' + ic("pin") + "Addresses</a>") + "</div>" +
      '<div class="pop-l">' + (u ? '<a href="' + (u.role === "artist" ? "/artist-dashboard" : "/dashboard") + '">' + ic("user") + (u.role === "artist" ? "Artist dashboard" : "My account") + "</a>" + '<button data-act="signout">' + ic("logout") + "Sign out</button>" : '<button data-act="sign">' + ic("login") + "Sign in or create account</button>") + "</div>";
    var d = $(".dot"); if (d) d.hidden = !!u;
  }

  /* ---------- search ---------- */
  var INDEX = [{ t: "Home", u: "index.html" }, { t: "About us", u: "about.html" }, { t: "Packages", u: "packages.html" }, { t: "Why choose us", u: "index.html#why" }, { t: "Blog", u: "blog.html" }, { t: "FAQ", u: "index.html#faq" }, { t: "Contact us", u: "contact.html" }, { t: "Customer login", u: "login.html" }, { t: "Makeup artist login", u: "artist-login.html" }];
  function renderSearch(q) {
    q = q.trim().toLowerCase();
    var pk = GLAM_PACKAGES.filter(function (p) { return !q || (p.name + " " + p.tag + " " + p.features.join(" ") + " " + p.category).toLowerCase().indexOf(q) > -1; });
    var pg = q ? INDEX.filter(function (x) { return x.t.toLowerCase().indexOf(q) > -1; }) : [];
    var h = "";
    if (pk.length) h += '<div class="sr-cap">Packages</div>' + pk.map(function (p) { return '<a href="' + pkgHref(p.id) + '"><img src="images/' + p.image + '" alt=""><div><b>' + p.name + "</b><span>" + p.priceLabel + "</span></div></a>"; }).join("");
    if (pg.length) h += '<div class="sr-cap">Pages</div>' + pg.map(function (x) { return '<a href="' + x.u + '"><div><b>' + x.t + "</b></div></a>"; }).join("");
    $("#sList").innerHTML = h || '<div class="empty" style="padding:30px">No results for “' + q.replace(/</g, "") + "”</div>";
  }
  $("#sInput").addEventListener("input", function (e) { renderSearch(e.target.value); });
  $("#sInput").addEventListener("keydown", function (e) { if (e.key === "Enter") { var a = $("#sList a"); if (a) location.href = a.getAttribute("href"); } });

  /* ---------- sync UI ---------- */
  function sync() {
    var b = $("#cartBadge"); if (b) { var n = Cart.list().length; b.textContent = n; b.dataset.n = n; }
    $$("[data-fav]").forEach(function (el) { el.classList.toggle("on", Fav.has(el.dataset.fav)); });
    $$("[data-add-state]").forEach(function (el) { el.textContent = Cart.has(el.dataset.addState) ? "In your cart ✓" : "Add to cart"; });
    renderAcct(); renderDrawers();
    document.dispatchEvent(new CustomEvent("glam:sync"));
  }
  window.syncUI = sync;

  /* ---------- global click handling ---------- */
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-act],[data-close],[data-fav],[data-add],[data-book],[data-rm],[data-unfav]");
    var pop = $("#acctPop");
    if (pop && pop.classList.contains("open") && !e.target.closest(".pop-wrap")) pop.classList.remove("open");
    if (!t) return;
    if (t.hasAttribute("data-close")) { closeAll(); return; }
    if (t.dataset.fav) { e.preventDefault(); e.stopPropagation(); Fav.toggle(t.dataset.fav); return; }
    if (t.dataset.book) { e.preventDefault(); Cart.add(t.dataset.book, false); location.href = "book-now.html"; return; }
    if (t.dataset.add) { e.preventDefault(); Cart.add(t.dataset.add); return; }
    if (t.dataset.rm) { e.preventDefault(); Cart.remove(t.dataset.rm); return; }
    if (t.dataset.unfav) { e.preventDefault(); Fav.toggle(t.dataset.unfav); return; }
    var a = t.dataset.act;
    if (a === "cart") openDrawer("cart");
    else if (a === "fav") openDrawer("fav");
    else if (a === "sign") openDrawer("sign");
    else if (a === "search") openDrawer("search");
    else if (a === "menu") openDrawer("menu");
    else if (a === "acct") { var o = pop.classList.contains("open"); closeAll(); if (!o) { renderAcct(); pop.classList.add("open"); } }
    else if (a === "login") { e.preventDefault(); var lu = Auth.user(); if (lu) location.href = lu.role === "artist" ? "/artist-dashboard" : "/dashboard"; else openDrawer("sign"); }
    else if (a === "signout") { Auth.out(); sync(); toast("Signed out"); if (page === "account") location.href = "index.html"; }
  });
  var nf = $("#newsForm");
  if (nf) nf.addEventListener("submit", function (e) {
    e.preventDefault(); var v = $("#nemail").value.trim();
    if (!/^\S+@\S+\.\S+$/.test(v)) { toast("Please enter a valid email"); return; }
    $("#nemail").value = ""; toast("Thanks — you're on the list");
  });
  document.addEventListener("click", function (e) { var a = e.target.closest("a[href^='index.html#']"); if (a && /index\.html$/.test(location.pathname.split("/").pop() || "index.html") ) { closeAll(); } });

  /* reveal on scroll */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }); }, { threshold: .12 }) : null;
  window.observeReveal = function (root) { $$(".rv-in", root).forEach(function (el) { if (io) io.observe(el); else el.classList.add("in"); }); };
  window.addEventListener("storage", sync);
  sync(); observeReveal();
})();
