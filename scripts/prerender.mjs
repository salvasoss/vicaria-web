import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { JSDOM } from "jsdom";

const buildDirectory = resolve("build");
const serverDirectory = resolve(".prerender");
const template = await readFile(resolve(buildDirectory, "index.html"), "utf8");
const serverEntry = pathToFileURL(resolve(serverDirectory, "entry-server.js")).href;
const { prerenderRoutes, render } = await import(serverEntry);

const setMeta = (document, selector, attributes) => {
  const element = document.head.querySelector(selector);
  if (!element) throw new Error(`Falta la etiqueta SEO base: ${selector}`);
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
};

// Inserta el contenido y los metadatos correctos dentro del HTML de cada ruta pública.
const renderRoute = async (route) => {
  const { html, seo } = render(route);
  const dom = new JSDOM(template, { url: seo.canonical });
  const { document } = dom.window;

  document.documentElement.lang = "es-AR";
  document.title = seo.title;
  document.getElementById("root").innerHTML = html;
  document.querySelector('link[rel="canonical"]').href = seo.canonical;
  setMeta(document, 'meta[name="description"]', { content: seo.description });
  setMeta(document, 'meta[name="robots"]', { content: seo.robots });
  setMeta(document, 'meta[property="og:type"]', { content: seo.type });
  setMeta(document, 'meta[property="og:title"]', { content: seo.title });
  setMeta(document, 'meta[property="og:description"]', { content: seo.description });
  setMeta(document, 'meta[property="og:url"]', { content: seo.canonical });
  setMeta(document, 'meta[property="og:image"]', { content: seo.image });
  setMeta(document, 'meta[property="og:image:alt"]', { content: seo.imageAlt });
  setMeta(document, 'meta[name="twitter:title"]', { content: seo.title });
  setMeta(document, 'meta[name="twitter:description"]', { content: seo.description });
  setMeta(document, 'meta[name="twitter:image"]', { content: seo.image });
  setMeta(document, 'meta[name="twitter:image:alt"]', { content: seo.imageAlt });

  const outputFile = route === "/"
    ? resolve(buildDirectory, "index.html")
    : resolve(buildDirectory, route.slice(1), "index.html");
  await mkdir(dirname(outputFile), { recursive: true });
  await writeFile(outputFile, dom.serialize());
  dom.window.close();
};

for (const route of prerenderRoutes) await renderRoute(route);
await rm(serverDirectory, { recursive: true, force: true });
console.log(`SEO prerenderizado en ${prerenderRoutes.length} rutas.`);
