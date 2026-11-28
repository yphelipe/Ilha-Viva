import {profile,weather} from './world.mjs';
import {createFoodWorld,foodTotals,advanceFoodWorld,decodeFoodWorld} from './food_world.mjs';
export const fertilityProfile={"id":"coweeta-deposition-pilot-v1","source":"Walker et al. 2023 doi:10.5194/bg-20-971-2023; regional forest analog, not farm calibration","totalKgNHaYr":6.7,"wetInorganicKgNHaYr":3.69,"otherKgNHaYr":3.01,"stableTransferPerDay":0.0015,"stableReleasePerDay":0.00008,"initialStableFraction":0.55};
function fertLedger(){return {depositionN:0,wetN:0,otherN:0,uptakeC:0,soilRespC:0,agentRespC:0,leachN:0,protectedC:0,protectedN:0,releasedC:0,releasedN:0}}

export function initFertility(w=32,h=24,seed=4801,count=6,enabled=true){
 const sim=createFoodWorld(w,h,seed,count);
 const cells=sim.world.cells.map(c=>{const s={...c.soil},f=fertilityProfile.initialStableFraction;s.stableC=enabled?s.litterC*f:0;s.stableN=enabled?s.litterN*f:0;s.litterC-=s.stableC;s.litterN-=s.stableN;return {...c,soil:s}});
 const result={...sim,world:{...sim.world,cells},fertilitySchema:1,enabled,fertilityLedger:fertLedger(),dailyFertility:null};
 return {...result,baseline:foodTotals(result)};
}

export function fertAdvance(sim,override=null){
 const cl=override||weather(sim.world.day,sim.world.seed),area=profile.cellM**2,annualRain=profile.precipMm.reduce((a,b)=>a+b,0),p=fertilityProfile;
 const daily=fertLedger();
 const cells=sim.world.cells.map(c=>{
  const s={...c.soil},temp=cl.tempC-(c.z-650)*.0065,moisture=Math.min(1,s.water/75),thermal=Math.max(0,Math.min(1,(temp+2)/22)),activity=moisture*thermal;
  const wet=sim.enabled?p.wetInorganicKgNHaYr/10000*cl.rainMm/annualRain:0,other=sim.enabled?p.otherKgNHaYr/10000/365:0;
  // Snow deposition is stored in soil mineral pool immediately in this abstraction.
  s.mineralN+=wet+other;daily.wetN+=wet*area;daily.otherN+=other*area;daily.depositionN+=(wet+other)*area;
  const release=sim.enabled?p.stableReleasePerDay*activity:0;
  const rc=s.stableC*release,rn=s.stableN*release;s.stableC-=rc;s.stableN-=rn;s.litterC+=rc;s.litterN+=rn;daily.releasedC+=rc*area;daily.releasedN+=rn*area;
  return {...c,soil:s};
 });
 const next=advanceFoodWorld({...sim,world:{...sim.world,cells}},cl);
 for(const c of next.world.cells){
  const s=c.soil,temp=cl.tempC-(c.z-650)*.0065,activity=Math.min(1,s.water/75)*Math.max(0,Math.min(1,(temp+2)/22));
  const f=sim.enabled?p.stableTransferPerDay*activity:0,C=s.litterC*f,N=s.litterN*f;s.litterC-=C;s.litterN-=N;s.stableC+=C;s.stableN+=N;daily.protectedC+=C*area;daily.protectedN+=N*area;
 }
 const l=next.world.last.ledger;daily.uptakeC=l.carbonUptake*area;daily.soilRespC=l.respiredC*area;daily.leachN=l.leachedN*area;daily.agentRespC=next.dailyFood.respiredC;
 const ledger=Object.fromEntries(Object.keys(daily).map(k=>[k,sim.fertilityLedger[k]+daily[k]]));
 return {...next,fertilityLedger:ledger,dailyFertility:daily};
}

export function decodeFertility(raw){
 const s=decodeFoodWorld(raw);
 if(s.fertilitySchema!==1||typeof s.enabled!=="boolean"||!s.fertilityLedger||!s.baseline||!Object.keys(fertLedger()).every(k=>Number.isFinite(s.fertilityLedger[k])&&s.fertilityLedger[k]>=0)||!["waterL","C","N"].every(k=>Number.isFinite(s.baseline[k])&&s.baseline[k]>=0))throw Error("invalid fertility schema");
 for(const c of s.world.cells)if(!["stableC","stableN"].every(k=>Number.isFinite(c.soil[k])&&c.soil[k]>=0))throw Error("invalid stable pool");
 return s;
}

export function fertilityReport(s){
 const t=foodTotals(s),f=s.fertilityLedger,area=profile.cellM**2;
 return {day:s.world.day,enabled:s.enabled,total:t,stableC:s.world.cells.reduce((n,c)=>n+c.soil.stableC*area,0),stableN:s.world.cells.reduce((n,c)=>n+c.soil.stableN*area,0),deltaC:t.C-s.baseline.C,deltaN:t.N-s.baseline.N,ledger:f,residualC:s.baseline.C+f.uptakeC-f.soilRespC-f.agentRespC-s.foodLedger.harvestC-t.C,residualN:s.baseline.N+f.depositionN-f.leachN-s.foodLedger.harvestN-t.N};
}
