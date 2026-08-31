# VICARIA

Sitio comercial de Vicaria, marca de productos para el sistema de enfriamiento
automotor fundada en 1954.

## Funcionalidades

- Inicio comercial con productos, beneficios y trayectoria.
- Catálogo con detalle de cada producto.
- Limpia Radiadores y las tres variedades de Sella Grietas.
- Sección de productos relacionados en cada detalle.
- Carrito persistente por caja.
- Formulario de datos personales y envío.
- Pedido completo enviado en un único mensaje de WhatsApp.
- Formulario independiente para solicitudes mayoristas.
- Opción adicional de compra mayorista al alcanzar 10 cajas, sin ocultar el formulario minorista.
- Acceso flotante a WhatsApp disponible en todas las páginas.
- Página de historia de Vicaria.
- Diseño adaptable a celulares, tablets y computadoras.

## Comentarios dentro del código

Las funcionalidades principales incluyen comentarios breves junto a su lógica:
carrito, formularios, WhatsApp, compra mayorista, navegación, animaciones,
catálogo, validaciones y seguridad. Cada explicación ocupa como máximo tres
líneas para orientar la lectura sin recargar los archivos.

## Ejecutar el proyecto

Usá Node.js 24 LTS actualizado (24.15.0 o posterior de la rama 24).
También se admite Node 22 desde 22.22.2. Comprobá tu versión con `node -v`.
Si aparece `EBADENGINE`, actualizá Node antes de instalar; no fuerces la instalación.

```bash
npm ci
npm start
```

Abrí `http://localhost:3000`. El comando ya no abre el navegador automáticamente.
El servidor de desarrollo solo escucha en esta computadora, no en toda la red.

Para comprobar la versión de producción:

```bash
npm run build
```

Para ejecutar las pruebas automáticas:

```bash
npm test
```

Otros controles: `npm run lint`, `npm audit` y `npm run audit:production`.
Para ejecutar pruebas mientras editás, usá `npm run test:watch`.

## Actualizar una instalación anterior

Esta versión elimina archivos y dependencias: combinar carpetas no elimina los
archivos viejos que ya no se utilizan.

1. Detené la web con `Ctrl + C` y guardá una copia de tu código actual.
2. Reemplazá las carpetas `src` y `public` completas por las de este ZIP.
3. Copiá TODO el resto del contenido de este ZIP, incluidas las carpetas `config`
   y `scripts`, las configuraciones de Vite y ESLint y los archivos de la raíz.
   Reemplazá `package.json` y `package-lock.json`. Copiá el contenido, no otra
   carpeta dentro del proyecto.
4. Ejecutá `npm ci` una vez. Este comando reemplaza automáticamente el contenido
   de `node_modules` por las dependencias exactas del archivo de bloqueo nuevo.
   No borra tu código ni crea otra copia del proyecto.
5. Ejecutá `npm start`.

El ZIP no incluye `node_modules`, compilaciones, cachés ni copias antiguas.

## Configuración comercial

El teléfono de WhatsApp se encuentra en:

```text
src/config/business.js
```

Los productos y precios minoristas por caja se encuentran en:

```text
src/mock/vicariaProducts.js
```

Cada producto tiene una propiedad `price`. Los tres Sella Grietas están
configurados en $93.600 por caja. Limpia Radiadores queda con precio a confirmar.
Para publicar o cambiar un precio, se utiliza
un número sin puntos ni símbolo de moneda. Ejemplo:

```js
price: 45000
```

Los precios mayoristas no se publican: se coordinan de manera personalizada por
WhatsApp mediante el formulario de la página Mayoristas.

## Compra mayorista

La compra mayorista requiere un mínimo de 10 cajas de al menos un producto. Una
vez alcanzado ese mínimo, el cliente puede sumar desde 1 caja de cualquiera de
las otras variedades.

Cuando un producto alcanza 10 cajas en el carrito, aparece el botón
`COMPRA MAYORISTA`. Ese acceso abre el formulario mayorista con todos los
productos y sus cantidades ya cargados. Los precios mayoristas se coordinan por
WhatsApp.

## Validaciones de formularios

Las reglas reutilizables se encuentran en `src/config/formValidation.js`.
Incluyen nombres y ubicaciones en texto, CUIT de 11 dígitos, DNI de 7 a 9,
teléfono de 8 a 15, código postal de 4, límites para domicilio y observaciones,
y sanitización automática de los campos exclusivamente numéricos.

## Limpieza y rendimiento

- Eliminados los componentes y estilos heredados que no se importaban, junto
  con sus imágenes, videos y archivos de plantilla sin uso.
- Sustituida la compilación antigua de Create React App por Vite y las pruebas
  de Jest por Vitest. React Router está actualizado y las herramientas de
  desarrollo están separadas de las dependencias de la aplicación.
- Reutilizados los textos comunes del catálogo y el formateador de moneda.
- Carga diferida y decodificación asíncrona de imágenes secundarias. Las fotos
  originales y la paleta se conservan sin modificaciones.
- Video de inicio pausado fuera de pantalla o con la pestaña oculta; no se
  descarga si está activada la preferencia de movimiento reducido.
- Datos y totales del carrito reutilizados entre renderizados. Cerrar el aviso
  de éxito ya no vuelve a renderizar los consumidores del carrito.
- Recuperación segura de carritos guardados con productos eliminados, datos
  inválidos o duplicados. El pedido también funciona si el navegador bloquea
  el almacenamiento local (en ese caso no se conserva al recargar).
- Pruebas para las rutas, cantidades, persistencia, formularios y mensajes de
  WhatsApp. Las pruebas no envían pedidos reales.

## Seguridad y publicación

La aplicación sigue siendo React, con la misma paleta y funcionamiento comercial.
Ahora utiliza Vite; `src/main.jsx` es el punto de entrada y `index.html` está en
la raíz. Los archivos `.js` antiguos de entrada fueron retirados.

El ZIP es código fuente. Publicá únicamente la carpeta `build` generada por
`npm run build`; nunca uses `npm start` como servidor público. El hosting debe
servir la web por HTTPS y dirigir las rutas de la aplicación a `index.html`.

La compilación incluye una política de seguridad de contenido (CSP) y un archivo
`_headers` para alojamientos compatibles. Si tu hosting no interpreta `_headers`,
deberás configurar esas cabeceras en su panel. Revisá `SECURITY.md` antes de publicar.

Los scripts automáticos de instalación de dependencias están desactivados para
este proyecto. No uses `npm audit fix --force` ni apruebes scripts desconocidos.
La instalación, las pruebas y la compilación fueron comprobadas sin habilitarlos.

Los formularios no guardan datos personales en el almacenamiento de la aplicación.
Solo se guardan identificadores de productos y cantidades del carrito. Al continuar
con un pedido, los datos se incluyen en un enlace de WhatsApp para preparar el
mensaje. El cliente todavía debe enviarlo y Vicaria confirmar precio, pago y entrega.
