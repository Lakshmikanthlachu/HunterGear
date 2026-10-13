"""QA sweep: overflow, console errors, menu overlay, duplicate controls, missing files, screenshots."""
import os, re, sys, json, threading, http.server, socketserver, functools
from playwright.sync_api import sync_playwright
R = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SHOTS = '/tmp/shots'; os.makedirs(SHOTS, exist_ok=True)
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=R)
class Q(H.func):
    def log_message(self,*a): pass
H = functools.partial(Q, directory=R)
socketserver.TCPServer.allow_reuse_address = True
srv = socketserver.TCPServer(('127.0.0.1', 0), H); threading.Thread(target=srv.serve_forever, daemon=True).start()
BASE = f'http://127.0.0.1:{srv.server_address[1]}/'
PAGES = ['index.html','pages/products.html','pages/safety-regulations.html','pages/contact.html','404.html','coming-soon.html']
WIDTHS = [360, 768, 900, 1024, 1280, 1920]
problems = []
def P(msg): problems.append(msg); print('PROBLEM', msg)
with sync_playwright() as p:
    b = p.chromium.launch()
    for scheme in ('light','dark'):
        for rtl in (False, True):
            if scheme=='dark' and rtl: continue
            ctx = b.new_context(color_scheme=scheme, reduced_motion='reduce')
            # sandbox cannot reach Unsplash: serve a stub image so layout can be tested
            ctx.route('https://www.openstreetmap.org/**', lambda r: r.fulfill(body='<html><body>map</body></html>', content_type='text/html'))
            ctx.route('https://images.unsplash.com/**', lambda r: r.fulfill(path='/tmp/stub.jpg', content_type='image/jpeg'))
            if rtl: ctx.add_init_script("localStorage.setItem('rl-dir','rtl')")
            for page_path in PAGES:
                for w in WIDTHS:
                    pg = ctx.new_page(); pg.set_viewport_size({'width': w, 'height': 900})
                    errs = []
                    pg.on('pageerror', lambda e: errs.append(str(e)))
                    pg.on('console', lambda m: errs.append(m.text) if m.type=='error' else None)
                    pg.on('requestfailed', lambda r: errs.append('FAILED '+r.url))
                    pg.on('response', lambda r: errs.append(f'{r.status} {r.url}') if r.status>=400 else None)
                    pg.goto(BASE+page_path, wait_until='load'); pg.wait_for_timeout(250)
                    tag = f'{page_path}@{w}/{scheme}{"/rtl" if rtl else ""}'
                    sw, cw = pg.evaluate('[document.documentElement.scrollWidth, document.documentElement.clientWidth]')
                    if sw > cw: 
                        wide = pg.evaluate("""()=>[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>document.documentElement.clientWidth+1).slice(0,4).map(e=>e.tagName+'.'+String(e.className).slice(0,60))""")
                        P(f'overflow {tag}: {sw}>{cw} {wide}')
                    pg.evaluate("async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,40))}window.scrollTo(0,0)}"); pg.wait_for_timeout(300)
                    bad = pg.evaluate("[...document.images].filter(i=>!(i.complete&&i.naturalWidth>0)).map(i=>i.getAttribute('src'))")
                    if bad: P(f'images not loaded {tag}: {bad[:3]}')
                    for e in errs: P(f'console {tag}: {e}')
                    if page_path!='coming-soon.html' and scheme=='light' and not rtl:
                        vis = pg.evaluate("""()=>{const v=s=>[...document.querySelectorAll(s)].filter(e=>e.offsetParent!==null&&getComputedStyle(e).visibility!=='hidden').length;
                          return {menu:v('[data-menu-toggle]'),theme:v('[data-theme-toggle]'),dir:v('[data-dir-toggle]'),cta:v('header a.btn-primary')}}""")
                        exp_menu = 1 if w < 1280 else 0
                        if vis['menu']!=exp_menu: P(f'menu buttons {tag}: {vis}')
                        if vis['theme']!=1 or vis['dir']!=1: P(f'toggle count {tag}: {vis}')
                        exp_cta = 0 if w < 640 else 1
                        if vis['cta']!=exp_cta: P(f'header CTA {tag}: {vis}')
                        if w < 1280:
                            y0 = pg.evaluate("document.querySelector('main').getBoundingClientRect().top")
                            pg.click('[data-menu-toggle]'); pg.wait_for_timeout(120)
                            y1 = pg.evaluate("document.querySelector('main').getBoundingClientRect().top")
                            ctas = pg.evaluate("""()=>[...document.querySelectorAll('header a.btn-primary')].filter(e=>e.offsetParent!==null).length""")
                            if abs(y0-y1)>0.5: P(f'menu pushes content {tag}: {y0}->{y1}')
                            if ctas!=1: P(f'duplicate CTA with menu open {tag}: {ctas}')
                            if w in (360,1024): pg.screenshot(path=f'{SHOTS}/menu-{page_path.replace("/","_")}-{w}.png')
                            pg.click('[data-menu-toggle]')
                    if w in (360,1280) or (w==768 and page_path=='index.html'):
                        full = page_path in ('index.html','pages/products.html','pages/safety-regulations.html','pages/contact.html')
                        pg.screenshot(path=f'{SHOTS}/{page_path.replace("/","_")}-{w}-{scheme}{"-rtl" if rtl else ""}.png', full_page=full)
                    pg.close()
            ctx.close()
    b.close()
# missing files
missing = []
for pgp in PAGES:
    html = open(os.path.join(R,pgp)).read()
    for m in re.finditer(r'(?:src|href)="([^"#?:]+?)(?:\?[^"]*)?(?:#[^"]*)?"', html):
        u = m.group(1)
        if u.startswith(('http','mailto','tel','data')) or u=='': continue
        f = os.path.normpath(os.path.join(R, os.path.dirname(pgp), u))
        if not os.path.exists(f): missing.append((pgp,u))
    ids = re.findall(r'\bid="([^"]+)"', html)
    dup = {i for i in ids if ids.count(i)>1}
    if dup: P(f'duplicate ids {pgp}: {dup}')
    for m in re.finditer(r'<img\b(?![^>]*\balt=)[^>]*>', html): P(f'img without alt in {pgp}: {m.group(0)[:80]}')
    if html.count('<h1')!=1: P(f'{pgp}: h1 count {html.count("<h1")}')
for m in missing: P(f'missing file {m}')
print('DONE', len(problems), 'problems')
