// Run the same continental world and local steward as the offline field, without the player.
import {advance, newWorld, profile, totals} from '../scientific/us/world.mjs';
import {stepSteward} from '../scientific/us/steward.mjs';

const [dayArg='1095', seedArg='4801'] = process.argv.slice(2);
const days = Number(dayArg), seed = Number(seedArg);
if (!Number.isSafeInteger(seed) || !Number.isInteger(days) || days < 1 || days > 36500) {
  throw Error('Uso: node tools/diagnose_us.mjs [dias de 1 a 36500] [seed inteira]');
}
let world = newWorld(16,12,seed);
const area = profile.cellM ** 2;
const maxDailyResidual = {waterM3:0, carbonKg:0, nitrogenKg:0};
const cumulative = {rainM3:0, transpiredM3:0, evaporatedSoilM3:0, boundaryRunoffM3:0,
  deepDrainageM3:0, atmosphericCarbonInKg:0, respiredCarbonKg:0, deepNitrogenOutKg:0};
const actions = {};
let peakSnowMm=0, peakPlantCarbon=0;
const start = totals(world);
for (let day = 0; day < days; day++) {
  const before = totals(world);
  world = advance(world);
  const steward = stepSteward(world);
  const name = steward.last.action;
  actions[name] = (actions[name] ?? 0) + 1;
  const after = totals(world), flux = world.last.ledger;
  const errors = {
    waterM3:(after.water - before.water - flux.precipitation + flux.evap + flux.drainage + flux.outflow)*area/1000,
    carbonKg:(after.C - before.C - flux.carbonUptake + flux.respiredC)*area,
    nitrogenKg:(after.N - before.N + flux.leachedN)*area
  };
  for (const [key, value] of Object.entries(errors)) {
    if (!Number.isFinite(value) || Math.abs(value)>1e-7) throw Error('Balanço '+key+' no dia '+world.day+': '+value);
    maxDailyResidual[key] = Math.max(maxDailyResidual[key], Math.abs(value));
  }
  for (const cell of world.cells) {
    if (![cell.surface,...Object.values(cell.soil)].every(v=>Number.isFinite(v)&&v>=0)) {
      throw Error('Estoque inválido no dia '+world.day);
    }
    peakSnowMm = Math.max(peakSnowMm,cell.soil.snow);
    peakPlantCarbon = Math.max(peakPlantCarbon,cell.soil.plantC);
  }
  cumulative.rainM3 += flux.precipitation*area/1000;
  cumulative.transpiredM3 += flux.transpiration*area/1000;
  cumulative.evaporatedSoilM3 += flux.soilEvap*area/1000;
  cumulative.boundaryRunoffM3 += flux.outflow*area/1000;
  cumulative.deepDrainageM3 += flux.drainage*area/1000;
  cumulative.atmosphericCarbonInKg += flux.carbonUptake*area;
  cumulative.respiredCarbonKg += flux.respiredC*area;
  cumulative.deepNitrogenOutKg += flux.leachedN*area;
}
function physical(stocks) {
  return {waterM3:stocks.water*area/1000, carbonKg:stocks.C*area, nitrogenKg:stocks.N*area};
}
const end = totals(world);
const findings = [];
// Diagnose changes in stocks for follow-up; conservation alone cannot establish ecological stability.
const deltaCarbonKg = (end.C-start.C)*area;
if (deltaCarbonKg < 0) findings.push({code:'net-carbon-loss', kg:-deltaCarbonKg,
  cause:'A respiração acumulada excedeu a fixação de carbono.'});
if (end.N < start.N) findings.push({code:'net-nitrogen-export', kg:(start.N-end.N)*area,
  cause:'A drenagem profunda exporta N e o piloto ainda carece de reposição externa.'});
console.log(JSON.stringify({profile:profile.id, days, seed, cells:world.cells.length,
  cellDays:days*world.cells.length, start:physical(start), end:physical(end),findings,
  maxDailyResidual,cumulative,peakSnowWaterEquivalentMm:peakSnowMm,
  peakPlantCarbonKgPerM2:peakPlantCarbon,stewardActions:actions}, null, 2));
