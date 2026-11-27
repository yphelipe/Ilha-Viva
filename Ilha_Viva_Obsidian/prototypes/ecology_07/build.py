from pathlib import Path
p=Path(__file__).parent
old=(p.parent/'iv035/Ilha_Viva_Ecossistema_06.html').read_text()
header=old.split('<script>',1)[0].replace('Ecossistema 06 | Equilíbrio ecológico','Ecossistema 07 | Rios e nutrientes')
header=header.replace('<option value="oxygen">Oxigenação</option>','<option value="oxygen">Oxigenação do solo</option><option value="riverO">Oxigênio do rio</option><option value="riverP">Fósforo do rio</option><option value="riverFish">Biomassa de peixes</option>')
header=header.replace('<h2>Estado da bacia</h2>','<h2>Teia alimentar aquática</h2><div id="aquaStats" class="fine"></div><hr><h2>Trecho fluvial selecionado</h2><div id="aquaInspect" class="fine"></div><div class="row"><button id="nutrients">Adicionar nutrientes</button><button id="organic">Adicionar resíduos</button><button id="fish">Pescar (teste)</button></div><p class="fine">Toque em uma célula do rio para escolher o trecho. Biomassa e oxigênio em unidades de modelo.</p><hr><h2>Estado da bacia</h2>')
header=header.replace('passo de 6 horas','28 trechos fluviais • passo de 6 horas')
ui='let state='+old.split('let state=',1)[1].split('</script>',1)[0]
ui=ui.replace('Vertebrates.create()','Aquatic.create()').replace('Vertebrates.tick(state)','Aquatic.tick(state)').replace('ivEco035','ivEco036')
ui=ui.replace('ctx.fillStyle=color;ctx.fillRect(x,y,k,k);',"if(layer.startsWith('river')){let r=state.aqua[c.y];color=c.channel?mix([39,53,65],[100,210,170],layer==='riverO'?r.o:layer==='riverP'?Math.min(1,r.p/.15):Math.min(1,r.fish.c/.08)):'#354839'}ctx.fillStyle=color;ctx.fillRect(x,y,k,k);")
ui=ui.replace("$('legend').innerHTML=legend.map", "$('legend').innerHTML=(legend||[['#273541','Baixo'],['#64d2aa','Alto']]).map")
ui=ui.replace("function update(){let m=Eco.metrics(state),c=state.cells[sel];", """function update(){let m=Eco.metrics(state),c=state.cells[sel],aq=Aquatic.metrics(state),r=state.aqua[c.y];$('aquaStats').innerHTML=`<b>28 trechos • ${aq.wet} com água suficiente</b><br>Oxigênio médio (índice): ${pct(aq.o)}<br>`+[['Algas',aq.algae],['Zooplâncton',aq.plankton],['Larvas de insetos',aq.larvae],['Camarões',aq.shrimp],['Peixes',aq.fish],['Detritos',aq.detritus]].map(([k,v])=>`<div>${k}: <b>${num(v)}</b></div>`).join('')+`<hr>N recebido da terra: ${num(state.aquaEvents.landN)} • P: ${num(state.aquaEvents.landP)}<br>Matéria orgânica recebida: ${num(state.aquaEvents.landC)}<br>Alimento consumido por peixes: ${num(state.aquaEvents.fishMeals)}`;$('aquaInspect').innerHTML=`Trecho ${c.y+1} • Água: ${num(r.water)}<br>Oxigênio (índice): ${pct(r.o)} • N: ${num(r.n)} • P: ${num(r.p)}<br>Peixes: ${num(r.fish.c)} • Algas: ${num(r.algae.c)} • Detritos: ${num(r.detritus.c)}`;for(let id of ['nutrients','organic','fish'])$(id).disabled=!c.channel;""")
ui=ui.replace("+state.last.cError.toExponential(1);draw()","+state.last.cError.toExponential(1)+' | P '+state.last.pError.toExponential(1);draw()")
ui=ui.replace('window.lab={','for(let id of [\'nutrients\',\'organic\',\'fish\'])$(id).onclick=()=>{if(!busy&&state.cells[sel].channel&&Aquatic.edit(state,state.cells[sel].y,id)){ $(\'log\').textContent=\'Intervenção aquática contabilizada.\';update()}};window.lab={')
# guard legacy save version and missing options
ui=ui.replace('state=JSON.parse(d);','let restored=JSON.parse(d);if(restored.version!==36||!Array.isArray(restored.aqua))throw Error("versão incompatível");state=restored;')
# prevent experimental setting changes mid-advance, already existing edits use guard
for event in ['pollinators','weather','light','faunaMode']:
    pass
out=header+'<script>\n'+'\n'.join((p/f'{name}.js').read_text() for name in ['ecology','flora','insects','vertebrates','aquatic'])+'\n'+ui+'</script></html>'
(p/'Ilha_Viva_Ecossistema_07.html').write_text(out)
