import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { AppContent } from "./App";
import { getSeoForPathname } from "./config/seo";
import { getProductPath, products } from "./mock/vicariaProducts";

// Genera HTML real para cada URL pública antes de publicarla en Cloudflare Pages.
export const render = (url) => ({
  html: renderToString(
    <StaticRouter location={url}>
      <AppContent hydrateCartFromStorage={false} />
    </StaticRouter>
  ),
  seo: getSeoForPathname(url),
});

export const prerenderRoutes = [
  "/",
  "/productos",
  ...products.map(getProductPath),
  "/contacto",
  "/acerca",
  "/carrito",
];
