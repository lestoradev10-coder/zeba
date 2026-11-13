/* Home page behaviour */
(function () {
  "use strict";
  var $ = window.$, $$ = window.$$, ic = window.ic;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- HERO slider ---------- */
  var slides = HERO_INTRO.map(function (s) {
    return { tag: s.tag, title: s.title, text: s.text, banner: s.banner, mobile: s.mobile, pos: s.pos, href: "packages.html", cta: "Explore packages" };
  }).concat(GLAM_PACKAGES.map(function (p) {
    return { tag: p.tag, title: p.heroTitle, text: p.short, banner: p.banner, mobile: p.bannerMobile, pos: p.pos, href: pkgHref(p.id), cta: "View package" };
  }));
  var hero = $("#hero"), DUR = 6500, cur = 0, timer, paused = false;
  hero.style.setProperty("--dur", DUR + "ms");
  hero.innerHTML = slides.map(function (s, i) {
    return '<div class="slide' + (i === 0 ? " on" : "") + '" style="--pos:' + s.pos + '" role="group" aria-roledescription="slide" aria-label="' + (i + 1) + " of " + slides.length + '">' +
      '<picture class="bg"><source media="(max-width:900px)" srcset="images/' + s.mobile + '"><img src="images/' + s.banner + '" alt="" ' + (i === 0 ? 'fetchpriority="high"' : 'loading="lazy"') + "></picture>" +
      '<div class="slide-c">' + (i === 0 ? "<h1>" : "<h2>") + s.title + (i === 0 ? "</h1>" : "</h2>") +
      "<p>" + s.text + '</p><a class="btn" href="' + s.href + '">' + s.cta + " " + ic("arrow") + "</a></div></div>";
  }).join("") +
    '<div class="hero-ctl"><button class="circle" id="hPrev" aria-label="Previous slide">' + ic("left") + '</button><button class="circle" id="hNext" aria-label="Next slide">' + ic("right") + '</button>' +
    '<div class="dots" id="hDots">' + slides.map(function (s, i) { return '<button aria-label="Go to slide ' + (i + 1) + '"' + (i === 0 ? ' class="on"' : "") + "></button>"; }).join("") + '</div>' +
    '<span class="count" id="hCount">01 / ' + String(slides.length).padStart(2, "0") + "</span></div>";
  var els = $$(".slide", hero), dots = $$("#hDots button");
  function go(n) {
    cur = (n + slides.length) % slides.length;
    els.forEach(function (e, i) { e.classList.toggle("on", i === cur); });
    dots.forEach(function (d, i) { d.classList.remove("on"); if (i === cur) { void d.offsetWidth; d.classList.add("on"); } });
    $("#hCount").textContent = String(cur + 1).padStart(2, "0") + " / " + String(slides.length).padStart(2, "0");
    restart();
  }
  function restart() { clearTimeout(timer); if (!paused) timer = setTimeout(function () { go(cur + 1); }, DUR); }
  $("#hPrev").onclick = function () { go(cur - 1); };
  $("#hNext").onclick = function () { go(cur + 1); };
  dots.forEach(function (d, i) { d.onclick = function () { go(i); }; });
  var tx = 0;
  hero.addEventListener("touchstart", function (e) { tx = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener("touchend", function (e) { var d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 50) go(cur + (d < 0 ? 1 : -1)); });
  document.addEventListener("visibilitychange", function () { if (document.hidden) clearTimeout(timer); else restart(); });
  restart();

  /* ---------- WORDS (scroll-driven) ---------- */
  var track = $("#wTrack"), words = $("#words");
  track.innerHTML = WORDS.map(function (w) {
    return '<div class="word' + (w.end ? " end" : "") + '"><img src="images/cutouts/' + w.cut + '" alt="">' + w.word + "</div>";
  }).join("");
  var wEls = $$(".word", track);
  function wordsTick() {
    var r = words.getBoundingClientRect(), vh = window.innerHeight, vw = window.innerWidth;
    var prog = Math.min(1, Math.max(0, -r.top / (r.height - vh)));
    var max = Math.max(0, track.scrollWidth - vw * .62);
    track.style.transform = "translate3d(" + (-prog * max) + "px,0,0)";
    var best = 0, bd = 1e9, focus = vw * .4;
    wEls.forEach(function (el, i) {
      var b = el.getBoundingClientRect(), d = Math.abs(b.left + b.width * .5 - focus);
      if (d < bd) { bd = d; best = i; }
    });
    wEls.forEach(function (el, i) { el.classList.toggle("on", i === best); });
  }

  /* ---------- SHELF ---------- */
  function dragScroll(el) {
    var down = false, sx = 0, sl = 0, moved = false;
    el.addEventListener("pointerdown", function (e) { if (e.pointerType !== "mouse") return; down = true; moved = false; sx = e.clientX; sl = el.scrollLeft; });
    window.addEventListener("pointermove", function (e) { if (!down) return; var d = e.clientX - sx; if (Math.abs(d) > 4) { moved = true; el.classList.add("drag"); } el.scrollLeft = sl - d; });
    window.addEventListener("pointerup", function () { down = false; setTimeout(function () { el.classList.remove("drag"); }, 0); });
    el.addEventListener("click", function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  }

/* ---------- About stats (count-up) ---------- */
  var stEl = $("#aboutStats");
  stEl.innerHTML = ABOUT_STATS.map(function (t) { return '<div><dt><span class="cnt" data-to="' + t[0] + '">0</span>' + t[1] + "</dt><dd>" + t[2] + "</dd></div>"; }).join("");
  function runCount() {
    $$(".cnt", stEl).forEach(function (c) {
      var to = +c.dataset.to, t0 = null, dur = 1800;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { c.textContent = to; return; }
      (function step(t) { if (!t0) t0 = t; var k = Math.min(1, (t - t0) / dur); c.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); })(performance.now());
    });
  }
  if ("IntersectionObserver" in window) {
    var stIO = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { runCount(); stIO.disconnect(); } }, { threshold: .4 });
    stIO.observe(stEl);
  } else { runCount(); }

/* ---------- Tiles ---------- */
  var tc = ["#e2d4ee", "#e2d4ee", "#e2d4ee", "#e2d4ee", "#e2d4ee", "#e2d4ee"];
  $("#tiles").innerHTML = GLAM_PACKAGES.map(function (p, i) {
    return '<a class="tile rv-in" href="' + pkgHref(p.id) + '" style="--c:' + tc[i] + '"><img class="pic" loading="lazy" src="images/' + p.image + '" alt="' + p.name + '">' +
      '<button class="fav' + (Fav.has(p.id) ? " on" : "") + '" data-fav="' + p.id + '" aria-label="Save ' + p.name + '">' + ic("heart") + "</button>" +
      '<div class="tile-t"><div><h3>' + p.name + "</h3><p>" + p.priceLabel + '</p></div><span class="go">' + ic("arrowUR") + "</span></div></a>";
  }).join("");

  /* ---------- HOW (sticky scroll steps) ---------- */
  var how = $("#how"), hTrack = $("#howTrack");
  hTrack.insertAdjacentHTML("beforeend", WORKFLOW.map(function (s) {
    return '<article class="how-card"><div class="how-img"><img loading="lazy" src="images/' + s.img + '" alt="' + s.title + '"></div><div class="how-tx"><div class="n">' + s.n + "</div><h3>" + s.title + "</h3><p>" + s.text + "</p></div></article>";
  }).join(""));
  var howMax = 0;
  function howTick() {
    if (window.innerWidth <= 900) { hTrack.style.transform = ""; how.style.height = ""; return; }
    howMax = Math.max(0, hTrack.scrollWidth - window.innerWidth + 48);
    how.style.height = (window.innerHeight + howMax * 1.1) + "px";
    var r = how.getBoundingClientRect();
    var prog = Math.min(1, Math.max(0, -r.top / (r.height - window.innerHeight)));
    hTrack.style.transform = "translate3d(" + (-prog * howMax) + "px,0,0)";
  }

/* ---------- Why ---------- */
  $("#whRow").innerHTML = REASONS.map(function (r, i) {
    return '<article class="why-c lv"><div class="why-img"><img loading="lazy" src="images/' + r.img + '" alt="' + r.title + '" draggable="false"></div><h3>' + r.title + "</h3><p>" + r.text + "</p></article>";
  }).join("");
  var whs = $("#whScroll");
  $("#whPrev").onclick = function () { whs.scrollBy({ left: -450, behavior: "smooth" }); };
  $("#whNext").onclick = function () { whs.scrollBy({ left: 450, behavior: "smooth" }); };
  dragScroll(whs);

/* ---------- Works ---------- */
  $("#wkRow").innerHTML = WORKS.map(function (w) {
    return '<article class="wk"><img loading="lazy" src="images/' + w.img + '" alt="' + w.title + '" draggable="false"></article>';
  }).join("");
  var ws = $("#wkScroll");
  $("#wkPrev").onclick = function () { ws.scrollBy({ left: -368, behavior: "smooth" }); };
  $("#wkNext").onclick = function () { ws.scrollBy({ left: 368, behavior: "smooth" }); };
  dragScroll(ws);

/* ---------- Reviews ---------- */
  function rvCard(r) {
    return '<figure class="rv"><div class="stars" aria-label="5 stars">★★★★★</div><q>' + r.text + '</q><figcaption class="rv-p"><img loading="lazy" src="images/' + r.img + '" alt=""><div><b>' + r.name + "</b><span>" + ic("shield") + "Verified bride</span></div></figcaption></figure>";
  }
  var r1 = REVIEWS.map(rvCard).join(""), r2 = REVIEWS.slice(3).concat(REVIEWS.slice(0, 3)).map(rvCard).join("");
  $("#rv1").innerHTML = r1 + r1 + r1 + r1; $("#rv2").innerHTML = r2 + r2 + r2 + r2;
  $$(".rv-row").forEach(function (r) { r.style.animationName = "mq4"; });
  var st = document.createElement("style"); st.textContent = "@keyframes mq4{to{transform:translateX(-25%)}}"; document.head.appendChild(st);
  var rvp = $("#rvPause"), rvw = $("#rvWrap"), rvPaused = false;
  function rvLabel() { rvp.innerHTML = ic(rvPaused ? "play" : "pause") + (rvPaused ? "Play" : "Pause"); rvp.setAttribute("aria-pressed", rvPaused); }
  rvp.onclick = function () { rvPaused = !rvPaused; rvw.classList.toggle("paused", rvPaused); rvLabel(); };
  rvLabel();

  /* ---------- FAQ ---------- */
  $("#faqList").innerHTML = FAQS.map(function (f, i) {
    return '<details class="q"><summary><i>' + String(i + 1).padStart(2, "0") + '</i><span class="qt">' + f.q + '</span><span class="pl">' + ic("plus") + '</span></summary><div class="ans">' + f.a + "</div></details>";
  }).join("");
  $$("#faqList details").forEach(function (d) { d.addEventListener("toggle", function () { if (d.open) $$("#faqList details").forEach(function (o) { if (o !== d) o.open = false; }); }); });

  /* ---------- Blog + insta ---------- */
  function post(b, cls) { return '<a class="' + cls + ' rv-in" href="' + b.href + '"><div class="ph"><img loading="lazy" src="' + (/^https?:/.test(b.img) ? b.img : "images/" + b.img) + '" alt="' + b.title + '"></div>' + (cls === "bl-big" ? "" : "<div>") + '<div class="meta"><span class="pill">' + b.cat + "</span>" + b.date + "</div><h3>" + b.title + "</h3>" + (cls === "bl-big" ? "" : "</div>") + "</a>"; }
  $("#blogG").innerHTML = post(BLOG[0], "bl-big") + '<div class="bl-side">' + post(BLOG[1], "bl-li") + post(BLOG[2], "bl-li") + "</div>";
  var ig = INSTA.map(function (s) { return '<a href="https://www.instagram.com/glambyzebaish" target="_blank" rel="noopener" aria-label="Open Instagram"><img loading="lazy" src="images/' + s + '" alt="" draggable="false">' + ic("insta") + "</a>"; }).join("");
  $("#insta").innerHTML = ig + ig;


/* ---------- scroll loop ---------- */
  var ticking = false;
  function onScroll() { if (ticking) return; ticking = true; requestAnimationFrame(function () { wordsTick(); howTick(); ticking = false; }); }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
  window.observeReveal(document);
  document.addEventListener("glam:sync", function () { $$("#tiles [data-fav]").forEach(function (b) { b.classList.toggle("on", Fav.has(b.dataset.fav)); }); });
})();
