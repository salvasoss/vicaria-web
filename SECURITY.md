# Seguridad de VICARIA

## Resultado de esta revisión

Fecha: 31 de agosto de 2026. Comprobado con Node 24.19.0 y npm 11.9.0 en Linux.

- `npm audit`: 0 vulnerabilidades conocidas, incluyendo herramientas de desarrollo.
- `npm run audit:production`: 0 vulnerabilidades conocidas.
- 53 pruebas automatizadas de formularios, carrito, rutas y controles de seguridad.
- Compilación y análisis estático sin errores.
- Instalación reproducible con `npm ci` y scripts de instalación desactivados.

Estos resultados corresponden al código y al archivo `package-lock.json`
entregados. No son una garantía absoluta ni una auditoría del servidor publicado:
pueden aparecer vulnerabilidades nuevas después de esta fecha. No se realizó
una prueba de penetración ni una inspección visual en navegador en esta revisión.
Las pruebas de WhatsApp simulan la apertura; no envían pedidos reales.

## Cambios aplicados

Se retiraron `react-scripts` y su cadena de compilación antigua. Se utiliza Vite
8.2.2, Vitest 4.1.11, React Router 7.18.3 y herramientas compatibles actualizadas.
React sigue en 18.3.1. Las versiones directas y el archivo de bloqueo están fijados.
No se utilizó `npm audit fix --force` ni se omitieron dependencias para obtener
el resultado de la auditoría completa.

El archivo de configuración del proyecto desactiva los scripts automáticos de
instalación. No es necesario aprobar los antiguos scripts de `core-js`: esos
paquetes ya no forman parte de esta versión. Si una actualización futura exige
un script, revisá su procedencia y necesidad antes de habilitarlo.

En producción, la política CSP admite scripts y estilos del propio sitio,
bloquea objetos incrustados y envíos HTML de formularios y no autoriza código
inline ni `eval`. Los formularios de VICARIA preparan enlaces a WhatsApp con
JavaScript; no realizan envíos HTML. La CSP se agrega al compilar, no durante el
desarrollo, donde Vite requiere mecanismos distintos.

También se genera `build/_headers` con CSP, bloqueo de inclusión en marcos,
`nosniff`, restricción de permisos de cámara/micrófono/ubicación y una política
que no envía el referente. El generador está en `config/security.js`.

Los enlaces externos no reciben acceso a la ventana de origen. El destino de
WhatsApp está fijado en el código y el mensaje se codifica como texto. No hay
renderizado de HTML recibido de los formularios. Se comprueban cantidades,
campos obligatorios y longitudes, incluidos valores formados solo por espacios.

## Datos personales y pedidos

La aplicación no persiste nombres, DNI, CUIT, teléfonos ni domicilios. El carrito
local conserva solamente productos y cantidades; sus precios se reconstruyen
desde el catálogo, ignorando propiedades adicionales del almacenamiento.

Al pulsar continuar, los datos del formulario se comparten con WhatsApp mediante
un enlace para preparar el mensaje. El navegador, WhatsApp y el dispositivo
pueden conservar historiales o autocompletado: la web no controla esos sistemas.

Este sitio no tiene servidor de pedidos, autenticación ni pasarela de pago.
Las validaciones del navegador evitan errores de carga, pero no impiden que una
persona modifique su navegador o el mensaje de WhatsApp. **Vicaria debe confirmar
productos, precios, cantidades, pago y destinatario antes de despachar.** Si se
agregan cobros o pedidos automáticos, deberán validarse y recalcularse en un
servidor confiable; nunca confiar en totales enviados por el navegador.

## Antes de publicar

1. Ejecutá `npm ci`, `npm test`, `npm run build` y `npm audit`.
2. Publicá solo `build`. No expongas el servidor de desarrollo, el proyecto
   completo, `node_modules`, archivos de entorno ni credenciales.
3. Activá HTTPS y redirección de HTTP a HTTPS en tu dominio.
4. Configurá el fallback de las rutas de la aplicación a `index.html` y tipos
   MIME correctos para JavaScript, CSS, imágenes y videos.
5. Comprobá las cabeceras HTTP reales. `_headers` funciona en hosts compatibles,
   como Cloudflare Pages; otros requieren configuración propia. La CSP del HTML
   no reemplaza todas las cabeceras: `frame-ancestors`, por ejemplo, debe enviarse
   por HTTP. No afirmamos que estas cabeceras estén aplicadas en tu hosting.
6. Configurá HSTS únicamente después de comprobar HTTPS y el alcance de tus
   subdominios. No se habilitó automáticamente porque todavía no se verificó
   tu dominio.
7. Usá contraseñas únicas y segundo factor en las cuentas de hosting, dominio,
   repositorio y WhatsApp. Guardá una copia recuperable del proyecto.

No introduzcas secretos en variables `VITE_*`: su contenido puede terminar en
el JavaScript público. Revisá cualquier integración nueva antes de ampliar la
CSP, especialmente analítica, fuentes, formularios o scripts externos.

## Mantenimiento

Volvé a ejecutar `npm audit` regularmente y antes de publicar cambios. Actualizá
dependencias de forma revisada, repetí pruebas y compilación y conservá una
copia de la versión anterior. No ignores alertas críticas ni fuerces cambios
principales sin comprobar su compatibilidad.

Referencias oficiales:

- [Retiro de Create React App](https://react.dev/blog/2025/02/14/sunsetting-create-react-app)
- [Corrección de redirecciones en React Router](https://github.com/remix-run/react-router/security/advisories/GHSA-wrjc-x8rr-h8h6)
- [Auditoría de npm](https://docs.npmjs.com/cli/v12/commands/npm-audit/)
- [Política CSP y limitaciones](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy)
- [Cabeceras en Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/headers/)
