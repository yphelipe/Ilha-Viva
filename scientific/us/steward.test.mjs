import {test} from 'node:test';
import assert from 'node:assert/strict';
import {newWorld,advance,totals} from './world.mjs';
import {stepSteward,validateSteward} from './steward.mjs';

const dry = {tempC:18, rainMm:0, light:0.75};
function field() {
  const w = newWorld(5,5,18);
  w.day = 1;
  w.last = {climate:dry};
  for (const c of w.cells) c.soil.water = 80;
  return w;
}
const copy = w => JSON.parse(JSON.stringify(w));
const close = (a,b) => assert.ok(Math.abs(a-b)<1e-8, a+' vs '+b);

test('learned dry-down changes the chosen plot under identical immediate inputs', () => {
  const w = field();
  w.cells[7].soil.water = 54;
  w.cells[11].soil.water = 62;
  stepSteward(w);
  w.day++;
  w.cells[7].soil.water = w.cells[11].soil.water = 50;
  w.cells[12].surface = 1;
  const novice = copy(w);
  delete novice.steward;
  const experienced = stepSteward(w), fresh = stepSteward(novice);
  assert.equal(experienced.last.target,11);
  assert.equal(fresh.last.target,7);
  close(w.cells[11].soil.water,50.4);
  close(w.cells[7].soil.water,50);
  assert.ok(experienced.plots.find(p=>p.index===11).lossMm > experienced.plots.find(p=>p.index===7).lossMm);
});

test('capture, storage and transfer preserve water, carbon and nitrogen', () => {
  const w = field();
  w.cells[12].surface = 7;
  const before = totals(w);
  const s = stepSteward(w);
  close(s.tankMm,4);
  close(w.cells[12].surface,3);
  assert.equal(s.last.action,'inspect');
  const snapshot = JSON.stringify(w);
  stepSteward(w);
  assert.equal(JSON.stringify(w),snapshot);
  w.cells[7].soil.water = 69.9;
  w.day++;
  const t = totals(w);
  const result = stepSteward(w);
  assert.ok(result.last.mm > 0 && result.last.mm <= .4);
  close(t.water,totals(w).water);
  close(before.C,totals(w).C);
  close(before.N,totals(w).N);
});

test('perception, finite supplies, frost and planting constrain action', () => {
  const w = field();
  w.cells[7].soil.water = 25;
  w.cells[0].surface = 100;
  assert.equal(stepSteward(w).last.action,'inspect');
  assert.equal(w.cells[0].surface,100);
  w.day++;
  w.cells[12].surface = 2;
  w.last.climate = {...dry,tempC:-2};
  assert.equal(stepSteward(w).tankMm,0);
  w.day++;
  w.last.climate = dry;
  w.cells[7].soil.plantC = 0;
  assert.equal(stepSteward(w).last.target,null);
  assert.equal(w.cells[7].soil.water,25);
});

test('observations fade on wet days and a missed interval cannot become daily experience', () => {
  const w = field();
  stepSteward(w);
  w.day++;
  w.cells[7].soil.water -= 8;
  stepSteward(w);
  const learned = w.steward.plots[0].lossMm;
  assert.ok(learned>0);
  w.last.climate = {...dry,rainMm:10};
  for(let i=0;i<30;i++){w.day++;stepSteward(w)}
  assert.ok(w.steward.plots[0].lossMm < learned/2);
  w.day += 100;
  w.cells[7].soil.water = 0;
  w.last.climate = dry;
  stepSteward(w);
  assert.ok(w.steward.plots[0].lossMm < .1);
});

test('save validation rejects damaged memory, storage and impossible targets', () => {
  const w = field();
  assert.equal(validateSteward(w),true);
  stepSteward(w);
  assert.equal(validateSteward(copy(w)),true);
  for(const corrupt of [
    s=>{s.day+=1}, s=>{s.tankMm=-1}, s=>{s.plots[0].index=s.home},
    s=>{s.plots[1].lossMm=13}, s=>{s.plots[0].waterAfterMm=null},
    s=>{s.last.target=s.home}, s=>{s.last.mm=1}
  ]) {
    const broken = copy(w);
    corrupt(broken.steward);
    assert.throws(()=>validateSteward(broken));
  }
});

test('three years without player preserve bounded state, balance and replay', () => {
  let w = newWorld(9,7,4801), replay = null;
  let applications=0, captures=0;
  for(let i=0;i<1095;i++) {
    w = advance(w);
    const before = totals(w);
    const state = stepSteward(w);
    close(totals(w).water,before.water);
    assert.ok(state.tankMm>=0 && state.tankMm<=4);
    assert.ok(state.plots.length===4 && state.plots.every(p=>p.lossMm>=0 && p.lossMm<=12));
    if(state.last.mm>0) applications++;
    if(state.last.capturedMm>0) captures++;
    if(replay){replay=advance(replay);stepSteward(replay)}
    if(i===729) replay=copy(w);
  }
  assert.deepEqual(replay,w);
  assert.ok(applications>0 && captures>0);
  console.log({days:w.day,applications,captures,seed:w.seed,grid:[w.w,w.h]});
});
