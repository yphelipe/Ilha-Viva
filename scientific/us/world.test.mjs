import {newWorld,advance,totals} from './world.mjs';
function runTests(){
 let assertions=0;
 const check=(c,msg)=>{if(!c)throw Error(msg);assertions++};
 const near=(a,b,msg)=>check(Math.abs(a-b)<=1e-7*Math.max(1,Math.abs(a),Math.abs(b)),msg);
 let w=newWorld(16,12,4801),routed=0;
 for(let i=0;i<1095;i++){const old=totals(w),n=advance(w),t=totals(n),l=n.last.ledger;
  near(old.water+l.precipitation,t.water+l.evap+l.drainage+l.outflow,"water");
  near(old.C+l.carbonUptake,t.C+l.respiredC,"C");
  near(old.N,t.N+l.leachedN,"N");
  check(n.cells.every(c=>c.surface>=0&&Object.values(c.soil).every(v=>Number.isFinite(v)&&v>=0)),"state");
  if(i%30===0){const rev=advance(w,null,true);check(JSON.stringify(n.cells)===JSON.stringify(rev.cells),"order")}
  routed+=l.routed;w=n;
 }
 check(routed>0,"routing");
 const start=newWorld(8,8,1);const frozen=advance(start,{rainMm:20,tempC:-10,light:.3});check(frozen.cells.every(c=>c.soil.snow===20),"snow");
 const thaw=advance(frozen,{rainMm:0,tempC:30,light:.7});check(thaw.cells.every(c=>c.soil.snow===0),"thaw");
 const rain=advance(start,{rainMm:100,tempC:20,light:.7});check(rain.last.ledger.routed>0,"storm");
 const restored=JSON.parse(JSON.stringify(rain));check(JSON.stringify(advance(restored))===JSON.stringify(advance(rain)),"save");
 const dry=newWorld(3,3,1);dry.cells.forEach(c=>{c.soil.water=0});const d=advance(dry,{rainMm:0,tempC:25,light:.8});check(d.last.ledger.carbonUptake===0,"dry");
 return {days:1095,cells:192,cellDays:210240,assertions,routed,final:totals(w)};
}
console.log(JSON.stringify(runTests(),null,2));
