(function(){
  var $=window.$,$$=window.$$,ic=window.ic;
  var art=["bride.webp","sang.webp","groom.webp"];
  $("#collArt").insertAdjacentHTML("beforeend",art.map(function(s,i){return '<img src="images/'+s+'" alt="" class="c'+(i+1)+'">'}).join(""));
  var OCC=[["bridal","Bridal"],["party","Party & Sangeet"],["groom","Groom"]];
  var PR=[["u5","Under ₹5,000",function(p){return p.price<5000}],["m","₹5,000 – ₹10,000",function(p){return p.price>=5000&&p.price<=10000}],["o","Above ₹10,000",function(p){return p.price>10000}]];
  var occ=[],price=[],sort="feat";
  function cnt(fn){return GLAM_PACKAGES.filter(fn).length}
  function box(grp,val,label,n){return '<li><label><input type="checkbox" data-g="'+grp+'" value="'+val+'"><span class="cb">'+ic("check")+'</span><span class="lb">'+label+'</span><span class="n">'+n+'</span></label></li>'}
  $("#fGroups").innerHTML='<fieldset><legend>Occasion</legend><ul>'+OCC.map(function(o){return box("occ",o[0],o[1],cnt(function(p){return p.category===o[0]}))}).join("")+'</ul></fieldset>'+
    '<fieldset><legend>Price</legend><ul>'+PR.map(function(r){return box("price",r[0],r[1],cnt(r[2]))}).join("")+'</ul></fieldset>';
  $("#fToggle").innerHTML=ic("menu")+"Filters";
  function render(){
    var l=GLAM_PACKAGES.filter(function(p){
      if(occ.length&&occ.indexOf(p.category)<0)return false;
      if(price.length&&!price.some(function(k){return PR.filter(function(r){return r[0]===k})[0][2](p)}))return false;
      return true});
    if(sort==="lo")l.sort(function(a,b){return a.price-b.price});
    if(sort==="hi")l.sort(function(a,b){return b.price-a.price});
    if(sort==="az")l.sort(function(a,b){return a.name.localeCompare(b.name)});
    $("#pCount").textContent=l.length+" package"+(l.length===1?"":"s");
    $("#grid").innerHTML=l.map(window.pkgCard).join("")||'<div class="none">No packages match those filters.</div>';
    window.observeReveal($("#grid"));
    $$("#grid .pc").forEach(function(card,i){
      var pk=l[i]; if(!pk)return;
      var row=card.querySelector(".pc-pr"); if(!row)return;
      row.insertAdjacentHTML("beforeend",'<button type="button" class="pc-qv" data-qv="'+pk.id+'">Details</button>');
    });
  }
  /* quick view: description + What's included (pill style) + small Add to cart / Book now */
  function closeQV(){var m=$("#qvBox");if(m)m.remove();document.body.classList.remove("qv-open")}
  function openQV(id){
    var p=getPackageById(id); if(!p)return; closeQV();
    document.body.insertAdjacentHTML("beforeend",'<div class="qv" id="qvBox" role="dialog" aria-modal="true" aria-label="'+p.name+'"><div class="qv-bg" data-qvx></div><div class="qv-card">'+
      '<button type="button" class="qv-x" data-qvx aria-label="Close">'+ic("x")+'</button>'+
      '<h3 class="qv-t">'+p.name+'</h3><p class="qv-pr">'+p.priceLabel+'</p>'+
      '<p class="qv-d">'+p.description+'</p>'+
      '<h4 class="qv-h">What\'s included</h4><ul class="qv-inc">'+p.features.map(function(f){return "<li>"+ic("check")+f+"</li>"}).join("")+'</ul>'+
      '<div class="qv-btns"><button type="button" class="rbtn ghost" data-add="'+p.id+'" data-qvx>Add to cart</button><button type="button" class="rbtn" data-book="'+p.id+'">Book now</button></div>'+
      '</div></div>');
    document.body.classList.add("qv-open");
  }
  document.addEventListener("click",function(e){
    var b=e.target.closest("[data-qv]"); if(b){openQV(b.dataset.qv);return}
    if(e.target.closest("[data-qvx]"))closeQV();
  });
  document.addEventListener("keydown",function(e){if(e.key==="Escape")closeQV()});
  $("#fGroups").addEventListener("change",function(){
    occ=$$("#fGroups input[data-g=occ]:checked").map(function(i){return i.value});
    price=$$("#fGroups input[data-g=price]:checked").map(function(i){return i.value});
    render()});
  $("#sort").onchange=function(e){sort=e.target.value;render()};
  $("#fToggle").onclick=function(){var o=$("#fSide").classList.toggle("open");$("#fToggle").setAttribute("aria-expanded",o)};
  document.addEventListener("glam:sync",function(){$$("#grid [data-fav]").forEach(function(b){b.classList.toggle("on",Fav.has(b.dataset.fav))})});
  render();
})();
