from playwright.sync_api import sync_playwright
from pathlib import Path
import json
p=Path('/mnt/data'); checks=[]
def ck(name,cond):
 assert cond,name; checks.append(name)
with sync_playwright() as w:
 b=w.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']); page=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True); errors=[]; page.on('pageerror',lambda e:errors.append(str(e))); page.set_content((p/'Ilha_Viva_Laboratorio_14.html').read_text(),wait_until='load'); page.wait_for_function('window.lab && lab.state().ready'); state=lambda:page.evaluate('lab.state()'); ck('normal inicial',not state()['coldWeather']); page.click('#friagem'); ck('friagem ativa',state()['coldWeather']); ck('sprite frio',state()['displayId'].startswith('frio')); page.screenshot(path=str(p/'Ilha_Viva_Laboratorio_14_preview.png'),full_page=True)
 for a in ['idle','walk','run','hoe','axe','sickle','water','sleep','sleepBed']:
  page.evaluate('(a)=>lab.select(a)',a)
  for di in page.evaluate('(a)=>Object.keys(lab.atlas.topdown[a])',a):
   page.evaluate('(d)=>lab.orient(d)',di); st=state(); ck(a+' '+di+' roupa fria',st['displayId'].startswith('frio')); ck(a+' '+di+' posição',st['fixed']==(a not in ['walk','run']));
 # hysteresis
 page.eval_on_selector('#temp',"e=>{e.value=20;e.dispatchEvent(new Event('input'))}"); ck('20 preserva frio',state()['coldWeather']); page.click('#warm'); ck('calor retorna original',not state()['coldWeather'] and not state()['displayId'].startswith('frio')); page.eval_on_selector('#temp',"e=>{e.value=20;e.dispatchEvent(new Event('input'))}");ck('20 preserva calor',not state()['coldWeather']);page.click('#friagem');page.click('#cross');page.wait_for_function("lab.state().riverState==='water'",timeout=15000);ck('natação sem camisa',state()['action']=='swimPants' and not state()['displayId'].startswith('frio')); page.click('#cross');page.wait_for_function("lab.state().riverState==='land'",timeout=15000);ck('restaura roupa fria',state()['displayId'].startswith('frio'));ck('sem gelo',not state()['frozen'] and page.locator('#frozen').count()==0); ck('sem erros JS',not errors);b.close()
(p/'iv27_qa.json').write_text(json.dumps({'passed':len(checks),'checks':checks,'errors':errors},ensure_ascii=False,indent=2));print(len(checks),'pass')
