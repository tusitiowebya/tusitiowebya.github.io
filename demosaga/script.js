(function(){
  "use strict";

  var FP = window.FP;

  function money(n){ return FP.money(n); }

  // ---------- WhatsApp links base ----------
  function setWaLinks(){
    var defaultMsg = "Hola Saga! Quiero hacer una consulta sobre sus productos.";
    ["nav-wa-link","hero-wa-link","mobile-wa-link","final-wa-link"].forEach(function(id){
      var el = document.getElementById(id);
      if(el) el.href = FP.waLink(defaultMsg);
    });
    var floatWa = document.getElementById("float-wa");
    if(floatWa) floatWa.href = FP.waLink(defaultMsg);
  }

  // ---------- Nav scroll state ----------
  var nav = document.getElementById("nav");
  function onScroll(){
    if(window.scrollY > 40) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
    var floatWa = document.getElementById("float-wa");
    if(floatWa){
      if(window.scrollY > window.innerHeight * 0.6) floatWa.classList.add("is-visible");
      else floatWa.classList.remove("is-visible");
    }
  }
  window.addEventListener("scroll", onScroll, { passive:true });
  onScroll();

  // ---------- Mobile menu ----------
  var burger = document.getElementById("burger-btn");
  var mobileMenu = document.getElementById("mobile-menu");
  burger.addEventListener("click", function(){
    var open = mobileMenu.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });
  mobileMenu.querySelectorAll("a").forEach(function(a){
    a.addEventListener("click", function(){
      mobileMenu.classList.remove("is-open");
      burger.setAttribute("aria-expanded","false");
    });
  });

  // ---------- Cart drawer ----------
  function renderCart(){
    var cart = FP.getCart();
    var itemsEl = document.getElementById("cart-items");
    var emptyEl = document.getElementById("cart-empty");
    var footerEl = document.getElementById("cart-footer");
    var countEl = document.getElementById("cart-count");
    var totalEl = document.getElementById("cart-total");
    var waEl = document.getElementById("cart-wa-link");

    var ids = Object.keys(cart);
    var count = FP.cartCount();

    countEl.textContent = count;
    countEl.hidden = count === 0;

    if(ids.length === 0){
      itemsEl.innerHTML = "";
      emptyEl.hidden = false;
      footerEl.hidden = true;
      return;
    }
    emptyEl.hidden = true;
    footerEl.hidden = false;

    itemsEl.innerHTML = ids.map(function(id){
      var p = FP.productById(id);
      if(!p) return "";
      return '<div class="cart__item">' +
        '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy">' +
        '<div class="cart__item-info">' +
          '<h4>' + p.name + ' &times;' + cart[id] + '</h4>' +
          '<div class="price">' + money(p.price * cart[id]) + '</div>' +
          '<button class="cart__item-remove" data-remove="' + id + '">Quitar</button>' +
        '</div>' +
      '</div>';
    }).join("");

    totalEl.textContent = money(FP.cartTotal());
    waEl.href = FP.cartWaLink();

    itemsEl.querySelectorAll("[data-remove]").forEach(function(btn){
      btn.addEventListener("click", function(){
        FP.removeFromCart(btn.getAttribute("data-remove"));
      });
    });
  }

  var cartPanel = document.getElementById("cart-panel");
  function openCart(){ cartPanel.classList.add("is-open"); cartPanel.setAttribute("aria-hidden","false"); }
  function closeCart(){ cartPanel.classList.remove("is-open"); cartPanel.setAttribute("aria-hidden","true"); }
  document.getElementById("cart-open-btn").addEventListener("click", openCart);
  document.getElementById("cart-close-btn").addEventListener("click", closeCart);
  document.getElementById("cart-backdrop").addEventListener("click", closeCart);
  FP.onChange(renderCart);

  // ---------- Destacados: vidriera de alto impacto (bento) ----------
  var FEATURED_IDS = ["organizador","termico","hermeticos","cesto","dispenser"];
  var bento = document.getElementById("bento-grid");
  function bentoTile(p, big){
    return '<a class="bento__tile' + (big ? ' bento__tile--big' : '') + '" href="catalogo/?p=' + p.id + '">' +
      '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy">' +
      '<span class="bento__scrim"></span>' +
      '<span class="bento__tag">' + p.tag + '</span>' +
      '<span class="bento__info">' +
        '<strong>' + p.name + '</strong>' +
        '<span class="bento__price">' + money(p.price) + '</span>' +
      '</span>' +
      '<button class="bento__add" data-id="' + p.id + '" aria-label="Agregar al pedido">+</button>' +
    '</a>';
  }
  function renderBento(){
    var items = FEATURED_IDS.map(function(id){ return FP.productById(id); }).filter(Boolean);
    if(!items.length) return;
    var html = bentoTile(items[0], true) + items.slice(1).map(function(p){ return bentoTile(p,false); }).join("");
    bento.innerHTML = html;
    bento.querySelectorAll(".bento__add").forEach(function(btn){
      btn.addEventListener("click", function(e){
        e.preventDefault(); e.stopPropagation();
        FP.addToCart(btn.getAttribute("data-id"), 1);
        btn.textContent = "✓";
        setTimeout(function(){ btn.textContent = "+"; }, 1000);
        openCart();
      });
    });
    observeReveal();
  }

  // ---------- Armador "¿Qué querés organizar hoy?" ----------
  var armadorResult = document.getElementById("armador-result");
  function renderArmador(cat){
    var items = FP.PRODUCTS.filter(function(p){ return p.cat === cat; });
    armadorResult.innerHTML = items.map(function(p){
      return '<div class="armador__item reveal">' +
        '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy">' +
        '<h4>' + p.name + '</h4>' +
        '<div class="price">' + money(p.price) + '</div>' +
      '</div>';
    }).join("") +
    '<button class="btn btn--primary armador__add-all" id="armador-add-all">Agregar ' + items.length + ' productos al pedido</button>';

    observeReveal();
    document.getElementById("armador-add-all").addEventListener("click", function(){
      items.forEach(function(p){ FP.addToCart(p.id, 1); });
      openCart();
    });
  }
  document.getElementById("armador-chips").addEventListener("click", function(e){
    var btn = e.target.closest(".chip");
    if(!btn) return;
    var cat = btn.getAttribute("data-cat");
    this.querySelectorAll(".chip").forEach(function(c){ c.classList.remove("is-active"); });
    btn.classList.add("is-active");
    renderArmador(cat);
  });

  // ---------- Scroll reveal ----------
  var observer = null;
  function observeReveal(){
    if(!("IntersectionObserver" in window)){
      document.querySelectorAll(".reveal").forEach(function(el){ el.classList.add("is-visible"); });
      return;
    }
    if(!observer){
      observer = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold:0.15 });
    }
    document.querySelectorAll(".reveal:not(.is-visible)").forEach(function(el){
      observer.observe(el);
    });
  }

  // ---------- LITE fallback ----------
  function shouldUseLite(){
    if(location.search.indexOf("full") > -1) return false;
    if(location.search.indexOf("lite") > -1) return true;
    if(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
    if(navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) return true;
    if(navigator.deviceMemory && navigator.deviceMemory <= 2) return true;
    try{
      var canvas = document.createElement("canvas");
      var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if(gl){
        var dbg = gl.getExtension("WEBGL_debug_renderer_info");
        if(dbg){
          var renderer = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || "";
          if(/swiftshader|llvmpipe|software/i.test(renderer)) return true;
        }
      } else {
        return true;
      }
    }catch(e){ /* ignore */ }
    return false;
  }
  function applyLite(){
    document.documentElement.classList.add("lite");
    var video = document.getElementById("hero-video");
    if(video){ video.pause(); video.removeAttribute("src"); }
    var banner = document.getElementById("lite-banner");
    if(banner){
      banner.hidden = false;
      document.getElementById("lite-full-btn").addEventListener("click", function(){
        location.search = "?full";
      });
    }
  }
  if(shouldUseLite()){
    applyLite();
  } else {
    var v = document.getElementById("hero-video");
    if(v && v.dataset.src){
      var source = v.querySelector("source");
      if(source) source.src = source.dataset.src;
      v.src = v.dataset.src;
      v.load();
    }
  }

  // ---------- Init ----------
  setWaLinks();
  renderBento();
  renderArmador("cocina");
  renderCart();
  observeReveal();
})();
