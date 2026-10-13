"""Rasterise favicon PNG/ICO + Open Graph cover from the SVG sources (needs Playwright + Pillow)."""
import os
from playwright.sync_api import sync_playwright
from PIL import Image
R = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
img = os.path.join(R, 'assets/img')
with sync_playwright() as p:
    b = p.chromium.launch()
    for size, name in [(16,'fav-16.png'),(32,'fav-32.png'),(48,'fav-48.png'),(180,'apple-touch-icon.png'),(192,'icon-192.png'),(512,'icon-512.png')]:
        pg = b.new_page(viewport={'width': size, 'height': size})
        open('/tmp/fav.html','w').write(f'<body style="margin:0;background:transparent"><img src="file://{img}/favicon.svg" width="{size}" height="{size}" style="display:block"></body>')
        pg.goto('file:///tmp/fav.html')
        pg.wait_for_timeout(150)
        pg.screenshot(path=os.path.join(img, name), omit_background=True)
    pg = b.new_page(viewport={'width': 1200, 'height': 630})
    fonts = os.path.join(R, 'assets/fonts')
    open('/tmp/og.html','w').write(f'''<style>
@font-face{{font-family:BS;font-weight:800;src:url("file://{fonts}/big-shoulders-display-latin-800-normal.woff2")}}
@font-face{{font-family:BS;font-weight:600;src:url("file://{fonts}/big-shoulders-display-latin-600-normal.woff2")}}
body{{margin:0;width:1200px;height:630px;position:relative;overflow:hidden;background:#0b1710;font-family:BS}}
img.bg{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}}
.s{{position:absolute;inset:0;background:linear-gradient(90deg,rgba(11,23,16,.78),rgba(11,23,16,.15))}}
.c{{position:absolute;left:72px;top:96px;color:#fff;width:760px}}
.k{{color:#ff7d3d;font-size:34px;font-weight:600;display:flex;gap:14px;align-items:center}}
.k:before{{content:"";width:42px;height:3px;background:#ff7d3d}}
h1{{margin:14px 0 0;font-size:108px;line-height:.92;text-transform:uppercase;font-weight:800}}
.l{{position:absolute;left:72px;bottom:56px;display:flex;gap:16px;align-items:center;color:#fff;font-size:40px;font-weight:800;text-transform:uppercase;letter-spacing:.03em}}
</style><img class="bg" src="file://{img}/heroes/hero-home.jpg"><div class="s"></div>
<div class="c"><div class="k">Outfitting hunters since 1994</div><h1>Gear that holds up when the season opens</h1></div>
<div class="l"><img src="file://{img}/logo-mark-light.svg" width="52" height="52">Ridgeline Outfitters</div>''')
    pg.goto('file:///tmp/og.html')
    pg.wait_for_timeout(800)
    pg.screenshot(path=os.path.join(img, 'og-cover.png'))
    b.close()
ims = [Image.open(os.path.join(img, f'fav-{s}.png')).convert('RGBA') for s in (16, 32, 48)]
ims[2].save(os.path.join(img, 'favicon.ico'), format='ICO', sizes=[(16,16),(32,32),(48,48)])
for s in (16, 32, 48): os.remove(os.path.join(img, f'fav-{s}.png'))
print('rasterised')
