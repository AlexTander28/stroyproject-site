import {createServer} from 'node:http';
import {readFileSync,statSync} from 'node:fs';
import {resolve,dirname,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../site'),prefix='/stroyproject-site/',port=Number(process.env.PORT||4186);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.webp':'image/webp','.woff2':'font/woff2','.txt':'text/plain; charset=utf-8'};
types['.svg']='image/svg+xml';
createServer((req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
  if(pathname===prefix.slice(0,-1)){res.writeHead(302,{Location:prefix});res.end();return;}
  if(!pathname.startsWith(prefix)){res.writeHead(404);res.end();return;}
  const file=resolve(root,pathname.slice(prefix.length)||'index.html');
  if(file!==root&&!file.startsWith(root+sep)){res.writeHead(403);res.end();return;}
  if(!statSync(file).isFile()){res.writeHead(404);res.end();return;}
  res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
  res.end(readFileSync(file));
 }catch{res.writeHead(404);res.end();}
}).listen(port,'127.0.0.1',()=>console.log('Preview: http://127.0.0.1:'+port+prefix));
