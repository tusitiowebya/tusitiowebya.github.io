# MalqueridaStore — demo de TuPaginaYa

Entrega: https://malqueridastore.tupaginaya.com.ar/

Feria americana / moda circular. WhatsApp **5491127330114**, solo mensajes. Instagram @malqueridastore. Bio y publicaciones confirman Av. de Mayo 817, CABA, locales 55–58; lunes a viernes 10–18:30; envíos a todo el país; compra, venta y consignación. Información consultada el 07/10/2026.

## Material real

- https://www.instagram.com/p/DeHu6_pxO2T/ — video de vidriera: hero optimizado (7 segundos / 720×1280, sin audio, faststart), póster y recortes de prendas.
- https://www.instagram.com/p/DeMu0qOx5K1/ — look rojo y negro.
- https://www.instagram.com/p/DeFkOkJR0J8/ — flyer de consignación y logo recortado conservando el diseño original.
- https://www.instagram.com/malqueridastore/ — bio, actividad, dirección, WhatsApp y envíos.

El carrusel muestra **looks publicados**, no un inventario confirmado. La etiqueta, la ficha, la FAQ y el mensaje WhatsApp aclaran que se consulta disponibilidad. Sin precios, talles, stock, composición de las prendas, testimonios ni condiciones inventados. Los recortes pueden mostrar varias prendas; cada consulta incluye nombre, publicación original y URL absoluta de la foto para identificar el interés. Las medidas son una referencia de una prenda del visitante, no una recomendación automática de talle.

## Interacción

Carrusel touch/scroll-snap, flechas y teclado; buscador sin distinción de acentos; categorías; ficha modal; favoritas persistidas en localStorage por catálogo; “Mi perchero” con medidas opcionales, nota y vista previa exacta de WhatsApp. Guardar no reserva stock. Los links abren la consulta: no envían mensajes automáticamente. La selección es una consulta comercial, no un checkout ni un pedido confirmado.

## CobrOS

`config.js` mantiene `slug: ''`. No se creó un tenant: no tenemos email administrativo real ni productos con todos sus datos. Sin slug no hay llamadas al backend. Para activar, reemplazar el slug por el del comercio real; el GET público `/catalogo/{slug}` reemplaza por completo los looks de Instagram. Nunca mezcla ambos catálogos ni usa Instagram como fallback de un error.

GET con timeout 8 segundos, carga/vacío/error con reintento; mapeo de `_id`, nombre, categoría, descripción, foto y precio. La ausencia de foto muestra el isotipo de la demo. Stock agotado solo si `controlaStock` es true y stock es numérico. Sin precios positivos confirmados se indica “A consultar”. La clave de persistencia separa las consultas de Instagram del inventario activo.

El flujo solicitado vende por **consulta WhatsApp**: no ejecuta POST `/pedido`, no descuenta stock y no abre un pago. Para ofrecer checkout a futuro, acordar pagos, reservas, envíos y cargar productos reales; implementar confirmación y validación de inventario antes de activar pedidos de CobrOS.

## SEO y publicación

HTML/CSS/JS separados, rutas relativas. ClothingStore + WebSite con datos reales; canonical al subdominio, OG/Twitter en URL absoluta de GitHub Pages; OG propia 1200×630, favicon SVG/32/180/512, sitemap. No se publica Schema Product/Offer para los looks sin precio y disponibilidad confirmados.

Commit y push restringidos a `demomalqueridastore/`. Subdominio mediante `/root/nuevo-demo.sh malqueridastore demomalqueridastore`.

Pendientes de activación comercial: disponibilidad y datos por prenda, email del comercio y slug real de CobrOS, política de pago/reserva, condiciones de consignación y costo/plazo de envíos. La demo ya permite consultar con los datos públicos.
