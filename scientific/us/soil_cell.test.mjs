import {initialState,stepSoil} from "./soil_cell.mjs";
function verify(){
  const total=(s,suffix)=>Object.entries(s).filter(([k])=>k.endsWith(suffix)).reduce((a,[,v])=>a+v,0);
  const close=(a,b)=>{if(Math.abs(a-b)>1e-10)throw new Error("balance error "+a+" "+b);};
  let assertions=0;
  function check(a,b){close(a,b);assertions++;}
  let s=initialState();
  for(let d=0;d<1095;d++){
    const tempC=12+17*Math.sin(2*Math.PI*(d-90)/365),light=0.5+0.4*Math.sin(2*Math.PI*(d-90)/365),rainMm=d%7===0?20:0;
    const climate={tempC,light,rainMm};
    const r=stepSoil(s,climate),f=r.flux,n=r.state;
    check(s.water+s.snow+rainMm,n.water+n.snow+f.runoff+f.drainage+f.evap);
    check(total(s,"C")+f.carbonUptake,total(n,"C")+f.respiredC);
    check(total(s,"N"),total(n,"N")+f.leachedN);
    if(JSON.stringify(stepSoil(s,climate))!==JSON.stringify(r))throw new Error("nondeterministic");
    assertions++;
    s=n;
  }
  const winter=stepSoil(initialState(),{tempC:-5,rainMm:10,light:0.2});
  check(winter.state.snow,10);
  check(winter.flux.carbonUptake,0);
  const spring=stepSoil(winter.state,{tempC:10,rainMm:0,light:0.7});
  check(spring.state.snow,0);
  check(spring.flux.melt,10);
  const dry=stepSoil({...initialState(),water:0},{tempC:20,rainMm:0,light:1});
  check(dry.flux.carbonUptake,0);check(dry.flux.decC,0);
  const dark=stepSoil(initialState(),{tempC:20,rainMm:0,light:0});
  check(dark.flux.carbonUptake,0);
  return {days:1095,assertions,finalState:s};
}
console.log(JSON.stringify(verify(),null,2));
