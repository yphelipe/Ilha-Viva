'use strict';

const assert = require('node:assert/strict');
const {test} = require('node:test');
const Aquatic = require('../src/ecosystem/aquatic');
const Farm = require('../src/ecosystem/farm');
const Homestead = require('../src/ecosystem/homestead');

function setup() {
    const s = Aquatic.create(42);
    const site = s.cells.findIndex(c => !c.channel && c.b <= .16);
    const secondSite = s.cells.findIndex((c, i) => i !== site && !c.channel && c.b <= .16);
    return {s, site, secondSite, h: Homestead.create(), bag: Farm.bag()};
}

test('the starter kit crafts a tool, chest, fence and cooking station', () => {
    const {h, bag} = setup();
    for (const id of ['mallet', 'chest', 'cookfire', 'fence']) {
        assert.equal(Homestead.craft(h, bag, id), 'ok');
        assert.equal(bag[id], 1);
    }
    assert.ok(bag.wood < 10);
    assert.ok(bag.stone < 6);
});

test('failed crafting preserves the backpack and outputs can occupy freed slots', () => {
    const {h} = setup();
    const bag = {fruit: 218, wood: 3};
    assert.equal(Farm.slots(bag), Farm.cap);
    assert.equal(Homestead.craft(h, bag, 'mallet'), 'full');
    assert.deepEqual(bag, {fruit: 218, wood: 3});
    assert.equal(Homestead.craft(h, bag, 'constructor'), 'recipe');
    assert.equal(Homestead.craft(h, {fruit: 218}, 'mallet'), 'ingredients');
    const replace = {fruit: 218, wood: 2};
    assert.equal(Homestead.craft(h, replace, 'mallet'), 'ok');
    assert.deepEqual(replace, {fruit: 218, wood: 0, mallet: 1});
});

test('construction validates the tool, terrain, occupancy and external collision before charging', () => {
    const {s, site, h} = setup();
    const bag = {chest: 2};
    const river = s.cells.findIndex(c => c.channel);
    const vegetation = s.cells.findIndex(c => !c.channel && c.b > .16);
    assert.equal(Homestead.place(h, s, bag, site, 'chest'), 'tool');
    bag.mallet = 1;
    assert.equal(Homestead.place(h, s, bag, river, 'chest'), 'target');
    assert.equal(Homestead.place(h, s, bag, vegetation, 'chest'), 'target');
    assert.equal(Homestead.place(h, s, bag, site, 'chest', c => c === s.cells[site]), 'occupied');
    assert.equal(bag.chest, 2);
    assert.equal(Homestead.place(h, s, bag, site, 'chest'), 'ok');
    assert.equal(Homestead.place(h, s, bag, site, 'chest'), 'occupied');
    assert.equal(bag.chest, 1);
    assert.deepEqual(Homestead.at(h, site), {kind: 'chest', stock: {}});
    const feet = Homestead.shape('chest', 3, 2, 100, 100);
    assert.equal(feet.shape, 'box');
    assert.ok(feet.x > 300 && feet.x < 400 && feet.y > 200 && feet.y < 300);
    assert.ok(feet.x - feet.rx >= 300 && feet.x + feet.rx <= 400);
    assert.ok(feet.y - feet.ry >= 200 && feet.y + feet.ry <= 300);
    assert.deepEqual(Homestead.bounds('chest', 3, 2, 100, 100), {left: 322, top: 234, right: 378, bottom: 272});
});

test('chests hold independent stock and preserve it through serialized saves', () => {
    const {s, site, secondSite, h} = setup();
    const bag = {chest: 2, mallet: 1, seed_beans: 4, organic: 1};
    assert.equal(Homestead.place(h, s, bag, site, 'chest'), 'ok');
    assert.equal(Homestead.place(h, s, bag, secondSite, 'chest'), 'ok');
    assert.equal(Homestead.transfer(h, bag, site, 'seed_beans', 3, 'deposit'), 'ok');
    assert.equal(Homestead.transfer(h, bag, secondSite, 'seed_beans', 1, 'withdraw'), 'ingredients');
    assert.equal(Homestead.transfer(h, bag, site, 'organic', 1, 'deposit'), 'item');
    assert.equal(Homestead.transfer(h, bag, site, 'irrigation', 1, 'deposit'), 'item');
    assert.equal(Homestead.transfer(h, bag, site, 'seed_beans', 1, 'bad_direction'), 'item');
    assert.deepEqual(Homestead.at(h, site).stock, {seed_beans: 3});
    assert.equal(bag.seed_beans, 1);
    const saved = JSON.parse(JSON.stringify(h));
    assert.equal(Homestead.valid(saved, s), true);
    assert.equal(Homestead.transfer(saved, bag, site, 'seed_beans', 2, 'withdraw'), 'ok');
    assert.equal(bag.seed_beans, 3);
    assert.equal(Homestead.at(saved, site).stock.seed_beans, 1);
});

test('both transfer directions preserve source stock if the destination is full', () => {
    const {s, site, h} = setup();
    assert.equal(Homestead.place(h, s, {mallet: 1, chest: 1}, site, 'chest'), 'ok');
    const chest = Homestead.at(h, site);
    chest.stock.fruit = 360;
    const bag = {fruit: 240};
    assert.equal(Homestead.transfer(h, bag, site, 'fruit', 1, 'deposit'), 'full');
    assert.equal(Homestead.transfer(h, bag, site, 'fruit', 1, 'withdraw'), 'full');
    assert.equal(Homestead.transfer(h, bag, site, 'fruit', -1, 'deposit'), 'item');
    assert.deepEqual(bag, {fruit: 240});
    assert.deepEqual(chest.stock, {fruit: 360});
});

test('savestate validation rejects bad cells, items, quantities and structure types', () => {
    const {s, site, h} = setup();
    const river = s.cells.findIndex(c => c.channel);
    assert.equal(Homestead.valid(undefined, s), false);
    for (const [i, entry] of [
        [s.cells.length, {kind: 'fence'}],
        [river, {kind: 'fence'}],
        [site, {kind: 'constructor'}],
        [site, {kind: 'fence', stock: {water: 1}}],
        [site, {kind: 'chest', stock: {organic: 1}}],
        [site, {kind: 'chest', stock: {fruit: 361}}],
        [site, {kind: 'chest', stock: {fruit: -1}}],
        [site, {kind: 'chest', stock: {unknown: 1}}],
    ]) {
        assert.equal(Homestead.valid({...h, objects: {[i]: entry}}, s), false);
    }
    assert.equal(Homestead.valid({...h, stones: {[site]: 3}}, s), false);
    assert.equal(Homestead.place(h, s, {mallet: 1, fence: 1}, site, 'fence'), 'ok');
    s.cells[site].surface = 20;
    s.cells[site].b = .7;
    assert.equal(Homestead.valid(h, s), true);
});

test('river collection exports accounted water and allows treatment and cooking at a placed station', () => {
    const {s, site, secondSite, h} = setup();
    const river = s.cells.findIndex(c => c.channel);
    const bag = {mallet: 1, cookfire: 1, sweet: 2};
    const before = Aquatic.totals(s);
    assert.equal(Homestead.collectWater(s, bag, site), 'source');
    assert.equal(Homestead.collectWater(s, bag, river, 3), 'source');
    assert.equal(Homestead.collectWater(s, {fruit: 240}, river), 'full');
    assert.equal(s.ledger.waterOut, 0);
    assert.equal(Homestead.collectWater(s, bag, river, 2), 'ok');
    assert.equal(bag.raw_water, 2);
    assert.equal(bag.water || 0, 0);
    assert.equal(s.ledger.waterOut, 8);
    assert.equal(before.w - Aquatic.totals(s).w, 8);
    assert.equal(Homestead.craft(h, bag, 'treat_water'), 'station');
    assert.equal(Homestead.place(h, s, bag, site, 'cookfire'), 'ok');
    assert.equal(Homestead.craft(h, bag, 'treat_water', secondSite), 'station');
    assert.equal(Homestead.craft(h, bag, 'treat_water', site), 'ok');
    assert.equal(bag.raw_water, 1);
    assert.equal(bag.water, 1);
    assert.equal(Homestead.craft(h, bag, 'cook_sweet', site), 'ok');
    assert.equal(bag.sweet, 0);
    assert.equal(bag.water, 0);
    assert.equal(bag.meal, 1);
    assert.equal(Homestead.craft(h, bag, 'cook_sweet', site), 'ingredients');
    assert.equal(s.ledger.waterOut, 8);
});

test('collection removes dead wood carbon, nitrogen and implicit phosphorus from the ecological stock', () => {
    const {s} = setup();
    const i = s.cells.findIndex(c => !c.channel && c.wood >= .035);
    const c = s.cells[i];
    const bag = {};
    const before = Aquatic.totals(s);
    const wood = c.wood;
    assert.equal(Homestead.gatherWood(s, {fruit: 240}, i), 'full');
    assert.equal(c.wood, wood);
    assert.equal(Homestead.gatherWood(s, bag, i), 'ok');
    assert.equal(bag.wood, 1);
    assert.ok(Math.abs(c.wood - wood + .035) < 1e-9);
    const after = Aquatic.totals(s);
    assert.ok(Math.abs(before.c - after.c - s.ledger.carbonOut) < 1e-9);
    assert.ok(Math.abs(before.n - after.n - s.ledger.nOut) < 1e-9);
    assert.ok(Math.abs(before.p - after.p - s.ledger.pOut) < 1e-9);
    assert.ok(s.ledger.nOut > 0);
});

test('loose stone is finite and depletion persists across saves', () => {
    const {s, site, h} = setup();
    const river = s.cells.findIndex(c => c.channel);
    const bag = {};
    assert.equal(Homestead.gatherStone(h, s, bag, river), 'source');
    assert.equal(Homestead.stoneAvailable(h, s, site), 2);
    assert.equal(Homestead.gatherStone(h, s, {fruit: 240}, site), 'full');
    assert.equal(Homestead.stoneAvailable(h, s, site), 2);
    assert.equal(Homestead.gatherStone(h, s, bag, site), 'ok');
    const saved = JSON.parse(JSON.stringify(h));
    assert.equal(Homestead.valid(saved, s), true);
    assert.equal(Homestead.gatherStone(saved, s, bag, site), 'ok');
    assert.equal(bag.stone, 2);
    assert.equal(Homestead.gatherStone(saved, s, bag, site), 'source');
});
