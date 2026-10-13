import os, json, threading, http.server, socketserver, functools
from playwright.sync_api import sync_playwright
R=os.path.abspath(os.path.join(os.path.dirname(__file__),'..'))
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
socketserver.TCPServer.allow_reuse_address=True
srv=socketserver.TCPServer(('127.0.0.1',0),functools.partial(Q,directory=R)); threading.Thread(target=srv.serve_forever,daemon=True).start()
BASE=f'http://127.0.0.1:{srv.server_address[1]}/'
axe=open('/tmp/axe/node_modules/axe-core/axe.min.js').read()
with sync_playwright() as p:
    b=p.chromium.launch()
    for scheme in ('light','dark'):
        ctx=b.new_context(color_scheme=scheme, reduced_motion='reduce')
        for page in ['index.html','pages/products.html','pages/safety-regulations.html','pages/contact.html','404.html','coming-soon.html']:
            for w in (390,1280):
                pg=ctx.new_page(); pg.set_viewport_size({'width':w,'height':900}); pg.goto(BASE+page); pg.wait_for_timeout(300)
                pg.evaluate("async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,30))}window.scrollTo(0,0)}")
                pg.add_script_tag(content=axe)
                r=pg.evaluate("axe.run({runOnly:['wcag2a','wcag2aa','best-practice']})")
                for v in r['violations']:
                    print(scheme,page,w,v['id'],v['impact'],len(v['nodes']),[n['target'] for n in v['nodes'][:2]], (v['nodes'][0].get('any') or [{}])[0].get('message','')[:120])
                pg.close()
        ctx.close()
    b.close()
print('axe done')
