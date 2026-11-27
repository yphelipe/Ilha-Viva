from playwright.sync_api import sync_playwright
from pathlib import Path
import json
errors=[]; checks=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']); page=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True);page.on('pageerror',lambda e:errors.append(str(e))); page.set_content(Path('/mnt/data/Ilha_Viva_Laboratorio_04.html').read_text());page.wait_for_function('window.lab?.ready');page.click('#play')
 for v in ['ind','sheet']:
  page.select_option('#version',v)
  for i in range(9):
   page.locator('#actions button').nth(i).click(); n=page.evaluate('lab.count');page.click('#next');assert page.evaluate('lab.frame')==1;page.click('#prev');assert page.evaluate('lab.frame')==0;assert page.locator('#strip button').count()==n;checks.append([v,i,n])
 page.select_option('#version','ind');page.locator('#actions button').nth(1).click();page.select_option('#bg','white');page.click('#next');page.screenshot(path='/mnt/data/Ilha_Viva_Laboratorio_04_preview.png',full_page=True);page.click('#play');page.wait_for_function('lab.frame!==1');assert not errors,errors;b.close()
print(len(checks),'sequências verificadas',errors);Path('/mnt/data/ilha_teste15/qa.json').write_text(json.dumps({'checks':checks,'errors':errors,'playback':True,'mode':'chromium mobile, HTML via set_content'},indent=2))
