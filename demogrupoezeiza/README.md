# GRUPO EZEIZA JL - Landing Page Demo

Landing page profesional para empresa de movimiento de suelos, demoliciones y obras civiles.

## Estructura de Archivos

```
grupo-ezeiza-demo/
├── index.html          # Página principal HTML
├── style.css           # Estilos CSS
├── script.js           # JavaScript para interactividad
├── images/             # Carpeta de imágenes
│   ├── hero-excavator.jpg
│   ├── gallery-1.jpg
│   ├── gallery-2.jpg
│   ├── gallery-3.jpg
│   └── gallery-4.jpg
└── README.md           # Este archivo
```

## Características

✅ **Diseño Responsive** - Se adapta perfectamente a móviles, tablets y desktop
✅ **Navegación Sticky** - Menú fijo que cambia al hacer scroll
✅ **Hero a Pantalla Completa** - Imagen impactante con overlay
✅ **Animaciones Suaves** - Efectos al hacer scroll
✅ **Botón WhatsApp Flotante** - Acceso directo a contacto
✅ **Formulario de Contacto** - Con integración a WhatsApp
✅ **Galería de Trabajos** - Showcase de proyectos
✅ **100% HTML/CSS/JavaScript** - Sin dependencias externas

## Secciones Incluidas

1. **Hero Section** - Presentación principal con llamados a la acción
2. **Sobre Nosotros** - Descripción de la empresa
3. **Servicios** - 7 servicios con iconos y descripciones
4. **Galería** - 4 imágenes de trabajos realizados
5. **Por Qué Elegirnos** - 4 ventajas principales
6. **Call to Action** - Botones de contacto destacados
7. **Formulario de Contacto** - Con campos completos
8. **Footer** - Información de contacto y horarios

## Cómo Usar

### Opción 1: Abrir Directamente
Simplemente abre el archivo `index.html` en tu navegador web.

### Opción 2: Servidor Local
Para mejores resultados (especialmente con imágenes), usa un servidor local:

```bash
# Con Python 3
python -m http.server 8000

# Con Python 2
python -m SimpleHTTPServer 8000

# Con Node.js (si tienes http-server instalado)
npx http-server
```

Luego abre tu navegador en `http://localhost:8000`

## Personalización

### Cambiar Información de Contacto

Busca y reemplaza en **index.html** y **script.js**:
- Teléfono: `+5491112345678`
- Email: `info@grupoezeizajl.com`
- Ubicación: `Ezeiza, Buenos Aires`

### Cambiar Colores

Edita las variables CSS en **style.css** (líneas 10-17):

```css
:root {
  --color-primary: #e87538;      /* Color principal (naranja)
  --color-secondary: #2d2d2d;    /* Color secundario (gris oscuro) */
  --color-background: #fafafa;   /* Fondo */
  --color-foreground: #262626;   /* Texto */
  /* ... */
}
```

### Cambiar Imágenes

Reemplaza los archivos en la carpeta `images/` manteniendo los mismos nombres:
- `hero-excavator.jpg` - Imagen principal (recomendado: 1920x1080px)
- `gallery-1.jpg` a `gallery-4.jpg` - Imágenes de galería (recomendado: 800x600px)

### Modificar Servicios

Edita la sección de servicios en **index.html** (aproximadamente línea 77):

```html
<div class="service-card">
  <!-- SVG Icon -->
  <h3 class="service-title">Tu Servicio</h3>
  <p class="service-description">Descripción del servicio</p>
</div>
```

## Compatibilidad

- ✅ Chrome (últimas 2 versiones)
- ✅ Firefox (últimas 2 versiones)
- ✅ Safari (últimas 2 versiones)
- ✅ Edge (últimas 2 versiones)
- ✅ Móviles iOS y Android

## Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con Flexbox y Grid
- **JavaScript ES6** - Interactividad y animaciones
- **SVG** - Iconos vectoriales

## Optimizaciones Incluidas

- Smooth scroll para navegación
- Lazy loading implícito en imágenes
- Efecto parallax en hero
- Intersection Observer para animaciones
- Menú responsivo con hamburguesa
- Formulario con validación HTML5

## Próximos Pasos Sugeridos

1. **Hosting**: Sube los archivos a cualquier hosting web
2. **Dominio**: Conecta un dominio personalizado
3. **Analytics**: Agrega Google Analytics para métricas
4. **Backend**: Conecta el formulario a un servicio de email
5. **SEO**: Optimiza meta tags y agrega sitemap.xml

## Soporte

Para preguntas o personalizaciones adicionales, contacta al desarrollador.

---

**Desarrollado con ❤️ para Grupo Ezeiza JL**
