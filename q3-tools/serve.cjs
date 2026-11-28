// usage: node serve.cjs <repo root> <port>  — serves the landing the way test/landing.cjs does
const fs=require('fs'),http=require('http'),path=require('path');
const root=path.resolve(process.argv[2]),port=+process.argv[3];
process.chdir(root);const {render}=require(path.join(root,'api/landing'));
const types={'.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.mp4':'video/mp4','.webm':'video/webm','.woff2':'font/woff2','.json':'application/json','.html':'text/html'};
http.createServer((req,res)=>{const p=new URL(req.url,'http://x').pathname;
 if(p==='/'||p==='/index.html'){res.writeHead(200,{'Content-Type':'text/html'});res.end(render());return;}
 const f=path.join(root,decodeURIComponent(p));if(!f.startsWith(root+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);res.end();return;}
 res.writeHead(200,{'Content-Type':types[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(res);
}).listen(port,'127.0.0.1',()=>console.log('serving',root,port));
