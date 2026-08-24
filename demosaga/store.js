// Núcleo compartido home <-> /catalogo/ (mismo carrito, mismos productos).
// TODO: cuando exista la cuenta CobrOS (window.NEGOCIO.ACTIVO === true),
// reemplazar PRODUCTS por un fetch a `${NEGOCIO.API}/catalogo/${NEGOCIO.SLUG}`
// — ver tusitiowebya.github.io/demoferrepehua/store.js como referencia.
window.FP = (function(){
  "use strict";

  var WA = (window.NEGOCIO && window.NEGOCIO.WA) || "5493765070285";
  var CART_KEY = "saga_cart";

  var PRODUCTS = [
    { id:"organizador", cat:"cocina", name:"Organizador de Frutas y Verduras 3 Niveles", price:18500, img:"img/p-organizador.jpg", tag:"Cocina", desc:"Aprovechá el espacio vertical de tu cocina y mantené la fruta y verdura siempre a mano." },
    { id:"hermeticos", cat:"cocina", name:"Set de Contenedores Herméticos x5", price:22900, img:"img/p-hermeticos.jpg", tag:"Cocina", desc:"5 tamaños para conservar alimentos secos sin humedad ni bichos." },
    { id:"especiero", cat:"cocina", name:"Especiero Giratorio", price:15400, img:"img/p-especiero.jpg", tag:"Cocina", desc:"Todas tus especias ordenadas y a la vista, gira 360°." },
    { id:"repasadores", cat:"cocina", name:"Set de Agarraderas y Repasadores", price:9800, img:"img/p-repasadores.jpg", tag:"Cocina", desc:"Algodón grueso, resistente al calor." },
    { id:"termico", cat:"bolsos", name:"Bolso Térmico 13L", price:16900, img:"img/p-termico.jpg", tag:"Bolsos", desc:"Mantiene la temperatura hasta 6 horas — ideal para compras y salidas." },
    { id:"multiuso", cat:"bolsos", name:"Bolso Multiuso Plegable", price:11200, img:"img/p-multiuso.jpg", tag:"Bolsos", desc:"Se pliega en su propio bolsillo, resistente hasta 20kg." },
    { id:"cesto", cat:"organizacion", name:"Cesto Organizador de Ropa Plegable", price:14600, img:"img/p-cesto.jpg", tag:"Organización", desc:"Se arma y se pliega en segundos, ideal para lavadero o placard." },
    { id:"ganchos", cat:"organizacion", name:"Ganchos Adhesivos x10 (sin perforar)", price:6500, img:"img/p-ganchos.jpg", tag:"Organización", desc:"Soportan hasta 5kg cada uno, no dañan la pared." },
    { id:"tendedero", cat:"organizacion", name:"Tendedero Plegable de Pared", price:19900, img:"img/p-tendedero.jpg", tag:"Organización", desc:"Se abre y se guarda contra la pared — ideal para espacios chicos." },
    { id:"dispenser", cat:"limpieza", name:"Dispenser de Jabón Automático", price:17300, img:"img/p-dispenser.jpg", tag:"Limpieza", desc:"Sensor de movimiento, a pilas, dosis justa cada vez." },
    { id:"escoba", cat:"limpieza", name:"Escoba y Pala Recogedora", price:8900, img:"img/p-escoba.jpg", tag:"Limpieza", desc:"Set liviano con mango largo, cerdas densas." }
  ];

  var CAT_LABEL = {
    cocina:"Cocina y despensa",
    bolsos:"Bolsos y térmicos",
    organizacion:"Organización del hogar",
    limpieza:"Limpieza"
  };

  function money(n){ return "$" + n.toLocaleString("es-AR"); }

  function waLink(msg){
    return "https://wa.me/" + WA + (msg ? ("?text=" + encodeURIComponent(msg)) : "");
  }

  function loadCart(){
    try{ return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }
    catch(e){ return {}; }
  }
  var cart = loadCart();
  var listeners = [];

  function saveCart(){
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    listeners.forEach(function(fn){ fn(cart); });
  }
  function onChange(fn){ listeners.push(fn); }
  function getCart(){ return cart; }
  function productById(id){ return PRODUCTS.filter(function(p){ return p.id === id; })[0]; }

  function addToCart(id, qty){
    qty = qty || 1;
    cart[id] = (cart[id] || 0) + qty;
    saveCart();
  }
  function setQty(id, qty){
    if(qty <= 0) delete cart[id];
    else cart[id] = qty;
    saveCart();
  }
  function removeFromCart(id){
    delete cart[id];
    saveCart();
  }
  function cartCount(){
    return Object.keys(cart).reduce(function(sum,id){ return sum + cart[id]; }, 0);
  }
  function cartTotal(){
    return Object.keys(cart).reduce(function(sum,id){
      var p = productById(id);
      return p ? sum + p.price * cart[id] : sum;
    }, 0);
  }
  function cartWaLink(){
    var ids = Object.keys(cart);
    if(!ids.length) return waLink("Hola Saga! Quiero hacer una consulta sobre sus productos.");
    var lines = ids.map(function(id){
      var p = productById(id);
      return "• " + p.name + " x" + cart[id] + " — " + money(p.price * cart[id]);
    });
    var msg = "Hola Saga! Quiero hacer este pedido:\n\n" + lines.join("\n") +
      "\n\nTotal: " + money(cartTotal()) + "\n\n(Precios de referencia, a confirmar)";
    return waLink(msg);
  }

  return {
    PRODUCTS: PRODUCTS,
    CAT_LABEL: CAT_LABEL,
    money: money,
    waLink: waLink,
    getCart: getCart,
    productById: productById,
    addToCart: addToCart,
    setQty: setQty,
    removeFromCart: removeFromCart,
    cartCount: cartCount,
    cartTotal: cartTotal,
    cartWaLink: cartWaLink,
    onChange: onChange
  };
})();
