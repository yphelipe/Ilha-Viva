from pathlib import Path
p=Path(__file__).parent
f=p/'vertebrates.js';s=f.read_text()
def rep(a,b):
 global s
 assert a in s,a
 s=s.replace(a,b)
rep("function distance(s,a,b)","""// Spatial lookup is rebuilt after insect movement, then updated on animal movement.
function index(s){let A=new Map(),I=new Map(),byId=new Map(),live=new Set(s.insects.map(a=>a.id));function add(m,a){if(!m.has(a.pos))m.set(a.pos,new Set());m.get(a.pos).add(a)}for(let a of s.animals){add(A,a);byId.set(a.id,a)}for(let a of s.insects)add(I,a);return {A,I,byId,live,move(a,i){if(i===a.pos)return;A.get(a.pos)?.delete(a);a.pos=i;add(A,a)},near(m,sites,filter){let out=[];for(let i of sites)for(let a of m.get(i)||[])if(filter(a))out.push(a);return out}}}
function shelter(s,a,i){let c=s.cells[i];if(!compatible(s,a,i))return 0;let wet=c.water/c.cap;if(a.sp===4)return c.surface<.3&&wet<.75?Math.max(0,.7*c.litter+.25*c.cover):0;if(a.sp===0)return [0,2,6].includes(c.sp)?c.cover:0;if(a.sp===1)return c.cover;if(a.sp===2)return c.cover*.8;return c.cover*.6+c.litter*.3}
function restSite(s,a,sites){let best=-1,score=0;for(let i of sites){let q=shelter(s,a,i)/(1+.12*distance(s,a.pos,i));if(q>score){best=i;score=q}}return best}
function territory(s,a,i,idx){if(a.sp!==3||a.age<P[3].mature)return 1;let c=s.cells[i],near=[];for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)if(Math.abs(dx)+Math.abs(dy)<=2&&c.x+dx>=0&&c.x+dx<E.W&&c.y+dy>=0&&c.y+dy<E.H)near.push((c.y+dy)*E.W+c.x+dx);return idx.near(idx.A,near,z=>z!==a&&!z.dead&&z.sp===3&&z.sex===a.sex&&z.age>=P[3].mature).length?.25:1}
function distance(s,a,b)""")
rep("s.animalHistory=[];", "s.behaviorEvents={shelterRest:0,territoryAvoid:0,torpor:0,fruitFallback:0,localQueries:0};s.animalHistory=[];")
# fruit fallback for tenrec; cannot consume seeds without accounting, only existing fruit pool.
rep("let fruit=a.sp===0&&c.sp===6&&c.phase==='fruto'?c.fruit:0", "let fruit=(a.sp===0||a.sp===4)&&c.sp===6&&c.phase==='fruto'?c.fruit:0")
rep("function hunt(s,a,prey)","function hunt(s,a,prey,idx)")
rep("let x=s.insects.splice(k,1)[0];", "let x=s.insects.splice(k,1)[0];idx.live.delete(x.id);")
rep("I.tick(s);let hour=", "I.tick(s);let idx=index(s);let hour=")
rep("let mother=s.animals.find(z=>z.id===a.mother&&!z.dead);if(mother){a.pos=mother.pos;", "let mother=idx.byId.get(a.mother);if(mother&&!mother.dead){idx.move(a,mother.pos);")
# identify inactive adult tenrec with safe dry burrow, seasonal approximate winter
rep("let met=Math.min(a.c,p.met*.25", "let torpor=a.sp===4&&a.age>=p.mature&&!a.preg&&!dependent&&!s.animals.some(z=>!z.dead&&z.mother===a.id&&z.age<35)&&day>=135&&day<=260&&a.water>.35&&a.c>p.base*.4&&shelter(s,a,a.pos)>.06&&c.water/c.cap<.5;let met=Math.min(a.c,p.met*.25*(torpor?.35:1)")
rep("(a.sp===2?.00035:.005)*(s.temp", "(a.sp===2?.00035:.005)*(torpor?.4:1)*(s.temp")
rep("if(dependent)continue;let sites=options(s,a,a.sp===3?3:4);", "if(dependent)continue;let sites=options(s,a,a.sp===3?3:4);if(torpor){a.state='torpor';s.behaviorEvents.torpor++;continue;}")
# move updates for rest of tick; prevent stale local cell variable after drinking by re-evaluating sites later
for expr in ['sites[0]','t.i','target','best','carrion.pos','target.pos','sites[Math.floor(rand(s,a.id,48)*sites.length)]']:
 rep('a.pos='+expr+';', 'idx.move(a,'+expr+');')
# one unbraced assignment else if
rep('if(best!==undefined)a.pos=best;', 'if(best!==undefined)idx.move(a,best);') if 'if(best!==undefined)a.pos=best;' in s else None
rep("if(([3,4].includes(a.sp)?hour===0||hour===3:hour===1||hour===2)", """sites=options(s,a,a.sp===3?3:4);let active=[3,4].includes(a.sp)?hour===0||hour===3:hour===1||hour===2;if(!active&&a.state==='repouso'&&a.water>=.68){let rest=restSite(s,a,sites);if(rest>=0){idx.move(a,rest);a.state='abrigado';s.behaviorEvents.shelterRest++}}
if((active)""")
# remove global prey scans; sorted tie by id gives same deterministic order
rep("let prey=(a.sp===1||a.sp===4?s.insects.filter(z=>a.sp===4||z.sp!==3):s.animals.filter(z=>(z.sp===0||z.sp===4)&&!z.dead)).filter(z=>sites.includes(z.pos));prey.sort((x,y)=>distance(s,a.pos,x.pos)-distance(s,a.pos,y.pos));let target=prey[0];", "let prey=a.sp===1||a.sp===4?idx.near(idx.I,sites,z=>idx.live.has(z.id)&&(a.sp===4||z.sp!==3)):idx.near(idx.A,sites,z=>(z.sp===0||z.sp===4)&&!z.dead);s.behaviorEvents.localQueries++;prey.sort((x,y)=>(1+distance(s,a.pos,x.pos))/territory(s,a,x.pos,idx)-(1+distance(s,a.pos,y.pos))/territory(s,a,y.pos,idx)||x.id-y.id);let target=prey[0];if(a.sp===3&&target&&territory(s,a,target.pos,idx)<1&&a.c>p.base*.5){s.behaviorEvents.territoryAvoid++;target=null;}")
rep('hunt(s,a,target)', 'hunt(s,a,target,idx)')
rep("else if(sites.length){idx.move(a,sites[Math.floor(rand(s,a.id,48)*sites.length)]);a.state='buscando presa'}", "else if(sites.length){let fruit=a.sp===4?sites.filter(i=>vegetation(s,a,i)>0).sort((x,y)=>vegetation(s,a,y)-vegetation(s,a,x))[0]:undefined;if(fruit!==undefined){idx.move(a,fruit);if(vegetation(s,a,fruit,true)>0)s.behaviorEvents.fruitFallback++;}else{let preferred=sites.filter(i=>territory(s,a,i,idx)===1);if(preferred.length&&preferred.length<sites.length)s.behaviorEvents.territoryAvoid++;let choices=preferred.length?preferred:sites;idx.move(a,choices[Math.floor(rand(s,a.id,48)*choices.length)]);a.state='buscando presa'}}")
# local mate query
rep("s.animals.some(z=>!z.dead&&z.sp===a.sp&&z.sex==='M'&&z.age>=p.mature&&distance(s,z.pos,a.pos)<=4)","idx.near(idx.A,options(s,a,4),z=>!z.dead&&z.sp===a.sp&&z.sex==='M'&&z.age>=p.mature).length>0")
rep('return {P,create,tick,totals,metrics,edit:I.edit}', 'return {P,create,tick,totals,metrics,edit:I.edit,index,shelter,territory}')
f.write_text(s)
f=p/'aquatic.js';f.write_text(f.read_text().replace('s.version=40','s.version=41'))
html=Path('/mnt/data/iv040/Ilha_Viva_Ecossistema_11.html').read_text()
for file,mod in [('ecology','Eco'),('flora','Flora'),('insects','Insects'),('vertebrates','Vertebrates'),('aquatic','Aquatic')]:
 start=html.index('const '+mod+'=(()=>');end=html.index('module.exports='+mod+';',start)+len('module.exports='+mod+';');module=(p/(file+'.js')).read_text();html=html[:start]+module[module.index('const '+mod+'=(()=>'):].strip()+html[end:]
html=html.replace('Ecossistema 11','Ecossistema 12').replace('v0.40','v0.41').replace('ivEco040','ivEco041').replace('restored.version!==40','restored.version!==41').replace('Fauna, ninhos e recuperação','Abrigos, território e comportamento')
html=html.replace('Carcaças disponíveis: ${state.carcasses.length}', 'Carcaças disponíveis: ${state.carcasses.length}<br>Repouso em abrigo: ${state.behaviorEvents.shelterRest} · Torpor: ${state.behaviorEvents.torpor}<br>Evitação territorial: ${state.behaviorEvents.territoryAvoid} · Frutos alternativos (tenreques): ${state.behaviorEvents.fruitFallback}<br>Consultas espaciais: ${state.behaviorEvents.localQueries}')
(p/'Ilha_Viva_Ecossistema_12.html').write_text(html)
