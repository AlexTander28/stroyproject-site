/* Connected 8.4 × 6.2 m shell. Cutaway walls use dashes, not detached floating panels. */
(() => {
'use strict';
const clamp=v=>Math.max(0,Math.min(1,v)),ease=v=>{v=clamp(v);return v*v*(3-2*v)};
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const intro=window.nordicIntro={active:false,progress:1,plays:0};
const word=document.querySelector('.hero-title em');const original=word.textContent;
word.setAttribute('aria-label',original);word.innerHTML=[...original].map((letter,i)=>'<span class="life-letter" aria-hidden="true" style="--letter:'+i+'">'+letter+'</span>').join('');
const finish=()=>{intro.active=false;intro.progress=1;document.body.classList.remove('intro-playing');document.body.dataset.intro='done';dispatchEvent(new Event('reference:frame'));};
// The lettering needs its display face, not every below-the-fold UI font.
document.fonts.load('500 48px Oswald',original).catch(()=>[]).then(()=>{
 if(reduced.matches||scrollY>30){finish();return;}
 intro.active=true;intro.progress=0;intro.plays++;document.body.classList.add('intro-playing');document.body.dataset.intro='playing';
 const start=performance.now();
 function frame(now){if(!intro.active)return;if(reduced.matches){finish();return;}intro.progress=clamp((now-start-850)/1300);dispatchEvent(new Event('reference:frame'));if(now-start<2600)requestAnimationFrame(frame);else finish();}
 requestAnimationFrame(frame);
});
reduced.addEventListener('change',e=>{if(e.matches)finish();});
addEventListener('scroll',()=>{if(intro.active&&scrollY>30)finish();},{passive:true});
window.drawNordicApartment=(canvas,ctx,p)=>{
 const w=canvas.clientWidth,h=w/1.14,dpr=Math.min(devicePixelRatio||1,2);if(!w)return;
 if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
 ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
 const turn=(.25+5*Math.PI/180)*ease(p),angle=.67+turn,ca=Math.cos(angle),sa=Math.sin(angle);
 const scale=w*.066,project=(x,y,z)=>[w*.49+((x-4.2)*ca-(z-3.1)*sa)*scale,h*.52+(((x-4.2)*sa+(z-3.1)*ca)*.52-y*.85)*scale];
 const ink='#eee7d8',accent='#c2aa78',a=intro.active?intro.progress:1,outline=ease(a/.36),wall=ease((a-.25)/.4),furniture=ease((a-.62)/.38)*(.3+.7*ease(p));
 const line=(pts,color=ink,alpha=1,dash=[])=>{ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.lineWidth=.95;ctx.setLineDash(dash);ctx.beginPath();pts.forEach((v,i)=>{const xy=project(...v);i?ctx.lineTo(...xy):ctx.moveTo(...xy)});ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;};
 const faces=[];
 const face=(pts,color,alpha)=>faces.push({pts,color,alpha,depth:pts.reduce((n,v)=>n+v[0]*sa+v[2]*ca,0)/pts.length});
 const box=(x,y,z,dx,dy,dz,color,alpha=1)=>{
  face([[x,y,z+dz],[x+dx,y,z+dz],[x+dx,y+dy,z+dz],[x,y+dy,z+dz]],color,alpha);
  face([[x+dx,y,z],[x+dx,y,z+dz],[x+dx,y+dy,z+dz],[x+dx,y+dy,z]],color,alpha);
  face([[x,y+dy,z],[x+dx,y+dy,z],[x+dx,y+dy,z+dz],[x,y+dy,z+dz]],color,alpha);
 };
 const boundary=[[0,0,0],[8.4,0,0],[8.4,0,6.2],[0,0,6.2],[0,0,0]];
 // Reveal the perimeter by length rather than making disconnected corners fade.
 const perimeter=29.2,remaining=perimeter*outline;let traveled=0;
 for(let i=0;i<4;i++){const from=boundary[i],to=boundary[i+1],length=Math.hypot(to[0]-from[0],to[2]-from[2]),part=clamp((remaining-traveled)/length);if(part>0)line([from,from.map((v,j)=>v+(to[j]-v)*part)],ink,.9);traveled+=length;}
 box(0,-.13,0,8.4,.13,6.2,'#555447',.23*outline);
 // Joined rear and left exterior walls, fixed to the floor and each other.
 box(0,0,0,8.4,2.78,.14,'#a39f8a',.16*wall);
 box(0,0,.14,.14,2.78,6.06,'#a39f8a',.10*wall);
 // Windows occupy the wall, with solid sill, head and mullions.
 for(const [x,dx] of [[.45,3.45],[4.85,3.1]]){
  line([[x,.85,.15],[x+dx,.85,.15],[x+dx,2.12,.15],[x,2.12,.15],[x,.85,.15]],accent,.65*wall);
  line([[x+dx/2,.85,.15],[x+dx/2,2.12,.15]],ink,.6*wall);
 }
 // Continuous partition with a true door void: no threshold block across the opening.
 box(4.55,0,.14,.14,2.78,3.51,'#9f9c88',.13*wall);
 box(4.55,0,4.55,.14,2.78,1.65,'#9f9c88',.13*wall);
 box(4.55,2.15,3.65,.14,.63,.9,'#9f9c88',.13*wall);
 box(4.69,0,3.15,.86,2.78,.14,'#9f9c88',.12*wall);
 box(6.45,0,3.15,1.95,2.78,.14,'#9f9c88',.12*wall);
 box(5.55,2.15,3.15,.9,.63,.14,'#9f9c88',.12*wall);
 // Kitchen, bed and coffee table support the apartment's legible scale.
 box(.35,.05,.4,3.7,.86,.62,'#b5a88b',.55*furniture);
 box(5.1,.08,.7,1.8,.5,2.15,'#c3b9a4',.7*furniture);
 box(5.15,.58,.77,.78,.12,.48,'#e3d8bf',furniture);box(6.06,.58,.77,.78,.12,.48,'#e3d8bf',furniture);
 box(1.32,.12,3.1,1.35,.4,.75,'#9b896c',furniture);
 // Sofa faces the television; separate seat, back, arms and cushions.
 box(.62,.16,4.35,2.9,.38,.88,'#cfc3ad',furniture);
 box(.62,.54,5.08,2.9,.52,.15,'#c3b69f',furniture);
 box(.62,.16,4.35,.16,.8,.88,'#c3b69f',furniture);box(3.36,.16,4.35,.16,.8,.88,'#c3b69f',furniture);
 for(let i=0;i<3;i++){box(.84+i*.8,.54,4.42,.75,.12,.61,'#ded4c1',furniture);box(.84+i*.8,.66,4.98,.75,.31,.13,'#dbcfb9',furniture);}
 box(1.25,.06,1.48,2.0,.52,.38,'#b5a285',furniture);
 box(1.53,.67,1.57,1.45,.83,.07,'#222b31',furniture);box(2.13,.58,1.57,.2,.09,.12,'#b5a285',furniture);
 faces.sort((x,y)=>x.depth-y.depth).forEach(f=>{ctx.globalAlpha=f.alpha;ctx.beginPath();f.pts.forEach((v,i)=>{const xy=project(...v);i?ctx.lineTo(...xy):ctx.moveTo(...xy)});ctx.closePath();ctx.fillStyle=f.color;ctx.fill();ctx.strokeStyle=ink;ctx.lineWidth=.75;ctx.stroke();});ctx.globalAlpha=1;
 const dashed=wall*(.2+.8*ease(p));
 // Front/right cutaway closure: connected, progressively revealed dashed walls.
 for(const pts of [ [[8.4,0,0],[8.4,2.78,0],[8.4,2.78,6.2],[8.4,0,6.2]],[[0,0,6.2],[0,2.78,6.2],[8.4,2.78,6.2]],[[0,2.78,0],[0,2.78,6.2]] ])line(pts,accent,.6*dashed,[4,5]);
 line([[6.3,0,6.2],[6.3,2.15,6.2],[7.2,2.15,6.2],[7.2,0,6.2]],accent,.7*dashed,[4,5]);
 const label=(text,x,y)=>{ctx.font=Math.max(11,w/45)+'px Manrope';const tw=ctx.measureText(text).width;ctx.globalAlpha=.95*outline;ctx.fillStyle='#171c1e';ctx.fillRect(x-tw/2-7,y-16,tw+14,24);ctx.fillStyle=accent;ctx.textAlign='center';ctx.fillText(text,x,y);ctx.globalAlpha=1;};
 const corners=boundary.slice(0,4).map(v=>project(...v)),left=Math.min(...corners.map(v=>v[0])),right=Math.max(...corners.map(v=>v[0])),bottom=Math.max(...corners.map(v=>v[1]))+24;
 ctx.strokeStyle=accent;ctx.globalAlpha=.7*outline;ctx.beginPath();ctx.moveTo(left,bottom);ctx.lineTo(right,bottom);ctx.stroke();ctx.globalAlpha=1;
 label('8 400 мм',(left+right)/2,bottom+4);label('6 200 мм',Math.max(48,left-7),h*.74);
 const upper=project(8.4,2.78,0);label('2 780 мм',Math.min(w-46,right+17),upper[1]-12);
 label('Поворот '+(turn*180/Math.PI).toFixed(1).replace('.',',')+'°',w*.47,h*.17);
 canvas.dataset.progress=p.toFixed(3);canvas.dataset.rotation=(turn*180/Math.PI).toFixed(2);canvas.dataset.furniture=furniture.toFixed(3);canvas.dataset.dashed=dashed.toFixed(3);
};
})();
