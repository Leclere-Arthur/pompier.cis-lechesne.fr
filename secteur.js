(()=>{'use strict';
const el=document.getElementById('sector-map');if(!el)return;
const id=window.CIS_MAPS?.googleMyMapsId?.trim();
if(id&&/^[a-zA-Z0-9_-]+$/.test(id)){
 const frame=document.createElement('iframe');frame.title='Google Maps : secteur défendu par le CIS Le Chesne';frame.src='https://www.google.com/maps/d/embed?mid='+encodeURIComponent(id);frame.loading='lazy';frame.allowFullscreen=true;el.append(frame);document.getElementById('sector-fit')?.remove();return;
}
if(!window.L||!window.CIS_SECTEUR){el.innerHTML='<p class="map-failure">La carte ne peut pas être chargée. Les communes du secteur sont indiquées au-dessus.</p>';return;}
const data=window.CIS_SECTEUR,map=L.map(el,{scrollWheelZoom:false});
const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
const names=L.geoJSON(data.communes,{style:{color:'#a62832',weight:1,opacity:.5,fillOpacity:0},onEachFeature:(f,l)=>{
 const name=f.properties.nom;l.bindTooltip(name,{sticky:true});const text=document.createElement('strong');text.textContent=name;l.bindPopup(text);
 l.on('mouseover',()=>l.setStyle({fillColor:'#cb323b',fillOpacity:.22,weight:2}));l.on('mouseout',()=>names.resetStyle(l));
}}).addTo(map);
const zone=L.geoJSON(data.zone,{style:{color:'#c9283b',weight:3,fillColor:'#e63646',fillOpacity:.18},interactive:false}).addTo(map);
function fit(){map.invalidateSize();map.fitBounds(zone.getBounds(),{padding:[28,28],maxZoom:12});}
fit();document.getElementById('sector-fit')?.addEventListener('click',fit);
if('ResizeObserver'in window)new ResizeObserver(()=>map.invalidateSize()).observe(el);
})();
