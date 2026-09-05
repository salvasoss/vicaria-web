import { expect, test } from "vitest";
import { getSeoForPathname } from "./seo";

test("genera metadatos únicos y canónicos para productos", () => {
  const seo = getSeoForPathname("/productos/2");
  expect(seo.title).toContain("Sella Grietas FK20");
  expect(seo.canonical).toBe("https://vicaria.com.ar/productos/sella-grietas-fk20");
  expect(seo.description).toContain("línea pesada");
  expect(seo.robots).toBe("index, follow");
});

test("evita que el carrito y las páginas inexistentes se indexen", () => {
  expect(getSeoForPathname("/carrito").robots).toBe("noindex, follow");
  expect(getSeoForPathname("/ruta-inexistente").robots).toBe("noindex, follow");
});
