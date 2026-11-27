from playwright.sync_api import sync_playwright
from pathlib import Path
with sync_playwright() as w:
 b=w.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']); p=b.new_page(viewport={'width':412,'height':915}); errs=[];p.on('pageerror',lambda e:errs.append(str(e)));p.set_content(Path('Ilha_Viva_Escala_01.html').read_text());p.wait_for_function('hero.complete && hero.naturalWidth>0');assert p.evaluate('document.documentElement.scrollWidth<=innerWidth');p.select_option('#view','animal');p.select_option('#view','building');p.select_option('#view','all');assert not errs; p.screenshot(path='Ilha_Viva_Escala_01_preview.png',full_page=True);b.close()
print('Escala: sprite carregado, sem overflow, 3 modos, sem erros JS')
