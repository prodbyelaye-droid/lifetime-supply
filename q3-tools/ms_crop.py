# one text size and one margin for the "what our members say" cards:
# crop each screenshot to its group of bubbles, cut at a gap between bubbles where the file slices one, add a margin
# of the screenshot's own ground that shows as 16 px, and report the width at which its text shows at 15 px.
import sys,json
import numpy as np,cv2
from PIL import Image
root,dst,meas=sys.argv[1],sys.argv[2],sys.argv[3]
M=json.load(open(meas));out={};ERASE={}
TEXT,MARGIN=15.0,16.0
for f,m in M.items():
  im=Image.open(f'{root}/{f}').convert('RGB');a=np.asarray(im).astype(np.int16);H,W,_=a.shape
  bg=np.array(m['bg']);diff=np.abs(a-bg).max(axis=2);content=diff>22
  uniform=(content[:,:4].mean()<.5 and content[:,-4:].mean()<.5) and f not in ('say-t063.webp',)
  font=m['font']
  if not uniform or not font:
    mg=int(round(MARGIN*(font/TEXT if font else W/310.0)))
    out[f]={'src':f,'crop':[-mg,-mg,W+mg,H+mg],'pad':[mg]*4,'font':font,'note':'full-bleed'};continue
  core=content.copy();core[:,W-16:]=False                      # no scrollbar
  # small marks cut by the file's edge (half an avatar, a frame corner, a clipped reaction) are erased, not framed
  n,lab,st,_=cv2.connectedComponentsWithStats(core.astype(np.uint8),connectivity=8)
  erase=np.zeros_like(core)
  for i in range(1,n):
    x,y,w,h,ar=st[i]
    if (x<=1 or y<=1 or x+w>=W-17 or y+h>=H-1) and w<=48 and h<=60:erase|=(lab==i)
  core&=~erase;ERASE[f]=erase
  rows=core.any(axis=1)
  # gaps: runs of >= 6 empty rows
  def gap_after(y):                                            # first empty run of >=6 rows at or below y
    run=0
    for yy in range(y,H):
      run=run+1 if not rows[yy] else 0
      if run>=4:return yy-run+1
    return None
  def gap_before(y):
    run=0
    for yy in range(y,-1,-1):
      run=run+1 if not rows[yy] else 0
      if run>=4:return yy+run
    return None
  top,bot=0,H;note=[]
  if rows[:3].any():
    g=gap_after(0)
    if g is not None and g<0.5*H: top=g;note.append('top cut at gap')
  if rows[-3:].any():
    g=gap_before(H-1)
    if g is not None and g>top+0.5*(H-top): bot=g;note.append('bottom cut at gap')
  # a text line sliced by the file's edge (no gap to cut at): cut between that line and the next whole one
  lum=a.mean(axis=2);chroma=a.max(axis=2)-a.min(axis=2)
  txt=((lum>150)&(chroma<60)) if np.array(bg).mean()<128 else (lum<110)
  txt[:,W-16:]=False
  tr=txt.sum(axis=1)>max(3,0.01*W);runs=[];y=top
  while y<bot:
    if tr[y]:
      s0=y
      while y<bot and tr[y]:y+=1
      runs.append((s0,y))
    y+=1
  runs=[r for r in runs if r[1]-r[0]>=3]
  if len(runs)>=2 and rows[top:top+3].any() and runs[0][0]-top<=2:
    top=(runs[0][1]+runs[1][0])//2;note.append('sliced top line cut')
  if len(runs)>=2 and rows[bot-3:bot].any() and bot-runs[-1][1]<=2 and f not in ('say-t044.webp',):
    bot=(runs[-2][1]+runs[-1][0])//2;note.append('sliced bottom line cut')
  sub=core[top:bot];ys,xs=np.nonzero(sub)
  x0,x1,y0,y1=xs.min(),xs.max()+1,ys.min()+top,ys.max()+1+top
  # a blurred avatar left of the bubbles (a narrow column of content, then empty columns) is not part of the group
  occ=sub.any(axis=0)
  # a 1-4 px frame line or half an avatar cut by the file's left edge is not part of the group either
  x=x0
  while x<x1 and occ[x]:x+=1
  if x0<=2 and x-x0<=60 and x<x1:
    e=x
    while e<x1 and not occ[e]:e+=1
    if e<x1:x0=e;note.append('edge sliver left out')
  x=x1
  while x>x0 and occ[x-1]:x-=1
  if x1>=W-18 and x1-x<=4 and x>x0:
    e=x
    while e>x0 and not occ[e-1]:e-=1
    x1=e
  x=x0
  while x<x1 and occ[x]:x+=1
  e=x
  while e<x1 and not occ[e]:e+=1
  if x-x0<=110 and e-x>=6 and e<x1:
    x0=e;note.append('avatar left out');ys2,xs2=np.nonzero(sub[:,x0:]);y0,y1=ys2.min()+top,ys2.max()+1+top
  mg=int(round(MARGIN*font/TEXT))
  L,T,R,B=x0-mg,y0-mg,x1+mg,y1+mg
  pad=[int(max(0,-L)),int(max(0,-T)),int(max(0,R-W)),int(max(0,B-H))]
  out[f]={'src':f,'crop':[int(L),int(T),int(R),int(B)],'pad':pad,'font':font,'note':', '.join(note),'keep':[int(top),int(bot)]}
for f,o in out.items():
  im=Image.open(f'{root}/{f}').convert('RGB');W,H=im.size;L,T,R,B=o['crop']
  bg=tuple(M[f]['bg']) if o['note']!='full-bleed' else (0,0,0)
  kt,kb=o.get('keep',[0,H]);t0,b0=max(T,0,kt),min(B,H,kb)
  src=np.asarray(im).copy()
  if f in ERASE:src[ERASE[f]]=np.array(bg,dtype=np.uint8)
  im2=Image.fromarray(src)
  canvas=Image.new('RGB',(R-L,B-T),bg);canvas.paste(im2.crop((max(L,0),t0,min(R,W),b0)),(max(0,-L),t0-T))
  o['size']=[R-L,B-T]
  o['display']=round((R-L)*TEXT/o['font'],1) if o['font'] else None
  o['out']=f.rsplit('.',1)[0]+'-q3.webp';canvas.save(f'{dst}/'+o['out'],'WEBP',quality=88,method=6)
print(json.dumps(out,default=int))
