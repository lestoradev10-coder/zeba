/* Glam by Zebaish — Customer Reviews (package page)
   - No reviews yet  -> same empty state as the Zeba main site (☆ ☆ ☆ ☆ ☆ / "Be the first to write a review" / Write a review + Ask a question)
   - Reviews exist   -> rating summary with star bars + review cards (photos, verified badge, "Read all reviews")
   Data: GET /api/reviews?packageSlug=<id>&limit=20 -> { success, stats:{average,total,breakdown:{5..1}}, reviews:[{rating,title,comment,images,createdAt,customerName,artistName}] }
   Offline / no API: you can also pre-fill window.GLAM_REVIEWS = { "<package-id>": { stats:{...}, reviews:[...] } } */
(function () {
  "use strict";
  var SHOW = 3;
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function stars(n, cls) {
    var full = Math.round(n), o = "";
    for (var i = 1; i <= 5; i++) o += '<span class="' + (i <= full ? "on" : "") + '">★</span>';
    return '<span class="rvw-st ' + (cls || "") + '" aria-label="' + Number(n).toFixed(1) + ' out of 5">' + o + "</span>";
  }
  function fmt(iso) { try { return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); } catch (e) { return ""; } }
  function root() { return document.getElementById("customer-reviews"); }

  function head() { return '<div class="sec-head"><h2 class="h2" style="font-size:clamp(2rem,4vw,3.4rem)">Customer Reviews</h2></div>'; }

  function actions(pkg) {
    return '<div class="rvw-actions"><button type="button" class="rbtn" id="rvwWrite">Write a review</button>' +
      '<a class="rbtn ghost" id="rvwAsk" href="contact.html">Ask a question</a></div>';
  }

  function renderEmpty(pkg) {
    root().innerHTML = head() +
      '<div class="rvw-panel rvw-empty"><div class="rvw-sum"><div class="rvw-st none" aria-label="No reviews yet">☆ ☆ ☆ ☆ ☆</div><p>Be the first to write a review</p></div>' +
      '<div class="rvw-div" aria-hidden="true"></div>' + actions(pkg) + "</div>";
    wire(pkg);
  }

  function renderFull(pkg, data) {
    var st = data.stats, rs = data.reviews || [], total = st.total || rs.length;
    var avg = st.average || (rs.reduce(function (a, r) { return a + r.rating; }, 0) / (rs.length || 1));
    var br = st.breakdown || (function () { var b = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }; rs.forEach(function (r) { b[r.rating]++; }); return b; })();
    var max = Math.max(1, br[5], br[4], br[3], br[2], br[1]);
    var bars = [5, 4, 3, 2, 1].map(function (k) {
      return '<div class="rvw-bar"><span>' + k + '</span><i><b style="width:' + Math.round((br[k] || 0) / max * 100) + '%"></b></i><em>' + (br[k] || 0) + "</em></div>";
    }).join("");
    function card(r, i) {
      var imgs = (r.images || []).map(function (u) { return '<img src="' + esc(u) + '" alt="Customer photo" loading="lazy" data-lb="' + esc(u) + '">'; }).join("");
      return '<article class="rvw-card' + (i >= SHOW ? " more" : "") + '"' + (i >= SHOW ? " hidden" : "") + '>' +
        '<div class="rvw-h"><span class="rvw-av">' + esc((r.customerName || "?").charAt(0).toUpperCase()) + '</span>' +
        '<div class="rvw-who"><b>' + esc(r.customerName) + '</b><small>' + esc(fmt(r.createdAt)) + '</small></div>' +
        '<div class="rvw-r"><b>' + Number(r.rating).toFixed(1) + "</b>" + stars(r.rating) + "</div></div>" +
        (r.title ? '<h4 class="rvw-t">' + esc(r.title) + "</h4>" : "") +
        (r.comment ? "<p>" + esc(r.comment) + "</p>" : "") +
        (imgs ? '<div class="rvw-img">' + imgs + "</div>" : "") +
        (r.artistName ? '<div class="rvw-art">Makeup by ' + esc(r.artistName) + "</div>" : "") + "</article>";
    }
    root().innerHTML = head() +
      '<div class="rvw-panel rvw-full"><div class="rvw-top"><div class="rvw-big"><b>' + Number(avg).toFixed(1) + "</b>" + stars(avg, "lg") + "<small>(" + total + " rating" + (total === 1 ? "" : "s") + ")</small></div>" +
      '<div class="rvw-bars">' + bars + "</div>" + actions(pkg) + "</div>" +
      '<div class="rvw-list">' + rs.map(card).join("") + "</div>" +
      (rs.length > SHOW ? '<button type="button" class="rvw-all" id="rvwAll">Read all reviews <svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button>' : "") + "</div>";
    wire(pkg);
    var all = document.getElementById("rvwAll");
    if (all) all.onclick = function () {
      Array.prototype.forEach.call(root().querySelectorAll(".rvw-card.more"), function (c) { c.hidden = false; });
      all.remove();
    };
    root().addEventListener("click", function (e) {
      var u = e.target && e.target.getAttribute && e.target.getAttribute("data-lb");
      if (!u) return;
      var b = document.createElement("div"); b.className = "rvw-lb";
      b.innerHTML = '<span aria-hidden="true">&times;</span><img src="' + esc(u) + '" alt="Review photo">';
      b.onclick = function () { b.remove(); }; document.body.appendChild(b);
    });
  }

  function wire(pkg) {
    var w = document.getElementById("rvwWrite");
    if (!w) return;
    w.onclick = function () {
      var u = window.Auth && window.Auth.user();
      if (!u) { window.toast && window.toast("Please log in to write a review"); setTimeout(function () { location.href = "login.html"; }, 700); return; }
      var token = null; try { token = localStorage.getItem("userToken"); } catch (e) {}
      if (!token) { window.toast && window.toast("Book this package to leave a verified review"); return; }
      fetch("/api/reviews/eligibility?packageSlug=" + encodeURIComponent(pkg.id), { headers: { Authorization: "Bearer " + token } })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (d && d.canReview) window.toast && window.toast("Review form opens here once the API is connected");
          else if (d && d.alreadyReviewed) window.toast && window.toast("You have already reviewed this package");
          else window.toast && window.toast("Book this package to leave a verified review");
        })
        .catch(function () { window.toast && window.toast("Book this package to leave a verified review"); });
    };
  }

  function mount(pkg) {
    if (!root()) return;
    var pre = window.GLAM_REVIEWS && window.GLAM_REVIEWS[pkg.id];
    if (pre && pre.reviews && pre.reviews.length) { renderFull(pkg, { stats: pre.stats || {}, reviews: pre.reviews }); return; }
    renderEmpty(pkg);
    if (!window.fetch) return;
    fetch("/api/reviews?packageSlug=" + encodeURIComponent(pkg.id) + "&limit=20")
      .then(function (r) { return r.json(); })
      .then(function (d) { if (d && d.success && d.reviews && d.reviews.length) renderFull(pkg, d); })
      .catch(function () { /* keep empty state */ });
  }
  window.GlamReviews = { mount: mount };
})();
