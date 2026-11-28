import {initialState,stepSoil} from './soil_cell.mjs';
// NOAA US Climate Normals 1991–2020. Original station units are retained here.
const stationTempF = [38.7,42.1,48.4,57.0,64.8,71.8,75.1,74.0,68.3,57.9,47.8,41.4];
const stationPrecipIn = [4.13,3.46,3.80,4.17,4.13,4.79,4.67,5.04,4.13,3.37,3.72,4.18];
export const profile = {
  id: "blue-ridge-asheville-1991-2020", reference: "NOAA NCEI USW00003812",
  latitude: 35.4319, stationElevationM: 645.3, cellM: 10,
  tempC: stationTempF.map(f => (f - 32) * 5 / 9),
  precipMm: stationPrecipIn.map(inches => inches * 25.4),
  wetDays: [10.5,9.8,11.9,10.6,11.5,13.4,13.9,13.1,9.2,7.8,8.8,10.0],
  days: [31,28,31,30,31,30,31,31,30,31,30,31]
};

export function daylightHours(day, latitude = profile.latitude) {
  const declination = 0.409 * Math.sin(2 * Math.PI * (day % 365 + 1) / 365 - 1.39);
  const cosine = -Math.tan(latitude * Math.PI / 180) * Math.tan(declination);
  return 24 / Math.PI * Math.acos(Math.max(-1, Math.min(1, cosine)));
}
function hash01(seed,x,y){let n=(seed^Math.imul(x+1,374761393)^Math.imul(y+1,668265263))|0;n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967296}

export function newWorld(w=32,h=24,seed=4801){
  if(!Number.isInteger(w)||!Number.isInteger(h)||w<3||h<3||w*h>16384)throw Error("invalid dimensions");
  const cells=Array.from({length:w*h},(_,i)=>{const x=i%w,y=Math.floor(i/w),u=x/(w-1),v=y/(h-1);const valley=.49+.14*Math.sin(v*6.3);const z=650+110*Math.abs(u-valley)+45*Math.sin(u*5.7+v*2.9)**2+30*(1-v)+8*(hash01(seed,x,y)-.5);const s=initialState();s.water=45+32*(1-Math.abs(u-valley));s.plantC=.13+.13*hash01(seed+9,x,y);s.plantN=s.plantC/25;return {z,soil:s,surface:0};});
  return {w,h,seed,day:0,cells,last:null};
}

export function weather(day,seed){
  let d=day%365,m=0;while(d>=profile.days[m]){d-=profile.days[m];m++}
  const probability = profile.wetDays[m] / profile.days[m];
  const rain = hash01(seed,day,1) < probability
    ? profile.precipMm[m] / profile.wetDays[m] * (.3 + 1.4 * hash01(seed,day,2)) : 0;
  const hours = daylightHours(day);
  // Within-month anomalies have zero expectation and the observed mean remains the target.
  return {tempC:profile.tempC[m]+(hash01(seed,day,3)-.5)*14,
    light:hours/24,daylightHours:hours,rainMm:rain,month:m};
}

// Experimental daily surface-water evaporation, mm per cell. Not a calibrated ET model.
export function surfaceEvaporation(available,tempC,light){
  if(tempC<=0||available<=0)return 0;
  const potential=Math.min(6,0.16*tempC*Math.max(0,Math.min(1,light)));
  return Math.min(available,potential);
}
export function advance(world,override=null,reverse=false){
  const {w,h,cells}=world,cl=override||weather(world.day,world.seed);
  const next=cells.map(c=>({z:c.z,soil:null,surface:0}));
  const ledger={precipitation:0,evap:0,soilEvap:0,surfaceEvap:0,transpiration:0,drainage:0,outflow:0,carbonUptake:0,respiredC:0,leachedN:0,routed:0};
  const order=Array.from({length:cells.length},(_,i)=>reverse?cells.length-1-i:i);
  const transfers=[];
  for(const i of order){
    const c=cells[i],x=i%w,y=Math.floor(i/w),tempC=cl.tempC-(c.z-profile.stationElevationM)*.0065;
    const s={...c.soil};
    const intake=tempC>0?Math.min(c.surface,Math.max(0,110-s.water),15):0;
    s.water+=intake;
    const {state,flux}=stepSoil(s,{rainMm:cl.rainMm,tempC,light:cl.light});
    next[i].soil=state;
    for(const k of ["precipitation","evap","soilEvap","transpiration","drainage","carbonUptake","respiredC","leachedN"])ledger[k]+=flux[k];
    const pooled=c.surface-intake+flux.runoff;
    const surfaceLoss=surfaceEvaporation(pooled,tempC,cl.light);
    ledger.surfaceEvap+=surfaceLoss;ledger.evap+=surfaceLoss;
    const available=pooled-surfaceLoss;
    let target=-1,best=c.z;
    for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=w||ny>=h)continue;const j=ny*w+nx;if(cells[j].z<best){best=cells[j].z;target=j}}
    const edge=x===0||y===0||x===w-1||y===h-1;
    const flow=target>=0?available*.65:edge?available*.65:0;
    next[i].surface=available-flow;
    transfers.push({i,target,flow});
  }
  // Canonical order of accumulation makes reverse traversal produce identical states.
  transfers.sort((a,b)=>a.i-b.i);
  for(const {target,flow} of transfers){if(target>=0){next[target].surface+=flow;ledger.routed+=flow}else ledger.outflow+=flow}
  return {...world,day:world.day+1,cells:next,last:{climate:cl,ledger}};
}

export function totals(world){
  return world.cells.reduce((a,c)=>{a.water+=c.soil.water+c.soil.snow+c.surface;for(const [k,v] of Object.entries(c.soil)){if(k.endsWith("C"))a.C+=v;if(k.endsWith("N"))a.N+=v}return a},{water:world.steward?.tankMm ?? 0,C:0,N:0})
}
