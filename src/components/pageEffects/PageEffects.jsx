import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { applySeoToDocument, getSeoForPathname } from "../../config/seo";

export const PageEffects = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Al cambiar de página vuelve arriba, actualiza el SEO y prepara animaciones de entrada.
    window.scrollTo({ top: 0, behavior: "auto" });
    applySeoToDocument(document, getSeoForPathname(pathname));

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

      // Escalona la aparición de tarjetas dentro de una misma grilla (hasta 6 pasos de 45ms).
      // El índice se reinicia por contenedor padre: cada grilla (productos, beneficios, línea de tiempo) empieza en 0.
      const staggerIndexByParent = new Map();

      elements.forEach((element) => {
        element.classList.add("reveal-on-scroll");
        if (element.matches(".product-card, .benefit-card, .timeline-item")) {
          const parent = element.parentElement;
          const index = staggerIndexByParent.get(parent) ?? 0;
          element.style.transitionDelay = `${Math.min(index, 6) * 45}ms`;
          staggerIndexByParent.set(parent, index + 1);
        }
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
