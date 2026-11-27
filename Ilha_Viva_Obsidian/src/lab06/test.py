from playwright.sync_api import sync_playwright
from pathlib import Path
import json
P=Path('/mnt/data'); errs=[]; count=0
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage']); page=b.new_page(viewport={'width':412,'height':915},is_mobile=True,has_touch=True);page.on('pageerror',lambda e:errs.append(str(e)))
 page.set_content((P/'Ilha_Viva_Laboratorio_06.html').read_text(),wait_until='load',timeout=20000);page.wait_for_function('window.lab && lab.ready()',timeout=15000)
 for action,dirs in page.evaluate('Object.fromEntries(Object.entries(lab.D).map(([k,v])=>[k,Object.keys(v)]))').items():
  page.evaluate('(a)=>lab.choose(a)',action)
  for d in dirs:
   page.evaluate('(d)=>lab.direction(d)',d);page.locator('#step').click();n=page.evaluate('lab.sequence().length'); assert page.locator('#frames button').count()==n
   assert page.evaluate('lab.state().frame')<n
   count+=1
 page.evaluate("lab.choose('machado');lab.direction('baixo')"); page.locator('#step').click(); xy=page.evaluate('({x:lab.state().x,y:lab.state().y})');page.keyboard.down('ArrowDown');page.wait_for_timeout(250);page.keyboard.up('ArrowDown');assert page.evaluate('({x:lab.state().x,y:lab.state().y})')==xy
 page.evaluate("lab.choose('andar');lab.direction('baixo')");page.locator('#check').check();page.locator('#anchor').check();page.screenshot(path=str(P/'Ilha_Viva_Laboratorio_06_preview.png'),full_page=True); print('combinations',count,'frames',page.evaluate('lab.count()'),'errors',errs);assert not errs; b.close()
(P/'ilha_lab06/qa.json').write_text(json.dumps({'combinations':count,'errors':errs,'tool_position_fixed':True,'device':'Chromium mobile emulation','realism':'pending','edge_warnings':'see report.json'},indent=2))
