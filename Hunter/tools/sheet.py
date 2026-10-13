import sys, glob, os
from playwright.sync_api import sync_playwright
root='/home/claude/ridgeline/assets/img'
prods=sorted(glob.glob(root+'/products/*.svg'))
html='<body style="margin:0;background:#dfe5d7;display:grid;grid-template-columns:repeat(4,300px);gap:8px;padding:8px">'+''.join(f'<img src="file://{p}" width=300>' for p in prods)+'</body>'
open('/tmp/sheet.html','w').write(html)
html2='<body style="margin:0;background:#222;display:grid;grid-template-columns:repeat(2,900px);gap:8px;padding:8px">'+''.join(f'<img src="file://{p}" width=900>' for p in sorted(glob.glob(root+'/hero-*.svg'))[:4]+sorted(glob.glob(root+'/seasons/*.svg')))+'</body>'
open('/tmp/sheet2.html','w').write(html2)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1260,'height':900})
    pg.goto('file:///tmp/sheet.html'); pg.wait_for_timeout(500); pg.screenshot(path='/tmp/products.png',full_page=True)
    pg=b.new_page(viewport={'width':1840,'height':900}); pg.goto('file:///tmp/sheet2.html'); pg.wait_for_timeout(4500); pg.screenshot(path='/tmp/heroes.png',full_page=True)
    b.close()
