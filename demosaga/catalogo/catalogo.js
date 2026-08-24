(function(){
  "use strict";

  var FP = window.FP;
  function money(n){ return FP.money(n); }

  var params = new URLSearchParams(location.search);
  var state = {
    cat: params.get("cat") || "todos",
    search: "",
    sort: "destacado"
  };

  // ---------- WhatsApp links ----------
  function setWaLinks(){
    var msg = "Hola Saga! Quiero hacer una consulta sobre el catálogo.";
    ["cheader-wa-link","sidebar-wa-link"].forEach(function(id){
      var el = document.getElementById(id);
      if(el) el.href = FP.waLink(msg);
    });
    var floatWa = document.getElementById("float-wa");
    if(floatWa) floatWa.href = FP.waLink(msg);
  }

  // ---------- Sidebar counts ----------
  function renderCounts(){
    document.getElementById("count-todos").textContent = FP.PRODUCTS.length;
    Object.keys(FP.CAT_LABEL).forEach(function(cat){
      var n = FP.PRODUCTS.filter(function(p){ return p.cat === cat; }).length;
      var el = document.getElementById("count-" + cat);
      if(el) el.textContent = n;
    });
  }

  function setActiveCat(cat){
    state.cat = cat;
    document.querySelectorAll(".csidebar__cat").forEach(function(btn){
      btn.classList.toggle("is-active", btn.getAttribute("data-cat") === cat);
    });
    render();
  }
  document.getElementById("sidebar-cats").addEventListener("click", function(e){
    var btn = e.target.closest(".csidebar__cat");
    if(!btn) return;
    setActiveCat(btn.getAttribute("data-cat"));
  });

  // ---------- Search ----------
  var searchInput = document.getElementById("search-input");
  var searchTimer = null;
  searchInput.addEventListener("input", function(){
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function(){
      state.search = normalize(searchInput.value.trim());
      render();
    }, 200);
  });

  // ---------- Sort ----------
  document.getElementById("sort-select").addEventListener("change", function(){
    state.sort = this.value;
    render();
  });

  // ---------- Filter + sort ----------
  function normalize(s){
    return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }

  function getFiltered(){
    var list = FP.PRODUCTS.slice();
    if(state.cat !== "todos") list = list.filter(function(p){ return p.cat === state.cat; });
    if(state.search) list = list.filter(function(p){ return normalize(p.name).indexOf(state.search) > -1; });
    if(state.sort === "precio-asc") list.sort(function(a,b){ return a.price - b.price; });
    else if(state.sort === "precio-desc") list.sort(function(a,b){ return b.price - a.price; });
    else if(state.sort === "nombre") list.sort(function(a,b){ return a.name.localeCompare(b.name); });
    return list;
  }

  // ---------- Grid render ----------
  var grid = document.getElementById("cgrid");
  var emptyEl = document.getElementById("cempty");
  var countEl = document.getElementById("result-count");

  function cardHTML(p){
    var qty = FP.getCart()[p.id] || 0;
    return '<article class="card reveal" data-id="' + p.id + '">' +
      '<a class="card__link" href="?p=' + p.id + '" data-qv="' + p.id + '">' +
        '<div class="card__img-wrap">' +
          '<img src="../' + p.img + '" alt="' + p.name + '" loading="lazy">' +
          '<span class="card__tag">' + p.tag + '</span>' +
        '</div>' +
        '<div class="card__body">' +
          '<h3>' + p.name + '</h3>' +
          '<div class="card__price">' + money(p.price) + '<small>Precio de referencia</small></div>' +
        '</div>' +
      '</a>' +
      '<div class="card__body" style="padding-top:0">' +
        '<div class="card__footer">' +
          '<div class="stepper">' +
            '<button class="stepper__minus" aria-label="Restar">&minus;</button>' +
            '<span class="stepper__qty">' + qty + '</span>' +
            '<button class="stepper__plus" aria-label="Sumar">&plus;</button>' +
          '</div>' +
          '<button class="card__add">Agregar</button>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  function render(){
    var list = getFiltered();
    countEl.textContent = list.length + (list.length === 1 ? " producto" : " productos");
    grid.hidden = list.length === 0;
    emptyEl.hidden = list.length !== 0;
    grid.innerHTML = list.map(cardHTML).join("");
    wireCardEvents();
    observeReveal();
  }

  function wireCardEvents(){
    grid.querySelectorAll(".card").forEach(function(card){
      var id = card.getAttribute("data-id");
      var qtyEl = card.querySelector(".stepper__qty");

      card.querySelector(".card__link").addEventListener("click", function(e){
        e.preventDefault();
        openQuickview(id);
      });
      card.querySelector(".stepper__plus").addEventListener("click", function(){
        var next = (FP.getCart()[id] || 0) + 1;
        qtyEl.textContent = next;
        qtyEl.dataset.pending = next;
      });
      card.querySelector(".stepper__minus").addEventListener("click", function(){
        var cur = parseInt(qtyEl.dataset.pending || FP.getCart()[id] || 0, 10);
        var next = Math.max(0, cur - 1);
        qtyEl.textContent = next;
        qtyEl.dataset.pending = next;
        if(FP.getCart()[id]) FP.setQty(id, next);
      });
      card.querySelector(".card__add").addEventListener("click", function(){
        var pending = qtyEl.dataset.pending ? parseInt(qtyEl.dataset.pending,10) : null;
        if(pending !== null && pending !== (FP.getCart()[id]||0)){
          FP.setQty(id, pending);
        } else {
          FP.addToCart(id, 1);
        }
        var btn = card.querySelector(".card__add");
        btn.classList.add("is-added");
        btn.textContent = "Agregado ✓";
        setTimeout(function(){ btn.classList.remove("is-added"); btn.textContent = "Agregar"; }, 1200);
      });
    });
  }

  FP.onChange(function(){
    document.querySelectorAll(".stepper__qty").forEach(function(el){
      var card = el.closest(".card");
      if(!card) return;
      var id = card.getAttribute("data-id");
      el.textContent = FP.getCart()[id] || 0;
      delete el.dataset.pending;
    });
  });

  // ---------- Quick view ----------
  var qv = document.getElementById("quickview");
  var qvBody = document.getElementById("quickview-body");
  function openQuickview(id){
    var p = FP.productById(id);
    if(!p) return;
    var qty = FP.getCart()[id] || 1;
    qvBody.innerHTML =
      '<img src="../' + p.img + '" alt="' + p.name + '">' +
      '<div class="quickview__content">' +
        '<span class="quickview__tag">' + p.tag + '</span>' +
        '<h3>' + p.name + '</h3>' +
        '<p class="quickview__desc">' + (p.desc || "") + '</p>' +
        '<div class="quickview__price">' + money(p.price) + '<small>Precio de referencia</small></div>' +
        '<div class="quickview__actions">' +
          '<div class="stepper" id="qv-stepper">' +
            '<button id="qv-minus" aria-label="Restar">&minus;</button>' +
            '<span id="qv-qty">' + qty + '</span>' +
            '<button id="qv-plus" aria-label="Sumar">&plus;</button>' +
          '</div>' +
          '<button class="btn btn--primary" id="qv-add">Agregar al pedido</button>' +
        '</div>' +
      '</div>';

    var localQty = qty;
    document.getElementById("qv-plus").addEventListener("click", function(){
      localQty++;
      document.getElementById("qv-qty").textContent = localQty;
    });
    document.getElementById("qv-minus").addEventListener("click", function(){
      localQty = Math.max(1, localQty - 1);
      document.getElementById("qv-qty").textContent = localQty;
    });
    document.getElementById("qv-add").addEventListener("click", function(){
      FP.setQty(id, localQty);
      openCart();
      closeQuickview();
    });

    qv.classList.add("is-open");
    qv.setAttribute("aria-hidden","false");
  }
  function closeQuickview(){
    qv.classList.remove("is-open");
    qv.setAttribute("aria-hidden","true");
  }
  document.getElementById("quickview-close").addEventListener("click", closeQuickview);
  document.getElementById("quickview-backdrop").addEventListener("click", closeQuickview);

  // ---------- Cart drawer ----------
  function renderCart(){
    var cart = FP.getCart();
    var itemsEl = document.getElementById("cart-items");
    var emptyCartEl = document.getElementById("cart-empty");
    var footerEl = document.getElementById("cart-footer");
    var countBadge = document.getElementById("cart-count");
    var totalEl = document.getElementById("cart-total");
    var waEl = document.getElementById("cart-wa-link");

    var ids = Object.keys(cart);
    var count = FP.cartCount();
    countBadge.textContent = count;
    countBadge.hidden = count === 0;

    if(ids.length === 0){
      itemsEl.innerHTML = "";
      emptyCartEl.hidden = false;
      footerEl.hidden = true;
      return;
    }
    emptyCartEl.hidden = true;
    footerEl.hidden = false;

    itemsEl.innerHTML = ids.map(function(id){
      var p = FP.productById(id);
      if(!p) return "";
      return '<div class="cart__item">' +
        '<img src="../' + p.img + '" alt="' + p.name + '" loading="lazy">' +
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
      btn.addEventListener("click", function(){ FP.removeFromCart(btn.getAttribute("data-remove")); });
    });
  }
  var cartPanel = document.getElementById("cart-panel");
  function openCart(){ cartPanel.classList.add("is-open"); cartPanel.setAttribute("aria-hidden","false"); }
  function closeCart(){ cartPanel.classList.remove("is-open"); cartPanel.setAttribute("aria-hidden","true"); }
  document.getElementById("cart-open-btn").addEventListener("click", openCart);
  document.getElementById("cart-close-btn").addEventListener("click", closeCart);
  document.getElementById("cart-backdrop").addEventListener("click", closeCart);
  FP.onChange(renderCart);

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
      }, { threshold:0.1 });
    }
    document.querySelectorAll(".reveal:not(.is-visible)").forEach(function(el){ observer.observe(el); });
  }

  // ---------- Init ----------
  setWaLinks();
  renderCounts();
  if(state.cat !== "todos") setActiveCat(state.cat);
  else render();
  renderCart();

  var initialProduct = params.get("p");
  if(initialProduct) openQuickview(initialProduct);
})();
