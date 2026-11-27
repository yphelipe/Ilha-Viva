from pathlib import Path
from playwright.sync_api import sync_playwright
import json,base64,io
from PIL import Image
p=Path('/mnt/data'); s=(p/'Ilha_Viva_Laboratorio_11.html').read_text(); prev=(p/'Ilha_Viva_Laboratorio_10.html').read_text()
def data(s):return json.JSONDecoder().raw_decode(s[s.index('const DATA=')+11:])[0]
a,b=data(s),data(prev); checks=0
def check(x,msg):
 global checks
 assert x,msg
 checks+=1
check(a['atlas']['topdown10']==b['atlas']['topdown'],'old 10 preserved')
for m in b['atlas']:
 if m!='topdown':check(a['atlas'][m]==b['atlas'][m],m)
for k,v in b['images'].items():check(a['images'][k]==v,'source bytes')
for act,dirs in a['atlas']['topdown'].items():
 for di,frames in dirs.items():
  old=b['atlas']['topdown'][act][di];check(len(frames)==len(old),act+di)
  if act not in ['run','hoe','axe','sickle']:check(frames==old,act+di+' untouched')
  else:
   for f,orig in zip(frames,old):
    img=Image.open(io.BytesIO(base64.b64decode(a['images'][f['id']].split(',')[1])));check(img.mode=='RGBA' and img.size==(f['w'],f['h']) and img.getchannel('A').getextrema()[0]==0 and img.getchannel('A').getextrema()[1]>=250,'alpha/dim');check(0<=f['ax']<=f['w'] and 0<=f['ay']<=f['h'],'pivot')
static=checks
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage']); page=browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True); errors=[];page.on('pageerror',lambda er:errors.append(str(er)));page.set_content(s,wait_until='load',timeout=30000);page.wait_for_function('window.lab && lab.state().ready');
 for mode in ['topdown','topdown10']:
  page.select_option('#mode',mode);page.locator('#autoRiver').uncheck()
  for act,dirs in a['atlas'][mode].items():
   for di,fs in dirs.items():
    state=page.evaluate('([act,di])=>{lab.select(act);lab.orient(di);return lab.state()}',[act,di]);check(state['action']==act and state['dir']==di,'select');check(page.locator('#frames button').count()==len(fs),'frame count');
    page.evaluate("document.getElementById('stepBtn').click()");check(page.evaluate('lab.state().frame')<len(fs),'frame step')
    if act in ['hoe','axe','sickle','water']:
     pre=page.evaluate('lab.state()');page.evaluate("lab.press('right')");page.wait_for_timeout(25);post=page.evaluate('lab.state()');check((pre['x'],pre['y'],pre['dir'])==(post['x'],post['y'],post['dir']),'fixed');page.evaluate('lab.release()')
 page.select_option('#mode','topdown');page.locator('#autoRiver').check();page.locator('#speed').fill('12');page.click('#cross');page.wait_for_function("lab.state().riverState==='water'",timeout=5000);check(page.evaluate("lab.state().action==='swimPants'"),'swim pants');page.click('#cross');page.wait_for_function("lab.state().riverState==='land'",timeout=5000);check(page.evaluate("lab.state().outfit==='Camisa e botas'"),'outfit restored');page.locator('#frozen').check();check(page.locator('#cross').is_disabled(),'ice');page.evaluate("lab.select('swimPants')");check(page.evaluate("lab.state().action==='walk'"),'no swim on ice');page.locator('#frozen').uncheck();page.locator('#autoRiver').uncheck();page.evaluate("lab.select('hoe');lab.orient('right')");page.screenshot(path=str(p/'Ilha_Viva_Laboratorio_11_preview.png'));check(not errors,'JS errors: '+str(errors));browser.close()
print('PASS',checks,'static',static,'browser',checks-static)
(p/'ilha_v021'/'QA.txt').write_text(f'{checks} verificações: {static} estáticas (incluindo preservação dos PNGs anteriores), {checks-static} no Chromium. Sem erros de JavaScript. Não valida biomecânica ou aprovação artística.\n')
