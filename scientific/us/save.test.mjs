import test from 'node:test';
import assert from 'node:assert/strict';
import {stepSteward} from './steward.mjs';
import {advance,newWorld} from './world.mjs';
import {encodeFieldSave,decodeFieldSave} from './save.mjs';

const player={x:80,y:64,dir:'down'};
test('um save registra o estado completo e pode prosseguir pelo mesmo dia',()=>{
  const world=advance(newWorld(8,8,27));
  stepSteward(world);
  const loaded=decodeFieldSave(encodeFieldSave(world,player));
  assert.deepEqual(loaded,{world,player});
  assert.deepEqual(advance(loaded.world),advance(world));
});

test('arquivo de outra região, truncado ou malformado é recusado antes de substituir o campo',()=>{
  const original=encodeFieldSave(newWorld(8,8,42),player);
  for(const modify of [
    s=>{s.region='madagascar'}, s=>{s.version=99},
    s=>{s.world.cells.pop()}, s=>{s.world.cells[0].soil.water=-1},
    s=>{delete s.world.cells[0].soil.microbeN}, s=>{s.player.x=null},
    s=>{s.world.day=0.1},s=>{s.world.cells[0].surface=-2},
    s=>{s.world.steward={tankMm:999}}, s=>{s.player.dir='sul'},
    s=>{s.world.day=4;s.world.last=null}
  ]){
    const s=JSON.parse(original);modify(s);
    assert.throws(()=>decodeFieldSave(JSON.stringify(s)));
  }
  assert.throws(()=>decodeFieldSave(original.slice(0,-2)));
  assert.throws(()=>encodeFieldSave(newWorld(8,8,42),{...player,y:Infinity}));
});
