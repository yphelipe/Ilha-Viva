from pathlib import Path
p=Path(__file__).parent
f=p/'vertebrates.js';s=f.read_text()
def rep(a,b):
 global s
 assert a in s,a
 s=s.replace(a,b)
rep('season:[250,330]}];','season:[250,330]}, {name:"Tenreque-comum",latin:"Tenrec ecaudatus",hab:["humid","valley","dry"],color:"#c4a18a",base:.045,meal:.007,met:.00009,age:2900,mature:365,gest:60,initial:12,cap:30,season:[275,335]}];')
rep('births:[0,0,0,0],deaths:[0,0,0,0],meals:[0,0,0,0]','births:[0,0,0,0,0],deaths:[0,0,0,0,0],meals:[0,0,0,0,0]')
rep('food:{leaf:0,fruit:0,grass:0,insect:0,lemur:0}', 'food:{leaf:0,fruit:0,grass:0,insect:0,lemur:0,tenrec:0}')
rep('predation:[0,0]','predation:[0,0,0]')
rep('if(a.sp===1){let k=s.insects','if(a.sp===1||a.sp===4){let k=s.insects')
rep("N*take/C,'lemur'", "N*take/C,prey.sp===4?'tenrec':'lemur'")
rep('s.animalEvents.deaths[0]++;s.animalEvents.predation[1]++','s.animalEvents.deaths[prey.sp]++;s.animalEvents.predation[prey.sp===4?2:1]++')
rep('mother:a.sp===0||a.sp===3?a.id:null','mother:[0,3,4].includes(a.sp)?a.id:null')
rep('a.sp===3&&a.age<100','a.sp===3&&a.age<100||a.sp===4&&a.age<35')
rep('if(a.sp===0&&s.animals.some','if((a.sp===0||a.sp===4)&&s.animals.some')
rep('(a.sp===3?hour===0||hour===3:hour===1||hour===2)', '([3,4].includes(a.sp)?hour===0||hour===3:hour===1||hour===2)')
rep('a.sp===1?s.insects.filter(z=>z.sp!==3):s.animals.filter(z=>z.sp===0&&!z.dead)', 'a.sp===1||a.sp===4?s.insects.filter(z=>a.sp===4||z.sp!==3):s.animals.filter(z=>(z.sp===0||z.sp===4)&&!z.dead)')
rep('(a.sp===1?3:65)', '(a.sp===1?3:a.sp===4?2:65)')
rep('(a.sp===1?.22:.055)', '(a.sp===1?.22:a.sp===4?.20:.055)')
rep('let count=[0,0,0,0]','let count=Array(P.length).fill(0)')
f.write_text(s)
f=p/'aquatic.js';s=f.read_text()
rep('s.version=39','s.version=40')
rep("'frogs','birds'],lim", "'frogs','birds','birdEggs','birdYoung'],lim")
rep('birdMeals:0}', 'birdMeals:0,birdSpawn:0,birdHatch:0,birdFledge:0,birdCare:0,birdNestLoss:0}')
rep('tadpoleCohorts:[]','tadpoleCohorts:[],birdEggs:pool(),birdYoung:pool(),birdCohorts:[]')
# Expand prey base using detritivorous larval functional group; no new stock without debit.
rep("['algae','larvae',.055]", "['algae','larvae',.055],['detritus','larvae',.038]")
rep("['terrestrialPrey','fish',.15]", "['terrestrialPrey','fish',.25]")
# lower adult maintenance in cold/low food when still oxygenated, bounded; experimental coefficient
rep("r[k].c*(k==='algae'?.003:.004)*wet", "r[k].c*(k==='algae'?.003:k==='fish'?.0025:.004)*wet")
# birds eggs use stocks, protected bank nesting, hatch requires adult presence (not submerged egg logic)
rep("for(let k of ['frogs','birds'])", """// Bank nesting and dependent young, functional biomass model (timing experimental).
if(hour===2&&r.birds.c>.015&&r.fish.c>.018&&r.flow<40&&s.day%365<190&&r.birdCohorts.length===0&&r.birdYoung.c<.001){let q=take(r.birds,r.birds.c*.12);add(r.birdEggs,q);r.birdCohorts.push({due:s.step+84,...q});ev.birdSpawn+=q.c}
let nests=[];for(let e of r.birdCohorts){let loss=lim(.001+(r.flow>40?.06:0)+(r.birds.c<.004?.035:0));let q=pool(e.c*loss,e.n*loss,e.p*loss);for(let k of ['c','n','p']){e[k]-=q[k];r.birdEggs[k]-=q[k]}add(r.detritus,q);ev.birdNestLoss+=q.c;if(s.step>=e.due){for(let k of ['c','n','p'])r.birdEggs[k]-=e[k];if(r.birds.c>=.004){add(r.birdYoung,e);ev.birdHatch+=e.c}else add(r.detritus,e)}else nests.push(e)}r.birdCohorts=nests;for(let k of ['c','n','p'])r.birdEggs[k]=Math.max(0,r.birdEggs[k]);
let provision=Math.min(Math.max(0,r.birds.c-.012)*.003,r.birdYoung.c*.025);let care=take(r.birds,provision);add(r.birdYoung,care);ev.birdCare+=care.c;let fledge=take(r.birdYoung,r.birdYoung.c/112*lim(r.birds.c/.012));add(r.birds,fledge);ev.birdFledge+=fledge.c;add(r.detritus,take(r.birdYoung,r.birdYoung.c*(r.birds.c<.004?.04:.001)));respire(s,r,'birdYoung',r.birdYoung.c*.003);
for(let k of ['frogs','birds'])""")
f.write_text(s)
# Embed latest modules into existing UI, preserving layout and controls.
import re
html=Path('/mnt/data/iv039/Ilha_Viva_Ecossistema_10.html').read_text()
for file,mod in [('ecology','Eco'),('flora','Flora'),('insects','Insects'),('vertebrates','Vertebrates'),('aquatic','Aquatic')]:
 start=html.index('const '+mod+'=(()=>'); end=html.index('module.exports='+mod+';',start)+len('module.exports='+mod+';'); module=(p/(file+'.js')).read_text(); html=html[:start]+module[module.index('const '+mod+'=(()=>'):].strip()+html[end:]
html=html.replace('Ecossistema 10','Ecossistema 11').replace('v0.39','v0.40').replace('ivEco039','ivEco040').replace('restored.version!==39','restored.version!==40').replace('Recolonização e fauna ribeirinha','Fauna, ninhos e recuperação')
html=html.replace('Capturas por aves: ${num(state.aquaEvents.birdMeals)}', 'Capturas por aves: ${num(state.aquaEvents.birdMeals)}<br>Nidificação: ${num(state.aquaEvents.birdSpawn)} • Eclosão: ${num(state.aquaEvents.birdHatch)} • Cuidado: ${num(state.aquaEvents.birdCare)} • Maturação: ${num(state.aquaEvents.birdFledge)}')
html=html.replace('Aves: ${num(r.birds.c)}','Aves: ${num(r.birds.c)} • Ovos: ${num(r.birdEggs.c)} • Filhotes: ${num(r.birdYoung.c)}')
html=html.replace('${ae.predation[1]} lêmures','${ae.predation[1]} lêmures e ${ae.predation[2]} tenreques')
(p/'Ilha_Viva_Ecossistema_11.html').write_text(html)
