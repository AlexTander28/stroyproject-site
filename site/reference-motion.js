(() => {
'use strict';
const clamp=(v)=>Math.max(0,Math.min(1,v));
const ease=v=>v*v*(3-2*v);
let reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let mobile=innerWidth<=700, scheduled=false, lastHeroProgress=-1;
const root=document.body, key='stroyproject-reference-v4-'+root.dataset.theme;
const hero=document.querySelector('.hero-scroll'), canvas=document.querySelector('[data-apartment]'), ctx=canvas.getContext('2d');
const scenes=[];
const colorMap={'#edece6':'var(--ink)','#d7ff46':'var(--accent)','#718078':'var(--muted)','#202724':'var(--tool-surface)','#141a18':'var(--tool-fill)','#283321':'var(--tool-surface)','#28302c':'var(--tool-surface)','#253014':'var(--bg)','#333d36':'var(--tool-surface)','#c3d697':'var(--accent)','#60793c':'var(--muted)'};
document.querySelectorAll('[data-scene]').forEach((mount,index)=>{
 const scene=window.toolScenes.find(s=>s.id===mount.dataset.scene); if(!scene)return;
 let markup=scene.svg.replace('<svg ','<svg class="tool-scene-svg" ');
 Object.entries(colorMap).forEach(([from,to])=>{markup=markup.split(from).join(to)});
 for(const [from,to] of Object.entries({'#263514':'var(--tool-surface)','#35432a':'var(--tool-surface)','#4f651d':'var(--muted)','#f5ffe0':'var(--ink)'})){markup=markup.split(from).join(to)}
 markup=markup.replace(/<style>([\s\S]*?)<\/style>/,(_,css)=>'<style>'+css.replace(/(^|})([^{}]+){/g,(_m,sep,sel)=>sep+sel.split(',').map(s=>'.tool-scene-svg '+s.trim()).join(',')+'{')+'</style>');
 markup=markup.replaceAll('spatula-smooth-clip','spatula-smooth-clip-'+root.dataset.theme+'-'+index);
 mount.innerHTML=markup; const svg=mount.querySelector('svg');
 scenes.push({scene,svg,frame:mount.closest('.scene-frame'),state:mount.closest('.scene-frame').querySelector('[data-scene-state]')});
});
const plan='<svg viewBox="0 0 900 360" role="img" aria-label="Демонстрационный план квартиры: стены, проёмы, мебель и вынесенные размеры" fill="none"><g stroke="currentColor" stroke-width="5"><path d="M160 62H730V284H160V62ZM440 62V143M440 200V284M600 62V183M440 183H524M570 183H730"/><path d="M250 284H325" stroke-width="10"/><path d="M205 62H350M495 62H560M640 62H690" stroke="var(--accent)" stroke-width="7"/></g><g stroke="var(--muted)" stroke-width="1.5"><path d="M440 144A56 56 0 0 1 496 200M440 200H496M525 183A44 44 0 0 0 569 227M569 183V227"/><rect x="190" y="100" width="122" height="52"/><path d="M190 115H312M208 100V152M294 100V152"/><rect x="326" y="110" width="64" height="85" rx="5"/><path d="M168 228H260V275H168M185 240H240"/><rect x="466" y="85" width="106" height="65"/><path d="M466 105H572M484 87V105M554 87V105"/><rect x="641" y="221" width="62" height="40" rx="5"/><path d="M166 292V328M730 292V328M160 319H730M151 62H115M151 284H115M125 62V284"/></g><g fill="var(--ink)" font-family="Manrope,sans-serif" font-size="15"><text x="243" y="191" text-anchor="middle">Кухня-гостиная</text><text x="520" y="167" text-anchor="middle">Спальня</text><text x="655" y="157" text-anchor="middle">Кабинет</text></g><rect x="380" y="306" width="130" height="24" fill="var(--bg)"/><text x="445" y="325" text-anchor="middle" font-family="Manrope,sans-serif" fill="var(--accent)" font-size="16">8 400 мм</text><rect x="88" y="149" width="75" height="38" fill="var(--bg)"/><text x="123" y="173" text-anchor="middle" font-family="Manrope,sans-serif" fill="var(--accent)" font-size="15">6 200 мм</text><text x="750" y="286" fill="var(--muted)" font-family="Manrope,sans-serif" font-size="12">План-концепт</text></svg>';
const plans=[];
document.querySelectorAll('[data-plan]').forEach(el=>{
 el.innerHTML=window.nordicPlanOverride||plan;const svg=el.querySelector('svg'),groups=svg.querySelectorAll('g');
 if(window.nordicPlanOverride){
  const lines=[...svg.querySelectorAll('[data-plan-stage] > *')].map(node=>{const length=node.getTotalLength();node.style.strokeDasharray=length;return{node,length,stage:node.parentNode.dataset.planStage}});
  const message=document.createElement('div');message.className='plan-message';message.innerHTML='<h2>Точные замеры</h2><p>Вы не переплатите за лишний материал.</p>';el.append(message);
  plans.push({el,svg,lines,texts:[...svg.querySelectorAll('text')],message});return;
 }
 const dimension=groups[1].lastElementChild;dimension.dataset.planStage='dimensions';
 const lines=[...groups[0].children,...groups[1].children].map((node,index)=>{
  const stage=node===dimension?'dimensions':node.parentNode===groups[0]?(index===groups[0].children.length-1?'openings':'walls'):'furniture';
  const length=node.getTotalLength();node.style.strokeDasharray=length;return{node,length,stage};
 });
 plans.push({el,svg,lines,texts:[...svg.querySelectorAll('text')]});
});
const caseImages=[...document.querySelectorAll('.case-image')];
if(root.dataset.theme==='nordic')caseImages.forEach(el=>{const color=el.querySelector('img').cloneNode();color.className='case-color';color.alt='';color.setAttribute('aria-hidden','true');el.querySelector('img').after(color)});
// Hydrate both photo layers near the gallery, not while rendering the hero.
const loadCaseImages=el=>el.querySelectorAll('img[data-src]').forEach(img=>{img.loading='eager';img.src=img.dataset.src;delete img.dataset.src;});
if(root.dataset.theme==='nordic'){
 if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){loadCaseImages(entry.target);observer.unobserve(entry.target);}}),{rootMargin:'600px 0px'});caseImages.forEach(el=>observer.observe(el));}
 else caseImages.forEach(loadCaseImages);
}
function apartment(progress){
 if(window.drawNordicApartment){window.drawNordicApartment(canvas,ctx,progress);return;}
 const w=canvas.clientWidth, h=w/1.14, dpr=Math.min(devicePixelRatio||1,2); if(!w)return;
 if(canvas.width!==Math.round(w*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
 ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
 const angle=.67+progress*.25, ca=Math.cos(angle), sa=Math.sin(angle);
 const raw=(x,y,z)=>[(x-4.2)*ca-(z-3.1)*sa,((x-4.2)*sa+(z-3.1)*ca)*.52-y*.85];
 const corners=[];for(const x of [0,8.4])for(const z of [0,6.2])for(const y of [-.2,3.8])corners.push(raw(x,y,z));
 const minX=Math.min(...corners.map(p=>p[0])),maxX=Math.max(...corners.map(p=>p[0])),minY=Math.min(...corners.map(p=>p[1])),maxY=Math.max(...corners.map(p=>p[1]));
 const scale=Math.min((w*.73)/(maxX-minX),(h*.65)/(maxY-minY)), centerX=w*.48,centerY=h*.46;
 const proj=(x,y,z)=>{const p=raw(x,y,z);return[centerX+(p[0]-(minX+maxX)/2)*scale,centerY+(p[1]-(minY+maxY)/2)*scale]};
 const ink='#f1eadd', accent=root.dataset.theme==='calm'?'#f2dc8c':root.dataset.theme==='boutique'?'#dbc4ad':'#c7b88f';
 const polygons=[];
 const face=(pts,fill,stroke=ink,opacity=1)=>polygons.push({pts,fill,stroke,opacity,depth:pts.reduce((n,p)=>n+(p[0]-4.2)*sa+(p[2]-3.1)*ca,0)/pts.length});
 const box=(x,y,z,dx,dy,dz,fill,opacity=1)=>{
  face([[x,y,z],[x+dx,y,z],[x+dx,y,z+dz],[x,y,z+dz]],fill,ink,opacity);
  face([[x,y,z+dz],[x+dx,y,z+dz],[x+dx,y+dy,z+dz],[x,y+dy,z+dz]],fill,ink,opacity);
  face([[x+dx,y,z],[x+dx,y,z+dz],[x+dx,y+dy,z+dz],[x+dx,y+dy,z]],fill,ink,opacity);
  face([[x,y+dy,z],[x+dx,y+dy,z],[x+dx,y+dy,z+dz],[x,y+dy,z+dz]],fill,ink,opacity);
 };
 const wallOffset=.38*ease(progress);
 box(0,-.18,0,8.4,.18,6.2,'#4c4940');
 box(0,wallOffset,0,8.4,.8,.15,'#74746a',.72);
 box(0,wallOffset+2.05,0,8.4,.73,.15,'#74746a',.7);
 box(0,wallOffset+.8,0,.35,1.25,.15,'#737669',.7);box(3.9,wallOffset+.8,0,.22,1.25,.15,'#737669',.7);box(8.05,wallOffset+.8,0,.35,1.25,.15,'#737669',.7);
 face([[.35,.8+wallOffset,.04],[3.9,.8+wallOffset,.04],[3.9,2.05+wallOffset,.04],[.35,2.05+wallOffset,.04]],'#78918f',accent,.22);
 face([[4.12,.8+wallOffset,.04],[8.05,.8+wallOffset,.04],[8.05,2.05+wallOffset,.04],[4.12,2.05+wallOffset,.04]],'#78918f',accent,.22);
 box(0,wallOffset,0,.15,2.78,6.2,'#6b6d63',.66);
 box(8.25,wallOffset,0,.15,2.78,2.75,'#757668',.5);
 box(4.55,wallOffset,0,.14,2.5,2.8,'#7b7b6d',.7);
 box(4.55,wallOffset,3.65,.14,2.5,2.55,'#7b7b6d',.7);
 box(4.55,wallOffset,2.8,.14,.28,.85,'#7b7b6d',.7);
 box(4.55,2.25+wallOffset,2.8,.14,.25,.85,'#7b7b6d',.7);
 box(4.69,wallOffset,4.1,1.65,1.6,.12,'#676e66',.6);
 box(7.45,.05,1.2,.65,.85,2.5,'#a89c82');box(7.45,.9,1.2,.65,.08,2.5,'#d0c7b1');
 box(.65,.1,.6,2.8,.6,.8,'#c3b8a0');box(.65,.7,.6,2.8,.45,.15,'#b6aa91');
 box(.65,.1,.6,.16,1.0,.8,'#b6aa91');box(3.29,.1,.6,.16,1,.8,'#b6aa91');
 box(1.35,.1,2.05,1.4,.45,.8,'#927e62');
 box(5.1,.08,.55,1.9,.45,2.4,'#b5afa0');box(5.1,.53,.55,1.9,.2,.55,'#ddd3bd');
 box(1.1,.05,4.3,1.9,.7,.9,'#b9a88c');
 if(root.dataset.theme==='nordic'){
  // Separate sofa cushions and TV on its console, facing the living zone.
  for(let i=0;i<3;i++){box(.87+i*.78,.7,.8,.73,.12,.53,'#d4c9b5');box(.87+i*.78,.82,.65,.73,.3,.13,'#c7bda8');}
  box(1.28,.83,4.62,1.54,.91,.09,'#252a2b');box(1.97,.75,4.62,.18,.08,.2,'#736a59');
  face([[1.37,.93,4.72],[2.73,.93,4.72],[2.73,1.63,4.72],[1.37,1.63,4.72]],'#46515a',ink,.9);
 }
 polygons.sort((a,b)=>a.depth-b.depth).forEach(f=>{ctx.globalAlpha=f.opacity;ctx.beginPath();f.pts.map(p=>proj(...p)).forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fillStyle=f.fill;ctx.fill();ctx.lineWidth=.75;ctx.strokeStyle=f.stroke;ctx.stroke();});ctx.globalAlpha=1;
 // Floor seams specify material and scale without adding decorative wallpaper.
 ctx.strokeStyle='#e4d7b044';ctx.lineWidth=.6;for(let x=.6;x<8.4;x+=.6){const a=proj(x,.01,0),b=proj(x,.01,6.2);ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.stroke();}
 const dimAlpha=clamp((progress-.25)/.35);ctx.globalAlpha=dimAlpha;
 const floorPts=[proj(0,0,0),proj(8.4,0,0),proj(8.4,0,6.2),proj(0,0,6.2)];
 const xs=floorPts.map(p=>p[0]),ys=floorPts.map(p=>p[1]);
 const label=(text,x,y)=>{ctx.font=Math.max(12,w/41)+'px Manrope';const tw=ctx.measureText(text).width;const alpha=ctx.globalAlpha;ctx.globalAlpha=1;ctx.fillStyle='#171c1e';ctx.fillRect(x-tw/2-8,y-17,tw+16,26);ctx.fillStyle=accent;ctx.textAlign='center';ctx.fillText(text,x,y+1);ctx.globalAlpha=alpha;};
 const line=(a,b)=>{ctx.strokeStyle=accent;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.stroke()};
 const left=Math.min(...xs),right=Math.max(...xs),bottom=Math.max(...ys)+28;
 line([left,bottom],[right,bottom]);line([left,bottom-5],[left,bottom+5]);line([right,bottom-5],[right,bottom+5]);label('8 400 мм',(left+right)/2,bottom);
 const hx=Math.min(w-30,right+22),top=Math.min(...corners.map(p=>centerY+(p[1]-(minY+maxY)/2)*scale))+22,by=bottom-36;
 line([hx,top],[hx,by]);line([hx-4,top],[hx+4,top]);line([hx-4,by],[hx+4,by]);label('2 780 мм',hx-13,top-16);
 label('6 200 мм',Math.max(65,left-12),h*.7);
 ctx.globalAlpha=clamp((progress-.7)/.2);label('90°',left+34,bottom-75);ctx.globalAlpha=1;
 canvas.dataset.progress=progress.toFixed(3);
}
function update(){
 scheduled=false;mobile=innerWidth<=700;
 const separate=root.classList.contains('separate-apartment');
 const motionTarget=separate?document.querySelector('.apartment-section'):hero;
 const rect=motionTarget.getBoundingClientRect(),vh=innerHeight;
 const p=reduced?1:separate?clamp((vh*.58-rect.top)/Math.max(1,rect.height*.65)):mobile?1:clamp(-rect.top/Math.max(1,rect.height-vh));
 const opacity=window.nordicIntro?(reduced||mobile?1:ease(clamp(p/.28))):reduced||mobile?.86:ease(clamp((p-.1)/.45));
 document.querySelector('.hero-drawing').style.opacity=opacity;
 root.classList.remove('technical-phase');
 document.querySelector('.hero-photo').style.opacity=separate?'1':String(1-.78*p);
 document.querySelector('.hero-progress i').style.width=(p*100)+'%';
 document.querySelector('.hero-stage-label').textContent='Екатеринбург · ремонт квартир';
 if(p!==lastHeroProgress){apartment(p);lastHeroProgress=p;}
 scenes.forEach(s=>{
  const r=s.frame.getBoundingClientRect();
  if(!reduced&&(r.top>vh||r.bottom<0))return;
  const trigger=root.dataset.theme==='nordic'&&s.scene.id==='estimate'?.62:.56;
  const sp=reduced?1:clamp((vh*trigger-r.top)/(r.height*.55+vh*.22));
  if(s.lastProgress===sp)return;s.lastProgress=sp;
  s.scene.update(s.svg,sp);s.svg.dataset.progress=sp.toFixed(3);
  const eq=s.svg.querySelector('[data-part="equals"]');if(eq&&!window.nordicCaptions)eq.setAttribute('fill','var(--tool-surface)');
  s.state.textContent=sp>=.92?({level:'Горизонталь найдена',spatula:'Поверхность выровнена',roller:'Покрытие нанесено',square:'Угол 90°',estimate:'Расчёт — 0 ₽'}[s.scene.id]):'Действие по прокрутке';
  if(window.nordicCaptions)s.state.textContent=window.nordicCaptions[s.scene.id][1];
 });
 plans.forEach(item=>{
  const r=(item.message?item.svg:item.el).getBoundingClientRect(),full=reduced?1:clamp((vh*.58-r.top)/(r.height*.6+vh*.22)),p=item.message?clamp(full/.72):full;
  const stages={walls:[0,.34],openings:[.28,.48],furniture:[.44,.77],dimensions:[.75,1]};
  if(item.lastProgress!==p){item.lastProgress=p;
   item.lines.forEach(({node,length,stage})=>{const [start,end]=stages[stage],part=clamp((p-start)/(end-start));node.style.strokeDashoffset=length*(1-part);node.style.opacity=.18+.82*part});
   item.texts.forEach(text=>{const dim=/мм/.test(text.textContent);text.style.opacity=.12+.88*clamp((p-(dim?.78:.65))/(dim?.22:.18))});item.svg.dataset.progress=p.toFixed(3);
  }
  if(item.message){const mr=item.message.getBoundingClientRect(),start=mobile?.56:.78,titlePlan=clamp((vh*.58-r.top+20)/(r.height*.6+vh*.22)/.72),ending=reduced?1:ease(clamp((vh*start-mr.top+20)/(vh*.5)))*ease(clamp((titlePlan-.92)/.08));item.message.style.opacity=String(ending);item.message.style.transform='none';item.message.style.setProperty('--reveal',String(ending));item.message.querySelector('h2').style.filter=reduced?'none':'blur('+(4*(1-ending))+'px)';item.svg.style.opacity='1';item.el.dataset.messageProgress=ending.toFixed(3);}
 });
 caseImages.forEach((el,index)=>{const r=el.getBoundingClientRect(),p=reduced?1:clamp((vh*.8-r.top)/(r.height*.55+vh*.3));
  const state=reduced+':'+p;if(el.lastMotionState===state)return;el.lastMotionState=state;
  el.querySelectorAll('img').forEach(img=>img.style.transform=reduced?'none':'translateY('+((.5-p)*12)+'px) scale(1.05)');
  const color=el.querySelector('.case-color');const reveal=ease(clamp(p*1.2-(index%4)*.06));if(color)color.style.clipPath='inset(0 '+((1-reveal)*100)+'% 0 0)';
  const scan=el.querySelector('.case-scan');scan.style.left=((color?reveal:p)*100)+'%';scan.style.opacity=reduced||p>=1?'0':String(p>.05?.8:0);el.dataset.progress=p.toFixed(3);
 });
}
function requestUpdate(){if(!scheduled){scheduled=true;requestAnimationFrame(update)}}
addEventListener('scroll',requestUpdate,{passive:true});addEventListener('resize',()=>{lastHeroProgress=-1;requestUpdate()},{passive:true});
addEventListener('reference:frame',()=>{lastHeroProgress=-1;requestUpdate()});
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',event=>{reduced=event.matches;lastHeroProgress=-1;requestUpdate()});
document.fonts.ready.then(()=>{lastHeroProgress=-1;requestUpdate()});
const blocks=document.querySelector('.blocks'),select=document.querySelector('[data-block-choice]'),status=document.querySelector('.editor-status');
if(select){
function save(){try{localStorage.setItem(key,JSON.stringify({order:[...blocks.children].map(el=>el.dataset.block),sides:[...blocks.querySelectorAll('[data-side]')].map(el=>({id:el.closest('[data-block]').dataset.block,side:el.dataset.side})),reverse:root.classList.contains('hero-reverse')}))}catch(_){}}
function refresh(){select.querySelectorAll('option').forEach(o=>{const index=[...blocks.children].findIndex(el=>el.dataset.block===o.value);o.textContent=(index+1)+'. '+document.querySelector('[data-block="'+o.value+'"]').dataset.label});requestUpdate()}
try{const saved=JSON.parse(localStorage.getItem(key)||'null');if(saved){if(root.dataset.theme==='nordic'&&blocks.querySelector('[data-block="cleanup"]')&&!saved.order.includes('cleanup')){const position=saved.order.indexOf('estimate');saved.order.splice(position<0?saved.order.length:position,0,'cleanup');}saved.order.forEach(id=>{const el=blocks.querySelector('[data-block="'+id+'"]');if(el)blocks.append(el)});saved.sides?.forEach(s=>{const el=blocks.querySelector('[data-block="'+s.id+'"] .section-body');if(el)el.dataset.side=s.side});root.classList.toggle('hero-reverse',!!saved.reverse)}}catch(_){}
document.querySelectorAll('[data-move]').forEach(button=>button.addEventListener('click',()=>{const el=blocks.querySelector('[data-block="'+select.value+'"]'),adj=button.dataset.move==='up'?el.previousElementSibling:el.nextElementSibling;if(!adj){status.textContent='Раздел уже на краю страницы.';return}button.dataset.move==='up'?adj.before(el):adj.after(el);status.textContent='Раздел «'+el.dataset.label+'» перемещён.';refresh();save()}));
document.querySelectorAll('[data-scene-side]').forEach(button=>button.addEventListener('click',()=>{const el=blocks.querySelector('[data-block="'+select.value+'"] .section-body');if(!el){status.textContent='У этого раздела нет боковой сцены.';return}el.dataset.side=button.dataset.sceneSide;status.textContent='Инструмент расположен '+(button.dataset.sceneSide==='left'?'слева.':'справа.');save();requestUpdate()}));
document.querySelector('[data-hero-swap]').addEventListener('click',()=>{root.classList.toggle('hero-reverse');save();requestUpdate()});
document.querySelector('[data-reset]').addEventListener('click',()=>{window.referenceConfig.order.forEach(id=>blocks.append(blocks.querySelector('[data-block="'+id+'"]')));blocks.querySelectorAll('[data-side]').forEach(el=>delete el.dataset.side);blocks.querySelector('[data-block="rough"] .section-body').dataset.side='right';root.classList.remove('hero-reverse');try{localStorage.removeItem(key)}catch(_){}status.textContent='Исходная композиция восстановлена.';refresh()});
refresh();
}
const form=document.querySelector('.estimate-form'),formResult=form.querySelector('.form-result'),nameInput=form.elements.namedItem('name'),phoneInput=form.elements.namedItem('phone');
function validateContact(){
 nameInput.setCustomValidity(nameInput.value&&!nameInput.value.trim()?'Введите имя — не только пробелы.':'');
 const value=phoneInput.value.trim(),digits=value.replace(/\D/g,'');
 const valid=/^\+?[\d\s().-]+$/.test(value)&&(/^[78]\d{10}$/.test(digits)||(/^\+/.test(value)&&digits.length>=10&&digits.length<=15));
 phoneInput.setCustomValidity(phoneInput.value&&!valid?'Введите телефон с кодом страны, например +7 999 123-45-67.':'');
}
form.addEventListener('input',()=>{validateContact();formResult.textContent='';});
form.addEventListener('change',()=>{validateContact();formResult.textContent='';});
form.addEventListener('invalid',()=>{formResult.textContent='';},{capture:true});
form.addEventListener('reset',()=>{nameInput.setCustomValidity('');phoneInput.setCustomValidity('');formResult.textContent='';});
form.addEventListener('submit',event=>{event.preventDefault();validateContact();if(!form.reportValidity())return;formResult.textContent='Поля заполнены. Это демонстрация: заявка не отправлена.'});
const dialog=document.querySelector('.case-dialog');document.querySelectorAll('[data-case]').forEach(b=>b.addEventListener('click',()=>{const card=b.closest('.case-card');loadCaseImages(card);dialog.querySelector('img').src=card.querySelector('img').src;dialog.querySelector('img').alt=card.querySelector('img').alt;dialog.querySelector('h2').textContent=card.querySelector('h3').textContent;dialog.showModal()}));dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
update();
})();
