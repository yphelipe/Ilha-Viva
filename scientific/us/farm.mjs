// Field actions exchange kg of C/N with the CP-10 vegetation pools (kg/m²).
import {initFlora,floraAdvance,floraHarvest,decodeFlora,floraReport} from './flora.mjs';
import {profile} from './world.mjs';
import {stepSteward,validateSteward} from './steward.mjs';

const area = profile.cellM ** 2;
const initialStarts = 6;
const startC = 0.8; // kg C per batch of vegetative starts, a gameplay parameter.
const startN = startC / 18;
const nonnegative = n => Number.isFinite(n) && n >= 0;

function bedIndices(world) {
  const home = Math.floor(world.h/2)*world.w + Math.floor(world.w/2);
  return [home,home+1,home+world.w];
}

export function createFarm(w=8,h=7,seed=4801) {
  const farm = initFlora(w,h,seed,4);
  // Initialize the spring scenario on April 10 of a non-leap calendar.
  farm.world.day = 99;
  const plots = bedIndices(farm.world).map(index => {
    const s = farm.world.cells[index].soil;
    s.litterC += s.plantC;
    s.litterN += s.plantN;
    s.plantC = s.plantN = s.grassCarbon = s.grassNitrogen = s.legumeCarbon = s.legumeNitrogen = 0;
    return {index,plantedDay:null,cutDay:null};
  });
  farm.garden = {schema:1, plots, stock:{starts:initialStarts,cropC:0,cropN:0}};
  return stepFarm(farm);
}

export function stepFarm(farm) {
  const next = floraAdvance(farm);
  stepSteward(next.world);
  return next;
}

function setPlot(farm,plot,stock) {
  return {...farm,garden:{...farm.garden,stock,
    plots:farm.garden.plots.map(p => p.index===plot.index ? plot : p)}};
}

export function plantFarm(farm,index) {
  const plot = farm.garden.plots.find(p => p.index===index);
  if (!plot) return {farm,ok:false,message:'Aproxime-se de um dos canteiros.'};
  if (plot.plantedDay!==null) return {farm,ok:false,message:'Este canteiro já está plantado.'};
  const stock = farm.garden.stock;
  if (stock.starts<1) return {farm,ok:false,message:'Os lotes de mudas acabaram.'};
  const cells = farm.world.cells.slice(), cell = cells[index], soil = {...cell.soil};
  if (soil.snow>0) return {farm,ok:false,message:'Aguarde o degelo para plantar.'};
  soil.legumeCarbon += startC/area;
  soil.legumeNitrogen += startN/area;
  soil.plantC = soil.grassCarbon+soil.legumeCarbon;
  soil.plantN = soil.grassNitrogen+soil.legumeNitrogen;
  cells[index] = {...cell,soil};
  const next = setPlot({...farm,world:{...farm.world,cells}},{...plot,plantedDay:farm.world.day},
    {...stock,starts:stock.starts-1});
  return {farm:next,ok:true,message:'Mudas de leguminosa plantadas.'};
}

export function harvestFarm(farm,index) {
  const plot = farm.garden.plots.find(p => p.index===index);
  if (!plot || plot.plantedDay===null) return {farm,ok:false,message:'Plante um canteiro para colher.'};
  const days = farm.world.day-(plot.cutDay ?? plot.plantedDay);
  const soil = farm.world.cells[index].soil;
  if (days<3 || soil.legumeCarbon*area<=startC || soil.snow>0) {
    return {farm,ok:false,message:'Aguarde o crescimento do canteiro para cortar a forragem.'};
  }
  // Retain viable foliage for regrowth. The foraging agents see the reduced stock next tick.
  const next = floraHarvest(farm,index,.35), stock = farm.garden.stock;
  const C = next.foodLedger.harvestC-farm.foodLedger.harvestC;
  const N = next.foodLedger.harvestN-farm.foodLedger.harvestN;
  return {farm:setPlot(next,{...plot,cutDay:farm.world.day},
    {...stock,cropC:stock.cropC+C,cropN:stock.cropN+N}),ok:true,
    message:'Forragem guardada. A vegetação remanescente pode rebrotar.'};
}


// The shared cistern is part of world.totals; transfer water instead of creating it.
export function waterFarm(farm,index) {
  const plot=farm.garden.plots.find(p=>p.index===index);
  if(!plot || plot.plantedDay===null)return {farm,ok:false,message:'Plante um canteiro antes de regar.'};
  const world=farm.world, steward=world.steward, cell=world.cells[index], soil=cell.soil;
  if(soil.snow>0 || !world.last?.climate || world.last.climate.tempC-(cell.z-profile.stationElevationM)*.0065<=0)
    return {farm,ok:false,message:'Aguarde o degelo para regar.'};
  const mm=Math.min(steward?.tankMm??0,0.4,Math.max(0,75-soil.water));
  if(mm<=1e-12)return {farm,ok:false,message:soil.water>=75?'O solo já está úmido.':'Cisterna vazia. Aguarde a chuva.'};
  const water=soil.water+mm, cells=world.cells.slice();
  cells[index]={...cell,soil:{...soil,water}};
  const updated={...steward,tankMm:steward.tankMm-mm,
    plots:steward.plots.map(p=>p.index===index?{...p,waterAfterMm:water}:p)};
  const garden={...farm.garden,manualWaterL:(farm.garden.manualWaterL??0)+mm*area};
  return {farm:{...farm,garden,world:{...world,cells,steward:updated}},ok:true,
    message:'Rega: '+(mm*area).toFixed(0)+' litros retirados da cisterna.'};
}

export function farmReport(farm) {
  const base = floraReport(farm), s = farm.garden.stock, planted = initialStarts-s.starts;
  return {...base,storedCarbonKg:s.cropC+s.starts*startC,storedNitrogenKg:s.cropN+s.starts*startN,
    residualC:base.residualC+planted*startC,residualN:base.residualN+planted*startN};
}

export function validateFarm(farm) {
  decodeFlora(JSON.stringify(farm));
  validateSteward(farm.world);
  const g=farm.garden, s=g?.stock, indices=bedIndices(farm.world);
  if (g?.schema!==1 || !s || !Number.isInteger(s.starts) || s.starts<0 || s.starts>initialStarts ||
      !nonnegative(s.cropC) || !nonnegative(s.cropN) || !nonnegative(g.manualWaterL??0) ||
      Math.abs(s.cropC-farm.foodLedger.harvestC)>1e-8 || Math.abs(s.cropN-farm.foodLedger.harvestN)>1e-8 ||
      !Array.isArray(g.plots) || g.plots.length!==indices.length) throw Error('Estoque ou canteiros inválidos.');
  let planted=0;
  for (const [i,p] of g.plots.entries()) {
    if (p?.index!==indices[i] || p.plantedDay!==null &&
        (!Number.isInteger(p.plantedDay) || p.plantedDay<0 || p.plantedDay>farm.world.day) ||
        p.cutDay!==null && (!Number.isInteger(p.cutDay) || p.plantedDay===null ||
        p.cutDay<p.plantedDay+3 || p.cutDay>farm.world.day)) throw Error('Histórico de plantio inválido.');
    if (p.plantedDay!==null) planted++;
  }
  if (s.starts+planted!==initialStarts) throw Error('Inventário de mudas inconsistente.');
  return true;
}
