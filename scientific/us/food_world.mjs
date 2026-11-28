import {advance,totals,profile} from './world.mjs';
import {adjacent,rememberedRisk,experience,createSimulation,decodeSimulation} from './adaptive_agents.mjs';
// Abstract forager: synthetic coefficients, not a species model. Stocks kg C/N per agent; soil kg/m².
export const metabolism={"bodyC":0.16,"bodyN":0.02,"reserveMax":0.15,"initialReserve":0.09,"maintenance":0.018,"moveCost":0.004,"maxIntake":0.055,"assimilation":0.65,"starveDays":5};
function bounded(x){return Math.max(0,Math.min(1,x))}

export function createFoodWorld(w=32,h=24,seed=4801,count=6){
 const s=createSimulation(w,h,seed,count);
 return {...s,foodSchema:1,agents:s.agents.map(a=>({...a,alive:true,reserveC:metabolism.initialReserve,bodyC:metabolism.bodyC,bodyN:metabolism.bodyN,deficitDays:0,consumedC:0,consumedN:0,deathDay:null,feeding:null})),foodLedger:{eatenC:0,eatenN:0,respiredC:0,litterC:0,litterN:0,deaths:0,harvestC:0,harvestN:0},dailyFood:null};
}

export function foodTotals(s){
 const t=totals(s.world),area=profile.cellM**2;
 return {waterL:t.water*area,C:t.C*area+s.agents.reduce((n,a)=>n+a.bodyC+a.reserveC,0),N:t.N*area+s.agents.reduce((n,a)=>n+a.bodyN,0)};
}

export function foodChoice(a,w){
 const hunger=bounded(1-a.reserveC/metabolism.reserveMax),area=profile.cellM**2;
 return adjacent(w,a.pos).map(i=>{const c=w.cells[i],visible=bounded(c.surface/25+c.soil.snow/80),memory=rememberedRisk(a,i,w.day),food=bounded(c.soil.plantC*area/metabolism.maxIntake/4)*(1-bounded(c.soil.snow/50)),cover=bounded(c.soil.plantC/.3),cost=i===a.pos?0:.08,novelty=a.memory.some(m=>m.cell===i)?0:.025;return {cell:i,visible,memory,score:food*(.2+1.3*hunger)+cover*.15-visible*.7-memory*1.25-cost+novelty}}).sort((a,b)=>b.score-a.score||a.cell-b.cell)[0];
}

export function allocateFood(world,requests){
 const area=profile.cellM**2,byCell=new Map(),allocation=new Map();
 for(const r of requests){if(!byCell.has(r.cell))byCell.set(r.cell,[]);byCell.get(r.cell).push(r)}
 for(const [i,group] of [...byCell].sort((a,b)=>a[0]-b[0])){
  group.sort((a,b)=>a.id-b.id);const c=world.cells[i],s=c.soil;
  const total=group.reduce((n,r)=>n+r.demand,0),available=s.plantC*area*(1-bounded(s.snow/50)),taken=Math.min(total,available),ratio=s.plantC>0?s.plantN/s.plantC:0;
  for(const r of group){const C=total>0?taken*r.demand/total:0;allocation.set(r.id,{C,N:C*ratio})}
  s.plantC-=taken/area;s.plantN-=taken*ratio/area;
  if(s.plantC<0&&s.plantC>-1e-12)s.plantC=0;if(s.plantN<0&&s.plantN>-1e-12)s.plantN=0;
 }
 return allocation;
}

export function advanceFoodWorld(sim,override=null){
 const w=advance(sim.world,override),area=profile.cellM**2,disturbances=sim.disturbances.filter(e=>e.until>w.day);
 const plans=sim.agents.filter(a=>a.alive).map(a=>{const choice=foodChoice(a,w),cost=metabolism.maintenance+(choice.cell===a.pos?0:metabolism.moveCost),demand=Math.min(metabolism.maxIntake,Math.max(0,(metabolism.reserveMax-a.reserveC+cost)/metabolism.assimilation));return {id:a.id,cell:choice.cell,choice,cost,demand}});
 const map=new Map(plans.map(p=>[p.id,p])),allocation=allocateFood(w,plans);
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

export function harvestFoodWorld(sim,i,fraction=.5){
 if(!Number.isInteger(i)||i<0||i>=sim.world.cells.length||!Number.isFinite(fraction)||fraction<0||fraction>1)throw Error("invalid harvest");
 const cells=sim.world.cells.slice(),c=cells[i],soil={...c.soil},area=profile.cellM**2,C=soil.plantC*fraction,N=soil.plantN*fraction;
 soil.plantC-=C;soil.plantN-=N;cells[i]={...c,soil};
 return {...sim,world:{...sim.world,cells},foodLedger:{...sim.foodLedger,harvestC:sim.foodLedger.harvestC+C*area,harvestN:sim.foodLedger.harvestN+N*area}};
}

export function decodeFoodWorld(raw){
 const s=decodeSimulation(raw);
 if(s.foodSchema!==1||!s.foodLedger||!Object.keys(createFoodLedger()).every(k=>Number.isFinite(s.foodLedger[k])&&s.foodLedger[k]>=0))throw Error("invalid food schema");
 for(const a of s.agents){if(typeof a.alive!=="boolean"||!["reserveC","bodyC","bodyN","consumedC","consumedN"].every(k=>Number.isFinite(a[k])&&a[k]>=0)||a.reserveC>metabolism.reserveMax+1e-10||!Number.isInteger(a.deficitDays)||a.deficitDays<0||a.deficitDays>metabolism.starveDays||(a.alive?(a.deathDay!==null||a.bodyC!==metabolism.bodyC||a.bodyN!==metabolism.bodyN):(a.reserveC!==0||a.bodyC!==0||a.bodyN!==0||!Number.isInteger(a.deathDay)||a.deathDay<1||a.deathDay>s.world.day)))throw Error("invalid metabolism")}
 return s;
}

function createFoodLedger(){return {eatenC:0,eatenN:0,respiredC:0,litterC:0,litterN:0,deaths:0,harvestC:0,harvestN:0}}
