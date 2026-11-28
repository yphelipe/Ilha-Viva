import {stepSoil} from './soil_cell.mjs';
import {profile,weather,surfaceEvaporation} from './world.mjs';
import {experience} from './adaptive_agents.mjs';
import {foodTotals,foodChoice,allocateFood,metabolism,harvestFoodWorld} from './food_world.mjs';
import {initFactors,decodeFactorsBase,factorReportBase,fertilityProfile} from './microbiology.mjs';
export const floraParams={"grassCN":28,"legumeCN":18,"grassRate":0.014,"legumeRate":0.011,"initialLegumeFraction":0.25,"fixationMaxKgNHaYr":100,"fixationCost":8,"capacityC":0.65,"nodulationRate":0.04};
function floraFertLedger(){return {depositionN:0,wetN:0,otherN:0,uptakeC:0,soilRespC:0,agentRespC:0,leachN:0,protectedC:0,protectedN:0,releasedC:0,releasedN:0}}
function floraWorldAdvance(world,override=null,reverse=false,fixation=true){
  const {w,h,cells}=world,cl=override||weather(world.day,world.seed);
  const next=cells.map(c=>({z:c.z,soil:null,surface:0}));
  const ledger={precipitation:0,evap:0,soilEvap:0,surfaceEvap:0,transpiration:0,drainage:0,outflow:0,carbonUptake:0,respiredC:0,leachedN:0,routed:0,fixedN:0,fixCostC:0};
  const order=Array.from({length:cells.length},(_,i)=>reverse?cells.length-1-i:i);
  const transfers=[];
  for(const i of order){
    const c=cells[i],x=i%w,y=Math.floor(i/w),tempC=cl.tempC-(c.z-650)*.0065;
    const s={...c.soil};
    const intake=tempC>0?Math.min(c.surface,Math.max(0,110-s.water),15):0;
    s.water+=intake;
    const {state,flux}=groupedSoil(s,{rainMm:cl.rainMm,tempC,light:cl.light},fixation);
    next[i].soil=state;
    for(const k of ["precipitation","evap","soilEvap","transpiration","drainage","carbonUptake","respiredC","leachedN","fixedN","fixCostC"])ledger[k]+=flux[k];
    const pooled=c.surface-intake+flux.runoff;
    const surfaceLoss=surfaceEvaporation(pooled,tempC,cl.light);
    ledger.surfaceEvap+=surfaceLoss;ledger.evap+=surfaceLoss;
    const available=pooled-surfaceLoss;
    let target=-1,best=c.z;
    for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=w||ny>=h)continue;const j=ny*w+nx;if(cells[j].z<best){best=cells[j].z;target=j}}
    const edge=x===0||y===0||x===w-1||y===h-1;
    const flow=target>=0?available*.65:edge?available*.65:0;
    next[i].surface=available-flow;
    transfers.push({i,target,flow});
  }
  // Canonical order of accumulation makes reverse traversal produce identical states.
  transfers.sort((a,b)=>a.i-b.i);
  for(const {target,flow} of transfers){if(target>=0){next[target].surface+=flow;ledger.routed+=flow}else ledger.outflow+=flow}
  return {...world,day:world.day+1,cells:next,last:{climate:cl,ledger}};
}
function floraFoodAdvance(sim,override=null){
 const w=floraWorldAdvance(sim.world,override,false,sim.factors.fixation),area=profile.cellM**2,disturbances=sim.disturbances.filter(e=>e.until>w.day);
 const plans=sim.agents.filter(a=>a.alive).map(a=>{const choice=foodChoice(a,w),cost=metabolism.maintenance+(choice.cell===a.pos?0:metabolism.moveCost),demand=Math.min(metabolism.maxIntake,Math.max(0,(metabolism.reserveMax-a.reserveC+cost)/metabolism.assimilation));return {id:a.id,cell:choice.cell,choice,cost,demand}});
 const map=new Map(plans.map(p=>[p.id,p])),allocation=allocateFood(w,plans);for(const c of w.cells)reconcilePlants(c.soil);
 const daily={eatenC:0,eatenN:0,respiredC:0,litterC:0,litterN:0,deaths:0,harvestC:0,harvestN:0};
 const agents=sim.agents.map(a=>{if(!a.alive)return a;const p=map.get(a.id),f=allocation.get(a.id),b=experience(a,w,p.choice,disturbances),s=w.cells[p.cell].soil;
  const assimilated=Math.min(f.C*metabolism.assimilation,metabolism.reserveMax-a.reserveC+p.cost);
  const available=a.reserveC+assimilated,resp=Math.min(p.cost,available),reserve=available-resp;
  let litterC=f.C-assimilated,litterN=f.N;
  const deficit=resp+1e-12<p.cost?a.deficitDays+1:0,alive=deficit<metabolism.starveDays;
  if(!alive){litterC+=a.bodyC+reserve;litterN+=a.bodyN;daily.deaths++}
  s.litterC+=litterC/area;s.litterN+=litterN/area;
  daily.eatenC+=f.C;daily.eatenN+=f.N;daily.respiredC+=resp;daily.litterC+=litterC;daily.litterN+=litterN;
  return {...b,alive,reserveC:alive?reserve:0,bodyC:alive?a.bodyC:0,bodyN:alive?a.bodyN:0,deficitDays:deficit,consumedC:a.consumedC+f.C,consumedN:a.consumedN+f.N,deathDay:alive?null:w.day,feeding:{day:w.day,foodC:f.C,foodN:f.N,respiredC:resp,demand:p.demand}};
 });
 const foodLedger=Object.fromEntries(Object.keys(daily).map(k=>[k,sim.foodLedger[k]+daily[k]]));
 return {...sim,world:w,agents,disturbances,foodLedger,dailyFood:daily};
}
function floraFactorAdvance(sim,override=null){
 const cl=override||weather(sim.world.day,sim.world.seed),area=profile.cellM**2,annualRain=profile.precipMm.reduce((a,b)=>a+b,0),p=fertilityProfile;
 const daily=floraFertLedger();
 const cells=sim.world.cells.map(c=>{
  const s={...c.soil},temp=cl.tempC-(c.z-650)*.0065,moisture=Math.min(1,s.water/75),thermal=Math.max(0,Math.min(1,(temp+2)/22)),activity=moisture*thermal;
  const wet=sim.factors.deposition?p.wetInorganicKgNHaYr/10000*cl.rainMm/annualRain:0,other=sim.factors.deposition?p.otherKgNHaYr/10000/365:0;
  // Snow deposition is stored in soil mineral pool immediately in this abstraction.
  s.mineralN+=wet+other;daily.wetN+=wet*area;daily.otherN+=other*area;daily.depositionN+=(wet+other)*area;
  const release=sim.factors.protection?p.stableReleasePerDay*activity:0;
  const rc=s.stableC*release,rn=s.stableN*release;s.stableC-=rc;s.stableN-=rn;s.litterC+=rc;s.litterN+=rn;daily.releasedC+=rc*area;daily.releasedN+=rn*area;
  return {...c,soil:s};
 });
 const next=floraFoodAdvance({...sim,world:{...sim.world,cells}},cl);
 for(const c of next.world.cells){
  const s=c.soil,temp=cl.tempC-(c.z-650)*.0065,activity=Math.min(1,s.water/75)*Math.max(0,Math.min(1,(temp+2)/22));
  const f=sim.factors.protection?p.stableTransferPerDay*activity:0,C=s.litterC*f,N=s.litterN*f;s.litterC-=C;s.litterN-=N;s.stableC+=C;s.stableN+=N;daily.protectedC+=C*area;daily.protectedN+=N*area;
 }
 const l=next.world.last.ledger;daily.uptakeC=l.carbonUptake*area;daily.soilRespC=l.respiredC*area;daily.leachN=l.leachedN*area;daily.agentRespC=next.dailyFood.respiredC;
 const ledger=Object.fromEntries(Object.keys(daily).map(k=>[k,sim.fertilityLedger[k]+daily[k]]));
 return {...next,fertilityLedger:ledger,dailyFertility:daily};
}
function plantClamp(x){return Math.max(0,Math.min(1,x))}
export function initFlora(w=32,h=24,seed=4801,count=6,fixation=true,fraction=.25){
 if(!Number.isFinite(fraction)||fraction<0||fraction>1)throw Error("invalid fraction");
 const s=initFactors(w,h,seed,count,{deposition:true,protection:true,initialPool:true,fixation});
 for(const c of s.world.cells){const q=c.soil;q.legumeCarbon=q.plantC*fraction;q.grassCarbon=q.plantC-q.legumeCarbon;q.legumeNitrogen=q.plantN*fraction;q.grassNitrogen=q.plantN-q.legumeNitrogen;q.nodulation=0}
 return {...s,floraSchema:1,floraLedger:{fixedN:0,fixCostC:0},dailyFlora:{fixedN:0,fixCostC:0}};
}
export function groupedSoil(state,cl,fixation){
 const p=floraParams;
 // The grouped pools handle plant metabolism below and still shade and transpire here.
 const {state:s,flux}=stepSoil({...state,plantC:0,plantN:0},cl,state.grassCarbon+state.legumeCarbon);
 const wet=plantClamp(s.water/75),oxygen=plantClamp((115-s.water)/40),thermal=plantClamp((cl.tempC+2)/22)*plantClamp((42-cl.tempC)/17),activity=wet*oxygen*thermal;
 for(const g of ["grass","legume"]){
  const C=g+"Carbon",N=g+"Nitrogen",turn=plantClamp((g==="grass"?.002:.003)+.015*(1-wet)+(cl.tempC<=0?.005:0)),fallenC=s[C]*turn,fallenN=s[N]*turn;
  s[C]-=fallenC;s[N]-=fallenN;s.litterC+=fallenC;s.litterN+=fallenN;
  const respiration=s[C]*.006*thermal;s[C]-=respiration;flux.respiredC+=respiration;flux.detritusC+=fallenC;
 }
 const space=plantClamp(1-(s.grassCarbon+s.legumeCarbon)/p.capacityC),inhibition=1/(1+s.mineralN/.002);
 const nodeTarget=fixation&&s.legumeCarbon>1e-12?activity*inhibition:0;
 s.nodulation=plantClamp(s.nodulation+(nodeTarget-s.nodulation)*p.nodulationRate);
 const grossG=p.grassRate*cl.light*activity*space*plantClamp(s.grassCarbon/.08),grossL=p.legumeRate*cl.light*activity*space*plantClamp(s.legumeCarbon/.06);
 const demandG=grossG/p.grassCN,demandL=grossL/p.legumeCN,scale=demandG+demandL>0?Math.min(1,s.mineralN/(demandG+demandL)):0,ng=demandG*scale,nl=demandL*scale;
 const fix=fixation?Math.min(p.fixationMaxKgNHaYr/10000/365*plantClamp(s.legumeCarbon/.12)*s.nodulation*cl.light*activity,(demandL-nl)/(1+p.fixationCost/p.legumeCN)):0;
 const cost=fix*p.fixationCost,growthG=ng*p.grassCN,growthL=(nl+fix)*p.legumeCN;
 s.mineralN=Math.max(0,s.mineralN-ng-nl);s.grassCarbon+=growthG;s.grassNitrogen+=ng;s.legumeCarbon+=growthL;s.legumeNitrogen+=nl+fix;
 s.plantC=s.grassCarbon+s.legumeCarbon;s.plantN=s.grassNitrogen+s.legumeNitrogen;
 flux.carbonUptake+=growthG+growthL+cost;flux.respiredC+=cost;flux.fixedN=fix;flux.fixCostC=cost;
 return {state:s,flux};
}
function reconcilePlants(s){
 const c=s.grassCarbon+s.legumeCarbon,n=s.grassNitrogen+s.legumeNitrogen;
 const rc=c>0?s.plantC/c:0,rn=n>0?s.plantN/n:0;
 s.grassCarbon*=rc;s.legumeCarbon*=rc;s.grassNitrogen*=rn;s.legumeNitrogen*=rn;
 s.plantC=s.grassCarbon+s.legumeCarbon;s.plantN=s.grassNitrogen+s.legumeNitrogen;
}
export function floraAdvance(s,override=null){
 const n=floraFactorAdvance(s,override),area=profile.cellM**2,l=n.world.last.ledger,daily={fixedN:l.fixedN*area,fixCostC:l.fixCostC*area};
 return {...n,floraLedger:{fixedN:s.floraLedger.fixedN+daily.fixedN,fixCostC:s.floraLedger.fixCostC+daily.fixCostC},dailyFlora:daily};
}
export function floraHarvest(s,i,fraction=.5){
 const n=harvestFoodWorld(s,i,fraction);reconcilePlants(n.world.cells[i].soil);return n;
}
export function floraReport(s){
 const r=factorReportBase(s),area=profile.cellM**2;
 const sums=s.world.cells.reduce((a,c)=>{const q=c.soil;a.grassC+=q.grassCarbon*area;a.legumeC+=q.legumeCarbon*area;a.grassN+=q.grassNitrogen*area;a.legumeN+=q.legumeNitrogen*area;a.nodulation+=q.nodulation/s.world.cells.length;return a},{grassC:0,legumeC:0,grassN:0,legumeN:0,nodulation:0});
 return {...r,...sums,floraLedger:s.floraLedger,residualN:r.residualN+s.floraLedger.fixedN};
}
export function decodeFlora(raw){
 const s=decodeFactorsBase(raw);
 if(s.floraSchema!==1||!s.factors||typeof s.factors.fixation!=="boolean"||!["fixedN","fixCostC"].every(k=>Number.isFinite(s.floraLedger?.[k])&&s.floraLedger[k]>=0))throw Error("invalid flora");
 for(const c of s.world.cells){const q=c.soil;if(!["grassCarbon","legumeCarbon","grassNitrogen","legumeNitrogen","nodulation"].every(k=>Number.isFinite(q[k])&&q[k]>=0)||q.nodulation>1||Math.abs(q.plantC-q.grassCarbon-q.legumeCarbon)>1e-10||Math.abs(q.plantN-q.grassNitrogen-q.legumeNitrogen)>1e-10)throw Error("invalid plant pools")}
 return s;
}