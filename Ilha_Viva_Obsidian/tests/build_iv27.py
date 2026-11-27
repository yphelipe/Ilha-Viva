from pathlib import Path
import json,io,base64,hashlib
import numpy as np
from PIL import Image,ImageDraw
from scipy.ndimage import distance_transform_edt,label,binary_dilation,binary_fill_holes
P=Path('/mnt/data'); s=(P/'Ilha_Viva_Laboratorio_13.html').read_text(); start=s.index('const DATA=')+11; d,end=json.JSONDecoder().raw_decode(s[start:]); tail=s[start+end:]; cs=tail.index('const COLD=')+11; old,ce=json.JSONDecoder().raw_decode(tail[cs:]); active=d['atlas']['topdown']; actions=['idle','walk','run','hoe','axe','sickle','water','sleep','sleepBed']; frames={f['id']:f for k in actions for seq in active[k].values() for f in seq};
for v in set(old.values()):d['images'].pop(v,None)
def get(id):return Image.open(io.BytesIO(base64.b64decode(d['images'][id].split(',')[1]))).convert('RGBA')
new={}; stats={}; masks={}
for id,f in frames.items():
 a=np.array(get(id)); r,g,b,al=a.astype(float).transpose(2,0,1); solid=al>140; Y,X=np.indices(r.shape)
 # Existing garment only: blue components, exclude isolated eye highlights.
 blue=solid&(b>r+7)&(b>=g+2)&(b>35)
 labs,n=label(blue,np.ones((3,3))); shirt=np.zeros_like(blue)
 sizes=[(int((labs==j).sum()),j) for j in range(1,n+1)]
 if sizes:
  core=labs==max(sizes)[1]; shirt=core.copy(); near=distance_transform_edt(~core); cy,cx=np.where(core)
  for size,j in sizes:
   m=labs==j; ys,xs=np.where(m)
   if size>=4 and near[m].min()<=3 and np.median(ys)>=cy.min()-3 and np.median(ys)<=cy.max()+3:shirt|=m
 # A distinct, sleeveless field vest over the original shirt. Never repaint skin, cuffs, hair, pants or tools.
 # Locate trunk from the existing shirt core, using a tapered panel to keep the original blue sleeves.
 direction=next((di for k in actions for di,seq in active[k].items() if any(ff['id']==id for ff in seq)), 'down')
 out=a.copy(); cloth=np.zeros_like(shirt); sleeve=np.zeros_like(shirt); cuffs=np.zeros_like(shirt)
 if shirt.any():
  ys,xs=np.where(shirt); y0,y1=ys.min(),ys.max(); height=max(1,y1-y0+1)
  # Determine torso center from lower half of garment, not arms raised above head.
  lower=shirt & (Y>=y0+height*.52); lx=np.where(lower)[1]; cx=float(np.median(lx)) if len(lx) else float(np.median(xs));
  width=max(5,float(np.percentile(lx,90)-np.percentile(lx,10)+1) if len(lx)>4 else xs.max()-xs.min()+1)
  panel=width*.53 if direction in ('up','down','sleep') else width*.55
  # Keep collar and upper outer shoulders blue, and make the vest reach the original beltline.
  t=np.clip((Y-y0)/height,0,1); taper=np.where(t<.32,.73+.55*t,1.0)
  cloth=shirt & (np.abs(X-cx)<=panel*taper) & (Y>=y0+max(1,round(height*.10)))
  # Painterly color retains shading; olive canvas, seam edge, zipper and front pockets.
  lum=.24*r+.56*g+.20*b; target=np.stack([lum*1.20+11,lum*1.19+13,lum*.67+8],axis=-1)
  out[:,:,:3][cloth]=np.clip(target[cloth],0,255).astype('uint8')
  edge=cloth & (distance_transform_edt(cloth)<=1.05); out[:,:,:3][edge]=np.clip(out[:,:,:3][edge]*.75,0,255).astype('uint8')
  if direction in ('down','left','right','sleep'):
   zipx=round(cx+ (0 if direction in ('down','sleep') else (panel*.62 if direction=='right' else -panel*.62)))
   zipmask=cloth&(X==zipx)&(t>.34)&(t<.92)
   out[:,:,:3][zipmask]=np.clip(out[:,:,:3][zipmask]*.55+np.array([5,5,4]),0,255).astype('uint8')
   ztop=cloth&(X==zipx)&(np.abs(Y-(y0+height*.42))<.8);out[:,:,:3][ztop]=np.array([150,145,113],dtype='uint8')
   if direction=='down' and width>=10:
    pockets=cloth&(np.abs(Y-(y0+height*.70))<.7)&(np.abs(X-cx)>max(2,width*.19))&(np.abs(X-cx)<panel*.8)
    out[:,:,:3][pockets]=np.clip(out[:,:,:3][pockets]*.62,0,255).astype('uint8')
 # Keep all untouched pixels, alpha, exact bounding boxes, and timing.
 assert np.array_equal(a[:,:,3],out[:,:,3]); assert np.array_equal(a[~cloth],out[~cloth]);
 buf=io.BytesIO(); Image.fromarray(out).save(buf,format='PNG',optimize=True); raw=buf.getvalue(); key='frio27'+hashlib.sha256(raw).hexdigest()[:16]; d['images'][key]='data:image/png;base64,'+base64.b64encode(raw).decode();new[id]=key;stats[id]={'garment':int(shirt.sum()),'sleeve':int(sleeve.sum()),'cuff':int(cuffs.sum()),'changed':int(np.any(a!=out,axis=-1).sum())};masks[id]=cloth
# montage all frames, original vs jacket (scaled nearest neighbor)
rows=[]
for k in actions:
 for di,seq in active[k].items():rows.append((k,di,seq))
for offset in range(0,len(rows),8):
 group=rows[offset:offset+8]; m=Image.new('RGB',(7*190+90,len(group)*195),'#d7ddd2'); dr=ImageDraw.Draw(m)
 for i,(k,di,seq) in enumerate(group):
  dr.text((3,i*195+7),f'{k} {di}',fill='#15241b')
  for j,f in enumerate(seq):
   for q,id in enumerate([f['id'],new[f['id']]]):
    im=get(id); scale=min(2,85/im.width,170/im.height); im=im.resize((round(im.width*scale),round(im.height*scale)),Image.Resampling.NEAREST);x=90+j*190+q*92;y=i*195+180-im.height;m.paste(im,(x+(90-im.width)//2,y),im)
 m.save(P/f'iv27_review_{offset//8}.png')
# compact front/side etc comparison for mobile
m=Image.new('RGB',(920,900),'#d7ddd2'); dr=ImageDraw.Draw(m)
for i,k in enumerate(actions):
 dr.text((5,i*100+3),k,fill='#15241b')
 for j,(di,seq) in enumerate(active[k].items()):
  f=seq[min(1,len(seq)-1)]; dr.text((78+j*208,i*100+3),di+' original / frio',fill='#15241b')
  for q,id in enumerate([f['id'],new[f['id']]]):
   im=get(id); im.thumbnail((95,85)); m.paste(im,(75+j*208+q*98+(95-im.width)//2,i*100+99-im.height),im)
m.save(P/'Ilha_Viva_Vestuario_14_comparacao.png')
head=s[:start].replace('Laboratório 13','Laboratório 14').replace('Animações 13','Animações 14').replace('Top-down 13','Top-down 14').replace('Vestuário experimental de friagem amazônica.','Colete de campo verde-oliva sobre a camisa original.').replace('Roupa de friagem experimental','Colete de friagem candidato')
tail=tail[:cs]+json.dumps(new,separators=(',',':'))+tail[cs+ce:]; tail=tail.replace('Manga comprida e botas','Colete verde-oliva e botas').replace('Versão 13: animações preservadas; roupa de friagem experimental.','Versão 14: roupa editada sobre os quadros originais; movimentos intactos.')
(P/'Ilha_Viva_Laboratorio_14.html').write_text(head+json.dumps(d,ensure_ascii=False,separators=(',',':'))+tail)
(P/'iv27_manifest.json').write_text(json.dumps({'cold':new,'stats':stats},indent=2));print('frames',len(new),'sleeves',sum(v['sleeve']>0 for v in stats.values()),'modified',sum(v['changed']>0 for v in stats.values()))
