from pathlib import Path
from playwright.sync_api import sync_playwright
import json
P=Path('/mnt/data'); checks=[]; errors=[]
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']); page=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True);page.on('pageerror',lambda e:errors.append(str(e)));page.set_content((P/'Ilha_Viva_Laboratorio_08.html').read_text(),wait_until='load');page.wait_for_function('lab.state().ready',timeout=15000)
 for mode in ['topdown','topdown07','original']:
  page.select_option('#mode',mode); combos=page.evaluate('Object.fromEntries(Object.entries(lab.atlas[lab.state().mode]).map(([k,v])=>[k,Object.keys(v)]))')
  for a,dirs in combos.items():
   for d in dirs:
    page.evaluate('([a,d])=>{lab.select(a);lab.orient(d);document.getElementById("stepBtn").click()}',[a,d]); st=page.evaluate('lab.state()'); assert st['action']==a and st['dir']==d and st['frame']<page.evaluate('lab.seq().length');checks.append(f'{mode}/{a}/{d}')
  for a in combos:
   if a in ['walk','run','swimClothed','swimPants']:continue
   page.evaluate('a=>lab.select(a)',a);before=page.evaluate('lab.state()');page.evaluate('lab.press("right")');page.wait_for_timeout(50);after=page.evaluate('lab.state()');assert (before['x'],before['y'],before['dir'])==(after['x'],after['y'],after['dir']);checks.append(f'{mode}/{a}/lock')
  for a in ['walk','run','swimClothed','swimPants']:
   page.evaluate('a=>{lab.select(a);document.getElementById("resetBtn").click();lab.press("right")}',a);before=page.evaluate('lab.state()');page.wait_for_timeout(120);page.evaluate('lab.release()');after=page.evaluate('lab.state()');assert after['x']>before['x'];checks.append(f'{mode}/{a}/move')
 page.select_option('#mode','topdown');page.evaluate('document.getElementById("speed").value=12')
 for a in ['waterEntry','waterExit','waterEntryPants','waterExitPants']:
  page.evaluate('a=>lab.select(a)',a);page.wait_for_function('!lab.state().playing',timeout=3000);assert page.evaluate('lab.state().frame===lab.seq().length-1');checks.append(a+'/endhold');page.click('#playBtn');assert page.evaluate('lab.state().frame===0');checks.append(a+'/replay')
 page.evaluate('lab.select("hoe");lab.orient("right");document.getElementById("stepBtn").click()');page.screenshot(path=str(P/'Ilha_Viva_Laboratorio_08_preview.png'),full_page=True); assert not errors,errors;b.close()
(P/'ilha_v017'/'qa.json').write_text(json.dumps({'checks':checks,'errors':errors,'count':len(checks)},ensure_ascii=False,indent=2));print(len(checks),'PASS')
