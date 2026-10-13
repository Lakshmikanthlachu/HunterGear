"""Render tools/.scenes/*.svg to HD JPGs under assets/img (needs Playwright + Pillow)."""
import os, json, io
from playwright.sync_api import sync_playwright
from PIL import Image
R = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
S = os.path.join(R, 'tools', '.scenes')
man = json.load(open(os.path.join(S, 'manifest.json')))
with sync_playwright() as p:
    b = p.chromium.launch()
    for m in man:
        pg = b.new_page(viewport={'width': m['w'], 'height': m['h']})
        open('/tmp/scene.html', 'w').write(f'<body style="margin:0"><img src="file://{S}/{m["svg"]}" width="{m["w"]}" height="{m["h"]}" style="display:block"></body>')
        pg.goto('file:///tmp/scene.html'); pg.wait_for_timeout(600)
        png = pg.screenshot(type='png')
        im = Image.open(io.BytesIO(png)).convert('RGB')
        out = os.path.join(R, 'assets', 'img', m['out']); os.makedirs(os.path.dirname(out), exist_ok=True)
        im.save(out, 'JPEG', quality=m['q'], optimize=True, progressive=True)
        print(m['out'], os.path.getsize(out)//1024, 'KB'); pg.close()
    b.close()
