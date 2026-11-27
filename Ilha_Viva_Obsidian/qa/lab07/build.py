from pathlib import Path
import re,base64,io,json,hashlib
import numpy as np
from PIL import Image,ImageDraw,ImageOps
P=Path('/mnt/data'); O=P/'ilha_v016'
s=(P/'Ilha_Viva_Laboratorio_Sprites_02.html').read_text()
raw={k:base64.b64decode(v) for k,v in re.findall(r"(\w+): \{name:'[^']+', src:'data:image/png;base64,([^']+)'",s)}
assert len(raw)==10
legacy={ 'walk':('walk',4,4,['down','left','right','up']), 'run':('run',4,4,['down','right','up','left']), 'hoe':('hoe',4,4,['down','right','up','left']), 'water':('water',3,4,['down','left','right','up']), 'axe':('axe',3,4,['down','right','up','left']), 'sickle':('sickle',3,4,['down','right','up','left']), 'swimClothed':('swimClothed',4,4,['down','right','up','left']), 'swimPants':('swimPants',4,4,['down','right','up','left']), 'restWater':('restWater',2,2,['sleep','water']) }
top={ 'walk':('folha_de_sprites_do_fazendeiro_pixelado.png',4,4,['down','left','right','up']), 'run':('fazendeiro_em_corrida_folha_de_sprites.png',4,4,['down','left','right','up']), 'hoe':('sprite_de_fazendeiro_arando_a_terra.png',3,4,['down','omit','right','up']), 'water':('sprite_de_agricultor_regando_em_12_quadros.png',3,4,['down','left','right','up']), 'axe':('folha_de_sprites_do_fazendeiro_lenhador.png',3,4,['down','omit','right','up']), 'sickle':('folhas_ao_vento_animação_de_ceifa.png',3,4,['down','omit','right','up']), 'swimClothed':('sprite_de_fazendeiro_nadando.png',4,4,['down','right','omit','up']), 'swimPants':('sprite_de_natação_do_fazendeiro.png',4,4,['down','right','omit','up']), 'restWater':('descanso_e_mergulho_do_fazendeiro.png',4,2,['sleep','water']) }
report=[]; atlas={}; images={}
def cuts(mask,n,axis):
 v=mask.sum(axis=axis); l=len(v); result=[0]
 for i in range(1,n):
  q=round(i*l/n); radius=min(60,round(l/n*.21)); j=min(range(q-radius,q+radius+1),key=lambda j:(int(v[j-1])+int(v[j]),abs(j-q))); result.append(j)
 result.append(l);return result

def get_crops(im,c,r,tag):
 a=np.array(im); mask=a[:,:,3]>128; ys=([0,420,im.height] if tag=='original/restWater' else cuts(mask,r,1)); out=[]
 for ri,(y0,y1) in enumerate(zip(ys,ys[1:])):
  xs=cuts(mask[y0:y1],c,0); line=[]
  for ci,(x0,x1) in enumerate(zip(xs,xs[1:])):
   cell=im.crop((x0,y0,x1,y1)); ca=np.array(cell); m=ca[:,:,3]>128
   edges=int(m[:,0].sum()+m[:,-1].sum()+m[0].sum()+m[-1].sum()); yy,xx=np.where(m)
   assert len(xx)>100,(tag,ri,ci)
   # exclude only very low opacity outside the visible silhouette; preserve all substantial pixels
   xlo=max(0,int(xx.min())-4); xhi=min(cell.width,int(xx.max())+5); ylo=max(0,int(yy.min())-4); yhi=min(cell.height,int(yy.max())+5)
   crop=cell.crop((xlo,ylo,xhi,yhi)); line.append(crop)
   report.append({'source':tag,'row':ri,'frame':ci,'edge_pixels':edges,'rect':[x0+xlo,y0+ylo,x0+xhi,y0+yhi]})
  out.append(line)
 return out

def anchor(im,act):
 a=np.array(im); h,w=a.shape[:2]; m=a[:,:,3]>128; y,x=np.where(m); top,bottom=y.min(),y.max(); hh=bottom-top+1
 if act.startswith('swim'):
  # center of the head, below hair: excludes most foam
  yy,xx=np.where(m & (np.indices(m.shape)[0]<top+hh*.33)); return float(np.median(xx)),float(top+hh*.42)
 if act=='sleep': return float(np.median(x)),float(bottom)
 if act=='waterEntry': return float(np.median(x[y<top+hh*.40])),float(top+hh*.72)
 # boots: brown, dark pixels in lower portion, excluding gray metal and green leaves
 rgb=a[:,:,:3].astype(int); rr,gg,bb=np.moveaxis(rgb,-1,0); Y=np.indices(m.shape)[0]
 boot=m & (Y>top+hh*.77) & (rr>gg+5)&(gg>bb+4)&(rr<155)&(bb<105)
 if boot.sum()<8: boot=m & (Y>top+hh*.8)
 by,bx=np.where(boot)
 # 98th percentile avoids isolated debris; center of support (both feet)
 ay=np.quantile(by,.98); keep=by>ay-hh*.14
 ax=(np.quantile(bx[keep],.1)+np.quantile(bx[keep],.9))/2
 return float(ax),float(ay+1)

def pack(im,act,scale,mirror=False):
 if mirror: im=ImageOps.mirror(im)
 ax,ay=anchor(im,act); size=(max(1,round(im.width*scale)),max(1,round(im.height*scale))); resized=im.resize(size,Image.Resampling.NEAREST)
 b=io.BytesIO();resized.save(b,format='PNG',optimize=True); binary=b.getvalue();key=hashlib.sha256(binary).hexdigest()[:18]; images[key]='data:image/png;base64,'+base64.b64encode(binary).decode()
 return {'id':key,'w':size[0],'h':size[1],'ax':round(ax*scale,2),'ay':round(ay*scale,2),'mirror':mirror}

for name,defs in [('original',legacy),('topdown',top)]:
 a={}; atlas[name]=a
 for act,(f,c,r,dirs) in defs.items():
  im=Image.open(io.BytesIO(raw[f])) if name=='original' else Image.open(P/f); im=im.convert('RGBA'); crops=get_crops(im,c,r,name+'/'+act)
  if act=='walk': scale=78/np.median([im.height for row in crops for im in row]); base_scale=scale
  else: scale=base_scale
  if act=='water' and name=='original': scale*=.86 # sheet cells are larger, matching body heights
  if act=='restWater':
   a['sleep']={'sleep':[pack(im,'sleep',scale*(.68 if name=='topdown' else .76)) for im in crops[0]]};a['waterEntry']={'water':[pack(im,'waterEntry',scale*(.68 if name=='topdown' else .76)) for im in crops[1]]};continue
  a[act]={d:[pack(im,act,scale) for im in row] for d,row in zip(dirs,crops) if d!='omit'}
  if name=='topdown' and 'left' not in a[act]:
   a[act]['left']=[pack(im,act,scale,True) for im in crops[dirs.index('right')]]
 a['idle']={d:[v[0]] for d,v in a['walk'].items()}
# Fine-tune pivots after contact-sheet review. Positive delta moves the anchor toward the actual support.
for act,dirs in {'hoe':{'down':[(0,0),(-2,0),(-9,-3)],'right':[(0,0),(-14,-2),(-13,-2)]},'axe':{'down':[(0,0),(0,0),(-5,-2)],'right':[(0,0),(0,0),(-6,-1)]},'sickle':{'down':[(0,0),(-4,-2),(0,0)],'right':[(0,0),(-5,0),(0,0)]}}.items():
 for d,offsets in dirs.items():
  for f,(dx,dy) in zip(atlas['topdown'][act][d],offsets): f['ax']+=dx; f['ay']+=dy
  if d=='right':
   for f,(dx,dy) in zip(atlas['topdown'][act]['left'],offsets): f['ax']-=dx;f['ay']+=dy
# manual contact sheet using fixed anchors to inspect drift, separate positions per frame
out=Image.new('RGB',(800,8*105),'#d8ded6'); draw=ImageDraw.Draw(out)
for i,act in enumerate(['walk','run','hoe','axe','sickle','water','swimClothed','swimPants']):
 draw.text((3,i*105+3),act,fill='black')
 for di,d in enumerate(['down','right']):
  for j,f in enumerate(atlas['topdown'][act][d]):
   im=Image.open(io.BytesIO(base64.b64decode(images[f['id']].split(',')[1])));x=100+di*350+j*85;y=i*105+92 if not act.startswith('swim') else i*105+48
   out.paste(im,(round(x-f['ax']),round(y-f['ay'])),im);draw.line((x-5,y,x+5,y),fill='red');draw.line((x,y-4,x,y+4),fill='red')
out.save(O/'anchors.jpg')
(O/'data.json').write_text(json.dumps({'atlas':atlas,'images':images},ensure_ascii=False,separators=(',',':')))
(O/'crop_report.json').write_text(json.dumps(report,indent=2));print('frames',sum(len(v) for a in atlas.values() for dirs in a.values() for v in dirs.values()),'unique',len(images),'edge reports',[(r['source'],r['row'],r['frame'],r['edge_pixels']) for r in report if r['edge_pixels']>0])
