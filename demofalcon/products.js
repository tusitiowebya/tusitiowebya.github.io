/* ============================================================
   FALCÓN FERRETERÍA — products.js
   Fuente de datos del catálogo.
   ------------------------------------------------------------
   HOY: productos de ejemplo (editables a mano).
   MAÑANA: conectar la API de tu panel para que el ferretero
   cargue los productos solo. Solo hay que descomentar el fetch
   de loadProducts() y poner la URL de tu endpoint.
   El endpoint debe devolver un array con este mismo formato:
   { id, name, cat, img, price, unit, desc }
   ============================================================ */

// Catálogo conectado a la app CobrOS (cuenta info@falconferreteria.com.ar).
// El ferretero carga los productos en CobrOS y aparecen acá solos.
const API_URL = "https://vps-5905394-x.dattaweb.com/cobros/api/cobros-publico/catalogo-api?key=cob_ac37b138ba4337f4f3f4b6ecb2433e10f34fd3cfe9a6e4d9";
const IMG_FALLBACK = "https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg?auto=compress&cs=tinysrgb&w=600";

const CATEGORIAS = [
  "Herramientas eléctricas",
  "Herramientas manuales",
  "Fijaciones",
  "Electricidad",
  "Plomería",
  "Pinturería",
  "Seguridad"
];

const IMG = id => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=600`;

const PRODUCTS = [
  { id:"taladro-650",   name:"Taladro percutor 650W",          cat:"Herramientas eléctricas", img:IMG(17419782), price:42900, unit:"x unidad",        desc:"Con maletín y set de mechas. Ideal reventa." },
  { id:"amoladora-820", name:"Amoladora angular 4½\" 820W",    cat:"Herramientas eléctricas", img:IMG(36870766), price:38500, unit:"x unidad",        desc:"Disco 115mm. Motor reforzado." },
  { id:"sierra-1400",   name:"Sierra circular 7¼\" 1400W",     cat:"Herramientas eléctricas", img:IMG(37935201), price:74900, unit:"x unidad",        desc:"Con disco widia y guía paralela." },
  { id:"amoladora-2200",name:"Amoladora 7\" 2200W",            cat:"Herramientas eléctricas", img:IMG(35841364), price:69900, unit:"x unidad",        desc:"Para obra pesada. Disco 180mm." },

  { id:"llaves-set",    name:"Juego de llaves combinadas x12", cat:"Herramientas manuales",   img:IMG(9607008),  price:28900, unit:"x juego",         desc:"Acero cromo vanadio 8 a 22mm." },
  { id:"martillo-27",   name:"Martillo carpintero 27mm",       cat:"Herramientas manuales",   img:IMG(31072226), price:6900,  unit:"x bulto x6",      desc:"Cabo de fibra antivibración." },
  { id:"cinta-5m",      name:"Cinta métrica 5m",               cat:"Herramientas manuales",   img:IMG(9302046),  price:3200,  unit:"x bulto x12",     desc:"Traba automática y clip." },

  { id:"tornillos-640", name:"Tornillos 6x40 (caja x1000)",    cat:"Fijaciones",              img:IMG(4280703),  price:18900, unit:"x caja x1000",    desc:"Cabeza Phillips, autorroscantes." },

  { id:"cable-25",      name:"Cable unipolar 2.5mm (rollo 100m)",cat:"Electricidad",          img:IMG(27363017), price:54900, unit:"x rollo 100m",    desc:"Norma IRAM. Cobre electrolítico." },
  { id:"cable-taller",  name:"Cable taller 2x1.5mm (100m)",    cat:"Electricidad",            img:IMG(31689945), price:47900, unit:"x rollo 100m",    desc:"Doble aislación, uso general." },

  { id:"canos-pvc",     name:"Caños y conexiones PVC",         cat:"Plomería",                img:IMG(38028966), price:12900, unit:"x pack",          desc:"Surtido para instalación de agua." },
  { id:"conex-rosca",   name:"Kit conexiones rosca",           cat:"Plomería",                img:IMG(9666305),  price:9900,  unit:"x kit",           desc:"Codos, cuplas y niples variados." },

  { id:"latex-20",      name:"Látex interior/exterior 20L",    cat:"Pinturería",              img:IMG(28268141), price:45900, unit:"x balde 20L",     desc:"Alto rendimiento, lavable." },
  { id:"esmalte-x6",    name:"Esmalte sintético (caja x6)",    cat:"Pinturería",              img:IMG(35740586), price:32900, unit:"x caja x6",       desc:"Brillante, secado rápido." },

  { id:"guantes-x12",   name:"Guantes de trabajo (x12 pares)", cat:"Seguridad",               img:IMG(16552843), price:11900, unit:"x pack x12",      desc:"Moteados, alta adherencia." },
  { id:"candado-50",    name:"Candado bronce 50mm (x6)",       cat:"Seguridad",               img:IMG(31410815), price:15900, unit:"x bulto x6",      desc:"3 llaves c/u. Antiganzúa." },
  { id:"candado-60",    name:"Candado seguridad 60mm",         cat:"Seguridad",               img:IMG(4808267),  price:4200,  unit:"x unidad",        desc:"Arco endurecido reforzado." }
];

/* Carga de productos desde CobrOS.
   Devuelve el catálogo real del negocio; si CobrOS está vacío o no responde,
   usa los productos de ejemplo de arriba para que la web nunca quede vacía. */
async function loadProducts(){
  if (API_URL) {
    try {
      const r = await fetch(API_URL, { headers: { "Accept": "application/json" } });
      if (r.ok) {
        const data = await r.json();
        const arr = Array.isArray(data) ? data : (data && Array.isArray(data.productos) ? data.productos : []);
        if (arr.length) {
          return arr.map(function(p){
            return {
              id:    String(p.id || p._id || p.nombre),
              name:  p.name  || p.nombre     || "Producto",
              cat:   p.cat   || p.categoria  || "Productos",
              img:   p.img   || p.foto       || IMG_FALLBACK,
              price: (p.price != null ? p.price : p.precio) || 0,
              unit:  p.unit  || p.unidad     || "",
              desc:  p.desc  || p.descripcion || ""
            };
          });
        }
      }
    } catch (e) {
      console.warn("CobrOS no disponible, uso productos de ejemplo:", e);
    }
  }
  return PRODUCTS;
}
