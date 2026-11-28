import {profile,weather} from './world.mjs';
import {createFoodWorld,foodTotals,advanceFoodWorld,decodeFoodWorld} from './food_world.mjs';
export const fertilityProfile={"id":"coweeta-deposition-pilot-v1","source":"Walker et al. 2023 doi:10.5194/bg-20-971-2023; regional forest analog, not farm calibration","totalKgNHaYr":6.7,"wetInorganicKgNHaYr":3.69,"otherKgNHaYr":3.01,"stableTransferPerDay":0.0015,"stableReleasePerDay":0.00008,"initialStableFraction":0.55};
function fertLedger(){return {depositionN:0,wetN:0,otherN:0,uptakeC:0,soilRespC:0,agentRespC:0,leachN:0,protectedC:0,protectedN:0,releasedC:0,releasedN:0}}

export function initFactors(w=32,h=24,seed=4801,count=6,factors={deposition:true,protection:true,initialPool:true,fixation:false}){
 const sim=createFoodWorld(w,h,seed,count);
 const cells=sim.world.cells.map(c=>{const s={...c.soil},f=fertilityProfile.initialStableFraction;s.stableC=factors.initialPool?s.litterC*f:0;s.stableN=factors.initialPool?s.litterN*f:0;s.litterC-=s.stableC;s.litterN-=s.stableN;return {...c,soil:s}});
 const result={...sim,world:{...sim.world,cells},fertilitySchema:1,enabled:!!factors.protection,factors:{...factors},fertilityLedger:fertLedger(),dailyFertility:null};
 return {...result,baseline:foodTotals(result)};
}

export function factorAdvance(sim,override=null){
 const cl=override||weather(sim.world.day,sim.world.seed),area=profile.cellM**2,annualRain=profile.precipMm.reduce((a,b)=>a+b,0),p=fertilityProfile;
 const daily=fertLedger();
 const cells=sim.world.cells.map(c=>{
  const s={...c.soil},temp=cl.tempC-(c.z-650)*.0065,moisture=Math.min(1,s.water/75),thermal=Math.max(0,Math.min(1,(temp+2)/22)),activity=moisture*thermal;
  const wet=sim.factors.deposition?p.wetInorganicKgNHaYr/10000*cl.rainMm/annualRain:0,other=sim.factors.deposition?p.otherKgNHaYr/10000/365:0;
  // Snow deposition is stored in soil mineral pool immediately in this abstraction.
  s.mineralN+=wet+other;daily.wetN+=wet*area;daily.otherN+=other*area;daily.depositionN+=(wet+other)*area;
  const release=sim.factors.protection?p.stableReleasePerDay*activity:0;
  const rc=s.stableC*release,rn=s.stableN*release;s.stableC-=rc;s.stableN-=rn;s.litterC+=rc;s.litterN+=rn;daily.releasedC+=rc*area;daily.releasedN+=rn*area;
  return {...c,soil:s};
 });
 const next=advanceFoodWorld({...sim,world:{...sim.world,cells}},cl);
 for(const c of next.world.cells){
  const s=c.soil,temp=cl.tempC-(c.z-650)*.0065,activity=Math.min(1,s.water/75)*Math.max(0,Math.min(1,(temp+2)/22));
  const f=sim.factors.protection?p.stableTransferPerDay*activity:0,C=s.litterC*f,N=s.litterN*f;s.litterC-=C;s.litterN-=N;s.stableC+=C;s.stableN+=N;daily.protectedC+=C*area;daily.protectedN+=N*area;
 }
 const l=next.world.last.ledger;daily.uptakeC=l.carbonUptake*area;daily.soilRespC=l.respiredC*area;daily.leachN=l.leachedN*area;daily.agentRespC=next.dailyFood.respiredC;
 const ledger=Object.fromEntries(Object.keys(daily).map(k=>[k,sim.fertilityLedger[k]+daily[k]]));
 return {...next,fertilityLedger:ledger,dailyFertility:daily};
}

export function decodeFactorsBase(raw){
 const s=decodeFoodWorld(raw);
 if(s.fertilitySchema!==1||typeof s.enabled!=="boolean"||!s.fertilityLedger||!s.baseline||!Object.keys(fertLedger()).every(k=>Number.isFinite(s.fertilityLedger[k])&&s.fertilityLedger[k]>=0)||!["waterL","C","N"].every(k=>Number.isFinite(s.baseline[k])&&s.baseline[k]>=0))throw Error("invalid fertility schema");
 for(const c of s.world.cells)if(!["stableC","stableN"].every(k=>Number.isFinite(c.soil[k])&&c.soil[k]>=0))throw Error("invalid stable pool");
 return s;
}

export function factorReportBase(s){
 const t=foodTotals(s),f=s.fertilityLedger,area=profile.cellM**2;
 return {day:s.world.day,enabled:s.enabled,total:t,stableC:s.world.cells.reduce((n,c)=>n+c.soil.stableC*area,0),stableN:s.world.cells.reduce((n,c)=>n+c.soil.stableN*area,0),deltaC:t.C-s.baseline.C,deltaN:t.N-s.baseline.N,ledger:f,residualC:s.baseline.C+f.uptakeC-f.soilRespC-f.agentRespC-s.foodLedger.harvestC-t.C,residualN:s.baseline.N+f.depositionN-f.leachN-s.foodLedger.harvestN-t.N};
}

export const fixationProfile={"hostFraction":0.25,"maxKgNHaYear":100,"costKgCPerKgN":8,"hostTargetCN":18,"nonHostTargetCN":25,"mineralInhibitionKgM2":0.002,"source":"UGA white clover 100–150 lb N/acre/year vigorous stand; model ceiling 100 kg/ha/year illustrative, not calibrated"};
function fixClamp(v){return Math.max(0,Math.min(1,v))}

export function fixationCell(s,cl,hostFraction,p=fixationProfile){
 const n={...s}, thermal=fixClamp((cl.tempC-5)/15)*fixClamp((38-cl.tempC)/10),moist=fixClamp(s.water/45)*fixClamp((115-s.water)/40),inhib=1/(1+s.mineralN/p.mineralInhibitionKgM2);
 const hostC=s.plantC*hostFraction,capacity=hostC/p.hostTargetCN+(s.plantC-hostC)/p.nonHostTargetCN;
 const gap=Math.max(0,capacity-s.plantN);
 const fixedN=Math.min(p.maxKgNHaYear/10000/365*hostFraction*thermal*moist*cl.light*inhib,gap/(1+p.costKgCPerKgN/p.hostTargetCN),hostC*.02/p.costKgCPerKgN);
 const costC=fixedN*p.costKgCPerKgN;
 n.plantC-=costC;n.plantN+=fixedN;
 return {soil:n,fixedN,costC};
}

export function initMicro(w=32,h=24,seed=4801,count=6,factors={deposition:true,protection:true,initialPool:true,fixation:true}){
 const s=initFactors(w,h,seed,count,factors);
 return {...s,microSchema:1,fixLedger:{fixedN:0,costC:0},dailyFix:{fixedN:0,costC:0}};
}

export function microAdvance(s,override=null){
 const cl=override||weather(s.world.day,s.world.seed),next=factorAdvance(s,cl),area=profile.cellM**2,daily={fixedN:0,costC:0};
 if(s.factors.fixation)for(const c of next.world.cells){const r=fixationCell(c.soil,{...cl,tempC:cl.tempC-(c.z-650)*.0065},fixationProfile.hostFraction);c.soil=r.soil;daily.fixedN+=r.fixedN*area;daily.costC+=r.costC*area}
 return {...next,fixLedger:{fixedN:s.fixLedger.fixedN+daily.fixedN,costC:s.fixLedger.costC+daily.costC},dailyFix:daily};
}

export function microReport(s){const r=factorReportBase(s);return {...r,factors:s.factors,fixLedger:s.fixLedger,residualC:r.residualC-s.fixLedger.costC,residualN:r.residualN+s.fixLedger.fixedN}}

export function decodeMicro(raw){const s=decodeFactorsBase(raw);if(s.microSchema!==1||!s.factors||!["deposition","protection","initialPool","fixation"].every(k=>typeof s.factors[k]==="boolean")||!s.fixLedger||!["fixedN","costC"].every(k=>Number.isFinite(s.fixLedger[k])&&s.fixLedger[k]>=0))throw Error("invalid micro save");return s}
