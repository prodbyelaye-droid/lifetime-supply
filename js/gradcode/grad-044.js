/* Row 044: measured Gaussian colour stops. No image/video texture, runtime dependency or added grain.
 * Approximation, not a pixel-identical port. See README and paired evidence before integration.
 * Source: originals/44/landbook-2000.jpg
 * mount(el, {size:{width,height}, speed:1, deep:1, manual:false, settleAfter:5})
 * deep=1 is baseline; 005 deep=1.25 raises chroma; 037 deep=1.25 widens luminous regions.
 */
const DATA={"row":"044","crop":[40,1570,1970,2630],"description":"Calendly: deep blue upper field, pale cyan left and pink/violet bottom/right. Central product card excluded; motion unverified.","nx":9,"ny":7,"sigma":0.75,"times":[0.0],"colours":[[[0.798864,0.942819,0.998105],[0.74841,0.740988,0.797829],[0.941993,0.911097,0.975032],[0.815837,0.880381,0.92223],[0.867553,0.914628,0.944319],[0.807105,0.889922,0.949149],[0.934198,0.945363,0.958386],[0.603545,0.746528,0.867037],[0.839595,0.914687,0.911268],[0.628951,0.905692,1.08],[-0.08,0.172433,0.617754],[-0.08,0.307505,0.656159],[-0.08,0.140731,0.618478],[-0.08,0.227693,0.623692],[-0.08,0.193096,0.631911],[-0.08,0.213297,0.66351],[-0.08,0.211733,0.512744],[0.022778,0.202964,0.594043],[1.08,1.08,1.08],[-0.014995,0.265701,0.626463],[0.425007,0.621004,0.695812],[0.374183,0.59856,0.745328],[0.198014,0.525054,0.690432],[0.538726,0.638106,0.788488],[-0.08,0.465766,0.515002],[0.802772,0.499119,0.88093],[1.08,0.712813,1.08],[0.978144,1.08,1.08],[-0.08,0.196711,0.601595],[0.179353,0.333196,0.688224],[0.429462,0.622964,0.735382],[0.402221,0.548322,0.680397],[0.418403,0.498148,0.710456],[-0.08,0.384762,0.569279],[0.547232,0.420171,0.842787],[1.08,0.415795,0.990225],[1.079433,1.08,0.933256],[0.982426,0.617916,1.017385],[1.08,0.508764,0.837118],[0.649012,0.693779,0.649451],[0.578765,0.653172,0.64529],[0.550713,0.68123,0.656165],[0.237388,0.74764,0.822673],[0.837726,0.465449,0.915466],[0.910188,0.766494,0.975816],[0.954762,1.08,0.879802],[0.674249,0.456172,0.952477],[0.418935,0.586786,1.012169],[0.440906,0.541758,1.08],[0.696052,0.539183,1.08],[0.794528,0.49549,1.08],[1.035965,0.51447,1.03105],[1.08,0.490115,1.031487],[0.528606,0.59124,0.990255],[0.793312,0.984431,0.862923],[0.73125,0.793261,0.990158],[0.815143,0.941685,0.93283],[0.921295,0.874275,0.924049],[0.870619,0.894992,0.909501],[0.902588,0.878289,0.925902],[0.848214,0.899205,0.912217],[1.002862,0.829284,0.948006],[0.99047,0.893753,0.92754]]],"duration":0,"stillTime":0,"deepMode":"chroma","grain":0,"motionVerified":false,"sourceStart":0};
export const source=Object.freeze({row:DATA.row,crop:DATA.crop,description:DATA.description,motionVerified:DATA.motionVerified,duration:DATA.duration});
export function mount(el,opts={}) {
 if(!el||!el.appendChild)throw new TypeError('mount needs a host element');
 const canvas=document.createElement('canvas');canvas.setAttribute('aria-hidden','true');canvas.style.cssText='display:block;width:100%;height:100%';el.appendChild(canvas);
 const gl=canvas.getContext('webgl',{alpha:false,antialias:false,preserveDrawingBuffer:true});
 if(!gl){canvas.remove();throw new Error('WebGL is unavailable; keep the host solid white.');}
 const compile=(type,text)=>{const s=gl.createShader(type);gl.shaderSource(s,text);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s;};
 const vs=compile(gl.VERTEX_SHADER,'attribute vec2 position;attribute vec3 colour;varying vec3 rgb;void main(){rgb=colour;gl_Position=vec4(position,0.,1.);}');
 const fs=compile(gl.FRAGMENT_SHADER,'precision highp float;varying vec3 rgb;void main(){gl_FragColor=vec4(clamp(rgb,0.,1.),1.);}');
 const program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));gl.useProgram(program);
 const steps=64,vertices=(steps+1)**2,N=DATA.nx*DATA.ny,positions=new Float32Array(vertices*2),colours=new Float32Array(vertices*3),indices=new Uint16Array(steps*steps*6),weights=new Float32Array(vertices*N);
 for(let y=0;y<=steps;y++)for(let x=0;x<=steps;x++){
  const v=y*(steps+1)+x,u=x/steps,w=y/steps;positions[v*2]=u*2-1;positions[v*2+1]=1-w*2;
  const wx=[],wy=[];let sx=0,sy=0;
  for(let j=0;j<DATA.nx;j++){wx[j]=Math.exp(-.5*((u-j/(DATA.nx-1))/(DATA.sigma/(DATA.nx-1)))**2);sx+=wx[j];}
  for(let i=0;i<DATA.ny;i++){wy[i]=Math.exp(-.5*((w-i/(DATA.ny-1))/(DATA.sigma/(DATA.ny-1)))**2);sy+=wy[i];}
  for(let i=0;i<DATA.ny;i++)for(let j=0;j<DATA.nx;j++)weights[v*N+i*DATA.nx+j]=wx[j]*wy[i]/(sx*sy);
 }
 let k=0;for(let y=0;y<steps;y++)for(let x=0;x<steps;x++){const a=y*(steps+1)+x,b=a+1,c=a+steps+1,d=c+1;indices.set([a,c,b,b,c,d],k);k+=6;}
 const positionBuffer=gl.createBuffer(),colourBuffer=gl.createBuffer(),indexBuffer=gl.createBuffer();
 gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);gl.bufferData(gl.ARRAY_BUFFER,positions,gl.STATIC_DRAW);const pa=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(pa);gl.vertexAttribPointer(pa,2,gl.FLOAT,false,0,0);
 gl.bindBuffer(gl.ARRAY_BUFFER,colourBuffer);gl.bufferData(gl.ARRAY_BUFFER,colours,gl.DYNAMIC_DRAW);const ca=gl.getAttribLocation(program,'colour');gl.enableVertexAttribArray(ca);gl.vertexAttribPointer(ca,3,gl.FLOAT,false,0,0);
 gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indices,gl.STATIC_DRAW);
 const stops=new Float32Array(N*3),keyframes=DATA.colours.map(x=>Float32Array.from(x.flat()));
 let time=DATA.stillTime||0,deep=Number.isFinite(opts.deep)?Math.max(0,opts.deep):1,speed=Number.isFinite(opts.speed)?Math.max(0,opts.speed):1,frames=0,lastCost=0,visible=false,wantsPlay=!opts.manual,dead=false,raf=0,last=0,elapsed=0;
 const media=matchMedia('(prefers-reduced-motion: reduce)');
 function renderAt(seconds,forceDeep=deep){
  if(dead)return;const begin=performance.now();time=Math.max(0,Number(seconds)||0);let a=0,b=0,mix=0;
  if(DATA.times.length>1){const t=Math.min(time,DATA.duration);while(a<DATA.times.length-2&&DATA.times[a+1]<t)a++;b=a+1;mix=(t-DATA.times[a])/(DATA.times[b]-DATA.times[a]);}
  const A=keyframes[a],C=keyframes[b];for(let i=0;i<stops.length;i++)stops[i]=A[i]+(C[i]-A[i])*mix;
  for(let v=0;v<vertices;v++){
   let r=0,g=0,b=0,offset=v*N;for(let i=0;i<N;i++){const f=weights[offset+i];r+=f*stops[i*3];g+=f*stops[i*3+1];b+=f*stops[i*3+2];}
   if(forceDeep!==1){if(DATA.deepMode==='glow'){const x=(v%(steps+1))/steps,y=Math.floor(v/(steps+1))/steps,edge=Math.min(x,1-x,y,1-y);const lift=Math.min(.5,Math.max(0,forceDeep-1)*.85*Math.exp(-edge*edge/(.18*.18)));r+=(1-r)*lift;g+=(1-g)*lift;b+=(1-b)*lift;}else{const l=.2126*r+.7152*g+.0722*b;r=l+(r-l)*forceDeep;g=l+(g-l)*forceDeep;b=l+(b-l)*forceDeep;}}
   colours[v*3]=r;colours[v*3+1]=g;colours[v*3+2]=b;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER,colourBuffer);gl.bufferSubData(gl.ARRAY_BUFFER,0,colours);gl.drawElements(gl.TRIANGLES,indices.length,gl.UNSIGNED_SHORT,0);frames++;lastCost=performance.now()-begin;
 }
 function resize(size=opts.size){const rect=el.getBoundingClientRect();const width=typeof size==='number'?size:size?.width||rect.width||1440;const height=typeof size==='number'?Math.round(size*9/16):size?.height||rect.height||900;canvas.width=Math.max(1,Math.round(width));canvas.height=Math.max(1,Math.round(height));gl.viewport(0,0,canvas.width,canvas.height);renderAt(time);}
 function cancel(){cancelAnimationFrame(raf);raf=0;last=0;}
 function eligible(){return !dead&&wantsPlay&&visible&&!document.hidden&&!media.matches&&DATA.motionVerified&&speed>0;}
 function tick(now){raf=0;if(!eligible())return;if(last){const dt=Math.min(.1,(now-last)/1000);time+=dt*speed;elapsed+=dt;}last=now;renderAt(time);if(elapsed>=(opts.settleAfter??5)){wantsPlay=false;last=0;return;}raf=requestAnimationFrame(tick);}
 function sync(){cancel();if(media.matches)renderAt(DATA.stillTime||0);else if(eligible())raf=requestAnimationFrame(tick);}
 const io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();});io.observe(el);
 const ro=new ResizeObserver(()=>{if(!opts.size)resize();});ro.observe(el);
 media.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);resize();
 return {canvas,source,renderAt,pause(){wantsPlay=false;sync();},play(){elapsed=0;wantsPlay=true;sync();},setDeep(value){deep=Math.max(0,Number(value)||0);renderAt(time);},setSpeed(value){speed=Math.max(0,Number(value)||0);sync();},resize,stats(){const ext=gl.getExtension('WEBGL_debug_renderer_info');return {frames,time,renderMs:lastCost,width:canvas.width,height:canvas.height,visible,playing:!!raf,reduced:media.matches,renderer:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER)};},finish(){gl.finish();},destroy(){dead=true;cancel();io.disconnect();ro.disconnect();media.removeEventListener('change',sync);document.removeEventListener('visibilitychange',sync);gl.deleteBuffer(positionBuffer);gl.deleteBuffer(colourBuffer);gl.deleteBuffer(indexBuffer);gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);canvas.remove();}};
}
export default mount;
