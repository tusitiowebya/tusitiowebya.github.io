# MalqueridaStore — demo de TuPaginaYa

Entrega: https://malqueridastore.tupaginaya.com.ar/ · catálogo: `catalogo/`

Feria americana seleccionada / moda circular. WhatsApp **5491127330114** (solo mensajes). Instagram, Facebook y TikTok @malqueridastore. Av. de Mayo 817, locales 55–58, CABA, "galería lateral a Café Tortoni" (caption del reel De9pKM9RTls, 26/10). L–V 10–18:30 (bio, 07/10). Envíos a todo el país.

## Rediseño 27/10/2026

El cliente mandó una captura de su Tiendanube (malqueridastore.mitiendanube.com) con la identidad nueva: logo "M" en círculo con corazón, MALQUERIDASTORE en serif, "Feria americana seleccionada", negro/crema/bordó, "Prendas únicas. Estilo auténtico", ingresos semanales, hallazgos únicos, calidad seleccionada. Pidió **catálogo aparte**.

- Logo: brandboard real de Tiendanube (`logo-…png` 2796×1290), alfa por luma → `media/logo.png`, `wordmark.png`, `emblem.png`; favicons con el emblema sobre negro.
- La Tiendanube **no tiene productos cargados** (placeholders): no hay precios ni stock reales.
- Hero: reel DeHvMpeR6A1 (vidriera), tramo 11,6–18,4 s recortado 3:4, 720×960, sin audio, faststart (860 KB).
- Catálogo: 14 prendas recortadas de fotogramas de reels reales (De9pKM9RTls, DeuOS7Dx9Kf, DeekJfDRx6E, DeHvMpeR6A1) + el look DeMu0qOx5K1. Datos en `prendas.js`: nombre descriptivo de lo que se ve, categoría, reel de origen y fecha. Sin precio, talle, estado ni stock: todo "A consultar".

## Estructura

- `index.html` + `script.js`: portada (vidriera en arco, recién colgado, Avisame, consignación, local con mapa, FAQ).
- `catalogo/index.html` + `catalogo/script.js`: el perchero completo con filtros por tipo, búsqueda, ficha, estados de carga/vacío/error.
- `tienda.js`: compartido (carga CobrOS o `prendas.js`, "Mis elegidas" en localStorage, mensajes WhatsApp, lista de espera "Avisame").
- `style.css` compartido. `config.js`: CobrOS con `slug: ''`.

## CobrOS

Sin tenant (falta email real y productos con datos). Con slug: GET público con timeout, reemplaza por completo `prendas.js`, categorías dinámicas, HTML escapado, foto inválida → emblema, precio 0 → "A consultar", stock 0 con `controlaStock` → "Ya se fue". Probado con mocks (ok/vacío/500/inválido/timeout + reintento). La selección es una consulta por WhatsApp: no hace POST `/pedido`.

## Pendientes del cliente

Precios/talles/estado por prenda (o cargar Tiendanube/CobrOS), condiciones de consignación, costo de envíos, si el horario sigue L–V 10–18:30, y si la web debe enlazar a la Tiendanube cuando tenga productos.
