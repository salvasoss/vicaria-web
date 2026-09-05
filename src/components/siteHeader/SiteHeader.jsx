import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./siteHeader.scss";

const navItems = [
  ["/", "Inicio"],
  ["/productos", "Productos"],
  ["/contacto", "Mayoristas"],
  ["/acerca", "Acerca de Vicaria"],
];

export const SiteHeader = () => {
  // Controla el menú móvil y muestra la cantidad total de cajas del carrito.
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { itemCount } = useCart();

  useEffect(() => {
    // Detecta el cambio entre escritorio y móvil para ocultar enlaces cerrados del teclado.
    if (typeof window.matchMedia !== "function") return undefined;
    const mediaQuery = window.matchMedia("(max-width: 1050px)");
    const updateViewport = (event) => {
      setIsMobile(event.matches);
      if (!event.matches) setOpen(false);
    };
    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener?.("change", updateViewport);
    return () => mediaQuery.removeEventListener?.("change", updateViewport);
  }, []);

  useEffect(() => {
    // Permite cerrar el menú móvil con Escape y elimina el evento al desmontar.
    if (!open) return undefined;
    const closeWithEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeWithEscape);
    return () => window.removeEventListener("keydown", closeWithEscape);
  }, [open]);

  return (
    <header className="site-header">
      <div className="announcement">Envíos a todo el país · Venta mínima: 1 caja</div>
      <div className="nav-wrap">
        <NavLink className="brand" to="/" onClick={() => setOpen(false)} aria-label="Vicaria, ir al inicio">
          <img src="/img/logo-vicaria.png" alt="Vicaria" width="1707" height="605" />
        </NavLink>

        <button
          type="button"
          className={`menu-button ${open ? "menu-button--open" : ""}`}
          aria-expanded={open}
          aria-controls="main-navigation"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          id="main-navigation"
          className={`main-nav ${open ? "main-nav--open" : ""}`}
          aria-label="Navegación principal"
          aria-hidden={isMobile && !open ? "true" : undefined}
          inert={isMobile && !open ? "" : undefined}
        >
          {navItems.map(([path, label]) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              className={({ isActive }) => `nav-link ${isActive ? "nav-link--active" : ""}`}
              onClick={() => setOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <NavLink className="cart-link" to="/carrito" onClick={() => setOpen(false)} aria-label={`Carrito, ${itemCount} cajas`}>
          <svg className="cart-link__icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 4h2l2.1 9.1a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 7H6" />
            <circle cx="9" cy="19" r="1.5" />
            <circle cx="18" cy="19" r="1.5" />
          </svg>
          <span>Carrito</span>
          <strong>{itemCount}</strong>
        </NavLink>
      </div>
    </header>
  );
};
