from pathlib import Path
p=Path(__file__).parent
old=(p/'ui_base.html').read_text()
header=old.split('<script>',1)[0].replace('Ecossistema 07 | Rios e nutrientes','Ecossistema 08 | Refúgios e reprodução').replace('Ecossistema 07','Ecossistema 08')
header=header.replace('<option value="riverFish">Biomassa de peixes</option>','<option value="riverFish">Peixes adultos</option><option value="riverRefuge">Refúgios aquáticos</option><option value="riverYoung">Ovos e juvenis</option>')
ui='let state='+old.split('let state=',1)[1].split('</script>',1)[0]
ui=ui.replace('ivEco036','ivEco037').replace('restored.version!==36','restored.version!==37')
ui=ui.replace("layer==='riverP'?Math.min(1,r.p/.15):Math.min(1,r.fish.c/.08)","layer==='riverP'?Math.min(1,r.p/.15):layer==='riverRefuge'?(r.deep?Math.min(1,r.pond/8):0):layer==='riverYoung'?Math.min(1,(r.eggs.c+r.juvenile.c)/.03):Math.min(1,r.fish.c/.08)")
ui=ui.replace("['Peixes',aq.fish]","['Peixes adultos (P. sparksorum)',aq.fish],['Juvenis',aq.juvenile],['Ovos',aq.eggs],['Insetos terrestres na água',aq.terrestrialPrey]")
ui=ui.replace('Alimento consumido por peixes: ${num(state.aquaEvents.fishMeals)}','Alimento consumido por peixes: ${num(state.aquaEvents.fishMeals)}<br>Refúgios com água: ${aq.refuges}/7 • Reserva subterrânea: ${num(aq.ground)}<br>Ovos eclodidos (biomassa): ${num(state.aquaEvents.hatchC)}<br>Insetos transferidos: ${state.aquaEvents.insectCount} • Migração: ${num(state.aquaEvents.migrationC)}')
ui=ui.replace('Trecho ${c.y+1} • Água: ${num(r.water)}','Trecho ${c.y+1} • Água: ${num(r.water)}<br>${r.deep?"Poça profunda":"Trecho raso"} • Poça: ${num(r.pond)} • Reserva: ${num(r.ground)}<br>Ovos: ${num(r.eggs.c)} • Juvenis: ${num(r.juvenile.c)} • Coortes: ${r.cohorts.length}')
(p/'Ilha_Viva_Ecossistema_08.html').write_text(header+'<script>\n'+'\n'.join((p/f'{name}.js').read_text() for name in ['ecology','flora','insects','vertebrates','aquatic'])+'\n'+ui+'</script></html>')
