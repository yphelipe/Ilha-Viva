const saveKey = 'iv048_field';
const previousSaveKey = 'iv046_field';

function save() {
  try {
    localStorage.setItem(saveKey, JSON.stringify({version:48,s,p,farm,homestead,steps}));
    notice = 'Partida salva localmente.';
  } catch (error) {
    notice = 'Armazenamento indisponível.';
  }
  refresh();
}

function validPlayer(player) {
  return player && Farm.validBag(player.bag) &&
    ['up','down','left','right'].includes(player.dir) &&
    Number.isFinite(player.x) && player.x >= 0 && player.x < Eco.W * CW &&
    Number.isFinite(player.y) && player.y >= 0 && player.y < Eco.H * CH &&
    ['f','t','distance'].every(key => Number.isFinite(player[key]) && player[key] >= 0) &&
    ['food','water','energy'].every(key => Number.isFinite(player[key]) && player[key] >= 0 && player[key] <= 100);
}

function validWorld(worldState) {
  if (worldState?.version !== 42 || !Array.isArray(worldState.cells) ||
      worldState.cells.length !== Eco.W * Eco.H || !Array.isArray(worldState.animals) ||
      !Array.isArray(worldState.aqua) || !worldState.ledger ||
      !['day','step','temp','rain'].every(key => Number.isFinite(worldState[key]))) return false;
  return worldState.cells.every((c,i) =>
      c?.x === i % Eco.W && c.y === Math.floor(i / Eco.W) &&
      Object.hasOwn(Eco.types,c.kind) && typeof c.channel === 'boolean' &&
      c.cap > 0 && ['cap','surface','water','b','soilP'].every(key => Number.isFinite(c[key]))) &&
    worldState.animals.every(a => a && Number.isSafeInteger(a.id) && Number.isInteger(a.pos) &&
      worldState.cells[a.pos] && Number.isInteger(a.sp) && Vertebrates.P[a.sp] &&
      Number.isFinite(a.age) && typeof a.state === 'string');
}

function load() {
  try {
    const stored = localStorage.getItem(saveKey) ?? localStorage.getItem(previousSaveKey);
    const data = JSON.parse(stored);
    if (![46,48].includes(data?.version) || !validWorld(data.s) ||
        !data.farm?.plots || !validPlayer(data.p) ||
        !Number.isSafeInteger(data.steps) || data.steps < 0) throw new Error('Save inválido');

    const property = data.version === 46 ? Homestead.create() : data.homestead;
    if (!Homestead.valid(property,data.s)) throw new Error('Construções inválidas');
    data.farm = Farm.migrate(data.farm);
    if (!Farm.valid(data.farm,data.s,data.p.bag)) throw new Error('Lavoura inválida');
    Vertebrates.family(data.s,{interactions:false});
    Life.init(data.s);

    ({s,p,farm,steps} = data);
    homestead = property;
    lemurDir.clear();
    lemurMotion.clear();
    syncLemurs(true);
    refreshObstacles();
    action = null;
    keys.clear();
    clock = 0;
    $('weather').value = s.weather;
    notice = 'Partida restaurada.';
  } catch (error) {
    notice = 'Nenhum salvamento compatível.';
  }
  refresh();
}

function refreshObstacles() {
  obstacles.clear();
  for (const [i,c] of s.cells.entries()) {
    if (!c.channel && c.b > .16 && [0,1,2,5,6].includes(c.sp)) {
      const r = 7 + cl(c.b,.16,1) * 4;
      const trunk = {...treePoint(c),rx:r,ry:r / 1.5,shape:'ellipse'};
      obstacles.set('tree:' + i,World.footprintBounds(trunk),trunk);
    }
  }
  for (const [i,object] of Object.entries(homestead.objects)) {
    const c = s.cells[i];
    const shape = Homestead.shape(object.kind,c.x,c.y,CW,CH);
    obstacles.set('structure:' + i,World.footprintBounds(shape),shape);
  }
}

function targetIndex(c = target()) {
  return c.y * Eco.W + c.x;
}

const propertyMessages = {
  ok:'Ação concluída.',
  target:'Aproxime-se do alvo e fique em terra firme.',
  occupied:'A área está ocupada.',
  tool:'Fabrique um malho para instalar construções.',
  station:'Aponte para o fogareiro instalado.',
  ingredients:'Faltam materiais ou ingredientes.',
  full:'O destino está sem espaço.',
  recipe:'Receita indisponível.',
  item:'Esse item não pode ser transferido aqui.',
  source:'O recurso está indisponível neste local.'
};

function propertyAction(callback) {
  if (action) return;
  notice = waterAt(p.x,p.y) ? propertyMessages.target : propertyMessages[callback(targetIndex())] ||
    'Confira o alvo, os materiais e o espaço disponível.';
  refresh();
}

const farmCommands = {
  drain:i=>Farm.drain(farm,s,i),
  gather:i=>Farm.gatherOrganic(farm,s,p.bag,i),
  deposit:i=>!Homestead.at(homestead,i) && Farm.compostDeposit(farm,s,p.bag,i),
  compost:i=>Farm.compostCollect(farm,p.bag,i),
  fertilize:i=>Farm.fertilize(farm,s,p.bag,i),
  fertilizeOrganic:i=>Farm.fertilize(farm,s,p.bag,i,'organic'),
  seeds:i=>Farm.harvestSeeds(farm,p.bag,i),
  seedDeposit:i=>Homestead.at(homestead,i)?.kind==='chest' && Farm.storeSeeds(farm,p.bag,$('seed').value),
  seedWithdraw:i=>Homestead.at(homestead,i)?.kind==='chest' && Farm.withdrawSeeds(farm,p.bag,$('seed').value)
};

function refreshHomestead(c) {
  if (!$('homestead').open) return;
  const i = targetIndex(c);
  const soil = Farm.soil(farm,s,i);
  const object = Homestead.at(homestead,i);
  const seeds = Object.entries(farm.seedStore).filter(([,value])=>value>0)
    .map(([crop,value])=>Farm.crops[crop].name + ' ' + value).join(' · ');
  const pile = farm.compost[i];
  const wood = Homestead.woodAvailable(s,i), stone = Homestead.stoneAvailable(homestead,s,i);
  const parts = [
    soil ? `Fertilidade ${Math.round(soil.fertility * 100)}% · atividade microbiana ${Math.round(soil.micro * 100)}% · efeito da rotação ${Math.round(soil.rotation * 100)}%` : '',
    farm.plots[i]?.drain != null ? 'Dreno instalado' : '',
    pile ? `Composteira ${pile.units} porções · ${Math.floor(pile.progress * 100)}%` : '',
    wood ? `Madeira caída ${wood}` : '',
    stone ? `Pedras soltas ${stone}` : ''
  ];
  $('soilStatus').textContent = parts.filter(Boolean).join(' · ');
  $('storageStatus').textContent = object?.kind === 'chest'
    ? `Baú · ${Farm.slots(object.stock)}/${Homestead.storageCapacity} espaços · ${Object.entries(object.stock).filter(([,value])=>value>0).map(([key,value])=>Farm.items[key].name+' '+value).join(' · ') || 'vazio'} · banco de sementes: ${seeds || 'vazio'}`
    : object ? Homestead.objects[object.kind].name : 'Aponte para um baú para transferir itens ou sementes.';
}

function describeRecipe() {
  const recipe = Homestead.recipes[$('recipe').value];
  $('recipeCost').textContent = Object.entries(recipe.inputs)
    .map(([item,quantity])=>quantity+' × '+Farm.items[item].name).join(' · ') +
    (recipe.station ? ' · requer fogareiro instalado' : '');
}

function overlapsPlacement(c,i,kind) {
  if (farm.plots[i] || farm.compost[i]) return true;
  const shape = Homestead.shape(kind,c.x,c.y,CW,CH);
  const rect = World.footprintBounds(shape);
  return obstacles.query(rect).length > 0 ||
    (Math.abs(p.x-shape.x) < shape.rx+3 && Math.abs(p.y-shape.y) < shape.ry+2);
}

function drawStructure(object,x,y) {
  if (object.kind === 'chest') {
    ctx.fillStyle = '#795137';
    ctx.fillRect(x-20,y-18,40,18);
    ctx.fillStyle = '#ae7546';
    ctx.fillRect(x-20,y-21,40,8);
    ctx.fillStyle = '#ead18a';
    ctx.fillRect(x-2,y-13,4,6);
  } else if (object.kind === 'fence') {
    ctx.fillStyle = '#b58a56';
    ctx.fillRect(x-34,y-18,68,4);
    ctx.fillRect(x-34,y-9,68,4);
    for (const dx of [-34,0,30]) ctx.fillRect(x+dx,y-22,4,22);
  } else {
    ctx.fillStyle = '#9b8a7b';
    ctx.beginPath();
    ctx.ellipse(x,y-8,19,10,0,0,Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#b55f2d';
    ctx.fillRect(x-8,y-13,16,7);
    ctx.fillStyle = '#e5ac54';
    ctx.fillRect(x-3,y-17,6,7);
  }
}

$('homestead').ontoggle = () => refreshHomestead(target());
$('recipe').innerHTML = Object.entries(Homestead.recipes).map(([key,value])=>`<option value="${key}">${value.name}</option>`).join('');
$('recipe').onchange = describeRecipe;
describeRecipe();
$('structure').innerHTML = Object.entries(Homestead.objects).map(([key,value])=>`<option value="${key}">${value.name}</option>`).join('');
$('storageItem').innerHTML = Object.entries(Farm.items).filter(([key])=>Homestead.storable(key))
  .map(([key,value])=>`<option value="${key}">${value.name}</option>`).join('');
$('farmApply').onclick = () => propertyAction(i => farmCommands[$('farmCommand').value](i) ? 'ok' : 'source');
$('craft').onclick = () => propertyAction(i => Homestead.craft(homestead,p.bag,$('recipe').value,i));
$('place').onclick = () => propertyAction(i => {
  const kind = $('structure').value;
  const result = Homestead.place(homestead,s,p.bag,i,kind,c=>overlapsPlacement(c,i,kind));
  if (result === 'ok') refreshObstacles();
  return result;
});
$('collectRaw').onclick = () => propertyAction(i=>Homestead.collectWater(s,p.bag,i));
$('collectStone').onclick = () => propertyAction(i=>Homestead.gatherStone(homestead,s,p.bag,i));
$('collectWood').onclick = () => propertyAction(i=>Homestead.gatherWood(s,p.bag,i));
$('storeItem').onclick = () => propertyAction(i=>Homestead.transfer(homestead,p.bag,i,$('storageItem').value,1,'deposit'));
$('takeItem').onclick = () => propertyAction(i=>Homestead.transfer(homestead,p.bag,i,$('storageItem').value,1,'withdraw'));

function drawWater() {
  ctx.fillStyle = '#397b86';
  ctx.beginPath();
  const minX = Math.max(-1,Math.floor(cam.x / CW)-1);
  const minY = Math.max(-1,Math.floor(cam.y / CH)-1);
  const maxX = Math.min(Eco.W-1,Math.floor((cam.x+W)/CW));
  const maxY = Math.min(Eco.H-1,Math.floor((cam.y+H)/CH));

  for (let y=minY; y<=maxY; y++) for (let x=minX; x<=maxX; x++) {
    for (const polygon of world.waterPolygons(s.cells,x,y,isWater)) {
      const [first,...rest] = polygon;
      ctx.moveTo(first.x-cam.x,first.y-cam.y);
      for (const point of rest) ctx.lineTo(point.x-cam.x,point.y-cam.y);
      ctx.closePath();
    }
  }
  ctx.fill();

  ctx.fillStyle = '#75a6a4';
  for (const i of world.cellsFor({x:cam.x,y:cam.y,width:W,height:H})) {
    const c = s.cells[i];
    if (!isWater(c)) continue;
    for (let j=0; j<4; j++) {
      const wx = (c.x+.13+.68*hash(c.x*9+j,c.y))*CW;
      const wy = (c.y+.08+.84*hash(c.y*11+j,c.x))*CH;
      if (waterAt(wx,wy) && waterAt(wx+8,wy)) ctx.fillRect(wx-cam.x,wy-cam.y,8,1);
    }
  }
}
