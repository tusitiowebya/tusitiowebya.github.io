# El Tecla Ventas Online

Demo: https://eltecla.tupaginaya.com.ar/

Datos confirmados: logo provisto, venta de videojuegos, WhatsApp +54 9 11 2403-5261 y deseo de cargar/quitar juegos desde CobrOS. Instagram fue indicado por nombre comercial; no hay usuario verificable. Localidad sin confirmar. El usuario respondió «no sé» a la consulta de esos datos.

## Activación del catálogo

La integración está implementada, pero `config.js` tiene `slug: ''`: no existe un comercio identificable en CobrOS por nombre El Tecla ni por el teléfono provisto (consulta de solo lectura, 05/10/2026). No se creó una cuenta con email o datos inventados y no se publicaron productos de muestra.

1. Crear la cuenta real de El Tecla, con su correo y acceso, o identificar una existente.
2. Asignar el plan de catálogo correspondiente por el flujo del handoff.
3. Completar `slug` en `config.js` con el identificador real y verificar el GET público.
4. Cargar títulos, fotos, precios y categorías reales desde el panel. Las categorías del panel alimentan los filtros de la web. Para consultar por plataforma conviene usar categorías claras por consola, sin imponer plataformas que el cliente no venda.
5. Desactivar o eliminar los juegos vendidos desde CobrOS: desaparecen de la web en la siguiente lectura (al cargar, volver a la pestaña o cada 60 segundos con la página visible). La lista se vuelve a validar antes de enviar un pedido.

**Limitación comprobada del backend actual:** el GET público solo publica productos activos y NO devuelve `stock` ni `controlaStock`. Bajar stock a cero no equivale a desactivar el producto. Por eso la web indica «Confirmá disponibilidad», sin prometer ocultamiento automático de vendidos. El cliente debe desactivarlos en el panel. El adaptador ya contempla stock cuando el backend lo exponga; requiere `controlaStock: true` y `stock: 0` para impedir selección. No se modificó el backend global de CobrOS.

## Pedidos

Lista local de IDs, búsqueda sin acentos, filtros según categorías reales, orden por título/precio, consultas por juego o lista en WhatsApp. La lista es una consulta y no reserva stock. El envío explícito de pedido solicita nombre/teléfono y hace POST al endpoint público con `{nombre, telefono, nota, items:[{productoId,cantidad:1}]}`; CobrOS registra el cargo pendiente. No se guarda información personal en localStorage. Se ofrece el link de pago únicamente si CobrOS lo devuelve. Ante un fallo de respuesta POST no se reintenta automáticamente, porque el servidor puede haber registrado el pedido.

Estados: pendiente de vinculación, cargando, catálogo vacío, error con reintento, resultados, búsqueda sin coincidencias y producto sin stock cuando se informe. Ningún estado usa productos ficticios como fallback.

## Material y SEO

Logo original provisto por el usuario, optimizado a WebP con eliminación por flood-fill solo del negro exterior (conserva los negros internos), y wordmark recortado para navegación. Hero ilustrativo: cottonbro studio / Pexels 4523105, inspeccionado antes de diseñar, MP4 H.264 sin audio (1280×720, 4,72 s, 292.721 bytes), póster propio. OG 1200×630 con marca, paleta y frase propia; favicons 32/180/512. Canonical al subdominio y OG/logo a URL absoluta de GitHub Pages. Schema OnlineStore, WebSite, FAQPage, CollectionPage y BreadcrumbList. Sin zona, precios, reseñas, servicios de reparación, envíos ni medios de pago no confirmados.

El radar de juegos prepara una consulta contextual por título/consola o recomendación, con vista previa accesible. No crea reservas ni supone stock de ninguna plataforma.
