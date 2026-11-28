import cv2,glob,os,json,sys
import numpy as np
src=sys.argv[1];out=sys.argv[2]
fc=cv2.CascadeClassifier(cv2.data.haarcascades+'haarcascade_frontalface_default.xml')
fa=cv2.CascadeClassifier(cv2.data.haarcascades+'haarcascade_frontalface_alt2.xml')
res={};tiles=[]
for f in sorted(glob.glob(src+'/*.webp')):
  n=os.path.basename(f)[:-5]
  if n.startswith('unreleased'):continue
  im=cv2.imread(f);g=cv2.cvtColor(im,cv2.COLOR_BGR2GRAY)
  sharp=cv2.Laplacian(g,cv2.CV_64F).var()
  faces=list(fc.detectMultiScale(g,1.1,5,minSize=(30,30)))+list(fa.detectMultiScale(g,1.1,4,minSize=(30,30)))
  faces=sorted(faces,key=lambda r:-r[2]*r[3])
  res[n]={'sharp':round(sharp),'faces':[list(map(int,r)) for r in faces[:3]]}
  v=im.copy()
  for (x,y,w,h) in faces[:1]: cv2.rectangle(v,(x,y),(x+w,y+h),(0,255,0),2)
  cv2.putText(v,n[:14],(4,20),cv2.FONT_HERSHEY_SIMPLEX,.6,(0,0,255),2);cv2.putText(v,str(round(sharp)),(4,370),cv2.FONT_HERSHEY_SIMPLEX,.6,(0,0,255),2)
  tiles.append(cv2.resize(v,(188,188)))
while len(tiles)%8:tiles.append(np.zeros_like(tiles[0]))
rows=[np.hstack(tiles[i:i+8]) for i in range(0,len(tiles),8)]
cv2.imwrite(out,np.vstack(rows));print(json.dumps(res))
