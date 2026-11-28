# per screenshot: background, content box, sliced edges and native text size (x-height of bright text lines / 0.52)
import sys,json,re
import numpy as np
from PIL import Image
root=sys.argv[1];files=sys.argv[2:]
out={}
for f in files:
  im=np.asarray(Image.open(f'{root}/{f}').convert('RGB')).astype(np.int16);H,W,_=im.shape
  border=np.concatenate([im[0],im[-1],im[:,0],im[:,-1]])
  vals,counts=np.unique(border//4,axis=0,return_counts=True);bg=(vals[counts.argmax()]*4+2)
  diff=np.abs(im-bg).max(axis=2);content=diff>22
  lum=im.mean(axis=2)
  # text: bright, low-chroma pixels (white text on dark bubbles), or dark text on light grounds
  dark_ground=bg.mean()<128
  text=(lum>150)&((im.max(axis=2)-im.min(axis=2))<40) if dark_ground else (lum<90)
  # x-height per text line
  rows=text.sum(axis=1);thr=max(3,0.01*W)
  runs=[];y=0
  while y<H:
    if rows[y]>thr:
      s=y
      while y<H and rows[y]>thr:y+=1
      if y-s>=6:runs.append((s,y))
    y+=1
  xh=[]
  for s,e in runs:
    seg=rows[s:e];m=seg.max();band=(seg>=0.45*m).sum()
    if 4<=band<=60:xh.append(band)
  xhm=float(np.median(xh)) if xh else None
  # content box, ignoring a 1-8 px bar hugging the right edge (the app's scrollbar)
  cols=content.sum(axis=0)
  rx=W
  edge=cols[W-14:]
  ys,xs=np.nonzero(content)
  x0,x1,y0,y1=xs.min(),xs.max()+1,ys.min(),ys.max()+1
  r={'size':[W,H],'bg':[int(v) for v in bg],'box':[int(x0),int(y0),int(x1),int(y1)],'touch':{'top':bool(content[:3].any()),'bottom':bool(content[-3:].any()),'right':bool(content[:,-3:].any())},
     'xh':xhm,'font':round(xhm/0.52,1) if xhm else None,'lines':len(runs)}
  out[f]=r
print(json.dumps(out))
