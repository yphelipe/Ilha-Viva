// Experimental continental soil cell; no calibrated species or spatial transport yet.
export function initialState(){
  return {water:70,snow:0,plantC:0.18,plantN:0.0072,litterC:0.4,litterN:0.018,microbeC:0.04,microbeN:0.005,mineralN:0.006};
}

export function stepSoil(state,climate){
  // Prototype coefficients, not field-calibrated. Water mm; C and N kg/m²; one simulated day.
  const s={...state};
  const keys=Object.keys(initialState());
  for(const k of keys) if(!Number.isFinite(s[k])||s[k]<0)throw new Error("invalid state "+k);
  const {rainMm,tempC,light}=climate;
  if(!Number.isFinite(rainMm)||rainMm<0||!Number.isFinite(tempC)||!Number.isFinite(light)||light<0||light>1)throw new Error("invalid weather");
  const clamp=(v,lo,hi)=>Math.min(hi,Math.max(lo,v));
  let rain=tempC<=0?0:rainMm;
  s.snow+=rainMm-rain;
  const melt=Math.min(s.snow,Math.max(0,tempC)*1.5);
  s.snow-=melt;
  const liquid=rain+melt;
  const infiltration=Math.min(liquid,Math.max(0,110-s.water),tempC<=0?0:35);
  const runoff=liquid-infiltration;
  s.water+=infiltration;
  const drainage=Math.min(s.water,Math.max(0,s.water-75)*0.14);
  s.water-=drainage;
  const evap=Math.min(s.water,Math.max(0,tempC)*0.12*light);
  s.water-=evap;
  const wet=clamp(s.water/75,0,1);
  const oxygen=clamp((115-s.water)/40,0,1);
  const thermal=clamp((tempC+2)/22,0,1)*clamp((42-tempC)/17,0,1);
  const activity=wet*oxygen*thermal;
  const leachedN=Math.min(s.mineralN,s.mineralN*drainage/110);
  s.mineralN-=leachedN;
  // Microbial death transfers C and N to litter without inventing material.
  const turnover=0.009*activity;
  const deadMC=s.microbeC*turnover,deadMN=s.microbeN*turnover;
  s.microbeC-=deadMC;s.microbeN-=deadMN;s.litterC+=deadMC;s.litterN+=deadMN;
  const frac=clamp(0.035*activity*s.microbeC/(0.025+s.microbeC),0,1);
  const decC=s.litterC*frac,decN=s.litterN*frac;
  s.litterC-=decC;s.litterN-=decN;
  // Simplified microbial C:N of 8; available N constrains biomass accumulation.
  const microbialGrowth=Math.min(decC*0.35,(decN+s.mineralN)*8);
  const microbialNeed=microbialGrowth/8;
  s.microbeC+=microbialGrowth;s.microbeN+=microbialNeed;
  s.mineralN+=decN-microbialNeed;
  const microbialResp=decC-microbialGrowth;
  const plantTurnover=clamp(0.002+0.015*(1-wet)+0.005*(tempC<=0?1:0),0,1);
  const fallenC=s.plantC*plantTurnover,fallenN=s.plantN*plantTurnover;
  s.plantC-=fallenC;s.plantN-=fallenN;s.litterC+=fallenC;s.litterN+=fallenN;
  const plantResp=Math.min(s.plantC,s.plantC*0.006*thermal);
  s.plantC-=plantResp;
  const potential=0.012*light*activity*clamp(s.plantC/0.08,0,1);
  const growth=Math.min(potential,s.mineralN*25);
  s.plantC+=growth;s.plantN+=growth/25;s.mineralN-=growth/25;
  for(const k of keys){if(s[k]<-1e-12||!Number.isFinite(s[k]))throw new Error("invalid result "+k);if(s[k]<0)s[k]=0;}
  return {state:s,flux:{precipitation:rainMm,melt,infiltration,runoff,drainage,evap,carbonUptake:growth,respiredC:microbialResp+plantResp,leachedN,detritusC:fallenC,decC,microbialGrowth}};
}
