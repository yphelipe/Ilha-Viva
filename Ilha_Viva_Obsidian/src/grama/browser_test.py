from playwright.sync_api import sync_playwright
from pathlib import Path
import json
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage']);page=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True); errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.set_content(Path('/mnt/data/Ilha_Viva_Campo_01.html').read_text());page.wait_for_timeout(500);page.screenshot(path='/mnt/data/Ilha_Viva_Campo_01_preview.png',full_page=True)
 page.click('#cut');x=page.evaluate('testField.player.x');page.keyboard.down('ArrowRight');page.wait_for_timeout(500);assert page.evaluate('testField.player.x')==x;assert page.evaluate('testField.world.harvest')>0;page.keyboard.up('ArrowRight');page.wait_for_timeout(250);page.keyboard.down('ArrowRight');page.wait_for_timeout(250);page.keyboard.up('ArrowRight');assert page.evaluate('testField.player.x')>x
 page.click('#water');page.wait_for_timeout(800);page.select_option('#weather','dry');page.click('#month');assert page.evaluate('testField.world.day')==31;page.click('#reset');page.click('#graze');page.select_option('#weather','rain');page.click('#month');assert page.evaluate('testField.world.grazed')>0;assert not errors,errors
 print('PASS: abertura, foice, posição fixa, deslocamento, regador executado, 30 dias, reset, pastoreio, zero erros JS');b.close()
