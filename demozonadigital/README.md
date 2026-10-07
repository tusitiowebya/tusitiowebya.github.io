# Zona Digital · demo

Demo de venta de cursos, ebooks y recetarios digitales. Sitio estático en HTML, CSS y JS; portada y `/catalogo/` comparten una selección persistida por dispositivo.

## Datos confirmados

- Zona Digital; cursos, ebooks y recetarios digitales.
- WhatsApp: +54 9 341 752-9487.
- Instagram informado: `https://www.instagram.com/zonadigital.cursos/`.
- Email: `Zonadigital.cursos@gmail.com`.
- Preferencia: estética oscura, tecnológica y colores neón.
- El usuario pidió dejar la conexión a CobrOS preparada, **sin crear cuenta**.

Sin dirección, ciudad, horarios, reseñas, precios, cifras, certificaciones, duración de cursos, modalidad de entrega ni medios de pago supuestos. El prefijo telefónico no se usó para afirmar una ubicación. El perfil de Instagram no pudo verificarse públicamente durante la sesión. Facebook está pendiente de URL exacta; no se inventó un enlace.

La marca tipográfica y el símbolo Z son una propuesta de demo, pendiente del logo real. Las seis portadas y los temas son ejemplos claramente identificados; **no son productos reales ni una oferta de venta**. No hay Schema Product ni Offer para esos ejemplos. Video abstracto ilustrativo de Pexels 39923147, inspeccionado antes de diseñar y optimizado sin audio; póster del segundo 3.

## Conectar CobrOS cuando se active el negocio

1. Crear la cuenta real fuera de esta demo, con datos del titular y plan correspondiente. Esta tarea no creó usuarios, tenants ni productos en CobrOS.
2. Cargar títulos, descripción, imágenes, categoría y precio reales. Categorías recomendadas: Cursos, Ebooks y Recetarios. Cargar el producto como digital y configurar su material, enlaces o archivos y reglas de entrega en el panel de CobrOS.
3. Completar `slug` en `config.js` con el identificador real del comercio. No usar contraseñas ni credenciales de administrador en el sitio.
4. Verificar catálogo y entrega digital en un entorno de prueba antes de habilitar compras reales. MercadoPago se configura en CobrOS; el sitio solo muestra el enlace de pago si el servidor lo devuelve.

Con `slug: ''` la web muestra la demo, no solicita datos al backend y no permite registrar pedidos. Al configurar el slug, las muestras desaparecen; el GET público `/catalogo/{slug}` maneja carga, vacío, error y timeout de 8 segundos. No hay fallback de productos ficticios en modo real. Las categorías se normalizan sin acentos; los formatos no reconocidos aparecen en Otros. Foto real cuando existe; si falta, se usa una ilustración de formato, sin afirmar que es la portada oficial.

El pedido se registra únicamente al enviar el formulario explícito, con nombre, teléfono, email y `items: [{ productoId, cantidad: 1 }]`. Antes del POST se vuelven a verificar productos y precios; un cambio exige revisar la selección. Los precios se toman del servidor y el backend vuelve a calcularlos. Un envío incierto se bloquea contra reintentos en la sesión del navegador; se pide consultar por WhatsApp. No se abre WhatsApp ni se efectúa un pago automáticamente. El enlace de WhatsApp presenta exactamente el mensaje que muestra la vista previa.

Si el backend devuelve `init_point`, se habilita Continuar al pago. Si devuelve `entregaToken` para un producto gratuito, se habilita el enlace a `/entrega/{token}` en CobrOS. La confirmación de cobro y entrega permanece en CobrOS. Los límites, vencimientos y condiciones del material son responsabilidad de la configuración real del producto.

La API actual puede omitir stock y `controlaStock`; por eso no se anuncia stock inventado. Desactivar productos desde CobrOS para retirarlos del catálogo. Se respetan los campos de stock cuando el backend los expone.

## Rutas y SEO

Portada prevista: `https://zonadigital.tupaginaya.com.ar/`. El subdominio del handoff redirige a GitHub Pages descartando paths; canonical del catálogo y OG/Twitter usan las URLs absolutas de GitHub Pages que realmente sirven esos recursos. OG propia 1200×630, favicon SVG y PNG 32/180/512, JSON-LD OnlineStore y WebSite/CollectionPage con datos confirmados, sitemap y enlaces relativos.

## Verificación

Auditoría SEO y assets de la skill, inspección completa desktop 1440×900 e iPhone 13 emulado 390×844 (touch y escala de dispositivo), además de 360×780. Se revisan búsqueda sin acentos, filtros, estado sin coincidencias, fichas, selección entre páginas, mensaje WhatsApp, menú, video/pausa, movimiento reducido, imágenes y desborde horizontal. Pruebas de CobrOS con fixtures interceptados localmente: payload, pago, entrega gratis, cambio de precio, duplicados, error, timeout y catálogo vacío. No se enviaron pedidos ni mensajes reales.

Pendientes para la activación comercial: logo oficial, URL exacta de Facebook, productos/portadas/precios reales, slug de CobrOS y configuración de pago/entrega. Localidad o zona solo si el cliente la confirma y resulta relevante para la venta digital.

## Publicación provisional · 7 de octubre de 2026

GitHub rechazó el push con `Internal Server Error` y su API Git devolvió HTTP 500. El código quedó comprometido localmente, sin force push ni cambios de otros clientes. Para entregar una demo usable se publicó una copia idéntica en `/home/tupagina/public_html/demozonadigital` del hosting TuPaginaYa; solo las URLs absolutas de assets, catálogo y sitemap del espejo se sustituyeron por `https://tupaginaya.com.ar/demozonadigital/` para evitar referencias a Pages aún inexistentes.

`https://zonadigital.tupaginaya.com.ar/` tiene temporalmente un 302 a ese espejo. Se modificó únicamente la regla de Zona Digital, con backup y escritura atómica, preservando las reglas de otros clientes. Portada, catálogo, CSS/JS, video, póster, OG 1200×630 y favicons respondieron HTTP 200; la página pública pasó revisión desktop/iPhone sin errores ni desborde.

Cuando GitHub vuelva a aceptar escritura: subir los commits pendientes a `origin main`, esperar el build de Pages y comprobar sus assets; recién entonces restaurar la regla de este cliente a `RewriteRule ^(.*)$ https://tusitiowebya.github.io/demozonadigital [R=301,L]`. La copia local ya conserva las URLs de Pages previstas y no necesita cambios de código. No se debe restaurar el `.htaccess` compartido completo desde un backup, porque podría borrar altas posteriores de otros clientes; cambiar solo la regla de Zona Digital.
