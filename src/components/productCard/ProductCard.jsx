import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { formatPrice, getBoxContent } from "../../mock/vicariaProducts";
import "./productCard.scss";

export const ProductCard = ({ product }) => {
  // Cada tarjeta comparte el acceso al detalle y permite sumar una caja directamente.
  const { addItem } = useCart();

  return (
    <article className="product-card">
      <Link className="product-card__image" to={`/productos/${product.id}`} aria-label={`Ver ${product.name}`}>
        <img src={product.image} alt={`Caja de ${product.name} Vicaria`} loading="lazy" decoding="async" />
        <span>{product.category}</span>
      </Link>
      <div className="product-card__body">
        <p className="product-card__kicker">{product.category}</p>
        <h3><Link to={`/productos/${product.id}`}>{product.name}</Link></h3>
        <p className="product-card__subtitle">{product.subtitle}</p>
        <div className="product-card__pack">
          <span>Venta mínima: 1 caja</span>
          {getBoxContent(product) && <span>{getBoxContent(product)} por caja</span>}
        </div>
        <p className={`product-card__price ${product.price === null ? "product-card__price--pending" : ""}`}>
          {formatPrice(product.price)}
        </p>
        <div className="product-card__actions">
          <Link className="button button--outline" to={`/productos/${product.id}`}>Ver detalle</Link>
          <button className="button button--red" type="button" onClick={() => addItem(product.id, 1)}>Agregar</button>
        </div>
      </div>
    </article>
  );
};
