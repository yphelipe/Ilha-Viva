from pathlib import Path
from PIL import Image
import numpy as np, json, base64, re, zipfile, shutil
from scipy.ndimage import gaussian_filter
p=Path('/mnt/data'); out=p/'ilha_mata'; out.mkdir(exist_ok=True)
source=p/'a_detailed_high_resolution_2d_pixel_art_texture_a.png'; im=Image.open(source).convert('RGB'); shutil.copy2(source,out/'solo_floresta_original.png')
# 16 cropped textures, remove generated dividers; 64 px art scale for terrain detail
atlas=Image.new('RGB',(256,256)); samples=[]
for r in range(4):
 row=[]
 for c in range(4):
  b=(round(c*im.width/4)+5,round(r*im.height/4)+5,round((c+1)*im.width/4)-5,round((r+1)*im.height/4)-5)
  tile=im.crop(b).resize((64,64),Image.Resampling.LANCZOS); atlas.paste(tile,(c*64,r*64));row.append(np.asarray(tile,dtype=float))
 samples.append(row)
atlas.save(out/'solo_atlas_64.png')
# overlapping patches, no grid lines; retain authored textures and use weighted overlap
rng=np.random.default_rng(211); h,w=288,448
for r,name in enumerate(['mata','folhas','terra','transicao']):
 acc=np.zeros((h+128,w+128,3)); weights=np.zeros(acc.shape[:2]); s=64; stride=40
 yy,xx=np.mgrid[:s,:s]; weight=np.minimum(np.minimum(xx+1,s-xx),np.minimum(yy+1,s-yy));weight=np.minimum(weight/12,1.)
 for y in range(0,h+65,stride):
  for x in range(0,w+65,stride):
   tile=samples[r][rng.integers(4)]; tile=np.rot90(tile,rng.integers(4)); acc[y:y+s,x:x+s]+=tile*weight[:,:,None];weights[y:y+s,x:x+s]+=weight
 a=(acc[32:32+h,32:32+w]/weights[32:32+h,32:32+w,None]).astype('uint8');Image.fromarray(a).save(out/f'{name}.png')
# old html carries original validated frame assets and old model; preserve unchanged except added layer
html=(p/'Ilha_Viva_Campo_01.html').read_text(); html=html.replace('Campo experimental 01','Solo de mata 01').replace('Grama viva e protagonista original. Toque no terreno para inspecionar; movimente e use as ferramentas.','Chão de mata, folhas e trilhas curvas. Toque para inspecionar o solo; caminhe, corte e observe a recuperação.').replace('width="448" height="288"','width="448" height="288"').replace('<button id="graze">Pastoreio: não</button>','<button id="graze">Pastoreio: não</button><button id="traffic">Tráfego autônomo: não</button>').replace('Pastoreio é um agente abstrato de teste, sem sprite animal.','Pastoreio e tráfego são agentes abstratos de teste, sem sprites novos. A trilha é inicial; o solo e a vegetação reagem ao uso.')
model=r'''
// Mapa experimental: geometria contínua separada da grade de simulação.
function pathDistance(x,y){return Math.abs(y-(145+43*Math.sin(x/95-.5)+12*Math.sin(x/38)));}
const baseMakeWorld=makeWorld, baseStep=step;
function forestWorld(){let w=baseMakeWorld();w.traffic=false;w.tiles.forEach((t,i)=>{let x=(i%W+.5)*T,y=(Math.floor(i/W)+.5)*T;let d=pathDistance(x,y);t.c=clamp((37-d)/40,.06,.84);t.l=clamp(.75-t.c*.7);t.b*=1-t.c*.85});return w}
function footfall(t,n=.035){t.c=clamp(t.c+n);t.l=clamp(t.l-n*.7);t.b=clamp(t.b-n*.50)}
function forestStep(w){let c=climate(w.day,w.weather);w.tiles.forEach((t,i)=>{let x=(i%W+.5)*T,y=(Math.floor(i/W)+.5)*T;if(w.traffic&&pathDistance(x,y)<20)footfall(t,.025);t.c=clamp(t.c-.004);t.l=clamp(t.l+.004*(1-t.c)-.012*t.l*t.m*clamp(c.temp/22));let prior=t.m; // separate extra infiltration/runoff proxy
 t.m=clamp(prior-c.rain*t.c*.25);});baseStep(w);w.tiles.forEach(t=>{t.b=clamp(t.b-.011*t.c*t.b)});return c}
'''
html=html.replace('const D=',model+'\nconst D=',1).replace('let world=makeWorld()','let world=forestWorld()').replace('world=makeWorld();player','world=forestWorld();player').replace('step(world);','forestStep(world);')
# layer sources; organic blend using interpolation over simulation cell centers and a curved path seed
imgs={n:'data:image/png;base64,'+base64.b64encode((out/f'{n}.png').read_bytes()).decode() for n in ['mata','folhas','terra','transicao']}
render=r'''
const ground=document.createElement('canvas');ground.width=448;ground.height=288;const gc=ground.getContext('2d');const tex={};let dirty=true,lastFoot=-1;
for(const [key,src] of Object.entries(TEXTURES)){let img=new Image();img.onload=()=>{let cv=document.createElement('canvas');cv.width=448;cv.height=288;let cc=cv.getContext('2d');cc.drawImage(img,0,0);tex[key]=cc.getImageData(0,0,448,288).data;dirty=true};img.src=src}
function sample(x,y,k){let a=clamp(x/T-.5,0,W-1),b=clamp(y/T-.5,0,H-1),ix=Math.floor(a),iy=Math.floor(b),jx=Math.min(ix+1,W-1),jy=Math.min(iy+1,H-1),u=a-ix,v=b-iy;return (world.tiles[iy*W+ix][k]*(1-u)+world.tiles[iy*W+jx][k]*u)*(1-v)+(world.tiles[jy*W+ix][k]*(1-u)+world.tiles[jy*W+jx][k]*u)*v}
function redrawGround(){if(Object.keys(tex).length!==4)return;let d=gc.createImageData(448,288);for(let y=0;y<288;y++)for(let x=0;x<448;x++){let i=(y*448+x)*4,c=sample(x,y,'c'),b=sample(x,y,'b'),l=sample(x,y,'l'),m=sample(x,y,'m'),edge=5*Math.sin(x*.19)+4*Math.sin(y*.26)+3*Math.sin((x+y)*.13),pd=pathDistance(x,y)+edge;let path=clamp((29-pd)/15)*clamp(c*1.7+.25),bare=clamp((c-.40)*1.7+(1-b)*.14),soil=Math.max(path,bare),leaf=clamp(l*(1-b)*1.4),veg=clamp(b*1.5);let dry=clamp((.32-m)*1.8),shade=1-.10*m;for(let j=0;j<3;j++){let v=tex.transicao[i+j]*(1-veg)+tex.mata[i+j]*veg;v=v*(1-leaf)+tex.folhas[i+j]*leaf;v=v*(1-soil)+tex.terra[i+j]*soil;d.data[i+j]=Math.round(clamp((v*(1-dry*.3)+[143,111,64][j]*dry*.3)*shade,0,255))}d.data[i+3]=255}gc.putImageData(d,0,0);dirty=false}
'''.replace('TEXTURES',json.dumps(imgs))
html=html.replace('const dirs=',render+'\nconst dirs=',1)
html=html.replace("function update(){let t=world.tiles[selected];","function update(){dirty=true;let t=world.tiles[selected];").replace('reservas ${Math.round(t.r*100)}%.','reservas ${Math.round(t.r*100)}% · compactação ${Math.round(t.c*100)}% · folhas ${Math.round(t.l*100)}%.').replace("$('graze').textContent=", "$('traffic').textContent='Tráfego autônomo: '+(world.traffic?'sim':'não');$('traffic').classList.toggle('active',world.traffic);$('graze').textContent=")
html=html.replace("$('graze').onclick=", "$('traffic').onclick=()=>{world.traffic=!world.traffic;update()};$('graze').onclick=")
html=html.replace("$('reset').onclick=()=>{world=forestWorld();", "$('reset').onclick=()=>{lastFoot=-1;world=forestWorld();")
html=html.replace('player.y=clamp(player.y+dy*v*dt,52,H*T-8)}','player.y=clamp(player.y+dy*v*dt,52,H*T-8);let f=tileAt(player.x,player.y);if(f!==lastFoot){footfall(world.tiles[f]);lastFoot=f;dirty=true}}')
a=html.index("ctx.fillStyle='#71894d';ctx.fillRect"); b=html.index('if(world.last!==null)',a)
html=html[:a]+"if(dirty)redrawGround();ctx.drawImage(ground,0,0);\n"+html[b:]
# select box only after touch? preserve visual selection, remove grid look default one selected
html=html.replace("ctx.strokeStyle='#f0e4ac';ctx.strokeRect(x+.5,y+.5,31,31);", "ctx.strokeStyle='rgba(240,228,172,.55)';ctx.strokeRect(x+.5,y+.5,31,31);")
(p/'Ilha_Viva_Solo_Mata_01.html').write_text(html)
(out/'modelo_solo.js').write_text(model)
(out/'manifesto.json').write_text(json.dumps({'source':'solo_floresta_original.png','atlas':'solo_atlas_64.png','rows':['vegetacao','serapilheira','terra','transicao'],'size':64,'logical_grid':32,'status':'experimental; arte gerada para o projeto, recortada e composta; sem aprovação final','maps':['mata.png','folhas.png','terra.png','transicao.png']},ensure_ascii=False,indent=2))
print('built',len(html))
