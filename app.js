const SUPABASE_URL="https://gdlbojftmadrcfnefrvs.supabase.co";
const SUPABASE_KEY="sb_publishable_RNdT1QCuqDm3_weCvConQQ_rZPcswYR";
const API=SUPABASE_URL+"/rest/v1/registros_precios";
const INSUMOS=["Pan de hamburguesa grande","Pan de hamburguesa pequeño","Pan de perro grande","Pan de perro pequeño","Queso amarillo rebanado","Jamón rebanado","Queso pecorino","Papas ralladas","Papas naturales","Chorizo","Pollo (pechuga o milanesa)","Carne molida","Ajo","Vinagre","Huevo","Limón","Salchichas","Carne para mechar","Plátano verde","Maíz desgranado","Mozzarella"];
const productos=document.querySelector("#productos"),form=document.querySelector("#priceForm"),establecimiento=document.querySelector("#establecimiento"),toast=document.querySelector("#toast"),submitBtn=form.querySelector('button[type="submit"]');
INSUMOS.forEach((nombre,i)=>{const d=document.createElement("section");d.className="item";d.innerHTML='<h3>'+nombre+'</h3><div class="fields"><input data-i="'+i+'" data-field="presentacion" placeholder="Presentación (ej.: paquete de 20)"><input data-i="'+i+'" data-field="precio" inputmode="decimal" placeholder="Precio"></div>';productos.appendChild(d);});
function showToast(msg){toast.textContent=msg;toast.style.display="block";setTimeout(()=>toast.style.display="none",2800)}
function normalizarPrecio(v){const s=v.trim().replace(/\s/g,"").replace(",",".").replace(/[^0-9.-]/g,"");return s===""?null:Number(s)}
form.addEventListener("submit",async e=>{
 e.preventDefault();const sitio=establecimiento.value.trim();if(!sitio){showToast("Escribe el nombre del establecimiento.");establecimiento.focus();return}
 const filas=INSUMOS.map((nombre,i)=>{const p=document.querySelector('[data-i="'+i+'"][data-field="presentacion"]').value.trim();const pt=document.querySelector('[data-i="'+i+'"][data-field="precio"]').value.trim();return{establecimiento:sitio,insumo:nombre,presentacion:p||null,precio:normalizarPrecio(pt),_usar:!!(p||pt)}}).filter(x=>x._usar).map(({_usar,...x})=>x);
 if(!filas.length){showToast("Completa al menos un producto.");return}if(filas.some(x=>x.precio!==null&&!Number.isFinite(x.precio))){showToast("Revisa los precios ingresados.");return}
 submitBtn.disabled=true;submitBtn.textContent="Guardando…";
 try{const res=await fetch(API,{method:"POST",headers:{"Content-Type":"application/json","apikey":SUPABASE_KEY,"Authorization":"Bearer "+SUPABASE_KEY,"Prefer":"return=minimal"},body:JSON.stringify(filas)});if(!res.ok)throw new Error(await res.text());form.reset();establecimiento.value="";showToast("Guardado: "+filas.length+" producto(s).");window.scrollTo({top:0,behavior:"smooth"});}
 catch(err){console.error(err);showToast("No se pudo guardar. Revisa la conexión e inténtalo otra vez.");}
 finally{submitBtn.disabled=false;submitBtn.textContent="Guardar registro";}
});
