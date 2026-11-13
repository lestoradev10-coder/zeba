/* Glam by Zebaish — blog list + article renderer */
(function () {
  var $ = window.$, $$ = window.$$, ic = window.ic, P = BLOG_POSTS, page = document.body.dataset.page;
  var WA = '<svg class="i" viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" stroke="none" d="M16.04 3C9.4 3 4 8.35 4 14.95c0 2.35.7 4.54 1.9 6.39L4 29l7.85-1.85a12.1 12.1 0 0 0 4.19.74C22.66 27.9 28 22.55 28 15.95S22.66 3 16.04 3zm0 22.1c-1.33 0-2.62-.34-3.76-.97l-.27-.15-4.66 1.1 1.14-4.5-.18-.29a9.1 9.1 0 0 1-1.4-4.85c0-5.02 4.12-9.1 9.2-9.1s9.2 4.08 9.2 9.1-4.12 9.66-9.27 9.66zm5.04-6.9c-.28-.14-1.64-.8-1.9-.9-.25-.09-.44-.14-.62.14-.18.27-.72.9-.88 1.08-.16.18-.32.2-.6.07-.27-.14-1.16-.42-2.2-1.34-.82-.72-1.37-1.6-1.53-1.87-.16-.27-.02-.42.12-.55.12-.12.27-.32.4-.48.14-.16.18-.27.27-.46.09-.18.05-.34-.02-.48-.07-.14-.62-1.48-.85-2.03-.22-.53-.45-.46-.62-.47h-.53c-.18 0-.48.07-.73.34-.25.27-.96.93-.96 2.28s.98 2.64 1.12 2.82c.14.18 1.93 2.93 4.67 4.1.65.28 1.16.45 1.56.58.65.2 1.25.18 1.72.11.52-.08 1.64-.67 1.87-1.31.23-.64.23-1.19.16-1.31-.07-.12-.25-.18-.53-.32z"/></svg>';
  var BULB = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2V17h6v-.3c0-.8.4-1.5 1-2A7 7 0 0 0 12 2z"/></svg>';
  var IG = "https://www.instagram.com/glambyzebaish?igsi=MWhrbGJhYmI1OWQxaA%3D%3D&utm_source=qr";
  function im(x) { return /^https?:/.test(x) ? x : "images/" + x; }
  function href(p) { return p.slug + ".html"; }
  function card(p) {
    return '<article class="bp-card rv-in"><a class="ph" href="' + href(p) + '"><img loading="lazy" src="' + im(p.img) + '" alt="' + p.title + '"></a>' +
      '<div class="bp-meta"><span class="bp-pill">' + p.cat + "</span>" + p.date + '</div><h3><a href="' + href(p) + '">' + p.title + "</a></h3><p>" + p.excerpt + '</p>' +
      '<a class="bp-more" href="' + href(p) + '">Read more ' + ic("arrow") + "</a></article>";
  }
  function insta() {
    var ig = ["ins1.webp", "ins2.webp", "ins3.webp", "ins4.webp", "ins5.webp", "ins6.webp", "b1.webp", "b2.webp", "b3.webp"].map(function (s) { return '<a href="https://www.instagram.com/glambyzebaish" target="_blank" rel="noopener" aria-label="Open Instagram"><img loading="lazy" src="images/' + s + '" alt="" draggable="false">' + ic("insta") + "</a>"; }).join("");
    $("#insta").innerHTML = ig + ig;
  }

  if (page === "blog") {
    var f = P[0];
    $("#bpFeat").innerHTML = '<a class="ph" href="' + href(f) + '"><img src="' + im(f.img) + '" alt="' + f.title + '"></a><div><div class="bp-meta"><span class="bp-pill gold">Featured</span><span class="bp-pill">' + f.cat + "</span>" + f.date + "</div><h2>" + f.title + "</h2><p>" + f.featured + '</p><a class="btn" href="' + href(f) + '">Read more ' + ic("arrow", "gold") + "</a></div>";
    $("#bpGrid").innerHTML = P.map(card).join("");
  } else {
    var slug = document.body.dataset.post, p = P.filter(function (x) { return x.slug === slug; })[0], i;
    var body = p.paras.map(function (t, n) {
      return (n === p.tipAt ? '<div class="post-tip"><span class="ico">' + BULB + '</span><div><b>Pro tip</b><p>' + p.tip + "</p></div></div>" : "") + "<p>" + t + "</p>";
    }).join("");
    var url = location.href.split("#")[0], ttl = encodeURIComponent(p.title);
    var SVG = function (c, d, vb) { return '<svg viewBox="' + (vb || "0 0 24 24") + '" aria-hidden="true" fill="' + c + '"><path d="' + d + '"/></svg>'; };
    var FB = SVG("#1877F2", "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z");
    var XX = SVG("#000000", "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z");
    var WAC = WA.replace('<svg class="i"', '<svg').replace('fill="currentColor"', 'fill="#25D366"');
    var PIN = SVG("#E60023", "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z");
    var LI = SVG("#0A66C2", "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z");
    var IGC = '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="#E1306C" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="5.5"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.6" r=".6" fill="#E1306C"/></g></svg>';
    var LINK = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#4a1766" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.7-1.7"/></svg>';
    var A = function (cls, label, href, svg) { return '<a class="' + cls + '" target="_blank" rel="noopener" aria-label="' + label + '" title="' + label + '" href="' + href + '">' + svg + "</a>"; };
    var shareRow = '<div class="sh">' +
      A("s-fb", "Share on Facebook", "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url), FB) +
      A("s-x", "Share on X", "https://twitter.com/intent/tweet?text=" + ttl + "&url=" + encodeURIComponent(url), XX) +
      A("s-wa", "Share on WhatsApp", "https://wa.me/?text=" + encodeURIComponent("Check out this article: " + p.title + " - " + url), WAC) +
      A("s-pin", "Share on Pinterest", "https://pinterest.com/pin/create/button/?url=" + encodeURIComponent(url) + "&media=" + encodeURIComponent(new URL(im(p.img), location.href).href) + "&description=" + ttl, PIN) +
      A("s-li", "Share on LinkedIn", "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(url), LI) +
      A("s-ig", "Instagram", IG, IGC) +
      '<button type="button" class="s-cp" aria-label="Copy link" title="Copy link">' + LINK + "</button></div>";
    var picks = P.filter(function (x) { return x.slug !== slug; }).slice(0, 4).map(function (x) {
      return '<a class="as-pick" href="' + href(x) + '"><img loading="lazy" src="' + im(x.img) + '" alt=""><span><small>' + x.cat + "</small><b>" + x.title + "</b></span></a>";
    }).join("");
    $("#postRoot").innerHTML =
      '<div class="art-main"><span class="art-cat">' + p.cat + '</span><h1>' + p.title + '</h1><div class="art-meta"><b>Glam by Zebaish</b> &nbsp;/&nbsp; ' + p.date + "</div>" +
      '<div class="share-m">' + shareRow + "</div>" +
      '<p class="art-lead">' + p.excerpt + "</p>" +
      '<figure class="art-hero"><img src="' + im(p.img) + '" alt="' + p.title + '"></figure>' +
      '<div class="art-body">' + body + "</div>" +
      '<div class="art-foot"><div class="post-tags">' + p.tags.map(function (t) { return "<span>" + t + "</span>"; }).join("") + '</div></div></div>' +
      '<aside class="art-aside"><div class="sh-wrap"><div class="sh-t">Share this article</div>' + shareRow + "</div>" +
      '<div><div class="sh-t">Editor’s picks</div>' + picks + "</div>" +
      '<div class="as-cta"><h3>Ready to glow?</h3><p>Let’s create your dream look together. Book a consultation today.</p><a class="btn" href="packages.html">View packages</a></div></aside>';
    $$(".s-cp").forEach(function (b) {
      b.addEventListener("click", function () {
        var done = function () { b.classList.add("ok"); setTimeout(function () { b.classList.remove("ok"); }, 1600); };
        if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, done); else done();
      });
    });
    var cb = document.querySelector(".crumb.pill b"); if (cb) cb.textContent = p.title;
    document.title = p.title + " — Glam by Zebaish";
  }
  insta(); window.observeReveal && window.observeReveal();
})();
