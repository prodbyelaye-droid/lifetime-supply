// Numerical colour ports. Foreground rectangles are excluded, never sampled into the output.
// The Gaussian basis is rendered directly from fitted numeric RGB coefficients, without a source-image texture.
const fs=require('fs'),sharp=require('/Volumes/Extreme SSD/Codex-assembly/portal-1029/node_modules/sharp');
const wiki='/Users/elaye/Desktop/wiki/membership-portal/builds';
const configs=[
 {id:'009',file:'originals/9/landbook-2000.jpg',crop:[0,0,2000,1100],masks:[[0,.40,1,.70]]},
 {id:'034',file:'originals/34/landbook-2000-component-220043.jpg',crop:[70,100,500,470],masks:[]},
 {id:'155',file:'outbox/manager/critic-inputs/landing-006/ref-155-mid.jpg',crop:[690,230,1450,625],masks:[[0,0,1,.42],[.38,.5,.64,1],[.88,.2,1,.90]]},
 {id:'170',file:'originals/170/landbook-1366.jpg',crop:[5,215,385,1000],masks:[]},
 {id:'185',file:'/Volumes/Extreme SSD/masters-2026-10-30/codex/018/frames/24-row185.png',crop:[800,1540,1750,1670],masks:[]},
 {id:'192',file:'originals/192/landbook-2000.jpg',crop:[48,10486,1952,11208],masks:[[.23,.28,.78,.69]]},
];
const nx=12,ny=8,N=nx*ny;
function basis(u,v){const b=new Float64Array(N);let s=0;for(let y=0;y<ny;y++)for(let x=0;x<nx;x++){const t=Math.exp(-.5*(((u-x/(nx-1))*(nx-1)/.8)**2+((v-y/(ny-1))*(ny-1)/.8)**2));b[y*nx+x]=t;s+=t;}for(let i=0;i<N;i++)b[i]/=s;return b;}
function solve(A,B){for(let k=0;k<N;k++){let best=k;for(let j=k+1;j<N;j++)if(Math.abs(A[j][k])>Math.abs(A[best][k]))best=j;[A[k],A[best]]=[A[best],A[k]];[B[k],B[best]]=[B[best],B[k]];const pivot=A[k][k];for(let j=k;j<N;j++)A[k][j]/=pivot;for(let c=0;c<3;c++)B[k][c]/=pivot;for(let i=0;i<N;i++){if(i===k)continue;const f=A[i][k];for(let j=k;j<N;j++)A[i][j]-=f*A[k][j];for(let c=0;c<3;c++)B[i][c]-=f*B[k][c];}}return B;}
(async()=>{for(const cfg of configs){
 const [left,top,right,bottom]=cfg.crop;
 const ref=await sharp(cfg.file.startsWith('/')?cfg.file:wiki+'/'+cfg.file).extract({left,top,width:right-left,height:bottom-top}).toBuffer();
 await sharp(ref).jpeg({quality:94}).toFile(`${__dirname}/assets/reference-${cfg.id}.jpg`);
 const w=72,h=54,{data}=await sharp(ref).resize(w,h,{fit:'fill'}).removeAlpha().raw().toBuffer({resolveWithObject:true});
 const A=Array.from({length:N},()=>new Float64Array(N)),B=Array.from({length:N},()=>new Float64Array(3));let used=0;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const u=x/(w-1),v=y/(h-1);if(cfg.masks.some(([a,b,c,d])=>u>=a&&u<=c&&v>=b&&v<=d))continue;const b=basis(u,v),off=(y*w+x)*3;used++;for(let i=0;i<N;i++){for(let j=0;j<N;j++)A[i][j]+=b[i]*b[j];for(let c=0;c<3;c++)B[i][c]+=b[i]*data[off+c];}}
 // A small ridge stabilises unobserved regions. Those inferred colours are declared in the report.
 const mean=[0,0,0];for(let c=0;c<3;c++){for(let i=c;i<data.length;i+=3)mean[c]+=data[i];mean[c]/=(w*h);}for(let i=0;i<N;i++){A[i][i]+=.007;for(let c=0;c<3;c++)B[i][c]+=.007*mean[c];}
 const coefficients=solve(A,B),rw=1920,rh=1440,out=Buffer.alloc(rw*rh*3);
 const xb=Array.from({length:rw},(_,x)=>Array.from({length:nx},(_,j)=>Math.exp(-.5*((x/(rw-1)-j/(nx-1))*(nx-1)/.8)**2)));
 for(let y=0;y<rh;y++){const yb=Array.from({length:ny},(_,j)=>Math.exp(-.5*((y/(rh-1)-j/(ny-1))*(ny-1)/.8)**2));const col=Array.from({length:nx},()=>[0,0,0]);for(let j=0;j<ny;j++)for(let i=0;i<nx;i++)for(let c=0;c<3;c++)col[i][c]+=yb[j]*coefficients[j*nx+i][c];const ys=yb.reduce((s,a)=>s+a,0);for(let x=0;x<rw;x++){const xs=xb[x].reduce((s,a)=>s+a,0);for(let c=0;c<3;c++){let v=0;for(let i=0;i<nx;i++)v+=xb[x][i]*col[i][c];out[(y*rw+x)*3+c]=Math.max(0,Math.min(255,Math.round(v/(xs*ys))));}}}
 await sharp(out,{raw:{width:rw,height:rh,channels:3}}).webp({quality:95}).toFile(`${__dirname}/assets/field-${cfg.id}.webp`);
 fs.writeFileSync(`${__dirname}/assets/model-${cfg.id}.json`,JSON.stringify({...cfg,basis:'normalised Gaussian RGB',nx,ny,sigma:.8,regularisation:.007,observedFraction:used/(w*h),coefficients:coefficients.map(x=>[...x])},null,2));
 console.log('Fitted',cfg.id,Math.round(used/(w*h)*100)+'% observed');
}})();
