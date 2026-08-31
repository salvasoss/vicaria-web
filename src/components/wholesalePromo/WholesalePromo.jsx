import { Link } from "react-router-dom";
import { formatPrice, WHOLESALE_PROMO } from "../../mock/vicariaProducts";
import "./wholesalePromo.scss";

export const WholesalePromo = ({ compact = false, showCta = true }) => (
  <article className={`wholesale-promo ${compact ? "wholesale-promo--compact" : ""}`}>
    <div className="wholesale-promo__intro">
      <span>Promoción mayorista</span>
      <h2>Comprá 10 cajas.<br /><span className="text-yellow-on-dark">Recibí 14.</span></h2>
      <p>
        Pagás 10 cajas del mismo Sella Grietas y recibís 4 cajas adicionales
        sin cargo. La promoción se aplica por cada grupo completo de 10.
      </p>
      {showCta && <Link className="button button--light" to="/contacto">Solicitar promoción</Link>}
    </div>
    <div className="wholesale-promo__numbers">
      <div className="wholesale-promo__reference"><span>Valor normal · 14 cajas</span><s>{formatPrice(WHOLESALE_PROMO.referenceTotal)}</s></div>
      <div className="wholesale-promo__total"><span>Pagás solamente 10</span><strong>{formatPrice(WHOLESALE_PROMO.paidTotal)}</strong></div>
      <div className="wholesale-promo__discount"><span>Ahorro total</span><strong>{formatPrice(WHOLESALE_PROMO.savings)}</strong></div>
      <div className="wholesale-promo__unit"><strong>{formatPrice(WHOLESALE_PROMO.effectiveDeliveredBoxPrice)}</strong><span>por caja recibida</span></div>
      <p>Recibís 14 cajas de {WHOLESALE_PROMO.sachetsPerBox} sobres cada una. Consultanos si necesitás combinar productos u otra cantidad.</p>
    </div>
  </article>
);
