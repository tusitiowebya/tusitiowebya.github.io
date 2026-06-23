/* ============================================================
   BEAUTY LADY'S DISTRIBUIDORA — products.js
   Fuente de datos del catálogo.
   ------------------------------------------------------------
   HOY: productos de ejemplo (editables a mano).
   MAÑANA: conectá la API de tu panel para cargar los productos
   solos. Solo completá API_URL con la URL de tu endpoint.
   El endpoint debe devolver un array con este mismo formato:
   { id, name, cat, img, price, unit, desc }
   ============================================================ */

const API_URL = ""; // <-- poné acá la URL de tu API cuando la tengas

const CATEGORIAS = [
  "Maquillaje",
  "Skincare",
  "Perfumes",
  "Cabello",
  "Uñas",
  "Accesorios"
];

const IMG = id => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=600`;

const PRODUCTS = [
  /* ---------- MAQUILLAJE ---------- */
  { id:"labial-matte",   name:"Labial matte larga duración",     cat:"Maquillaje", img:IMG(7810600),  price:3900,  unit:"x unidad",   desc:"Acabado aterciopelado, no reseca. Varios tonos." },
  { id:"paleta-sombras", name:"Paleta de sombras 18 tonos",      cat:"Maquillaje", img:IMG(301367),   price:9900,  unit:"x unidad",   desc:"Mates y shimmer altamente pigmentados." },
  { id:"base-hd",        name:"Base líquida HD cobertura total",  cat:"Maquillaje", img:IMG(25533534), price:7500,  unit:"x unidad",   desc:"Larga duración, acabado natural. Tonos surtidos." },
  { id:"mascara-pest",   name:"Máscara de pestañas volumen",      cat:"Maquillaje", img:IMG(25906586), price:4200,  unit:"x unidad",   desc:"Efecto pestañas postizas, a prueba de agua." },
  { id:"rubor-compact",  name:"Rubor compacto + iluminador",      cat:"Maquillaje", img:IMG(7810602),  price:3500,  unit:"x unidad",   desc:"Dúo en polvo, tono durazno y champagne." },

  /* ---------- SKINCARE ---------- */
  { id:"serum-vitc",     name:"Serum facial Vitamina C",          cat:"Skincare",   img:IMG(4841460),  price:8900,  unit:"x unidad",   desc:"Ilumina y unifica el tono. 30ml." },
  { id:"crema-hidra",    name:"Crema hidratante facial",          cat:"Skincare",   img:IMG(4841179),  price:6900,  unit:"x unidad",   desc:"Ácido hialurónico, todo tipo de piel. 50ml." },
  { id:"agua-micelar",   name:"Agua micelar 3 en 1 · 500ml",      cat:"Skincare",   img:IMG(4173383),  price:4500,  unit:"x unidad",   desc:"Desmaquilla, limpia y tonifica sin enjuague." },
  { id:"protector-50",   name:"Protector solar facial FPS50",     cat:"Skincare",   img:IMG(13139108), price:7900,  unit:"x unidad",   desc:"Toque seco, base de maquillaje ideal." },
  { id:"contorno-ojos",  name:"Contorno de ojos antifatiga",      cat:"Skincare",   img:IMG(4841178),  price:5900,  unit:"x unidad",   desc:"Reduce ojeras y bolsas. 15ml." },

  /* ---------- PERFUMES ---------- */
  { id:"perfume-arabe",  name:"Perfume árabe 100ml",              cat:"Perfumes",   img:IMG(29982967), price:12900, unit:"x unidad",   desc:"Alta concentración, estela duradera." },
  { id:"body-splash",    name:"Body splash frutal 250ml",         cat:"Perfumes",   img:IMG(6958875),  price:4900,  unit:"x unidad",   desc:"Fragancia fresca para todos los días." },
  { id:"set-perfumes",   name:"Set de perfumes x3 miniaturas",    cat:"Perfumes",   img:IMG(28481966), price:15900, unit:"x set",      desc:"Tres fragancias premium para regalo." },
  { id:"edp-femenino",   name:"Eau de Parfum femenino 90ml",      cat:"Perfumes",   img:IMG(16722498), price:11500, unit:"x unidad",   desc:"Floral amaderado, elegante y sofisticado." },

  /* ---------- CABELLO ---------- */
  { id:"shampoo-1l",     name:"Shampoo nutritivo profesional 1L", cat:"Cabello",    img:IMG(1116344),  price:5900,  unit:"x unidad",   desc:"Sin sal, repara y da brillo. Rinde mucho." },
  { id:"mascara-kerat",  name:"Máscara capilar de keratina",      cat:"Cabello",    img:IMG(4494849),  price:6500,  unit:"x unidad",   desc:"Nutrición profunda para cabello dañado." },
  { id:"serum-capilar",  name:"Serum capilar anti-frizz",         cat:"Cabello",    img:IMG(1035680),  price:4900,  unit:"x unidad",   desc:"Sella puntas y controla el frizz al instante." },
  { id:"kit-alisado",    name:"Kit alisado profesional",          cat:"Cabello",    img:IMG(20272960), price:13900, unit:"x kit",      desc:"Shampoo + tratamiento + sellado. Salón en casa." },

  /* ---------- UÑAS ---------- */
  { id:"esmalte-semi",   name:"Esmalte semipermanente",           cat:"Uñas",       img:IMG(10420563), price:2900,  unit:"x unidad",   desc:"Brillo de gel hasta 21 días. Tonos surtidos." },
  { id:"kit-esculpidas", name:"Kit de uñas esculpidas",           cat:"Uñas",       img:IMG(24653480), price:9900,  unit:"x kit",      desc:"Acrílico, moldes, pinceles y tips. Completo." },
  { id:"set-esmaltes",   name:"Set de esmaltes x12",              cat:"Uñas",       img:IMG(9329773),  price:8900,  unit:"x set x12",  desc:"Colección de temporada, secado rápido." },
  { id:"lima-acc",       name:"Set de limas y accesorios",        cat:"Uñas",       img:IMG(11434533), price:1900,  unit:"x pack",     desc:"Limas, palitos y pulidor. Para reventa." },

  /* ---------- ACCESORIOS ---------- */
  { id:"set-pinceles",   name:"Set de pinceles x12",              cat:"Accesorios", img:IMG(6575023),  price:7900,  unit:"x set",      desc:"Cerdas suaves, mango premium. Estuche incluido." },
  { id:"beauty-blender",  name:"Esponjas beauty blender x4",      cat:"Accesorios", img:IMG(3018845),  price:3200,  unit:"x pack x4",  desc:"Difuminado perfecto, libres de látex." },
  { id:"organizador",    name:"Organizador de cosméticos",        cat:"Accesorios", img:IMG(6233289),  price:5500,  unit:"x unidad",   desc:"Acrílico transparente, varios compartimentos." },
  { id:"espejo-led",     name:"Espejo con luz LED regulable",     cat:"Accesorios", img:IMG(6713324),  price:8500,  unit:"x unidad",   desc:"Maquillaje perfecto con luz de día. Recargable." }
];

/* Carga de productos — API-ready.
   Cuando tengas el panel, completá API_URL arriba y listo. */
async function loadProducts(){
  if (API_URL) {
    try {
      const r = await fetch(API_URL);
      if (r.ok) {
        const data = await r.json();
        if (Array.isArray(data) && data.length) return data;
      }
    } catch (e) {
      console.warn("API no disponible, uso productos de ejemplo:", e);
    }
  }
  return PRODUCTS;
}
