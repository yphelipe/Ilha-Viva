
// Mapa experimental: geometria contínua separada da grade de simulação.
function pathDistance(x,y){return Math.abs(y-(145+43*Math.sin(x/95-.5)+12*Math.sin(x/38)));}
const baseMakeWorld=makeWorld, baseStep=step;
function forestWorld(){let w=baseMakeWorld();w.traffic=false;w.tiles.forEach((t,i)=>{let x=(i%W+.5)*T,y=(Math.floor(i/W)+.5)*T;let d=pathDistance(x,y);t.c=clamp((37-d)/40,.06,.84);t.l=clamp(.75-t.c*.7);t.b*=1-t.c*.85});return w}
function footfall(t,n=.035){t.c=clamp(t.c+n);t.l=clamp(t.l-n*.7);t.b=clamp(t.b-n*.50)}
function forestStep(w){let c=climate(w.day,w.weather);w.tiles.forEach((t,i)=>{let x=(i%W+.5)*T,y=(Math.floor(i/W)+.5)*T;if(w.traffic&&pathDistance(x,y)<20)footfall(t,.025);t.c=clamp(t.c-.004);t.l=clamp(t.l+.004*(1-t.c)-.012*t.l*t.m*clamp(c.temp/22));let prior=t.m; // separate extra infiltration/runoff proxy
 t.m=clamp(prior-c.rain*t.c*.25);});baseStep(w);w.tiles.forEach(t=>{t.b=clamp(t.b-.011*t.c*t.b)});return c}
