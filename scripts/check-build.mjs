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

// Confirma que scripts y estilos sean locales y que cada archivo referenciado exista.
for (const element of document.querySelectorAll("script[src], link[href]")) {
  const asset = element.getAttribute("src") || element.getAttribute("href");
  const url = new URL(asset, "https://vicaria.invalid/");
  assert.equal(url.origin, "https://vicaria.invalid", "La compilación debe usar recursos propios.");
  const file = resolve(buildDirectory, `.${decodeURIComponent(url.pathname)}`);
  assert.ok(!relative(buildDirectory, file).startsWith(".."), "Ruta de recurso inválida.");
  await access(file);
}

assert.equal(await readFile(resolve(buildDirectory, "_headers"), "utf8"), renderHeadersFile());

// Evita publicar dependencias, código fuente, variables de entorno o mapas de desarrollo.
const files = await readdir(buildDirectory, { recursive: true });
assert.ok(!files.some((file) => /(^|[/\\])(node_modules|src|\.env[^/\\]*)([/\\]|$)|\.map$/.test(file)),
  "No deben publicarse código fuente, dependencias, secretos ni mapas de código.");
const lock = JSON.parse(await readFile("package-lock.json", "utf8"));
assert.ok(!lock.packages["node_modules/react-scripts"], "No debe reinstalarse Create React App.");

window.close();
console.log("Producción verificada: recursos locales, CSP, cabeceras y ausencia de archivos de desarrollo.");
