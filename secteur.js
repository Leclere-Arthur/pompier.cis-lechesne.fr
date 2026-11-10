(()=>{'use strict';
const el=document.getElementById('sector-map');if(!el)return;
const style=document.createElement('style');
style.textContent='.sector-commune-label{background:transparent;border:0;box-shadow:none;color:#000;font:600 11px/1.15 Arial,sans-serif;text-align:center;white-space:normal;width:max-content;max-width:112px;padding:0;text-shadow:0 0 3px #fff,0 0 3px #fff,1px 1px 1px #fff;pointer-events:none}.sector-commune-label:before{display:none}';
el.append(style);
if(!window.L||!window.CIS_SECTEUR){el.innerHTML='<p class="map-failure">La carte ne peut pas être chargée. Les communes du secteur sont indiquées au-dessus.</p>';return;}
const data=window.CIS_SECTEUR,map=L.map(el,{scrollWheelZoom:false});
const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
const names=L.geoJSON(data.communes,{style:{color:'#a62832',weight:1,opacity:.5,fillOpacity:0},onEachFeature:(f,l)=>{
 const name=f.properties.nom;const text=document.createElement('strong');text.textContent=name;l.bindPopup(text);
 const label=document.createElement('span');label.textContent=name.replaceAll(' · ',' / ');
 l.bindTooltip(label,{permanent:true,direction:'center',className:'sector-commune-label',opacity:1,interactive:false});
 l.on('mouseover',()=>l.setStyle({fillColor:'#cb323b',fillOpacity:.22,weight:2}));l.on('mouseout',()=>names.resetStyle(l));
}}).addTo(map);
const zone=L.geoJSON(data.zone,{style:{color:'#c9283b',weight:3,fillColor:'#e63646',fillOpacity:.18},interactive:false}).addTo(map);
function fit(){map.invalidateSize();map.fitBounds(zone.getBounds(),{padding:[28,28],maxZoom:12});}
fit();document.getElementById('sector-fit')?.addEventListener('click',fit);
if('ResizeObserver'in window)new ResizeObserver(()=>map.invalidateSize()).observe(el);
})();
