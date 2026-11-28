import {newWorld,profile} from './world.mjs';
import {adjacent,addDisturbance} from './adaptive_agents.mjs';
import {metabolism,allocateFood,createFoodWorld,foodTotals,advanceFoodWorld,harvestFoodWorld,decodeFoodWorld} from './food_world.mjs';
function verifyFood(){
 let checks=0;const check=(b,m)=>{if(!b)throw Error(m);checks++},near=(a,b,m)=>check(Math.abs(a-b)<=1e-8*Math.max(1,Math.abs(a),Math.abs(b)),m);
 const area=profile.cellM**2;
 const w=newWorld(3,3,4);w.cells[4].soil.plantC=.0002;w.cells[4].soil.plantN=.00001;const alloc=allocateFood(w,[{id:1,cell:4,demand:.05},{id:0,cell:4,demand:.05}]);near(alloc.get(0).C,.01,"equal share");near(alloc.get(1).C,.01,"equal share");near(w.cells[4].soil.plantC,0,"no duplicate biomass");near(alloc.get(0).N+alloc.get(1).N,.001,"N share");
 let s=createFoodWorld(12,10,4801,6);const baseline=foodTotals(s),annual=[];let maxC=0,maxN=0,decisions=0;
 for(let d=0;d<1825;d++){if(d%41===0)s=addDisturbance(s,s.agents[0].pos);if(d%90===0){const before=foodTotals(s),old=s.foodLedger;s=harvestFoodWorld(s,d%s.world.cells.length);const after=foodTotals(s);near(before.C,after.C+s.foodLedger.harvestC-old.harvestC,"harvest C");near(before.N,after.N+s.foodLedger.harvestN-old.harvestN,"harvest N")}
 const before=foodTotals(s),alive=s.agents.filter(a=>a.alive).length,next=advanceFoodWorld(s),after=foodTotals(next),l=next.world.last.ledger,f=next.dailyFood;decisions+=alive;
 const cErr=before.C+l.carbonUptake*area-after.C-l.respiredC*area-f.respiredC,nErr=before.N-after.N-l.leachedN*area;
 maxC=Math.max(maxC,Math.abs(cErr));maxN=Math.max(maxN,Math.abs(nErr));near(cErr,0,"C balance");near(nErr,0,"N balance");near(before.waterL+l.precipitation*area,after.waterL+(l.evap+l.drainage+l.outflow)*area,"water");
 check(next.world.cells.every(c=>Object.values(c.soil).every(v=>Number.isFinite(v)&&v>=0)),"nonnegative soil");check(next.agents.every(a=>a.reserveC>=0&&a.reserveC<=metabolism.reserveMax+1e-10),"reserve");
 check(next.agents.every((a,i)=>s.agents[i].alive?adjacent(s.world,s.agents[i].pos).includes(a.pos):a===s.agents[i]),"local move/dead inert");
 if(d%90===0){const restored=decodeFoodWorld(JSON.stringify(next));check(JSON.stringify(advanceFoodWorld(restored))===JSON.stringify(advanceFoodWorld(next)),"save")}
 if((d+1)%365===0)annual.push({year:(d+1)/365,alive:next.agents.filter(a=>a.alive).length,Ckg:after.C,Nkg:after.N});
 s=next;
 }
 let dry=createFoodWorld(3,3,1,1);dry.world.cells.forEach(c=>{c.soil.plantC=0;c.soil.plantN=0});for(let d=0;d<20;d++)dry=advanceFoodWorld(dry,{rainMm:0,tempC:20,light:0});check(!dry.agents[0].alive,"starvation");check(dry.foodLedger.deaths===1,"one death");check(dry.agents[0].bodyC===0&&dry.agents[0].bodyN===0,"carcass returned");
 const bad=JSON.parse(JSON.stringify(s));bad.agents[0].reserveC=-1;let rejected=false;try{decodeFoodWorld(JSON.stringify(bad))}catch(e){rejected=true}check(rejected,"save reject");
 return {checks,days:1825,cells:120,decisions,maxCarbonResidualKg:maxC,maxNitrogenResidualKg:maxN,baseline,annual,foodLedger:s.foodLedger,final:foodTotals(s)};
}
console.log(JSON.stringify(verifyFood(),null,2));
