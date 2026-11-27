from playwright.sync_api import sync_playwright
from pathlib import Path
import json
p=Path(__file__).parent; tests=[]; errors=[]
with sync_playwright() as q:
 b=q.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=b.new_page(viewport={'width':412,'height':915},is_mobile=True,has_touch=True);page.on('pageerror',lambda e:errors.append(str(e)));page.set_content((p/'Ilha_Viva_Ecossistema_06.html').read_text());page.evaluate("Object.defineProperty(window,'localStorage',{value:{data:{},setItem(k,v){this.data[k]=v},getItem(k){return this.data[k]??null}}})")
 def ck(n,v):
  assert v,n;tests.append(n)
 ck('sem overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'));ck('40 vertebrados',page.evaluate('lab.state.animals.length')==40);page.click('#day');page.wait_for_function('lab.state.day===1');ck('avanço diário',True);page.click('#showAnimals');ck('ocultar fauna',not page.locator('#showAnimals').is_checked());page.click('#showAnimals');page.click('#save');page.click('#week');page.wait_for_function('lab.state.day===8');page.click('#load');ck('restauração',page.evaluate('lab.state.day')==1);page.select_option('#faunaMode','none');page.click('#day');page.wait_for_function('lab.state.day===2');ck('remoção experimental',page.evaluate('lab.state.animals.length')==0);page.click('#reset');ck('reinício',page.evaluate('lab.state.animals.length')==40);page.select_option('#layer','micro');ck('camada microbiana',page.locator('#layer').input_value()=='micro');page.select_option('#layer','species');page.click('#month');page.wait_for_function('lab.state.day===30');ck('30 dias',True);ck('fezes produzidas',page.evaluate('lab.state.animalEvents.dung>0'));ck('sem erros JS',not errors);page.screenshot(path=str(p/'Ilha_Viva_Ecossistema_06_preview.png'),full_page=True);b.close()
(p/'browser35-results.json').write_text(json.dumps({'passed':len(tests),'tests':tests,'errors':errors},ensure_ascii=False,indent=2));print(tests)
