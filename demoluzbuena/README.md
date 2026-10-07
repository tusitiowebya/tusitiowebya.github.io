# Luz Buena — tienda conectable a CobrOS

Demo: https://luzbuena.tupaginaya.com.ar (portada) · `/tienda/` (catálogo completo).

## Datos confirmados
- Nombre: Luz Buena (`@luz_buena` en Instagram). Rubro: sahumerios, difusores, esencias, fuentes de agua, lámparas de sal y bienestar.
- WhatsApp 11 7611-9607 (`5491176119607`). Zona: El Palomar.
- Productos, precios y aromas: tomados de 15 flyers enviados por el cliente y de los posts de Instagram (octubre 2026).
- Sin precio publicado (quedan como "Para consultar"): sahumerios con piedritas Aromanza Crystal Scents, esencias sólidas para hornito, lámparas de sal.
- Kit Aromas ($11.000) y stickers de signos ($1.000) no tienen foto: se muestran con ilustración rotulada.

## Cómo funciona la tienda
- `config.js` → `slug` vacío = **modo vista previa**: muestra el catálogo inicial de `data.js` y el pedido sale solo por WhatsApp.
- Con `slug` cargado: `GET /catalogo/{slug}` con timeout de 8 s. Estados: cargando, vacío, error/timeout con "Reintentar".
  Productos con precio 0 o `activo:false` no se muestran.
- Pedido: `POST /catalogo/{slug}/pedido` con `productoId` reales; el aroma/signo elegido va en `nota`.
  Si el servidor devuelve `init_point`, se ofrece "Pagar con Mercado Pago". Después, WhatsApp con el detalle.
- Las opciones de aroma y las "energías" se enlazan **por nombre de producto**: si en CobrOS se carga con el mismo
  nombre que en `data.js`, hereda los aromas (ej. "Esencia para difusor premium (1 litro)" → 21 aromas).
  Categorías: usar los nombres de `LUZ_CATS` (Sahumerios, Difusores y esencias, Rocíos y bombitas, Kits y regalos,
  Souvenirs, Fuentes de agua, Stickers). Una categoría nueva aparece sola como chip.

## Activación en CobrOS (pendiente)
1. Alta del comercio (`POST /cobros/api/auth/register`) con nombre **"Luz Buena"** → slug `luz-buena`. Necesita email real del cliente.
2. Subir el plan a `WEB_TIENDA` antes de cargar productos (el trial corta en 3).
3. Cargar los productos de `data.js` (nombre, categoría, precio, unidad, descripción, foto).
4. Poner `slug: 'luz-buena'` en `config.js`, commit y push.

## Pendientes del cliente
Email para la cuenta CobrOS, fotos del Kit Aromas, stickers y lámparas de sal, precios de piedritas/esencias sólidas/lámparas,
forma de entrega (retiro/envío) y medios de pago.
