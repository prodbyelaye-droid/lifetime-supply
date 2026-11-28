# native text size per screenshot: the most common height of round lowercase glyphs (x-height) / 0.52
import sys,json,cv2
import numpy as np
root=sys.argv[1];files=sys.argv[2:];out={}
def xheight(mask):
  n,lab,st,_=cv2.connectedComponentsWithStats(mask.astype(np.uint8),connectivity=8)
  hs=[]
  for i in range(1,n):
    x,y,w,h,a=st[i]
    if 5<=h<=90 and 0.55<=w/h<=1.35 and a>=0.35*w*h: hs.append(h)
  if len(hs)<8:return None,len(hs)
  hist=np.bincount(hs);k=int(hist.argmax())
  # weighted centre of the peak (+-1)
  lo,hi=max(k-1,0),min(k+2,len(hist));c=float((np.arange(lo,hi)*hist[lo:hi]).sum()/hist[lo:hi].sum())
  return c,int(hist[lo:hi].sum())
for f in files:
  im=cv2.imread(f'{root}/{f}');g=cv2.cvtColor(im,cv2.COLOR_BGR2GRAY).astype(np.int16)
  chroma=(im.max(axis=2).astype(np.int16)-im.min(axis=2))
  bl=cv2.blur(g,(25,25))
  cands={'bright':(g>150)&(chroma<60)&(g-bl>40),'dark':(g<110)&(bl-g>40),'contrast':np.abs(g-bl)>55}
  best=None
  for k,m in cands.items():
    xh,cnt=xheight(m)
    if xh and (best is None or cnt>best[2]):best=(k,xh,cnt)
  out[f]={'font':round(best[1]/0.52,1),'via':best[0],'n':best[2]} if best else None
print(json.dumps(out))
