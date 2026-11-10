/* Interface statique : aucune connexion avec l'application interne. */
(()=>{'use strict';
const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.site-nav');
function closeMenu(){nav?.classList.remove('open');toggle?.setAttribute('aria-expanded','false');toggle?.setAttribute('aria-label','Ouvrir le menu');}
toggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))closeMenu();});
window.addEventListener('resize',()=>{if(innerWidth>940)closeMenu();});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
const grid=document.querySelector('[data-filter-grid]');
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));grid?.querySelectorAll('article[data-category]').forEach(card=>card.hidden=b.dataset.filter!=='Tous'&&card.dataset.category!==b.dataset.filter);}));
const modal=document.getElementById('detail-modal'),content=document.getElementById('modal-content');let previous=null;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function openModal(markup){previous=document.activeElement;content.innerHTML=markup;modal.showModal();modal.scrollTop=0;document.body.classList.add('locked');modal.querySelector('.modal-close').focus();}
function closeModal(){modal.close();}
modal?.querySelector('.modal-close').addEventListener('click',closeModal);
modal?.addEventListener('click',e=>{if(e.target!==modal)return;const r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeModal();});
modal?.addEventListener('close',()=>{document.body.classList.remove('locked');previous?.focus?.();const url=new URL(location.href);if(url.searchParams.has('article')){url.searchParams.delete('article');history.replaceState(null,'',url.pathname+url.search+url.hash);}});
function newsDetail(id){const n=window.CIS_SITE?.news.find(n=>n.id===id);if(!n)return false;openModal(`<img class="modal-image" src="${esc(n.image)}" alt="Manœuvre intercentres à Boult-aux-Bois"><div class="modal-body"><p class="eyebrow">${esc(n.category)} · ${esc(n.display)}</p><h2 id="modal-title">${esc(n.title)}</h2>${n.body.map(p=>'<p>'+esc(p)+'</p>').join('')}<a class="button navy" href="photos.html">Voir les 8 photos →</a></div>`);return true;}
document.querySelectorAll('[data-vehicle]').forEach(b=>b.addEventListener('click',()=>{const v=window.CIS_SITE.vehicles.find(x=>x.id===b.dataset.vehicle);if(v)openModal(`<div class="modal-body"><p class="eyebrow">${esc(v.abbr)} · ${esc(v.category)}</p><h2 id="modal-title">${esc(v.name)}</h2><p>${esc(v.body)}</p></div>`);}));
document.querySelectorAll('[data-photo]').forEach(b=>b.addEventListener('click',()=>openModal(`<div class="modal-body"><h2 id="modal-title">Manœuvre du 8 novembre 2026</h2></div><img class="gallery-full" src="${esc(b.dataset.photo)}" alt="${esc(b.querySelector('img').alt)}">`)));
const article=new URLSearchParams(location.search).get('article');if(article)newsDetail(article);

})();

/* Animations discrètes, sans suivi du pointeur, avec respect du mouvement réduit. */
(()=>{'use strict';
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const header=document.querySelector('.site-header'),progress=document.querySelector('.reading-progress');let queued=false;
function updateScroll(){const max=document.documentElement.scrollHeight-innerHeight;progress?.style.setProperty('transform',`scaleX(${max>0?Math.min(1,Math.max(0,scrollY/max)):0})`);header?.classList.toggle('is-scrolled',scrollY>24);queued=false;}
addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(updateScroll);}},{passive:true});addEventListener('resize',updateScroll);updateScroll();
if(reduced||!('IntersectionObserver' in window))return;
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.08,rootMargin:'0px 0px -28px 0px'});
document.querySelectorAll('.section-head,.split>div,.photo-frame,.mission,.news-card,.vehicle,.value,.timeline article,.step,.agenda-item,.faq,.contact-info,.form-panel,.quote-panel,.full-photo,.recruit-banner .wrap').forEach((el,i)=>{el.classList.add('reveal-pending');el.style.setProperty('--reveal-delay',`${el.matches('.mission,.news-card,.vehicle,.value,.step')?(i%3)*65:0}ms`);observer.observe(el);});
const counters=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;const el=entry.target,target=Number(el.textContent),start=performance.now();counters.unobserve(el);function tick(now){const t=Math.min((now-start)/1200,1),ease=1-Math.pow(1-t,3);el.textContent=String(Math.round(target*ease));if(t<1)requestAnimationFrame(tick);}requestAnimationFrame(tick);}),{threshold:.5});document.querySelectorAll('.stat strong').forEach(el=>{if(/^\d+$/.test(el.textContent.trim()))counters.observe(el);});
})();
