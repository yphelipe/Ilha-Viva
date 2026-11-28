import {newWorld,totals} from './world.mjs';
import {adjacent,rememberedRisk,createAgent,decide,experience,createSimulation,addDisturbance,advanceSimulation,encodeSimulation,decodeSimulation,diagnose} from './adaptive_agents.mjs';
function verify(){
 let checks=0;const check=(b,m)=>{if(!b)throw Error(m);checks++};
 let w=newWorld(3,3,5);w.cells.forEach(c=>{c.surface=0;c.soil.snow=0;c.soil.plantC=.03});w.cells[3].soil.plantC=.3;w.cells[5].soil.plantC=.28;
 const a=createAgent(w,0,4),choice=decide(a,w);check(choice.cell===3,"initial choice");
 const learned=experience(a,w,choice,[{cell:3,until:4}]);check(learned.memory[0].risk>.5,"learned risk");check(learned.encounters===1,"experience");
 const retry={...learned,pos:4};check(decide(retry,w).cell===5,"changed choice after experience");check(decide(a,w).cell===3,"control without learning");
 check(rememberedRisk(retry,3,30)<rememberedRisk(retry,3,0),"forgetting");
 const unseen=experience(a,w,choice,[{cell:8,until:4}]);check(unseen.encounters===0&&unseen.memory.every(m=>m.cell!==8),"no global knowledge");
 let s=createSimulation(12,10,4801,6),initial=totals(s.world);const start=encodeSimulation(s);
 for(let d=0;d<1825;d++){if(d%17===0)s=addDisturbance(s,s.agents[0].pos,3);const before=s;s=advanceSimulation(s);
 check(s.agents.every((a,i)=>adjacent(before.world,before.agents[i].pos).includes(a.pos)),"local move");
 check(s.agents.every(a=>a.memory.length<=24&&a.memory.every(m=>m.risk>=0&&m.risk<=1&&m.day<=s.world.day)),"memory bounds");
 check(s.agents.every(a=>a.visits===s.world.day),"autonomy");
 if(d%90===0){const decoded=decodeSimulation(encodeSimulation(s));check(encodeSimulation(advanceSimulation(decoded))===encodeSimulation(advanceSimulation(s)),"persistent deterministic state")}
 }
 check(s.agents.some(a=>a.encounters>0),"event encounters");check(s.agents.reduce((n,a)=>n+a.visits,0)===10950,"total decisions");
 check(encodeSimulation(createSimulation(12,10,4801,6))===start,"seed");
 let rejected=false;try{decodeSimulation('{"schema":2}')}catch(e){rejected=true}check(rejected,"bad schema");
 const q=decodeSimulation(encodeSimulation(s));q.agents[0].memory.push({cell:-1,risk:5,day:-1});rejected=false;try{decodeSimulation(encodeSimulation(q))}catch(e){rejected=true}check(rejected,"invalid memory");
 return {checks,days:1825,cells:120,decisions:10950,controlled:{before:choice.cell,after:decide(retry,w).cell,learnedRisk:learned.memory[0].risk},diagnostic:diagnose(s,initial)};
}
console.log(JSON.stringify(verify(),null,2));
