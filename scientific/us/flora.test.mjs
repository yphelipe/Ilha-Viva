import {foodTotals} from './food_world.mjs';
import {initFlora,floraAdvance,floraHarvest,floraReport,decodeFlora} from './flora.mjs';
function verifyFlora(){
 let checks=0;const ck=(x,m)=>{if(!x)throw Error(m);checks++},near=(a,b,m)=>ck(Math.abs(a-b)<1e-7*Math.max(1,Math.abs(a),Math.abs(b)),m);
 const cases=[];
 for(const [fix,frac] of [[true,.25],[false,.25],[true,0],[true,1]]){
 let s=initFlora(8,6,4801,4,fix,frac);const annual=[];let maxC=0,maxN=0;
 for(let d=0;d<1095;d++){
 if(d%90===0){const before=foodTotals(s),old=s.foodLedger;s=floraHarvest(s,d%s.world.cells.length);near(before.C,foodTotals(s).C+s.foodLedger.harvestC-old.harvestC,"harvest C");near(before.N,foodTotals(s).N+s.foodLedger.harvestN-old.harvestN,"harvest N")}
 const before=foodTotals(s),n=floraAdvance(s),after=foodTotals(n),l=n.dailyFertility,f=n.dailyFlora;
 const ce=before.C+l.uptakeC-l.soilRespC-l.agentRespC-after.C,ne=before.N+l.depositionN-l.leachN+f.fixedN-after.N;maxC=Math.max(maxC,Math.abs(ce));maxN=Math.max(maxN,Math.abs(ne));near(ce,0,"daily C");near(ne,0,"daily N");
 ck(n.world.cells.every(c=>Object.values(c.soil).every(v=>Number.isFinite(v)&&v>=0)),"finite pools");
 ck(n.world.cells.every(c=>Math.abs(c.soil.plantC-c.soil.grassCarbon-c.soil.legumeCarbon)<1e-10&&Math.abs(c.soil.plantN-c.soil.grassNitrogen-c.soil.legumeNitrogen)<1e-10),"no double counting");
 if(d%180===0)ck(JSON.stringify(floraAdvance(decodeFlora(JSON.stringify(n))))===JSON.stringify(floraAdvance(n)),"save");
 if((d+1)%365===0){const r=floraReport(n);near(r.residualC,0,"cumulative C");near(r.residualN,0,"cumulative N");annual.push({year:(d+1)/365,grassC:r.grassC,legumeC:r.legumeC,fixedN:r.floraLedger.fixedN,costC:r.floraLedger.fixCostC,totalC:r.total.C,totalN:r.total.N,nodulation:r.nodulation})}
 s=n;
 }
 const r=floraReport(s);ck(fix&&frac>0?r.floraLedger.fixedN>0:r.floraLedger.fixedN===0,"fix switch");if(frac===0)near(r.legumeC,0,"no spontaneous host");if(frac===1)near(r.grassC,0,"no spontaneous grass");
 cases.push({fix,frac,annual,harvestC:s.foodLedger.harvestC,maxC,maxN});
 }
 const bad=initFlora(3,3);bad.world.cells[0].soil.legumeCarbon+=1;let rejected=false;try{decodeFlora(JSON.stringify(bad))}catch(e){rejected=true}ck(rejected,"reject mismatched stock");
 return {checks,daysPerScenario:1095,cells:48,cases};
}
console.log(JSON.stringify(verifyFlora(),null,2));
