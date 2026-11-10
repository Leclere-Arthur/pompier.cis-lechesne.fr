(()=>{'use strict';
const el=document.getElementById('sector-map');if(!el)return;
const style=document.createElement('style');
style.textContent='.sector-commune-label{background:transparent;border:0;box-shadow:none;color:#000;font:600 11px/1.15 Arial,sans-serif;text-align:center;white-space:normal;width:max-content;max-width:112px;padding:0;text-shadow:0 0 3px #fff,0 0 3px #fff,1px 1px 1px #fff;pointer-events:none}.sector-commune-label:before{display:none}';
el.append(style);
if(!window.L||!window.CIS_SECTEUR){el.innerHTML='<p class="map-failure">La carte ne peut pas être chargée. Les communes du secteur sont indiquées au-dessus.</p>';return;}
const data=window.CIS_SECTEUR,map=L.map(el,{scrollWheelZoom:true});
const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
const names=L.geoJSON(data.communes,{style:{color:'#a62832',weight:1,opacity:.5,fillOpacity:0},onEachFeature:(f,l)=>{
 const name=f.properties.nom;const text=document.createElement('strong');text.textContent=name;l.bindPopup(text);
 const label=document.createElement('span');label.textContent=name.replaceAll(' · ',' / ');
 l.bindTooltip(label,{permanent:true,direction:'center',className:'sector-commune-label',opacity:1,interactive:false});
 l.on('mouseover',()=>l.setStyle({fillColor:'#cb323b',fillOpacity:.22,weight:2}));l.on('mouseout',()=>names.resetStyle(l));
}}).addTo(map);
const zone=L.geoJSON(data.zone,{style:{color:'#c9283b',weight:3,fillColor:'#e63646',fillOpacity:.18},interactive:false}).addTo(map);
// Keep touch layouts unchanged; separate overlapping labels on mouse devices.
const desktop=window.matchMedia('(hover: hover) and (pointer: fine)');
let layoutFrame;
function arrangeLabels(){
 const labels=[];
 names.eachLayer(layer=>{
  const tooltip=layer.getTooltip();
  tooltip.options.offset=L.point(0,0);tooltip.update();
  const node=tooltip.getElement();
  if(node)labels.push({tooltip,node});
 });
 if(!desktop.matches)return;
 const bounds=el.getBoundingClientRect(),placed=[];
 labels.sort((a,b)=>b.node.offsetWidth-a.node.offsetWidth);
 const intersects=(a,b)=>a.left<b.right+5&&a.right>b.left-5&&a.top<b.bottom+4&&a.bottom>b.top-4;
 for(const item of labels){
  const rect=item.node.getBoundingClientRect();
  let chosen={x:0,y:0},best=Infinity;
  for(let radius=0;radius<=120;radius+=8){
   const count=radius?24:1;
   let found=false;
   for(let i=0;i<count;i++){
    const angle=i*Math.PI*2/count;
    const x=Math.round(Math.cos(angle)*radius),y=Math.round(Math.sin(angle)*radius);
    const box={left:rect.left+x,right:rect.right+x,top:rect.top+y,bottom:rect.bottom+y};
    if(box.left<bounds.left+6||box.right>bounds.right-6||box.top<bounds.top+6||box.bottom>bounds.bottom-6)continue;
    if(placed.some(other=>intersects(box,other)))continue;
    const cost=x*x+y*y;
    if(cost<best){best=cost;chosen={x,y};found=true;}
   }
   if(found)break;
  }
  item.tooltip.options.offset=L.point(chosen.x,chosen.y);item.tooltip.update();
  placed.push(item.node.getBoundingClientRect());
 }
}
function scheduleLabels(){cancelAnimationFrame(layoutFrame);layoutFrame=requestAnimationFrame(arrangeLabels);}
map.on('zoomend moveend resize',scheduleLabels);
if(desktop.addEventListener)desktop.addEventListener('change',scheduleLabels);
function fit(){map.invalidateSize();map.fitBounds(zone.getBounds(),{padding:[28,28],maxZoom:12});}
fit();scheduleLabels();document.getElementById('sector-fit')?.addEventListener('click',fit);
if('ResizeObserver'in window)new ResizeObserver(()=>map.invalidateSize()).observe(el);
})();
