(function(){
  var $=window.$,$$=window.$$,ic=window.ic;
  $("#abStrip").innerHTML=["a1.webp","b2.webp","a3.webp","a4.webp"].map(function(s,i){return '<img src="images/'+s+'" alt="" style="--r:'+((i%2?4:-4))+'deg">'}).join("");
  $("#abWa").href=WA_LINK;
  var V=[["gem","Premium Quality","We use only the finest products from luxury brands to ensure flawless, long-lasting results."],
         ["sparkle","Personalized Service","Every look is tailored to your unique features and personality—never templated."],
         ["heart","Empowerment","We create career opportunities and build a community of skilled, confident women."]];
  $("#abValues").innerHTML=V.map(function(v,i){return '<article class="ab-val rv-in"><span class="ico">'+ic(v[0])+'</span><h3>'+v[1]+'</h3><p>'+v[2]+'</p></article>'}).join("");
  /* count-up stats (same as home) */
  var stEl=$("#aboutStats");
  stEl.innerHTML=ABOUT_STATS.map(function(t){return '<div><dt><span class="cnt" data-to="'+t[0]+'">0</span>'+t[1]+'</dt><dd>'+t[2]+'</dd></div>'}).join("");
  function runCount(){
    $$(".cnt",stEl).forEach(function(c){
      var to=+c.dataset.to,t0=null,dur=1800;
      if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){c.textContent=to;return}
      (function step(t){if(!t0)t0=t;var k=Math.min(1,(t-t0)/dur);c.textContent=Math.round(to*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(step)})(performance.now());
    });
  }
  if("IntersectionObserver" in window){var io=new IntersectionObserver(function(en){if(en[0].isIntersecting){runCount();io.disconnect()}},{threshold:.4});io.observe(stEl)}else runCount();
  /* instagram strip */
  var ig=INSTA.map(function(s){return '<a href="https://www.instagram.com/glambyzebaish" target="_blank" rel="noopener" aria-label="Open Instagram"><img loading="lazy" src="images/'+s+'" alt="" draggable="false">'+ic("insta")+'</a>'}).join("");
  $("#insta").innerHTML=ig+ig;
  window.observeReveal(document);
})();
