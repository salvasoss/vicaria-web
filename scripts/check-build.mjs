import assert from "node:assert/strict";
import { readFile, readdir, access } from "node:fs/promises";
import { resolve, relative } from "node:path";
import { JSDOM } from "jsdom";
import { CONTENT_SECURITY_POLICY, renderHeadersFile } from "../config/security.js";

// Esta verificación falla la compilación si faltan protecciones o aparecen archivos privados.
const buildDirectory = resolve("build");
const html = await readFile(resolve(buildDirectory, "index.html"), "utf8");
const { window } = new JSDOM(html);
const document = window.document;

assert.equal(
  document.querySelector('meta[http-equiv="Content-Security-Policy"]')?.content,
  CONTENT_SECURITY_POLICY,
  "Falta la política de seguridad de producción."
);
assert.equal(document.querySelector('meta[name="referrer"]')?.content, "no-referrer");
assert.ok(document.querySelectorAll("script[src]").length > 0, "Falta el código compilado.");
assert.ok(document.getElementById("root")?.textContent.trim().length > 300, "Falta contenido prerenderizado.");
assert.equal(document.querySelector('link[rel="canonical"]')?.href, "https://vicaria.com.ar/");
assert.equal(document.querySelector('meta[property="og:image"]')?.content, "https://vicaria.com.ar/og-vicaria.jpg");

// La CSP no permite estilos ni eventos inline, por eso se comprueba todo el HTML generado.
for (const element of document.querySelectorAll("*")) {
  assert.ok(!element.hasAttribute("style"), "La política no permite estilos inline.");
  for (const attribute of element.attributes) {
    assert.ok(!/^on/i.test(attribute.name), "No se permiten eventos inline.");
  }
}

for (const script of document.querySelectorAll("script")) {
  assert.equal(script.textContent.trim(), "", "No se permiten scripts inline.");
}

// Exige scripts locales y permite únicamente los enlaces de fuentes autorizados por la CSP.
const localOrigin = "https://vicaria.invalid";
const allowedExternalLinks = new Map([
  ["https://fonts.googleapis.com", new Set(["preconnect", "stylesheet"])],
  ["https://fonts.gstatic.com", new Set(["preconnect"])],
]);

for (const element of document.querySelectorAll("script[src], link[href]")) {
  const asset = element.getAttribute("src") || element.getAttribute("href");
  const url = new URL(asset, `${localOrigin}/`);

  if (element.matches('link[rel="canonical"]')) {
    assert.equal(url.origin, "https://vicaria.com.ar", "La URL canonical usa un dominio incorrecto.");
    continue;
  }

  if (url.origin !== localOrigin) {
    const allowedRelations = allowedExternalLinks.get(url.origin);
    assert.ok(
      element.tagName === "LINK" && allowedRelations?.has(element.rel),
      "La compilación contiene un recurso externo no autorizado."
    );
    continue;
  }

  const file = resolve(buildDirectory, `.${decodeURIComponent(url.pathname)}`);
  assert.ok(!relative(buildDirectory, file).startsWith(".."), "Ruta de recurso inválida.");
  await access(file);
}

assert.equal(await readFile(resolve(buildDirectory, "_headers"), "utf8"), renderHeadersFile());

// Comprueba que cada URL importante tiene HTML, título, descripción y canonical propios.
const seoRoutes = [
  ["productos/index.html", "Sella Grietas y Limpia Radiadores | Vicaria", "https://vicaria.com.ar/productos"],
  ["productos/limpia-radiadores/index.html", "Limpia Radiadores por caja | Vicaria", "https://vicaria.com.ar/productos/limpia-radiadores"],
  ["productos/sella-grietas-fk20/index.html", "Sella Grietas FK20 por caja | Vicaria", "https://vicaria.com.ar/productos/sella-grietas-fk20"],
  ["productos/sella-grietas-super/index.html", "Sella Grietas Súper por caja | Vicaria", "https://vicaria.com.ar/productos/sella-grietas-super"],
  ["productos/sella-grietas-tradicional/index.html", "Sella Grietas por caja | Vicaria", "https://vicaria.com.ar/productos/sella-grietas-tradicional"],
  ["contacto/index.html", "Compra mayorista de productos Vicaria | Cotización", "https://vicaria.com.ar/contacto"],
  ["acerca/index.html", "Vicaria desde 1954 | Historia y trayectoria", "https://vicaria.com.ar/acerca"],
  ["carrito/index.html", "Carrito de compras | Vicaria", "https://vicaria.com.ar/carrito"],
];

for (const [fileName, expectedTitle, expectedCanonical] of seoRoutes) {
  const routeHtml = await readFile(resolve(buildDirectory, fileName), "utf8");
  const routeDom = new JSDOM(routeHtml);
  const routeDocument = routeDom.window.document;
  assert.equal(routeDocument.title, expectedTitle, `Título incorrecto en ${fileName}.`);
  assert.equal(routeDocument.querySelector('link[rel="canonical"]')?.href, expectedCanonical);
  assert.ok(routeDocument.querySelector('meta[name="description"]')?.content.length > 70);
  assert.ok(routeDocument.querySelector("main h1"), `Falta H1 en ${fileName}.`);
  assert.ok(routeDocument.getElementById("root")?.textContent.trim().length > 150);

  for (const image of routeDocument.querySelectorAll("img[src]")) {
    assert.ok(image.hasAttribute("alt"), `Falta alt en una imagen de ${fileName}.`);
    assert.ok(image.hasAttribute("width") && image.hasAttribute("height"), `Faltan dimensiones de imagen en ${fileName}.`);
    const imageUrl = new URL(image.getAttribute("src"), `${localOrigin}/`);
    await access(resolve(buildDirectory, `.${decodeURIComponent(imageUrl.pathname)}`));
  }

  if (fileName.startsWith("productos/") && fileName !== "productos/index.html") {
    assert.ok(routeDocument.querySelector('[itemtype="https://schema.org/Product"]'), `Faltan datos de producto en ${fileName}.`);
  }
  routeDom.window.close();
}

const sitemap = await readFile(resolve(buildDirectory, "sitemap.xml"), "utf8");
assert.ok(sitemap.includes("https://vicaria.com.ar/productos/sella-grietas-fk20"));
assert.ok(!sitemap.includes("/carrito"), "El carrito no debe estar en el sitemap.");
assert.ok((await readFile(resolve(buildDirectory, "robots.txt"), "utf8")).includes("Sitemap: https://vicaria.com.ar/sitemap.xml"));
await access(resolve(buildDirectory, "og-vicaria.jpg"));
await access(resolve(buildDirectory, "_redirects"));

// Evita publicar dependencias, código fuente, variables de entorno o mapas de desarrollo.
const files = await readdir(buildDirectory, { recursive: true });
assert.ok(!files.some((file) => /(^|[/\\])(node_modules|src|\.env[^/\\]*)([/\\]|$)|\.map$/.test(file)),
  "No deben publicarse código fuente, dependencias, secretos ni mapas de código.");
const lock = JSON.parse(await readFile("package-lock.json", "utf8"));
assert.ok(!lock.packages["node_modules/react-scripts"], "No debe reinstalarse Create React App.");

window.close();
console.log("Producción verificada: SEO por ruta, recursos, CSP, cabeceras y archivos públicos.");
