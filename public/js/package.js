(function(){
  var $=window.$,$$=window.$$,ic=window.ic;
  var id=new URLSearchParams(location.search).get("id"), p=getPackageById(id)||GLAM_PACKAGES[0];
  document.title=p.name+" — Glam by Zebaish";
  var waHref="https://wa.me/"+WA_NUMBER+"?text="+encodeURIComponent("Hi Glam by Zebaish, I'd like to know more about the "+p.name+" package.");
  var WAI='<svg viewBox="0 0 32 32" aria-hidden="true" style="width:16px;height:16px;flex:none"><path fill="#25d366" d="M16.04 3C9.4 3 4 8.35 4 14.95c0 2.35.7 4.54 1.9 6.39L4 29l7.85-1.85a12.1 12.1 0 0 0 4.19.74C22.66 27.9 28 22.55 28 15.95S22.66 3 16.04 3zm0 22.1c-1.33 0-2.62-.34-3.76-.97l-.27-.15-4.66 1.1 1.14-4.5-.18-.29a9.1 9.1 0 0 1-1.4-4.85c0-5.02 4.12-9.1 9.2-9.1s9.2 4.08 9.2 9.1-4.12 9.1-9.27 9.1zm5.04-6.9c-.28-.14-1.64-.8-1.9-.9-.25-.09-.44-.14-.62.14-.18.27-.72.9-.88 1.08-.16.18-.32.2-.6.07-.27-.14-1.16-.42-2.2-1.34-.82-.72-1.37-1.6-1.53-1.87-.16-.27-.02-.42.12-.55.12-.12.27-.32.4-.48.14-.16.18-.27.27-.46.09-.18.05-.34-.02-.48-.07-.14-.62-1.48-.85-2.03-.22-.53-.45-.46-.62-.47h-.53c-.18 0-.48.07-.73.34-.25.27-.96.93-.96 2.28s.98 2.64 1.12 2.82c.14.18 1.92 2.93 4.66 4.1 1.64.71 2.28.77 3.1.65.5-.07 1.64-.67 1.87-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.18-.53-.32z"/></svg>';
  var gal=[["images/"+p.image,p.name]], gi=0;
  var others=GLAM_PACKAGES.filter(function(x){return x.id!==p.id}).slice(0,4);
  var faq=FAQS.filter(function(f){return f.q.indexOf(p.name)>-1})[0];
  $("#pdpRoot").innerHTML='<nav class="crumb"><a href="index.html">Home</a> › <a href="packages.html">Packages</a> › <b>'+p.name+'</b></nav>'+
  '<div class="pdp"><div class="gal single"><div class="gal-th">'+gal.map(function(g,i){return '<button data-g="'+i+'" class="'+(i?"":"on")+'" aria-label="Image '+(i+1)+'"><img src="'+g[0]+'" alt=""></button>'}).join("")+'</div>'+
  '<div class="gal-main"><img id="gImg" src="'+gal[0][0]+'" alt="'+p.name+'"><span class="gal-ct" id="gCt">1 / '+gal.length+'</span><div class="gal-ar"><button class="circle" id="gP" aria-label="Previous image">'+ic("left")+'</button><button class="circle" id="gN" aria-label="Next image">'+ic("right")+'</button></div></div></div>'+
  '<div class="buy"><button class="fav2 fav-top" id="favBtn" data-fav="'+p.id+'" aria-label="Add to favourites">'+ic("heart")+'</button><span class="tagc">'+p.tag+'</span><h1>'+p.name+'</h1><p class="sub">'+p.perfect+'</p>'+
  '<div class="price"><b>'+p.priceLabel+'</b></div>'+
  '<div class="stock">Booking open</div>'+
    '<ul class="perks"><li>'+ic("pin")+'Artist comes to your doorstep</li><li>'+ic("gem")+'Premium products from trusted luxury brands</li><li>'+ic("shield")+'Skilled, background-verified professional artists</li></ul>'+
  '<div class="pk-det"><p class="pk-d">'+p.description+'</p><h2>What\'s included</h2><ul class="inc">'+p.features.map(function(f){return "<li>"+ic("check")+f+"</li>"}).join("")+'</ul>'+
  '<div class="buy-btns buy-end"><button class="rbtn" id="addBtn" data-add-state="'+p.id+'"></button><button class="rbtn dark" id="buyNow">Book now</button></div></div>'+
  '</div></div></div>'+
  '<section class="sec rvw-sec" id="customer-reviews" style="padding-top:20px" aria-label="Customer Reviews"></section>'+
  '<section class="sec" style="padding-top:20px"><div class="sec-head"><h2 class="h2" style="font-size:clamp(2rem,4vw,3.4rem)">Complete the look</h2><a class="btn ghost" href="packages.html">All packages</a></div><div class="grid" style="padding-bottom:0;grid-template-columns:repeat(4,1fr)" id="more">'+others.map(window.pkgCard).join("")+'</div></section>'+
  '<div class="sticky-bar"><div><b>'+p.name+'</b><br><small>'+p.priceLabel+'</small></div><div class="sb-btns"><button class="rbtn ghost" data-add="'+p.id+'">Add to cart</button><button class="rbtn" data-book="'+p.id+'">Book now</button></div></div>';
  var st=document.createElement("style");st.textContent="@media(max-width:900px){#more{grid-template-columns:repeat(2,1fr)!important}}";document.head.appendChild(st);
  function show(i){gi=(i+gal.length)%gal.length;$("#gImg").src=gal[gi][0];$("#gCt").textContent=(gi+1)+" / "+gal.length;$$(".gal-th button").forEach(function(b,j){b.classList.toggle("on",j===gi)})}
  $$(".gal-th button").forEach(function(b){b.onclick=function(){show(+b.dataset.g)}});
  $("#gP").onclick=function(){show(gi-1)};$("#gN").onclick=function(){show(gi+1)};
  $("#addBtn").onclick=function(){if(Cart.has(p.id)){openLayer("cart")}else Cart.add(p.id)};
  $("#buyNow").onclick=function(){Cart.add(p.id,false);location.href="book-now.html"};
  if(window.GlamReviews)window.GlamReviews.mount(p);
  window.observeReveal(document);window.syncUI();
})();
