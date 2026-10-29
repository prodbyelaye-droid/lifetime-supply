import * as THREE from '../assets/assembly/three.module.js';
import {PALETTES,BLOTS} from "./palettes.js";
// Sabo Sugi, Abstract Fractal, MIT. Full notice: ../assets/assembly/SABO-LICENSE.txt
const vertexShader = `

void main()
{
    gl_Position = vec4(position, 1.0);
}

`;
const fragmentShader = `

precision highp float;

uniform float iTime;
uniform vec3 iResolution;


#define R(a) mat2(cos(a),-sin(a),sin(a),cos(a))


float F(vec3 p)
{
    float s = 1.1;
    float d = 1e5;
    float t = 0.35 * iTime;

    for(int i = 0; i < 3; i++)
    {
        float j = float(i);

        p.xy *= R(
            0.23 +
            0.36 * sin(t + j)
        );

        p.yz *= R(
            -0.23 * 9.9 +
            0.37 * cos(0.8 * t + j)
        );

        p += -0.59 * vec3(
            sin(-0.8 * p.y + t),
            sin(1.5 * p.z - 0.6 * t),
            sin(4.6 * p.x + 0.3 * t)
        );

        p = sqrt(
            p * p + 0.16
        ) - 2.56;

        d = min(
            d,
            length(p) / s
        );

        p *= 2.72;
        s *= 2.72;
    }

    return min(
        0.63 * d,
        0.16 *
        abs(length(p.xy) + 2.05) /
        s
    );
}


void mainImage(
    out vec4 O,
    in vec2 I
)
{
    vec2 u =
        (2.0 * I - iResolution.xy) /
        iResolution.y;

    vec3 r = normalize(
        vec3(u, 1.25)
    );

    vec3 c = vec3(0.0);
    vec3 p;

    float z = 0.0;
    float d;


    for(int i = 0; i < 113; i++)
    {
        p =
            r * z +
            vec3(
                0.0,
                0.0,
                -2.8
            );


        p.xy *= R(
            -1.13 *
            sin(
                0.4 * p.z +
                0.15 * iTime
            )
        );


        d = F(p);


        z += max(
            0.002,
            0.49 * d
        );


        c +=
            (
                0.5 +
                0.5 *
                cos(
                    2.7 * z +
                    0.2 * iTime +
                    vec3(
                        1.4,
                        2.1,
                        4.0
                    )
                )
            )
            *
            0.018 /
            max(
                d,
                0.004
            );


        if(z > 12.0)
        {
            break;
        }
    }


    c =
        1.0 -
        exp(
            -0.055 * c
        );


    O = vec4(
        pow(
            max(c, 0.0),
            vec3(0.85)
        ),
        1.0
    );
}


void main()
{
    mainImage(
        gl_FragColor,
        gl_FragCoord.xy
    );
}

`;


// Round 2: no single grade. Each host maps Sabo's raw field onto its own sampled palette
// (js/palettes.js). The fluid's motion is untouched; only the colour pass is per surface.
const grade=`
uniform vec3 uC0,uC1,uC2,uW0,uW1,uW2,uGlow;
uniform float uDeepGround,uCloud,uCloudR,uCloudTime,uScale;
uniform vec2 uCloudAt;
vec3 ramp(vec3 a,vec3 b,vec3 c,float t){return t<.5?mix(a,b,t*2.):mix(b,c,t*2.-1.);}
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.03+17.;a*=.5;}return v;}
vec3 gradePalette(vec3 raw){
 float light=dot(raw,vec3(.2126,.7152,.0722));
 float warm=smoothstep(-.05,.11,raw.r-raw.b);
 // Dark raw = dense pigment. White-ground surfaces keep a lighter floor so they bloom out of white.
 float depth=clamp(1.3-light*1.25,0.,1.);
 // White-ground surfaces reach the deepest stop only in the densest cores (183: indigo is ~5% of the tile).
 depth=mix(.04+.96*pow(depth,2.6),.30+depth*.70,uDeepGround);
 vec3 col=mix(ramp(uC0,uC1,uC2,depth),ramp(uW0,uW1,uW2,depth),warm);
 // Where the two families meet the field passes through white (184's sweeps), never a grey midpoint.
 col=mix(col,vec3(1.),pow(1.-abs(2.*warm-1.),.7)*mix(.55,.22,uDeepGround));
 // Glow: the palette's luminous stop screened over highlights, then white light at the peaks.
 float h=smoothstep(.42,.86,light);
 col=1.-(1.-col)*(1.-uGlow*h*.75);
 col=mix(col,vec3(1.),smoothstep(.78,.99,light)*mix(.45,.25,uDeepGround));
 return col;
}
// Hero cloud: an edge that morphs with low-frequency noise and the fluid's own density,
// so the colour feathers into the white like a gradient instead of a circular mask.
float cloudMask(vec2 frag,float light){
 vec2 p=(frag/iResolution.xy-uCloudAt);p.x*=iResolution.x/iResolution.y;p/=uCloudR;
 float t=uCloudTime;
 float n=fbm(p*1.35+vec2(.045*t,-.035*t));
 float n2=fbm(p*3.1+vec2(-.03*t,.05*t)+5.2);
 float r=length(p*vec2(.86,1.18))+(n-.5)*1.15+(n2-.5)*.42-light*.24;
 return 1.-smoothstep(.30,.98,r);
}
`;

export const MATERIAL = Object.freeze({scale:1.35, speed:.5, resolution:.45, fps:30});
const fieldShader = fragmentShader.replace('uniform vec3 iResolution;', 'uniform vec3 iResolution;\n'+grade)
.replace('d = F(p);','d = F(p / uScale) * uScale;')
.replace(/void main\(\)\s*\{[\s\S]*?\}\s*$/,`void main(){
 mainImage(gl_FragColor,gl_FragCoord.xy);
 vec3 raw=gl_FragColor.rgb;
 vec3 col=gradePalette(raw);
 float m=uCloud>.5?cloudMask(gl_FragCoord.xy,dot(raw,vec3(.2126,.7152,.0722))):1.;
 gl_FragColor=vec4(mix(vec3(1.),col,m),1.);
}`);

// Headline full stops: a small raymarched metaball. Three lobes and a satellite droplet
// drift and merge, lit with wrap diffuse, a tinted specular and a luminous rim (no white, 168R).
const blotShader = `
precision highp float;
uniform float iTime,uSeed;
uniform vec3 iResolution,uLight,uBase,uDeep;
float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
float map(vec3 q){
 float t=iTime+uSeed;
 float body=length(q*vec3(1.,1.05,1.))-.48;
 body+=.03*sin(q.x*7.+t*1.9)*sin(q.y*6.-t*1.4)*sin(q.z*5.+t*1.1);
 vec3 a=vec3(.27*sin(t*.9),.22*cos(t*1.15),.18*sin(t*.7+1.));
 vec3 b=vec3(-.26*cos(t*.75+2.),-.2*sin(t*1.05),.2*cos(t*.8));
 float d=smin(body,length(q-a)-.29,.26);
 d=smin(d,length(q-b)-.25,.26);
 // Satellite orbits at a breathing radius, so it pinches off and rejoins (Grok's dot cluster, row 19).
 float o=t*.7,rad=.6+.16*sin(t*.53);
 vec3 s=vec3(rad*cos(o),rad*.8*sin(o),.25*sin(o*1.3));
 return smin(d,length(q-s)-.1,.1);
}
vec3 nrm(vec3 p){vec2 e=vec2(.0015,0.);
 return normalize(vec3(map(p+e.xyy)-map(p-e.xyy),map(p+e.yxy)-map(p-e.yxy),map(p+e.yyx)-map(p-e.yyx)));}
void main(){
 float view=1.05;
 vec2 u=(2.*gl_FragCoord.xy-iResolution.xy)/iResolution.y*view;
 vec3 ro=vec3(u,3.),rd=vec3(0.,0.,-1.),p=ro,best=ro;
 float z=0.,dmin=1e5;
 for(int i=0;i<70;i++){p=ro+rd*z;float d=map(p);if(d<dmin){dmin=d;best=p;}if(d<.0008)break;z+=d;if(z>6.)break;}
 float px=2.*view/iResolution.y;
 float a=1.-smoothstep(0.,px*1.5,dmin);
 if(a<=0.){gl_FragColor=vec4(0.);return;}
 vec3 n=nrm(best),v=-rd,l=normalize(vec3(-.55,.7,.6));
 float dif=clamp(dot(n,l)*.5+.5,0.,1.);
 float spec=pow(clamp(dot(reflect(-l,n),v),0.,1.),40.);
 float fres=pow(1.-clamp(dot(n,v),0.,1.),2.4);
 vec3 col=mix(uDeep*.72,uBase,smoothstep(.08,.8,dif));
 col=mix(col,uLight,fres*.5);
 col+=uLight*spec*.85;
 col+=uLight*.22*pow(clamp(dot(n,normalize(vec3(.45,-.6,.5))),0.,1.),3.);
 gl_FragColor=vec4(clamp(col,0.,1.)*a,a);
}
`;

const rgb=hex=>{const n=parseInt(hex.slice(1),16);return new THREE.Vector3((n>>16)/255,((n>>8)&255)/255,(n&255)/255);};
function pass(fragmentShader,uniforms){
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute([-1,-1,0,3,-1,0,-1,3,0],3));
  const material=new THREE.ShaderMaterial({uniforms,vertexShader,fragmentShader,depthTest:false,depthWrite:false,toneMapped:false});
  const scene=new THREE.Scene(),camera=new THREE.Camera(),mesh=new THREE.Mesh(geometry,material);mesh.frustumCulled=false;scene.add(mesh);
  return {scene,camera,uniforms,dispose(){geometry.dispose();material.dispose()}};
}
const v3=()=>({value:new THREE.Vector3()});
function fieldPass(config){
  return pass(fieldShader,{iTime:{value:0},iResolution:{value:new THREE.Vector3(1,1,1)},uScale:{value:config.scale},
    uC0:v3(),uC1:v3(),uC2:v3(),uW0:v3(),uW1:v3(),uW2:v3(),uGlow:v3(),
    uDeepGround:{value:0},uCloud:{value:0},uCloudR:{value:1},uCloudTime:{value:0},uCloudAt:{value:new THREE.Vector2(.5,.5)}});
}
function blotPass(){
  return pass(blotShader,{iTime:{value:0},iResolution:{value:new THREE.Vector3(1,1,1)},uSeed:{value:0},uLight:v3(),uBase:v3(),uDeep:v3()});
}
function hostColours(host,i){
  const seed=Number(host.dataset.seed??i*11.3);
  if(host.dataset.material==='blot'){
    const b=BLOTS[host.dataset.blot];if(!b)throw new Error(`Unknown blot ${host.dataset.blot}`);
    return {kind:'blot',seed,light:rgb(b.light),base:rgb(b.base),deep:rgb(b.deep)};
  }
  const p=PALETTES[host.dataset.palette];if(!p)throw new Error(`Unknown palette ${host.dataset.palette}`);
  const cloud=host.dataset.cloud?host.dataset.cloud.split(',').map(Number):null;
  return {kind:'field',seed,cool:p.cool.map(rgb),warm:p.warm.map(rgb),glow:rgb(p.glow),deep:p.ground==='deep'?1:0,cloud};
}

export function createMaterialSystem(config=MATERIAL, reduced=matchMedia('(prefers-reduced-motion: reduce)')) {
  let renderer;
  try {renderer=new THREE.WebGLRenderer({alpha:true,premultipliedAlpha:true,antialias:false,preserveDrawingBuffer:true,powerPreference:'low-power'});}
  catch {document.documentElement.dataset.material='fallback';return {renderAt(){},resume(){},setPaused(){},dispose(){},stats:()=>({contexts:0,fallback:true})};}
  renderer.setPixelRatio(1);renderer.setClearColor(0x000000,0);
  const field=fieldPass(config),blot=blotPass();
  const hosts=[...document.querySelectorAll('[data-material]')].map((host,i)=>{
    const canvas=document.createElement('canvas');canvas.setAttribute('aria-hidden','true');host.append(canvas);
    return {host,canvas,ctx:canvas.getContext('2d'),visible:false,dirty:true,draws:0,width:0,height:0,...hostColours(host,i)};
  });
  let raf=0,last=0,paused=false,lost=false,manual=false,time=0,lastNow=performance.now();
  const io=new IntersectionObserver(entries=>{for(const entry of entries){const h=hosts.find(x=>x.host===entry.target);h.visible=entry.isIntersecting;h.dirty=true;}wake();},{rootMargin:'80px'});
  const ro=new ResizeObserver(entries=>{for(const e of entries){const h=hosts.find(x=>x.host===e.target);h.width=e.contentRect.width;h.height=e.contentRect.height;h.dirty=true;}wake();});
  for(const h of hosts){io.observe(h.host);ro.observe(h.host);}
  function render(h,t){
    if(!h.width||!h.height||h.host.closest('[hidden]'))return;
    // Blots are glyph-sized, so they render supersampled; fields stay at the capped ratio.
    const ratio=h.kind==='blot'?Math.max(2,Math.min(3,devicePixelRatio*1.5)):config.resolution;
    const w=Math.max(1,Math.round(h.width*ratio)),height=Math.max(1,Math.round(h.height*ratio));
    if(h.canvas.width!==w||h.canvas.height!==height){h.canvas.width=w;h.canvas.height=height;}
    renderer.setSize(w,height,false);renderer.setRenderTarget(null);
    let p;
    if(h.kind==='blot'){
      p=blot;const u=p.uniforms;u.iTime.value=t*.9;u.uSeed.value=h.seed;
      u.uLight.value.copy(h.light);u.uBase.value.copy(h.base);u.uDeep.value.copy(h.deep);
    }else{
      p=field;const u=p.uniforms;u.iTime.value=(t+h.seed)*config.speed;u.uScale.value=config.scale;
      [u.uC0,u.uC1,u.uC2].forEach((x,i)=>x.value.copy(h.cool[i]));[u.uW0,u.uW1,u.uW2].forEach((x,i)=>x.value.copy(h.warm[i]));
      u.uGlow.value.copy(h.glow);u.uDeepGround.value=h.deep;u.uCloud.value=h.cloud?1:0;u.uCloudTime.value=t+h.seed;
      if(h.cloud){u.uCloudAt.value.set(h.cloud[0],h.cloud[1]);u.uCloudR.value=h.cloud[2];}
    }
    p.uniforms.iResolution.value.set(w,height,1);
    renderer.render(p.scene,p.camera);
    h.ctx.clearRect(0,0,w,height);h.ctx.drawImage(renderer.domElement,0,0,w,height);h.dirty=false;h.draws++;
  }
  function frame(now){
    raf=0;if(document.hidden||lost||manual)return;
    const dt=Math.min(.1,(now-lastNow)/1000);lastNow=now;
    if(!paused&&!reduced.matches)time+=dt;
    if(now-last>=1000/config.fps){
      for(const h of hosts)if(h.visible&&(h.dirty||(!paused&&!reduced.matches)))render(h,time);
      last=now;
    }
    if(hosts.some(h=>h.visible&&h.dirty)||(!paused&&!reduced.matches&&hosts.some(h=>h.visible)))raf=requestAnimationFrame(frame);
  }
  function wake(){if(!raf&&!lost&&!document.hidden&&!manual){lastNow=performance.now();raf=requestAnimationFrame(frame);}}
  function visibility(){if(document.hidden){cancelAnimationFrame(raf);raf=0;}else wake();}
  function motionChange(){for(const h of hosts)h.dirty=true;wake();}
  function contextLost(e){e.preventDefault();lost=true;cancelAnimationFrame(raf);raf=0;document.documentElement.dataset.material='fallback';}
  function contextRestored(){lost=false;document.documentElement.dataset.material='ready';for(const h of hosts)h.dirty=true;wake();}
  renderer.domElement.addEventListener('webglcontextlost',contextLost);
  renderer.domElement.addEventListener('webglcontextrestored',contextRestored);
  reduced.addEventListener('change',motionChange);document.addEventListener('visibilitychange',visibility);
  wake();document.documentElement.dataset.material='ready';
  return {
    renderAt(t){manual=true;cancelAnimationFrame(raf);raf=0;for(const h of hosts)render(h,t);},
    resume(){manual=false;wake();},
    setPaused(value){paused=value;for(const h of hosts)h.dirty=true;wake();},
    stats(){return {contexts:1,paused,reduced:reduced.matches,scheduled:!!raf,hosts:hosts.map(h=>({name:h.host.dataset.palette||h.host.dataset.blot,kind:h.kind,visible:h.visible,draws:h.draws}))};},
    dispose(){cancelAnimationFrame(raf);io.disconnect();ro.disconnect();reduced.removeEventListener('change',motionChange);document.removeEventListener('visibilitychange',visibility);field.dispose();blot.dispose();renderer.dispose();renderer.forceContextLoss();}
  };
}
