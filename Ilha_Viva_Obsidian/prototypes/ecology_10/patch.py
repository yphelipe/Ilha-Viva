from pathlib import Path
p=Path(__file__).parent
f=p/'aquatic.js';s=f.read_text().replace('s.version=38','s.version=39').replace("'terrestrialPrey','detritus'],lim", "'terrestrialPrey','detritus','restingEggs','shrimpEggs','frogEggs','tadpoles','frogs','birds'],lim")
s=s.replace('recharge:0};s.ledger','recharge:0,restingSpawn:0,restingHatch:0,shrimpSpawn:0,shrimpHatch:0,recolonization:0,frogSpawn:0,frogHatch:0,frogMature:0,frogMeals:0,birdMeals:0};s.ledger')
s=s.replace('detritus:pool(.11)})','detritus:pool(.11),restingEggs:pool(.008),shrimpEggs:pool(),frogEggs:pool(),tadpoles:pool(),frogs:pool(y%4===1?.04:0),birds:pool(y%7===3?.025:0),shrimpCohorts:[],frogCohorts:[],tadpoleCohorts:[]})')
s=s.replace('if(a.sp!==3&&near&&r.water>.6', '''if(a.sp!==3&&near&&hour===0&&r.frogs.c>.003&&chance<Math.min(.035,r.frogs.c*.5)){add(r.terrestrialPrey,pool(a.c,a.n,a.n*.15));eat(s,r,'terrestrialPrey','frogs',a.c);ev.frogMeals+=a.c;s.insectEvents.deaths++;}else if(a.sp!==3&&near&&r.water>.6''')
# Migration flux from snapshot; no transport between disconnected reaches.
s=s.replace('for(const r of s.aqua){const wet=', '''// Bidirectional recolonization from surviving adjacent reaches; every transfer is debited.
let dispersal=[];for(let y=0;y<s.aqua.length-1;y++){let a=s.aqua[y],b=s.aqua[y+1];if(a.flow<.15||b.flow<.15||a.water<.6||b.water<.6)continue;for(let k of ['plankton','larvae','shrimp','juvenile']){let src=a[k].c>b[k].c?a:b,dst=src===a?b:a;let q=Math.max(0,(src[k].c-dst[k].c)*.025);dispersal.push([src,dst,k,q])}}for(let [a,b,k,q] of dispersal){let x=take(a[k],q);add(b[k],x);ev.recolonization+=x.c}
for(const r of s.aqua){const wet=''')
s=s.replace('// Eggs are a timed subset', '''// Resting eggs are a finite sediment stock, not an automatic respawn. Functional zooplankton model.
if(wet<.55&&r.plankton.c>0){let q=take(r.plankton,r.plankton.c*.035);add(r.restingEggs,q);ev.restingSpawn+=q.c}
if(wet>.65&&r.o>.5){let q=take(r.restingEggs,r.restingEggs.c*.025);add(r.plankton,q);ev.restingHatch+=q.c}
add(r.detritus,take(r.restingEggs,r.restingEggs.c*.00015));
// Shrimp reproduction is a timed stock transfer; no assumption of drought-resistant Caridina eggs.
if(hour===2&&wet>.65&&r.o>.6&&r.shrimp.c>.008&&r.detritus.c>.025){let q=take(r.shrimp,r.shrimp.c*.012);add(r.shrimpEggs,q);r.shrimpCohorts.push({due:s.step+84,...q});ev.shrimpSpawn+=q.c}
function hatch(cohorts,stock,target,event,lossRate){let keep=[];for(let e of r[cohorts]){let q=pool(e.c*lossRate,e.n*lossRate,e.p*lossRate);for(let k of ['c','n','p']){e[k]-=q[k];r[stock][k]-=q[k]}add(r.detritus,q);if(s.step>=e.due){for(let k of ['c','n','p'])r[stock][k]-=e[k];if(wet>.3){add(r[target],e);ev[event]+=e.c}else add(r.detritus,e)}else keep.push(e)}r[cohorts]=keep;for(let k of ['c','n','p'])r[stock][k]=Math.max(0,r[stock][k])}
hatch('shrimpCohorts','shrimpEggs','shrimp','shrimpHatch',lim(.001+.035*(1-wet)+.012*(1-r.o)));
// Adult tomato frogs on riparian banks, spawning in low-flow pools after rain.
if(hour===0&&r.deep&&r.frogs.c>.015&&wet>.65&&r.pond>1&&s.rain>.5&&r.o>.5){let q=take(r.frogs,r.frogs.c*.009);add(r.frogEggs,q);r.frogCohorts.push({due:s.step+8,...q});ev.frogSpawn+=q.c}
hatch('frogCohorts','frogEggs','tadpoles','frogHatch',lim(.002+.08*(1-wet)+.03*(1-r.o)));
eat(s,r,'algae','tadpoles',Math.min(r.algae.c*.025,r.tadpoles.c*.04*wet*r.o));
// Mean metamorphosis rate, not a strict age-structured tadpole cohort.
let frog=take(r.tadpoles,r.tadpoles.c/180*wet*r.o);add(r.frogs,frog);ev.frogMature+=frog.c;
add(r.detritus,take(r.tadpoles,r.tadpoles.c*(.002+.065*(1-wet))));respire(s,r,'tadpoles',r.tadpoles.c*.003*wet);
// Kingfishers hunt fish by daylight; the predator stock is regional, no individual animation yet.
if(hour===1||hour===2){let q=Math.min(r.fish.c*.025,r.birds.c*.045*wet*r.fish.c/(r.fish.c+.035));eat(s,r,'fish','birds',q);ev.birdMeals+=q;}
for(let k of ['frogs','birds']){add(r.detritus,take(r[k],r[k].c*.0005));respire(s,r,k,r[k].c*(k==='frogs'?.001:.002));}
// Eggs are a timed subset''')
f.write_text(s)
old=(p/'ui_base.html').read_text();header=old.split('<script>',1)[0].replace('Ecossistema 09 | Nascentes e fertilidade','Ecossistema 10 | Recolonização e fauna ribeirinha').replace('<option value="riverO">','<option value="riverLife">Fauna ribeirinha</option><option value="riverO">')
ui='let state='+old.split('let state=',1)[1].split('</script>',1)[0];ui=ui.replace('ivEco038','ivEco039').replace('restored.version!==38','restored.version!==39').replace("layer==='riverO'?r.o:","layer==='riverLife'?Math.min(1,(r.frogs.c+r.birds.c+r.tadpoles.c)/.10):layer==='riverO'?r.o:")
ui=ui.replace("['Detritos',aq.detritus]", "['Ovos dormentes (zooplâncton)',aq.restingEggs],['Ovos de camarão',aq.shrimpEggs],['Ovos de rã',aq.frogEggs],['Girinos',aq.tadpoles],['Rãs adultas',aq.frogs],['Martins-pescadores',aq.birds],['Detritos',aq.detritus]")
ui=ui.replace('Ovos eclodidos (biomassa):','Recolonização: ${num(state.aquaEvents.recolonization)} • Eclosão de ovos dormentes: ${num(state.aquaEvents.restingHatch)}<br>Postura de camarões: ${num(state.aquaEvents.shrimpSpawn)} • Eclosão: ${num(state.aquaEvents.shrimpHatch)}<br>Metamorfose: ${num(state.aquaEvents.frogMature)} • Capturas por aves: ${num(state.aquaEvents.birdMeals)}<br>Ovos eclodidos (biomassa):')
ui=ui.replace('Peixes: ${num(r.fish.c)}','Rãs: ${num(r.frogs.c)} • Girinos: ${num(r.tadpoles.c)} • Aves: ${num(r.birds.c)}<br>Peixes: ${num(r.fish.c)}')
(p/'Ilha_Viva_Ecossistema_10.html').write_text(header+'<script>\n'+'\n'.join((p/f'{n}.js').read_text() for n in ['ecology','flora','insects','vertebrates','aquatic'])+'\n'+ui+'</script></html>')
