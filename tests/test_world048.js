const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');

const modulePath = path.join(__dirname, '../src/ecosystem/world.js');
const World = fs.existsSync(modulePath) ? require(modulePath) : {};
const create = () => {
  assert.equal(typeof World.create, 'function', 'world geometry is available');
  return World.create({width: 8, height: 6, cellWidth: 72, cellHeight: 50, sectorSize: 2});
};
const rect = (x, y, width, height) => ({x, y, width, height});
const polygonContains = (polygon, x, y) => polygon.reduce((inside, a, i) => {
  const b = polygon[(i + 1) % polygon.length];
  const crossing = (a.y > y) !== (b.y > y) && x < (b.x - a.x) * (y - a.y) / (b.y - a.y) + a.x;
  return crossing ? !inside : inside;
}, false);

function riverCells() {
  return Array.from({length: 48}, (_, i) => {
    const x = i % 8, y = Math.floor(i / 8);
    return {x, y, channel: x === 2 || x === 3 + (y % 3 === 2 ? 1 : 0), surface: 12};
  });
}

test('water geometry respects wet and dry cell centers after surface changes', () => {
  const world = create(), cells = riverCells();
  cells[3].surface = 1;
  for (const cell of cells) {
    assert.equal(world.waterAt(cells, (cell.x + .5) * 72, (cell.y + .5) * 50),
      cell.channel && cell.surface > 1 ? cell : null);
  }
  assert.equal(world.waterAt(cells, -1, 25), null);
  cells[3].surface = 10;
  assert.equal(world.waterAt(cells, 3.5 * 72, 25), cells[3]);
});

test('rendered river footprint and water controls use the same boundary', () => {
  const world = create(), cells = riverCells();
  const bankWidths = new Set();
  for (let gridY = -1; gridY < 6; gridY++) {
    for (let gridX = -1; gridX < 8; gridX++) {
      const polygons = world.waterPolygons(cells, gridX, gridY);
      for (let dy = 2; dy < 50; dy += 9) for (let dx = 2; dx < 72; dx += 9) {
        const x = (gridX + .5) * 72 + dx, y = (gridY + .5) * 50 + dy;
        if (x < 0 || y < 0 || x >= 576 || y >= 300) continue;
        assert.equal(!!world.waterAt(cells, x, y), polygons.some(polygon => polygonContains(polygon, x, y)));
      }
      if (gridX === 1) for (const polygon of polygons) for (const p of polygon) bankWidths.add(Math.round(p.x));
    }
  }
  assert.ok(bankWidths.size > 3, 'the shore has offsets within a cell');
});

test('spatial index updates moving entries without duplicates or ordering changes', () => {
  const world = create(), index = world.createIndex();
  index.set('a', rect(135, 95, 20, 20), 'first');
  index.set('b', rect(145, 105, 10, 10), 'second');
  index.set('c', rect(450, 220, 10, 10), 'third');
  assert.deepEqual(index.query(rect(130, 90, 40, 40)), ['first', 'second']);
  assert.deepEqual(world.sectorsFor(rect(135, 95, 20, 20)), [0, 1, 4, 5]);
  assert.equal(world.sectorAt(145, 105), 5);
  assert.deepEqual(world.cellsFor(rect(70, 48, 5, 5)), [0, 1, 8, 9]);
  index.set('a', rect(450, 220, 10, 10), 'moved');
  assert.deepEqual(index.query(rect(130, 90, 40, 40)), ['second']);
  assert.deepEqual(index.query(rect(440, 210, 30, 30)), ['moved', 'third']);
  assert.equal(index.get('a'), 'moved');
  assert.equal(index.size, 3);
  index.delete('a');
  assert.deepEqual(index.query(rect(440, 210, 30, 30)), ['third']);
  index.clear();
  assert.equal(index.size, 0);
});

test('a long movement cannot tunnel across an ellipse or thin structure', () => {
  const world = create(), index = world.createIndex();
  const trunk = {x: 150, y: 100, rx: 10, ry: 6, shape: 'ellipse'};
  const fence = {x: 350, y: 100, rx: 2, ry: 30, shape: 'box'};
  index.set('trunk', World.footprintBounds(trunk), trunk);
  index.set('fence', World.footprintBounds(fence), fence);
  assert.deepEqual(world.move(50, 100, 400, 0, index), {x: 140, y: 100});
  assert.deepEqual(world.move(250, 100, 200, 0, index, {radiusX: 4}), {x: 344, y: 100});
  assert.deepEqual(world.move(250, 50, 300, 0, index), {x: 550, y: 50});
});

test('diagonal movement keeps the tangent and cannot penetrate a footprint', () => {
  const world = create(), index = world.createIndex();
  const wall = {x: 150, y: 130, rx: 10, ry: 50, shape: 'box'};
  index.set('wall', World.footprintBounds(wall), wall);
  assert.deepEqual(world.move(110, 100, 60, 40, index), {x: 140, y: 140});
  assert.deepEqual(world.move(140, 140, 0, -53, index), {x: 140, y: 87});
  assert.ok(world.blocked(171, 100, 110, 100, index));
});

test('a player who starts inside a new obstacle can escape it', () => {
  const world = create(), index = world.createIndex();
  const trunk = {x: 150, y: 100, rx: 10, ry: 6, shape: 'ellipse'};
  index.set('trunk', World.footprintBounds(trunk), trunk);
  assert.ok(world.blocked(150, 100, 146, 100, index));
  assert.ok(!world.blocked(143, 100, 146, 100, index));
  assert.deepEqual(world.move(146, 100, -20, 0, index), {x: 126, y: 100});
  assert.deepEqual(world.move(146, 100, 20, 0, index), {x: 146, y: 100});
  const chest = {x: 300, y: 120, rx: 10, ry: 10, shape: 'box'};
  index.set('chest', World.footprintBounds(chest), chest);
  assert.deepEqual(world.move(300, 120, 0, 20, index), {x: 300, y: 140});
});

test('depth follows ground contact, with stable ties and explicit overhead layers', () => {
  create();
  const objects = [
    {id: 'roof', y: 5, layer: 'overhead'},
    {id: 'hero', y: 100, baseY: 110},
    {id: 'lemur', y: 55, baseY: 120, depthOrder: 1},
    {id: 'tree', y: 40, baseY: 120},
    {id: 'far', y: 80},
    {id: 'z', y: 50},
    {id: 'a', y: 50},
  ];
  assert.deepEqual(objects.sort(World.compareDepth).map(o => o.id), ['a', 'z', 'far', 'hero', 'tree', 'lemur', 'roof']);
});

test('mixed stable IDs preserve a transitive depth order', () => {
  const pair = [2, 10, '15'].map(id => ({id, y:100}));
  const sorted = [...pair].sort(World.compareDepth);
  for (let i=0;i<sorted.length;i++) for (let j=i+1;j<sorted.length;j++) {
    assert.ok(World.compareDepth(sorted[i],sorted[j]) < 0);
  }
});
