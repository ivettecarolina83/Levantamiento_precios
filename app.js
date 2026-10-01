const INSUMOS=[
"Pan de hamburguesa grande","Pan de hamburguesa pequeño","Pan de perro grande","Pan de perro pequeño",
"Queso amarillo rebanado","Jamón rebanado","Queso pecorino","Papas ralladas","Papas naturales",
"Chorizo","Pollo (pechuga o milanesa)","Carne molida","Ajo","Vinagre","Huevo","Limón","Salchichas",
"Carne para mechar","Plátano verde","Maíz desgranado","Mozzarella"
];
const productos=document.querySelector("#productos"), form=document.querySelector("#priceForm");
const establecimiento=document.querySelector("#establecimiento"), registrosEl=document.querySelector("#registros");
const toast=document.querySelector("#toast");
INSUMOS.forEach((nombre,i)=>{
 const d=document.createElement("section"); d.className="item";
 d.innerHTML=`<h3>${nombre}</h3><div class="fields">
 <input data-i="${i}" data-field="presentacion" placeholder="Presentación (ej.: paquete de 20)">
 <input data-i="${i}" data-field="precio" inputmode="decimal" placeholder="Precio">
 </div>`; productos.appendChild(d);
});
const getRecords=()=>JSON.parse(localStorage.getItem("levantamientoPrecios")||"[]");
const setRecords=x=>localStorage.setItem("levantamientoPrecios",JSON.stringify(x));
function showToast(msg){toast.textContent=msg;toast.style.display="block";setTimeout(()=>toast.style.display="none",2200)}
function render(){
 const rows=getRecords(); registrosEl.innerHTML=rows.length?"":"<p class='hint'>Todavía no hay registros.</p>";
 rows.slice().reverse().forEach(r=>{
  const d=document.createElement("div");d.className="record";
  d.innerHTML=`<strong>${escapeHtml(r.establecimiento)}</strong><small>${new Date(r.fecha).toLocaleString("es-VE")} · ${r.productos.length} producto(s)</small>`;
  registrosEl.appendChild(d);
 });
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
form.addEventListener("submit",e=>{
 e.preventDefault();
 const sitio=establecimiento.value.trim();
 if(!sitio){showToast("Escribe el nombre del establecimiento.");establecimiento.focus();return}
 const productosGuardados=INSUMOS.map((nombre,i)=>{
  const p=document.querySelector(`[data-i="${i}"][data-field="presentacion"]`).value.trim();
  const pr=document.querySelector(`[data-i="${i}"][data-field="precio"]`).value.trim();
  return {nombre,presentacion:p,precio:pr};
 }).filter(x=>x.presentacion||x.precio);
 if(!productosGuardados.length){showToast("Completa al menos un producto.");return}
 const rows=getRecords();rows.push({id:crypto.randomUUID?.()||String(Date.now()),establecimiento:sitio,fecha:new Date().toISOString(),productos:productosGuardados});setRecords(rows);
 form.reset();establecimiento.value="";render();showToast("Registro guardado.");
 window.scrollTo({top:0,behavior:"smooth"});
});
document.querySelector("#exportBtn").addEventListener("click",()=>{
 const rows=getRecords(); if(!rows.length){showToast("No hay registros para exportar.");return}
 const out=[["Fecha","Establecimiento","Insumo","Presentación","Precio"]];
 rows.forEach(r=>r.productos.forEach(p=>out.push([r.fecha,r.establecimiento,p.nombre,p.presentacion,p.precio])));
 const csv=out.map(row=>row.map(v=>`"${String(v??"").replaceAll('"','""')}"`).join(",")).join("\n");
 const a=document.createElement("a");a.href=URL.createObjectURL(new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"}));a.download="levantamiento_precios.csv";a.click();URL.revokeObjectURL(a.href);
});
render();