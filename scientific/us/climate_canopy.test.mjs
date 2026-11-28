import test from 'node:test';
import assert from 'node:assert/strict';
import {weather, daylightHours, profile} from './world.mjs';
import {initialState, stepSoil} from './soil_cell.mjs';

test('Asheville station normal units, calendar and expected synthetic precipitation', () => {
  assert.ok(Math.abs(profile.tempC[0] - 3.7222222) < 1e-6);
  assert.ok(Math.abs(profile.precipMm[0] - 104.902) < 1e-9);
  assert.equal(weather(31, 3).month, 1);
  assert.equal(weather(365, 3).month, 0);
  let rain = 0, wet = 0, temp = 0;
  for (let year = 0; year < 500; year++) {
    for (let day = 0; day < 31; day++) {
      const climate = weather(year * 365 + day, 4801);
      rain += climate.rainMm;
      temp += climate.tempC;
      wet += Number(climate.rainMm > 0);
    }
  }
  assert.ok(Math.abs(rain / 500 - profile.precipMm[0]) < 4);
  assert.ok(Math.abs(wet / 500 - profile.wetDays[0]) < 0.4);
  assert.ok(Math.abs(temp / (500*31) - profile.tempC[0]) < 0.2);
});

test('astronomical photoperiod repeats yearly and changes with latitude and season', () => {
  assert.equal(daylightHours(0, 0), 12);
  assert.ok(daylightHours(171) > 14 && daylightHours(171) < 15);
  assert.ok(daylightHours(354) > 9 && daylightHours(354) < 10.5);
  assert.equal(daylightHours(171), daylightHours(536));
  assert.ok(daylightHours(171, -35) < daylightHours(354, -35));
});

test('canopy and available root-zone water control transpiration and shade', () => {
  const live = initialState();
  const climate = {tempC:20, light:0.8, rainMm:0};
  const soil = state => stepSoil(state, climate).flux;
  const bare = soil({...live, plantC:0, plantN:0});
  const green = soil(live);
  assert.equal(bare.transpiration, 0);
  assert.ok(green.transpiration > 0 && green.soilEvap < bare.soilEvap);
  assert.equal(green.evap, green.soilEvap + green.transpiration);
  assert.equal(soil({...live,water:0}).transpiration, 0);
  assert.ok(soil({...live,water:5}).transpiration < green.transpiration);
  assert.equal(stepSoil(live,{...climate,light:0}).flux.transpiration,0);
  assert.equal(stepSoil(live,{...climate,tempC:-1}).flux.evap,0);
});

test('CP-10 plant groups transpire once and expose the daily water partition', async () => {
  const {initFlora,floraAdvance} = await import('./flora.mjs');
  const simulation = initFlora(4,4,23,2,true);
  const next = floraAdvance(simulation,{tempC:20,light:.7,rainMm:0});
  const ledger = next.world.last.ledger;
  assert.ok(ledger.transpiration > 0 && ledger.soilEvap > 0);
  assert.ok(Math.abs(ledger.evap-ledger.soilEvap-ledger.transpiration)<1e-10);
});
