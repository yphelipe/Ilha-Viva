import json, pathlib,base64,io,copy,hashlib,zipfile
import numpy as np
from PIL import Image,ImageDraw
p=pathlib.Path('/mnt/data'); src=p/'Ilha_Viva_Laboratorio_10.html'; s=src.read_text(); pos=s.index('const DATA=')+11; d,e=json.JSONDecoder().raw_decode(s[pos:]); end=pos+e; a=d['atlas']['topdown']; d['atlas']['topdown10']=copy.deepcopy(a); out=p/'ilha_v021';out.mkdir(exist_ok=True)
def im(f):return Image.open(io.BytesIO(base64.b64decode(d['images'][f['id']].split(',')[1]))).convert('RGBA')
def masks(arr):
 r,g,b=arr[:,:,:3].astype(float).transpose(2,0,1); opaque=arr[:,:,3]>180; y=np.arange(arr.shape[0])[:,None]/arr.shape[0];
 return [opaque&(b>r+9)&(b>g+5)&(r>25)&(b<185), opaque&(r>g+8)&(g>b+3)&(r<166)&(r>43)&(y<.42),opaque&(r>g+9)&(g>b+4)&(r<175)&(r>39)&(y>.53)]
def med(frames):
 v=[[],[],[]]
 for f in frames:
  ar=np.asarray(im(f));
  for j,m in enumerate(masks(ar)):v[j].extend(ar[m,:3].tolist())
 return np.array([np.median(x,axis=0) if len(x) else [0,0,0] for x in v])
# Manually measured support midpoint in the contact sheet, coordinate within 150px cell. Keep actual stance and head poses.
centers={
 'run':{'down':[75,76,71,78],'left':[108,78,108,75],'right':[41,77,69,78],'up':[73,76,77,77]},
 'hoe':{'down':[70,70,60,65,74,77],'left':[66,80,81,65,68,72],'right':[76,72,70,66,63,75],'up':[88,65,57,58,75,64]},
 'axe':{'down':[87,88,60,90,90,63,91],'left':[65,63,62,59,69,72],'right':[84,85,86,83,86,82],'up':[83,72,80,79,74,75]},
 'sickle':{'down':[75,82,75],'left':[72,76,76,87,80,84],'right':[75,61,72,65,60,64],'up':[75,76,75]}}
# per-direction scale from head widths and upright reference, no per-frame scale changes.
scales={'run':{'down':1,'left':1,'right':1,'up':1},'hoe':{'down':1.04,'left':1.04,'right':1.04,'up':.98},'axe':{'down':1.07,'left':1.08,'right':1.08,'up':1.05},'sickle':{'down':1,'left':1.06,'right':1.06,'up':1}}
report=[]
for act,dirs in centers.items():
 for di,c in dirs.items():
  frames=a[act][di]; assert len(frames)==len(c)
  reference=med(a['walk'][di]); current=med(frames); delta=np.clip((reference-current)*.75,-15,15); print(act,di,delta.round(1).tolist())
  for i,f in enumerate(frames):
   old=im(f); ar=np.array(old); rgb=ar[:,:,:3].astype(float); mm=masks(ar)
   for j,m in enumerate(mm):rgb[m]+=delta[j]
   ar[:,:,:3]=np.clip(np.rint(rgb),0,255).astype('uint8'); q=Image.fromarray(ar); ax=f['ax']+(c[i]-75)/2; ay=f['ay'];
   # Lateral run: compress lower-body reach about the pelvis, preserving the exact upper body and alpha.
   if act=='run' and di in ['left','right']:
    w,h=q.size; pivot= ax; new=Image.new('RGBA',(w,h));
    for y in range(h):
     strength=.12*max(0,min(1,(y/h-.54)/.23)); nw=max(1,round(w*(1-strength))); row=q.crop((0,y,w,y+1)).resize((nw,1),Image.Resampling.NEAREST); off=round(pivot*(1-nw/w)); new.paste(row,(off,y))
    q=new
   # Keep the source pixel dimensions; rendering scale is separate. No alpha recoloring.
   buf=io.BytesIO();q.save(buf,format='PNG',optimize=True); raw=buf.getvalue(); id='v21'+hashlib.sha256(raw+f'{act}{di}{i}'.encode()).hexdigest()[:16]; (out/(id+'.png')).write_bytes(raw);d['images'][id]='data:image/png;base64,'+base64.b64encode(raw).decode(); f.update(id=id,ax=round(ax,3),ay=ay,scale=scales[act][di]);report.append((act,di,i,id))
# source versions and unchanged actions stay exactly as in previous laboratory.
head=s[:pos].replace('Laboratório 10','Laboratório 11').replace('Animações 10','Animações 11').replace('Enxada aprovada preservada. Revisão localizada do machado e travessia automática.','Padronização visual localizada: corrida, enxada, machado e foice. Compare com a versão 10.').replace('Top-down 10</option>','Top-down 11</option><option value="topdown10">Top-down 10 (anterior)</option>').replace('Enxada: 6 poses em quatro direções. Machado: revisão experimental da lâmina. Roupa de inverno ainda não produzida; neve não decidida.','Mesmos quadros e cadências; paleta, escala e pivôs ajustados. Validação artística pendente. Roupa de inverno ainda não produzida.')
tail=s[end:];tail=tail.replace("mode==='topdown'", "(mode==='topdown'||mode==='topdown10')") # previous version remains playable with same river logic
# make comparison notes honest
start=tail.index("(mode==='original'?' Arte original 02.'")
stop=tail.index(';draw()}',start)
tail=tail[:start]+"(mode==='topdown'?' Versão 11: ajustes de paleta, escala e pivô nas quatro ações revisadas.': ' Versão histórica para comparação.')"+tail[stop:]
tail=tail.replace("const f=seq()[frame],z=+$('zoom').value;", "const f=seq()[frame],z=+$('zoom').value*(f.scale||1);")
tail=tail.replace('Novas folhas recortadas por divisórias alfa; roupa automática em água líquida.','Paleta e pivôs revisados; roupa automática em água líquida.')
file=p/'Ilha_Viva_Laboratorio_11.html';file.write_text(head+json.dumps(d,ensure_ascii=False,separators=(',',':'))+tail)
# before/after contact sheet
canvas=Image.new('RGB',(1040,8*128),'#e0e5db'); dr=ImageDraw.Draw(canvas)
for j,act in enumerate(centers):
 for k,version in enumerate(['topdown10','topdown']):
  y=(j*2+k)*128;dr.text((8,y+8),act+' / '+('10 anterior' if k==0 else '11 ajuste'),fill='#14271b')
  for h,di in enumerate(['down','left','right','up']):
   seq=d['atlas'][version][act][di]; f=seq[2 if act=='run' else min(3,len(seq)-1)];q=im(f);sc=f.get('scale',1);q=q.resize((round(q.width*sc),round(q.height*sc)),Image.Resampling.NEAREST);x=155+h*215;canvas.paste(q,(round(x-f['ax']*sc),round(y+112-f['ay']*sc)),q);dr.text((x-18,y+8),di,fill='#14271b')
canvas.save(p/'Ilha_Viva_Comparacao_11.png')
(out/'report.json').write_text(json.dumps(report)); print('frames',len(report),'bytes',file.stat().st_size)
