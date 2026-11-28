// Prototype decisions for one grower servicing a fixed kitchen garden.
// Each of the four plots occupies one 10 m × 10 m scientific cell.
const gardenPolicy = Object.freeze({
  tankCapacityMm: 4,   // 400 L over 100 m² (1 mm = 1 L/m²).
  dailyWorkMm: 0.4,   // 40 L carried daily, an experimental labour budget.
  targetWaterMm: 70,  // Operational target in the simplified soil bucket.
  maxObservedLossMm: 12,
  dailyRetention: 0.95,
  observationWeight: 0.4,
});

function gardenCells(world) {
  const home = Math.floor(world.h/2)*world.w + Math.floor(world.w/2);
  return {home, indices:[home-world.w, home-1, home+1, home+world.w]};
}

function initialSteward(world) {
  const {home,indices} = gardenCells(world);
  return {
    id:'hortelao-01', home, tankMm:0, day:null,
    plots:indices.map(index=>({index, lossMm:0, waterAfterMm:world.cells[index].soil.water})),
    last:{action:'inspect', target:null, mm:0, capturedMm:0, reason:'Primeira ronda da horta.'}
  };
}

function inRange(value, low, high) {
  return Number.isFinite(value) && value>=low && value<=high;
}

// Throws before a save with invalid memory, locations or storage is accepted.
export function validateSteward(world) {
  const s = world.steward;
  if (s === undefined) return true;
  const {home,indices} = gardenCells(world);
  if (!s || s.id!=='hortelao-01' || s.home!==home ||
      !inRange(s.tankMm,0,gardenPolicy.tankCapacityMm) ||
      !Number.isInteger(s.day) || s.day<0 || s.day>world.day ||
      !Array.isArray(s.plots) || s.plots.length!==indices.length)
    throw Error('Reserva ou identificação inválida do hortelão.');
  for (const [i,p] of s.plots.entries()) {
    if (!p || p.index!==indices[i] ||
        !inRange(p.lossMm,0,gardenPolicy.maxObservedLossMm) ||
        !inRange(p.waterAfterMm,0,Infinity))
      throw Error('Memória de talhão inválida.');
  }
  const e = s.last;
  if (!e || typeof e.reason!=='string' || e.reason.length>160 ||
      !inRange(e.capturedMm,0,gardenPolicy.tankCapacityMm) ||
      !inRange(e.mm,0,gardenPolicy.dailyWorkMm) ||
      !(e.action==='inspect' && e.target===null && e.mm===0 ||
        e.action==='irrigate' && indices.includes(e.target) && e.mm>0))
    throw Error('Registro de rega inválido.');
  return true;
}

// The grower encounters only the yard catchment and four adjoining plots.
// Mutates the newly advanced world's water and memory, once per simulated day.
export function stepSteward(world) {
  const previous = world.steward ?? initialSteward(world);
  if (previous.day===world.day) return previous;
  const elapsed = previous.day===null ? 0 : world.day-previous.day;
  if (elapsed<0) throw Error('O relógio do hortelão retrocedeu.');

  const {home} = previous;
  const yard = world.cells[home];
  const climate = world.last?.climate;
  const aboveFreezing = climate && climate.tempC-(yard.z-650)*0.0065>0;
  const capturedMm = aboveFreezing ? Math.min(yard.surface,gardenPolicy.tankCapacityMm-previous.tankMm) : 0;
  yard.surface -= capturedMm;
  let tankMm = previous.tankMm+capturedMm;
  let candidate = null, bestDeficit = 0;
  const plots = previous.plots.map(p=>{
    const cell = world.cells[p.index], water = cell.soil.water;
    let lossMm = p.lossMm * gardenPolicy.dailyRetention**elapsed;
    const thawed = climate && climate.tempC-(cell.z-650)*0.0065>0 && cell.soil.snow===0;
    if (elapsed===1 && thawed && climate.rainMm===0) {
      // Net change since our previous post-irrigation reading, not a causal
      // estimate of transpiration alone. Only consecutive dry visits train it.
      const observed = Math.min(gardenPolicy.maxObservedLossMm,Math.max(0,p.waterAfterMm-water));
      lossMm += gardenPolicy.observationWeight*(observed-lossMm);
    }
    const record = {index:p.index, lossMm, waterAfterMm:water};
    const deficit = gardenPolicy.targetWaterMm-water+lossMm;
    if (thawed && cell.soil.plantC>0 && water<gardenPolicy.targetWaterMm && deficit>bestDeficit) {
      candidate = record;
      bestDeficit = deficit;
    }
    return record;
  });

  let last = {action:'inspect',target:null,mm:0,capturedMm,reason:'Os talhões dispensam rega hoje.'};
  if (!aboveFreezing) last.reason = 'A rega está suspensa pelo frio.';
  else if (candidate && tankMm<=0) last.reason = 'Talhão seco, cisterna vazia.';
  else if (candidate) {
    const cell = world.cells[candidate.index];
    const mm = Math.min(tankMm,gardenPolicy.dailyWorkMm,gardenPolicy.targetWaterMm-cell.soil.water);
    tankMm -= mm;
    cell.soil.water += mm;
    candidate.waterAfterMm = cell.soil.water;
    last = {action:'irrigate',target:candidate.index,mm,capturedMm,
            reason:'Rega pela umidade medida e pela perda aprendida no talhão.'};
  }
  world.steward = {id:previous.id,home,day:world.day,tankMm,plots,last};
  return world.steward;
}
