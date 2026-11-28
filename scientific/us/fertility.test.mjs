import {profile} from './world.mjs';
import {createFoodWorld,foodTotals,harvestFoodWorld} from './food_world.mjs';
import {initFertility,fertAdvance,decodeFertility,fertilityReport} from './fertility.mjs';
function verifyFertility(){
 let checks=0;const check=(b,m)=>{if(!b)throw Error(m);checks++},near=(a,b,m)=>check(Math.abs(a-b)<1e-7*Math.max(1,Math.abs(a),Math.abs(b)),m);
 const runs=[];
 for(const enabled of [false,true]){
  let s=initFertility(12,10,4801,6,enabled),annual=[],maxC=0,maxN=0;
  near(s.baseline.C,foodTotals(createFoodWorld(12,10,4801,6)).C,"initial C unchanged");near(s.baseline.N,foodTotals(createFoodWorld(12,10,4801,6)).N,"initial N unchanged");
  for(let d=0;d<1825;d++){
   if(d%90===0)s=harvestFoodWorld(s,d%s.world.cells.length);
   const before=foodTotals(s),next=fertAdvance(s),after=foodTotals(next),f=next.dailyFertility,l=next.world.last.ledger;
   const ce=before.C+f.uptakeC-f.soilRespC-f.agentRespC-after.C,ne=before.N+f.depositionN-f.leachN-after.N;maxC=Math.max(maxC,Math.abs(ce));maxN=Math.max(maxN,Math.abs(ne));
   near(ce,0,"daily C");near(ne,0,"daily N");near(before.waterL+l.precipitation*profile.cellM**2,after.waterL+(l.evap+l.drainage+l.outflow)*profile.cellM**2,"water");
   check(next.world.cells.every(c=>Object.values(c.soil).every(v=>Number.isFinite(v)&&v>=0)),"nonnegative");
   if(d%90===0){const restored=decodeFertility(JSON.stringify(next));check(JSON.stringify(fertAdvance(restored))===JSON.stringify(fertAdvance(next)),"save");}
   if((d+1)%365===0){const r=fertilityReport(next);near(r.residualC,0,"cumulative C");near(r.residualN,0,"cumulative N");annual.push({year:(d+1)/365,C:r.total.C,N:r.total.N,stableC:r.stableC,depositionN:r.ledger.depositionN,alive:next.agents.filter(a=>a.alive).length});}
   s=next;
  }
  const r=fertilityReport(s);check(enabled?r.ledger.depositionN>0:r.ledger.depositionN===0,"switch");check(enabled?r.stableC>0:r.stableC===0,"stable switch");
  runs.push({enabled,annual,maxDailyCResidualKg:maxC,maxDailyNResidualKg:maxN,report:r,harvest:s.foodLedger.harvestC});
 }
 let dry=initFertility(3,3,1,1,true);dry=fertAdvance(dry,{rainMm:0,tempC:20,light:.5});near(dry.dailyFertility.wetN,0,"dry day");check(dry.dailyFertility.otherN>0,"other deposition");
 let rainy=initFertility(3,3,1,1,true);rainy=fertAdvance(rainy,{rainMm:20,tempC:20,light:.5});check(rainy.dailyFertility.wetN>0,"wet day");
 const corrupt=JSON.parse(JSON.stringify(rainy));corrupt.world.cells[0].soil.stableC=-1;let rejected=false;try{decodeFertility(JSON.stringify(corrupt))}catch(e){rejected=true}check(rejected,"invalid stable");
 return {checks,daysPerScenario:1825,cells:120,runs};
}
console.log(JSON.stringify(verifyFertility(),null,2));
