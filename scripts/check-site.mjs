import {readFileSync,readdirSync,lstatSync,existsSync} from 'node:fs';
import {resolve,dirname,extname,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),site=resolve(root,'site');
const errors=[],files=[];
function walk(dir){for(const name of readdirSync(dir)){const path=resolve(dir,name),s=lstatSync(path);if(s.isSymbolicLink())errors.push('Symlink: '+relative(site,path));else if(s.isDirectory())walk(path);else files.push(path);}}
walk(site);
const required=['index.html','privacy.html','consent.html','404.html','reference-nordic.html','version.json','.nojekyll','reference-base.css','reference-editorial.css','reference-overrides.css','nordic-review.css','privacy-page.css','design-system/nordic/tokens.css','tool-scenes.js','reference-pages.js','nordic-review.js','nordic-faq.js','nordic-apartment.js','reference-motion.js',
 ...['nordic-hero','nordic-before','nordic-before-brick','bathroom','bedroom-light','detail'].map(n=>'assets/references-v4/'+n+'.webp'),
 ...['newbuild','resale','scope','estimate'].map(n=>'assets/route-backgrounds/'+n+'.webp'),
 ...['manrope-400','manrope-500','manrope-600','manrope-700','oswald-400','oswald-500','oswald-600','cormorant-garamond-400','cormorant-garamond-500'].map(n=>'assets/fonts/'+n+'.woff2')];
for(const file of required)if(!existsSync(resolve(site,file)))errors.push('Missing: '+file);
const version=readFileSync(resolve(root,'VERSION'),'utf8').trim(),metadata=JSON.parse(readFileSync(resolve(site,'version.json'),'utf8'));
if(!/^\d+\.\d+\.\d+$/.test(version)||version!==metadata.version)errors.push('Version mismatch');
if(!readFileSync(resolve(site,'index.html'),'utf8').includes('name="build-version" content="'+version+'"'))errors.push('HTML version mismatch');
const allowed=new Set(['.html','.css','.js','.json','.webp','.woff2','.txt']);
for(const file of files){
 const name=relative(site,file).replaceAll('\\','/');
 if(name!=='.nojekyll'&&!allowed.has(extname(file)))errors.push('Unexpected public file: '+name);
 if(/(^|\/)(\.env[^/]*|crm|node_modules|output|\.git|\.agents|\.codex|work-progress\.html)(\/|$)/i.test(name))errors.push('Private material in artifact: '+name);
 if(name==='reference-variants.html'||/^reference-(calm|boutique|editorial)\.html$/.test(name))errors.push('Alternative edition in artifact: '+name);
 if(extname(file)==='.js')try{execFileSync(process.execPath,['--check',file],{stdio:'pipe'});}catch{errors.push('Invalid JavaScript: '+name);}
 if(!['.html','.css','.js'].includes(extname(file)))continue;
 const content=readFileSync(file,'utf8');
 if(/(?:gh[pousr]_[A-Za-z0-9]{30,}|sk-[A-Za-z0-9]{30,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)/.test(content))errors.push('Possible secret: '+name);
 if(extname(file)==='.js')continue;
 const refs=extname(file)==='.html'?[...content.matchAll(/(?:src|href)="([^"]+)"/g)].map(m=>m[1]):[...content.matchAll(/url\(["']?([^)"']+)["']?\)/g)].map(m=>m[1]);
 for(const ref of refs){
  if(/^(?:https?:|data:|mailto:|tel:|#)/.test(ref))continue;
  const clean=ref.split(/[?#]/)[0];if(!clean)continue;
  const target=clean.startsWith('/stroyproject-site/')?resolve(site,clean.slice('/stroyproject-site/'.length)||'index.html'):resolve(dirname(file),clean);
  if(!target.startsWith(site)||!existsSync(target))errors.push('Broken resource in '+name+': '+ref);
 }
}
if(metadata.edition!=='nordic'||metadata.formMode!=='demo')errors.push('Unexpected edition/form mode; integration requires a new reviewed release');
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(JSON.stringify({ok:true,version,publicFiles:files.length,requiredFiles:required.length,publishDirectory:'site',formMode:metadata.formMode},null,2));
