/* Chequeo de SEO/links sobre dist/ (o contra producción con --base https://tupaginaya.com.ar)
   node tools/check.mjs [--base URL] */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const baseArg = process.argv.indexOf('--base');
const BASE = baseArg > 0 ? process.argv[baseArg + 1].replace(/\/$/, '') : null;
const WA = '5491157204355';

const files = [];
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (f.endsWith('.html')) files.push(p);
  }
})(DIST);

const seen = { title: new Map(), desc: new Map() };
const problems = [];
const links = new Set();
const pngSize = (buf) => (buf[0] === 0xff ? jpgSize(buf) : { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) });
function jpgSize(b) {
  let i = 2;
  while (i < b.length) {
    const m = b[i + 1], len = b.readUInt16BE(i + 2);
    if (m >= 0xc0 && m <= 0xc3) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
    i += 2 + len;
  }
  return {};
}

for (const f of files) {
  const rel = '/' + path.relative(DIST, f).replace(/\\/g, '/').replace(/index\.html$/, '');
  const h = fs.readFileSync(f, 'utf8');
  const get = (re) => (h.match(re) || [])[1];
  const title = get(/<title>([^<]*)<\/title>/);
  const desc = get(/<meta name="description" content="([^"]*)"/);
  const canon = get(/<link rel="canonical" href="([^"]*)"/);
  const og = get(/<meta property="og:image" content="([^"]*)"/);
  const noindex = /content="noindex/.test(h);
  const p = (m) => problems.push(`${rel}: ${m}`);
  if (!title) p('sin title'); else if (title.length > 70) p(`title largo (${title.length})`);
  if (!desc) p('sin description');
  else if (!noindex && (desc.length < 120 || desc.length > 165)) p(`description ${desc.length} caracteres`);
  if (!canon) p('sin canonical');
  else if (!noindex && rel !== '/404.html' && canon !== 'https://tupaginaya.com.ar' + rel) p(`canonical ${canon}`);
  if (!noindex) {
    if (seen.title.has(title)) p(`title duplicado con ${seen.title.get(title)}`); else seen.title.set(title, rel);
    if (seen.desc.has(desc)) p(`description duplicada con ${seen.desc.get(desc)}`); else seen.desc.set(desc, rel);
  }
  if (og) {
    const local = path.join(DIST, og.replace('https://tupaginaya.com.ar', ''));
    if (!fs.existsSync(local)) p(`og:image no existe ${og}`);
    else { const s = pngSize(fs.readFileSync(local)); if (s.w !== 1200 || s.h !== 630) p(`og:image ${s.w}x${s.h}`); }
  } else p('sin og:image');
  const h1s = (h.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) p(`${h1s} h1`);
  for (const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch (e) { p('JSON-LD inválido: ' + e.message); }
  }
  for (const m of h.matchAll(/wa\.me\/(\d+)/g)) if (m[1] !== WA) p(`WhatsApp distinto: ${m[1]}`);
  for (const m of h.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) links.add(m[1]);
  for (const m of h.matchAll(/data-shots="([^"]*)"/g)) m[1].split(',').forEach((s) => links.add(s));
}

for (const l of links) {
  const local = path.join(DIST, l);
  const ok = fs.existsSync(local) && (fs.statSync(local).isFile() || fs.existsSync(path.join(local, 'index.html')));
  if (!ok) problems.push(`link roto: ${l}`);
}

console.log(`${files.length} HTML, ${links.size} links internos revisados`);
if (BASE) {
  const sm = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8');
  const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace('https://tupaginaya.com.ar', BASE));
  const extra = ['/robots.txt', '/llms.txt', '/llms-full.txt', '/sitemap.xml', '/og/home.jpg', '/favicon.ico', '/site.webmanifest', '/assets/site.css', '/vendor/three.module.js'].map((u) => BASE + u);
  for (const u of [...urls, ...extra]) {
    const r = await fetch(u, { redirect: 'manual' });
    if (r.status !== 200) problems.push(`HTTP ${r.status} ${u}`);
  }
  const nf = await fetch(BASE + '/no-existe-' + Date.now());
  if (nf.status !== 404) problems.push(`página inexistente devuelve ${nf.status}`);
  console.log(`${urls.length + extra.length + 1} URLs consultadas en ${BASE}`);
}
console.log(problems.length ? problems.join('\n') : 'OK: sin problemas');
