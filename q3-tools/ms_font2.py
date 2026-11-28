# native text size per screenshot from x-height, with text found by local contrast (works on any ground)
import sys,json
import numpy as np
from PIL import Image,ImageFilter
root=sys.argv[1];files=sys.argv[2:];out={}
for f in files:
  im=Image.open(f'{root}/{f}').convert('L');g=np.asarray(im).astype(np.float32);H,W=g.shape
  bl=np.asarray(im.filter(ImageFilter.BoxBlur(9))).astype(np.float32)
  t=np.abs(g-bl)>38
  t[:,W-16:]=False
  rows=t.sum(axis=1);thr=max(4,0.012*W)
  runs=[];y=0
  while y<H:
    if rows[y]>thr:
      s=y
      while y<H and rows[y]>thr:y+=1
      if y-s>=5:runs.append((s,y))
    y+=1
  xs=[]
  for s,e in runs:
    seg=rows[s:e];band=int((seg>=0.5*seg.max()).sum())
    if 3<=band<=80:xs.append(band)
  out[f]=round(float(np.median(xs))/0.52,1) if xs else None
print(json.dumps(out))
