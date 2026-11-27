'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const Farm = require('../src/ecosystem/farm');
const Aquatic = require('../src/ecosystem/aquatic');

function field() {
  const s = Aquatic.create(42);
  const f = Farm.create();
  const b = Farm.bag();
  const i = s.cells.findIndex(c => c.kind === 'valley' && !c.channel && c.y > 5 && c.y < 20);
  const c = s.cells[i];
  Object.assign(c, { b: .04, water: c.cap * .5, surface: 0, n: .3, soilP: .045, oxygen: 1, micro: .8 });
  Object.assign(s, { step: 2, temp: 25, cloud: 0 });
  assert.ok(Farm.till(f, s, i));
  return { s, f, b, i, c };
}

function close(actual, expected, tolerance = 1e-9) {
  assert.ok(Math.abs(actual - expected) < tolerance, `${actual} ≠ ${expected}`);
}

test('a ditch redirects excess to an adjoining downstream cell without water loss', () => {
  const { s, f, i, c } = field();
  c.surface = 16;
  c.water = c.cap * .95;
  const before = Aquatic.totals(s).w;
  assert.ok(Farm.drain(f, s, i));
  const outlet = s.cells[f.plots[i].drain];
  assert.ok(outlet.y === c.y + 1 && Math.abs(outlet.x - c.x) <= 1);
  const receiving = outlet.surface;
  Farm.tick(f, s);
  assert.ok(c.surface < 16 && outlet.surface > receiving);
  close(Aquatic.totals(s).w, before);
  close(f.last.w, 0);

  c.surface = 0;
  c.water = c.cap * .45;
  Farm.tick(f, s);
  close(c.water, c.cap * .45);
  assert.ok(Farm.drain(f, s, i));
  assert.equal(f.plots[i].drain, null);
});

test('returning gathered litter to a plot conserves all tracked matter', () => {
  const { s, f, b, i, c } = field();
  c.litter = .12;
  c.ln = .013;
  const before = Aquatic.totals(s);
  assert.ok(Farm.gatherOrganic(f, s, b, i));
  assert.equal(b.organic, 1);
  assert.ok(Aquatic.totals(s).c < before.c);
  assert.ok(Farm.fertilize(f, s, b, i, 'organic'));
  assert.equal(b.organic, 0);
  assert.equal(Farm.fertilize(f, s, b, i, 'organic'), false);
  const after = Aquatic.totals(s);
  for (const k of ['c', 'n', 'p', 'w']) close(after[k], before[k]);
});

test('a compost pile matures with soil biology, breathes out carbon and returns its nutrients', () => {
  const { s, f, b, i, c } = field();
  c.litter = .12;
  c.ln = .016;
  const before = Aquatic.totals(s);
  for (let unit = 0; unit < 2; unit++) {
    assert.ok(Farm.gatherOrganic(f, s, b, i));
    assert.ok(Farm.compostDeposit(f, s, b, i));
  }
  assert.equal(Farm.compostCollect(f, b, i), false);
  c.micro = 0;
  Farm.tick(f, s);
  assert.equal(f.compost[i].progress, 0);
  c.micro = 1;
  const beforeOxygen = c.oxygen;
  c.oxygen = 0;
  Farm.tick(f, s);
  assert.equal(f.compost[i].progress, 0);
  c.oxygen = beforeOxygen;
  for (let tick = 0; tick < 140 && f.compost[i].progress < 1; tick++) {
    Farm.tick(f, s);
    for (const error of Object.values(f.last)) close(error, 0);
  }
  assert.equal(f.compost[i].progress, 1);
  assert.equal(Farm.compostCollect(f, { fruit: 240 }, i), false);
  assert.ok(Farm.compostCollect(f, b, i));
  assert.ok(Farm.compostCollect(f, b, i));
  assert.equal(f.compost[i], undefined);
  const beforeN = c.n;
  assert.ok(Farm.fertilize(f, s, b, i));
  assert.ok(Farm.fertilize(f, s, b, i));
  assert.ok(c.n > beforeN);
  const after = Aquatic.totals(s);
  assert.ok(f.ledger.compostResp > 0);
  close(after.c + f.ledger.compostResp, before.c);
  for (const k of ['n', 'p', 'w']) close(after[k], before[k]);
});

test('seed harvest replaces food harvest and stores seeds outside the backpack', () => {
  const { s, f, b, i } = field();
  assert.ok(Farm.plant(f, s, b, i, 'beans'));
  const quantity = b.seed_beans;
  assert.equal(Farm.harvestSeeds(f, b, i), false);
  Object.assign(f.plots[i], { c: .048, progress: 1 });
  assert.equal(Farm.harvestSeeds(f, { fruit: 240 }, i), false);
  assert.ok(Farm.harvestSeeds(f, b, i));
  assert.ok(b.seed_beans >= quantity + 2);
  assert.equal(b.beans, undefined);
  assert.equal(Farm.harvestSeeds(f, b, i), false);
  const stock = b.seed_beans;
  assert.ok(Farm.storeSeeds(f, b, 'beans', 2));
  assert.equal(b.seed_beans, stock - 2);
  assert.equal(f.seedStore.beans, 2);
  assert.equal(Farm.withdrawSeeds(f, { fruit: 240 }, 'beans', 2), false);
  assert.equal(f.seedStore.beans, 2);
  assert.ok(Farm.withdrawSeeds(f, b, 'beans', 2));
  assert.equal(b.seed_beans, stock);
});

test('crop rotation and fallow reduce the penalty for repeated cultivation', () => {
  const rates = [];
  for (const next of ['beans', 'rice', 'beans']) {
    const { s, f, b, i, c } = field();
    assert.ok(Farm.plant(f, s, b, i, 'beans'));
    Object.assign(f.plots[i], { c: .048, progress: 1 });
    assert.ok(Farm.harvest(f, b, i));
    if (rates.length === 2) for (let t = 0; t < 100; t++) Farm.tick(f, s);
    assert.ok(Farm.plant(f, s, b, i, next));
    c.water = c.cap * .72;
    Farm.tick(f, s);
    rates.push(Farm.soil(f, s, i).rotation);
  }
  assert.ok(rates[0] < rates[1]);
  assert.equal(rates[1], rates[2]);
});

test('migration preserves old crop progress and initializes farm storage', () => {
  const original = { plots: { 4: { crop: 'rice', progress: .4, c: .03 } }, ledger: { photo: .2 }, events: { planted: 3 } };
  const loaded = Farm.migrate(JSON.parse(JSON.stringify(original)));
  assert.deepEqual({ crop: loaded.plots[4].crop, progress: loaded.plots[4].progress, c: loaded.plots[4].c }, original.plots[4]);
  assert.equal(loaded.ledger.photo, .2);
  assert.equal(loaded.events.planted, 3);
  assert.deepEqual(loaded.compost, {});
  assert.deepEqual(loaded.seedStore, {});
  assert.deepEqual(Farm.migrate(loaded), loaded);
});


test('a failed rice crop returns carbon, nitrogen and phosphorus to depleted soil', () => {
  const { s, f, b, i, c } = field();
  assert.ok(Farm.plant(f, s, b, i, 'rice'));
  c.water = 0;
  const p = f.plots[i], before = Aquatic.totals(s), resp = f.ledger.resp;
  Object.assign(p, { c: .03, n: .009, p: .001, stress: 12 });
  Farm.tick(f, s);
  assert.equal(f.plots[i].crop, null);
  assert.equal(f.plots[i].lastCrop, 'rice');
  const after = Aquatic.totals(s);
  close(after.c - before.c, .03 - (f.ledger.resp - resp));
  close(after.n - before.n, .009);
  close(after.p - before.p, .001);
  for (const error of Object.values(f.last)) close(error, 0);
});

test('in natural weather a ditch allows a formerly flooded plot to produce seeds', () => {
  function season(withDitch) {
    const s = Aquatic.create(42), f = Farm.create(), b = Farm.bag();
    const i = s.cells.findIndex(c => c.x === 15 && c.y === 12);
    assert.ok(Aquatic.landEdit(s, i, 'cut'));
    assert.ok(Farm.till(f, s, i));
    assert.ok(Farm.plant(f, s, b, i, 'beans'));
    if (withDitch) assert.ok(Farm.drain(f, s, i));
    let flooding = 0;
    for (let step = 0; step < 132; step++) {
      Aquatic.tick(s);
      Farm.tick(f, s);
      flooding += Number(s.cells[i].surface > 8);
      for (const error of Object.values(f.last)) close(error, 0);
      for (const error of Object.values(s.last)) close(error, 0, 1e-6);
      Farm.harvestSeeds(f, b, i);
    }
    return { flooding, seeds: f.events.seeds, failed: f.events.failed };
  }
  const control = season(false), drain = season(true);
  assert.ok(drain.flooding < control.flooding);
  assert.equal(control.failed, 1);
  assert.equal(control.seeds, 0);
  assert.ok(drain.seeds >= 2);
});

test('save validation accepts migrated crop state and rejects broken material, seed and drain references', () => {
  const { s, b, i } = field();
  const old = {
    plots: { [i]: { crop: 'beans', age: 1, progress: .035, c: .005, n: .0004, p: .00006, stress: 0 } },
    ledger: { seedC: .004, seedN: .00032, seedP: .000048 },
    events: { planted: 1 },
  };
  const f = Farm.migrate(old);
  assert.ok(Farm.valid(f, s, b));
  assert.ok(Farm.drain(f, s, i));
  assert.ok(Farm.valid(f, s, b));
  for (const damage of [
    state => { state.plots[i].drain = i; },
    state => { state.plots[i].p = null; },
    state => { state.seedStore.rice = Farm.seedCap + 1; },
    state => { state.ledger.photo = Infinity; },
    state => { state.materials.organic.units = 1; },
    state => { state.compost[i] = { c: .01, n: .002, units: 1, progress: .4 }; },
  ]) {
    const broken = JSON.parse(JSON.stringify(f));
    damage(broken);
    assert.equal(Farm.valid(broken, s, b), false);
  }
});
