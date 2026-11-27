const assert = require('node:assert/strict');
const { test } = require('node:test');
const Eco = require('../src/ecosystem/ecology');
const Vertebrates = require('../src/ecosystem/vertebrates');
const Aquatic = require('../src/ecosystem/aquatic');

const pos = (x, y = 12) => y * Eco.W + x;
const budget = s => Object.values(s.last).every(error => Math.abs(error) < 1e-6);
const roundTrip = value => JSON.parse(JSON.stringify(value));

function scene() {
  const s = Aquatic.create(42);
  const [female, male, other] = s.animals;
  const predator = s.animals.find(a => a.sp === 3);
  return { s, female, male, other, predator };
}

test('founders have stable individual traits, including after a saved world advances', () => {
  const { s, female, male } = scene();
  assert.ok(female.personality && male.personality, 'founders carry individual traits');
  assert.notDeepEqual(female.personality, male.personality);
  const traits = roundTrip(female.personality);
  const saved = roundTrip(s);
  Aquatic.tick(saved);
  assert.deepEqual(saved.animals.find(a => a.id === female.id).personality, traits);
});

test('repeated forage experience persists whereas one incidental memory expires', () => {
  const { s, female } = scene();
  const recurring = pos(34), incidental = pos(33);
  for (const i of [recurring, incidental]) Object.assign(s.cells[i], { sp: 6, b: .20 });
  Vertebrates.remember(s, female, recurring, 'food');
  Vertebrates.remember(s, female, incidental, 'food');
  s.day = 2;
  Vertebrates.remember(s, female, recurring, 'food');
  const saved = roundTrip(s);
  saved.day = 33;
  Vertebrates.family(saved);
  assert.deepEqual(saved.animals[0].memory.map(z => z.i), [recurring]);
  const walker = saved.animals[0];
  walker.pos = pos(31);
  assert.equal(Vertebrates.memoryTarget(saved, walker, [pos(31), pos(32)]), pos(32));
  saved.cells[recurring].sp = -1;
  walker.pos = pos(32);
  assert.equal(Vertebrates.memoryTarget(saved, walker, [pos(32), pos(33), recurring]), -1);
});

test('terrestrial alarms reach nearby lemurs beyond detection without propagating globally', () => {
  const { s, female, male, other, predator } = scene();
  female.pos = pos(32);
  male.pos = pos(35);
  other.pos = pos(39);
  predator.pos = pos(31);
  s.animals = [other, male, female, predator];
  Aquatic.tick(s);
  assert.equal(female.state, 'fuga do predador');
  assert.equal(male.state, 'fuga por alerta');
  assert.equal(male.alarm.source, female.id);
  assert.equal(male.alarm.origin, pos(31));
  assert.equal(other.alarm, null);
  assert.equal(s.cognitionEvents.alarms, 1);
  assert.equal(s.cognitionEvents.alarmResponses, 1);
  assert.ok(budget(s));
});

test('nearby dominant females receive priority at a contested fruit patch', () => {
  const { s, female, male } = scene();
  const fruit = pos(34);
  s.animals = [male, female];
  s.step = 1;
  s.day = .25;
  female.pos = fruit;
  male.pos = pos(35);
  for (const c of s.cells) {
    if (!c.channel) Object.assign(c, { b: .015, fruit: 0, fruitN: 0, sp: -1 });
  }
  Object.assign(s.cells[fruit], { sp: 6, phase: 'fruto', b: .12, fruit: .08, fruitN: .0064 });
  Aquatic.tick(s);
  assert.ok(female.rank > male.rank);
  assert.equal(female.state, 'comendo fruit');
  assert.equal(male.state, 'cedendo alimento');
  assert.equal(s.cognitionEvents.yielding, 1);
  assert.ok(budget(s));
});

test('social grooming prefers recognized kin and solo grooming remains possible', () => {
  const { s, female, male, other } = scene();
  const lone = s.animals[4];
  s.animals = [female, male, other, lone];
  female.motherId = other.motherId = 0 + 100;
  female.pos = male.pos = other.pos = pos(34);
  lone.pos = pos(39, 22);
  for (const a of s.animals) {
    a.state = 'repouso';
    a.hygiene = .95;
  }
  Vertebrates.family(s);
  assert.equal(female.groomingId, other.id);
  assert.equal(other.groomingId, female.id);
  assert.ok(female.hygiene < .95 && other.hygiene < .95);
  assert.equal(lone.grooming, 'self');
  assert.equal(s.cognitionEvents.socialGrooming, 1);
});

test('maternal care has age-dependent nursing and preserves the material ledger', () => {
  const { s, female } = scene();
  function familyScenario(age) {
    const q = roundTrip(s);
    const mother = q.animals[0];
    const infant = { ...mother, id: q.nextAnimal++, c: .02, n: .0016, mother: mother.id,
      motherId: mother.id, pos: pos(34), age, water: .95 };
    mother.pos = pos(35);
    q.animals = [mother, infant];
    Aquatic.tick(q);
    assert.equal(infant.pos, mother.pos);
    assert.equal(mother.careId, infant.id);
    assert.ok(infant.nursing > 0);
    assert.ok(budget(q));
    return infant.nursing;
  }
  assert.ok(familyScenario(12) > familyScenario(120));
});

test('restoring attachment data leaves ongoing grooming and its counters intact', () => {
  const { s, female, male } = scene();
  female.pos = male.pos = pos(34);
  female.motherId = male.motherId = 100;
  female.hygiene = male.hygiene = .95;
  s.animals = [female, male];
  Vertebrates.family(s);
  assert.equal(s.cognitionEvents.socialGrooming, 1);
  const restored = roundTrip(s);
  Vertebrates.family(restored, { interactions: false });
  assert.equal(restored.cognitionEvents.socialGrooming, 1);
  assert.deepEqual(restored.animals.map(a => a.grooming), s.animals.map(a => a.grooming));
  assert.deepEqual(restored.animals.map(a => a.hygiene), s.animals.map(a => a.hygiene));
});

test('distant social grooming is staggered and single grooming still runs', () => {
  const { s, female, male, other } = scene();
  female.pos = male.pos = pos(34);
  other.pos = pos(38);
  female.motherId = male.motherId = 100;
  female.hygiene = male.hygiene = .7;
  other.hygiene = .95;
  s.animals = [female, male, other];
  s.step = 1;
  Vertebrates.family(s, { detailed: () => false });
  assert.equal(s.cognitionEvents.socialGrooming, 0);
  assert.equal(other.grooming, 'self');
  s.step = 3;
  Vertebrates.family(s, { detailed: () => false });
  assert.equal(s.cognitionEvents.socialGrooming, 1);
});

test('an older dependent juvenile learns the final shelter used by its mother', () => {
  const { s, female } = scene();
  const infant = { ...female, id: s.nextAnimal++, age: 70, c: .025,
    n: .002, mother: female.id, motherId: female.id, memory: [] };
  female.pos = pos(35);
  s.animals = [infant, female];
  Aquatic.tick(s);
  assert.equal(female.state, 'abrigado');
  assert.equal(infant.pos, female.pos);
  assert.ok(infant.memory.some(z => z.kind === 'shelter' && z.i === female.pos));
  assert.ok(budget(s));
});

test('a subordinate can take alternative forage and still record who yielded to whom', () => {
  const { s, female, male } = scene();
  s.animals = [male, female];
  s.step = 1;
  s.day = .25;
  female.pos = pos(34);
  male.pos = pos(35);
  for (const c of s.cells) {
    if (!c.channel) Object.assign(c, { b: .015, fruit: 0, fruitN: 0, sp: -1 });
  }
  Object.assign(s.cells[female.pos], { sp: 6, phase: 'fruto', b: .12, fruit: .08, fruitN: .0064 });
  Object.assign(s.cells[male.pos], { sp: 2, b: .1 });
  Aquatic.tick(s);
  assert.equal(male.state, 'comendo leaf');
  assert.equal(male.yieldedTo, female.id);
  assert.equal(s.cognitionEvents.yielding, 1);
  assert.ok(budget(s));
});

test('a watchful individual senses nearby danger that a less cautious individual misses', () => {
  const { s, female, predator } = scene();
  female.pos = pos(34);
  predator.pos = pos(32);
  s.animals = [female, predator];
  const lessCautious = roundTrip(s);
  female.personality.caution = .95;
  lessCautious.animals[0].personality.caution = .05;
  Aquatic.tick(s);
  Aquatic.tick(lessCautious);
  assert.equal(female.state, 'fuga do predador');
  assert.equal(lessCautious.animals[0].alarm, null);
});

test('a predator in adjacent unsuitable habitat still triggers a local alarm', () => {
  const { s, female, predator } = scene();
  female.pos = 14;
  predator.pos = 13;
  s.animals = [female, predator];
  assert.equal(s.cells[female.pos].kind, 'valley');
  assert.equal(s.cells[predator.pos].kind, 'humid');

  Aquatic.tick(s);

  assert.equal(female.state, 'fuga do predador');
  assert.equal(female.alarm.origin, 13);
  assert.ok(budget(s));
});
