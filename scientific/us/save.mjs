// Offline field snapshot. Keep region and layout version distinct from the release number.
import {initialState} from './soil_cell.mjs';
import {validateSteward} from './steward.mjs';

const soilPools = Object.keys(initialState());
const saveRegion = 'us-blue-ridge';
const saveVersion = 1;
function requireFieldValue(valid, label) {
  if (!valid) throw new Error('Save continental inválido (' + label + ')');
}
function validateFieldSave(data) {
  requireFieldValue(data?.region === saveRegion && data.version === saveVersion, 'região ou versão');
  const {world, player} = data;
  const size = world?.w * world?.h;
  requireFieldValue(Number.isInteger(world?.w) && world.w >= 3 && Number.isInteger(world.h) &&
    world.h >= 3 && size <= 16384 && Array.isArray(world.cells) && world.cells.length === size, 'malha');
  requireFieldValue(Number.isSafeInteger(world.day) && world.day >= 0 && Number.isSafeInteger(world.seed), 'relógio');
  const stock = value => Number.isFinite(value) && value >= 0;
  for (const cell of world.cells) {
    requireFieldValue(Number.isFinite(cell?.z) && stock(cell.surface) &&
      soilPools.every(key => stock(cell.soil?.[key])), 'célula');
  }
  if (world.day > 0 || world.last !== null) {
    const climate = world.last?.climate;
    requireFieldValue(Number.isFinite(climate?.tempC) && stock(climate.rainMm) &&
      stock(climate.light) && climate.light <= 1, 'clima');
    const ledger = world.last?.ledger;
    requireFieldValue(ledger && ['precipitation','evap','drainage','outflow','respiredC','carbonUptake','leachedN']
      .every(key => stock(ledger[key])), 'balanço');
  }
  requireFieldValue(stock(player?.x) && stock(player.y) &&
    ['up','down','left','right'].includes(player.dir), 'protagonista');
  validateSteward(world);
  return {world,player};
}

export function encodeFieldSave(world, player) {
  const data = {region:saveRegion,version:saveVersion,world,player};
  validateFieldSave(data);
  return JSON.stringify(data);
}

export function decodeFieldSave(text) {
  return validateFieldSave(JSON.parse(text));
}
