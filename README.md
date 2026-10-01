# Levantamiento_precios

Mini aplicación móvil para levantar precios de insumos en distintos establecimientos.

## V1
- Nombre del establecimiento.
- 21 insumos precargados.
- Presentación y precio opcionales por insumo.
- Se pueden omitir productos no encontrados.
- Fecha y hora automáticas.
- Guardado local en el dispositivo.
- Exportación CSV.

## Importante
La V1 permite probar el flujo inmediatamente, pero **localStorage no sincroniza datos entre dispositivos**. El siguiente paso es conectar una base de datos (por ejemplo Supabase) para que una persona cargue desde su teléfono y otra pueda consultar los registros.

## Archivos
- `index.html`: interfaz.
- `styles.css`: diseño responsive.
- `app.js`: formulario, almacenamiento local y exportación.
