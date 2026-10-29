/* Row 005: measured Gaussian colour stops. No image/video texture, runtime dependency or added grain.
 * Approximation, not a pixel-identical port. See README and paired evidence before integration.
 * Source: originals/5/original-footer-desktop.avif
 * mount(el, {size:{width,height}, speed:1, deep:1, manual:false, settleAfter:5})
 * deep=1 is baseline; 005 deep=1.25 raises chroma; 037 deep=1.25 widens luminous regions.
 */
const DATA={"row":"005","crop":[0,0,2106,1165],"description":"Soft blue/periwinkle light with violet vertical troughs. Full-size footer original is a still; motion is unverified.","nx":9,"ny":6,"sigma":0.75,"times":[0.0],"colours":[[[0.600799,0.771236,0.969626],[0.405935,0.517853,0.987929],[0.965756,1.028965,0.963602],[0.766145,0.872013,1.032326],[0.677712,0.770064,0.927281],[1.08,1.08,1.015436],[0.643716,0.713799,0.95172],[1.08,1.025446,0.979903],[0.644215,0.685481,1.00506],[0.872808,0.995262,1.006944],[0.66849,0.750275,0.937566],[0.866447,0.975005,1.046485],[0.541024,0.655468,0.904236],[1.08,1.08,1.08],[0.446083,0.496307,0.944989],[0.908043,1.061383,1.022587],[1.08,1.022332,1.036559],[0.38506,0.482915,0.903008],[0.696596,0.829749,0.977475],[0.737164,0.774175,1.023606],[0.55531,0.838873,0.908243],[0.653362,0.531442,1.045137],[0.66239,1.05206,0.926029],[0.469836,0.261726,0.965088],[1.058157,1.08,0.981856],[0.813746,0.77877,0.958176],[0.611954,0.820692,1.034283],[0.487118,0.662747,0.904472],[1.08,1.08,1.030307],[0.609563,0.712616,0.948275],[0.781396,0.736788,1.070557],[0.593722,0.349427,0.784807],[0.580137,0.63136,1.02365],[0.9163,1.017592,0.90485],[0.6543,0.921525,1.039745],[0.788742,0.620946,0.906248],[0.855697,0.784441,1.026754],[0.544657,0.781236,1.08],[0.816582,0.712342,0.875079],[0.662209,0.795333,1.034712],[0.641669,0.62116,0.968818],[0.875582,0.804042,1.08],[0.70917,0.88304,0.837522],[0.91154,0.494659,0.938334],[0.602054,0.840134,0.958606],[0.775546,0.934964,0.902157],[0.780457,0.362116,0.701677],[0.828603,0.966426,1.065405],[0.849657,0.625951,1.038915],[0.81195,0.991701,0.773688],[0.736515,0.770169,1.05839],[0.879913,0.689624,0.934096],[0.679201,0.867691,1.037987],[0.743097,0.636772,0.88887]]],"duration":0,"stillTime":0,"deepMode":"chroma","grain":0,"motionVerified":false};
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
  if(DATA.times.length>1){const t=time<=DATA.duration?time:time%DATA.duration;while(a<DATA.times.length-2&&DATA.times[a+1]<t)a++;b=a+1;mix=(t-DATA.times[a])/(DATA.times[b]-DATA.times[a]);}
  const A=keyframes[a],C=keyframes[b];for(let i=0;i<stops.length;i++)stops[i]=A[i]+(C[i]-A[i])*mix;
  for(let v=0;v<vertices;v++){
   let r=0,g=0,b=0,offset=v*N;for(let i=0;i<N;i++){const f=weights[offset+i];r+=f*stops[i*3];g+=f*stops[i*3+1];b+=f*stops[i*3+2];}
   if(forceDeep!==1){if(DATA.deepMode==='glow'){const l=Math.max(r,g,b);const lift=Math.max(0,forceDeep-1)*.28*Math.pow(l,2);r+=(1-r)*lift;g+=(1-g)*lift;b+=(1-b)*lift;}else{const l=.2126*r+.7152*g+.0722*b;r=l+(r-l)*forceDeep;g=l+(g-l)*forceDeep;b=l+(b-l)*forceDeep;}}
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
