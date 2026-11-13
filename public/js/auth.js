/* Glam by Zebaish — customer + artist login, register, forgot / reset password.
   Same Zeba-main backend and same localStorage keys (user, userToken, userRole, rememberedEmail),
   so checkout, dashboards and the API behave exactly as before. */
(function () {
  var $ = window.$, ic = window.ic;
  var page = document.body.dataset.auth;
  var q = new URLSearchParams(location.search);
  var redirect = q.get("redirect");
  var API = (window.GLAM_API_BASE || "");
  var art = page === "artist-login" || page === "artist-register" || (page === "forgot" || page === "reset") && q.get("role") === "artist";
  var role = art ? "artist" : "customer";
  var EYE = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
  var EYEOFF = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.9 17.9A10.7 10.7 0 0 1 12 19c-6.4 0-10-7-10-7a18 18 0 0 1 5.1-5.9M9.9 4.2A9.8 9.8 0 0 1 12 5c6.4 0 10 7 10 7a18 18 0 0 1-2.2 3.2M1 1l22 22M14.1 14.1a3 3 0 1 1-4.2-4.2"/></svg>';

  function withRedirect(h) { if (!redirect) return h; return h + (h.indexOf("?") > -1 ? "&" : "?") + "redirect=" + encodeURIComponent(redirect); }
  function withRole(h) { return art ? h + (h.indexOf("?") > -1 ? "&" : "?") + "role=artist" : h; }
  function go(url) { location.href = url; }

  /* already signed in? same rules as the Zeba pages */
  var signedUser = localStorage.getItem("user"), signedRole = localStorage.getItem("userRole") === "artist" ? "artist" : "customer";
  if (signedUser && (page === "login" || page === "artist-login") && signedRole === role) { go(redirect || (art ? "/artist-dashboard" : "/dashboard")); return; }
  if (signedUser && page === "forgot" && signedRole === role) { go(art ? "/artist-dashboard" : "/dashboard"); return; }

  function sv(p) { return '<svg class="i" viewBox="0 0 24 24" aria-hidden="true">' + p + "</svg>"; }
  var G = {
    user: window.ic("user"), mail: window.ic("mail"), phone: window.ic("phone"), lock: window.ic("lock"), pin: window.ic("pin"), brush: window.ic("brush"),
    tag: sv('<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.2"/>'),
    star: sv('<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>'),
    note: sv('<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/>')
  };
  var PERK = {
    gem: '<path d="M6 3h12l4 6-10 13L2 9z"/><path d="M11 3 8 9l4 13 4-13-3-6M2 9h20"/>',
    heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/>',
    gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    brush: '<path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 21v-1a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v1M17 4.5a3.5 3.5 0 0 1 0 7M22 21v-1a6 6 0 0 0-4-5.6"/>'
  };
  function perk(k, t) { return '<li><span class="pi"><svg viewBox="0 0 24 24" aria-hidden="true">' + PERK[k] + "</svg></span>" + t + "</li>"; }
  function pw(id, label, ph, auto, half) {
    return '<div class="fld"><label for="' + id + '">' + label + '</label><div class="in pw">' + G.lock + '<input id="' + id + '" type="password" placeholder="' + ph + '" autocomplete="' + auto + '"><button type="button" data-eye="' + id + '" aria-label="Show password">' + EYE + "</button></div></div>";
  }
  function fld(id, label, type, ph, auto, icon) { return '<div class="fld"><label for="' + id + '">' + label + '</label><div class="in">' + (G[icon] || G.user) + '<input id="' + id + '" type="' + type + '" placeholder="' + ph + '"' + (auto ? ' autocomplete="' + auto + '"' : "") + "></div></div>"; }
  function seg(a, b) {
    return '<div class="seg"><a href="' + withRedirect(a) + '" class="' + (art ? "" : "on") + '">Customer</a><a href="' + withRedirect(b) + '" class="' + (art ? "on" : "") + '">Makeup artist</a></div>';
  }
  function msg(id, cls, text) { return '<div class="auth-msg ' + cls + '" id="' + id + '" role="alert"><span id="' + id + 'Text">' + (text || "") + "</span></div>"; }
  function show(id, text) { var b = $("#" + id); if (!b) return; $("#" + id + "Text").textContent = text; b.classList.add("show"); b.scrollIntoView({ behavior: "smooth", block: "center" }); }
  function hide(id) { var b = $("#" + id); if (b) b.classList.remove("show"); }
  function busy(btn, on, label) { btn.disabled = on; btn.textContent = on ? label : btn.dataset.label; }

  var ROLE_LABEL = art ? "Makeup artist account" : "Customer account";
  function shell(inner, top, icon) {
    var root = $("#authRoot");
    root.classList.toggle("top", !!top);
    var hero = "";
    if (top) hero = art
      ? '<div class="auth-hero"><h2 class="one">Join Our <em>Artist</em><span>Community</span></h2><i class="rule"></i><p>Share your talent, grow your career, and be part of something beautiful.</p><ul class="auth-perks">' + perk("brush", "Showcase Your Skills") + perk("star", "Get More Opportunities") + perk("users", "Grow with Glam by Zebaish") + "</ul></div>"
      : '<div class="auth-hero"><h2>Join Our<em>Glam Community</em></h2><i class="rule"></i><p>Create your account and be part of our beauty family.</p><ul class="auth-perks">' + perk("gem", "Discover Exclusive Offers") + perk("heart", "Book Your Favorite Services") + perk("brush", "Get Professional Makeup Artist") + "</ul></div>";
    root.innerHTML = hero + '<div class="auth-f' + (top ? " wide" : "") + '"><div class="auth-badge"><span class="auth-ico">' + ic(icon || (art ? "brush" : "user")) + '</span><span class="auth-role">' + ROLE_LABEL + "</span></div>" + inner + "</div>";
    if (top) {
      /* line the hero heading up with the first form field, whatever fonts / viewport are in use */
      var alignHero = function () {
        var h = root.querySelector(".auth-hero"), f = root.querySelector(".auth-f"), l = f && f.querySelector(".fld");
        if (!h || !l) return;
        h.style.marginTop = window.innerWidth > 980 ? Math.max(0, Math.round(l.getBoundingClientRect().top - f.getBoundingClientRect().top)) + "px" : "";
      };
      alignHero(); window.addEventListener("resize", alignHero); window.addEventListener("load", alignHero);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(alignHero);
    }
    $$("[data-eye]").forEach(function (b) {
      b.addEventListener("click", function () {
        var i = $("#" + b.dataset.eye), p = i.type === "password"; i.type = p ? "text" : "password";
        b.innerHTML = p ? EYEOFF : EYE; b.setAttribute("aria-label", p ? "Hide password" : "Show password");
      });
    });
  }
  var $$ = window.$$;
  function title(t) { document.title = t + " — Glam by Zebaish"; }

  /* ---------------- login (customer + artist) ---------------- */
  function loginPage() {
    var endpoint = art ? "/api/artist/login" : "/api/auth/login", dest = art ? "/artist-dashboard" : "/dashboard";
    title(art ? "Artist login" : "Login");
    shell("<h1>" + (art ? "Welcome back, artist" : "Welcome back") + "</h1><p>" + (art ? "Login to your artist account" : "Login to your account") + "</p>" +
      msg("loginError", "err") +
      '<form id="aForm" novalidate>' + fld("loginEmail", "Email", "email", "you@example.com", "email", "mail") + pw("loginPassword", "Password", "••••••••", "current-password") +
      '<div class="auth-row"><label class="chk"><input type="checkbox" id="rememberMe"> Remember me</label><a href="' + withRedirect(withRole("forgot-password.html")) + '">Forgot password?</a></div>' +
      '<button class="btn block" type="submit" id="loginSubmitBtn" data-label="Login">Login</button></form>' +
      '<p class="alt">' + (art ? "Don’t have an artist account? " : "Don’t have an account? ") + '<a href="' + withRedirect(art ? "artist-register.html" : "register.html") + '">' + (art ? "Register as Artist" : "Register") + "</a></p>");
    var re = localStorage.getItem("rememberedEmail"); if (re) { $("#loginEmail").value = re; $("#rememberMe").checked = true; }
    $("#aForm").addEventListener("submit", function (e) {
      e.preventDefault(); hide("loginError");
      var email = $("#loginEmail").value.trim(), password = $("#loginPassword").value, btn = $("#loginSubmitBtn");
      if (!email || !password) return show("loginError", "Please fill in all fields");
      if (email.indexOf("@") < 0) return show("loginError", "Please enter a valid email address");
      busy(btn, true, "Logging in…");
      fetch(API + endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email, password: password }) })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (d.success) {
            localStorage.setItem("user", JSON.stringify(d.user)); localStorage.setItem("userToken", d.token); localStorage.setItem("userRole", role);
            if ($("#rememberMe").checked) localStorage.setItem("rememberedEmail", email); else localStorage.removeItem("rememberedEmail");
            go(redirect || dest);
          } else { show("loginError", d.error || "Login failed. Please check your credentials."); busy(btn, false); }
        })
        .catch(function () { show("loginError", "An error occurred. Please try again."); busy(btn, false); });
    });
  }

  /* ---------------- register (customer + artist) ---------------- */
  function registerPage() {
    var dest = art ? "/artist-dashboard" : "/dashboard";
    title(art ? "Join as an artist" : "Create account");
    var artistFields = art ? '<p class="auth-sec">Artist details</p>' +
      '<div class="fld"><label for="regBio">About you</label><div class="in ta">' + G.note + '<textarea id="regBio" placeholder="Tell us about your experience, training, and style..."></textarea></div></div>' +
      '<div class="row2">' + fld("regSpecialties", "Specialties", "text", "e.g. Bridal, HD Makeup", "", "star") +
      fld("regLocation", "City / service location", "text", "City / Service Location", "", "pin") + "</div>" +
      '<div class="fld"><label for="regIdProof">Upload ID proof</label><input id="regIdProof" type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"><span class="hint">Accepted formats: PDF, JPG, PNG · Max 5MB</span></div>' : "";
    shell("<h1>" + (art ? "Join as an artist" : "Create account") + "</h1><p>" + (art ? "Join Glam by Zebaish today as a makeup artist" : "Join Glam by Zebaish today") + "</p>" +
      msg("registerError", "err") +
      '<form id="aForm" novalidate>' + fld("regName", "Full name", "text", "Full Name", "name", "user") + fld("regEmail", "Email", "email", "you@example.com", "email", "mail") +
      '<div class="row2">' + fld("regPhone", "Phone", "tel", "+91 98765 43210", "tel", "phone") + pw("regPassword", "Password", "Create a password", "new-password") + "</div>" +
      fld("regReferral", "Referral code (optional)", "text", "Referral Code (optional)", "", "tag") + artistFields +
      '<label class="chk terms"><input type="checkbox" id="regTerms"><span>I agree to the <a href="terms.html" target="_blank" rel="noopener">Terms &amp; Conditions</a></span></label>' +
      '<button class="btn block" type="submit" id="registerSubmitBtn" data-label="' + (art ? "Submit Application" : "Create Account") + '">' + (art ? "Submit Application" : "Create Account") + "</button></form>" +
      '<p class="alt">' + (art ? "Already have an artist account? " : "Already have an account? ") + '<a href="' + withRedirect(art ? "artist-login.html" : "login.html") + '">Login</a></p>', true);
    $("#aForm").addEventListener("submit", function (e) {
      e.preventDefault(); hide("registerError");
      var v = function (id) { return $("#" + id).value.trim(); };
      var name = v("regName"), email = v("regEmail"), phone = v("regPhone"), password = $("#regPassword").value, ref = v("regReferral"), btn = $("#registerSubmitBtn");
      if (!name || name.length < 2) return (show("registerError", "Please enter your full name"), $("#regName").focus());
      if (!email || email.indexOf("@") < 0 || email.indexOf(".") < 0) return (show("registerError", "Please enter a valid email address"), $("#regEmail").focus());
      if (!phone || phone.replace(/\D/g, "").length < 10) return (show("registerError", "Please enter a valid phone number (minimum 10 digits)"), $("#regPhone").focus());
      if (!password || password.length < 6) return (show("registerError", "Password must be at least 6 characters long"), $("#regPassword").focus());
      if (!$("#regTerms").checked) return show("registerError", "Please agree to the Terms & Conditions to create an account.");
      var opts;
      if (art) {
        var bio = v("regBio"), spec = v("regSpecialties"), loc = v("regLocation"), f = $("#regIdProof").files && $("#regIdProof").files[0];
        if (!bio || bio.length < 20) return (show("registerError", "Please tell us a bit more about your experience (at least 20 characters)"), $("#regBio").focus());
        if (!spec) return (show("registerError", "Please list at least one specialty"), $("#regSpecialties").focus());
        if (!loc) return (show("registerError", "Please enter your service location"), $("#regLocation").focus());
        if (!f) return show("registerError", "Please upload an ID proof (PDF, JPG, or PNG)");
        if (["application/pdf", "image/jpeg", "image/jpg", "image/png"].indexOf(f.type) < 0) return show("registerError", "ID proof must be a PDF, JPG, or PNG file");
        if (f.size > 5 * 1024 * 1024) return show("registerError", "ID proof file must be under 5MB");
        var fd = new FormData();
        fd.append("role", "artist"); fd.append("name", name); fd.append("email", email); fd.append("phone", phone); fd.append("password", password);
        if (ref) fd.append("referralCode", ref);
        fd.append("bio", bio); fd.append("specialties", spec); fd.append("location", loc); fd.append("idProof", f);
        opts = { method: "POST", body: fd };
      } else {
        opts = { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role: "customer", name: name, email: email, phone: phone, password: password, referralCode: ref || null }) };
      }
      busy(btn, true, art ? "Submitting application…" : "Creating account…");
      fetch(API + "/api/auth/register", opts).then(function (r) { return r.json(); }).then(function (d) {
        if (d.success) {
          localStorage.setItem("user", JSON.stringify(d.user)); localStorage.setItem("userToken", d.token); localStorage.setItem("userRole", role);
          if (art) { window.toast("Welcome, " + (d.user.name || name).split(" ")[0] + " — your profile has been submitted for review"); setTimeout(function () { go(redirect || dest); }, 1800); }
          else go(redirect || dest);
        } else { show("registerError", d.error || "Registration failed. Please try again."); busy(btn, false); }
      }).catch(function () { show("registerError", "An error occurred. Please check your internet connection and try again."); busy(btn, false); });
    });
  }

  /* ---------------- forgot password ---------------- */
  function forgotPage() {
    title("Reset password");
    shell("<h1>Reset password</h1><p>" + (art ? "Enter your email and we’ll send you a link to reset your artist password" : "Enter your email and we’ll send you a link to reset your password") + "</p>" +
      msg("forgotError", "err") + msg("forgotSuccess", "ok", "If an account exists for that email, a reset link has been sent.") +
      '<form id="aForm" novalidate>' + fld("forgotEmail", "Email", "email", "you@example.com", "email", "mail") + '<button class="btn block" type="submit" id="forgotSubmitBtn" data-label="Send Reset Link">Send Reset Link</button></form>' +
      '<p class="alt">Remembered your password? <a href="' + (art ? "artist-login.html" : "login.html") + '">Back to Login</a></p>', false, "lock");
    $("#aForm").addEventListener("submit", function (e) {
      e.preventDefault(); hide("forgotError"); hide("forgotSuccess");
      var email = $("#forgotEmail").value.trim(), btn = $("#forgotSubmitBtn");
      if (!email || email.indexOf("@") < 0) return show("forgotError", "Please enter a valid email address");
      busy(btn, true, "Sending…");
      var ctl = new AbortController(), t = setTimeout(function () { ctl.abort(); }, 15000);
      fetch(API + "/api/auth/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email, role: role }), signal: ctl.signal })
        .then(function (r) { return r.json().then(function (d) { return [r, d]; }, function () { throw new Error("Unexpected response from the server. Please try again."); }); })
        .then(function (x) {
          clearTimeout(t);
          if (x[0].ok && x[1].success) { $("#aForm").style.display = "none"; show("forgotSuccess", x[1].message || "If an account exists for that email, a reset link has been sent."); window.toast("Reset link sent — check your inbox"); }
          else show("forgotError", x[1].error || "Something went wrong. Please try again.");
          busy(btn, false);
        })
        .catch(function (err) { clearTimeout(t); show("forgotError", err.name === "AbortError" ? "Request timed out. Please check your connection and try again." : (err.message || "An error occurred. Please try again.")); busy(btn, false); });
    });
  }

  /* ---------------- reset password ---------------- */
  function resetPage() {
    title("Set new password");
    var token = q.get("token");
    shell("<h1>Set new password</h1><p>Choose a new password for your account</p>" +
      msg("resetTokenInvalid", "err", "This reset link is invalid or has expired.") + msg("resetError", "err") + msg("resetSuccess", "ok", "Your password has been reset successfully.") +
      '<form id="aForm" novalidate>' + pw("resetPassword", "New password", "New password (min. 6 characters)", "new-password") + pw("resetPasswordConfirm", "Confirm password", "Confirm new password", "new-password") +
      '<button class="btn block" type="submit" id="resetSubmitBtn" data-label="Reset Password">Reset Password</button></form>' +
      '<p class="alt">Remembered your password? <a href="' + (art ? "artist-login.html" : "login.html") + '">Back to Login</a></p>', false, "lock");
    function invalid(m) { $("#aForm").style.display = "none"; show("resetTokenInvalid", m); }
    if (!token) return invalid("This reset link is missing its token. Please request a new one.");
    fetch(API + "/api/auth/reset-password?token=" + encodeURIComponent(token) + "&role=" + role).then(function (r) { return r.json(); })
      .then(function (d) { if (!d.success) invalid(d.error || "This reset link is invalid or has expired."); })
      .catch(function () { invalid("Could not verify this reset link. Please try again."); });
    $("#aForm").addEventListener("submit", function (e) {
      e.preventDefault(); hide("resetError");
      var p = $("#resetPassword").value, c = $("#resetPasswordConfirm").value, btn = $("#resetSubmitBtn");
      if (!p || p.length < 6) return show("resetError", "Password must be at least 6 characters");
      if (p !== c) return show("resetError", "Passwords do not match");
      busy(btn, true, "Resetting…");
      var ctl = new AbortController(), t = setTimeout(function () { ctl.abort(); }, 15000);
      fetch(API + "/api/auth/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: token, password: p, role: role }), signal: ctl.signal })
        .then(function (r) { return r.json().then(function (d) { return [r, d]; }, function () { throw new Error("Unexpected response from the server. Please try again."); }); })
        .then(function (x) {
          clearTimeout(t);
          if (x[0].ok && x[1].success) { $("#aForm").style.display = "none"; show("resetSuccess", x[1].message || "Your password has been reset successfully."); window.toast(x[1].message || "Password reset"); setTimeout(function () { go(art ? "artist-login.html" : "login.html"); }, 2500); }
          else { show("resetError", x[1].error || "Could not reset your password. Please try again."); busy(btn, false); }
        })
        .catch(function (err) { clearTimeout(t); show("resetError", err.name === "AbortError" ? "Request timed out. Please check your connection and try again." : (err.message || "An error occurred. Please try again.")); busy(btn, false); });
    });
  }

  ({ login: loginPage, "artist-login": loginPage, register: registerPage, "artist-register": registerPage, forgot: forgotPage, reset: resetPage })[page]();
})();
