from pathlib import Path
p=Path(__file__).parent
old=(p/'ui_base.html').read_text(); header=old.split('<script>',1)[0].replace('Ecossistema 08','Ecossistema 09').replace('Refúgios e reprodução','Nascentes e fertilidade')
header=header.replace('<option value="n">','<option value="soilP">Fósforo disponível</option><option value="rootAssoc">Associação radicular</option><option value="microP">Fósforo microbiano</option><option value="riverSpring">Nascentes profundas</option><option value="n">')
ui='let state='+old.split('let state=',1)[1].split('</script>',1)[0]
ui=ui.replace('ivEco037','ivEco038').replace('restored.version!==37','restored.version!==38').replace('Insects.edit(state,sel,','Aquatic.landEdit(state,sel,')
ui=ui.replace("layer==='n'?mix", "layer==='soilP'?mix([72,49,39],[218,190,99],c.soilP/.06):layer==='rootAssoc'?mix([41,55,36],[179,130,216],c.rootAssoc):layer==='microP'?mix([42,37,35],[213,151,81],c.microP/.012):layer==='n'?mix")
ui=ui.replace("layer==='riverO'?r.o:","layer==='riverSpring'?(r.spring?r.deepGround/300:0):layer==='riverO'?r.o:")
ui=ui.replace('Ovos eclodidos (biomassa):','Nascentes ativas: ${aq.springs}/3 • Reserva profunda: ${num(aq.deepGround)}<br>Recarga do solo: ${num(state.soilEvents.deepRecharge)} • Descarga: ${num(state.soilEvents.springDischarge)}<br>Ovos eclodidos (biomassa):')
ui=ui.replace('Ovos: ${num(r.eggs.c)}','Nascente: ${r.spring?"sim":"não"} • Água profunda: ${num(r.deepGround)}<br>Ovos: ${num(r.eggs.c)}')
ui=ui.replace('Oxigenação: ${pct(c.oxygen)}','Fósforo disponível: ${num(c.soilP)} • adsorvido: ${num(c.sorbedP)}<br>Fósforo microbiano: ${num(c.microP)} • associação radicular: ${pct(c.rootAssoc)}<br>Absorção P acumulada: ${num(state.soilEvents.uptake)} • mineralização: ${num(state.soilEvents.mineralized)}<br>Oxigenação: ${pct(c.oxygen)}')
assert 'value="soilP"' in header
(p/'Ilha_Viva_Ecossistema_09.html').write_text(header+'<script>\n'+'\n'.join((p/f'{name}.js').read_text() for name in ['ecology','flora','insects','vertebrates','aquatic'])+'\n'+ui+'</script></html>')
