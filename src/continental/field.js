const element = id => document.getElementById(id);
const fieldCanvas = element('field');
const fieldContext = fieldCanvas.getContext('2d', {alpha:false});
const scenery = new Image();
const heroImages = new Map();
const slot = 'ilha-viva.campo-continental.cp11';
const seasonCalendar = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
let farm = createFarm(COLS, ROWS, 4801);
let player = {x:805,y:415,dir:'down'};
const camera = {x:0,y:0};
let inspected = null, work = null, gait = 0, isMoving = false, isRunning = false;
let season = 0, needsPaint = true, lastTime = 0, request = 0, autoTimer = null;
const keysHeld = new Set(), directions = new Map();
const groundObjects = [...SCENES].sort((a,b)=>a.y-b.y);
const keyVectors = {ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right'};
const twoPlaces = new Intl.NumberFormat('pt-BR',{maximumFractionDigits:2});
function formatted(value) {return twoPlaces.format(value)}
function selectedCell() {return inspected ?? cellAt(player.x,player.y)}
function environment() {return farm.world.last?.climate ?? weather(farm.world.day,farm.world.seed)}
function notice(message) {element('feedback').textContent=message}
function schedule() {
    needsPaint=true;
    if(!request) request=requestAnimationFrame(frame);
}
function follow() {
    camera.x=Math.round(clampField(player.x-fieldCanvas.width*.46,0,MAP_W-fieldCanvas.width));
    camera.y=Math.round(clampField(player.y-fieldCanvas.height*.59,0,MAP_H-fieldCanvas.height));
}
function resizeField() {
    const rect=fieldCanvas.getBoundingClientRect();
    const zoom=rect.width<540?.90:1.35;
    fieldCanvas.width=Math.min(MAP_W,Math.max(1,Math.round(rect.width/zoom)));
    fieldCanvas.height=Math.min(MAP_H,Math.max(1,Math.round(rect.height/zoom)));
    follow();schedule();
}
function updateGround() {
    season=seasonIndex(environment().month);
    paintGround(farm.world,season);
    updatePanel(); schedule();
}
function updatePanel() {
    const w=farm.world, cl=environment(), index=selectedCell(), c=w.cells[index];
    const row=Math.floor(index/COLS)+1,col=index%COLS+1;
    element('date').textContent=seasonNames[season]+' · '+seasonCalendar[cl.month]+' · Dia '+(w.day+1);
    element('climate').textContent=formatted(cl.tempC)+' °C · '+(cl.rainMm>0?formatted(cl.rainMm)+' mm de chuva':'sem chuva');
    element('place').textContent=(inspected===null?'Parcela aos seus pés':'Parcela observada')+' · '+row+' / '+col;
    element('cell').textContent='Água no solo '+formatted(c.soil.water)+' mm · Gramíneas '+formatted(100*c.soil.grassCarbon)+' kg C · Leguminosas '+formatted(100*c.soil.legumeCarbon)+' kg C';
    element('agent').textContent=w.steward?.last?.reason || '';
    updateStock();
}
function move(dx,dy,seconds,run=false) {
    if(work||!Number.isFinite(seconds)||seconds<=0||!Number.isFinite(dx)||!Number.isFinite(dy))return false;
    const length=Math.hypot(dx,dy);
    if(!length)return false;
    player.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?'left':'right'):(dy<0?'up':'down');
    const distance=(run?135:82)*Math.min(seconds,.15), n=Math.ceil(distance/2);
    const sx=distance*dx/length/n, sy=distance*dy/length/n;
    const beforeX=player.x,beforeY=player.y,previousCell=selectedCell();
    for(let i=0;i<n;i++){
        if(!blocked(player.x+sx,player.y))player.x+=sx;
        if(!blocked(player.x,player.y+sy))player.y+=sy;
    }
    const traveled=Math.hypot(player.x-beforeX,player.y-beforeY);
    gait+=traveled/(run?12:13);
    inspected=null;
    if(previousCell!==selectedCell())updatePanel();
    follow();schedule();
    return traveled>0;
}
function heroImage(id) {
    if(!heroImages.has(id)){
        const image=new Image();image.onload=schedule;image.src=HERO.images[id];heroImages.set(id,image);
    }
    return heroImages.get(id);
}
function drawHero() {
    const kind=work?.kind ?? (isMoving?(isRunning?'run':'walk'):'idle');
    const seq=HERO.atlas[kind][player.dir];
    const i=work?Math.min(seq.length-1,Math.floor(work.elapsed/work.duration*seq.length)):Math.floor(gait)%seq.length;
    const f=seq[i],im=heroImage(f.id),g=fieldContext;
    if(!im.naturalWidth)return;
    // 80 px da prancha correspondem a ~35 px no mundo; porta frontal mede 41 px.
    const scale=.45;
    g.save();g.translate(Math.round(player.x-camera.x),Math.round(player.y-camera.y));
    g.fillStyle='#262d254a';g.beginPath();g.ellipse(0,-1,6,2.4,0,0,Math.PI*2);g.fill();
    if(f.mirror)g.scale(-1,1);
    g.drawImage(im,Math.round(-(f.mirror?f.w-f.ax:f.ax)*scale),Math.round(-f.ay*scale),Math.round(f.w*scale),Math.round(f.h*scale));
    g.restore();
}
function draw() {
    const g=fieldContext,w=fieldCanvas.width,h=fieldCanvas.height;
    g.imageSmoothingEnabled=false;
    g.drawImage(groundLayer,camera.x,camera.y,w,h,0,0,w,h);
    drawBeds(g);
    let heroDone=false;
    for(const o of groundObjects){
        if(!heroDone && o.y>player.y){drawHero();heroDone=true}
        const r=REGIONS[o.name==='tree'?'copa'+season+'_'+o.variant:o.name];
        const x=Math.round(o.x-camera.x-r[2]/2), y=Math.round(o.y-camera.y-r[3]+3);
        if(x+r[2]<=0||x>=w||y+r[3]<=0||y>=h||!scenery.naturalWidth)continue;
        g.drawImage(scenery,...r,x,y,r[2],r[3]);
    }
    if(!heroDone)drawHero();
}
function frame(time){
    request=0;
    const dt=Math.min(.08,(time-(lastTime||time))/1000);lastTime=time;
    const held=new Set([...directions.values(),...Array.from(keysHeld,k=>keyVectors[k])]);
    const dx=Number(held.has('right'))-Number(held.has('left'));
    const dy=Number(held.has('down'))-Number(held.has('up'));
    isRunning=keysHeld.has('ShiftLeft')||keysHeld.has('ShiftRight');
    if(work){work.elapsed+=dt;if(work.elapsed>=work.duration)work=null;needsPaint=true}
    isMoving=Boolean((dx||dy)&&move(dx,dy,dt,isRunning));
    if(needsPaint){draw();needsPaint=false}
    if(dx||dy||work)schedule();else lastTime=0;
}
function step(days=1) {
    if(!Number.isInteger(days)||days<1||days>365)throw Error('Intervalo inválido');
    for(let i=0;i<days;i++)farm=stepFarm(farm);
    updateGround();
}
function setAuto(on) {
    if(autoTimer!==null)clearInterval(autoTimer);
    autoTimer=on?setInterval(()=>{if(!document.hidden)step()},6000):null;
    element('auto').setAttribute('aria-pressed',String(on));
}
function restore(text) {
    const decoded=decodeFarmSave(text), p=decoded.player;
    if(decoded.farm.world.w!==COLS||decoded.farm.world.h!==ROWS||blocked(p.x,p.y))throw Error('Posição incompatível com o vale.');
    setAuto(false);keysHeld.clear();directions.clear();work=null;isMoving=false;gait=0;
    farm=decoded.farm;player=p;inspected=null;follow();updateGround();
}
element('next').onclick=()=>step();
element('auto').onclick=()=>setAuto(autoTimer===null);
element('save').onclick=()=>{
    try{localStorage.setItem(slot,encodeFarmSave(farm,player));notice('Partida salva neste navegador.')}
    catch{notice('O navegador não conseguiu salvar. Use Exportar arquivo.')}
};
element('load').onclick=()=>{
    try{const raw=localStorage.getItem(slot);if(!raw)throw Error('Nenhuma partida salva.');restore(raw);notice('Partida carregada.')}
    catch(e){notice(e.message)}
};
element('export').onclick=()=>{
    const url=URL.createObjectURL(new Blob([encodeFarmSave(farm,player)],{type:'application/json'}));
    const a=document.createElement('a');a.href=url;a.download='Ilha_Viva_Vale_do_Amieiro.json';a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1500);
};
element('import').onchange=async e=>{
    const file=e.target.files[0];
    if(!file)return;
    try{if(file.size>8000000)throw Error('Arquivo muito grande.');restore(await file.text());notice('Partida importada.')}
    catch(error){notice('Falha ao importar. '+error.message)}
    finally{e.target.value=''}
};
for(const b of document.querySelectorAll('[data-dir]')){
    b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);directions.set(e.pointerId,b.dataset.dir);schedule()};
    b.onlostpointercapture=b.onpointercancel=b.onpointerup=e=>{directions.delete(e.pointerId);schedule()};
}
function handleKey(e,down) {
    if(!(e.code in keyVectors || e.code==='ShiftLeft'||e.code==='ShiftRight')||e.ctrlKey||e.metaKey||e.altKey)return;
    e.preventDefault();if(down)keysHeld.add(e.code);else keysHeld.delete(e.code);schedule();
}
window.addEventListener('keydown',e=>handleKey(e,true));window.addEventListener('keyup',e=>handleKey(e,false));
window.addEventListener('blur',()=>{keysHeld.clear();directions.clear();schedule()});
fieldCanvas.onpointerdown=e=>{
    const rect=fieldCanvas.getBoundingClientRect();
    inspected=cellAt(camera.x+(e.clientX-rect.left)*fieldCanvas.width/rect.width,camera.y+(e.clientY-rect.top)*fieldCanvas.height/rect.height);
    updatePanel();schedule();
};
function updateStock(){
    const {stock,plots}=farm.garden, index=selectedCell();
    const plot=plots.find(p=>p.index===index);
    const description=plot?(plot.plantedDay===null?'Canteiro disponível':'Canteiro plantado há '+(farm.world.day-plot.plantedDay)+' dias'):'Fora da horta';
    element('stock').textContent=description+' · '+stock.starts+' mudas · Colheita armazenada '+formatted(stock.cropC)+' kg C';
}
function drawBeds(g){
    for(const p of farm.garden.plots){
        const index=p.index, x=(index%COLS)*CELL_W+61-camera.x, y=Math.floor(index/COLS)*CELL_H+91-camera.y;
        if(x>fieldCanvas.width+30||y>fieldCanvas.height+20||x< -35||y< -25)continue;
        const soil=farm.world.cells[index].soil;
        const height=Math.max(2,Math.min(10,Math.round(2+soil.legumeCarbon*75)));
        for(let row=0;row<4;row++){
            const start=Math.round(x-23+row*2), yy=Math.round(y+row*4);
            g.fillStyle=soil.water>65?'#71614a':'#8c7150';g.fillRect(start,yy,43,4);
            g.fillStyle='#ae9165';g.fillRect(start+2,yy,39,1);
            if(p.plantedDay===null)continue;
            for(let j=0;j<6;j++){
                const xx=start+3+j*7;
                g.fillStyle='#41583b';g.fillRect(xx,yy-height+2,1,height);
                g.fillStyle='#66854e';g.fillRect(xx-2,yy-height+2,2,2);g.fillRect(xx+1,yy-height+1,2,2);
                g.fillStyle='#abb572';g.fillRect(xx,yy-height,2,1);
            }
        }
    }
}
function tend(operation,kind) {
    const index=selectedCell();
    if(index!==cellAt(player.x,player.y)){notice('Caminhe até a parcela observada para trabalhar.');return}
    const result=operation(farm,index);notice(result.message);
    if(!result.ok)return;
    farm=result.farm;work={kind,elapsed:0,duration:.64};gait=0;
    updateGround();
}
element('plant').onclick=()=>tend(plantFarm,'hoe');
element('harvest').onclick=()=>tend(harvestFarm,'sickle');
window.Continental={
    snapshot:()=>structuredClone({world:farm.world,farm,player,camera,season:seasonNames[season],action:work?.kind??(isMoving?'walk':'idle')}),
    step,move
};
scenery.onload=schedule;scenery.src=SCENE_IMAGE;
new ResizeObserver(resizeField).observe(fieldCanvas);
resizeField();updateGround();
