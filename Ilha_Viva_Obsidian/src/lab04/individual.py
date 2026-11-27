from PIL import Image,ImageDraw
import numpy as np,json,pathlib
P=pathlib.Path('/mnt/data/ilha_teste15'); meta=json.loads((P/'meta.json').read_text()); cell=196
specs={'walk_ind':('a_clean_transparent_background_sprite_sheet_a_sin.png',8,1,'Andar (PNG individual)'), 'run_ind':('a_clean_transparent_background_sprite_sheet_style.png',12,1,'Correr (PNG individual)'), 'barefoot_ind':('a_clean_transparent_background_sprite_sheet_image.png',8,1,'Descalço (PNG individual)'), 'swim_ind':('a_clean_png_sprite_sheet_on_a_transparent_checkerb.png',6,2,'Nadar com camisa (PNG individual)')}
for k,(f,nx,ny,label) in specs.items():
 im=Image.open('/mnt/data/'+f).convert('RGBA'); W,H=im.size; fs=[]
 for r in range(ny):
  for c in range(nx):
   fr=im.crop((round(c*W/nx),round(r*H/ny),round((c+1)*W/nx),round((r+1)*H/ny))); a=np.array(fr); a[:,:,3][a[:,:,3]<16]=0; a[a[:,:,3]==0]=0; fr=Image.fromarray(a); bb=fr.getbbox(); assert bb; fs.append(fr.crop(bb))
 # normalize all frames in one action by same scale, relative to ground height of the extracted sprites (~140px)
 fac=(75 if k=='swim_ind' else 145)/max(f.height for f in fs); atlas=Image.new('RGBA',(cell*len(fs),cell)); info=[]
 for i,f in enumerate(fs):
  f=f.resize((max(1,round(f.width*fac)),max(1,round(f.height*fac))),Image.Resampling.LANCZOS); x=(cell-f.width)//2;y=cell-12-f.height if k!='swim_ind' else 103-f.height//2; assert x>=0 and y>=0;atlas.paste(f,(i*cell+x,y)); info.append(dict(w=f.width,h=f.height,x=x,y=y))
 atlas.save(P/(k+'.png'));meta[k]={'label':label,'n':len(fs),'frames':info}
(P/'meta.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2))
