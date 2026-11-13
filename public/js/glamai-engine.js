/* ============================================================
   Glam AI engine - answers ONLY from the website knowledge base
   (glamai-kb.js). No internet, no external AI. If nothing in the
   knowledge base matches well enough it says so (confident=false).
   ============================================================ */
(function (root) {
  'use strict';

  var STOP = {};
  ('a an the and or but if of to in on at by for from with about as is are was were be been being am do does did ' +
   'have has had can could will would shall should may might must i me my we our us you your he she it its they ' +
   'them their this that these those there here what which who whom whose when where why how also any some more ' +
   'most very just so than then too not no yes please tell show give know want need like get got let hi hello hey ' +
   'whats available availability ok okay kindly regarding become way able info information details detail provide provides providing provided').split(' ').forEach(function (w) { STOP[w] = 1; });

  // words that mean the same thing for this website
  var SYN = {
    cost: 'price', fee: 'price', fees: 'price', charge: 'price', charges: 'price', rate: 'price', rates: 'price', pay: 'price', payment: 'price', afford: 'price', quote: 'price', pricing: 'price',
    reserve: 'book', appointment: 'book', schedule: 'book', booking: 'book',
    consultation: 'consult', consulting: 'consult', consultancy: 'consult',
    wedding: 'bridal', bride: 'bridal', marriage: 'bridal', nikah: 'bridal', mandap: 'bridal',
    party: 'glam', glamour: 'glam', glamorous: 'glam',
    'make-up': 'makeup', cosmetic: 'makeup', cosmetics: 'makeup', mua: 'artist', beautician: 'artist', stylist: 'artist',
    hairdo: 'hair', hairstyle: 'hair', hairstyling: 'hair', hairstyles: 'hair',
    hyd: 'hyderabad', bengaluru: 'bangalore', blr: 'bangalore', cochin: 'kochi',
    home: 'doorstep', house: 'doorstep', venue: 'doorstep', travel: 'doorstep',
    men: 'groom', male: 'groom', beard: 'groom',
    job: 'career', jobs: 'career', hiring: 'career', join: 'career',
    docs: 'document', doc: 'document',
    review: 'testimonial', reviews: 'testimonial', feedback: 'testimonial'
  };

  // clearly unrelated topics -> straight to "not confident"
  var OFFTOPIC = /(weather|movie|film|cricket|ipl|football|bitcoin|crypto|recipe|joke|lottery|porn|sex|dating|girlfriend|boyfriend|election|politic|stock market|share market|horoscope|astrology|homework|python|javascript|capital of)/i;

  var KIND_BOOST = { f: 1.5, p: 1.0, d: 1.0, b: 0.85, l: 0.7 };
  var K1 = 1.2, B = 0.75;

  var docs = [], df = {}, vocab = [], N = 0, avgdl = 1, ready = false;

  function stem(w) {
    if (w.length > 4 && /ies$/.test(w)) return w.slice(0, -3) + 'y';
    if (w.length > 5 && /ing$/.test(w)) w = w.slice(0, -3);
    else if (w.length > 4 && /ed$/.test(w)) w = w.slice(0, -2);
    else if (w.length > 4 && /(ches|shes|xes|sses)$/.test(w)) w = w.slice(0, -2);
    else if (w.length > 3 && /s$/.test(w) && !/(ss|us|is)$/.test(w)) w = w.slice(0, -1);
    return w;
  }
  function norm(w) {
    var s = stem(w);
    return SYN[s] || SYN[w] || s;
  }
  function tokens(text, keepStop) {
    var m = String(text || '').toLowerCase().replace(/[’']s\b/g, '').match(/[a-z0-9]+/g) || [];
    var out = [];
    for (var i = 0; i < m.length; i++) {
      var w = m[i];
      if (!keepStop && STOP[w]) continue;
      if (w.length < 2 && !/\d/.test(w)) continue;
      out.push(norm(w));
    }
    return out;
  }

  function lev(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    var prev = [], cur = [], i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      cur = [i];
      var best = i;
      for (j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        if (cur[j] < best) best = cur[j];
      }
      if (best > max) return max + 1;
      prev = cur;
    }
    return prev[b.length];
  }
  function fuzzy(t) {
    if (t.length < 3) return null;
    var max = t.length >= 9 ? 2 : 1, best = null, bd = max + 1;
    for (var i = 0; i < vocab.length; i++) {
      var v = vocab[i];
      if (v[0] !== t[0]) continue;
      var d = lev(t, v, max);
      if (d < bd) { bd = d; best = v; }
    }
    return best;
  }

  function init(kb) {
    docs = []; df = {}; vocab = [];
    var chunks = (kb && kb.chunks) || [];
    var total = 0;
    chunks.forEach(function (c, idx) {
      var tf = {}, dl = 0, hs = {};
      tokens(c.h + ' ' + (c.alt ? c.alt.join(' ') : ''), true).forEach(function (t) { if (STOP[t]) return; hs[t] = 1; tf[t] = (tf[t] || 0) + (c.k === 'f' ? 4 : 3); dl += 3; });
      tokens(c.x).forEach(function (t) { tf[t] = (tf[t] || 0) + 1; dl += 1; });
      var d = { c: c, i: idx, tf: tf, hs: hs, dl: dl || 1 };
      docs.push(d); total += d.dl;
      for (var t in tf) df[t] = (df[t] || 0) + 1;
    });
    N = docs.length || 1;
    avgdl = total / N || 1;
    vocab = Object.keys(df);
    ready = true;
  }
  function idf(t) { var n = df[t] || 0; return Math.log(1 + (N - n + 0.5) / (n + 0.5)); }

  // Returns { confident, cov, hits:[{c,score,cov}] }
  function search(query, opts) {
    opts = opts || {};
    if (!ready) return { confident: false, cov: 0, hits: [] };
    if (OFFTOPIC.test(query)) return { confident: false, cov: 0, hits: [], offtopic: true };
    var qt = tokens(query), seen = {}, terms = [], wsum = 0, i;
    var idfMax = Math.log(1 + N / 0.5);
    for (i = 0; i < qt.length; i++) {
      var t = qt[i];
      if (!df[t]) { var f = fuzzy(t); t = f || ('~' + t); }
      if (seen[t]) continue; seen[t] = 1;
      var w = t.charAt(0) === '~' ? idfMax : idf(t);
      terms.push({ t: t, w: w }); wsum += w;
    }
    if (!terms.length) return { confident: false, cov: 0, hits: [], empty: true };
    var hits = [];
    for (i = 0; i < docs.length; i++) {
      var d = docs[i];
      if (opts.page && d.c.p !== opts.page) continue;
      var bm = 0, matched = 0, hm = 0;
      for (var j = 0; j < terms.length; j++) {
        var tf = d.tf[terms[j].t];
        if (!tf) continue;
        matched += terms[j].w;
        if (d.hs[terms[j].t]) hm += terms[j].w;
        bm += terms[j].w * (tf * (K1 + 1)) / (tf + K1 * (1 - B + B * d.dl / avgdl));
      }
      if (!bm) continue;
      var cov = matched / wsum;
      hits.push({ c: d.c, bm: bm, cov: cov, hf: hm / wsum, score: bm * (KIND_BOOST[d.c.k] || 1) * (0.4 + 0.6 * cov) * (1 + 1.0 * hm / wsum), matched: matched });
    }
    hits.sort(function (a, b) { return b.score - a.score; });
    // the website is the source of truth: a close website match beats the supplementary knowledge-base document
    if (hits.length && hits[0].c.k === 'd') {
      for (var w = 1; w < hits.length; w++) {
        if ((hits[w].c.k === 'f' || hits[w].c.k === 'p' || hits[w].c.k === 'l') && hits[w].cov >= 0.6 && hits[w].hf >= hits[0].hf - 0.2 && hits[w].score >= 0.65 * hits[0].score) { var pick = hits.splice(w, 1)[0]; hits.unshift(pick); break; }
      }
    }
    hits = hits.slice(0, 8);
    var top = hits[0];
    var confident = !!top && top.cov >= 0.6 && top.bm >= 2.2 && (top.matched >= 1.6 || (top.c.k === 'f' && top.bm >= 2.6));
    return { confident: confident, cov: top ? top.cov : 0, hits: hits, terms: terms };
  }

  function findFaq(re) {
    for (var i = 0; i < docs.length; i++) if (docs[i].c.k === 'f' && re.test(docs[i].c.h)) return docs[i].c;
    return null;
  }
  function findDoc(re) {
    for (var i = 0; i < docs.length; i++) if (docs[i].c.k === 'd' && re.test(docs[i].c.h)) return docs[i].c;
    return null;
  }
  function faqList() { return docs.filter(function (d) { return d.c.k === 'f'; }).map(function (d) { return d.c; }); }
  function pageChunks(page) { return docs.filter(function (d) { return d.c.p === page; }).map(function (d) { return d.c; }); }
  function nextChunk(c) {
    for (var i = 0; i < docs.length - 1; i++) if (docs[i].c === c) { var n = docs[i + 1].c; return n.p === c.p ? n : null; }
    return null;
  }

  var api = { init: init, search: search, tokens: tokens, findFaq: findFaq, findDoc: findDoc, faqList: faqList, pageChunks: pageChunks, nextChunk: nextChunk, isReady: function () { return ready; } };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.GlamAIEngine = api;
})(typeof window !== 'undefined' ? window : globalThis);
