from playwright.sync_api import sync_playwright
from pathlib import Path
import json
p=Path(__file__).parent;tests=[];errors=[]
with sync_playwright() as q:
 b=q.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=b.new_page(viewport={'width':412,'height':915},is_mobile=True,has_touch=True);page.on('pageerror',lambda e:errors.append(str(e)));page.set_content((p/'Ilha_Viva_Ecossistema_10.html').read_text());page.evaluate("Object.defineProperty(window,'localStorage',{value:{data:{},setItem(k,v){this.data[k]=v},getItem(k){return this.data[k]??null}}})")
 def ck(n,v):
  assert v,n;tests.append(n)
 ck('sem overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'));ck('28 trechos',page.evaluate('lab.state.aqua.length')==28)
 for layer in ['riverLife','soilP','microP','rootAssoc','riverSpring','bacteria','fungi','riverO','riverP','riverFish','riverRefuge','riverYoung','land','species']:
  page.select_option('#layer',layer);ck('camada '+layer,page.locator('#layer').input_value()==layer)
 page.click('#day');page.wait_for_function('lab.state.day===1');ck('avanço diário',True)
 page.evaluate('sel=lab.state.aqua[12].ids[0];update()');page.click('#nutrients');ck('aporte P',page.evaluate('lab.state.ledger.externalP===.05'));page.click('#organic');ck('aporte C',page.evaluate('lab.state.ledger.externalC>=.8'));page.click('#fish');ck('pesca',page.evaluate('lab.state.aquaEvents.harvestC>0'))
 page.click('#save');page.click('#week');page.wait_for_function('lab.state.day===8');page.click('#load');ck('restauração',page.evaluate('lab.state.day===1'));page.click('#reset');ck('reinício',page.evaluate('lab.state.day===0&&lab.state.aquaEvents.harvestC===0'))
 page.select_option('#weather','storm');page.click('#week');page.wait_for_function('lab.state.day===7');ck('escoamento',page.evaluate('lab.state.aquaEvents.landP>0'));ck('balanço P exibido','| P' in page.locator('#balance').inner_text());ck('sem erros JS',not errors)
 page.select_option('#layer','riverO');page.screenshot(path=str(p/'Ilha_Viva_Ecossistema_10_preview.png'),full_page=True);b.close()
(p/'browser39-results.json').write_text(json.dumps({'passed':len(tests),'tests':tests,'errors':errors},ensure_ascii=False,indent=2));print(tests)
