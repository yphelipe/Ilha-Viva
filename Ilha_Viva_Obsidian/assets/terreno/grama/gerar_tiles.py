from PIL import Image,ImageDraw
import random,math
from pathlib import Path
out=Path(__file__).parent
# Paleta original: tons próximos entre estados para reduzir bordas abruptas.
pal=[('#827b50','#8f8955','#a19962','#716f46','#b1a66c'),('#71894d','#7c9454','#91a65f','#617b45','#a5b86d'),('#698b4c','#769653','#8da75c','#547941','#9db96b'),('#65854a','#70934e','#88a759','#4c733e','#9bb869'),('#8c8950','#a09a58','#b4aa67','#758047','#c4b376'),('#68834e','#77905a','#8da167','#526d48','#a0af76')]
# 0 solo exposto, 1 cortada, 2 baixa, 3 alta, 4 seca, 5 úmida.
atlas=Image.new('RGB',(32*8,32*6)); overlay=Image.new('RGBA',(32*8,32*3))
for state,p in enumerate(pal):
 for v in range(8):
  r=random.Random(1308+v*71); tile=Image.new('RGB',(32,32),p[0]); d=ImageDraw.Draw(tile)
  # blocos pequenos de textura, sem contorno de tile nem iluminação artificial
  for k in range(75):
   x,y=r.randrange(32),r.randrange(32); w,h=r.choice([1,2,2,3,4]),r.choice([1,1,2,3]); col=r.choices([p[1],p[2],p[3]],[6,2,2])[0]
   for xx in range(w):
    for yy in range(h): tile.putpixel(((x+xx)%32,(y+yy)%32),tuple(bytes.fromhex(col[1:])))
  # pequenos tufos desenhados em clusters de pixel, sombras e folhas
  for k in range([2,7,10,12,8,9][state]):
   x,y=r.randint(3,28),r.randint(4,29); h=r.choice([2,3,4]) if state!=0 else 2
   d.line((x-2,y,x+1,y),fill=p[3]);d.line((x,y,x-1,y-h),fill=p[3]);d.line((x,y-1,x+2,y-h),fill=p[2]);d.point((x-1,y-h),fill=p[4]);
   if state==3 and k%3==0:d.line((x+1,y-1,x+3,y-3),fill=p[1])
  atlas.paste(tile,(v*32,state*32))
for st in range(3):
 for v in range(8):
  r=random.Random(902+v*113); t=Image.new('RGBA',(32,32)); d=ImageDraw.Draw(t); p=pal[[2,3,4][st]]
  for k in range([3,6,5][st]):
   x,y=r.randint(4,27),r.randint(10,29); h=r.randint(5,9)
   d.ellipse((x-3,y-1,x+4,y+1),fill=p[3]+'90');d.line((x,y,x-3,y-h+2),fill=p[3],width=2);d.line((x,y,x+1,y-h),fill=p[2],width=2);d.line((x,y,x+4,y-h+3),fill=p[1],width=2);d.point((x+1,y-h),fill=p[4]);d.point((x-3,y-h+2),fill=p[2]);
  overlay.paste(t,(v*32,st*32))
atlas.save(out/'grama_tiles_32.png');overlay.save(out/'grama_tufos_32.png')
