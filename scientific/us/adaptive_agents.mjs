import {newWorld,advance,totals} from './world.mjs';
import {initialState} from './soil_cell.mjs';
// Diagnostic mobile agents: route learning only; not a calibrated animal or NPC model.
function clamp01(x){return Math.max(0,Math.min(1,x))}

export function adjacent(world,i){const x=i%world.w,y=Math.floor(i/world.w),n=[i];if(x>0)n.push(i-1);if(x<world.w-1)n.push(i+1);if(y>0)n.push(i-world.w);if(y<world.h-1)n.push(i+world.w);return n.sort((a,b)=>a-b)}

function perceivedRisk(cell){return clamp01(cell.surface/25+cell.soil.snow/80)}

export function rememberedRisk(agent,i,day){const m=agent.memory.find(m=>m.cell===i);return m?m.risk*Math.pow(.5,Math.max(0,day-m.day)/30):0}

export function createAgent(world,id,pos){if(!Number.isInteger(pos)||pos<0||pos>=world.cells.length)throw Error("invalid position");return {id,pos,memory:[],visits:0,encounters:0,last:null}}

export function decide(agent,world){
 const options=adjacent(world,agent.pos).map(i=>{const c=world.cells[i],visible=perceivedRisk(c),memory=rememberedRisk(agent,i,world.day);const cover=clamp01(c.soil.plantC/.3);const cost=i===agent.pos?0:.04;const novelty=agent.memory.some(m=>m.cell===i)?0:.06;return {cell:i,visible,memory,cover,score:cover*.5-visible*.7-memory*1.25-cost+novelty}});
 options.sort((a,b)=>b.score-a.score||a.cell-b.cell);return options[0];
}

export function experience(agent,world,choice,disturbances){
 if(!adjacent(world,agent.pos).includes(choice.cell))throw Error("nonlocal action");
 const noise=disturbances.some(e=>e.cell===choice.cell&&e.until>world.day);
 const risk=clamp01(perceivedRisk(world.cells[choice.cell])+(noise?.9:0));
 const old=rememberedRisk(agent,choice.cell,world.day);
 const learned=clamp01(old*.35+risk*.65);
 const memory=agent.memory.filter(m=>m.cell!==choice.cell&&world.day-m.day<=180);
 memory.push({cell:choice.cell,risk:learned,day:world.day});
 memory.sort((a,b)=>b.day-a.day||a.cell-b.cell);
 return {...agent,pos:choice.cell,memory:memory.slice(0,24),visits:agent.visits+1,encounters:agent.encounters+(noise?1:0),last:{day:world.day,from:agent.pos,to:choice.cell,visible:choice.visible,expected:choice.memory,observed:risk,noise,learned}};
}

export function createSimulation(w=32,h=24,seed=4801,count=6){
 const world=newWorld(w,h,seed);if(!Number.isInteger(count)||count<1||count>64||count>world.cells.length)throw Error("invalid count");
 const agents=Array.from({length:count},(_,i)=>createAgent(world,i,Math.floor((i+.5)*world.cells.length/count)));
 return {schema:1,world,agents,disturbances:[]};
}

export function addDisturbance(sim,cell,duration=3){
 if(!Number.isInteger(cell)||cell<0||cell>=sim.world.cells.length||!Number.isInteger(duration)||duration<1||duration>30)throw Error("invalid disturbance");
 return {...sim,disturbances:[...sim.disturbances.filter(e=>e.cell!==cell&&e.until>sim.world.day),{cell,until:sim.world.day+duration+1}].sort((a,b)=>a.cell-b.cell)};
}

export function advanceSimulation(sim,override=null){
 const world=advance(sim.world,override);const disturbances=sim.disturbances.filter(e=>e.until>world.day);
 const agents=sim.agents.map(a=>experience(a,world,decide(a,world),disturbances));
 return {...sim,world,agents,disturbances};
}

export function encodeSimulation(sim){return JSON.stringify(sim)}

export function decodeSimulation(raw){
 if(typeof raw!=="string"||raw.length>10000000)throw Error("invalid save size");
 const s=JSON.parse(raw),w=s?.world;
 const int=(v,min,max)=>Number.isInteger(v)&&v>=min&&v<=max;
 const num=(v,min,max)=>Number.isFinite(v)&&v>=min&&v<=max;
 if(s?.schema!==1||!w||!int(w.w,3,128)||!int(w.h,3,128)||!int(w.day,0,10000000)||!int(w.seed,-2147483648,2147483647)||!Array.isArray(w.cells)||w.cells.length!==w.w*w.h)throw Error("invalid world save");
 const keys=Object.keys(initialState());
 for(const c of w.cells){if(!c||!num(c.z,-10000,10000)||!num(c.surface,0,1e9)||!keys.every(k=>num(c.soil?.[k],0,1e9)))throw Error("invalid cell save")}
 if(!Array.isArray(s.agents)||!s.agents.length||s.agents.length>64||!Array.isArray(s.disturbances)||s.disturbances.length>w.cells.length)throw Error("invalid agents");
 const ids=new Set();
 for(const a of s.agents){if(!a||!int(a.id,0,63)||ids.has(a.id)||!int(a.pos,0,w.cells.length-1)||!int(a.visits,0,w.day)||!int(a.encounters,0,a.visits)||!Array.isArray(a.memory)||a.memory.length>24)throw Error("invalid agent");ids.add(a.id);const seen=new Set();for(const m of a.memory){if(!m||!int(m.cell,0,w.cells.length-1)||seen.has(m.cell)||!num(m.risk,0,1)||!int(m.day,0,w.day))throw Error("invalid memory");seen.add(m.cell)}}
 for(const e of s.disturbances)if(!e||!int(e.cell,0,w.cells.length-1)||!int(e.until,w.day+1,w.day+31))throw Error("invalid event");
 return s;
}

export function diagnose(sim,baseline){
 const current=totals(sim.world),delta={water:current.water-baseline.water,C:current.C-baseline.C,N:current.N-baseline.N};
 return {day:sim.world.day,agents:sim.agents.length,observations:sim.agents.reduce((n,a)=>n+a.visits,0),noiseEncounters:sim.agents.reduce((n,a)=>n+a.encounters,0),memories:sim.agents.reduce((n,a)=>n+a.memory.length,0),delta,flags:[...(delta.C<-.01?["net_carbon_loss"]:[]),...(delta.N<-.001?["net_nitrogen_loss"]:[])]};
}
