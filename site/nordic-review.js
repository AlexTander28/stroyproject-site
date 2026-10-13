/* Main-site review: sales copy, accurate openings and native image comparison. */
(() => {
'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const consentLabel=document.createElement('label');consentLabel.className='privacy-consent';consentLabel.innerHTML='<input type="checkbox" name="privacyConsent" value="accepted" required><span>Даю <a href="consent.html" target="_blank" rel="noopener">согласие на обработку персональных данных</a> и ознакомлен(а) с <a href="privacy.html" target="_blank" rel="noopener">политикой конфиденциальности</a>.</span>';
$('.estimate-form button[type="submit"]').before(consentLabel);
$('.estimate-form [name=area]').step='0.1';
$('.estimate-form [name=message]').closest('label').firstChild.textContent='Что планируете (необязательно)';
const publicFooter=$('.site-footer');publicFooter.querySelector('nav').innerHTML='<a href="privacy.html">Политика конфиденциальности</a><a href="consent.html">Согласие на обработку данных</a>';
const footerContacts=document.createElement('div');footerContacts.className='footer-contacts';footerContacts.innerHTML='<div class="footer-caption">Обсудим вашу квартиру</div><span class="footer-phone">+7 (000) 000-00-00</span><span>hello@stroyproject.example</span><span>Екатеринбург</span><small>Временные контакты — примеры для макета.</small>';
const footerDeveloper=document.createElement('div');footerDeveloper.className='footer-developer';footerDeveloper.innerHTML='<span>Разработка — студия «Северный код» <small>(пример)</small></span><span>studio@example.com · +7 (000) 000-00-00</span>';
publicFooter.append(footerContacts,footerDeveloper);
// Final work stage: clear the construction zone before the estimate invitation.
const cleanup=document.createElement('section');cleanup.id='cleanup';cleanup.className='content-section cleanup-section';cleanup.setAttribute('aria-labelledby','cleanup-title');
cleanup.innerHTML=`<div class="section-body"><div class="section-copy"><h2 id="cleanup-title">Чистота —<br>последний штрих.</h2><p>После работ собираем строительный мусор и приводим рабочую зону в порядок. Чтобы в центре внимания остался ваш интерьер — без обрезков, упаковки и следов ремонта.</p><p class="cleanup-note">Состав уборки и вывоз мусора согласуем заранее. Генеральный клининг — отдельная задача, которую можно обсудить при расчёте.</p></div><figure class="cleanup-scene"><svg viewBox="0 0 600 360" role="img" aria-label="Строительные обрезки собираются в контейнер, поверхность становится чистой" fill="none" stroke="var(--ink)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><defs><clipPath id="cleanup-bin-clip"><path d="M310 164H518L478 292H350Z"/></clipPath></defs><path class="cleanup-room" d="M52 282V57H550V282M52 282H550"/><path class="cleanup-sweep" d="M52 282H285" pathLength="1"/><g class="cleanup-dust" stroke="var(--muted)"><path d="M70 279h9m21-4h7m40 8h9m30-6h9m45 6h9"/></g><g class="cleanup-rubble" fill="var(--tool-fill)" stroke="var(--ink)"><path d="M-18-9H18V9H-18ZM-5-9V9"/><path d="M-14 9L-9-10L15-5L11 11Z"/><path d="M-20-5L17-9L20 4L-18 8Z"/><path d="M-11-12L14-4L7 12L-15 4Z"/><path d="M-18-6H18V6H-18Z"/><path d="M-10-10L13-6L9 11L-14 6Z"/></g><path d="M310 164H518L478 292H350Z" fill="var(--tool-fill)"/><g clip-path="url(#cleanup-bin-clip)"><path class="cleanup-load" d="M308 172L331 155L350 166L371 148L392 163L414 147L440 164L467 151L490 169L519 156V211H308Z" fill="var(--muted)" stroke="var(--ink)"/></g><path d="M352 185L367 270M393 185L399 270M435 185L431 270M475 185L461 270" opacity=".55"/><path d="M300 149H529L518 164H310ZM310 149V137H519V149M316 137L332 124H498L519 137" fill="var(--tool-surface)"/><path d="M350 292H479M363 292V301M464 292V301"/><path class="cleanup-check" d="M114 218L137 240L187 190" stroke="var(--accent)" stroke-width="3" pathLength="1"/><text x="300" y="337" text-anchor="middle" class="cleanup-status">Собираем строительный мусор</text></svg><figcaption><span>Завершение работ</span><span class="cleanup-state">Порядок в деталях</span></figcaption></figure></div>`;
$('#estimate').before(cleanup);
cleanup.dataset.block='cleanup';cleanup.dataset.label='Завершение и порядок';
cleanup.querySelector('.section-body').prepend(cleanup.querySelector('.cleanup-scene'));
window.referenceConfig.order.splice(window.referenceConfig.order.indexOf('estimate'),0,'cleanup');
$('.layout-editor').remove();
const cleanupReduced=matchMedia('(prefers-reduced-motion: reduce)'),cleanupSvg=cleanup.querySelector('svg'),cleanupPieces=[...cleanup.querySelector('.cleanup-rubble').children];
const cleanupAction=document.createElementNS('http://www.w3.org/2000/svg','g');cleanupAction.classList.add('cleanup-action');cleanupAction.setAttribute('transform','translate(414 282) scale(1.12) translate(-414 -282)');
const cleanupActionNodes=[...cleanupSvg.children].filter(node=>!node.matches('defs,.cleanup-room,.cleanup-sweep,.cleanup-dust,.cleanup-check,.cleanup-status'));cleanupSvg.insertBefore(cleanupAction,cleanupSvg.querySelector('.cleanup-check'));cleanupAction.append(...cleanupActionNodes);
const cleanupClamp=v=>Math.max(0,Math.min(1,v));let cleanupPending=false;
function renderCleanup(){cleanupPending=false;const r=cleanup.querySelector('.cleanup-scene').getBoundingClientRect(),p=cleanupReduced.matches?1:cleanupClamp((innerHeight*.86-r.top)/(innerHeight*.65+r.height*.25));cleanup.dataset.progress=p.toFixed(3);
 cleanupPieces.forEach((piece,i)=>{const t=cleanupClamp((p-.05-i*.075)/.43),s=t*t*(3-2*t),x=79+i*32+(358+i*23%91-79-i*32)*s,y=270-117*s-120*Math.sin(Math.PI*s);piece.setAttribute('transform',`translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${(-18+i*14+90*s).toFixed(2)})`);piece.setAttribute('opacity',String(t>=.98?0:1));});
 cleanup.querySelector('.cleanup-load').setAttribute('transform',`translate(0 ${(80*(1-cleanupClamp((p-.3)/.55))).toFixed(2)})`);
 cleanup.querySelector('.cleanup-dust').setAttribute('opacity',String(1-cleanupClamp((p-.4)/.5)));
 cleanup.querySelector('.cleanup-sweep').style.strokeDashoffset=1-cleanupClamp((p-.45)/.5);
 cleanup.querySelector('.cleanup-check').style.strokeDashoffset=1-cleanupClamp((p-.82)/.18);
 cleanup.querySelector('.cleanup-status').textContent=p>.94?'Пространство в порядке':'Собираем строительный мусор';cleanup.querySelector('.cleanup-state').textContent=p>.94?'Чистая рабочая зона':'Порядок в деталях';
}
function queueCleanup(){if(!cleanupPending){cleanupPending=true;requestAnimationFrame(renderCleanup);}}
addEventListener('scroll',queueCleanup,{passive:true});addEventListener('resize',queueCleanup);cleanupReduced.addEventListener('change',queueCleanup);queueCleanup();
// Approved editorial route replaces only the former promise strip.
const route=$('.promise-strip'),routeTopics=[...route.children];route.classList.add('promise-route');route.setAttribute('aria-label','Маршрут к ремонту');
const routeCurrent=document.createElement('div');routeCurrent.className='route-current';routeCurrent.innerHTML='<h2 aria-label="От квартиры к понятному плану" data-route-title>От квартиры к понятному плану</h2><svg viewBox="0 0 260 90" aria-hidden="true"><path d="M12 70H248M30 70V30H104V70M156 70V12H230V70"/><path class="panel" d="M104 30H156V70H104Z"/><path d="M45 47H88M172 30H212M172 46H212"/></svg>';
const routeTrack=document.createElement('div');routeTrack.className='route-track';routeTopics.forEach(el=>{el.classList.add('route-topic');routeTrack.append(el);});route.replaceChildren(routeCurrent,routeTrack);
const routeBackgrounds=document.createElement('div');routeBackgrounds.className='route-backgrounds';routeBackgrounds.setAttribute('aria-hidden','true');
const routeImages=['newbuild','resale','scope','estimate'].map((name,i)=>{const img=document.createElement('img');img.dataset.src='assets/route-backgrounds/'+name+'.webp';img.alt='';img.width=1600;img.height=900;img.decoding='async';img.classList.toggle('is-active',i===0);routeBackgrounds.append(img);return img;});
const routeImageNote=document.createElement('small');routeImageNote.className='route-image-note';routeImageNote.textContent='Сгенерированные иллюстрации, не объекты компании.';route.prepend(routeBackgrounds);route.append(routeImageNote);
const routeContent=document.createElement('div');routeContent.className='route-content';routeContent.append(routeCurrent,routeTrack,routeImageNote);route.append(routeContent);
const routeScroll=document.createElement('div');routeScroll.className='route-scroll';route.replaceWith(routeScroll);routeScroll.append(route);
// Load this chapter just before it enters view, not alongside the hero.
const loadRouteImages=()=>routeImages.forEach(img=>{if(!img.hasAttribute('src'))img.src=img.dataset.src;});
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){loadRouteImages();observer.disconnect();}},{rootMargin:'100px'});observer.observe(routeScroll);}else loadRouteImages();
const routeReduced=matchMedia('(prefers-reduced-motion: reduce)');let routePending=false;
function renderRoute(){routePending=false;const height=route.offsetHeight,pinned=!routeReduced.matches&&routeContent.offsetHeight<=innerHeight-76,center=Math.max(0,(innerHeight-height)/2),travel=innerHeight*1.25;routeScroll.classList.toggle('route-pinned',pinned);routeScroll.style.height=pinned?(height+travel)+'px':'auto';routeScroll.style.setProperty('--route-top',center+'px');routeScroll.dataset.pinned=String(pinned);const r=route.getBoundingClientRect(),wr=routeScroll.getBoundingClientRect(),p=routeReduced.matches?1:Math.max(0,Math.min(1,pinned?(center-wr.top)/travel:(innerHeight*.76-r.top)/(r.height*.5+innerHeight*.38))),smooth=p*p*(3-2*p),index=Math.min(3,Math.floor(p*4));route.style.setProperty('--route-progress',smooth);route.dataset.progress=p.toFixed(3);routeTopics.forEach((el,i)=>el.classList.toggle('active',!routeReduced.matches&&i===index));routeCurrent.querySelector('h2').textContent=routeReduced.matches?'От квартиры к понятному плану':routeTopics[index].querySelector('strong').textContent;}
function queueRoute(){if(!routePending){routePending=true;requestAnimationFrame(()=>{renderRoute();const index=routeReduced.matches?0:routeTopics.findIndex(el=>el.classList.contains('active'));routeImages.forEach((img,i)=>img.classList.toggle('is-active',i===index));route.dataset.background=String(index);});}}
addEventListener('scroll',queueRoute,{passive:true});addEventListener('resize',queueRoute);routeReduced.addEventListener('change',queueRoute);document.fonts.ready.then(queueRoute);queueRoute();
const captions={level:['Точные замеры до начала работ','Без лишнего материала'],spatula:['Подготовка стен под вашу отделку','Ровное основание'],roller:['Подбираем краску под ваш интерьер','Попадание в выбранный цвет'],square:['Проверяем углы и примыкания','Аккуратные детали'],estimate:['Предварительный расчёт бесплатно','Стоимость подготовки — 0 ₽']};
$$('[data-scene]').forEach(el=>{const [lead,result]=captions[el.dataset.scene];el.closest('.scene-frame').querySelector('.scene-caption span').textContent=lead;el.closest('.scene-frame').querySelector('[data-scene-state]').textContent=result;});
$('.hero-actions .secondary').textContent='Посмотреть интерьеры';
$('#cases').dataset.label='Ваш ремонт';
$('#cases h2').innerHTML='Ваш ремонт.<br>Продуманный до деталей.';
$('#cases .concept-note').innerHTML='От удобной планировки до цвета стен — соберём пространство под вашу жизнь. <span class="illustration-note">Иллюстрации возможного результата.</span>';
const descriptions=['Место для семейных вечеров и встреч с друзьями','Удобство каждый день — от плитки до сантехники','Спокойные цвета и отделка для вашего отдыха','Аккуратные стыки, фактуры и примыкания'];
$$('.case-card').forEach((card,i)=>{card.querySelector('.case-mark').textContent='Ваш ремонт';card.querySelector('.case-open').textContent='Рассмотреть интерьер';card.querySelector('.case-open').setAttribute('aria-label','Рассмотреть интерьер: '+card.querySelector('h3').textContent);card.querySelector('.case-caption p').textContent=descriptions[i];card.querySelector('img').alt='Иллюстрация интерьера: '+card.querySelector('h3').textContent;});
$('.case-dialog p').textContent='Иллюстрация возможного результата. Обсудим похожую отделку для вашей квартиры.';
$('.dialog-close').setAttribute('aria-label','Закрыть интерьер');
$('.hero-photo').alt='Иллюстрация кухни-гостиной после ремонта';
$('.about-photo').alt='Иллюстрация интерьера с натуральными фактурами';
// Photo-derived edges keep the drawing registered to the finished interior.
const photo=$('.about-photo'),blueprint=document.createElement('div');blueprint.className='about-blueprint';
photo.replaceWith(blueprint);photo.classList.add('about-color');
const contour=photo.cloneNode();contour.classList.remove('about-color');contour.classList.add('about-contour');contour.alt='';contour.setAttribute('aria-hidden','true');
blueprint.innerHTML='<svg width="0" height="0" aria-hidden="true" style="position:absolute"><defs><filter id="nordic-photo-contour" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="0"/><feConvolveMatrix order="3" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" preserveAlpha="true"/><feComponentTransfer><feFuncR type="linear" slope="5"/><feFuncG type="linear" slope="5"/><feFuncB type="linear" slope="5"/></feComponentTransfer></filter></defs></svg>';
blueprint.append(contour,photo);
const photoReduced=matchMedia('(prefers-reduced-motion: reduce)');let photoPending=false;
function revealPhoto(now){
 const r=blueprint.getBoundingClientRect(),target=photoReduced.matches?1:Math.max(0,Math.min(1,(innerHeight*.68-r.top)/((r.height*.62+innerHeight*.28)*1.24)));
 const staticFrame=photoReduced.matches||document.hidden||r.bottom<=0||r.top>=innerHeight||revealPhoto.current===undefined;
 const dt=Math.min(64,Math.max(1,now-(revealPhoto.last||now-16)));
 let p=staticFrame?target:revealPhoto.current+(target-revealPhoto.current)*(1-Math.exp(-dt/120));
 const settled=Math.abs(target-p)<.001;if(settled)p=target;
 revealPhoto.current=p;revealPhoto.last=now;
 const smooth=p*p*(3-2*p);blueprint.style.setProperty('--photo-reveal',(smooth*100)+'%');blueprint.style.setProperty('--contour-opacity',String(1-smooth));blueprint.dataset.progress=p.toFixed(3);blueprint.dataset.targetProgress=target.toFixed(3);
 photoPending=!settled&&!staticFrame;blueprint.dataset.animating=String(photoPending);
 if(photoPending)requestAnimationFrame(revealPhoto);
}
function queuePhoto(){if(!photoPending){photoPending=true;revealPhoto.last=performance.now();requestAnimationFrame(revealPhoto);}}
addEventListener('scroll',queuePhoto,{passive:true});addEventListener('resize',queuePhoto);photoReduced.addEventListener('change',queuePhoto);photo.addEventListener('load',queuePhoto);queuePhoto();
$('#finish .section-copy p').textContent='Подбираем краску под выбранный оттенок и освещение вашей комнаты. Цвет, фактура и аккуратные примыкания складываются в интерьер, в котором приятно жить.';
$('#quality .section-copy p').textContent='Проверяем геометрию, стыки и примыкания по этапам. Обсуждаем детали заранее, чтобы готовая отделка соответствовала согласованному результату.';
$('#measure .section-copy p').textContent='Точный замер помогает рассчитать объём работ и подобрать количество материалов под вашу квартиру. Сначала учитываем размеры, проёмы и состояние поверхностей — затем обсуждаем ремонт.';
$('#rough .section-copy p').textContent='Подготавливаем стены под выбранную отделку: учитываем состояние основания, выравниваем поверхности и прорабатываем стыки. Чтобы краска и покрытия смотрелись так, как вы задумали.';
$('.about-copy p:last-of-type').textContent='Обсуждаем состав работ, последовательность и материалы заранее. Вы понимаете, что будет сделано в вашей квартире и с чего начинается ремонт.';
const compare=document.createElement('figure');compare.className='room-compare';
compare.innerHTML='<div class="compare-images" style="--split:50%"><img src="assets/references-v4/nordic-before.webp" loading="lazy" alt="Иллюстрация той же комнаты до ремонта: бетон и пустое помещение"><img class="compare-after" src="assets/references-v4/nordic-hero.webp" loading="lazy" alt="Иллюстрация той же комнаты после ремонта: кухня и гостиная"><span class="compare-label before">До ремонта</span><span class="compare-label after">После ремонта</span><span class="compare-divider" aria-hidden="true"><svg viewBox="0 0 40 40"><path d="m15 13-7 7 7 7m10-14 7 7-7 7"/></svg></span><input class="compare-range" type="range" min="0" max="100" value="50" aria-label="Сравнить комнату до и после ремонта" aria-valuetext="После ремонта: 50 процентов"></div><figcaption>От пустой комнаты — к месту, где хочется жить. <span class="illustration-note">Иллюстрация преображения одного пространства.</span></figcaption>';
$('#finish .section-photo').replaceWith(compare);$('#finish > .concept-note').remove();
compare.querySelector('img').src='assets/references-v4/nordic-before-brick.webp';compare.querySelector('img').alt='Иллюстрация до ремонта: неровная кирпичная кладка и бетонная плита без стяжки';
const range=compare.querySelector('input');range.addEventListener('input',()=>{compare.querySelector('.compare-images').style.setProperty('--split',range.value+'%');range.setAttribute('aria-valuetext','После ремонта: '+range.value+' процентов');});
compare.querySelectorAll('.compare-label').forEach(label=>label.remove());
window.nordicCaptions=captions;
window.toolScenes=window.toolScenes.map(scene=>{
 let svg=scene.svg;
 const replacements={'Пузырёк — между рисками':'Точность с первого замера','Контроль горизонтали':'Ровная геометрия','Ровный слой за лезвием':'Ровные стены под отделку','Две стороны плотно к стыку':'Аккуратные углы и примыкания','Прямой угол':'Точная геометрия','Снизу':'Точный','вверх':'цвет'};
 Object.entries(replacements).forEach(([a,b])=>svg=svg.replaceAll(a,b));
 if(scene.id==='square')return {...scene,svg,update(svg,p){scene.update(svg,p);svg.querySelector('text.measure').textContent=(81+9*p).toFixed(1).replace('.',',')+'°';svg.querySelector('text.measure+text').textContent=p>=.999?'Точная геометрия':'Выводим угол в 90°';}};
 if(scene.id!=='estimate')return {...scene,svg};
 return {...scene,svg,update(svg,p){
  scene.update(svg,p);const value=Math.round(10000*(1-p)),formatted=new Intl.NumberFormat('ru-RU').format(value);
  const digits=svg.querySelector('[data-part="digits"]');digits.textContent=formatted;digits.style.fontSize='30px';
  // Moving digits illustrate preparation, never its price: preparation is free.
  svg.querySelector('[data-part="total"] .measure').textContent='0 ₽';
  svg.querySelector('[data-part="total"]').setAttribute('opacity','1');
  const keys=[...svg.querySelectorAll('g.quiet rect')],labels=[...svg.querySelector('g[text-anchor="middle"]').children];
  keys.forEach((key,i)=>{key.setAttribute('fill','var(--tool-surface)');key.dataset.active='false';labels[i].style.fill='var(--ink)';});
  svg.dataset.amount=String(value);
 }};
});
/* 8.4 x 6.2 m illustrative plan. Door leaf and arc endpoints coincide with real gaps. */
window.nordicPlanOverride=`<svg viewBox="0 0 900 400" role="img" aria-label="Иллюстративный план квартиры с корректными дверными проёмами" fill="none">
 <g data-plan-stage="walls" stroke="currentColor" stroke-width="6" stroke-linecap="square">
  <path d="M170 70H754V310H650M590 310H170V70M458 70V235M458 295V310M610 70V190M458 190H480M540 190H646M706 190H754"/>
 </g>
 <g data-plan-stage="openings" stroke="var(--accent)" stroke-width="2">
  <path d="M220 70H360M500 70H570M652 70H710" stroke-width="7"/>
  <path data-door="bedroom" d="M480 190V250M480 250A60 60 0 0 0 540 190"/>
  <path data-door="office" d="M706 190V250M706 250A60 60 0 0 1 646 190"/>
  <path data-door="living" d="M458 235H398M398 235A60 60 0 0 0 458 295"/>
  <path data-door="entrance" d="M650 310V250M650 250A60 60 0 0 0 590 310"/>
 </g>
 <g data-plan-stage="furniture" stroke="var(--muted)" stroke-width="1.5">
  <rect x="194" y="99" width="158" height="54" rx="4"/><path d="M207 109H339V144H207ZM250 109V144M294 109V144"/>
  <rect x="259" y="178" width="74" height="48" rx="6"/>
  <path d="M186 247H320V295H186ZM194 258H311M211 258V289M259 258V289"/>
  <rect x="391" y="114" width="15" height="87" rx="2"/><path d="M414 122V193"/>
  <rect x="480" y="90" width="108" height="66" rx="3"/><path d="M487 109H581M487 96H524V108H487ZM542 96H581V108H542"/>
  <rect x="642" y="101" width="88" height="37" rx="3"/><rect x="673" y="145" width="29" height="14" rx="4"/>
  <rect x="554" y="216" width="30" height="44" rx="3"/>
 </g>
 <g data-plan-stage="dimensions" stroke="var(--muted)" stroke-width="1.3"><path d="M170 321V361M754 321V361M170 351H754M158 70H120M158 310H120M130 70V310"/></g>
 <g class="plan-room-labels" fill="var(--ink)" font-family="Manrope,sans-serif" font-size="14" text-anchor="middle"><text x="290" y="172">Кухня-гостиная</text><text x="534" y="172">Спальня</text><text x="682" y="172">Кабинет</text><text x="567" y="285">Прихожая</text></g>
 <rect x="393" y="337" width="135" height="26" fill="var(--bg)"/><text x="462" y="356" text-anchor="middle" font-family="Manrope,sans-serif" fill="var(--accent)" font-size="16">8 400 мм</text>
 <rect x="89" y="171" width="81" height="31" fill="var(--bg)"/><text x="128" y="192" text-anchor="middle" font-family="Manrope,sans-serif" fill="var(--accent)" font-size="15">6 200 мм</text></svg>`;
})();
