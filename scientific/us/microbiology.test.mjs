import {profile} from './world.mjs';
import {foodTotals,harvestFoodWorld} from './food_world.mjs';
import {fixationCell,initMicro,microAdvance,microReport,decodeMicro} from './microbiology.mjs';
function verifyMicro(){
 let checks=0;const ck=(b,m)=>{if(!b)throw Error(m);checks++},near=(a,b,m)=>ck(Math.abs(a-b)<1e-7*Math.max(1,Math.abs(a),Math.abs(b)),m);
 const cell={plantC:.3,plantN:.006,water:60,mineralN:0},cl={tempC:22,light:1};const r=fixationCell(cell,cl,.25);ck(r.fixedN>0,"fixation");near(cell.plantC-r.costC,r.soil.plantC,"cost");near(cell.plantN+r.fixedN,r.soil.plantN,"N to plant");ck(fixationCell(cell,cl,0).fixedN===0,"no host");ck(fixationCell(cell,{...cl,light:0},.25).fixedN===0,"dark");ck(fixationCell(cell,{...cl,tempC:-5},.25).fixedN===0,"cold");ck(fixationCell({...cell,water:0},cl,.25).fixedN===0,"drought");ck(fixationCell({...cell,mineralN:.1},cl,.25).fixedN<r.fixedN,"inhibition");
 const scenarios=[];for(let bits=0;bits<9;bits++){const f={deposition:!!(bits&1),protection:!!(bits&2),initialPool:!!(bits&4),fixation:bits===8};if(bits===8){f.deposition=f.protection=f.initialPool=true}
 let s=initMicro(8,6,4801,4,f);const initial=s.baseline;let maxC=0,maxN=0;const annual=[];
 for(let d=0;d<1095;d++){if(d%90===0)s=harvestFoodWorld(s,d%s.world.cells.length);const before=foodTotals(s),n=microAdvance(s),after=foodTotals(n),l=n.dailyFertility,g=n.dailyFix;
 const ce=before.C+l.uptakeC-l.soilRespC-l.agentRespC-g.costC-after.C,ne=before.N+l.depositionN-l.leachN+g.fixedN-after.N;maxC=Math.max(maxC,Math.abs(ce));maxN=Math.max(maxN,Math.abs(ne));near(ce,0,"daily C");near(ne,0,"daily N");ck(n.world.cells.every(c=>Object.values(c.soil).every(v=>Number.isFinite(v)&&v>=0)),"valid pools");if(d%180===0){const restored=decodeMicro(JSON.stringify(n));ck(JSON.stringify(microAdvance(restored))===JSON.stringify(microAdvance(n)),"save")}
 if((d+1)%365===0){const rep=microReport(n);near(rep.residualC,0,"cum C");near(rep.residualN,0,"cum N");annual.push({year:(d+1)/365,C:after.C,N:after.N,fixN:n.fixLedger.fixedN,plantC:n.world.cells.reduce((a,c)=>a+c.soil.plantC*profile.cellM**2,0)})}s=n}
 const rep=microReport(s);ck(f.fixation?rep.fixLedger.fixedN>0:rep.fixLedger.fixedN===0,"fix switch");ck(f.deposition?rep.ledger.depositionN>0:rep.ledger.depositionN===0,"dep switch");scenarios.push({f,initial,annual,final:rep.total,fixLedger:s.fixLedger,harvestC:s.foodLedger.harvestC,maxC,maxN})}
 return {checks,days:1095,cells:48,scenarios};
}
console.log(JSON.stringify(verifyMicro(),null,2));
