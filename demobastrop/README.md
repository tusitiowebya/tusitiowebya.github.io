# Bastrop — demo mayorista

Confirmado: Bastrop, indumentaria por mayor, compra con monto mínimo y WhatsApp +54 9 11 6114-0820. No se confirmó zona, mínimo, precios, productos, marca gráfica, formas de entrega ni Instagram. El usuario informó `Bastrop.mayorisa` y luego respondió que no conocía los datos faltantes. No se enlaza una red supuesta.

La referencia Dux / Yami es otro negocio. Sus productos, precios e imágenes no se copiaron. Esta demo tiene cuatro ilustraciones de prendas y talles explícitamente de ejemplo, sin precios, inventario ni checkout real. El video Pexels 8195083 es ilustrativo; se inspeccionó su contacto a 0/2/4/6 segundos antes del diseño.

## Activación CobrOS

- Completar `config.js` con el `slug` verificado de la cuenta y `minimumPurchase` en ARS. Se consultó el endpoint público `/catalogo/bastrop` el 05/10/2026: HTTP 404. Consulta interna de solo lectura por nombre Bastrop y teléfono terminado en 61140820: sin coincidencias. No se creó un tenant con correos o credenciales ficticios.
- Con slug configurado, el sitio carga exclusivamente productos reales. Incluye timeout de 8 segundos y estados de carga, vacío, error y cuenta sin configurar. El ejemplo solo se abre de forma explícita y tiene carrito separado.
- La API actual devuelve productos sin atributos de variantes ni stock. Para talles y colores reales, cargar **cada variante como un producto/SKU separado**, con prenda + color + talle en el nombre. La web manda el ID de esa variante, nunca inventa talles para un producto real.
- Pedido: `POST /catalogo/{slug}/pedido`, body `{nombre, telefono, nota, items:[{productoId,cantidad}]}`. Los precios se validan por el servidor. Muestra el resultado, el resumen de WhatsApp y, si viene de CobrOS, el link de Mercado Pago.
- El botón de registro exige mínimo confirmado y alcanzado, precios válidos, nombre y teléfono. El mínimo está validado en esta interfaz: **el backend CobrOS actual no tiene regla de mínimo por negocio**. Para impedir compras por debajo del mínimo desde cualquier otro cliente/API, debe incorporarse esa validación al backend antes de la activación comercial. No se modificó el backend compartido como parte de esta demo.
- CobrOS no expone stock en este endpoint: no se publican cifras de stock ni garantías de disponibilidad. Confirmar estas condiciones con el negocio.
- El registro se bloquea durante envío y después del éxito; un fallo de red invita a consultar antes de reintentar. No hay envío automático de mensajes ni pagos. No se ejecutaron pedidos reales durante QA.

Carrito por navegador en localStorage, solo IDs y cantidades. No se guardan los datos de contacto. Portada y `/catalogo/` comparten carrito. SEO sin ubicación supuesta; OG y favicons propios. Identidad gráfica propuesta, pendiente del logo del cliente.
