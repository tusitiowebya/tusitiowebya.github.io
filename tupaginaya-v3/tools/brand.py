"""Genera los SVG del logo de TuPaginaYa (concepto C · Cursor 48 h).

Uso: python -I tools/brand.py <ruta a InstrumentSans[wdth,wght].ttf>
Escribe en brand/: symbol*.svg, logo-*.svg, wordmark*.svg
El wordmark se convierte a trazos (no depende de la fuente instalada).
"""
import sys, os
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'brand')
os.makedirs(OUT, exist_ok=True)

INK = '#F4F1EA'
INDIGO = '#0A0820'
BLUE, VIOLET, MAG, ORANGE = '#3D6DFF', '#7C5CFF', '#C13B8A', '#FF7A18'

font = TTFont(sys.argv[1])
font = instantiateVariableFont(font, {'wdth': 88, 'wght': 700})
gs = font.getGlyphSet()
cmap = font.getBestCmap()
upm = font['head'].unitsPerEm
TRACK = -0.045 * upm  # letter-spacing igual al de la web


def text_path(txt, x0=0.0):
    """Devuelve (d, avance final) con el texto en unidades de la fuente, y hacia abajo."""
    x = x0
    pen = SVGPathPen(gs)
    for ch in txt:
        g = cmap[ord(ch)]
        tp = TransformPen(pen, (1, 0, 0, -1, x, 0))
        gs[g].draw(tp)
        x += gs[g].width + TRACK
    return pen.getCommands(), x


asc = font['OS/2'].sCapHeight or 700
xh = font['OS/2'].sxHeight
d_tupagina, x_after = text_path('tupagina')
d_ya, x_end = text_path('ya', x_after)
CARET_W = 0.075 * upm
CARET_X = x_end + 0.06 * upm - TRACK
CARET_TOP = -0.74 * upm
CARET_H = 0.78 * upm

# bounding: ascender ~ -0.75upm, descender ~ +0.25upm
WM_TOP, WM_BOT = -0.80 * upm, 0.26 * upm
WM_W = CARET_X + CARET_W + 0.02 * upm
WM_H = WM_BOT - WM_TOP

SYMBOL_BODY = '''
  <path d="M4 22h16" stroke="{b}" stroke-width="5" stroke-linecap="round"/>
  <path d="M2 33h18" stroke="{v}" stroke-width="5" stroke-linecap="round"/>
  <path d="M8 44h14" stroke="{m}" stroke-width="5" stroke-linecap="round"/>
  <path d="M27 8l31 24-14 3 8 16-7 4-8-16-10 10z" fill="{o}" stroke="{o}" stroke-width="3" stroke-linejoin="round"/>'''


def symbol(b=BLUE, v=VIOLET, m=MAG, o=ORANGE):
    return SYMBOL_BODY.format(b=b, v=v, m=m, o=o)


GRAD = f'''<linearGradient id="ya" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="{MAG}"/><stop offset="1" stop-color="{ORANGE}"/></linearGradient>'''


def wordmark(ink, ya_fill='url(#ya)', caret=ORANGE, scale=1.0, tx=0, ty=0):
    s = scale
    return f'''<g transform="translate({tx:.2f} {ty:.2f}) scale({s:.5f}) translate(0 {-WM_TOP:.1f})">
    <path d="{d_tupagina}" fill="{ink}"/>
    <path d="{d_ya}" fill="{ya_fill}"/>
    <rect x="{CARET_X:.1f}" y="{CARET_TOP:.1f}" width="{CARET_W:.1f}" height="{CARET_H:.1f}" rx="{0.02*upm:.1f}" fill="{caret}"/>
  </g>'''


def write(name, svg):
    with open(os.path.join(OUT, name), 'w', encoding='utf-8') as f:
        f.write(svg)
    print('ok', name)


def svg(w, h, body, defs='', bg=None, title='TuPaginaYa'):
    bgr = f'<rect width="{w}" height="{h}" fill="{bg}"/>' if bg else ''
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.1f} {h:.1f}" role="img" aria-label="{title}">'
            f'<title>{title}</title><defs>{defs}</defs>{bgr}{body}</svg>\n')


# ---- símbolo ----
write('symbol.svg', svg(64, 64, symbol()))
write('symbol-white.svg', svg(64, 64, symbol(*(['#FFFFFF'] * 4))))
write('symbol-black.svg', svg(64, 64, symbol(*([INDIGO] * 4))))
write('favicon.svg', svg(64, 64, f'<rect width="64" height="64" rx="14" fill="{INDIGO}"/>'
                         f'<g transform="translate(5 5) scale(.84)">{symbol()}</g>'))

# ---- logo horizontal: símbolo 64 alto + wordmark a la misma altura óptica ----
H = 64.0
wm_scale = (H * 0.98) / WM_H
gap = 14
wm_w = WM_W * wm_scale
W = 64 + gap + wm_w
for name, ink, yf, car in [
    ('logo-horizontal.svg', INK, 'url(#ya)', ORANGE),          # sobre oscuro
    ('logo-horizontal-light.svg', INDIGO, 'url(#ya)', ORANGE),  # sobre claro
    ('logo-horizontal-white.svg', '#FFFFFF', '#FFFFFF', '#FFFFFF'),
    ('logo-horizontal-black.svg', INDIGO, INDIGO, INDIGO),
]:
    sym = symbol() if yf == 'url(#ya)' else symbol(*([ink] * 4))
    body = f'<g>{sym}</g>' + wordmark(ink, yf, car, wm_scale, 64 + gap, (H - WM_H * wm_scale) / 2 + 2)
    write(name, svg(W, H, body, GRAD))

# ---- wordmark solo ----
write('wordmark.svg', svg(WM_W, WM_H, wordmark(INK), GRAD))
write('wordmark-light.svg', svg(WM_W, WM_H, wordmark(INDIGO), GRAD))

# ---- apilado ----
SW = 300.0
st_scale = SW / WM_W
sym_size = 120
SH = sym_size + 18 + WM_H * st_scale
body = (f'<g transform="translate({(SW - sym_size) / 2:.1f} 0) scale({sym_size / 64:.4f})">{symbol()}</g>'
        + wordmark(INK, scale=st_scale, ty=sym_size + 18))
write('logo-stacked.svg', svg(SW, SH, body, GRAD))
body = (f'<g transform="translate({(SW - sym_size) / 2:.1f} 0) scale({sym_size / 64:.4f})">{symbol()}</g>'
        + wordmark(INDIGO, scale=st_scale, ty=sym_size + 18))
write('logo-stacked-light.svg', svg(SW, SH, body, GRAD))

# datos para la web (inline en header)
with open(os.path.join(OUT, '_wordmark-paths.txt'), 'w', encoding='utf-8') as f:
    f.write(f'viewBox 0 0 {WM_W:.1f} {WM_H:.1f}\nTOP {WM_TOP}\n')
print('wordmark', WM_W, WM_H)
