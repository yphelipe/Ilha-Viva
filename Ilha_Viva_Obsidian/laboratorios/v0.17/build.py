from pathlib import Path
from PIL import Image,ImageDraw,ImageChops,ImageOps
import numpy as np, json, base64, io, hashlib, copy
P=Path('/mnt/data'); src=P/'Ilha_Viva_Laboratorio_07_Topdown.html'; s=src.read_text(); start=s.index('const DATA=')+11; d,end=json.JSONDecoder().raw_decode(s[start:]); tail=s[start+end:]; old=copy.deepcopy(d['atlas']['topdown']); d['atlas']['topdown07']=old; a=d['atlas']['topdown']; added={}; check=[]
def get(f): return Image.open(io.BytesIO(base64.b64decode(d['images'][f['id']].split(',')[1]))).convert('RGBA')
def save(im,ax,ay,mirror=False):
 im=im.convert('RGBA'); b=io.BytesIO(); im.save(b,format='PNG',optimize=True); raw=b.getvalue(); id=hashlib.sha256(raw).hexdigest()[:18]; d['images'][id]='data:image/png;base64,'+base64.b64encode(raw).decode(); (P/'ilha_v017'/f'{id}.png').write_bytes(raw); assert im.getchannel('A').getextrema()[0]==0; assert 0<=ax<=im.width and 0<=ay<=im.height
 return dict(id=id,w=im.width,h=im.height,ax=round(ax,2),ay=round(ay,2),mirror=mirror)
# preserve full original sheets and extract using transparent gutters, never chroma-key.
raw=Image.open(P/'a_clean_transparent_background_sprite_sheet_in_a_p.png').convert('RGBA'); alpha=np.array(raw)[:,:,3]; cuts=[0,256,512,754,1024]; xc=[0,256,512,768,1024,1280,1536]; assert all(not (alpha[y-1:y+1]>128).any() for y in cuts[1:-1]); assert all(not (alpha[:,x-1:x+1]>128).any() for x in xc[1:-1]);
# anchors measured in each source cell, body support midpoint, not tool tip; same scale across all 24 frames
anchors=[[(99,231),(102,230),(108,234),(103,232),(111,233),(106,235)],[(102,241),(112,241),(109,241),(106,239),(112,241),(112,241)],[(103,229),(112,230),(110,230),(108,229),(110,228),(111,229)],[(123,156),(122,156),(123,156),(123,156),(122,156),(124,156)]]
# row 4 uses waist/waterline pivot; actual new positions anchored by head center and waist height
for r,key in enumerate(['hoe','axe','sickle','waterEntryPants']):
 frames=[]
 for c in range(6):
  cell=raw.crop((xc[c],cuts[r],xc[c+1],cuts[r+1])); mask=cell.getchannel('A'); bb=mask.point(lambda v:255 if v>12 else 0).getbbox(); assert bb; l,t,rr,bbot=bb; l=max(0,l-2);t=max(0,t-2);rr=min(256,rr+2);bbot=min(cell.height,bbot+2)
  # crop with transparent border; downsample uniformly (same pixel density as lab 07)
  crop=cell.crop((l,t,rr,bbot)); scale=.34; im=crop.resize((round(crop.width*scale),round(crop.height*scale)),Image.Resampling.LANCZOS); ax,ay=anchors[r][c]; ay+=14 if r==3 else 0; ax=(ax-l)*im.width/crop.width;ay=(ay-t)*im.height/crop.height; f=save(im,ax,ay); frames.append(f)
  check.append({'action':key,'frame':c+1,'source_rect':[xc[c]+l,cuts[r]+t,xc[c]+rr,cuts[r]+bbot],'anchor':[f['ax'],f['ay']]})
 if r<3:
  a[key]['right']=frames; a[key]['left']=[save(ImageOps.mirror(get(f)),f['w']-f['ax'],f['ay'],True) for f in frames]
 else: a[key]={'water':frames}
# Separate character silhouette from baked sleeping mat; only sleeping poses, keep outdoor complete original.
poly=[(20,1),(26,1),(32,4),(35,9),(35,13),(33,17),(30,20),(29,23),(33,25),(36,29),(39,35),(39,39),(35,41),(33,41),(33,49),(34,56),(32,61),(31,68),(27,70),(23,69),(20,70),(15,70),(14,66),(14,59),(13,54),(13,43),(10,41),(7,39),(6,36),(8,32),(10,28),(15,24),(16,22),(13,18),(10,13),(10,10),(11,7),(14,6),(14,3),(19,3)]
# manual cut follows character contour; no color-key, preserve dark boots and shirt.
frames=[]
for f in old['sleep']['sleep'][2:]:
 im=get(f); m=Image.new('L',im.size); ImageDraw.Draw(m).polygon(poly,fill=255); im.putalpha(ImageChops.multiply(im.getchannel('A'),m)); frames.append(save(im,f['ax'],f['ay']))
a['sleepBed']={'sleep':frames}; a['sleep']=copy.deepcopy(old['sleep'])
# transitions: preserve original clothes on exit; use reversed depth sequence with distinct timing and dry endpoint.
cl=copy.deepcopy(old['waterEntry']['water']); dry=copy.deepcopy(old['idle']['down'][0]); dry['ay']=55.45; dry['ax']=dry['w']/2
# match head anchor to entry; no movement in world, controlled depth changes in animation
for f in cl: f['ay']=55.45
# preserve current entry art, improve temporal continuity with dry pose
# cl first pose already ankle-deep, dry endpoint is separate
# clone because same metadata in reverse sequence
cl=[dry]+cl
a['waterEntry']={'water':cl}; a['waterExit']={'water':list(reversed(copy.deepcopy(cl)))}
a['waterExitPants']={'water':list(reversed(copy.deepcopy(a['waterEntryPants']['water'])))}
# Keep previous modes accessible: expose new actions only in new mode.
pre=s[:start].replace('Laboratório 07','Laboratório 08').replace('Animações 07','Animações 08').replace('Base: seu laboratório 02. Arte anterior preservada; versão top-down experimental, sem redesenhar.','Base: laboratório 07 preservado. Novos golpes laterais, sono separado e transições de água.').replace('<option value="topdown">Top-down</option>','<option value="topdown">Top-down 08</option><option value="topdown07">Top-down 07 (anterior)</option>').replace('value="6"></label>','value="6"></label>').replace('id="anchor" checked','id="anchor"').replace('Os golpes são ciclos de teste, não animações finais. A orientação da lâmina e a biomecânica ainda precisam de aprovação. Alguns lados da versão top-down são espelhados, indicados acima.','Golpes laterais: seis poses novas. Frente/costas: arte anterior com cadência revisada. A aprovação artística permanece pendente.')
tail=tail.replace("sleep:'Dormir',waterEntry:'Entrar na água'","sleep:'Dormir na mata',sleepBed:'Dormir na cama',waterEntry:'Entrar com roupa',waterEntryPants:'Entrar sem camisa',waterExit:'Sair com roupa',waterExitPants:'Sair sem camisa'")
tail=tail.replace("const swim=()=>action.startsWith('swim')||action==='waterEntry';","const transition=()=>action.startsWith('waterEntry')||action.startsWith('waterExit');const swim=()=>action.startsWith('swim')||transition();")
tail=tail.replace("function switchAction(a){action=a;", "function switchAction(a){if(!atlas[mode][a])a='idle';action=a;")
tail=tail.replace("function sync(){for(const b of $('actionButtons').children)b.classList.toggle('active',b.dataset.a===action);", "function sync(){for(const b of $('actionButtons').children){b.hidden=!atlas[mode][b.dataset.a];b.classList.toggle('active',b.dataset.a===action);}")
tail=tail.replace("+(mode==='original'?' Arte do HTML enviado.':' Perspectiva top-down candidata.');", "+(mode==='original'?' Arte original 02.':mode==='topdown07'?' Arte anterior 07.':(['hoe','axe','sickle'].includes(action)?(seq().length===6?' Seis poses laterais novas, teste de contato.':' Frente/costas preservadas; cadência revisada.'):' Arte top-down de teste.'));" )
# separate mattress in scene only, character remains transparent for inspection; no cloth sprite on bed
# use fixed anchor and independent layer: bed extends behind head and feet; subtle perspective.
tail=tail.replace("ctx.drawImage(imgs[f.id],", "if(action==='sleepBed'&&$('bg').value==='scene'){const bx=Math.round(x-29*z),by=Math.round(y-80*z);ctx.fillStyle='#493023';ctx.fillRect(bx,by,Math.round(58*z),Math.round(85*z));ctx.fillStyle='#845938';ctx.fillRect(bx+3,by+3,Math.round(52*z),Math.round(78*z));ctx.fillStyle='#d9d3b8';ctx.fillRect(bx+6,by+6,Math.round(46*z),Math.round(72*z));ctx.fillStyle='#ede6cf';ctx.fillRect(bx+9,by+9,Math.round(40*z),Math.round(15*z));}ctx.drawImage(imgs[f.id],")
# timing per action, no fake interpolation. Relative hold lengths for preparation, impact, recovery.
tail=tail.replace("let period=1000/+$('speed').value;if(fixed()&&frame===0)period*=1.35;", "let period=1000/+$('speed').value; if(mode==='topdown'&&['hoe','axe','sickle'].includes(action)){const timings=seq().length===6?[1.5,1.0,1.65,.55,.75,1.35]:[1.5,.75,1.25];period*=timings[frame];}else if(action==='sleepBed'||action==='sleep')period*=4;else if(transition())period*=frame===0||frame===seq().length-1?1.65:1.05;else if(fixed()&&frame===0)period*=1.35;")
# fixed transitions play once and hold endpoint, replay via play button or action button, avoid teleport loop
# old modes unchanged
tail=tail.replace("frame=(frame+1)%seq().length}}draw();", "if(mode==='topdown'&&transition()&&frame===seq().length-1){playing=false;held=null;}else frame=(frame+1)%seq().length}}draw();")
tail=tail.replace("$('playBtn').onclick=()=>{playing=!playing;held=null;draw()};", "$('playBtn').onclick=()=>{if(!playing&&mode==='topdown'&&transition()&&frame===seq().length-1){frame=0;elapsed=0;}playing=!playing;held=null;draw()};")
tail=tail.replace("if(fixed()&&action!=='sleep')", "if(fixed()&&!action.startsWith('sleep'))")
tail=tail.replace("' imagens PNG carregadas. Recorte por separação de alfa; nenhuma divisão cruza pixels com alfa acima de 128.'", "' imagens PNG carregadas. Novas folhas cortadas nas divisórias transparentes; sono na cama com máscara manual.'")
# Shore preview: show changing water depth in the transition, dry endpoint on land.
tail=tail.replace("ctx.fillStyle=swim()?'#558da6':'#88a670';", "if(mode==='topdown'&&transition()){const progress=frame/Math.max(1,seq().length-1),depth=action.startsWith('waterExit')?1-progress:progress;const z=+$('zoom').value;const bank=Math.round(y+(36-70*depth)*z);ctx.fillStyle='#88a670';ctx.fillRect(0,0,400,270);ctx.fillStyle='#b49a71';ctx.fillRect(0,bank-6,400,12);ctx.fillStyle='#558da6';ctx.fillRect(0,bank+4,400,270);ctx.fillStyle='#77b1c2';for(let i=0;i<36;i++){let yy=bank+8+(i*29)%Math.max(1,270-bank);ctx.fillRect((i*73)%400,yy,10+i%9,1)}return;}ctx.fillStyle=swim()?'#558da6':'#88a670';")
# Fix hidden action buttons layout (CSS grid author style doesn't override hidden attribute here).
html=pre+json.dumps(d,ensure_ascii=False,separators=(',',':'))+tail
out=P/'Ilha_Viva_Laboratorio_08.html';out.write_text(html);(P/'ilha_v017'/'recortes.json').write_text(json.dumps(check,indent=2)); print(out.stat().st_size,'bytes',len(d['images']),'unique PNGs',len(check),'new source crops')
# check unchanged previous assets
assert d['atlas']['topdown07']==old
