import { getProductByRouteParam, getProductPath } from "../mock/vicariaProducts";

export const SITE_ORIGIN = "https://vicaria.com.ar";
const DEFAULT_IMAGE = "/og-vicaria.jpg";

const routeSeo = {
  "/": {
    title: "Vicaria | Sella Grietas y Limpia Radiadores desde 1954",
    description:
      "Productos Vicaria para el sistema de enfriamiento: Sella Grietas y Limpia Radiadores por caja, con envíos a toda Argentina.",
  },
  "/productos": {
    title: "Sella Grietas y Limpia Radiadores | Vicaria",
    description:
      "Conocé los productos Vicaria para cuidar el sistema de enfriamiento: Sella Grietas FK20, Súper, tradicional y Limpia Radiadores.",
  },
  "/contacto": {
    title: "Compra mayorista de productos Vicaria | Cotización",
    description:
      "Solicitá una cotización mayorista de productos Vicaria. Desde 10 cajas de un mismo producto accedés a beneficios por volumen.",
  },
  "/acerca": {
    title: "Vicaria desde 1954 | Historia y trayectoria",
    description:
      "Conocé la historia de Vicaria: más de 70 años desarrollando soluciones accesibles para el sistema de enfriamiento automotor.",
  },
  "/carrito": {
    title: "Carrito de compras | Vicaria",
    description: "Revisá tu pedido de productos Vicaria y coordiná el pago y el envío por WhatsApp.",
    robots: "noindex, follow",
  },
};

const normalizePathname = (pathname = "/") => {
  const cleanPath = pathname.split(/[?#]/, 1)[0].toLowerCase().replace(/\/+$/, "");
  return cleanPath || "/";
};

const absoluteUrl = (path) => new URL(path, SITE_ORIGIN).href;

// Devuelve una ficha SEO única para cada ruta y para cada producto del catálogo.
export const getSeoForPathname = (pathname) => {
  const route = normalizePathname(pathname);
  const productMatch = route.match(/^\/(?:productos|item)\/([^/]+)$/);

  if (productMatch) {
    const product = getProductByRouteParam(decodeURIComponent(productMatch[1]));
    if (product) {
      const path = getProductPath(product);
      return {
        title: `${product.name} por caja | Vicaria`,
        description: `${product.description} Venta por caja y consulta mayorista desde 10 cajas.`,
        canonical: absoluteUrl(path),
        image: absoluteUrl(DEFAULT_IMAGE),
        imageAlt: `Productos Vicaria: ${product.name}`,
        type: "product",
        robots: "index, follow",
      };
    }
  }

  const data = routeSeo[route];
  if (data) {
    return {
      ...data,
      canonical: absoluteUrl(route),
      image: absoluteUrl(DEFAULT_IMAGE),
      imageAlt: "Productos Vicaria para el sistema de enfriamiento automotor",
      type: "website",
      robots: data.robots || "index, follow",
    };
  }

  return {
    title: "Página no encontrada | Vicaria",
    description: "La página solicitada no está disponible.",
    canonical: absoluteUrl(route),
    image: absoluteUrl(DEFAULT_IMAGE),
    imageAlt: "Vicaria",
    type: "website",
    robots: "noindex, follow",
  };
};

const setMeta = (document, selector, attributes) => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.append(element);
  }
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
};

// Actualiza metadatos al navegar dentro de React y también durante el prerender de producción.
export const applySeoToDocument = (document, seo) => {
  document.documentElement.lang = "es-AR";
  document.title = seo.title;

  setMeta(document, 'meta[name="description"]', { name: "description", content: seo.description });
  setMeta(document, 'meta[name="robots"]', { name: "robots", content: seo.robots });
  setMeta(document, 'meta[property="og:type"]', { property: "og:type", content: seo.type });
  setMeta(document, 'meta[property="og:locale"]', { property: "og:locale", content: "es_AR" });
  setMeta(document, 'meta[property="og:site_name"]', { property: "og:site_name", content: "Vicaria" });
  setMeta(document, 'meta[property="og:title"]', { property: "og:title", content: seo.title });
  setMeta(document, 'meta[property="og:description"]', { property: "og:description", content: seo.description });
  setMeta(document, 'meta[property="og:url"]', { property: "og:url", content: seo.canonical });
  setMeta(document, 'meta[property="og:image"]', { property: "og:image", content: seo.image });
  setMeta(document, 'meta[property="og:image:width"]', { property: "og:image:width", content: "1200" });
  setMeta(document, 'meta[property="og:image:height"]', { property: "og:image:height", content: "630" });
  setMeta(document, 'meta[property="og:image:alt"]', { property: "og:image:alt", content: seo.imageAlt });
  setMeta(document, 'meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
  setMeta(document, 'meta[name="twitter:title"]', { name: "twitter:title", content: seo.title });
  setMeta(document, 'meta[name="twitter:description"]', { name: "twitter:description", content: seo.description });
  setMeta(document, 'meta[name="twitter:image"]', { name: "twitter:image", content: seo.image });
  setMeta(document, 'meta[name="twitter:image:alt"]', { name: "twitter:image:alt", content: seo.imageAlt });

  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.append(canonical);
  }
  canonical.href = seo.canonical;
};
