import assert from 'node:assert/strict';
import {surfaceEvaporation as e,newWorld,advance,totals} from './world.mjs';
import {createFarm,stepFarm,validateFarm} from './farm.mjs';
assert.deepEqual([e(1,25,.5),e(0,25,.5),e(5,-1,1),e(5,25,0),e(5,20,.5)],[1,0,0,0,1.6]);
let a=newWorld(8,7,42),f=createFarm(),max=0,maxF=0,loss=0,lossF=0;
for(let d=0;d<365;d++){
 const n=advance(a),l=n.last.ledger;
 max=Math.max(max,Math.abs(totals(a).water+l.precipitation-totals(n).water-l.evap-l.drainage-l.outflow));loss+=l.surfaceEvap;a=n;
 const next=stepFarm(f),q=next.world.last.ledger;
 maxF=Math.max(maxF,Math.abs(totals(f.world).water+q.precipitation-totals(next.world).water-q.evap-q.drainage-q.outflow));lossF+=q.surfaceEvap;f=next;
 validateFarm(f);assert.ok(f.world.cells.every(c=>c.surface>=0&&c.soil.water>=0));
}
assert.ok(max<1e-8&&maxF<1e-8&&loss>0&&lossF>0);
console.log(JSON.stringify({daysPerScenario:365,max,maxF,loss,lossF},null,2));
