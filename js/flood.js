// L-flood (Elaye 23:52 "it takes you to that gradient that's just filling the page", "the gradient is sort of like
// morphing blots"; 19:42 on the MAThelp flood: "That background is so sick, man."). Landing task 011 (critic 006):
// the blots stay the shape and the motion; the inside is the MAThelp "Abstract Fractal" material (Sabo Sugi, MIT,
// MAT/VAR2/assets/sabo-shader.js, the same 1:1 port as js/material.js) at V02's scale 1.35 and V03's speed .5,
// recoloured to the deep set (green, magenta, violet, teal: blot2's body, partner and shade tones) with its own white
// highlights. No gold, no blue lead, no sky. The material sits still behind the page like MAThelp's full-bleed flood;
// the blots are the windows onto it and scroll with the page.
// Shape: the original blot's traced edge (blot2.js ORIGINAL), merged with a real goo (smooth-min union), so
// overlapping blots bridge into one form. ?blot=lumps keeps the 006 lobed lumps.
// The flood gets its own screen: colour reaches all four edges for 400+ px of scroll before the film's top enters, and
// it ends in white about 120 px above the film. Past the film the blots shrink back toward the side blobs.
// Scroll-linked, never pinned. Never behind the hero copy: the top row's outline starts under the price line.
import {ORIGINAL} from './blot2.js';
const clamp = (v, a, b) => Math.min(b, Math.max(a, v)), smooth = (k) => k * k * (3 - 2 * k);
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
// body, partner (the material's second family), shade: blot2's deep colourways
// in page order (013, no mud): green, teal, violet, magenta, each with its neighbour as partner, so violet and magenta
// never meet green
const ORDER = [['#2f7d3a', '#3f66a2', '#1d5626'], ['#3f66a2', '#2f7d3a', '#29437e'], ['#6a00d8', '#b601e1', '#4a0098'], ['#b601e1', '#6a00d8', '#8300a3']];
const LUMPS = [[0.13, 0.07, 0.03], [0.16, 0.05, 0.05], [0.09, 0.12, 0.02], [0.12, 0.09, 0.06]];
const N = 16;
// 013: the material's own light, ported at the MAThelp panel's level (p95 L* about 75): its highlight ramp in raw light
const LIGHT = [0.41, 0.66, 0.94];
const VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
const FS = `precision highp float;
#define R(a) mat2(cos(a),-sin(a),sin(a),cos(a))
uniform vec2 uRes,uVis;uniform float uScale,uCut,uTime,uOrig,uMatTop,uVh,uK;uniform vec3 uLight;
uniform vec4 uB[${N}];uniform vec4 uL[${N}];uniform vec3 uBody[${N}];uniform vec3 uPart[${N}];uniform vec3 uShade[${N}];
uniform sampler2D uProf,uGrad;uniform float uMode;
float rad(vec4 B,vec4 L,vec2 d){float th=atan(d.y,d.x);
  if(uOrig>.5)return B.z*(.85+.3*texture2D(uProf,vec2((th-B.w)/6.2831853,.5)).r);
  return B.z*(1.+L.x*cos(3.*th+L.w)+L.y*cos(4.*th-1.3*L.w)+L.z*cos(5.*th+2.1*L.w)+.03*cos(2.*th+L.w));}
float sdf(vec4 B,vec4 L,vec2 p){vec2 d=p-B.xy;return length(d)-rad(B,L,d);}
// Sabo Sugi, Abstract Fractal (MIT), verbatim but for V02's world scale (1.35) and the shared clock.
float F(vec3 p){float s=1.1,d=1e5,t=.35*uTime;
  for(int i=0;i<3;i++){float j=float(i);
    p.xy*=R(.23+.36*sin(t+j));
    p.yz*=R(-.23*9.9+.37*cos(.8*t+j));
    p+=-.59*vec3(sin(-.8*p.y+t),sin(1.5*p.z-.6*t),sin(4.6*p.x+.3*t));
    p=sqrt(p*p+.16)-2.56;
    d=min(d,length(p)/s);
    p*=2.72;s*=2.72;}
  return min(.63*d,.16*abs(length(p.xy)+2.05)/s);}
vec3 sabo(vec2 I,vec2 res){
  vec2 u=(2.*I-res)/res.y;vec3 r=normalize(vec3(u,1.25)),c=vec3(0.),p;float z=0.,d;
  for(int i=0;i<113;i++){
    p=r*z+vec3(0.,0.,-2.8);
    p.xy*=R(-1.13*sin(.4*p.z+.15*uTime));
    d=F(p/1.35)*1.35;
    z+=max(.002,.49*d);
    c+=(.5+.5*cos(2.7*z+.2*uTime+vec3(1.4,2.1,4.)))*.018/max(d,.004);
    if(z>12.)break;}
  c=1.-exp(-.055*c);
  return pow(max(c,0.),vec3(.85));}
void main(){
  vec2 px=vec2(gl_FragCoord.x,uRes.y-gl_FragCoord.y)*uScale;
  // 013: no fade at the exit; the blots themselves stop 150 px above the film (JS), this is only a guard
  if(px.y>uCut-120.){gl_FragColor=vec4(0.);return;}
  float U=1e5,ws=0.;vec3 body=vec3(0.),part=vec3(0.),shade=vec3(0.);
  for(int i=0;i<${N};i++){
    if(uB[i].z<1.)continue;
    float d=sdf(uB[i],uL[i],px);
    // the goo: a smooth-min union, so blots that meet bridge into one form
    float h=clamp(.5+.5*(U-d)/uK,0.,1.);U=mix(U,d,h)-uK*h*(1.-h);
    // colour belongs to the nearest body (a softmax over distance) and blends only across a merge, so each region keeps
    // its own deep tone instead of averaging into a muddy blue
    float w=exp(-clamp(d,-360.,360.)/45.);
    body+=uBody[i]*w;part+=uPart[i]*w;shade+=uShade[i]*w;ws+=w;}
  if(U>4.){gl_FragColor=vec4(0.);return;}
  ws=max(ws,1e-4);body/=ws;part/=ws;shade/=ws;
  vec3 col=body;
  if(uMode>.5){col=texture2D(uGrad,vec2(px.x/(uRes.x*uScale),(px.y-uMatTop)/uVh)).rgb;}
  else if(px.y>uVis.x&&px.y<uVis.y){
    vec3 raw=sabo(vec2(px.x,uVh-(px.y-uMatTop)),vec2(uRes.x*uScale,uVh));
    float light=dot(raw,vec3(.2126,.7152,.0722)),warm=smoothstep(-.12,.20,raw.r-raw.b);
    vec3 chroma=mix(body,part,warm);
    col=mix(shade,chroma,smoothstep(.04,.42,light));
    // 013: the light climbs through a brighter step of the region's own colour before it reaches white, so highlights
    // stay saturated (no grey-green) and reach the MAThelp panel's level
    col=mix(col,min(vec3(1.),chroma*1.65+.06),smoothstep(uLight.x,uLight.y,light));
    col=mix(col,vec3(1.),smoothstep(uLight.y,uLight.z,light)*.9);}
  float a=1.-smoothstep(-1.5,1.5,U);
  gl_FragColor=vec4(col*a,a);
}`;

export function createFlood(opening, measureSpots, reduced) {
  const canvas = document.createElement('canvas'), rider = document.querySelector('.flood-rider');
  canvas.className = 'flood';
  canvas.setAttribute('aria-hidden', 'true');
  opening.prepend(canvas);
  const gl = canvas.getContext('webgl', {premultipliedAlpha: true, alpha: true, antialias: false});
  if (!gl) { canvas.remove(); return {setPaused() {}, renderAt() {}, resume() {}, progress: () => 0}; }
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(o)); return o; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog); gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = (n) => gl.getUniformLocation(prog, n);
  // the original edge as a 256 x 1 lookup (radius .85 to 1.15 in 8 bits). 015: at page scale the fine scallops read as
  // torn paper, so the flood uses the same contour low-passed to its first eight harmonics (a blot, not paper).
  const n = ORIGINAL.length, H8 = Array.from({length: 9}, (_, h) => ORIGINAL.reduce((acc, v, i) => { const a = (2 * Math.PI * h * i) / n; return [acc[0] + v * Math.cos(a), acc[1] + v * Math.sin(a)]; }, [0, 0]).map((x) => (x * (h ? 2 : 1)) / n));
  const SOFT = ORIGINAL.map((_, i) => H8.reduce((v, [re, im], h) => v + re * Math.cos((2 * Math.PI * h * i) / n) + im * Math.sin((2 * Math.PI * h * i) / n), 0));
  const prof = new Uint8Array(256 * 4);
  SOFT.forEach((v, i) => { const b = Math.round(clamp((v - 0.85) / 0.3, 0, 1) * 255); prof.set([b, b, b, 255], i * 4); });
  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, prof);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.uniform1i(U('uProf'), 0);
  // ?flood=183 (B): the same blot shapes filled with the GRADCODE grad-183.js (deep variant), 183's soft painted
  // light, drawn by hand into an offscreen canvas at the flood's clock and read as a texture.
  let grad = null;
  const gradTex = gl.createTexture(), mode183 = new URLSearchParams(location.search).get('flood') === '183';
  gl.uniform1i(U('uGrad'), 1); gl.uniform1f(U('uMode'), 0);
  if (mode183) import('./gradcode/grad-183.js').then(({mount}) => {
    const host = document.createElement('div');
    host.setAttribute('aria-hidden', 'true'); host.style.cssText = 'position:fixed;left:-10000px;top:0;width:720px;height:450px;pointer-events:none';
    document.body.append(host);
    grad = mount(host, {manual: true, size: {width: 720, height: 450}, deep: 1.25});
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, gradTex);
    for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v);
    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1f(U('uMode'), 1); draw();
  });

  let geo = null, plan = [], time = 0, raf = 0, last = 0, live = false, paused = false, manual = false;
  const scale = 0.5; // backing pixels per CSS pixel: the material is soft; the edge keeps a 1.5 px feather
  function measure() {
    const o = opening.getBoundingClientRect(), m = measureSpots();
    geo = {W: o.width, H: o.height, top: o.top + scrollY, Vh: innerHeight, ...m};
    canvas.width = Math.ceil(o.width * scale); canvas.height = Math.ceil(o.height * scale);
    gl.viewport(0, 0, canvas.width, canvas.height);
    // Rows and columns of blots between the price line and the film, big enough that their union covers every edge.
    // 013: every blot stays 64 px or more under the price line and 150 px or more above the film (120 px of white)
    // (the film is drawn up to 110 px higher while it comes down, opening.js, so that is kept clear too)
    const {W, Vh, textBottom, filmTop} = geo, top = textBottom + 64, bot = filmTop - 110 - 150;
    const r = Math.max(0.36 * W, 0.34 * Vh), cols = W >= 700 ? 3 : 2, xs = cols === 3 ? [0.14, 0.5, 0.86] : [0.18, 0.82];
    const y0 = top + 1.12 * r + 24, last = Math.max(y0 + 0.5 * r, bot - 1.12 * r);
    const rows = clamp(Math.ceil((last - y0) / (0.95 * r)) + 1, 2, Math.floor(N / cols)), gap = (last - y0) / (rows - 1);
    geo.top64 = top; geo.bot = bot;
    plan = [];
    for (let j = 0; j < rows; j++) for (let c = 0; c < cols; c++) {
      const i = plan.length;
      plan.push({x: (xs[c] + (j % 2 ? 0.07 : -0.07) * (cols === 3 ? 1 : 0.5)) * W, y: y0 + j * gap, row: j, r: r * (0.94 + 0.08 * ((i * 0.37) % 1)),
        // diagonal through the order, so any two neighbours are at most one step apart
        c: ORDER[clamp(Math.round(((j + c * 0.5) * 3) / (rows - 1 + (cols - 1) * 0.5)), 0, 3)], l: LUMPS[i % 4], p: i * 1.7});
    }
    gl.uniform3fv(U('uBody'), new Float32Array(Array.from({length: N}, (_, i) => hex((plan[i] || plan[0]).c[0])).flat()));
    gl.uniform3fv(U('uPart'), new Float32Array(Array.from({length: N}, (_, i) => hex((plan[i] || plan[0]).c[1])).flat()));
    gl.uniform3fv(U('uShade'), new Float32Array(Array.from({length: N}, (_, i) => hex((plan[i] || plan[0]).c[2])).flat()));
  }
  // k: the bloom (0 at the top of the page, 1 once the hero copy has scrolled off); it gates the frame loop
  function progress() { if (!geo) measure(); return smooth(clamp((scrollY - geo.top) / (innerHeight * 0.75), 0, 1)); }
  function draw() {
    if (!geo) measure();
    const t = reduced.matches ? 0 : time, {W, Vh, spots, textBottom, filmTop, top64, bot} = geo, sy = scrollY - geo.top;
    // 013 · Entrance: the hero blots are gone by 18% of a screen (opening.js); from 20% separate blots grow and bridge
    // (to 55%) while the price line is in frame, and only fill out to the full field once it has left.
    const g1 = smooth(clamp((sy - Vh * 0.2) / Math.max(1, textBottom - Vh * 0.2), 0, 1)), g2 = smooth(clamp((sy - textBottom) / (Vh * 0.3), 0, 1));
    // Exit (015): as soon as the band's lower edge enters the frame it breaks into its blots: the goo lets go, the
    // centre blots shrink first and each slides toward its nearest side blob, so the white opens between rounded blots.
    const raw = clamp((sy + Vh - bot + 80) / (Vh * 0.6), 0, 1), q = smooth(raw), qb = smooth(clamp(raw * 2.5, 0, 1));
    // 019 (critic 015): the white blot riding the flood shrinks and fades from 1.75 s of the exit clip (raw .15, measured)
    // and is gone by 2.0 s (raw .215), before the white opens beside it.
    if (rider) { const f = smooth(clamp((raw - 0.15) / 0.065, 0, 1)); rider.style.opacity = f ? String(1 - f) : ''; rider.style.transform = f ? `scale(${1 - 0.6 * f})` : ''; }
    const B = new Float32Array(N * 4), L = new Float32Array(N * 4);
    plan.forEach((b, i) => {
      // the first blots grow from the hero's edge blots' places, after those have scaled away
      const s = spots[i] && spots[i][0] > -900 ? spots[i] : [b.x, b.y];
      const grow = 0.55 * g1 + 0.45 * g2;
      const tx = b.x + (b.x < W / 2 ? -1 : 1) * q * W * 0.5, ty = b.y;
      const from = [s[0], Math.max(s[1], top64 + 40)];
      const x = from[0] + (tx - from[0]) * grow + Math.sin(t * 0.19 + i) * 14 * grow;
      const y = from[1] + (ty - from[1]) * grow + Math.cos(t * 0.15 + i * 2) * 12 * grow;
      const centre = 1 - Math.abs(b.x / W - 0.5) * 2;
      const want = b.r * grow * Math.max(0, 1 - qb * 0.9 * centre - q * 0.85) * (1 + 0.03 * Math.sin(t * 0.3 + i));
      const rad = Math.max(0, Math.min(want, (y - top64 - 24) / 1.12, (bot - y) / 1.12));
      B.set([x, y, rad < 8 ? 0 : rad, b.p + 0.12 * Math.sin(t * 0.11 + i)], i * 4);
      L.set([b.l[0], b.l[1], b.l[2], b.p + 0.25 * Math.sin(t * 0.11 + i)], i * 4);
    });
    const view = scrollY - geo.top;
    gl.uniform2f(U('uRes'), canvas.width, canvas.height);
    gl.uniform1f(U('uScale'), 1 / scale);
    gl.uniform1f(U('uCut'), geo.filmTop || 1e5);
    gl.uniform1f(U('uTime'), t * 0.5);
    gl.uniform3f(U('uLight'), ...LIGHT);
    gl.uniform1f(U('uK'), 150 * (1 - 0.9 * qb));
    if (grad) { grad.renderAt(t); gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, gradTex); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, grad.canvas); gl.activeTexture(gl.TEXTURE0); }
    gl.uniform1f(U('uOrig'), document.documentElement.dataset.blot === 'lumps' ? 0 : 1);
    gl.uniform1f(U('uMatTop'), view); gl.uniform1f(U('uVh'), innerHeight);
    gl.uniform2f(U('uVis'), view - 40, view + innerHeight + 40);
    gl.uniform4fv(U('uB'), B); gl.uniform4fv(U('uL'), L);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    if (sy > Vh * 0.2) gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  function frame(now) {
    raf = 0; if (!live || manual) return;
    if (now - last > 33) { time += Math.min(0.1, (now - last) / 1000) || 0; last = now; draw(); }
    if (!paused && !reduced.matches && !document.hidden && progress() > 0) raf = requestAnimationFrame(frame);
  }
  const wake = () => { if (!raf && live && !manual) { last = performance.now(); raf = requestAnimationFrame(frame); } };
  new IntersectionObserver((es) => { live = es[0].isIntersecting; if (live) { draw(); wake(); } }).observe(opening);
  addEventListener('scroll', () => { if (live && !manual) { draw(); wake(); } }, {passive: true});
  new ResizeObserver(() => { geo = null; draw(); }).observe(opening);
  return {
    progress,
    setPaused(v) { paused = v; wake(); },
    renderAt(t) { manual = true; time = t; geo = null; draw(); },
    resume() { manual = false; wake(); },
  };
}
