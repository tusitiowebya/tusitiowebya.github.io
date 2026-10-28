"""Rasteriza el kit de íconos y piezas de redes con Edge headless + Pillow.

Uso: python -I tools/icons.py
Escribe en brand/: favicon.ico, favicon-32.png, apple-touch-icon.png,
icon-192.png, icon-512.png, maskable-512.png, avatar-1080.png
"""
import os, subprocess, tempfile, pathlib
from PIL import Image

HERE = pathlib.Path(__file__).resolve().parent
BRAND = (HERE / '..' / 'brand').resolve()
EDGE = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
INDIGO = '#0A0820'
SYM = (BRAND / 'symbol.svg').as_uri()


def shot(html, w, h, out, transparent=False):
    with tempfile.NamedTemporaryFile('w', suffix='.html', delete=False, encoding='utf-8') as f:
        f.write(html)
        src = f.name
    args = [EDGE, '--headless=new', '--hide-scrollbars', '--force-device-scale-factor=1',
            f'--window-size={w},{h}', f'--screenshot={out}']
    if transparent:
        args.append('--default-background-color=00000000')
    subprocess.run(args + [pathlib.Path(src).as_uri()], capture_output=True)
    os.unlink(src)
    return Image.open(out).convert('RGBA').crop((0, 0, w, h))


def page(body, bg='transparent'):
    return f'<html><body style="margin:0;background:{bg};overflow:hidden">{body}</body></html>'


tmp = pathlib.Path(tempfile.gettempdir())

# ícono cuadrado: fondo índigo con radio + símbolo
sq = shot(page(f'<div style="width:512px;height:512px;border-radius:112px;background:{INDIGO};display:grid;place-items:center">'
               f'<img src="{SYM}" style="width:430px;height:430px"></div>'), 512, 512, str(tmp / 'tpy_sq.png'), True)
from PIL import ImageDraw
mask = Image.new('L', (512 * 4, 512 * 4), 0)
ImageDraw.Draw(mask).rounded_rectangle((0, 0, 512 * 4 - 1, 512 * 4 - 1), radius=112 * 4, fill=255)
sq.putalpha(mask.resize((512, 512), Image.LANCZOS))
sq.save(BRAND / 'icon-512.png')
sq.resize((192, 192), Image.LANCZOS).save(BRAND / 'icon-192.png')
sq.resize((32, 32), Image.LANCZOS).save(BRAND / 'favicon-32.png')
sq.save(BRAND / 'favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])

# apple-touch y maskable: cuadrado lleno (el SO redondea), símbolo dentro de la zona segura
full = shot(page(f'<div style="width:512px;height:512px;background:{INDIGO};display:grid;place-items:center">'
                 f'<img src="{SYM}" style="width:330px;height:330px"></div>'), 512, 512, str(tmp / 'tpy_full.png'))
full.save(BRAND / 'maskable-512.png')
full.convert('RGB').resize((180, 180), Image.LANCZOS).save(BRAND / 'apple-touch-icon.png')

# avatar de redes / WhatsApp
av = shot(page(f'<div style="width:1080px;height:1080px;background:radial-gradient(circle at 50% 40%,#1B1550,{INDIGO} 70%);display:grid;place-items:center">'
               f'<img src="{SYM}" style="width:640px;height:640px"></div>'), 1080, 1080, str(tmp / 'tpy_av.png'))
av.convert('RGB').save(BRAND / 'avatar-1080.png')
print('ok')
