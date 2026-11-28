"""Desenhos originais do Vale do Amieiro. Execute para refazer o atlas local."""
import json
import math
import random
from pathlib import Path
from PIL import Image, ImageDraw

HERE = Path(__file__).resolve().parent
sprites = {}


def building(barn):
    rng = random.Random(13 if barn else 7)
    w, h = (177, 137) if barn else (149, 113)
    im = Image.new('RGBA', (w, h))
    d = ImageDraw.Draw(im)
    left, right = 4, w - 31
    top, bottom = h - 57, h - 5
    d.polygon([(right, top), (w-5, top-15), (w-5, bottom-15), (right,bottom)], fill='#665442')
    for x in range(right+2, w-5, 5):
        y = (x-right)*.62
        d.line((x, top-y, x, bottom-y-1), fill=rng.choice(['#74624b','#524b40','#8b7455']))
    d.rectangle((left,top,right,bottom),fill='#846346' if not barn else '#985f48')
    for y in range(top,bottom-1,5):
        if not barn:
            d.line((left,y,right,y),fill='#56483a')
            d.line((left+1,y+1,right-2,y+1),fill='#bb986c')
            for x in (left+2,right-5):
                d.rectangle((x,y,x+4,y+2),fill='#ceb189')
        else:
            for x in range(left+2,right,6):
                d.line((x,y,x,y+4),fill='#654c3e')
    for _ in range(260):
        x=rng.randrange(left+2,right-7); y=rng.randrange(top+2,bottom-1)
        d.line((x,y,x+rng.randrange(1,6),y),fill=rng.choice(['#a27d57','#746049','#957451']))
    # Pedra de fundação, junta, varanda, ombreiras e caixilhos.
    d.rectangle((left,bottom-2,right,bottom+1),fill='#68675a')
    for x in range(left+3,right-5,7):
        d.line((x,bottom-1,x+4,bottom-1),fill='#a79f83')
    doorx = right//2
    dw = 48 if barn else 19
    d.rectangle((doorx-dw//2-2,bottom-43,doorx+dw//2+2,bottom-2),fill='#c2a480')
    d.rectangle((doorx-dw//2,bottom-41,doorx+dw//2,bottom-2),fill='#52483d')
    for x in range(doorx-dw//2+2,doorx+dw//2,4):
        d.line((x,bottom-39,x,bottom-4),fill='#786348')
    if barn:
        for side in [-1,1]:
            d.line((doorx,bottom-3,doorx+side*(dw//2-2),bottom-37),fill='#b49a72',width=3)
        d.line((doorx,bottom-42,doorx,bottom-3),fill='#3c3930',width=2)
    else:
        d.rectangle((doorx+5,bottom-21,doorx+6,bottom-20),fill='#d5ba87')
    for x in (left+10,right-23):
        d.rectangle((x-2,top+11,x+15,top+29),fill='#c9b796')
        d.rectangle((x,top+13,x+13,top+26),fill='#45575a')
        d.rectangle((x+1,top+14,x+5,top+17),fill='#8faaa2')
        d.line((x+6,top+13,x+6,top+26),fill='#bfa885')
        d.line((x,top+20,x+13,top+20),fill='#bfa885')
        d.line((x-3,top+30,x+16,top+30),fill='#504f44',width=2)
    roof_top = 9 if barn else 15
    # Água frontal do telhado e oitão lateral. Fiadas de tabuinhas seguem o plano.
    apex = right+14
    d.polygon([(right,top),(apex,roof_top),(w-2,top-16)],fill='#6b5946')
    for i in range(4,18,4):
        d.line((right+i, top-i, apex,roof_top+3*i//4),fill='#997f5b')
    d.polygon([(0,top),(16,roof_top),(apex,roof_top),(right+3,top)], fill='#646968')
    for y in range(roof_top+2,top-1,5):
        shift=int(16*(top-y)/(top-roof_top))
        for x in range(shift+1,right+shift-5,8):
            dx = rng.randrange(0,3)
            d.line((x+dx,y,x+6,y),fill=rng.choice(['#9d9c83','#85897c','#b0a98e','#737c75']))
            d.line((x+dx,y+1,x+dx-1,y+3),fill='#535d58')
    d.line((0,top,right+3,top),fill='#3c4542',width=3)
    d.line((16,roof_top,apex,roof_top),fill='#b4b29b',width=2)
    if not barn:
        d.polygon([(23,25),(22,6),(31,3),(39,6),(39,25)],fill='#8a8473')
        for y in range(8,24,4):
            d.line((23,y,37,y-1),fill='#5d5e55')
            d.point((rng.randint(25,35),y+1),fill='#d2c7a4')
        d.polygon([(21,5),(30,2),(40,5),(32,9)],fill='#b0aa8e')
        d.line((25,5,34,5),fill='#555952')
        d.rectangle((doorx-15,bottom,doorx+16,bottom+3),fill='#a59d86')
    return im


PALETTES = [
    ['#414e39','#566940','#71864e','#93a764','#b6bf7d'],
    ['#344f3d','#456c48','#5e8551','#7e9d5b','#a3b96f'],
    ['#604f3b','#8b653e','#b58045','#ce9c55','#e4bb70'],
    ['#555a51','#6f7564','#839078','#9ba287','#adb197']
]


def deciduous(seed, season):
    rng = random.Random(seed)
    im = Image.new('RGBA',(112,129))
    d=ImageDraw.Draw(im)
    d.polygon([(49,125),(54,109),(55,83),(51,64),(58,62),(64,80),(62,107),(65,119),(72,125),(61,122),(57,126),(56,121)],fill='#584c3b')
    d.line([(55,119),(58,96),(57,78),(54,66)],fill='#9b8966',width=3)
    leaves=[]
    inner=[]
    def branch(x,y,angle,length,width,depth):
        ex=x+math.cos(angle)*length; ey=y+math.sin(angle)*length
        mid=(.5*(x+ex)+rng.uniform(-4,4),.5*(y+ey))
        d.line([(x,y),mid,(ex,ey)],fill='#665b47',width=max(1,round(width)))
        if depth in (1,2):
            inner.append((ex,ey))
        if depth:
            for sign in (-1,1):
                branch(ex,ey,angle+sign*rng.uniform(.27,.78),length*rng.uniform(.56,.82),width*.6,depth-1)
        else:
            leaves.append((ex,ey))
    for i in range(5):
        branch(57,88-i*3,-2.64+i*.52,33,6,3)
    if season != 3:
        ramp=PALETTES[season]
        leaves.extend(inner)
        leaves.sort(key=lambda pt:pt[1])
        for x,y in leaves:
            points=[]
            for k in range(16):
                r=rng.uniform(.77,1.12)
                angle=math.tau*k/16
                points.append((x+math.cos(angle)*13*r,y+math.sin(angle)*10*r))
            d.polygon(points,fill=ramp[0])
            d.polygon([(x+(a-x)*.93-1,y+(b-y)*.9-2) for a,b in points],fill=ramp[1])
            d.polygon([(x+(a-x)*.75-3,y+(b-y)*.64-4) for a,b in points],fill=ramp[2])
            for _ in range(11):
                a=x+rng.randrange(-10,7); b=y+rng.randrange(-9,3)
                d.line((a,b,a+rng.randint(1,4),b-1),fill=rng.choice(ramp[2:]))
    return im


def rail():
    im=Image.new('RGBA',(58,27));d=ImageDraw.Draw(im)
    for x,y in [(4,24),(51,21)]:
        d.polygon([(x-2,y),(x-3,y-21),(x,y-24),(x+3,y-23),(x+2,y)],fill='#665a44')
        d.line((x-2,y-21,x-1,y-3),fill='#aa956e')
    for level in [10,18]:
        d.polygon([(1,level+1),(54,level-3),(54,level),(2,level+4)],fill='#76674c')
        d.line((2,level+1,54,level-3),fill='#c1ac7d')
    return im


def stone():
    im=Image.new('RGBA',(36,21));d=ImageDraw.Draw(im)
    d.polygon([(2,16),(5,9),(13,4),(22,3),(31,9),(34,16),(26,19),(9,18)],fill='#657069')
    d.polygon([(5,11),(13,5),(22,4),(26,8),(16,11)],fill='#a9ad93')
    d.line([(9,14),(17,12),(21,9)],fill='#8d9785')
    return im

sprites['casa'] = building(False)
sprites['celeiro'] = building(True)
sprites['cerca'] = rail()
sprites['pedra'] = stone()
for season in range(4):
    for variant in range(3):
        sprites[f'copa{season}_{variant}'] = deciduous(32+variant*6,season)
atlas = Image.new('RGBA',(576,768))
meta={}
x=y=line=0
for name,im in sprites.items():
    if x+im.width+1>atlas.width:
        x=0;y+=line+1;line=0
    atlas.paste(im,(x,y));meta[name]=[x,y,im.width,im.height]
    line=max(line,im.height);x+=im.width+1
atlas.crop((0,0,atlas.width,y+line)).save(HERE/'paisagem.png', optimize=True)
(HERE/'paisagem.json').write_text(json.dumps(meta,indent=2)+'\n')
