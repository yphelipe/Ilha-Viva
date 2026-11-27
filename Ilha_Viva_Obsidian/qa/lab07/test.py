from playwright.sync_api import sync_playwright
from pathlib import Path
import json
p=Path('/mnt/data'); checks=[]
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.set_content((p/'Ilha_Viva_Laboratorio_07_Topdown.html').read_text(),wait_until='load');page.wait_for_function('lab.state().ready',timeout=20000)
 for mode in ['topdown','original']:
  page.select_option('#mode',mode); combos=page.evaluate('Object.fromEntries(Object.entries(lab.atlas[lab.state().mode]).map(([k,v])=>[k,Object.keys(v)]))')
  for a,dirs in combos.items():
   for d in dirs:
    page.evaluate('([a,d])=>{lab.select(a);lab.orient(d)}',[a,d]); page.evaluate("document.getElementById('stepBtn').click()"); state=page.evaluate('lab.state()'); assert state['dir']==d and state['action']==a and state['frame']<page.evaluate('lab.seq().length');checks.append(mode+'/'+a+'/'+d)
  for a in ['hoe','axe','sickle','water','sleep','waterEntry','idle']:
   page.evaluate('a=>{lab.select(a);lab.orient("down")}',a);before=page.evaluate('lab.state()'); page.evaluate('lab.press("right")');page.wait_for_timeout(90);after=page.evaluate('lab.state()');assert (before['x'],before['y'],before['dir'])==(after['x'],after['y'],after['dir']);checks.append(mode+'/'+a+'/lock')
  for a in ['walk','run','swimClothed','swimPants']:
   page.evaluate('a=>{lab.select(a)}',a); page.click('#resetBtn');before=page.evaluate('lab.state()');page.evaluate('lab.press("right")');page.wait_for_timeout(180);page.evaluate('lab.release()');after=page.evaluate('lab.state()');assert after['x']>before['x'];checks.append(mode+'/'+a+'/move')
 page.select_option('#mode','topdown');page.evaluate('lab.select("axe")');page.evaluate("document.getElementById('stepBtn').click()");page.screenshot(path=str(p/'Ilha_Viva_Laboratorio_07_preview.png'),full_page=True);assert not errors,errors; b.close()
(p/'ilha_v016'/'qa.json').write_text(json.dumps({'checks':checks,'errors':errors,'count':len(checks)},indent=2));print(len(checks),'PASS')
