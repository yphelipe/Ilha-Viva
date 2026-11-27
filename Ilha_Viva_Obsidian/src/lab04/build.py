from PIL import Image,ImageDraw
import cv2,numpy as np, json,base64,io, pathlib
P=pathlib.Path('/mnt/data/ilha_teste15'); SRC=pathlib.Path('/mnt/data/a_detailed_game_style_sprite_sheet_image_in_the_e.png')
im=Image.open(SRC).convert('RGBA'); a=np.asarray(im); scale=im.width/800
# measured against the 800px review image, no trusting decorative labels
rows=[('walk','Andar',0,99,[149,238,325,412,500,586,672,759]),('run','Correr',99,184,[137,194,250,307,363,420,476,534,591,648,705,762]),('axe','Machado',184,286,[144,205,264,326,390,454,519,583,645,706,768]),('hoe','Enxada',282,371,[144,205,267,328,390,457,518,581,644,705,768]),('sickle','Foice',372,462,[151,232,319,402,485,570,658,748]),('water','Regador',463,550,[148,233,321,406,491,578,664,752]),('swim','Nadar com camisa',550,611,[137,195,255,312,370,428,486,543,599,656,713,770]),('swim_bare','Nadar sem camisa',619,688,[137,195,255,312,370,428,486,543,599,656,713,770]),('barefoot','Andar descalço',691,799,[151,238,325,412,500,586,672,759])]

def crop_frame(box,swim):
 x0,y0,x1,y1=[round(v*scale) for v in box]; ar=a[y0:y1,x0:x1,:].copy(); rgb=ar[:,:,:3].copy(); h,w=rgb.shape[:2]
 # approximate foreground seeds: blue garment/water and brighter skin, within central band
 r,g,b=rgb.astype(np.int16).transpose(2,0,1)
 mask=np.full((h,w),cv2.GC_PR_BGD,np.uint8)
 mask[3:-3,3:-3]=cv2.GC_PR_FGD
 mask[:3]=mask[-3:]=cv2.GC_BGD; mask[:,:3]=mask[:,-3:]=cv2.GC_BGD
 Y,X=np.indices((h,w)); center=(X>w*.14)&(X<w*.86)&(Y>h*.07)&(Y<h*.94)
 blue=(b>r+9)&(b>g+3)&(b>55)
 skin=(r>135)&(r>g+18)&(g>b+10)&(g>80)
 seeds=(blue|skin)&center&(ar[:,:,3]>150)
 mask[seeds]=cv2.GC_FGD
 mask[ar[:,:,3]<15]=cv2.GC_BGD
 try: cv2.grabCut(rgb,mask,None,np.zeros((1,65),np.float64),np.zeros((1,65),np.float64),4,cv2.GC_INIT_WITH_MASK)
 except cv2.error: pass
 fg=np.uint8((mask==cv2.GC_FGD)|(mask==cv2.GC_PR_FGD))*255
 # keep main connected group and close tiny holes
 n,lab,stats,_=cv2.connectedComponentsWithStats(fg,8)
 if n>1:
  big=1+np.argmax(stats[1:,4]); keep=(lab==big)
  # keep small nearby disconnected droplets only in water actions
  if swim:
   near=cv2.dilate(keep.astype(np.uint8),np.ones((9,9),np.uint8))>0
   for j in range(1,n):
    if stats[j,4]>=4 and np.any(near&(lab==j)):keep|=lab==j
  fg=keep.astype(np.uint8)*255
 fg=cv2.morphologyEx(fg,cv2.MORPH_CLOSE,np.ones((3,3),np.uint8))
 ar[:,:,3]=fg; ar[fg==0]=0
 out=Image.fromarray(ar); bb=out.getbbox(); return out.crop(bb) if bb else out

frames={}; montage=Image.new('RGB',(12*110,9*120),'#bfc8bc'); d=ImageDraw.Draw(montage)
for ri,(key,label,top,bot,centers) in enumerate(rows):
 out=[]
 for j,c in enumerate(centers):
  lo=(centers[j-1]+c)/2 if j else c-(centers[1]-c)/2
  hi=(centers[j+1]+c)/2 if j<len(centers)-1 else min(800,c+(c-centers[j-1])/2)
  fr=crop_frame((max(lo,108),top,hi,bot),key.startswith('swim'));out.append(fr)
  th=fr.copy(); th.thumbnail((105,100),Image.Resampling.NEAREST); montage.paste(th,(j*110+(110-th.width)//2,ri*120+110-th.height),th)
 d.text((4,ri*120+2),f'{label} {len(out)}',fill='black');frames[key]=out
montage.save(P/'recortes.jpg',quality=93)
# aligned frames on common canvas; original scale retained, no stretching
meta={}; cell=196
for key,label,top,bot,centers in rows:
 fs=frames[key]; sheet=Image.new('RGBA',(cell*len(fs),cell)); info=[]
 for i,f in enumerate(fs):
  # same absolute scale across sprites, stable bottom support; nado anchors at waterline
  if f.width>cell-4 or f.height>cell-4: raise ValueError((key,f.size))
  px=(cell-f.width)//2; py=cell-12-f.height if not key.startswith('swim') else 103-f.height//2
  sheet.paste(f,(i*cell+px,py)); info.append({'w':f.width,'h':f.height,'x':px,'y':py})
 sheet.save(P/(key+'.png'),optimize=True); meta[key]={'label':label,'n':len(fs),'frames':info}
(P/'meta.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2))
