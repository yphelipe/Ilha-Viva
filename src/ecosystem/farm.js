/* Campo 05: experimental agriculture in the ecosystem's normalized units. */
const Farm = (() => {
  const EcoGrid = typeof module !== 'undefined' ? require('./ecology') : Eco;
  const crops = {
    beans: { name: 'Feijão', days: 24, water: .42, temp: 25, n: .08, p: .012 },
    rice: { name: 'Arroz de sequeiro', days: 36, water: .65, temp: 27, n: .09, p: .01 },
    sweet: { name: 'Batata-doce', days: 32, water: .35, temp: 26, n: .065, p: .015 },
  };
  const items = {
    fruit: { name: 'Frutos silvestres', category: 'Alimentos', stack: 20 },
    beans: { name: 'Feijão', category: 'Alimentos', stack: 20 },
    rice: { name: 'Arroz', category: 'Alimentos', stack: 20 },
    sweet: { name: 'Batata-doce', category: 'Alimentos', stack: 20 },
    water: { name: 'Água potável', category: 'Suprimentos', stack: 10 },
    raw_water: { name: 'Água bruta', category: 'Suprimentos', stack: 10 },
    irrigation: { name: 'Carga de regador', category: 'Suprimentos', stack: 10 },
    organic: { name: 'Resíduos vegetais', category: 'Materiais', stack: 20 },
    compost: { name: 'Composto orgânico', category: 'Materiais', stack: 20 },
    wood: { name: 'Madeira', category: 'Materiais', stack: 20 },
    stone: { name: 'Pedra', category: 'Materiais', stack: 20 },
    meal: { name: 'Refeição cozida', category: 'Alimentos', stack: 10 },
    mallet: { name: 'Malho de madeira', category: 'Ferramentas', stack: 1 },
    chest: { name: 'Baú', category: 'Objetos', stack: 5 },
    fence: { name: 'Cerca', category: 'Objetos', stack: 10 },
    cookfire: { name: 'Fogareiro', category: 'Objetos', stack: 5 },
  };
  for (const k of Object.keys(crops)) items['seed_' + k] = { name: 'Semente: ' + crops[k].name, category: 'Sementes', stack: 20 };

  const cap = 12;
  const seedCap = 60;
  const compostCap = 4;
  const organicUnit = .02;
  const organicP = .15;
  const clamp = x => Math.max(0, Math.min(1, x));
  const positiveInt = q => Number.isSafeInteger(q) && q > 0;
  const pool = () => ({ c: 0, n: 0, units: 0 });
  const barePlot = () => ({ crop: null, drain: null, lastCrop: null, repeats: 0, fallowDays: 0 });

  function slots(b) {
    return Object.entries(b).reduce((n, [k, q]) => n + (Object.hasOwn(items, k) ? Math.ceil(q / items[k].stack) : 0), 0);
  }

  function validBag(b, limit = cap) {
    return !!b && typeof b === 'object' && !Array.isArray(b) && Object.entries(b).every(([k, q]) => Object.hasOwn(items, k) && Number.isSafeInteger(q) && q >= 0) && slots(b) <= limit;
  }

  function canAdd(b, k, q) {
    return Object.hasOwn(items, k) && positiveInt(q) && slots({ ...b, [k]: (b[k] || 0) + q }) <= cap;
  }

  function add(b, k, q) {
    if (!canAdd(b, k, q)) return false;
    b[k] = (b[k] || 0) + q;
    return true;
  }

  function take(b, k, q) {
    if (!Object.hasOwn(items, k) || !positiveInt(q) || (b[k] || 0) < q) return false;
    b[k] -= q;
    return true;
  }

  function create() {
    return {
      plots: {}, compost: {}, materials: { organic: pool(), compost: pool() }, seedStore: {},
      ledger: { photo: 0, resp: 0, water: 0, harvestC: 0, harvestN: 0, harvestP: 0, seedC: 0, seedN: 0, seedP: 0, compostResp: 0 },
      events: { planted: 0, harvested: 0, failed: 0, seeds: 0, composted: 0, fertilized: 0, drained: 0 },
      last: { c: 0, n: 0, p: 0, w: 0 },
    };
  }

  function migrate(f) {
    const defaults = create();
    return {
      ...defaults, ...f,
      plots: Object.fromEntries(Object.entries(f.plots).map(([i, p]) => [i, { ...barePlot(), ...p }])),
      ledger: { ...defaults.ledger, ...f.ledger },
      events: { ...defaults.events, ...f.events },
    };
  }

  function valid(f, s, b) {
    const record = value => value && typeof value === 'object' && !Array.isArray(value);
    const amount = value => Number.isFinite(value) && value >= 0;
    const count = value => Number.isSafeInteger(value) && value >= 0;
    const fraction = value => amount(value) && value <= 1;
    const validPool = value => record(value) && count(value.units) && amount(value.c) && amount(value.n)
      && (value.units > 0 || (value.c === 0 && value.n === 0));
    const validCell = key => {
      const i = Number(key);
      return count(i) && String(i) === key && s.cells[i] && !s.cells[i].channel;
    };
    if (!record(f) || !validBag(b)) return false;
    const defaults = create();
    if (!Object.keys(defaults).every(key => record(f[key]))) return false;
    if (!Object.keys(defaults.ledger).every(key => amount(f.ledger[key]))
      || !Object.keys(defaults.events).every(key => amount(f.events[key]))
      || !Object.keys(defaults.last).every(key => Number.isFinite(f.last[key]))) return false;
    for (const k of ['organic', 'compost']) {
      if (!validPool(f.materials[k]) || f.materials[k].units !== (b[k] || 0)) return false;
    }
    const seeds = Object.entries(f.seedStore);
    if (!seeds.every(([key, value]) => Object.hasOwn(crops, key) && count(value))
      || seeds.reduce((sum, [, value]) => sum + value, 0) > seedCap) return false;
    for (const [key, pile] of Object.entries(f.compost)) {
      if (!validCell(key) || !validPool(pile) || pile.units < 1 || pile.units > compostCap || !fraction(pile.progress)) return false;
    }
    for (const [key, plot] of Object.entries(f.plots)) {
      if (!validCell(key) || !record(plot) || !count(plot.repeats) || !amount(plot.fallowDays) || plot.fallowDays > 21
        || (plot.lastCrop !== null && !Object.hasOwn(crops, plot.lastCrop))) return false;
      if (plot.crop !== null && (!Object.hasOwn(crops, plot.crop) || f.compost[key] || !fraction(plot.progress)
        || !['age', 'c', 'n', 'p', 'stress'].every(prop => amount(plot[prop])))) return false;
      if (plot.drain !== null) {
        const source = s.cells[key], outlet = s.cells[plot.drain];
        if (!count(plot.drain) || !outlet || outlet.y !== source.y + 1 || Math.abs(outlet.x - source.x) > 1) return false;
      }
    }
    return true;
  }

  function bag() {
    return { seed_beans: 8, seed_rice: 5, seed_sweet: 5, water: 5, irrigation: 10, fruit: 0, wood: 10, stone: 6 };
  }

  function till(f, s, i) {
    const c = s.cells[i];
    if (!c || c.channel || c.surface > 8 || c.b > .16 || f.plots[i]?.crop || f.compost[i]) return false;
    f.plots[i] ??= barePlot();
    return true;
  }

  function drain(f, s, i) {
    const c = s.cells[i], p = f.plots[i];
    if (!p || !c || c.channel) return false;
    if (p.drain != null) {
      p.drain = null;
      return true;
    }
    const row = s.aqua?.[c.y + 1];
    if (!row?.ids.length) return false;
    const channel = s.cells[row.ids.reduce((best, x) => Math.abs(s.cells[x].x - c.x) < Math.abs(s.cells[best].x - c.x) ? x : best)];
    p.drain = Number(i) + EcoGrid.W + Math.sign(channel.x - c.x);
    return true;
  }

  function plant(f, s, b, i, k) {
    const c = s.cells[i], p = f.plots[i];
    if (!p || p.crop || !c || c.channel || c.surface > 8 || f.compost[i] || !Object.hasOwn(crops, k) || !take(b, 'seed_' + k, 1)) return false;
    Object.assign(p, { crop: k, age: 0, progress: 0, c: .004, n: .00032, p: .000048, stress: 0 });
    f.ledger.seedC += p.c;
    f.ledger.seedN += p.n;
    f.ledger.seedP += p.p;
    f.events.planted++;
    return true;
  }

  function finishCrop(f, i) {
    const p = f.plots[i];
    f.plots[i] = {
      ...barePlot(), drain: p.drain, lastCrop: p.crop,
      repeats: p.lastCrop === p.crop && p.fallowDays < 21 ? p.repeats + 1 : 1,
    };
  }

  function collectCrop(f, b, i, seeds) {
    const p = f.plots[i];
    if (!p?.crop || p.progress < 1 || p.c < (seeds ? .016 : .012)) return false;
    const quantity = Math.floor(p.c / (seeds ? .008 : .012));
    if (!add(b, seeds ? 'seed_' + p.crop : p.crop, quantity)) return false;
    f.ledger.harvestC += p.c;
    f.ledger.harvestN += p.n;
    f.ledger.harvestP += p.p;
    if (seeds) f.events.seeds += quantity;
    finishCrop(f, i);
    f.events.harvested++;
    return true;
  }

  const harvest = (f, b, i) => collectCrop(f, b, i, false);
  const harvestSeeds = (f, b, i) => collectCrop(f, b, i, true);

  function storeSeeds(f, b, k, q = 1) {
    const count = Object.values(f.seedStore).reduce((total, stored) => total + stored, 0);
    if (!Object.hasOwn(crops, k) || !positiveInt(q) || count + q > seedCap || !take(b, 'seed_' + k, q)) return false;
    f.seedStore[k] = (f.seedStore[k] || 0) + q;
    return true;
  }

  function withdrawSeeds(f, b, k, q = 1) {
    if (!Object.hasOwn(crops, k) || !positiveInt(q) || (f.seedStore[k] || 0) < q || !add(b, 'seed_' + k, q)) return false;
    f.seedStore[k] -= q;
    return true;
  }

  function transferUnit(from, to) {
    const c = from.c / from.units, n = from.n / from.units;
    from.c -= c;
    from.n -= n;
    from.units--;
    to.c += c;
    to.n += n;
    to.units++;
  }

  function gatherOrganic(f, s, b, i) {
    const c = s.cells[i];
    if (!c || c.channel || c.surface > 8 || c.litter < organicUnit || !add(b, 'organic', 1)) return false;
    const n = c.ln * organicUnit / c.litter;
    c.litter -= organicUnit;
    c.ln -= n;
    const stock = f.materials.organic;
    stock.c += organicUnit;
    stock.n += n;
    stock.units++;
    s.ledger.carbonOut += organicUnit;
    s.ledger.nOut += n;
    s.ledger.pOut += n * organicP;
    return true;
  }

  function compostDeposit(f, s, b, i) {
    const c = s.cells[i], pile = f.compost[i], stock = f.materials.organic;
    if (!c || c.channel || c.surface > 8 || c.b > .16 || f.plots[i]?.crop || !stock.units || pile?.units >= compostCap || pile?.progress >= 1 || !take(b, 'organic', 1)) return false;
    const target = f.compost[i] ??= { ...pool(), progress: 0 };
    target.progress *= target.units / (target.units + 1);
    transferUnit(stock, target);
    return true;
  }

  function compostCollect(f, b, i) {
    const pile = f.compost[i];
    if (!pile || pile.progress < 1 || !add(b, 'compost', 1)) return false;
    transferUnit(pile, f.materials.compost);
    if (!pile.units) delete f.compost[i];
    f.events.composted++;
    return true;
  }

  function fertilize(f, s, b, i, k = 'compost') {
    if (k !== 'organic' && k !== 'compost') return false;
    const c = s.cells[i], stock = f.materials[k];
    if (!c || c.channel || c.surface > 8 || !f.plots[i] || f.compost[i] || !stock.units || !take(b, k, 1)) return false;
    const portion = pool();
    transferUnit(stock, portion);
    const mineralN = k === 'compost' ? .35 * portion.n : 0;
    c.litter += portion.c;
    c.ln += portion.n - mineralN;
    c.n += mineralN;
    c.soilP += mineralN * organicP;
    s.ledger.externalC = (s.ledger.externalC || 0) + portion.c;
    s.ledger.externalN = (s.ledger.externalN || 0) + portion.n;
    s.ledger.externalP += portion.n * organicP;
    f.events.fertilized++;
    return true;
  }

  function rotation(p, k) {
    if (!p || p.lastCrop !== k || p.fallowDays >= 21) return 1;
    return 1 - Math.min(.35, .12 * p.repeats) * (1 - p.fallowDays / 21);
  }

  function soil(f, s, i) {
    const c = s.cells[i], p = f.plots[i];
    if (!c || c.channel) return null;
    return {
      fertility: clamp(Math.min(c.n / .12, c.soilP / .012)),
      micro: c.micro, litter: c.litter, nitrogen: c.n, phosphorus: c.soilP,
      rotation: rotation(p, p?.crop ?? p?.lastCrop), lastCrop: p?.lastCrop ?? null,
      fallowDays: p?.fallowDays ?? 0, drain: p?.drain ?? null,
    };
  }

  // Include the managed soils (even after a crop dies) and their ditch outlets.
  function totals(f, s, cells) {
    const t = { c: 0, n: 0, p: 0, w: 0 };
    for (const i of cells) {
      const c = s.cells[i], p = f.plots[i];
      t.c += c.litter + (p?.c || 0);
      t.n += c.ln + c.n + (p?.n || 0);
      t.p += c.ln * organicP + c.soilP + (p?.p || 0);
      t.w += c.water + c.surface;
    }
    for (const pile of Object.values(f.compost)) {
      t.c += pile.c;
      t.n += pile.n;
      t.p += pile.n * organicP;
    }
    return t;
  }

  function tick(f, s) {
    const cells = new Set(Object.keys(f.plots).map(Number));
    for (const p of Object.values(f.plots)) if (p.drain != null && s.cells[p.drain]) cells.add(p.drain);
    const before = totals(f, s, cells), ledger = { ...f.ledger };
    // Apply discharges together so a chain of ditches cannot move water several cells in one tick.
    const discharge = [];
    for (const [i, p] of Object.entries(f.plots)) {
      if (p.drain == null || !s.cells[p.drain]) continue;
      const c = s.cells[i];
      const surface = Math.min(6, c.surface * .55);
      const soilWater = Math.min(3, Math.max(0, c.water - c.cap * .72) * .22);
      c.surface -= surface;
      c.water -= soilWater;
      discharge.push([p.drain, surface + soilWater]);
    }
    for (const [i, water] of discharge) {
      s.cells[i].surface += water;
      f.events.drained += water;
    }
    for (const [i, pile] of Object.entries(f.compost)) {
      if (pile.progress >= 1) continue;
      const c = s.cells[i], moisture = c.water / c.cap;
      const active = clamp(c.micro) * clamp(c.oxygen / .6) * clamp(moisture / .38)
        * clamp((1.04 - moisture) / .32) * clamp(1 - Math.abs(s.temp - 27) / 22)
        * clamp(1 - c.surface / 12);
      const advance = Math.min(1 - pile.progress, active / 32);
      const breath = pile.c * advance * .42;
      pile.progress += advance;
      pile.c -= breath;
      f.ledger.compostResp += breath;
    }
    const hour = (s.step + 3) % 4;
    const light = s.light === 'dark' ? 0 : [0, .72, 1, .22][hour] * (1 - s.cloud * .65);
    for (const [i, p] of Object.entries(f.plots)) {
      if (!p.crop) {
        p.fallowDays = Math.min(21, p.fallowDays + .25);
        continue;
      }
      const c = s.cells[i], k = crops[p.crop], m = c.water / c.cap;
      p.age += .25;
      let fit = clamp(m / k.water) * clamp((1.12 - m) / .32) * clamp(1 - Math.abs(s.temp - k.temp) / 18)
        * clamp(c.n / .12) * clamp(c.soilP / .012) * clamp(c.oxygen / .6) * (.90 + .10 * clamp(c.micro))
        * rotation(p, p.crop) / (1 + c.b * 3);
      if (c.surface > 8) fit *= .1;
      const growth = Math.min(.003 * light * fit, c.n / k.n, c.soilP / k.p, c.water / 12, Math.max(0, .16 - p.c));
      p.c += growth;
      p.n += growth * k.n;
      p.p += growth * k.p;
      c.n -= growth * k.n;
      c.soilP -= growth * k.p;
      c.water -= growth * 12;
      s.ledger.nOut += growth * k.n;
      s.ledger.pOut += growth * k.p;
      s.ledger.waterOut += growth * 12;
      f.ledger.photo += growth;
      f.ledger.water += growth * 12;
      const resp = Math.min(p.c, .000045);
      p.c -= resp;
      f.ledger.resp += resp;
      p.progress = Math.min(1, p.progress + fit * (light > 0 ? 1 / 3 : 0) / k.days);
      p.stress = Math.max(0, p.stress + (fit < .15 ? .25 : -.12));
      if (p.stress > 12 || p.c < .0001) {
        // The ecology stores litter phosphorus implicitly as 0.15 × litter nitrogen.
        // When the crop has less P per N, return the remainder of its N as mineral N.
        const litterN = Math.min(p.n, p.p / organicP);
        c.litter += p.c;
        c.ln += litterN;
        c.n += p.n - litterN;
        c.soilP += Math.max(0, p.p - litterN * organicP);
        s.ledger.externalC = (s.ledger.externalC || 0) + p.c;
        s.ledger.externalN = (s.ledger.externalN || 0) + p.n;
        s.ledger.externalP += p.p;
        finishCrop(f, i);
        f.events.failed++;
      }
    }
    const after = totals(f, s, cells);
    f.last = {
      c: after.c - before.c - (f.ledger.photo - ledger.photo) + (f.ledger.resp - ledger.resp) + (f.ledger.compostResp - ledger.compostResp),
      n: after.n - before.n, p: after.p - before.p, w: after.w - before.w + (f.ledger.water - ledger.water),
    };
  }

  return {
    crops, items, cap, seedCap, compostCap, slots, validBag, canAdd, add, take, create, migrate, valid, bag, till, drain,
    plant, harvest, harvestSeeds, storeSeeds, withdrawSeeds, gatherOrganic, compostDeposit, compostCollect, fertilize, soil, tick,
  };
})();
if (typeof module !== 'undefined') module.exports = Farm;
