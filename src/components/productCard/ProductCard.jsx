import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { formatPrice, getBoxContent, getProductPath } from "../../mock/vicariaProducts";
import "./productCard.scss";

export const ProductCard = ({ product }) => {
  // Cada tarjeta comparte el acceso al detalle y permite sumar una caja directamente.
  const { addItem } = useCart();
  // Da una confirmación visual breve en el propio botón, además del toast global.
  const [isAdded, setIsAdded] = useState(false);
  const addedTimeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(addedTimeoutRef.current), []);

  const handleAddToCart = () => {
    addItem(product.id, 1);
    setIsAdded(true);
    clearTimeout(addedTimeoutRef.current);
    addedTimeoutRef.current = setTimeout(() => setIsAdded(false), 260);
  };

  return (
    <article className="product-card">
      <Link className="product-card__image" to={getProductPath(product)} aria-label={`Ver ${product.name}`}>
        <img
          src={product.image}
          alt={product.imageAlt}
          width={product.imageWidth}
          height={product.imageHeight}
          loading="lazy"
          decoding="async"
        />
        <span>{product.category}</span>
      </Link>
      <div className="product-card__body">
        <h3><Link to={getProductPath(product)}>{product.name}</Link></h3>
        <p className="product-card__subtitle">{product.subtitle}</p>
        <div className="product-card__pack">
          <span>Venta mínima: 1 caja</span>
          {getBoxContent(product) && <span>{getBoxContent(product)} por caja</span>}
        </div>
        <p className={`product-card__price ${product.price === null ? "product-card__price--pending" : ""}`}>
          {formatPrice(product.price)}
        </p>
        <div className="product-card__actions">
          <Link className="button button--outline" to={getProductPath(product)}>Ver detalle</Link>
          <button className={`button button--red${isAdded ? " is-added" : ""}`} type="button" onClick={handleAddToCart}>Agregar</button>
        </div>
      </div>
    </article>
  );
};
