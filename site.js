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
function newsDetail(id){const n=window.CIS_DEMO?.news.find(n=>n.id===id);if(!n)return false;openModal(`<img class="modal-image" src="assets/caserne-le-chesne.jpg" alt="La caserne du Chesne, photographie d’illustration"><div class="modal-body"><p class="eyebrow">${esc(n.category)} · ${esc(n.display)}</p><h2 id="modal-title">${esc(n.title)}</h2>${n.body.map(p=>'<p>'+esc(p)+'</p>').join('')}<span class="tag-demo">ARTICLE FICTIF · APERÇU</span></div>`);return true;}
document.querySelectorAll('[data-vehicle]').forEach(b=>b.addEventListener('click',()=>{const v=window.CIS_DEMO?.vehicles.find(x=>x.id===b.dataset.vehicle);if(!v)return;openModal(`<div class="vehicle-photo ${esc(v.class)}" role="img" aria-label="Photographie d’illustration de la caserne"><span class="vehicle-type">${esc(v.abbr)} / ${esc(v.category.toUpperCase())}</span></div><div class="modal-body"><p class="eyebrow">Fiche de démonstration</p><h2 id="modal-title">${esc(v.name)}</h2><p>${esc(v.body)}</p><h3>Équipements présentés à titre d’exemple</h3><ul>${v.equipment.map(x=>'<li>'+esc(x)+'</li>').join('')}</ul><p class="photo-credit">Les moyens, les appellations et les caractéristiques seront validés par le centre. L’image est un recadrage de la photo générale fournie.</p><a class="button navy" href="contact.html?objet=caserne">Nous poser une question →</a></div>`);}));
const article=new URLSearchParams(location.search).get('article');if(article)newsDetail(article);
const form=document.getElementById('contact-form');if(form){const subject=new URLSearchParams(location.search).get('objet');if(['caserne','engagement','amicale','autre'].includes(subject))document.getElementById('objet').value=subject;form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const box=document.getElementById('form-result');box.textContent='Votre message est prêt. Ceci est une démonstration : aucun message n’a été envoyé et aucune donnée n’a été enregistrée.';box.hidden=false;box.focus();});}
})();
