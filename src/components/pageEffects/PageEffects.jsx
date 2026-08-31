import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const titles = {
  "/": "Vicaria | Sella Grietas desde 1954",
  "/productos": "Productos | Vicaria",
  "/contacto": "Compras mayoristas | Vicaria",
  "/acerca": "Nuestra historia | Vicaria",
  "/carrito": "Carrito | Vicaria",
};

export const PageEffects = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Al cambiar de página vuelve arriba, actualiza el título y prepara animaciones de entrada.
    window.scrollTo({ top: 0, behavior: "auto" });
    const route = pathname.toLowerCase();
    document.title = route.startsWith("/productos/") || route.startsWith("/item/")
      ? "Detalle del producto | Vicaria"
      : titles[route] || "Vicaria";

    const reduceMotion = typeof window.matchMedia === "function"
      && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const requestFrame = window.requestAnimationFrame
      || ((callback) => window.setTimeout(callback, 0));
    const cancelFrame = window.cancelAnimationFrame || window.clearTimeout;
    let observer;
    const frame = requestFrame(() => {
      // IntersectionObserver anima solo los bloques visibles y respeta movimiento reducido.
      const elements = document.querySelectorAll(
        "main section, .product-card, .benefit-card, .timeline-item"
      );

      if (reduceMotion || !("IntersectionObserver" in window)) {
        elements.forEach((element) => element.classList.add("is-visible"));
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -35px" }
      );

      elements.forEach((element) => {
        element.classList.add("reveal-on-scroll");
        observer.observe(element);
      });
    });

    return () => {
      cancelFrame(frame);
      observer?.disconnect();
    };
  }, [pathname]);

  return null;
};
