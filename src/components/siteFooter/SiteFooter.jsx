import { Link } from "react-router-dom";
import { BUSINESS, createWhatsAppUrl } from "../../config/business";
import { SITE_ORIGIN } from "../../config/seo";
import "./siteFooter.scss";

export const SiteFooter = () => (
  <footer className="site-footer" itemScope itemType="https://schema.org/Organization">
    <meta itemProp="name" content="Vicaria" />
    <meta itemProp="url" content={SITE_ORIGIN} />
    <div className="container footer-grid">
      <div className="footer-brand">
        <img itemProp="logo" src="/img/logo-vicaria.png" alt="Logo de Vicaria" width="1707" height="605" loading="lazy" decoding="async" />
        <p>Soluciones para el sistema de enfriamiento automotor desde 1954.</p>
      </div>
      <div>
        <h2>Explorá</h2>
        <Link to="/productos">Productos</Link>
        <Link to="/acerca">Nuestra historia</Link>
      </div>
      <div>
        <h2>Comprá</h2>
        <Link to="/carrito">Pedido minorista</Link>
        <Link to="/contacto">Consulta mayorista</Link>
        <a href={createWhatsAppUrl("Hola, quisiera hacer una consulta.")} target="_blank" rel="noopener noreferrer">WhatsApp</a>
      </div>
      <div>
        <h2>Contacto</h2>
        <p itemProp="contactPoint" itemScope itemType="https://schema.org/ContactPoint">
          <meta itemProp="telephone" content={`+${BUSINESS.whatsappNumber}`} />
          <meta itemProp="contactType" content="ventas" />
          {BUSINESS.whatsappDisplay}
        </p>
        <p>Envíos a todo el país</p>
        <p>Venta mínima: 1 caja</p>
      </div>
    </div>
    <div className="footer-bottom">
      <div className="container footer-bottom__content">
        <span>© {new Date().getFullYear()} Vicaria · Industria y trayectoria argentina</span>
        <span className="footer-credits">
          Desarrollado por
          <a href="https://www.instagram.com/linkealo.arg" target="_blank" rel="noopener noreferrer">LINKEALO</a>
          <span aria-hidden="true">·</span>
          <a href="https://www.trwebstudio.website/" target="_blank" rel="noopener noreferrer">TR_WEB_STUDIO</a>
        </span>
      </div>
    </div>
  </footer>
);
