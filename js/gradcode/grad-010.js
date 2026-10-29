/* Row 010: measured Gaussian colour stops. No image/video texture, runtime dependency or added grain.
 * Approximation, not a pixel-identical port. See README and paired evidence before integration.
 * Source: originals/10/landbook-2000.jpg
 * mount(el, {size:{width,height}, speed:1, deep:1, manual:false, settleAfter:5})
 * deep=1 is baseline; 005 deep=1.25 raises chroma; 037 deep=1.25 widens luminous regions.
 */
const DATA={"row":"010","crop":[0,110,2000,1670],"description":"Base44 hero: pale blue/cyan top through warm white into an orange horizontal light band. Public full-page Land-book rendition; motion unverified.","nx":8,"ny":14,"sigma":0.75,"times":[0.0],"colours":[[[0.589308,0.814893,0.910239],[0.514663,0.779303,0.869563],[0.34794,0.712317,0.793049],[0.39068,0.711406,0.804167],[0.386395,0.70949,0.805265],[0.351275,0.71667,0.801709],[0.510874,0.772525,0.859301],[0.594616,0.819037,0.916231],[0.777361,0.901964,0.912115],[0.691265,0.824026,0.884914],[0.642318,0.810055,0.890589],[0.574889,0.780189,0.856892],[0.570038,0.777144,0.855436],[0.644884,0.809308,0.892519],[0.690653,0.83109,0.885962],[0.774998,0.898902,0.913185],[0.968358,0.951018,0.960953],[0.615682,0.821323,0.881774],[0.791415,0.901454,0.933131],[0.748398,0.854738,0.889184],[0.747329,0.856119,0.891679],[0.795935,0.897062,0.936282],[0.609952,0.816542,0.879262],[0.974605,0.952657,0.961435],[0.956883,0.979049,0.966409],[0.889827,0.91841,0.913121],[0.921718,0.940549,0.940899],[0.811738,0.869846,0.882376],[0.807683,0.872837,0.88107],[0.921124,0.943792,0.938071],[0.893925,0.921791,0.913404],[0.949697,0.977056,0.965698],[1.015007,0.989723,1.018368],[0.858705,0.917789,0.933144],[0.970628,1.009834,1.047163],[0.806127,0.839604,0.835468],[0.801283,0.842242,0.834069],[0.968342,1.006202,1.047386],[0.859541,0.916568,0.934347],[1.014138,0.994759,1.018218],[0.990573,0.980026,0.921728],[1.010933,0.974255,0.957261],[1.030533,1.027435,1.018677],[0.527204,0.530483,0.387487],[0.520099,0.527329,0.376835],[1.034532,1.031772,1.020021],[1.008041,0.974849,0.956939],[0.99284,0.976221,0.920652],[0.988516,1.004689,1.046147],[0.937135,0.943647,0.956579],[1.08,1.08,1.08],[0.780316,0.780399,0.938253],[0.762698,0.763187,0.917497],[1.08,1.08,1.08],[0.938516,0.943033,0.957605],[0.987399,1.007857,1.046755],[0.986758,0.958406,0.894149],[0.963857,0.950432,0.914425],[0.955225,0.952505,0.898714],[1.075006,1.066126,0.936818],[1.07495,1.067574,0.940106],[0.962275,0.957018,0.904429],[0.95984,0.948156,0.91174],[0.988882,0.956388,0.894356],[0.985598,1.02407,1.08],[1.014795,1.033046,1.08],[0.999833,0.99546,1.056735],[0.948246,0.959032,1.062769],[0.949948,0.958565,1.06083],[0.995264,0.994943,1.054574],[1.016457,1.034267,1.08],[0.98487,1.027881,1.08],[1.010262,0.772061,0.47302],[0.987105,0.780683,0.506967],[1.005853,0.838919,0.561944],[1.028524,0.844059,0.529522],[1.034278,0.84463,0.532462],[1.002958,0.837357,0.561172],[0.989666,0.77871,0.50953],[1.011668,0.769578,0.474334],[0.989744,0.687013,0.297674],[1.006619,0.679938,0.254642],[0.988397,0.56142,0.099702],[0.975903,0.566489,0.151449],[0.969089,0.567653,0.150089],[0.992747,0.563279,0.099828],[1.002954,0.682903,0.250689],[0.987828,0.689381,0.293023],[1.002833,0.317063,0.183963],[0.990621,0.239371,0.088658],[1.013758,0.506722,0.473836],[1.013214,0.587225,0.558873],[1.018915,0.586494,0.55835],[1.009273,0.505129,0.47528],[0.991398,0.240026,0.094754],[1.009235,0.316379,0.183102],[1.000348,0.88777,0.530947],[1.003108,1.075333,0.84649],[0.98082,1.041462,0.834245],[0.979997,1.030561,0.875452],[0.97816,1.032833,0.880891],[0.979381,1.040221,0.830562],[1.005812,1.072723,0.843922],[0.992649,0.888076,0.532088],[0.981099,0.962338,1.063554],[0.96632,0.899173,0.981888],[0.993747,0.900807,0.975576],[0.982483,0.957392,1.032175],[0.985698,0.955868,1.026889],[0.993398,0.904367,0.98141],[0.967845,0.900484,0.981151],[0.984342,0.964205,1.066238]]],"duration":0,"stillTime":0,"deepMode":"chroma","grain":0,"motionVerified":false,"sourceStart":0};
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
