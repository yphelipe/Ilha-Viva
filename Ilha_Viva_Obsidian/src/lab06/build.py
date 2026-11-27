from pathlib import Path
from PIL import Image
import numpy as np, json, base64, io, re
from statistics import median
P=Path('/mnt/data'); O=P/'ilha_lab06'
# Keep exact prior lab and derive candidate frames only from original RGBA sheets.
old=(P/'Ilha_Viva_Laboratorio_Sprites_03.html').read_text(); orig=json.loads(old.split('const D=',1)[1].split(';const names=',1)[0]); D={}; report=[]
def uri(im):
 b=io.BytesIO(); im.save(b,format='PNG',optimize=True); return 'data:image/png;base64,'+base64.b64encode(b.getvalue()).decode()
def cut_positions(a,n,axis):
 # Search near each expected divider for minimum opaque-pixel crossings.
 v=(a>=128).sum(axis=axis); L=len(v); bounds=[0]
 for i in range(1,n):
  mid=round(i*L/n); rad=round(L/n*.20); lo=max(bounds[-1]+1,mid-rad); hi=min(L-1,mid+rad)
  b=min(range(lo,hi+1),key=lambda j:(int(v[j-1])+int(v[j]),abs(j-mid)))
  bounds.append(b)
 return bounds+[L]
def extract(key,file,cols,rows,dirs,swim=False,only=None):
 im=Image.open(P/file).convert('RGBA'); a=np.array(im)[:,:,3]; assert (a==0).mean()>.25,file
 ys=cut_positions(a,rows,1); groups={}; allraw=[]; warnings=[]
 for j,d in enumerate(dirs):
  if only is not None and d not in only: continue
  row=a[ys[j]:ys[j+1],:]; xs=cut_positions(row,cols,0); arr=[]
  for i in range(cols):
   box=(xs[i],ys[j],xs[i+1],ys[j+1]); cell=im.crop(box); ca=np.array(cell)[:,:,3]; yy,xx=np.where(ca>=128); assert len(xx)>100,(key,d,i)
   # Retain all alpha in the sprite envelope plus a margin; no recoloring or erasure.
   x0=max(0,int(xx.min())-3); y0=max(0,int(yy.min())-3); x1=min(cell.width,int(xx.max())+4); y1=min(cell.height,int(yy.max())+4)
   if min(int(xx.min()),int(yy.min()),cell.width-1-int(xx.max()),cell.height-1-int(yy.max()))<2:warnings.append(f'{d}:{i+1} pixels opacos na borda da célula')
   crop=cell.crop((x0,y0,x1,y1)); c=np.array(crop)[:,:,3]; h,w=c.shape
   # Head/trunk centroid for lateral alignment, bottom contact for land. Ignore isolated effects when choosing x pivot.
   top=c[:max(1,int(h*(.48 if swim else .30)))]; yyh,xxh=np.where(top>=200); hx=float(np.median(xxh)) if len(xxh) else w/2
   arr.append((crop,hx,box)); allraw.append(crop)
  groups[d]=arr
 # Uniform scale per sheet, never normalize individual poses independently.
 scale=(52 if swim else 91)/median([v.height for v in allraw]); result={}
 for d,arr in groups.items():
  result[d]=[]
  for crop,hx,box in arr:
   w=max(1,round(crop.width*scale));h=max(1,round(crop.height*scale)); out=crop.resize((w,h),Image.Resampling.LANCZOS); ax=round(hx*scale); ay=round(h*.62) if swim else h-3
   result[d].append({'src':uri(out),'w':w,'h':h,'ax':ax,'ay':ay})
 D[key]=result;report.append({'action':key,'source':file,'directions':{k:len(v) for k,v in result.items()},'alpha_zero':round(float((a==0).mean()),3),'edge_warnings':warnings})
extract('andar','folha_de_sprites_do_fazendeiro_pixelado.png',4,4,['baixo','esquerda','direita','cima'])
extract('correr','690668.png',4,4,['baixo','esquerda','direita','cima'])
extract('andar_novo','ciclo_de_caminhada_do_fazendeiro_pixel_art.png',8,1,['baixo'])
extract('correr_novo','folha_de_sprites_herói_em_corrida.png',12,1,['baixo'])
extract('descalco','herói_descalço_em_caminhada_pixel_art.png',8,1,['baixo'])
extract('nado_roupa','ciclo_de_natação_em_pixel_art.png',12,1,['baixo'],True)
extract('nado_calca','sprite_sheet_de_natação_em_pixel_art.png',12,1,['baixo'],True)
for key,f in [('machado','folha_de_sprites_do_fazendeiro_lenhador.png'),('enxada','sprite_de_fazendeiro_arando_a_terra.png'),('foice','folhas_ao_vento_animação_de_ceifa.png'),('regador','sprite_de_agricultor_regando_em_12_quadros.png')]:
 extract(key,f,3,4,['baixo','esquerda','direita','cima'],only=['baixo','cima'])
# Idle from first pose of approved walking sheet, no redraw.
D['parado']={d:[v[0]] for d,v in D['andar'].items()}
# Include actual older rest/entry poses only in baseline, not pretend to be current topdown.
names={'parado':'Parado','andar':'Andar (mestre)','correr':'Correr (referência)','andar_novo':'Andar (novo)','correr_novo':'Correr (novo)','descalco':'Andar descalço','enxada':'Enxada','regador':'Regador','machado':'Machado','foice':'Foice','nado_roupa':'Nado com camisa','nado_calca':'Nado sem camisa'}
s=old.replace('Animações 03','Animações 06').replace('Personagem original • laboratório de animação 03 • pivôs corrigidos','Referência top-down preservada • candidatos em avaliação • PNG com alfa').replace('const D='+json.dumps(orig,separators=(',',':'),ensure_ascii=False),'const D='+json.dumps(D,separators=(',',':'),ensure_ascii=False))
# use exact boundaries regardless of formatting in old data
start=s.index('const D='); end=s.index(';const names=',start); s=s[:start]+'const D='+json.dumps(D,separators=(',',':'),ensure_ascii=False)+s[end:]
a=s.index('const names='); b=s.index(';const canvas=',a);s=s[:a]+'const names='+json.dumps(names,ensure_ascii=False)+s[b:]
s=s.replace("!['andar','correr','nado_roupa','nado_calca'].includes(action)","!['andar','correr','andar_novo','correr_novo','descalco','nado_roupa','nado_calca'].includes(action)")
s=s.replace("D[action].direita||Object.values(D[action])[0]","Object.values(D[action])[0]").replace("'direita (única)'","Object.keys(D[action])[0]+' (disponível)'")
s=s.replace("held=null;action=a;if(swim())","held=null;action=a;if(!D[action][dir])dir=Object.keys(D[action])[0];if(swim())")
s=s.replace("if(held&&!fixed())","if(held&&!fixed()&&D[action][held])")
s=s.replace("action==='correr'?.11","action.startsWith('correr')?.11")
a=s.index("$('limit').textContent=");b=s.index(';draw()}',a);s=s[:a]+"$('limit').textContent='Direções disponíveis: '+Object.keys(D[action]).join(', ')+'. '+sequence().length+' quadros reais. '+(action==='andar'||action==='correr'?'Arte de referência, sem redesenho.':'Candidato: realismo ainda não aprovado.')"+s[b:]
a=s.index('<div class="note"><b>Como testar');b=s.index('</div></main><script>',a);s=s[:a]+'''<div class="note"><b>Como testar</b><p>Selecione uma ação, use as setas ou pause e avance pelos quadros. O ponto de apoio permanece fixo durante ferramentas. O fundo xadrez é apenas visualização, não faz parte dos PNGs.</p><p>Andar (mestre) e correr (referência) são as folhas top-down preservadas. As novas versões de frente estão separadas para comparação. Ferramentas: três poses de frente e costas; laterais omitidas pois algumas poses da folha original mudam de direção. Nados novos: somente frente. O realismo de membros e lâmina ainda está pendente; esta versão corrige o visor, não redesenha a arte.</p>'''+s[b:]
s=s.replace('const dt=Math.min((t-last)||0,50)','const dt=Math.min((t-last)||0,50)')
# make stage large enough for the whole sprite at 1:1 draw; the old renderer doesn't scale cells.
(O/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)); (P/'Ilha_Viva_Laboratorio_06.html').write_text(s)
print('actions',len(D),'frames',sum(len(v) for a in D.values() for v in a.values()),'size',len(s));print([(r['action'],r['edge_warnings']) for r in report])
