from playwright.sync_api import sync_playwright
from pathlib import Path
import json
p=Path('/mnt/data'); checks=[]
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage']);page=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.set_content((p/'Ilha_Viva_Solo_Mata_02_Topdown.html').read_text());page.wait_for_function('Object.keys(tex).length===4 && !dirty');page.wait_for_timeout(250);page.screenshot(path=str(p/'Ilha_Viva_Solo_Mata_02_preview.png'),full_page=True); checks.append('carregamento das 4 texturas')
 page.click('#cut');x=page.evaluate('testField.player.x');page.keyboard.down('ArrowRight');page.wait_for_timeout(480);assert page.evaluate('testField.player.x')==x;assert page.evaluate('testField.world.harvest')>0;page.keyboard.up('ArrowRight');page.wait_for_timeout(350);checks+=['foice com colheita','posição fixa durante ação']
 page.keyboard.down('ArrowRight');page.wait_for_timeout(600);page.keyboard.up('ArrowRight');assert page.evaluate('testField.player.x')>x;checks.append('deslocamento')
 page.click('#water');page.wait_for_timeout(850);checks.append('regador executado')
 page.select_option('#weather','dry');page.click('#month');assert page.evaluate('testField.world.day')==31;checks.append('30 dias de estiagem')
 page.click('#reset');page.click('#graze');page.select_option('#weather','rain');page.click('#month');assert page.evaluate('testField.world.grazed')>0;checks.append('pastoreio autônomo')
 result=page.evaluate('''()=>{let a=forestWorld(),b=forestWorld();a.weather=b.weather='rain';b.traffic=true;for(let i=0;i<30;i++){forestStep(a);forestStep(b)}let idx=a.tiles.map((_,i)=>i).filter(i=>pathDistance((i%W+.5)*T,(Math.floor(i/W)+.5)*T)<20);let mean=(w,k)=>idx.reduce((s,i)=>s+w.tiles[i][k],0)/idx.length;let c=[mean(a,'c'),mean(b,'c')],veg=[mean(a,'b'),mean(b,'b')];for(let j=0;j<3650;j++)forestStep(b);return {c,veg,longDay:b.day,bounded:b.tiles.every(t=>['m','b','r','c','l'].every(k=>Number.isFinite(t[k])&&t[k]>=0&&t[k]<=1))}}''')
 assert result['c'][1]>result['c'][0] and result['veg'][1]<result['veg'][0];checks+=['tráfego autônomo aumenta compactação','tráfego reduz vegetação'];assert result['bounded'];checks.append('3650 dias adicionais com estados limitados');assert not errors,errors;checks.append('zero erros de JavaScript');b.close()
(p/'ilha_topdown'/'qa.json').write_text(json.dumps({'checks':checks,'result':result,'errors':errors},ensure_ascii=False,indent=2));print(json.dumps({'checks':checks,'result':result},ensure_ascii=False))
