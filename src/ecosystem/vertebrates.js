/* v0.33 Experimental ecological agents. Carbon/nitrogen mass units are model units. */
const Vertebrates=(()=>{
const I=typeof module!=='undefined'?require('./insects'):Insects,F=typeof module!=='undefined'?require('./flora'):Flora,E=typeof module!=='undefined'?require('./ecology'):Eco;
const P=[{name:'Lêmure-de-cauda-anelada',latin:'Lemur catta',hab:['dry','valley'],color:'#eee4d1',base:.10,meal:.006,met:.00027,age:6500,mature:1095,gest:135,initial:20,cap:48,season:[100,145]}, {name:'Camaleão-pantera',latin:'Furcifer pardalis',hab:['humid','valley','dry'],color:'#74e9a4',base:.018,meal:.006,met:.000065,age:1460,mature:180,gest:240,initial:8,cap:24,season:[0,365]}, {name:'Tartaruga-radiada',latin:'Astrochelys radiata',hab:['dry'],color:'#eab26a',base:.10,meal:.004,met:.00009,age:18000,mature:3000,gest:150,initial:10,cap:24,season:[0,90]}, {name:'Fossa',latin:'Cryptoprocta ferox',hab:['humid','valley','dry'],color:'#d47d54',base:.22,meal:.09,met:.00038,age:6000,mature:1460,gest:90,initial:2,cap:6,season:[250,330]}, {name:"Tenreque-comum",latin:"Tenrec ecaudatus",hab:["humid","valley","dry"],color:"#c4a18a",base:.045,meal:.007,met:.00009,age:2900,mature:365,gest:60,initial:12,cap:30,season:[275,335]}];
function rand(s,id,salt=0){let n=(s.seed^Math.imul(s.step+1,2654435761)^Math.imul(id+1,1597334677)^salt)>>>0;n=Math.imul(n^(n>>>16),0x7feb352d);n=Math.imul(n^(n>>>15),0x846ca68b);return ((n^(n>>>16))>>>0)/4294967296}
function create(seed=42){let s=I.create(seed);s.version=35;s.nests=[];s.carcasses=[];s.lifeEvents={laid:0,hatched:0,eggLoss:0,nursed:0,orphaned:0};s.animals=[];s.nextAnimal=0;s.faunaMode='normal';s.animalEvents={births:[0,0,0,0,0],deaths:[0,0,0,0,0],meals:[0,0,0,0,0],food:{leaf:0,fruit:0,grass:0,insect:0,lemur:0,tenrec:0},predation:[0,0,0],dung:0,seedDeposits:0,seedMass:0,fled:0};s.behaviorEvents={shelterRest:0,territoryAvoid:0,torpor:0,fruitFallback:0,localQueries:0};s.animalHistory=[];s.deathCauses={fome:0,sede:0,idade:0,predacao:0,inundacao:0,experimento:0};;for(let c of s.cells){if(c.sp===6&&c.age>=F.species[6].mature&&c.res>=.016&&c.n>=.00128&&rand(s,c.x+c.y*E.W,60)<.22){c.res-=.016;c.n-=.00128;c.fruit=.016;c.fruitN=.00128;c.phase='fruto';c.phaseDay=0}}for(let sp=0;sp<P.length;sp++){let p=P[sp],sites=s.cells.map((c,i)=>!c.channel&&p.hab.includes(c.kind)&&(sp===0?c.sp===6:sp===2?c.sp===7:true)?i:-1).filter(i=>i>=0);for(let k=0;k<p.initial;k++){let id=s.nextAnimal++;s.animals.push({id,sp,pos:sites[Math.floor(rand(s,id,35)*sites.length)],c:p.base,n:p.base*.08,age:p.mature+100+k,sex:k%2?'M':'F',preg:0,lastBirth:-365,water:1,seed:0,seedDue:0,state:'repouso',lastHunt:-30})}}cognitionEvents(s);for(const a of s.animals)if(a.sp===0)initLemur(s,a);return s}
function totals(s){let t=I.totals(s);for(let a of s.animals){t.c+=a.c+a.seed;t.n+=a.n+a.seed*.08}for(let e of [...s.nests,...s.carcasses]){t.c+=e.c;t.n+=e.n}return t}
// Spatial lookup is rebuilt after insect movement, then updated on animal movement.
function index(s){let A=new Map(),I=new Map(),byId=new Map(),live=new Set(s.insects.map(a=>a.id));function add(m,a){if(!m.has(a.pos))m.set(a.pos,new Set());m.get(a.pos).add(a)}for(let a of s.animals){add(A,a);byId.set(a.id,a)}for(let a of s.insects)add(I,a);return {A,I,byId,live,move(a,i){if(i===a.pos)return;A.get(a.pos)?.delete(a);a.pos=i;add(A,a)},near(m,sites,filter){let out=[];for(let i of sites)for(let a of m.get(i)||[])if(filter(a))out.push(a);return out}}}
function shelter(s,a,i){let c=s.cells[i];if(!compatible(s,a,i))return 0;let wet=c.water/c.cap;if(a.sp===4)return c.surface<.3&&wet<.75?Math.max(0,.7*c.litter+.25*c.cover):0;if(a.sp===0)return [0,2,6].includes(c.sp)?c.cover:0;if(a.sp===1)return c.cover;if(a.sp===2)return c.cover*.8;return c.cover*.6+c.litter*.3}
function restSite(s,a,sites,ward){
  let best=-1,score=0;
  for(const i of sites){
    const cover=shelter(s,a,i);
    let q=cover/(1+.12*distance(s,a.pos,i));
    if(a.sp===0&&cover>0){
      const familiar=(a.memory||[]).find(z=>z.i===i&&z.kind==='shelter'&&
        z.context===memoryContext(s,i,'shelter')&&activeMemory(s,z));
      q*=1+.04*(familiar?.visits||0);
      q*=1-dangerRisk(s,a,i)*(ward?.85:.35+.55*a.personality.caution);
    }
    if(q>score){best=i;score=q}
  }
  return best;
}
function territory(s,a,i,idx){if(a.sp!==3||a.age<P[3].mature)return 1;let c=s.cells[i],near=[];for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)if(Math.abs(dx)+Math.abs(dy)<=2&&c.x+dx>=0&&c.x+dx<E.W&&c.y+dy>=0&&c.y+dy<E.H)near.push((c.y+dy)*E.W+c.x+dx);return idx.near(idx.A,near,z=>z!==a&&!z.dead&&z.sp===3&&z.sex===a.sex&&z.age>=P[3].mature).length?.25:1}
function distance(s,a,b){let x=s.cells[a],y=s.cells[b];return Math.abs(x.x-y.x)+Math.abs(x.y-y.y)}
function compatible(s,a,i){let c=s.cells[i];return c&&!c.channel&&c.surface<8&&P[a.sp].hab.includes(c.kind)}
function nearbyCells(s,pos,r,allow){
  const c=s.cells[pos], out=[];
  for(let dy=-r;dy<=r;dy++) for(let dx=-r;dx<=r;dx++){
    const x=c.x+dx, y=c.y+dy, i=y*E.W+x;
    if(x>=0&&x<E.W&&y>=0&&y<E.H&&Math.abs(dx)+Math.abs(dy)<=r&&(!allow||allow(i)))out.push(i);
  }
  return out;
}
function options(s,a,r=2){return nearbyCells(s,a.pos,r,i=>compatible(s,a,i))}
function deposit(s,a){if(a.seed>0){let c=s.cells[a.pos];if(F.species[6].hab.includes(c.kind)){c.bank[6]+=a.seed;s.animalEvents.seedDeposits++;s.animalEvents.seedMass+=a.seed;}else{c.litter+=a.seed;c.ln+=a.seed*.08}a.seed=0;a.seedDue=0}}
function die(s,a,cause='experimento'){s.deathCauses[cause]++;deposit(s,a);let c=s.cells[a.pos];c.litter+=a.c;c.ln+=a.n;a.c=a.n=0;a.dead=true;s.animalEvents.deaths[a.sp]++}
function assimilate(s,a,c,C,N,kind){if(C<=0)return;let p=P[a.sp],seed=kind==='fruit'&&a.sp===0?Math.min(C*.12,N/.08):0;a.seed+=seed;if(seed)a.seedDue=a.seedDue||s.day+1;C-=seed;N-=seed*.08;let body=Math.min(C*.32,Math.max(0,p.base*1.8-a.c)),bodyN=Math.min(N*.42,body*.12);a.c+=body;a.n+=bodyN;let waste=C*.40;c.dung+=waste;c.dungN+=N-bodyN;s.ledger.carbonOut+=C-body-waste;s.animalEvents.dung+=waste;s.animalEvents.meals[a.sp]++;s.animalEvents.food[kind]+=C+seed;let hydration=(kind==='grass'?.24:kind==='leaf'||kind==='fruit'?.12:.025)*Math.min(1,C/p.meal);let w=Math.min(c.water,hydration/8);c.water-=w;s.ledger.waterOut+=w;a.water=Math.min(1,a.water+w*8);a.state='comendo '+kind;if(kind==='fruit'||kind==='leaf')remember(s,a,a.pos,'food',{context:kind})}
function vegetation(s,a,i,consume=false){let c=s.cells[i],p=P[a.sp];let fruit=(a.sp===0||a.sp===4)&&c.sp===6&&c.phase==='fruto'?c.fruit:0;let leaf=(a.sp===0&&(c.sp===6||c.sp===2)||a.sp===2&&c.sp===7)?Math.max(0,c.b-.025)*.35:0;let score=fruit*12+leaf;if(!consume)return score;let amount=Math.min(p.meal,fruit||leaf);if(!amount)return 0;let key=fruit?'fruit':'b',nk=fruit?'fruitN':'pn',N=c[nk]*amount/c[key];c[key]-=amount;c[nk]-=N;if(!fruit){c.leaf=c.b*F.species[c.sp].leaf;c.cover=Math.min(1,c.b)}assimilate(s,a,c,amount,N,fruit?'fruit':a.sp===2?'grass':'leaf');return amount}
function hunt(s,a,prey,idx){let c=s.cells[a.pos];if(a.sp===1||a.sp===4){let k=s.insects.findIndex(z=>z.id===prey.id);if(k<0)return;let x=s.insects.splice(k,1)[0];idx.live.delete(x.id);s.insectEvents.deaths++;assimilate(s,a,c,x.c,x.n,'insect');s.animalEvents.predation[0]++;}else{if(prey.dead)return;deposit(s,prey);let C=prey.c,N=prey.n,take=Math.min(C,P[a.sp].meal);assimilate(s,a,c,take,N*take/C,prey.sp===4?'tenrec':'lemur');if(C>take)s.carcasses.push({pos:a.pos,c:C-take,n:N*(1-take/C),age:0});prey.c=prey.n=0;prey.dead=true;s.animalEvents.deaths[prey.sp]++;s.animalEvents.predation[prey.sp===4?2:1]++;s.deathCauses.predacao++;}a.lastHunt=s.day}
function offspring(s,a,C,N){return {father:a.conceptionFather??a.father??null,fatherId:a.conceptionFather??a.father??null,motherId:a.id??a.motherId??null,parentsGenes:a.parentsGenes??null,id:s.nextAnimal++,sp:a.sp,pos:a.pos,c:C,n:N,age:0,sex:rand(s,s.nextAnimal,50)<.5?'M':'F',preg:0,lastBirth:-365,water:1,seed:0,seedDue:0,state:'juvenil',lastHunt:s.day,mother:[0,3,4].includes(a.sp)?a.id:null}}
function developNests(s,newborn){let keep=[];for(let e of s.nests){let c=s.cells[e.pos],p=P[e.sp];let wet=c.water/c.cap;let viable=s.faunaMode!=='none'&&c.surface<8&&wet>(e.sp===2?.035:.06)&&wet<.97;let cost=Math.min(e.c,e.c*.00012*(viable?1:2));e.c-=cost;s.ledger.carbonOut+=cost;e.stress=Math.max(0,e.stress+(viable?-.25:.5));if(viable)e.left-=.25;if(e.stress>55||e.c<p.base*.12||s.faunaMode==='none'){c.litter+=e.c;c.ln+=e.n;s.lifeEvents.eggLoss++;continue}if(e.left<=0){if(s.animals.filter(a=>!a.dead&&a.sp===e.sp).length+newborn.filter(a=>a.sp===e.sp).length<p.cap){newborn.push(offspring(s,e,e.c,e.n));s.lifeEvents.hatched++;s.animalEvents.births[e.sp]++;}else keep.push(e)}else keep.push(e)}s.nests=keep}
const MEMORY_CAP=24;
const COGNITION_COUNTS={alarms:0,alarmResponses:0,selfGrooming:0,socialGrooming:0,yielding:0,maternalGuard:0};
const cognitionEvents=s=>s.cognitionEvents??={...COGNITION_COUNTS};
function initLemur(s,a){
  const identity={seed:s.seed,step:0};
  a.personality??={
    caution:rand(identity,a.id,106),
    exploration:rand(identity,a.id,107),
    sociability:rand(identity,a.id,108)
  };
  a.hygiene??=.15+.2*rand(identity,a.id,109);
  // Older mothers reused father for the sire of a later pregnancy.
  if(!Object.hasOwn(a,'fatherId'))a.fatherId=a.sex==='M'||a.age<P[0].mature?a.father??null:null;
  a.rank=(a.age>=P[0].mature?(a.sex==='F'?2:1):0)+rand(identity,a.id,110)*.5;
  a.alarm??=null;
}
function memoryContext(s,i,kind){
  const c=s.cells[i];
  if(kind==='food')return c.sp===6&&c.phase==='fruto'&&c.fruit>0?'fruit':'leaf';
  if(kind==='shelter')return s.rain>=4?'rain':'dry';
  if(kind==='danger')return 'terrestrial';
  return 'social';
}
function memoryDuration(z){
  if(z.kind==='danger')return z.visits>=2?21:3;
  return z.visits>=2?90:30;
}
function activeMemory(s,z){
  return !!s.cells[z.i]&&s.day-z.day<=memoryDuration(z);
}
function remember(s,a,i,kind,detail={}){
  if(a.sp!==0||!s.cells[i])return;
  const context=detail.context??memoryContext(s,i,kind);
  const same=z=>z.i===i&&z.kind===kind&&(z.context??context)===context&&z.otherId===detail.otherId;
  const memory=(a.memory||[]).filter(z=>activeMemory(s,z));
  const old=memory.find(same);
  const experienced=old?.experienced??old?.day??s.day;
  // Repeated evaluation of the same event cannot consolidate it.
  const newExperience=!old||s.day-experienced>=1;
  const visits=Math.min(6,(old?.visits??(old?1:0))+(newExperience?1:0));
  const sensed=detail.quality??(kind==='food'?vegetation(s,a,i):kind==='shelter'?shelter(s,a,i):0);
  const quality=old&&newExperience?.6*sensed+.4*(old.quality??sensed):sensed;
  const record={i,kind,day:s.day,quality,context,visits,experienced:newExperience?s.day:experienced};
  if(detail.otherId!=null)record.otherId=detail.otherId;
  const kept=memory.filter(z=>!same(z));
  kept.push(record);
  // Frequent observations cannot crowd out all consolidated records.
  if(kept.length>MEMORY_CAP){
    const transient=kept.findIndex(z=>!(z.visits>=2));
    kept.splice(transient>=0?transient:0,1);
  }
  a.memory=kept;
}
function dangerRisk(s,a,i){
  let risk=0;
  for(const z of a.memory||[]){
    if(z.kind!=='danger'||!activeMemory(s,z)||distance(s,i,z.i)>1)continue;
    const age=s.day-z.day;
    risk=Math.max(risk,age<3?1:.55*(1-age/21));
  }
  return risk;
}
function memoryTarget(s,a,sites){
  let best=-1,score=0;
  for(const z of a.memory||[]){
    if(z.kind!=='food'||!activeMemory(s,z)||!compatible(s,a,z.i))continue;
    // A patch in sensory range must still offer food. Distant choices rely on memory.
    // Older worlds recorded no food context. Honor those hints until expiry.
    if(z.context&&sites.includes(z.i)&&vegetation(s,a,z.i)<=0)continue;
    const q=(z.quality||.001)*(1+.15*(z.visits||0))/
      (1+distance(s,a.pos,z.i)+.1*(s.day-z.day));
    if(q>score){best=z.i;score=q}
  }
  if(best<0)return -1;
  const choices=sites.filter(i=>distance(s,i,best)<distance(s,a.pos,best)&&dangerRisk(s,a,i)<.6);
  return choices.sort((x,y)=>distance(s,x,best)-distance(s,y,best)||x-y)[0]??-1;
}
function explore(s,a,sites){
  const safe=sites.filter(i=>dangerRisk(s,a,i)<.3+.4*(1-a.personality.caution)&&i!==a.pos);
  const choices=(safe.length?safe:sites).slice().sort((x,y)=>distance(s,a.pos,x)-distance(s,a.pos,y)||x-y);
  const pick=Math.floor(rand(s,a.id,47)*choices.length*(.45+.55*a.personality.exploration));
  return choices[pick]??a.pos;
}
function parentId(a){return a.mother??a.motherId??null}
function kinship(a,b){
  const mother=parentId(a), otherMother=parentId(b);
  if(mother===b.id||otherMother===a.id||mother!=null&&mother===otherMother)return 2;
  const father=a.fatherId, otherFather=b.fatherId;
  return father===b.id||otherFather===a.id||father!=null&&father===otherFather?1:0;
}
function dependentLemur(a){return a.sp===0&&a.age<150&&a.mother!=null}
function motherOf(a,by){const mother=by.get(a.mother);return mother?.sp===a.sp&&!mother.dead?mother:null}
function preparation(s,idx){
  const events=cognitionEvents(s), detected=new Map(), heard=new Map(), families=new Map();
  const lemurs=s.animals.filter(a=>a.sp===0&&!a.dead).sort((a,b)=>a.id-b.id);
  for(const a of lemurs){
    initLemur(s,a);
    a.hygiene=Math.min(1,a.hygiene+.028+(s.rain>=4?.014:0));
    a.nursing=0;
    a.yieldedTo=null;
    a.careId=null;
    a.alarm=null;
    if(dependentLemur(a)){
      const mother=motherOf(a,idx.byId);
      if(mother&&!families.has(mother.id))families.set(mother.id,a);
    }
  }
  if(s.faunaMode==='none'||s.faunaMode==='noFossa')return {detected,heard,families};
  // Snapshot callers and recipients before any agent moves this tick.
  for(const a of lemurs){
    if(a.age<150)continue;
    const predators=idx.near(idx.A,nearbyCells(s,a.pos,a.personality.caution>.82?2:1),z=>!z.dead&&z.sp===3)
      .sort((x,y)=>distance(s,a.pos,x.pos)-distance(s,a.pos,y.pos)||x.id-y.id);
    if(!predators.length)continue;
    const origin=predators[0].pos;
    detected.set(a.id,predators.map(z=>z.pos));
    const call={kind:'predador terrestre',source:a.id,origin,until:s.day+.25};
    a.alarm=call;
    events.alarms++;
    for(const b of lemurs){
      if(a===b||b.age<150||distance(s,a.pos,b.pos)>4)continue;
      const previous=heard.get(b.id);
      if(!previous||distance(s,b.pos,origin)<distance(s,b.pos,previous.origin))heard.set(b.id,call);
    }
  }
  return {detected,heard,families};
}
function flee(s,a,idx,sites,positions,call,ward){
  for(const i of positions)remember(s,a,i,'danger',{context:'terrestrial'});
  const safety=i=>Math.min(...positions.map(pos=>distance(s,pos,i)))+
    (a.sp===0?shelter(s,a,i)*(ward?1.1:.5)-dangerRisk(s,a,i)*a.personality.caution:0);
  sites.sort((x,y)=>safety(y)-safety(x)||distance(s,a.pos,x)-distance(s,a.pos,y)||x-y);
  if(sites.length)idx.move(a,sites[0]);
  a.state=call?'fuga por alerta':'fuga do predador';
  if(call){
    a.alarm={...call};
    cognitionEvents(s).alarmResponses++;
  }
  if(ward)cognitionEvents(s).maternalGuard++;
  s.animalEvents.fled++;
}
function forageLemur(s,a,idx,sites,ward){
  let best=a.pos,score=0,blockedScore=0,blockedBy=null;
  const peers=a.age>=P[0].mature?idx.near(idx.A,options(s,a,2),z=>
    z.sp===0&&!z.dead&&z.age>=P[0].mature&&z.rank>a.rank&&z.c<P[0].base*1.45)
    .sort((x,y)=>y.rank-x.rank||x.id-y.id):[];
  for(const i of sites){
    const food=vegetation(s,a,i);
    if(food<=0)continue;
    const risk=dangerRisk(s,a,i);
    const preference=ward?.65:.3+.55*a.personality.caution;
    const value=food*(1-risk*preference)/(1+.12*distance(s,a.pos,i));
    const dominant=s.cells[i].fruit>0&&a.c>P[0].base*.55&&
      peers.find(z=>distance(s,z.pos,i)<=1);
    if(dominant){
      if(value>blockedScore){blockedScore=value;blockedBy=dominant.id}
      continue;
    }
    if(value>score){best=i;score=value}
  }
  if(blockedScore>score){
    a.yieldedTo=blockedBy;
    cognitionEvents(s).yielding++;
    if(score<=0){a.state='cedendo alimento';return}
  }
  if(score<=0&&sites.length){
    const target=memoryTarget(s,a,sites);
    best=target>=0?target:explore(s,a,sites);
  }
  idx.move(a,best);
  a.state='buscando alimento';
  vegetation(s,a,best,true);
}
function nursing(s,a,mother,p){
  const scale=a.sp===0?1-.82*Math.max(0,a.age-42)/108:1;
  const milk=Math.min(Math.max(0,mother.c-p.base*.55),p.met*.25*1.6*scale);
  const milkN=Math.min(mother.n,milk*.08);
  mother.c-=milk;
  mother.n-=milkN;
  a.c+=milk;
  a.n+=milkN;
  if(a.sp!==0)a.water=Math.min(1,a.water+.008);
  if(milk<=0)return;
  s.lifeEvents.nursed++;
  if(a.sp===0){
    const hydration=Math.min(1-a.water,.008*scale,Math.max(0,mother.water-.35));
    a.water+=hydration;
    mother.water-=hydration;
    a.nursing=milk;
  }
}
function groomingReady(a){
  return a.age>=150&&['repouso','abrigado'].includes(a.state)&&!a.canopy&&
    a.careId==null&&!a.alarm&&a.water>=.72&&a.c>P[0].base*.9;
}
function groom(s,lemurs,groups,detail){
  const events=cognitionEvents(s);
  for(const a of lemurs){
    if(!groomingReady(a)||a.grooming||a.hygiene<.62)continue;
    if(detail&&!detail(a)&&(s.step+a.id)%4!==0)continue;
    const bond=b=>kinship(a,b)+.15*b.personality.sociability+
      (a.memory||[]).reduce((sum,z)=>sum+(z.kind==='social'&&z.otherId===b.id?.12*z.visits:0),0);
    const partners=groups.get(a.pos).filter(b=>b!==a&&groomingReady(b)&&!b.grooming&&b.hygiene>=.4);
    partners.sort((x,y)=>bond(y)-bond(x)||y.rank-x.rank||x.id-y.id);
    const b=partners[0];
    if(!b||(!kinship(a,b)&&rand(s,a.id,111)>.45+.55*a.personality.sociability))continue;
    // Direction alternates on subsequent encounters so partners can reciprocate.
    const visits=(a.memory||[]).filter(z=>z.kind==='social'&&z.otherId===b.id)
      .reduce((sum,z)=>sum+z.visits,0);
    const [giver,receiver]=visits%2?[b,a]:[a,b];
    giver.grooming='giving';
    receiver.grooming='receiving';
    giver.state='higiene social';
    receiver.state='recebendo higiene';
    a.groomingId=a.socialId=b.id;
    b.groomingId=b.socialId=a.id;
    giver.hygiene=Math.max(0,giver.hygiene-.24);
    receiver.hygiene=Math.max(0,receiver.hygiene-.55);
    remember(s,a,a.pos,'social',{otherId:b.id});
    remember(s,b,b.pos,'social',{otherId:a.id});
    events.socialGrooming++;
  }
  for(const a of lemurs){
    if(!groomingReady(a)||a.hygiene<.78)continue;
    a.grooming='self';
    a.state='higiene individual';
    a.hygiene=Math.max(0,a.hygiene-.48);
    events.selfGrooming++;
  }
}
function family(s,options={}){
  const by=new Map(s.animals.map(a=>[a.id,a]));
  const interact=options.interactions!==false;
  const lemurs=s.animals.filter(a=>a.sp===0&&!a.dead).sort((a,b)=>a.id-b.id);
  for(const a of lemurs){
    initLemur(s,a);
    a.memory=(a.memory||[]).filter(z=>activeMemory(s,z)).slice(-MEMORY_CAP);
    a.carryId=null;
    a.carriedBy=null;
    a.attachment=null;
    a.careId=null;
    if(interact){
      a.socialId=null;
      a.canopy=false;
      a.grooming=null;
      a.groomingId=null;
    }
  }
  for(const a of lemurs){
    if(!dependentLemur(a))continue;
    const mother=motherOf(a,by);
    if(!mother)continue;
    a.pos=mother.pos;
    mother.careId??=a.id;
    if(interact&&a.age>=56){
      if(mother.state==='comendo fruit'||mother.state==='comendo leaf'){
        remember(s,a,a.pos,'food',{context:mother.state==='comendo fruit'?'fruit':'leaf'});
      }else if(mother.state==='abrigado'||mother.state==='vigilância materna'){
        remember(s,a,a.pos,'shelter');
      }
    }
    if(a.age<14)a.attachment='ventral';
    else if(a.age<84&&mother.carryId===null){
      a.attachment='dorsal';
      mother.carryId=a.id;
      a.carriedBy=mother.id;
    }else a.attachment='following';
  }
  if(!interact)return;
  const groups=new Map();
  for(const a of lemurs){
    if(!groups.has(a.pos))groups.set(a.pos,[]);
    groups.get(a.pos).push(a);
    if(a.age<150||a.state!=='abrigado'||a.careId!==null)continue;
    const c=s.cells[a.pos];
    a.canopy=!!(c.b>.25&&[0,1,2,5,6].includes(c.sp)&&!c.channel&&c.surface<3&&rand(s,a.id,94)<.42);
    if(a.canopy)remember(s,a,a.pos,'shelter');
  }
  groom(s,lemurs,groups,options.detailed);
  const canRestTogether=a=>a.age>=150&&a.state==='repouso'&&a.socialId===null&&
    a.careId===null&&a.water>=.68&&a.c>=P[0].base*.85;
  for(const a of lemurs){
    if(!canRestTogether(a))continue;
    const b=groups.get(a.pos).find(z=>z!==a&&canRestTogether(z));
    if(b){a.socialId=b.id;b.socialId=a.id}
  }
}
function tick(s,detailOptions={}){let before=totals(s),prev={...s.ledger};I.tick(s);let idx=index(s);const cognition=preparation(s,idx);let hour=(s.step-1)%4,day=s.day%365,ev=s.animalEvents;let newborn=[];for(let z of s.carcasses){let c=s.cells[z.pos],loss=z.c*.006,n=z.n*.006;z.c-=loss;z.n-=n;c.litter+=loss;c.ln+=n;z.age+=.25;if(z.age>45||z.c<.0001){c.litter+=z.c;c.ln+=z.n;z.c=z.n=0}}s.carcasses=s.carcasses.filter(z=>z.c>0);developNests(s,newborn);for(let a of s.animals){if(a.dead)continue;let p=P[a.sp],c=s.cells[a.pos];a.age+=.25;a.state='repouso';if(a.seed&&s.day>=a.seedDue)deposit(s,a);if(s.faunaMode==='none'||s.faunaMode==='noFossa'&&a.sp===3){die(s,a);continue}let dependent=(a.sp===0&&a.age<150||a.sp===3&&a.age<100||a.sp===4&&a.age<35)&&a.mother!=null;if(dependent){let mother=motherOf(a,idx.byId);if(mother){idx.move(a,mother.pos);c=s.cells[a.pos];nursing(s,a,mother,p);a.state='cuidado materno'}else{if(!a.orphan){s.lifeEvents.orphaned++;a.orphan=true}a.state='órfão'}}let torpor=a.sp===4&&a.age>=p.mature&&!a.preg&&!dependent&&!s.animals.some(z=>!z.dead&&z.mother===a.id&&z.age<35)&&day>=135&&day<=260&&a.water>.35&&a.c>p.base*.4&&shelter(s,a,a.pos)>.06&&c.water/c.cap<.5;let met=Math.min(a.c,p.met*.25*(torpor?.35:1)*(s.temp>30?1.2:1)*(dependent?.55:1));a.c-=met;s.ledger.carbonOut+=met;a.water=Math.max(0,a.water-(a.sp===2?.00035:.005)*(torpor?.4:1)*(s.temp>30?1.5:1));if(a.c<p.base*.10||a.age>p.age||a.water<=0){die(s,a,a.water<=0?'sede':a.age>p.age?'idade':'fome');continue}if(dependent&&!(a.sp===0&&a.age>=56&&a.orphan)){if(a.sp===0&&a.age>=56&&(hour===1||hour===2)&&a.c<p.base*.7)vegetation(s,a,a.pos,true);continue;}let sites=options(s,a,a.sp===3?3:4);if(torpor){a.state='torpor';s.behaviorEvents.torpor++;continue;}if(c.surface>=8){if(sites.length){idx.move(a,sites[0]);a.state='fuga da inundação'}else if(rand(s,a.id,91)<.10)die(s,a,'inundacao');continue}const ward=cognition.families.get(a.id);
if(a.sp===0||a.sp===4){
  const nearby=s.faunaMode==='noFossa'?[]:idx.near(idx.A,nearbyCells(s,a.pos,1),z=>!z.dead&&z.sp===3).map(z=>z.pos);
  const seen=cognition.detected.get(a.id)||nearby;
  const call=a.sp===0&&cognition.heard.get(a.id);
  if(seen.length||call){flee(s,a,idx,sites,seen.length?seen:[call.origin],seen.length?null:call,ward);continue}
}
if(a.water<.68){let wet=sites.map(i=>({i,src:s.cells[i].surface>.12?i:[i-E.W,i+E.W,...(s.cells[i].x>0?[i-1]:[]),...(s.cells[i].x<E.W-1?[i+1]:[])].filter(j=>s.cells[j]?.channel&&s.cells[j].surface>.12).sort((a,b)=>a-b)[0]??-1})).filter(t=>t.src>=0);if(wet.length){let t=wet[0];idx.move(a,t.i);c=s.cells[t.i];let src=s.cells[t.src],w=Math.min(src.surface,.035);src.surface-=w;s.ledger.waterOut+=w;a.water=Math.min(1,a.water+w*8);a.state='bebendo'}else if(sites.length){let target=sites.sort((x,y)=>Math.abs(s.cells[x].x-19)-Math.abs(s.cells[y].x-19))[0];if(a.sp!==2)idx.move(a,target);else if(a.water<.35){let best=sites.sort((x,y)=>s.cells[y].water/s.cells[y].cap-s.cells[x].water/s.cells[x].cap)[0];if(best!==undefined)idx.move(a,best);}a.state='procurando água'}}
sites=options(s,a,a.sp===3?3:4);let active=[3,4].includes(a.sp)?hour===0||hour===3:hour===1||hour===2;if(!active&&a.state==='repouso'&&a.water>=.68){let rest=restSite(s,a,sites,ward);if(rest>=0){idx.move(a,rest);a.state=ward&&s.rain>=4?'vigilância materna':'abrigado';if(a.state==='vigilância materna')cognitionEvents(s).maternalGuard++;remember(s,a,rest,'shelter');s.behaviorEvents.shelterRest++}}
if((active)&&(a.c<p.base*1.45||(a.sp===0||a.sp===2)&&a.water<.9)){if(a.sp===0){forageLemur(s,a,idx,sites,ward)}else if(a.sp===2){let best=a.pos,score=vegetation(s,a,best);for(let i of sites){let v=vegetation(s,a,i)/(1+distance(s,a.pos,i)*.12);if(v>score){best=i;score=v}}if(score<=0&&sites.length){let target=-1,quality=0;for(let j=0;j<s.cells.length;j++){if(!compatible(s,a,j))continue;let q=vegetation(s,a,j)/(1+distance(s,a.pos,j));if(q>quality){quality=q;target=j}}best=target>=0?sites.sort((x,y)=>distance(s,x,target)-distance(s,y,target))[0]:sites[Math.floor(rand(s,a.id,47)*sites.length)];}idx.move(a,best);a.state='buscando alimento';vegetation(s,a,best,true)}else{let carrion=a.sp===3?s.carcasses.filter(z=>sites.includes(z.pos)).sort((x,y)=>distance(s,a.pos,x.pos)-distance(s,a.pos,y.pos))[0]:null;if(carrion&&carrion.c>0){idx.move(a,carrion.pos);let C=Math.min(carrion.c,p.meal),N=carrion.n*C/carrion.c;carrion.c-=C;carrion.n-=N;assimilate(s,a,s.cells[a.pos],C,N,'lemur');a.state='consumindo carcaça'}else{let prey=a.sp===1||a.sp===4?idx.near(idx.I,sites,z=>idx.live.has(z.id)&&(a.sp===4||z.sp!==3)):idx.near(idx.A,sites,z=>(z.sp===0||z.sp===4)&&!z.dead);s.behaviorEvents.localQueries++;prey.sort((x,y)=>(1+distance(s,a.pos,x.pos))/territory(s,a,x.pos,idx)-(1+distance(s,a.pos,y.pos))/territory(s,a,y.pos,idx)||x.id-y.id);let target=prey[0];if(a.sp===3&&target&&territory(s,a,target.pos,idx)<1&&a.c>p.base*.5){s.behaviorEvents.territoryAvoid++;target=null;}if(target){idx.move(a,target.pos);a.state='caçando';if(s.day-a.lastHunt>=(a.sp===1?3:a.sp===4?2:65)&&rand(s,a.id,81)<(a.sp===1?.22:a.sp===4?.20:.055))hunt(s,a,target,idx)}else if(sites.length){let fruit=a.sp===4?sites.filter(i=>vegetation(s,a,i)>0).sort((x,y)=>vegetation(s,a,y)-vegetation(s,a,x))[0]:undefined;if(fruit!==undefined){idx.move(a,fruit);if(vegetation(s,a,fruit,true)>0)s.behaviorEvents.fruitFallback++;}else{let preferred=sites.filter(i=>territory(s,a,i,idx)===1);if(preferred.length&&preferred.length<sites.length)s.behaviorEvents.territoryAvoid++;let choices=preferred.length?preferred:sites;idx.move(a,choices[Math.floor(rand(s,a.id,48)*choices.length)]);a.state='buscando presa'}}}}}
if(a.preg>0){a.preg=Math.max(0,a.preg-.25);if(a.preg===0&&a.c>p.base*.75&&a.n>p.base*.025&&s.animals.filter(z=>!z.dead&&z.sp===a.sp).length+newborn.filter(z=>z.sp===a.sp).length+s.nests.filter(z=>z.sp===a.sp).length<p.cap){let C=p.base*.35,N=C*.08;a.c-=C;a.n-=N;a.lastBirth=s.day;if(a.sp===1||a.sp===2){s.nests.push({sp:a.sp,pos:a.pos,c:C,n:N,left:a.sp===1?240:180,stress:0,father:a.conceptionFather??a.father??null,motherId:a.id,parentsGenes:a.parentsGenes??null});s.lifeEvents.laid++}else{newborn.push(offspring(s,a,C,N));ev.births[a.sp]++}}}else if(a.sex==='F'&&a.age>=p.mature&&a.c>p.base*1.1&&day>=p.season[0]&&day<=p.season[1]&&s.day-a.lastBirth>365&&idx.near(idx.A,options(s,a,4),z=>!z.dead&&z.sp===a.sp&&z.sex==='M'&&z.age>=p.mature).length>0&&rand(s,a.id,52)<.04){a.preg=(a.sp===1?35:a.sp===2?45:p.gest);const mates=idx.near(idx.A,options(s,a,4),z=>!z.dead&&z.sp===a.sp&&z.sex==='M'&&z.age>=p.mature);const dad=mates[0];a.conceptionFather=dad?.id??null;a.parentsGenes=a.genes&&dad?.genes?[a.genes,dad.genes]:null;}}
s.animals=s.animals.filter(a=>!a.dead).concat(newborn);family(s,detailOptions);if(s.step%4===0){s.animalHistory.push({day:s.day,...metrics(s)});if(s.animalHistory.length>365)s.animalHistory.shift()}let after=totals(s),L=s.ledger;s.last={waterError:after.w-before.w-(L.waterIn-prev.waterIn)+(L.waterOut-prev.waterOut),nError:after.n-before.n+(L.nOut-prev.nOut),cError:after.c-before.c-(L.carbonIn-prev.carbonIn)+(L.carbonOut-prev.carbonOut)};return s}
function metrics(s){let count=Array(P.length).fill(0);for(let a of s.animals)count[a.sp]++;return{count,total:s.animals.length,nests:s.nests.length,juveniles:s.animals.filter(a=>a.age<P[a.sp].mature).length}}
return {P,create,tick,totals,metrics,edit:I.edit,index,shelter,territory,remember,memoryTarget,family};})();if(typeof module!=='undefined')module.exports=Vertebrates;