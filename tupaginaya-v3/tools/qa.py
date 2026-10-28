"""QA visual de TuPaginaYa v3 con Playwright.

Uso: python -I tools/qa.py http://localhost:8787 /ruta1/ /ruta2/ ...
Guarda capturas en C:/tmp/qa/<slug>-desktop.png y -mobile.png y reporta
errores de consola, requests fallidos y desborde horizontal.
"""
import sys, os, re
from playwright.sync_api import sync_playwright

base = sys.argv[1].rstrip('/')
paths = sys.argv[2:] or ['/']
out = 'C:/tmp/qa'
os.makedirs(out, exist_ok=True)


def run(p, browser, path, mobile):
    ctx = browser.new_context(**(p.devices['iPhone 13'] if mobile else {'viewport': {'width': 1440, 'height': 900}}))
    page = ctx.new_page()
    errs = []
    page.on('console', lambda m: errs.append(f'console.{m.type}: {m.text}') if m.type in ('error', 'warning') else None)
    page.on('pageerror', lambda e: errs.append(f'pageerror: {e}'))
    page.on('requestfailed', lambda r: errs.append(f'requestfailed: {r.url}'))
    page.on('response', lambda r: errs.append(f'HTTP {r.status}: {r.url}') if r.status >= 400 else None)
    page.goto(base + path, wait_until='networkidle')
    # recorrer para disparar los reveals
    h = page.evaluate('document.documentElement.scrollHeight')
    for y in range(0, h, 500):
        page.evaluate(f'window.scrollTo({{top:{y},behavior:"instant"}})')
        page.wait_for_timeout(60)
    page.evaluate('window.scrollTo({top:0,behavior:"instant"})')
    page.wait_for_timeout(900)
    over = page.evaluate('''() => {
      const w = document.documentElement.clientWidth, bad = [];
      document.querySelectorAll('body *').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.right > w + 1 && getComputedStyle(el).position !== 'fixed' && !el.closest('.trails,.ticker,.filters,.table-wrap,.hero')) bad.push(el.tagName + '.' + el.className);
      });
      return {sw: document.documentElement.scrollWidth, w, bad: bad.slice(0, 6)};
    }''')
    slug = re.sub(r'[^a-z0-9]+', '-', path.strip('/')) or 'home'
    tag = 'mobile' if mobile else 'desktop'
    page.screenshot(path=f'{out}/{slug}-{tag}-top.png')
    # página completa: viewport tan alto como la página, con el hero fijado a la altura de pantalla
    vh = page.viewport_size['height']
    page.add_style_tag(content=f'.hero{{min-height:{vh}px!important}}')
    full_h = page.evaluate('document.documentElement.scrollHeight')
    page.set_viewport_size({'width': page.viewport_size['width'], 'height': full_h})
    page.wait_for_timeout(400)
    page.screenshot(path=f'{out}/{slug}-{tag}.png')
    lite = page.evaluate('document.documentElement.className')
    print(f'[{tag}] {path}  html.class="{lite}"  scrollWidth={over["sw"]}/{over["w"]}  overflow={over["bad"]}')
    for e in errs:
        print('   ', e[:220])
    ctx.close()


with sync_playwright() as p:
    browser = p.chromium.launch(args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    for path in paths:
        for mobile in (False, True):
            run(p, browser, path, mobile)
    browser.close()
