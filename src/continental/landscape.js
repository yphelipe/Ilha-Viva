// Leito, caminho e pegadas compartilham coordenadas com colisão e inspeção.
const CELL_W = 192, CELL_H = 112, COLS = 8, ROWS = 7;
const MAP_W = COLS*CELL_W, MAP_H = ROWS*CELL_H;
const clampField = (n,a,b) => Math.max(a,Math.min(n,b));
const cellAt = (x,y) => clampField(Math.floor(y/CELL_H),0,ROWS-1)*COLS+clampField(Math.floor(x/CELL_W),0,COLS-1);
const riverX = y => 543+64*Math.sin(y/107)+25*Math.cos(y/51);
const pathY = x => 415+45*Math.sin((x-814)/192)+17*Math.sin((x-814)/77);
const riverWidth = y => 27+7*Math.sin(y/74);
const bridgeY = pathY(500);
const bridgeX = riverX(bridgeY);
const bridgeLeft = bridgeX-52, bridgeRight = bridgeX+52;
const onBridge = (x,y) => x>=bridgeLeft && x<=bridgeRight && Math.abs(y-bridgeY)<=14;
const SCENES = [
  {name:'casa', x:798, y:372, hw:66, depth:27},
  {name:'celeiro', x:998, y:362, hw:78, depth:31}
];
for (let i=0;i<4;i++) SCENES.push({name:'cerca', x:932+53*i, y:400-3*i, hw:25,depth:4});
for (let i=0;i<3;i++) SCENES.push({name:'cerca', x:630+53*i, y:479-i*3,hw:25,depth:4});
function noiseField(x,y,seed=0) {
    let n = Math.imul(x+seed+19,374761393) ^ Math.imul(y+29,668265263);
    n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967296;
}
for (let gy=0;gy<12;gy++) for (let gx=0;gx<21;gx++) {
    const x=Math.round((gx+noiseField(gx,gy,4)*.8)*76), y=Math.round((gy+noiseField(gx,gy,5)*.75)*67);
    if (x>MAP_W-8 || y>MAP_H-6 || Math.abs(x-riverX(y))<riverWidth(y)+8 || Math.abs(y-pathY(x))<40) continue;
    if ((x>635 && x<1135 && y>230 && y<570) || (x>960 && x<1190 && y>270 && y<690)) continue;
    if (noiseField(gx,gy,1)<.69) {
        SCENES.push({name:'tree', x,y,variant:(gx+gy)%3,hw:7,depth:5});
    } else if(noiseField(gx,gy,2)<.65) SCENES.push({name:'pedra',x,y,hw:12,depth:6});
}
function blocked(x,y) {
    if(x<5 || x>MAP_W-5 || y<5 || y>MAP_H-5)return true;
    if(Math.abs(x-riverX(y))<riverWidth(y)-2 && !onBridge(x,y))return true;
    return SCENES.some(o => Math.abs(x-o.x)<o.hw+3 && y>o.y-o.depth-3 && y<o.y+3);
}
function seasonIndex(month) { return month<2 || month===11?3:month<5?0:month<8?1:2; }
const seasonNames = ['Primavera','Verão','Outono','Inverno'];
const grasses=[
 ['#879558','#98a45f','#a7af6c','#74894e','#64794b'],
 ['#718749','#80914c','#90a052','#607d47','#547245'],
 ['#9d965c','#b0a16b','#beaa75','#93905b','#858654'],
 ['#969581','#a5a58e','#b3b09a','#858979','#777e70']
];
const groundLayer=document.createElement('canvas');groundLayer.width=MAP_W;groundLayer.height=MAP_H;
const groundBrush=groundLayer.getContext('2d',{alpha:false});
function paintGround(world,season) {
    const g=groundBrush, grass=grasses[season];
    g.fillStyle=grass[0];g.fillRect(0,0,MAP_W,MAP_H);
    // Barrancos, cascalho e sulcos de roda têm bordas independentes em cada scanline.
    for(let y=0;y<MAP_H;y++){
        const x=riverX(y), half=riverWidth(y), jitter=noiseField(y,3)*4;
        const surface=world.cells[cellAt(x,y)].surface;
        const wet=Math.min(1,surface/4);
        g.fillStyle='#8b8869';g.fillRect(Math.round(x-half-5-jitter),y,Math.round(2*half+11),1);
        g.fillStyle='#b2a68b';g.fillRect(Math.round(x-half-2),y,Math.round(2*half+5),1);
        g.fillStyle='#858c80';g.fillRect(Math.round(x-half+2+jitter),y,Math.round(2*half-7),1);
        if(wet>.02){
            const span=Math.max(2,Math.round(half*Math.sqrt(wet)));
            g.fillStyle=wet>.3?'#567d79':'#718a81';
            g.fillRect(Math.round(x-span),y,span*2,1);
            if(y%5===0){
                g.fillStyle='#a0b1a0';g.fillRect(Math.round(x-span*.7+jitter),y,Math.min(span,8),1);
            }
        }
    }
    for(let x=0;x<MAP_W;x++){
        const y=pathY(x),riverbed=Math.abs(x-riverX(y))<riverWidth(y)+5;
        if(riverbed) continue;
        const half=14+3*Math.sin(x/47)+noiseField(x,1)*3;
        g.fillStyle='#928356';g.fillRect(x,Math.floor(y-half),1,Math.round(half*2));
        g.fillStyle='#c0ac78';g.fillRect(x,Math.floor(y-half+3),1,Math.round(half*2-5));
        g.fillStyle='#b49d70';g.fillRect(x,Math.floor(y-half*.6),1,3);g.fillRect(x,Math.floor(y+half*.53),1,3);
    }
    // Textura estável entre dias. O estado local altera geada, relva e solo exposto.
    for(let i=0;i<39000;i++){
        const x=Math.floor(noiseField(i,11)*MAP_W), y=Math.floor(noiseField(i,12)*MAP_H);
        const c=world.cells[cellAt(x,y)], variation=noiseField(i,13), channel=Math.abs(x-riverX(y));
        const trail=Math.abs(y-pathY(x));let color;
        if(channel<riverWidth(y)+3) {
            if(c.surface>1 && channel<riverWidth(y)*.55)continue;
            color=variation>.5?'#aeb09a':'#737e72';
        } else if(trail<17)color=variation>.65?'#cfbc8e':'#a9966c';
        else if(c.soil.snow>1 && noiseField(i,14)<Math.min(.9,c.soil.snow/14))color='#e1e4d6';
        else {
            const patch=Math.sin(x/65+Math.sin(y/70))+Math.cos((x+y)/83);
            color=grass[variation>.82?2:patch>0?1:variation>.38?3:4];
        }
        g.fillStyle=color;g.fillRect(x,y,2+Math.floor(variation*6),1);
        if(channel>riverWidth(y)+3 && trail>20 && variation>.83){
            g.fillRect(x+1,y-2,1,3);g.fillRect(x+3,y-1,1,2);
        }
    }
    const fieldPlots=world.steward?.plots || [];
    for(const plot of fieldPlots){
        const index=plot.index,c=world.cells[index],cx=(index%COLS+.5)*CELL_W,cy=(Math.floor(index/COLS)+.72)*CELL_H;
        // Canteiros ilustram parte da área científica. Os estoques pertencem à célula inteira.
        for(let row=0;row<5;row++){
            const yy=Math.round(cy+row*4),xx=Math.round(cx-28+row*1.5);
            g.fillStyle='#856e4f';g.fillRect(xx,yy,55,3);
            g.fillStyle='#ab936c';g.fillRect(xx,yy,54,1);
            if(c.soil.plantC>.08 && season!==3){
                for(let j=0;j<9;j++){
                    g.fillStyle=grass[4];g.fillRect(xx+2+j*6,yy-2,3,3);
                    g.fillStyle=grass[2];g.fillRect(xx+3+j*6,yy-3,2,1);
                }
            }
        }
    }
    // Ponte fixa acima do leito, inclusive em dias de canal seco.
    g.fillStyle='#534e3f';g.fillRect(bridgeLeft,bridgeY-15,104,31);
    for(let x=bridgeLeft+1;x<bridgeRight;x+=5){
        g.fillStyle=noiseField(x,9)>.5?'#a79470':'#978467';g.fillRect(x,bridgeY-14,4,29);
        g.fillStyle='#c1ac83';g.fillRect(x,bridgeY-14,1,26);
    }
    g.fillStyle='#72684e';g.fillRect(bridgeLeft,bridgeY-16,104,3);
    g.fillStyle='#c7b591';g.fillRect(bridgeLeft,bridgeY-17,104,1);
}
