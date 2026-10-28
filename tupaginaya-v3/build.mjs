#!/usr/bin/env node
/* =====================================================================
   TuPaginaYa v3 · generador del sitio estático
   Uso:
     node build.mjs          → genera dist/ (HTML, assets, sitemap, robots, llms)
     node build.mjs --og     → además renderiza las imágenes OG (Edge headless)
   dist/ se sube tal cual a /home/tupagina/public_html (raíz del dominio).
   ===================================================================== */
import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { SITE, PLANES, RUBROS, SITIOS, FAQ, wa, money, rubroOf, sitiosDe } from './src/data.mjs';
import { GUIAS } from './src/guias.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, 'dist');
const REPO = path.resolve(ROOT, '..');
const DO_OG = process.argv.includes('--og');
const ASSET_V = Date.now().toString(36); // cache-busting de css/js

/* ---------------------------------------------------------------------
   utilidades
   ------------------------------------------------------------------- */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const abs = (p) => SITE.url + p;
const write = (rel, content) => {
  const f = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, content);
};
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(path.join(DIST, to)), { recursive: true });
  fs.copyFileSync(from, path.join(DIST, to));
};
const pages = []; // registro para sitemap, llms y OG
const brandT = (t) => (t.length + 13 <= 65 ? `${t} | TuPaginaYa` : t);
const lc = (t) => t[0].toLowerCase() + t.slice(1);
const clip = (t, n = 160) => (t.length <= n ? t : t.slice(0, t.lastIndexOf(' ', n - 1)).replace(/[,:;.]?$/, '…'));

const ICON = {
  wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.28-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88M20.46 3.49A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.42"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
  card: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 9h8M8 13h5"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
};
const trails = '<div class="trails" aria-hidden="true"><i></i><i></i><i></i><i></i></div>';

/* ---------------------------------------------------------------------
   JSON-LD base
   ------------------------------------------------------------------- */
const ORG_ID = abs('/#org');
const WEBSITE_ID = abs('/#website');
const orgNode = {
  '@type': ['Organization', 'ProfessionalService'],
  '@id': ORG_ID,
  name: SITE.name,
  url: SITE.url + '/',
  logo: { '@type': 'ImageObject', url: abs('/brand/icon-512.png'), width: 512, height: 512 },
  image: abs('/og/home.jpg'),
  description: SITE.description,
  slogan: SITE.tagline,
  telephone: SITE.telE164,
  priceRange: '$17.000 - $35.000 por mes',
  currenciesAccepted: 'ARS',
  address: { '@type': 'PostalAddress', addressCountry: 'AR' },
  areaServed: { '@type': 'Country', name: 'Argentina' },
  knowsLanguage: 'es-AR',
  contactPoint: {
    '@type': 'ContactPoint', contactType: 'sales', telephone: SITE.telE164,
    url: `https://wa.me/${SITE.waNumber}`, areaServed: 'AR', availableLanguage: ['es'],
  },
  knowsAbout: ['Diseño web', 'Páginas web para negocios', 'SEO local', 'Catálogos online', 'Ventas por WhatsApp', 'Dominios .com.ar', 'Hosting'],
  hasOfferCatalog: {
    '@type': 'OfferCatalog', name: 'Planes de página web',
    itemListElement: PLANES.map((p) => ({ '@type': 'Offer', itemOffered: { '@id': abs(`/planes/#${p.id}`) } })),
  },
};
const websiteNode = { '@type': 'WebSite', '@id': WEBSITE_ID, url: SITE.url + '/', name: SITE.name, inLanguage: SITE.lang, publisher: { '@id': ORG_ID } };

const planNode = (p) => ({
  '@type': 'Service',
  '@id': abs(`/planes/#${p.id}`),
  name: `${p.name} · Página web a medida`,
  serviceType: 'Diseño de página web',
  provider: { '@id': ORG_ID },
  areaServed: { '@type': 'Country', name: 'Argentina' },
  description: `${p.short} ${p.feats.join('. ')}.`,
  offers: {
    '@type': 'Offer', priceCurrency: 'ARS', price: p.monthly, availability: 'https://schema.org/InStock',
    priceSpecification: [
      { '@type': 'UnitPriceSpecification', price: p.monthly, priceCurrency: 'ARS', unitText: 'MONTH', name: 'Abono mensual' },
      { '@type': 'PriceSpecification', price: p.activation, priceCurrency: 'ARS', name: 'Activación única' },
    ],
    url: abs('/planes/'),
  },
});
const faqNode = (list, id) => ({
  '@type': 'FAQPage', '@id': id,
  mainEntity: list.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
});
const crumbsNode = (url, crumbs) => ({
  '@type': 'BreadcrumbList', '@id': abs(url + '#breadcrumb'),
  itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c[0], item: abs(c[1]) })),
});

/* ---------------------------------------------------------------------
   piezas de layout
   ------------------------------------------------------------------- */
const NAV = [
  ['/diseno-web/', 'Diseño web'],
  ['/planes/', 'Planes'],
  ['/cobros/', 'CobrOS'],
  ['/trabajos/', 'Trabajos'],
  ['/rubros/', 'Rubros'],
  ['/guias/', 'Guías'],
];

function head(p) {
  const og = abs(`/og/${p.og}.jpg`);
  const graph = [orgNode, websiteNode, {
    '@type': p.pageType || 'WebPage', '@id': abs(p.url + '#webpage'), url: abs(p.url), name: p.title,
    description: p.desc, inLanguage: SITE.lang, isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID }, dateModified: p.modified || SITE.updated,
    primaryImageOfPage: { '@type': 'ImageObject', url: og, width: 1200, height: 630 },
    ...(p.crumbs ? { breadcrumb: { '@id': abs(p.url + '#breadcrumb') } } : {}),
  }];
  if (p.crumbs) graph.push(crumbsNode(p.url, p.crumbs));
  if (p.ld) graph.push(...p.ld);
  const ld = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
  return `<!DOCTYPE html>
<html lang="es-AR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.desc)}">
<link rel="canonical" href="${abs(p.url)}">
<meta name="robots" content="${p.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1'}">
<link rel="alternate" hreflang="es-AR" href="${abs(p.url)}">
<link rel="alternate" hreflang="x-default" href="${abs(p.url)}">
<meta name="theme-color" content="#0A0820">
<meta name="author" content="TuPaginaYa">
<meta property="og:type" content="${p.ogType || 'website'}">
<meta property="og:site_name" content="TuPaginaYa">
<meta property="og:locale" content="es_AR">
<meta property="og:url" content="${abs(p.url)}">
<meta property="og:title" content="${esc(p.ogTitle || p.title)}">
<meta property="og:description" content="${esc(p.desc)}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(p.ogTitle || p.title)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(p.ogTitle || p.title)}">
<meta name="twitter:description" content="${esc(p.desc)}">
<meta name="twitter:image" content="${og}">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/brand/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="alternate" type="text/plain" title="Resumen para IAs" href="/llms.txt">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wdth,wght@75..100,400..700&family=JetBrains+Mono:wght@400;500;600&display=swap">
<link rel="stylesheet" href="/assets/site.css?v=${ASSET_V}">
<script>(function(d){d.className+=" js";try{var s=location.search;if(/[?&]lite/.test(s)||(!/[?&]full/.test(s)&&(sessionStorage.getItem("tpy-lite")||(navigator.deviceMemory&&navigator.deviceMemory<=2)||(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=2))))d.className+=" lite"}catch(e){}})(document.documentElement)</script>
<script type="application/ld+json">${ld}</script>
</head>`;
}

function header(active) {
  const links = NAV.map(([h, t]) => `<a href="${h}"${active === h ? ' aria-current="page"' : ''}>${t}</a>`).join('');
  return `
<header class="hdr">
  <div class="hdr-in">
    <a class="logo" href="/" aria-label="TuPaginaYa, inicio"><img src="/brand/logo-horizontal.svg" alt="TuPaginaYa" width="150" height="30"></a>
    <nav class="nav" aria-label="Principal">${links}</nav>
    <a class="btn btn-primary btn-sm" href="${wa('Hola TuPaginaYa! Quiero mi demo gratis')}" target="_blank" rel="noopener">${ICON.wa}<span>Pedir demo gratis</span></a>
    <button class="burger" aria-label="Abrir menú" aria-expanded="false" aria-controls="mnav"><span></span><span></span></button>
  </div>
</header>
<nav class="mnav" id="mnav" aria-label="Menú">
  <a href="/">Inicio</a>${NAV.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}<a href="/preguntas-frecuentes/">Preguntas frecuentes</a><a href="/contacto/">Contacto</a>
  <a class="btn btn-primary" href="${wa('Hola TuPaginaYa! Quiero mi demo gratis')}" target="_blank" rel="noopener">${ICON.wa}<span>Pedir demo gratis</span></a>
</nav>`;
}

function footer() {
  return `
<footer class="ftr">
  <div class="wrap">
    <div class="ftr-grid">
      <div class="ftr-brand">
        <img src="/brand/logo-horizontal.svg" alt="TuPaginaYa" width="150" height="30" loading="lazy">
        <p>Páginas web a medida para negocios y profesionales de toda Argentina. Trabajamos 100% online, por WhatsApp.</p>
      </div>
      <div><h4>Servicio</h4><nav aria-label="Servicio"><a href="/diseno-web/">Diseño web</a><a href="/planes/">Planes y precios</a><a href="/cobros/">App CobrOS</a><a href="/referidos/">Referidos</a></nav></div>
      <div><h4>Trabajos</h4><nav aria-label="Trabajos"><a href="/trabajos/">Portfolio</a><a href="/rubros/">Por rubro</a></nav></div>
      <div><h4>Aprendé</h4><nav aria-label="Aprendé"><a href="/guias/">Guías</a><a href="/preguntas-frecuentes/">Preguntas frecuentes</a><a href="/nosotros/">Nosotros</a></nav></div>
      <div><h4>Contacto</h4><nav aria-label="Contacto"><a href="${wa('Hola TuPaginaYa!')}" target="_blank" rel="noopener">WhatsApp</a><a href="tel:${SITE.telE164}">${SITE.waDisplay}</a><a href="/contacto/">Pedir demo</a></nav></div>
    </div>
    <div class="ftr-bottom"><span>© <span id="yr">2026</span> TuPaginaYa · Argentina</span><span>tupaginaya.com.ar</span></div>
  </div>
</footer>
<a class="wa-float" href="${wa('Hola TuPaginaYa! Quiero consultar por una página web')}" target="_blank" rel="noopener" aria-label="Escribinos por WhatsApp">${ICON.wa}</a>
<script src="/assets/site.js?v=${ASSET_V}" defer></script>`;
}

/* prompt con la ruta real (breadcrumb visible) */
function prompt(crumbs) {
  const parts = crumbs.map(([name, url], i) => {
    const label = i === 0 ? 'tupaginaya.com.ar' : url.split('/').filter(Boolean).pop();
    return i === crumbs.length - 1
      ? `<span aria-current="page">${esc(label)}</span>`
      : `<a href="${url}">${esc(label)}</a><span class="sep">/</span>`;
  });
  return `<nav class="prompt" aria-label="Estás en">${parts.join('')}</nav>`;
}

function page(p, body) {
  pages.push(p);
  const html = `${head(p)}
<body>
<a class="sr" href="#main">Saltar al contenido</a>
${header(p.nav)}
<main id="main">
${body}
</main>
${footer()}
${p.scripts || ''}
</body>
</html>
`;
  write(p.url === '/' ? 'index.html' : p.file || path.join(p.url, 'index.html'), html);
}

function phero({ crumbs, h1, lead, answer, extra = '', updated = true }) {
  return `
<section class="phero">
  ${trails}
  <div class="wrap">
    ${prompt(crumbs)}
    <h1>${h1}</h1>
    ${lead ? `<p class="lead">${lead}</p>` : ''}
    ${answer ? `<p class="answer">${answer}</p>` : ''}
    ${extra}
    ${updated ? `<p class="updated">Actualizado el ${SITE.updatedLabel}</p>` : ''}
  </div>
</section>`;
}

const workCard = (x, h = 'h3') => `
<a class="work rv" href="/trabajos/${x.s}/" data-r="${x.r}">
  <div class="work-bar" aria-hidden="true"><i></i><i></i><i></i><span>${x.d}</span></div>
  <div class="work-img"><img src="/images/portfolio/${x.s}.jpg" alt="Página web de ${esc(x.n)}" width="800" height="500" loading="lazy"></div>
  <div class="work-body"><${h}>${esc(x.n)}</${h}><p class="work-meta">${esc(x.tipo)}${x.loc ? ' · ' + esc(x.loc) : ''}</p></div>
</a>`;

const planCards = (h = 'h3') => `
<div class="plans">${PLANES.map((p) => `
  <article class="plan${p.popular ? ' pop' : ''} rv" id="${p.id}">
    ${p.popular ? '<span class="plan-tag">Incluye CobrOS</span>' : ''}
    <${h}>${p.name}</${h}>
    <p class="plan-short">${p.short}</p>
    <p class="plan-price"><b>${money(p.monthly)}</b><span>por mes</span></p>
    <p class="plan-act">+ ${money(p.activation)} de activación, una sola vez</p>
    <ul>${p.feats.map((f) => `<li>${f}</li>`).join('')}</ul>
    <a class="btn ${p.popular ? 'btn-primary' : 'btn-ghost'}" href="${wa(p.wa)}" target="_blank" rel="noopener">${ICON.wa}<span>Quiero este plan</span></a>
  </article>`).join('')}
</div>
<p class="plans-note">Sin permanencia. La activación se paga una vez, cuando aprobás la demo y publicamos tu web.</p>`;

const picker = () => `
<form class="picker rv" onsubmit="return false" aria-labelledby="pk-title">
  <div>
    <h3 id="pk-title" style="margin-bottom:20px">Armá tu web en tres respuestas</h3>
    <fieldset class="q"><legend>¿Vendés productos?</legend><div class="chips">
      <label class="chip"><input type="radio" name="vende" value="muchos"><span>Sí, muchos</span></label>
      <label class="chip"><input type="radio" name="vende" value="algunos"><span>Algunos</span></label>
      <label class="chip"><input type="radio" name="vende" value="no" checked><span>No, vendo servicios</span></label>
    </div></fieldset>
    <fieldset class="q"><legend>¿Quién actualiza precios y productos?</legend><div class="chips">
      <label class="chip"><input type="radio" name="carga" value="yo"><span>Yo, cuando quiera</span></label>
      <label class="chip"><input type="radio" name="carga" value="ustedes" checked><span>Ustedes, se los paso</span></label>
    </div></fieldset>
    <div class="q"><label for="pk-rubro" style="display:block;font-weight:600;margin-bottom:10px">Tu rubro</label>
      <select id="pk-rubro"><option value="">Elegí tu rubro</option>${RUBROS.map((r) => `<option value="${r.slug}">${r.short}</option>`).join('')}<option value="otro">Otro rubro</option></select></div>
  </div>
  <div class="result" aria-live="polite">
    <span class="mono">&gt; te conviene</span>
    <h3>Plan Profesional</h3>
    <p></p>
    <p class="price"></p>
    <a class="btn btn-primary" href="${wa('Hola TuPaginaYa! Quiero mi demo gratis')}" target="_blank" rel="noopener">${ICON.wa}<span>Pedir demo con este plan</span></a>
  </div>
</form>`;

const faqList = (list) => `<div class="faq">${list.map(([q, a]) => `
  <details class="rv"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}
</div>`;

const demoForm = (title = 'Pedí tu demo gratis') => `
<div class="cta rv" id="demo">
  <div>
    <h2>${title}</h2>
    <p>Contanos lo básico de tu negocio y te armamos una primera versión de tu web, sin costo. La ves, la ajustamos y recién ahí decidís.</p>
    <p class="mono" style="color:var(--orange);margin-top:18px">&gt; respondemos por WhatsApp en el día</p>
  </div>
  <div>
    <form class="form demo-form" novalidate>
      <div class="field"><label for="f-nombre">Nombre del negocio</label><input id="f-nombre" name="nombre" autocomplete="organization" placeholder="Ej: Panadería La Esquina" data-req="Decinos cómo se llama tu negocio"><p class="err"></p></div>
      <div class="field"><label for="f-rubro">¿A qué se dedica?</label><input id="f-rubro" name="rubro" placeholder="Ej: panadería y cafetería" data-req="Contanos a qué se dedica"><p class="err"></p></div>
      <div class="field"><label for="f-prod">Productos o servicios</label><textarea id="f-prod" name="productos" rows="3" placeholder="Qué ofrecés, en qué zona…" data-req="Contanos qué ofrecés"></textarea><p class="err"></p></div>
      <div class="field"><label for="f-wa">Tu WhatsApp</label><input id="f-wa" name="whatsapp" type="tel" autocomplete="tel" placeholder="Ej: 11 2345-6789" data-req="Dejanos tu WhatsApp"><p class="err"></p></div>
      <button class="btn btn-primary" type="submit">${ICON.wa}<span>Enviar por WhatsApp</span></button>
    </form>
    <div class="form-ok" role="status"><h3>Listo, se abrió WhatsApp</h3><p>Enviá el mensaje y te respondemos en el día con los próximos pasos.</p></div>
  </div>
</div>`;

const guideCard = (g) => `
<a class="guide rv" href="/guias/${g.slug}/"><span class="mono">${esc(g.tag)}</span><h3>${esc(g.title)}</h3><p>${esc(g.desc)}</p></a>`;

/* ---------------------------------------------------------------------
   PÁGINAS
   ------------------------------------------------------------------- */
const HOME_SHOTS = SITIOS.slice(0, 14).map((x) => `/images/portfolio/${x.s}.jpg`).join(',');
const N_SITIOS = SITIOS.length;

/* ---------- HOME ---------- */
page({
  url: '/', nav: '/', og: 'home',
  title: 'TuPaginaYa · Páginas web para negocios en Argentina, online en 48 h',
  ogTitle: 'Páginas web para negocios de toda Argentina, online en 48 horas',
  desc: 'Diseñamos la página web de tu negocio a medida, con demo gratis antes de pagar, dominio .com.ar, hosting y WhatsApp. Online en 48 horas, en toda Argentina.',
  ld: [faqNode(FAQ.slice(0, 6), abs('/#faq')), ...PLANES.map(planNode)],
  scripts: `<link rel="modulepreload" href="/vendor/three.module.js"><script type="module" src="/assets/home.js?v=${ASSET_V}"></script>`,
}, `
<section class="hero" id="hero" data-shots="${HOME_SHOTS}">
  <div class="hero-fallback" aria-hidden="true"></div>
  <canvas class="hero-gl" id="gl" aria-hidden="true"></canvas>
  <div class="wrap hero-in">
    <p class="prompt"><span>tupaginaya.com.ar</span><span class="sep">·</span><span>${N_SITIOS} webs en vivo</span></p>
    <h1>Páginas web para negocios de toda Argentina, <span class="ya">online en 48&nbsp;horas</span><span class="caret" aria-hidden="true"></span></h1>
    <p class="lead">Diseñamos tu web a medida, te mostramos una demo gratis antes de pagar y la publicamos con tu dominio .com.ar, hosting y WhatsApp.</p>
    <form class="urlbar" id="urlbar" autocomplete="off">
      <div class="urlbar-top" aria-hidden="true"><i></i><i></i><i></i><div class="urlbar-url">${ICON.lock}https://www.<b id="urlName">tunegocio</b>.com.ar</div></div>
      <div class="urlbar-form">
        <label for="negocio">¿Cómo se llama tu negocio?</label>
        <input id="negocio" name="negocio" placeholder="Escribí el nombre de tu negocio" maxlength="60">
        <button class="btn btn-primary" id="urlGo" type="submit">${ICON.wa}<span>Pedir mi demo gratis</span></button>
      </div>
      <p class="urlbar-note">Chequeamos si el dominio está libre y te mandamos la demo por WhatsApp.</p>
    </form>
    <p class="hero-links"><a href="/trabajos/">Ver ${N_SITIOS} webs en vivo</a><a href="/planes/">Planes desde ${money(PLANES[0].monthly)}/mes</a></p>
  </div>
</section>

<div class="ticker" aria-hidden="true"><div class="ticker-track">${[0, 1].map(() => `<span>demo gratis antes de pagar</span><span>dominio .com.ar incluido</span><span>${N_SITIOS} webs en vivo</span><span>sin permanencia</span><span>diseño a medida, no plantillas</span><span>pedidos por WhatsApp</span>`).join('')}</div></div>

<section class="sec">
  <div class="wrap">
    <div class="sec-head">
      <p class="prompt"><a href="/trabajos/">/trabajos</a></p>
      <h2 class="rv">Webs reales, en vivo hoy.</h2>
      <p class="lead rv">Cada una diseñada para su rubro, con una herramienta pensada para sus clientes. Tocá una para ver qué hicimos.</p>
    </div>
    <div class="works">${SITIOS.filter((x) => x.destacado).map((x) => workCard(x)).join('')}</div>
    <div class="more"><a class="btn btn-ghost" href="/trabajos/">Ver los ${N_SITIOS} trabajos ${ICON.arrow}</a></div>
  </div>
</section>

<section class="sec sec-alt">
  <div class="wrap">
    <div class="sec-head">
      <p class="prompt"><a href="/diseno-web/">/diseno-web</a></p>
      <h2 class="rv">De tu mensaje a tu web online, en 48 horas.</h2>
      <p class="lead rv">Sin reuniones eternas ni formularios técnicos. Todo por WhatsApp.</p>
    </div>
    <ol class="timeline">
      <li class="tl-step rv"><span class="tl-time">hora 0</span><h3>Nos contás de tu negocio</h3><p>Qué hacés, dónde, tu logo, fotos y redes si tenés. Diez minutos de chat.</p></li>
      <li class="tl-step rv"><span class="tl-time">en menos de 24 h</span><h3>Ves tu demo, gratis</h3><p>Una primera versión real de tu web, diseñada para tu rubro. Pedís cambios sin compromiso.</p></li>
      <li class="tl-step rv"><span class="tl-time">48 h después de aprobarla</span><h3>Online con tu dominio</h3><p>Pagás la activación, registramos tu .com.ar y la publicamos lista para Google.</p></li>
      <li class="tl-step rv"><span class="tl-time">todos los meses</span><h3>La mantenemos viva</h3><p>Hosting, soporte y 5 actualizaciones por mes: precios, fotos, horarios, lo que necesites.</p></li>
    </ol>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head">
      <p class="prompt"><a href="/rubros/">/rubros</a></p>
      <h2 class="rv">Hecha para tu rubro.</h2>
      <p class="lead rv">No es lo mismo vender herramientas que atender pacientes. Mirá lo que funciona en el tuyo.</p>
    </div>
    <div class="rubros">${RUBROS.map((r) => `
      <a class="rubro rv" href="/rubros/${r.slug}/"><h3>${r.short}</h3><span>${sitiosDe(r.slug).length} ${sitiosDe(r.slug).length === 1 ? 'web' : 'webs'} en vivo <b>→</b></span></a>`).join('')}
    </div>
  </div>
</section>

<section class="sec sec-alt">
  <div class="wrap">
    <div class="sec-head center">
      <p class="prompt"><a href="/planes/">/planes</a></p>
      <h2 class="rv">Precio claro, sin permanencia.</h2>
      <p class="lead rv" style="margin-inline:auto">Dos planes, todo incluido: diseño, dominio, hosting, soporte y cambios mensuales.</p>
    </div>
    ${planCards()}
    <div style="margin-top:56px">${picker()}</div>
  </div>
</section>

<section class="sec">
  <div class="wrap split">
    <div>
      <p class="prompt"><a href="/cobros/">/cobros</a></p>
      <h2 class="rv">CobrOS: tu catálogo en tu web, los pedidos en tu WhatsApp.</h2>
      <p class="lead rv">La app de catálogo y cobros de TuPaginaYa. Cargás productos y precios, se publican solos en tu web y el cliente te manda el pedido armado.</p>
      <div class="feats">
        <div class="feat rv">${ICON.grid}<div><b>Catálogo que actualizás vos</b><span>Productos, fotos y precios, siempre al día.</span></div></div>
        <div class="feat rv">${ICON.chat}<div><b>Pedidos por WhatsApp</b><span>El cliente arma el pedido y te llega directo al chat.</span></div></div>
        <div class="feat rv">${ICON.card}<div><b>Cobros desde el link</b><span>Generás el cobro y tu cliente paga desde el mismo link.</span></div></div>
      </div>
      <div class="more"><a class="btn btn-ghost" href="/cobros/">Conocé CobrOS ${ICON.arrow}</a></div>
    </div>
    <div class="phone rv" aria-hidden="true"><div class="ph">
      <div class="ph-top">Tu catálogo <span>CobrOS</span></div>
      <div class="ph-search">buscar producto…</div>
      <div class="ph-item"><i></i><span>Taladro inalámbrico</span><b>$84.500</b></div>
      <div class="ph-item"><i class="b"></i><span>Set de puntas x40</span><b>$12.900</b></div>
      <div class="ph-item"><i class="c"></i><span>Amoladora 115 mm</span><b>$61.000</b></div>
      <div class="ph-item"><i class="b"></i><span>Nivel láser</span><b>$48.700</b></div>
      <div class="ph-cta">Enviar pedido por WhatsApp</div>
    </div></div>
  </div>
</section>

<section class="sec sec-alt">
  <div class="wrap">
    <div class="band rv">
      <div>
        <p class="prompt"><a href="/referidos/">/referidos</a></p>
        <h2>Recomendá TuPaginaYa y ganá <span class="ya">$20.000</span>.</h2>
        <p>Si ya tenés tu web con nosotros y alguien que conocés activa la suya, te llevás $20.000 por transferencia o como crédito en tu abono.</p>
        <div class="more"><a class="btn btn-ghost" href="/referidos/">Ver cómo funciona ${ICON.arrow}</a></div>
      </div>
      <ol>
        <li><div><b>Pasale nuestro WhatsApp</b><span>${SITE.waDisplay}</span></div></li>
        <li><div><b>Que diga que va de tu parte</b><span>Tu nombre o el de tu negocio.</span></div></li>
        <li><div><b>Activa su web y cobrás</b><span>$20.000, vos elegís cómo.</span></div></li>
      </ol>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head center">
      <p class="prompt"><a href="/preguntas-frecuentes/">/preguntas-frecuentes</a></p>
      <h2 class="rv">Lo que nos preguntan siempre.</h2>
    </div>
    ${faqList(FAQ.slice(0, 6))}
    <div class="more" style="justify-content:center"><a class="link" href="/preguntas-frecuentes/">Ver todas las preguntas</a></div>
  </div>
</section>

<section class="sec sec-alt">
  <div class="wrap">
    <div class="sec-head">
      <p class="prompt"><a href="/guias/">/guias</a></p>
      <h2 class="rv">Guías para tu negocio online.</h2>
    </div>
    <div class="guides">${GUIAS.slice(0, 3).map(guideCard).join('')}</div>
  </div>
</section>

<section class="sec">
  <div class="wrap">${demoForm()}</div>
</section>`);

/* ---------- DISEÑO WEB ---------- */
const crumbsBase = [['Inicio', '/']];
page({
  url: '/diseno-web/', nav: '/diseno-web/', og: 'diseno-web',
  title: 'Diseño de páginas web a medida para negocios en Argentina | TuPaginaYa',
  desc: 'Diseño web a medida para negocios y profesionales de Argentina: demo gratis en menos de 24 h, online en 48 h con dominio .com.ar, SEO y WhatsApp incluidos.',
  crumbs: [...crumbsBase, ['Diseño web', '/diseno-web/']],
  ld: [{
    '@type': 'Service', '@id': abs('/diseno-web/#service'), name: 'Diseño de páginas web a medida', serviceType: 'Diseño web',
    provider: { '@id': ORG_ID }, areaServed: { '@type': 'Country', name: 'Argentina' },
    description: 'Páginas web a medida para negocios y profesionales, con demo gratis, dominio .com.ar, hosting, SEO y WhatsApp.',
    offers: PLANES.map((p) => ({ '@id': abs(`/planes/#${p.id}`) })),
  }],
}, `
${phero({
  crumbs: [...crumbsBase, ['Diseño web', '/diseno-web/']],
  h1: 'Diseño de páginas web a medida para tu negocio',
  answer: 'TuPaginaYa diseña páginas web a medida para negocios y profesionales de toda Argentina. Te mostramos una demo gratis en menos de 24 horas y, cuando la aprobás, la publicamos en 48 horas con dominio .com.ar, hosting y WhatsApp.',
  extra: `<div class="more"><a class="btn btn-primary" href="${wa('Hola TuPaginaYa! Quiero mi demo gratis')}" target="_blank" rel="noopener">${ICON.wa}<span>Pedir demo gratis</span></a><a class="btn btn-ghost" href="/planes/">Ver planes</a></div>`,
})}
<section class="sec sec-alt">
  <div class="wrap">
    <div class="sec-head"><h2 class="rv">Qué incluye tu web</h2></div>
    <div class="needs">
      <div class="need rv"><h3>Diseño a medida, no plantillas</h3><p>Tipografía, colores y estructura pensados para tu marca y tu rubro. Si tenés Instagram, usamos tus fotos y videos reales.</p></div>
      <div class="need rv"><h3>Una herramienta útil para tus clientes</h3><p>Un cotizador, un selector de productos, un pedido guiado: algo que ayude a elegir y consultar, distinto en cada web.</p></div>
      <div class="need rv"><h3>WhatsApp con mensaje armado</h3><p>Cada botón abre el chat con un mensaje específico, para que la consulta te llegue con contexto.</p></div>
      <div class="need rv"><h3>Lista para Google y para las IAs</h3><p>Título, descripción, datos estructurados e imagen para compartir en cada página, escritos con tu servicio y tu zona.</p></div>
      <div class="need rv"><h3>Pensada para el celular</h3><p>Diseño mobile first, carga rápida y video o fotos optimizados.</p></div>
      <div class="need rv"><h3>Dominio, hosting y correo</h3><p>Registramos tu .com.ar, la alojamos en nuestro servidor con https y te damos 2 correos con tu dominio.</p></div>
    </div>
  </div>
</section>
<section class="sec">
  <div class="wrap">
    <div class="sec-head"><h2 class="rv">Cómo trabajamos</h2></div>
    <ol class="timeline">
      <li class="tl-step rv"><span class="tl-time">hora 0</span><h3>Nos escribís</h3><p>Nombre del negocio, a qué se dedica, productos o servicios, zona. Logo, fotos y redes si tenés.</p></li>
      <li class="tl-step rv"><span class="tl-time">en menos de 24 h</span><h3>Demo gratis</h3><p>Te mandamos el link de tu demo. Pedís los cambios que quieras.</p></li>
      <li class="tl-step rv"><span class="tl-time">48 h después de aprobarla</span><h3>Publicación</h3><p>Abonás la activación, registramos el dominio y la web queda online.</p></li>
      <li class="tl-step rv"><span class="tl-time">cada mes</span><h3>Mantenimiento</h3><p>Hosting, soporte y hasta 5 actualizaciones mensuales incluidas.</p></li>
    </ol>
  </div>
</section>
<section class="sec sec-alt">
  <div class="wrap">
    <div class="sec-head"><h2 class="rv">Qué necesitamos de vos</h2></div>
    <dl class="facts">
      <div><dt>Obligatorio</dt><dd>Nombre del negocio, a qué se dedica, qué ofrece y un WhatsApp de contacto.</dd></div>
      <div><dt>Suma mucho</dt><dd>Logo, fotos o videos reales, usuario de Instagram o Facebook, zona donde trabajás.</dd></div>
      <div><dt>Si tenés</dt><dd>Precios, horarios, dirección, matrícula o certificaciones, preguntas que te hacen siempre.</dd></div>
      <div><dt>No hace falta</dt><dd>Saber de diseño ni de tecnología. Tampoco tener dominio: lo registramos nosotros.</dd></div>
    </dl>
  </div>
</section>
<section class="sec"><div class="wrap">${demoForm()}</div></section>`);

/* ---------- PLANES ---------- */
page({
  url: '/planes/', nav: '/planes/', og: 'planes',
  title: 'Planes y precios de página web: desde $17.000 por mes | TuPaginaYa',
  desc: 'Plan Profesional: $17.000/mes + $50.000 de activación. Web + Catálogo con CobrOS: $35.000/mes + $100.000. Dominio, hosting y soporte incluidos, sin permanencia.',
  crumbs: [...crumbsBase, ['Planes', '/planes/']],
  ld: [...PLANES.map(planNode), faqNode(FAQ.filter((f) => /cuesta|pagar|incluye|cancelar/i.test(f[0])), abs('/planes/#faq'))],
}, `
${phero({
  crumbs: [...crumbsBase, ['Planes', '/planes/']],
  h1: 'Planes y precios de tu página web',
  answer: `El Plan Profesional cuesta ${money(PLANES[0].monthly)} por mes más ${money(PLANES[0].activation)} de activación única. El plan Web + Catálogo, con la app CobrOS, cuesta ${money(PLANES[1].monthly)} por mes más ${money(PLANES[1].activation)} de activación. Los dos incluyen dominio .com.ar, hosting y soporte, sin permanencia.`,
})}
<section class="sec sec-alt" style="padding-top:64px"><div class="wrap">${planCards('h2')}</div></section>
<section class="sec">
  <div class="wrap">
    <div class="sec-head"><h2 class="rv">Comparalos</h2></div>
    <div class="table-wrap rv"><table>
      <thead><tr><th>Incluye</th><th>Profesional</th><th>Web + Catálogo</th></tr></thead>
      <tbody>
        <tr><td>Abono mensual</td><td>${money(PLANES[0].monthly)}</td><td>${money(PLANES[1].monthly)}</td></tr>
        <tr><td>Activación (una vez)</td><td>${money(PLANES[0].activation)}</td><td>${money(PLANES[1].activation)}</td></tr>
        <tr><td>Diseño a medida</td><td class="y">Sí</td><td class="y">Sí</td></tr>
        <tr><td>Dominio .com.ar + hosting</td><td class="y">Sí</td><td class="y">Sí</td></tr>
        <tr><td>WhatsApp y redes integrados</td><td class="y">Sí</td><td class="y">Sí</td></tr>
        <tr><td>Actualizaciones por mes</td><td>5</td><td>5</td></tr>
        <tr><td>Correos corporativos</td><td>2</td><td>2</td></tr>
        <tr><td>Soporte</td><td>24/7</td><td>24/7</td></tr>
        <tr><td>App CobrOS (catálogo que cargás vos)</td><td class="n">No</td><td class="y">Sí</td></tr>
        <tr><td>Pedidos por WhatsApp desde el catálogo</td><td class="n">No</td><td class="y">Sí</td></tr>
        <tr><td>Permanencia mínima</td><td>No</td><td>No</td></tr>
      </tbody>
    </table></div>
  </div>
</section>
<section class="sec sec-alt"><div class="wrap"><div class="sec-head center"><h2 class="rv">¿No sabés cuál elegir?</h2></div>${picker()}</div></section>
<section class="sec">
  <div class="wrap">
    <div class="sec-head center"><h2 class="rv">Preguntas sobre precios</h2></div>
    ${faqList(FAQ.filter((f) => /cuesta|pagar|incluye|cancelar/i.test(f[0])))}
  </div>
</section>
<section class="sec"><div class="wrap">${demoForm('Empezá por la demo gratis')}</div></section>`);

/* ---------- COBROS ---------- */
page({
  url: '/cobros/', nav: '/cobros/', og: 'cobros',
  title: 'CobrOS: catálogo online con pedidos por WhatsApp | TuPaginaYa',
  desc: 'CobrOS es la app de catálogo y cobros de TuPaginaYa: cargás productos y precios, se publican en tu web y los pedidos te llegan por WhatsApp. Plan desde $35.000/mes.',
  crumbs: [...crumbsBase, ['CobrOS', '/cobros/']],
  ld: [{
    '@type': 'SoftwareApplication', '@id': abs('/cobros/#app'), name: 'CobrOS', applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web', inLanguage: 'es-AR', publisher: { '@id': ORG_ID },
    description: 'App de catálogo y cobros: productos y precios que se publican en la web del negocio, con pedidos por WhatsApp y cobros desde el link.',
    offers: { '@type': 'Offer', price: PLANES[1].monthly, priceCurrency: 'ARS', url: abs('/planes/#catalogo'), description: 'Incluida en el plan Web + Catálogo' },
  }],
}, `
${phero({
  crumbs: [...crumbsBase, ['CobrOS', '/cobros/']],
  h1: 'CobrOS: tu catálogo online, los pedidos en tu WhatsApp',
  answer: 'CobrOS es la app de catálogo y cobros de TuPaginaYa. Cargás productos, fotos y precios; se publican solos en tu página web y el cliente te manda el pedido armado por WhatsApp. Viene incluida en el plan Web + Catálogo.',
  extra: `<div class="more"><a class="btn btn-primary" href="${wa('Hola TuPaginaYa! Quiero saber más sobre CobrOS')}" target="_blank" rel="noopener">${ICON.wa}<span>Quiero CobrOS</span></a><a class="btn btn-ghost" href="/planes/#catalogo">Ver el plan</a></div>`,
})}
<section class="sec sec-alt">
  <div class="wrap split">
    <div>
      <h2 class="rv">Qué hace</h2>
      <div class="feats">
        <div class="feat rv">${ICON.grid}<div><b>Catálogo digital</b><span>Productos con fotos, variantes y precios, ordenados por categoría y con buscador.</span></div></div>
        <div class="feat rv">${ICON.chat}<div><b>Pedidos directos por WhatsApp</b><span>El cliente arma el pedido en tu web y te llega completo al chat.</span></div></div>
        <div class="feat rv">${ICON.card}<div><b>Cobros integrados</b><span>Generás el cobro y tu cliente paga desde el mismo link.</span></div></div>
        <div class="feat rv">${ICON.chart}<div><b>Cuenta corriente por cliente</b><span>Qué se vendió y qué falta cobrar, con cobros recurrentes y avisos automáticos de vencimiento.</span></div></div>
        <div class="feat rv">${ICON.card}<div><b>Recibos, presupuestos y MercadoPago</b><span>Recibos y presupuestos listos para mandar, y cobro con MercadoPago.</span></div></div>
      </div>
      <div class="more"><a class="btn btn-ghost" href="https://appcobros.ar/" target="_blank" rel="noopener">Ver la app en appcobros.ar ${ICON.arrow}</a></div>
    </div>
    <div class="phone rv" aria-hidden="true"><div class="ph">
      <div class="ph-top">Tu catálogo <span>CobrOS</span></div>
      <div class="ph-search">buscar producto…</div>
      <div class="ph-item"><i></i><span>Heladera exhibidora</span><b>consultar</b></div>
      <div class="ph-item"><i class="b"></i><span>Balanza comercial</span><b>$95.000</b></div>
      <div class="ph-item"><i class="c"></i><span>Horno pizzero</span><b>$5.800/día</b></div>
      <div class="ph-cta">Enviar pedido por WhatsApp</div>
    </div></div>
  </div>
</section>
<section class="sec">
  <div class="wrap">
    <div class="sec-head"><h2 class="rv">CobrOS en vivo</h2><p class="lead rv">Tiendas con el catálogo conectado a CobrOS, y la propia app.</p></div>
    <div class="works">${SITIOS.filter((x) => ['ferrepehua', 'muebleriaexpress', 'appcobros'].includes(x.s)).map((x) => workCard(x)).join('')}</div>
  </div>
</section>
<section class="sec sec-alt"><div class="wrap">${demoForm('Pedí tu demo con catálogo')}</div></section>`);

/* ---------- TRABAJOS ---------- */
page({
  url: '/trabajos/', nav: '/trabajos/', og: 'trabajos',
  title: `Trabajos: ${N_SITIOS} páginas web de negocios en vivo | TuPaginaYa`,
  desc: `Portfolio de TuPaginaYa: ${N_SITIOS} páginas web reales y en vivo de comercios, oficios, profesionales, turismo e industria de toda Argentina. Filtrá por rubro.`,
  crumbs: [...crumbsBase, ['Trabajos', '/trabajos/']],
  pageType: 'CollectionPage',
  ld: [{
    '@type': 'ItemList', '@id': abs('/trabajos/#lista'), name: 'Páginas web hechas por TuPaginaYa', numberOfItems: N_SITIOS,
    itemListElement: SITIOS.map((x, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/trabajos/${x.s}/`), name: x.n })),
  }],
}, `
${phero({
  crumbs: [...crumbsBase, ['Trabajos', '/trabajos/']],
  h1: `${N_SITIOS} webs reales, en vivo hoy`,
  answer: `Estas son páginas web que diseñamos y mantenemos para negocios de toda Argentina. Todas están online: entrá a cada una para ver qué hicimos y visitar el sitio.`,
})}
<section class="sec sec-alt" style="padding-top:56px">
  <div class="wrap">
    <div class="filters" id="filters" role="group" aria-label="Filtrar por rubro">
      <button type="button" data-r="all" aria-pressed="true">Todos (${N_SITIOS})</button>${RUBROS.map((r) => `<button type="button" data-r="${r.slug}" aria-pressed="false">${r.short} (${sitiosDe(r.slug).length})</button>`).join('')}
    </div>
    <div class="works" id="works">${SITIOS.map((x) => workCard(x, 'h2')).join('')}</div>
  </div>
</section>
<section class="sec"><div class="wrap">${demoForm('¿Querés una así?')}</div></section>`);

/* ---------- FICHAS DE CASO ---------- */
for (const x of SITIOS) {
  const r = rubroOf(x.r);
  const url = `/trabajos/${x.s}/`;
  const crumbs = [...crumbsBase, ['Trabajos', '/trabajos/'], [x.n, url]];
  const rel = SITIOS.filter((y) => y.r === x.r && y.s !== x.s).slice(0, 3);
  const descRaw = `Página web de ${x.n}${x.loc ? ' (' + x.loc + ')' : ''}, hecha por TuPaginaYa: ${lc(x.f[0])} y ${lc(x.f[1])}. Mirá el caso y visitá el sitio en vivo.`;
  page({
    url, nav: '/trabajos/', og: `trabajo-${x.s}`, ogShot: x.s,
    title: brandT(`${x.n} · ${x.tipo}`),
    ogTitle: `${x.n} · ${x.tipo}`,
    desc: clip(descRaw.length < 120 ? descRaw.replace('Mirá el caso', `${x.tipo}. Mirá el caso`) : descRaw),
    crumbs,
    ld: [{
      '@type': 'WebSite', '@id': `https://${x.d}/#website`, name: x.n, url: `https://${x.d}/`,
      description: x.blurb, creator: { '@id': ORG_ID }, inLanguage: 'es-AR',
      image: abs(`/images/portfolio/${x.s}.jpg`),
    }],
  }, `
${phero({
  crumbs, h1: esc(x.n),
  lead: esc(x.blurb),
  updated: false,
})}
<section class="sec sec-alt" style="padding-top:56px">
  <div class="wrap case">
    <div class="browser rv">
      <div class="work-bar" aria-hidden="true"><i></i><i></i><i></i><span>https://${x.d}</span></div>
      <img src="/images/portfolio/${x.s}.jpg" alt="Captura de la página web de ${esc(x.n)}" width="800" height="500">
    </div>
    <aside class="case-side rv">
      <dl class="facts">
        <div><dt>Rubro</dt><dd><a class="link" href="/rubros/${r.slug}/">${r.short}</a> · ${esc(x.tipo)}</dd></div>
        ${x.loc ? `<div><dt>Zona</dt><dd>${esc(x.loc)}</dd></div>` : ''}
        <div><dt>Sitio</dt><dd>${x.d}</dd></div>
      </dl>
      <div><h2 style="font-size:22px;margin-bottom:14px">Qué hicimos</h2><ul>${x.f.map((f) => `<li>${esc(f)}</li>`).join('')}</ul></div>
      <a class="btn btn-ghost" href="https://${x.d}/" target="_blank" rel="noopener">Visitar ${x.d} ${ICON.arrow}</a>
      <a class="btn btn-primary" href="${wa(`Hola TuPaginaYa! Vi la web de ${x.n} y quiero una para mi negocio`)}" target="_blank" rel="noopener">${ICON.wa}<span>Quiero una así</span></a>
    </aside>
  </div>
</section>
${rel.length ? `<section class="sec"><div class="wrap"><div class="sec-head"><h2 class="rv">Más webs de ${r.short.toLowerCase()}</h2></div><div class="works">${rel.map((y) => workCard(y)).join('')}</div><div class="more"><a class="btn btn-ghost" href="/rubros/${r.slug}/">Página web para ${r.short.toLowerCase()} ${ICON.arrow}</a></div></div></section>` : ''}`);
}

/* ---------- RUBROS ---------- */
page({
  url: '/rubros/', nav: '/rubros/', og: 'rubros',
  title: 'Páginas web por rubro: comercios, oficios, salud, turismo | TuPaginaYa',
  desc: 'Qué conviene que tenga la página web de tu rubro, con ejemplos reales en vivo: construcción, oficios, tiendas, salud, turismo, industria e instituciones.',
  crumbs: [...crumbsBase, ['Rubros', '/rubros/']],
  pageType: 'CollectionPage',
  ld: [{
    '@type': 'ItemList', '@id': abs('/rubros/#lista'), name: 'Páginas web por rubro',
    itemListElement: RUBROS.map((r, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/rubros/${r.slug}/`), name: r.h1 })),
  }],
}, `
${phero({
  crumbs: [...crumbsBase, ['Rubros', '/rubros/']],
  h1: 'Una web pensada para tu rubro',
  answer: 'Cada rubro necesita cosas distintas: una ferretería necesita catálogo, un electricista que lo llamen rápido, una terapeuta transmitir confianza. Elegí el tuyo y mirá qué incluimos y qué webs ya hicimos.',
})}
<section class="sec sec-alt" style="padding-top:56px"><div class="wrap"><div class="rubros">${RUBROS.map((r) => `
  <a class="rubro rv" href="/rubros/${r.slug}/"><h2 style="font-size:21px">${r.name}</h2><span>${sitiosDe(r.slug).length} ${sitiosDe(r.slug).length === 1 ? 'web' : 'webs'} en vivo <b>→</b></span></a>`).join('')}
</div></div></section>
<section class="sec"><div class="wrap">${demoForm()}</div></section>`);

for (const r of RUBROS) {
  const url = `/rubros/${r.slug}/`;
  const crumbs = [...crumbsBase, ['Rubros', '/rubros/'], [r.short, url]];
  const ss = sitiosDe(r.slug);
  page({
    url, nav: '/rubros/', og: `rubro-${r.slug}`,
    title: r.title,
    ogTitle: r.h1,
    desc: r.desc,
    crumbs,
    ld: [faqNode(r.faq, abs(url + '#faq')), {
      '@type': 'Service', '@id': abs(url + '#service'), name: r.h1, serviceType: 'Diseño de página web',
      provider: { '@id': ORG_ID }, areaServed: { '@type': 'Country', name: 'Argentina' }, audience: { '@type': 'BusinessAudience', name: r.name },
      offers: PLANES.map((p) => ({ '@id': abs(`/planes/#${p.id}`) })),
    }],
  }, `
${phero({
  crumbs, h1: r.h1, answer: r.lead,
  extra: `<div class="more"><a class="btn btn-primary" href="${wa(`Hola TuPaginaYa! Quiero una página web para mi negocio de ${r.short.toLowerCase()}`)}" target="_blank" rel="noopener">${ICON.wa}<span>Pedir demo gratis</span></a><a class="btn btn-ghost" href="/planes/">Ver planes</a></div>`,
})}
<section class="sec sec-alt">
  <div class="wrap">
    <div class="sec-head"><h2 class="rv">Qué tiene que tener tu web</h2></div>
    <div class="needs">${r.needs.map(([t, d]) => `<div class="need rv"><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>
  </div>
</section>
<section class="sec">
  <div class="wrap">
    <div class="sec-head"><h2 class="rv">Webs de ${r.short.toLowerCase()} en vivo</h2><p class="lead rv">${ss.length} ${ss.length === 1 ? 'trabajo real' : 'trabajos reales'} de este rubro.</p></div>
    <div class="works">${ss.map((x) => workCard(x)).join('')}</div>
  </div>
</section>
<section class="sec sec-alt">
  <div class="wrap">
    <div class="sec-head center"><h2 class="rv">Preguntas del rubro</h2></div>
    ${faqList(r.faq)}
  </div>
</section>
<section class="sec"><div class="wrap">${demoForm()}</div></section>`);
}

/* ---------- GUÍAS ---------- */
page({
  url: '/guias/', nav: '/guias/', og: 'guias',
  title: 'Guías para tener tu negocio online | TuPaginaYa',
  desc: 'Guías prácticas para negocios argentinos: cuánto cuesta una página web, cómo aparecer en Google, dominio .com.ar, catálogo y ventas por WhatsApp.',
  crumbs: [...crumbsBase, ['Guías', '/guias/']],
  pageType: 'CollectionPage',
  ld: [{
    '@type': 'ItemList', '@id': abs('/guias/#lista'), name: 'Guías de TuPaginaYa',
    itemListElement: GUIAS.map((g, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/guias/${g.slug}/`), name: g.title })),
  }],
}, `
${phero({
  crumbs: [...crumbsBase, ['Guías', '/guias/']],
  h1: 'Guías para tu negocio online',
  answer: 'Respuestas claras a lo que nos preguntan los dueños de negocios: cuánto cuesta una web, cómo aparecer en Google, qué es un dominio y cómo vender por WhatsApp.',
})}
<section class="sec sec-alt" style="padding-top:56px"><div class="wrap"><div class="guides">${GUIAS.map((g) => guideCard(g).replace(/<h3>(.*?)<\/h3>/, '<h2 style="font-size:22px">$1</h2>')).join('')}</div></div></section>`);

for (const g of GUIAS) {
  const url = `/guias/${g.slug}/`;
  const crumbs = [...crumbsBase, ['Guías', '/guias/'], [g.title, url]];
  const others = GUIAS.filter((o) => o.slug !== g.slug).slice(0, 3);
  page({
    url, nav: '/guias/', og: `guia-${g.slug}`, ogType: 'article', modified: g.date,
    title: brandT(g.title),
    ogTitle: g.title,
    desc: g.desc,
    crumbs,
    ld: [{
      '@type': 'Article', '@id': abs(url + '#article'), headline: g.title, description: g.desc,
      datePublished: g.date, dateModified: g.date, inLanguage: 'es-AR',
      author: { '@id': ORG_ID }, publisher: { '@id': ORG_ID },
      mainEntityOfPage: { '@id': abs(url + '#webpage') }, image: abs(`/og/guia-${g.slug}.jpg`),
    }],
  }, `
${phero({ crumbs, h1: esc(g.title), answer: esc(g.answer), updated: false, extra: `<p class="updated">Por TuPaginaYa · <time datetime="${g.date}">${SITE.updatedLabel}</time></p>` })}
<section class="sec" style="padding-top:24px">
  <div class="wrap"><article class="prose">${g.body}</article>
  <div class="more"><a class="btn btn-primary" href="${wa('Hola TuPaginaYa! Leí la guía "' + g.title + '" y quiero mi demo gratis')}" target="_blank" rel="noopener">${ICON.wa}<span>Pedir mi demo gratis</span></a></div></div>
</section>
<section class="sec sec-alt"><div class="wrap"><div class="sec-head"><h2 class="rv">Seguí leyendo</h2></div><div class="guides">${others.map(guideCard).join('')}</div></div></section>`);
}

/* ---------- FAQ ---------- */
page({
  url: '/preguntas-frecuentes/', nav: '', og: 'preguntas-frecuentes',
  title: 'Preguntas frecuentes sobre páginas web, precios y plazos | TuPaginaYa',
  desc: 'Cuánto cuesta, cuánto tarda, qué incluye, si hay permanencia y cómo funciona la demo gratis: todas las respuestas sobre las páginas web de TuPaginaYa.',
  crumbs: [...crumbsBase, ['Preguntas frecuentes', '/preguntas-frecuentes/']],
  ld: [faqNode(FAQ, abs('/preguntas-frecuentes/#faq'))],
}, `
${phero({ crumbs: [...crumbsBase, ['Preguntas frecuentes', '/preguntas-frecuentes/']], h1: 'Preguntas frecuentes', lead: '¿No encontrás tu respuesta? Escribinos por WhatsApp y te contestamos en el día.' })}
<section class="sec sec-alt" style="padding-top:56px"><div class="wrap">${faqList(FAQ)}</div></section>
<section class="sec"><div class="wrap">${demoForm()}</div></section>`);

/* ---------- REFERIDOS ---------- */
page({
  url: '/referidos/', nav: '', og: 'referidos',
  title: 'Programa de referidos: recomendá TuPaginaYa y ganá $20.000',
  desc: 'Si sos cliente de TuPaginaYa con el abono al día y alguien que recomendaste activa su web, ganás $20.000 por transferencia o como crédito en tu abono.',
  crumbs: [...crumbsBase, ['Referidos', '/referidos/']],
}, `
${phero({
  crumbs: [...crumbsBase, ['Referidos', '/referidos/']],
  h1: 'Recomendá TuPaginaYa y ganá <span class="ya">$20.000</span>',
  answer: 'Si ya tenés tu web con nosotros y alguien que recomendaste activa la suya, te llevás $20.000. Vos elegís: transferencia o crédito en tu abono.',
  extra: `<div class="more"><a class="btn btn-primary" href="${wa('Hola TuPaginaYa! Soy cliente y quiero recomendar a alguien')}" target="_blank" rel="noopener">${ICON.wa}<span>Quiero recomendar</span></a><a class="btn btn-ghost" href="${wa('Hola TuPaginaYa! Vengo recomendado por ')}" target="_blank" rel="noopener">Me recomendaron</a></div>`,
})}
<section class="sec sec-alt">
  <div class="wrap">
    <div class="band rv">
      <div><h2>Cómo funciona</h2><p>Sin formularios ni códigos: alcanza con que el referido diga de parte de quién viene.</p></div>
      <ol>
        <li><div><b>Pasale nuestro WhatsApp</b><span>${SITE.waDisplay}, a quien necesite una página web.</span></div></li>
        <li><div><b>Que diga que va de tu parte</b><span>Con tu nombre o el de tu negocio alcanza.</span></div></li>
        <li><div><b>Activa su web y cobrás</b><span>$20.000 por transferencia o descontados de tu abono.</span></div></li>
      </ol>
    </div>
    <dl class="facts" style="margin-top:48px">
      <div><dt>Quién participa</dt><dd>Clientes de TuPaginaYa con el abono al día.</dd></div>
      <div><dt>Cuándo se paga</dt><dd>Cuando el referido abona la activación y su primer mes.</dd></div>
      <div><dt>Cómo cobrás</dt><dd>Transferencia o crédito en tu abono, a elección.</dd></div>
    </dl>
  </div>
</section>`);

/* ---------- NOSOTROS (página de entidad) ---------- */
page({
  url: '/nosotros/', nav: '', og: 'nosotros', pageType: 'AboutPage',
  title: 'Sobre TuPaginaYa: estudio de páginas web para negocios argentinos',
  desc: 'TuPaginaYa es un estudio argentino que diseña páginas web a medida para negocios y profesionales, con demo gratis, dominio, hosting y la app CobrOS.',
  crumbs: [...crumbsBase, ['Nosotros', '/nosotros/']],
}, `
${phero({
  crumbs: [...crumbsBase, ['Nosotros', '/nosotros/']],
  h1: 'TuPaginaYa, en pocas palabras',
  answer: 'TuPaginaYa es un estudio argentino de diseño web que hace páginas a medida para negocios y profesionales de todo el país. Trabaja 100% online por WhatsApp, muestra una demo gratis antes de cobrar y mantiene cada web con dominio, hosting y actualizaciones mensuales.',
})}
<section class="sec sec-alt">
  <div class="wrap">
    <div class="sec-head"><h2 class="rv">Datos clave</h2></div>
    <dl class="facts rv">
      <div><dt>Qué hace</dt><dd>Diseño de páginas web a medida, catálogos online y la app CobrOS de catálogo y cobros.</dd></div>
      <div><dt>Para quién</dt><dd>Comercios, oficios, profesionales, instituciones, turismo e industria.</dd></div>
      <div><dt>Dónde</dt><dd>Toda Argentina, de forma online. Hay webs en vivo en CABA, el conurbano bonaerense, Pehuajó, Rosario, Mendoza, Tucumán, San Luis, Mar del Plata y Comodoro Rivadavia.</dd></div>
      <div><dt>Webs en vivo</dt><dd>${N_SITIOS} (ver <a class="link" href="/trabajos/">trabajos</a>)</dd></div>
      <div><dt>Plazos</dt><dd>Demo gratis en menos de 24 horas; online 48 horas después de aprobarla.</dd></div>
      <div><dt>Precios</dt><dd>Plan Profesional ${money(PLANES[0].monthly)}/mes + ${money(PLANES[0].activation)} de activación. Web + Catálogo ${money(PLANES[1].monthly)}/mes + ${money(PLANES[1].activation)}. Sin permanencia.</dd></div>
      <div><dt>Contacto</dt><dd>WhatsApp <a class="link" href="${wa('Hola TuPaginaYa!')}" target="_blank" rel="noopener">${SITE.waDisplay}</a></dd></div>
      <div><dt>Sitio</dt><dd>tupaginaya.com.ar</dd></div>
    </dl>
  </div>
</section>
<section class="sec">
  <div class="wrap">
    <div class="sec-head"><h2 class="rv">Cómo pensamos cada web</h2></div>
    <div class="needs">
      <div class="need rv"><h3>Material real</h3><p>Usamos las fotos, el logo y las palabras del cliente. No inventamos reseñas, cifras ni servicios.</p></div>
      <div class="need rv"><h3>Una identidad por cliente</h3><p>Cada web tiene su tipografía, su paleta y su estructura. Dos clientes del mismo rubro no reciben la misma web.</p></div>
      <div class="need rv"><h3>Algo útil, no decorativo</h3><p>Cada web lleva una herramienta que ayuda a elegir, consultar o comprar: cotizadores, selectores, catálogos.</p></div>
      <div class="need rv"><h3>Hecha para que te encuentren</h3><p>Textos con el servicio y la zona reales, datos estructurados y carga rápida en el celular.</p></div>
    </div>
  </div>
</section>
<section class="sec sec-alt"><div class="wrap">${demoForm()}</div></section>`);

/* ---------- CONTACTO ---------- */
page({
  url: '/contacto/', nav: '', og: 'contacto', pageType: 'ContactPage',
  title: 'Contacto: pedí tu demo gratis por WhatsApp | TuPaginaYa',
  desc: `Escribinos por WhatsApp al ${SITE.waDisplay} o completá el formulario y te armamos la demo gratis de tu página web. Atendemos negocios de toda Argentina.`,
  crumbs: [...crumbsBase, ['Contacto', '/contacto/']],
}, `
${phero({
  crumbs: [...crumbsBase, ['Contacto', '/contacto/']],
  h1: 'Hablemos de tu web',
  answer: `Escribinos por WhatsApp al ${SITE.waDisplay}. Respondemos en el día y, si nos pasás los datos de tu negocio, te armamos la demo gratis.`,
  extra: `<div class="more"><a class="btn btn-primary" href="${wa('Hola TuPaginaYa! Quiero mi demo gratis')}" target="_blank" rel="noopener">${ICON.wa}<span>Abrir WhatsApp</span></a><a class="btn btn-ghost" href="tel:${SITE.telE164}">Llamar al ${SITE.waDisplay}</a></div>`,
})}
<section class="sec sec-alt"><div class="wrap">${demoForm('O dejanos los datos acá')}</div></section>`);

/* ---------- MARCA (noindex) ---------- */
page({
  url: '/marca/', nav: '', og: 'home', noindex: true,
  title: 'Marca TuPaginaYa: logo, colores y tipografías',
  desc: 'Guía de marca de TuPaginaYa: versiones del logo, paleta de colores, tipografías y usos correctos.',
  crumbs: [...crumbsBase, ['Marca', '/marca/']],
}, `
${phero({ crumbs: [...crumbsBase, ['Marca', '/marca/']], h1: 'Marca TuPaginaYa', lead: 'El cursor en movimiento: velocidad y clic. La estela usa los cuatro colores de la marca; el cursor que titila después de “ya” dice que está pasando ahora.' })}
<section class="sec sec-alt">
  <div class="wrap">
    <div class="sec-head"><h2>Logo</h2></div>
    <div class="brand-grid">
      <div class="brand-tile" style="background:#0A0820"><img src="/brand/logo-horizontal.svg" alt="Logo sobre oscuro"></div>
      <div class="brand-tile" style="background:#F4F1EA"><img src="/brand/logo-horizontal-light.svg" alt="Logo sobre claro"></div>
      <div class="brand-tile" style="background:#3D6DFF"><img src="/brand/logo-horizontal-white.svg" alt="Logo blanco"></div>
      <div class="brand-tile" style="background:#0A0820"><img src="/brand/logo-stacked.svg" alt="Logo apilado" style="max-height:150px"></div>
    </div>
    <p class="lead" style="margin-top:20px">Descargas: <a class="link" href="/brand/logo-horizontal.svg" download>horizontal</a> · <a class="link" href="/brand/logo-horizontal-light.svg" download>sobre claro</a> · <a class="link" href="/brand/logo-stacked.svg" download>apilado</a> · <a class="link" href="/brand/symbol.svg" download>símbolo</a> · <a class="link" href="/brand/avatar-1080.png" download>avatar</a></p>
    <div class="sec-head" style="margin-top:64px"><h2>Colores</h2></div>
    <div class="swatches">${[['Índigo', '#0A0820'], ['Azul', '#3D6DFF'], ['Violeta', '#7C5CFF'], ['Magenta', '#C13B8A'], ['Naranja', '#FF7A18'], ['Hueso', '#F4F1EA']].map(([n, c]) => `<div class="sw"><i style="background:${c}"></i><span>${n} ${c}</span></div>`).join('')}</div>
    <div class="sec-head" style="margin-top:64px"><h2>Tipografías</h2></div>
    <dl class="facts">
      <div><dt>Display</dt><dd style="font-stretch:88%;font-weight:700;font-size:28px;letter-spacing:-.035em">Instrument Sans · condensada 88%, 700</dd></div>
      <div><dt>Texto</dt><dd>Instrument Sans · 400 y 600</dd></div>
      <div><dt>Datos</dt><dd class="mono" style="font-size:16px">JetBrains Mono · 400 y 500</dd></div>
    </dl>
  </div>
</section>`);

/* ---------- 404 ---------- */
write('404.html', `${head({ url: '/404.html', title: 'Página no encontrada | TuPaginaYa', desc: 'Esta página no existe. Volvé al inicio de TuPaginaYa.', og: 'home', noindex: true })}
<body>
${header('')}
<main class="nf">
  ${trails}
  <div>
    <p class="prompt"><span>error 404</span></p>
    <h1>Esta página no existe<span class="caret" aria-hidden="true"></span></h1>
    <p class="lead" style="margin:20px auto 0">Puede que el link esté mal escrito o que la hayamos movido.</p>
    <div class="more" style="justify-content:center"><a class="btn btn-primary" href="/">Ir al inicio</a><a class="btn btn-ghost" href="/trabajos/">Ver trabajos</a></div>
  </div>
</main>
${footer()}
</body>
</html>
`);

/* ---------------------------------------------------------------------
   assets, marca, íconos
   ------------------------------------------------------------------- */
for (const f of ['site.css', 'site.js', 'home.js']) copy(path.join(ROOT, 'src/assets', f), `assets/${f}`);
for (const f of fs.readdirSync(path.join(ROOT, 'brand'))) {
  if (/^(concept|_)/.test(f) || f.endsWith('.html')) continue;
  copy(path.join(ROOT, 'brand', f), `brand/${f}`);
}
copy(path.join(ROOT, 'brand/favicon.ico'), 'favicon.ico');
copy(path.join(ROOT, 'brand/apple-touch-icon.png'), 'apple-touch-icon.png');
copy(path.join(REPO, 'vendor/three.module.js'), 'vendor/three.module.js');
for (const x of SITIOS) copy(path.join(REPO, 'images/portfolio', `${x.s}.jpg`), `images/portfolio/${x.s}.jpg`);
write('site.webmanifest', JSON.stringify({
  name: 'TuPaginaYa', short_name: 'TuPaginaYa', start_url: '/', display: 'standalone', lang: 'es-AR',
  background_color: '#0A0820', theme_color: '#0A0820',
  icons: [
    { src: '/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: '/brand/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
}, null, 2));

/* ---------------------------------------------------------------------
   robots, sitemap, llms.txt
   ------------------------------------------------------------------- */
const indexable = pages.filter((p) => !p.noindex);
write('robots.txt', `# TuPaginaYa · robots.txt
# Buscadores e IAs son bienvenidos: queremos que nos encuentren y nos citen.
User-agent: *
Allow: /
Disallow: /_backup*
Disallow: /tmp/
Disallow: /tmpsite/
Disallow: /storagedir/
Disallow: /mail/
Disallow: /etc/

${['Googlebot', 'Bingbot', 'Google-Extended', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User', 'Applebot', 'Applebot-Extended', 'DuckAssistBot', 'meta-externalagent'].map((b) => `User-agent: ${b}\nAllow: /`).join('\n\n')}

Sitemap: ${abs('/sitemap.xml')}
`);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${indexable.map((p) => `  <url><loc>${abs(p.url)}</loc><lastmod>${p.modified || SITE.updated}</lastmod>${p.ogShot ? `<image:image><image:loc>${abs(`/images/portfolio/${p.ogShot}.jpg`)}</image:loc></image:image>` : ''}</url>`).join('\n')}
</urlset>
`);

const llms = `# TuPaginaYa

> TuPaginaYa es un estudio argentino que diseña páginas web a medida para negocios y profesionales de toda Argentina. Muestra una demo gratis en menos de 24 horas, publica la web en 48 horas con dominio .com.ar, hosting y WhatsApp, y ofrece la app CobrOS de catálogo y cobros. Planes desde ${money(PLANES[0].monthly)} por mes, sin permanencia.

Datos clave (actualizados el ${SITE.updated}):
- Servicio: diseño de páginas web a medida (no plantillas), catálogos online y la app CobrOS.
- Zona: toda Argentina, atención 100% online por WhatsApp.
- Contacto: WhatsApp +54 9 ${SITE.waDisplay} (https://wa.me/${SITE.waNumber}).
- Plan Profesional: ${money(PLANES[0].monthly)}/mes + ${money(PLANES[0].activation)} de activación única.
- Plan Web + Catálogo (incluye CobrOS): ${money(PLANES[1].monthly)}/mes + ${money(PLANES[1].activation)} de activación única.
- Incluye: dominio .com.ar, hosting, soporte 24/7, 5 actualizaciones por mes, 2 correos corporativos. Sin permanencia.
- Proceso: demo gratis antes de pagar → aprobación → online en 48 horas.
- Webs en vivo: ${N_SITIOS}.

## Páginas principales
- [Diseño web a medida](${abs('/diseno-web/')}): qué incluye cada web y cómo trabajamos.
- [Planes y precios](${abs('/planes/')}): comparativa de los dos planes.
- [CobrOS](${abs('/cobros/')}): app de catálogo con pedidos por WhatsApp.
- [Trabajos](${abs('/trabajos/')}): ${N_SITIOS} páginas web de clientes, en vivo.
- [Rubros](${abs('/rubros/')}): qué conviene en la web de cada rubro.
- [Preguntas frecuentes](${abs('/preguntas-frecuentes/')})
- [Nosotros](${abs('/nosotros/')}): datos clave del estudio.
- [Contacto](${abs('/contacto/')})

## Rubros
${RUBROS.map((r) => `- [${r.h1}](${abs(`/rubros/${r.slug}/`)}): ${r.lead}`).join('\n')}

## Guías
${GUIAS.map((g) => `- [${g.title}](${abs(`/guias/${g.slug}/`)}): ${g.desc}`).join('\n')}

## Opcional
- [Texto completo para IAs](${abs('/llms-full.txt')})
- [Programa de referidos](${abs('/referidos/')})
`;
write('llms.txt', llms);

const strip = (h) => h.replace(/<\/(p|li|h2|h3|tr)>/g, '\n').replace(/<td>/g, ' | ').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
write('llms-full.txt', `${llms}
---

# Planes en detalle
${PLANES.map((p) => `## ${p.name}\n${p.short}\nPrecio: ${money(p.monthly)} por mes + ${money(p.activation)} de activación única.\n${p.feats.map((f) => `- ${f}`).join('\n')}`).join('\n\n')}

# Preguntas frecuentes
${FAQ.map(([q, a]) => `## ${q}\n${a}`).join('\n\n')}

# Trabajos en vivo
${SITIOS.map((x) => `- ${x.n} (${x.tipo}${x.loc ? ', ' + x.loc : ''}) — https://${x.d} — ${x.blurb} Ficha: ${abs(`/trabajos/${x.s}/`)}`).join('\n')}

# Rubros
${RUBROS.map((r) => `## ${r.h1}\n${r.lead}\n${r.needs.map(([t, d]) => `- ${t}: ${d}`).join('\n')}\n${r.faq.map(([q, a]) => `P: ${q}\nR: ${a}`).join('\n')}`).join('\n\n')}

# Guías
${GUIAS.map((g) => `## ${g.title}\n${g.answer}\n\n${strip(g.body)}`).join('\n\n')}
`);

/* clave IndexNow (Bing/Copilot, Yandex, Seznam) */
const INDEXNOW_KEY = 'b6f1c0e2a94d4f7e8e3d5a7c2f9b1d04';
write(`${INDEXNOW_KEY}.txt`, INDEXNOW_KEY);
write('_indexnow-urls.json', JSON.stringify({ host: 'tupaginaya.com.ar', key: INDEXNOW_KEY, keyLocation: abs(`/${INDEXNOW_KEY}.txt`), urlList: indexable.map((p) => abs(p.url)) }, null, 2));

console.log(`✓ ${pages.length} páginas + 404 en dist/ (${indexable.length} indexables)`);

/* ---------------------------------------------------------------------
   OG: plantilla → Edge headless → JPG 1200×630
   ------------------------------------------------------------------- */
if (DO_OG) await renderOG();

async function renderOG() {
  const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
  const tmp = path.join(ROOT, '.og-tmp');
  fs.mkdirSync(tmp, { recursive: true });
  fs.mkdirSync(path.join(DIST, 'og'), { recursive: true });
  const brandUri = (f) => pathToFileURL(path.join(ROOT, 'brand', f)).href;
  const jobs = new Map();
  for (const p of pages) {
    if (jobs.has(p.og)) continue;
    const title = p.og === 'home' ? 'Páginas web para negocios de toda Argentina, <span class="ya">online en 48 horas</span>' : esc(p.ogTitle || p.title.split(' | ')[0]);
    const shot = p.ogShot ? pathToFileURL(path.join(REPO, 'images/portfolio', `${p.ogShot}.jpg`)).href : '';
    jobs.set(p.og, `<!DOCTYPE html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wdth,wght@75..100,400..700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
<style>*{margin:0;box-sizing:border-box}body{width:1200px;height:630px;overflow:hidden;background:#0A0820;color:#F4F1EA;font-family:"Instrument Sans";position:relative}
.g{position:absolute;inset:0;background:radial-gradient(50% 70% at 90% 0%,rgba(124,92,255,.35),transparent 70%),radial-gradient(35% 50% at 0% 100%,rgba(61,109,255,.25),transparent 70%)}
.t i{position:absolute;height:3px;border-radius:3px;background:linear-gradient(90deg,transparent,var(--c))}
.in{position:absolute;inset:64px 72px;display:flex;flex-direction:column;justify-content:space-between}
.logo{height:44px;width:auto;align-self:flex-start}
h1{font-stretch:88%;font-weight:700;letter-spacing:-.035em;line-height:1.02;font-size:${shot ? 60 : 74}px;max-width:${shot ? 560 : 1000}px}
.ya{background:linear-gradient(95deg,#C13B8A,#FF7A18);-webkit-background-clip:text;background-clip:text;color:transparent}
.caret{display:inline-block;width:6px;height:.78em;background:#FF7A18;margin-left:8px;vertical-align:-.04em;border-radius:2px}
.u{font-family:"JetBrains Mono";font-size:22px;color:#B4B0C4}.u b{color:#FF7A18}
.shot{position:absolute;right:-40px;top:120px;width:600px;border-radius:18px;overflow:hidden;border:2px solid rgba(244,241,234,.18);box-shadow:0 40px 100px -30px rgba(124,92,255,.7);background:#100C2C}
.bar{height:34px;display:flex;gap:8px;align-items:center;padding:0 14px;border-bottom:1px solid rgba(244,241,234,.12)}.bar i{width:10px;height:10px;border-radius:50%;background:rgba(244,241,234,.2)}
.shot img{width:100%;display:block}
</style></head><body><div class="g"></div>
<div class="t"><i style="--c:#3D6DFF;top:120px;left:-80px;width:420px"></i><i style="--c:#7C5CFF;top:150px;left:-140px;width:520px"></i><i style="--c:#C13B8A;top:604px;left:-60px;width:380px"></i></div>
${shot ? `<div class="shot"><div class="bar"><i></i><i></i><i></i></div><img src="${shot}"></div>` : ''}
<div class="in"><img class="logo" src="${brandUri('logo-horizontal.svg')}">
<h1>${title}<span class="caret"></span></h1>
<p class="u"><b>&gt;</b> tupaginaya.com.ar${p.url === '/' ? '' : p.url.replace(/\/$/, '')}</p></div></body></html>`);
  }
  const list = [...jobs.entries()];
  const run = ([key, html]) => new Promise((res) => {
    const f = path.join(tmp, `${key}.html`);
    fs.writeFileSync(f, html);
    const png = path.join(tmp, `${key}.png`);
    execFile(EDGE, ['--headless=new', '--hide-scrollbars', '--force-device-scale-factor=1', '--virtual-time-budget=4000', '--window-size=1200,630', `--screenshot=${png}`, pathToFileURL(f).href], () => res(png));
  });
  for (let i = 0; i < list.length; i += 6) await Promise.all(list.slice(i, i + 6).map(run));
  // PNG → JPG con Pillow (más liviano)
  await new Promise((res, rej) => execFile('python', ['-I', '-c', `
import sys,glob,os
from PIL import Image
src,dst=sys.argv[1],sys.argv[2]
for f in glob.glob(os.path.join(src,'*.png')):
    im=Image.open(f).convert('RGB').crop((0,0,1200,630))
    im.save(os.path.join(dst,os.path.basename(f)[:-4]+'.jpg'),quality=84,optimize=True,progressive=True)
`, tmp, path.join(DIST, 'og')], (e) => (e ? rej(e) : res())));
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`✓ ${list.length} imágenes OG en dist/og/`);
}
