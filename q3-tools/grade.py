# one photo standard for the artist tiles: a head-and-shoulders square crop (never under 272 source px), one B&W grade, 272 px out
import json,sys,os
import numpy as np
from PIL import Image,ImageFilter
src,dst,facesf=sys.argv[1],sys.argv[2],sys.argv[3]
faces=json.load(open(facesf))
# faces the detector missed or got wrong: [x, y, w] of the face box in the 376 px source (read off the contact sheet)
manual={'a-reece':[110,110,170],'ann-marie':[150,40,100],'dc-the-don':[140,40,100],'glokknine':[80,40,100],
 'lil-poppa':[160,50,70],'toosii':[120,40,140],'tory-lanez':[120,110,140],'yung-bleu':[140,40,100],'yungeen-ace':[80,60,220],
 'kcamp':[170,30,50],'yk-osiris':[200,0,50],'onefour':None}
MIN,OUT,K,TOP=272,272,2.7,0.20
spec={}
for n,v in faces.items():
  im=Image.open(f'{src}/{n}.webp').convert('RGB');W=im.width
  if n in manual: box=manual[n]
  else: box=v['faces'][0][:3] if v['faces'] else None
  if box is None: s=W;l=t=0
  else:
    x,y,w=box;s=int(round(min(W,max(MIN,K*w))));cx=x+w/2
    l=int(round(min(max(cx-s/2,0),W-s)));t=int(round(min(max(y-TOP*s,0),W-s)))
  spec[n]=[l,t,s]
  c=im.crop((l,t,l+s,t+s)).resize((OUT,OUT),Image.LANCZOS)
  g=np.asarray(c.convert('L'),dtype=np.float32)/255
  lo,hi=np.percentile(g,1),np.percentile(g,99)
  g=np.clip((g-lo)/max(hi-lo,1e-3),0,1)
  g=g*0.94+0.03                      # one black point and one white point for every tile
  g=g+0.12*(g-g*g)*(2*g-1)*-1        # a gentle shared S-curve
  out=Image.fromarray(np.uint8(np.clip(g,0,1)*255+.5),'L').filter(ImageFilter.UnsharpMask(radius=0.8,percent=35,threshold=2))
  out.save(f'{dst}/{n}.webp','WEBP',quality=84,method=6)
json.dump(spec,open(dst+'/../l12-spec.json','w'))
print(json.dumps(spec))
