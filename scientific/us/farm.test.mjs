import {createFarm,plantFarm,harvestFarm,waterFarm,stepFarm,validateFarm,farmReport} from './farm.mjs';
import {foodTotals} from './food_world.mjs';
function verifyFarm(){
 let checks=0;const ck=(b,m)=>{if(!b)throw Error(m);checks++},near=(a,b,m)=>ck(Math.abs(a-b)<1e-7*Math.max(1,Math.abs(a),Math.abs(b)),m);
 let farm=createFarm(),i=farm.garden.plots[0].index;validateFarm(farm);
 ck(!waterFarm(farm,i).ok,"unplanted");let plant=plantFarm(farm,i);ck(plant.ok,"plant");farm=plant.farm;ck(farm.garden.stock.starts===5,"stock");ck(!plantFarm(farm,i).ok,"repeat plant");ck(!harvestFarm(farm,i).ok,"premature");
 // Controlled dry plot and water already collected in cistern; fixture establishes baseline.
 farm.world.cells[i].soil.water=30;farm.world.cells[i].soil.snow=0;farm.world.last.climate.tempC=20;farm.world.steward.tankMm=.6;
 const before=foodTotals(farm),snapshot=JSON.stringify(farm);let result=waterFarm(farm,i);ck(result.ok,"water");ck(JSON.stringify(farm)===snapshot,"immutable");let wet=result.farm;near(wet.world.cells[i].soil.water,30.4,"soil transfer");near(wet.world.steward.tankMm,.2,"tank");near(foodTotals(wet).waterL,before.waterL,"water conservation");near(wet.garden.manualWaterL,40,"liters");validateFarm(wet);result=waterFarm(wet,i);ck(result.ok,"remaining");wet=result.farm;near(wet.world.steward.tankMm,0,"empty");near(wet.garden.manualWaterL,60,"cumulative");ck(!waterFarm(wet,i).ok,"empty rejected");near(foodTotals(wet).waterL,before.waterL,"cumulative water");
 let snow=JSON.parse(JSON.stringify(wet));snow.world.steward.tankMm=1;snow.world.cells[i].soil.snow=2;ck(!waterFarm(snow,i).ok,"snow");let saturated=JSON.parse(JSON.stringify(wet));saturated.world.steward.tankMm=1;saturated.world.cells[i].soil.water=75;ck(!waterFarm(saturated,i).ok,"saturation");ck(validateFarm(JSON.parse(JSON.stringify(wet))),"save");
 let natural=createFarm();natural=plantFarm(natural,natural.garden.plots[0].index).farm;const bed=natural.garden.plots[0].index;let days=0;
 while(days<365&&!harvestFarm(natural,bed).ok){natural=stepFarm(natural);days++;validateFarm(natural);const r=farmReport(natural);near(r.residualC,0,"C balance");near(r.residualN,0,"N balance")}
 const harvested=harvestFarm(natural,bed);ck(harvested.ok,"harvest matured");ck(harvested.farm.garden.stock.cropC>0,"yield");ck(!harvestFarm(harvested.farm,bed).ok,"no repeated harvest");ck(validateFarm(harvested.farm),"validate");
 return {checks,daysToFirstHarvest:days,harvestCarbonKg:harvested.farm.garden.stock.cropC,manualWaterLiters:wet.garden.manualWaterL};
}
console.log(JSON.stringify(verifyFarm(),null,2));
