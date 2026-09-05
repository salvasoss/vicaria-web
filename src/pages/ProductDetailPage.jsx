import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { QuantityPicker } from "../components/quantityPicker/QuantityPicker";
import { ProductCard } from "../components/productCard/ProductCard";
import { useCart } from "../context/CartContext";
import { createWhatsAppUrl } from "../config/business";
import {
  formatPrice,
  getBoxContent,
  getProductByRouteParam,
  getProductPath,
  products,
  WHOLESALE_MIN_BOXES,
} from "../mock/vicariaProducts";
import { SITE_ORIGIN } from "../config/seo";

export const ProductDetailPage = () => {
  // Busca el producto indicado por la URL y mantiene localmente la cantidad elegida.
  const { itemId } = useParams();
  const product = getProductByRouteParam(itemId);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  // Da una confirmación visual breve en el propio botón, además del toast global.
  const [isAdded, setIsAdded] = useState(false);
  const addedTimeoutRef = useRef(null);

  useEffect(() => {
    // Al pasar a otro producto relacionado, reinicia el selector en una caja.
    setQuantity(1);
  }, [itemId]);

  useEffect(() => () => clearTimeout(addedTimeoutRef.current), []);

  const handleAddToCart = () => {
    addItem(product.id, quantity);
    setIsAdded(true);
    clearTimeout(addedTimeoutRef.current);
    addedTimeoutRef.current = setTimeout(() => setIsAdded(false), 260);
  };

  if (!product) {
    return (
      <div className="container empty-state">
        <h2>Producto no encontrado</h2>
        <p>El producto que buscás no existe o cambió de dirección.</p>
        <Link className="button button--red" to="/productos">Volver a productos</Link>
      </div>
    );
  }

  // Excluye el producto actual para no repetirlo en la sección de relacionados.
  const relatedProducts = products.filter((item) => item.id !== product.id);

  // Prepara una consulta legible con el producto y la cantidad antes de abrir WhatsApp.
  const whatsappMessage = [
  "Hola, quiero consultar por este producto:",
  "",
  `Producto: ${product.name}`,
  `Cantidad: ${quantity} caja${quantity === 1 ? "" : "s"}`,
 `Precio por caja: ${formatPrice(product.price)} (${getBoxContent(product)} x caja)`,
  "",
  "Quisiera coordinar el pedido y el envío.",
].join("\n");

  return (
    <>
      <nav
        className="detail-breadcrumb container"
        aria-label="Ruta de navegación"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
          <Link itemProp="item" to="/productos"><span itemProp="name">Productos</span></Link>
          <meta itemProp="position" content="1" />
        </span>
        <span aria-hidden="true">/</span>
        <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
          <span itemProp="name">{product.name}</span>
          <meta itemProp="position" content="2" />
        </span>
      </nav>
      <section className="product-detail container" itemScope itemType="https://schema.org/Product">
        <span itemProp="brand" itemScope itemType="https://schema.org/Brand">
          <meta itemProp="name" content="Vicaria" />
        </span>
        <meta itemProp="category" content={product.category} />
        <div className="product-detail__visual">
          <span>{product.category}</span>
          <img
            itemProp="image"
            src={product.image}
            alt={product.imageAlt}
            width={product.imageWidth}
            height={product.imageHeight}
            fetchpriority="high"
            decoding="async"
          />
        </div>
       <div className="product-detail__info">
        <span itemProp="brand" itemScope itemType="https://schema.org/Brand">
          <meta itemProp="name" content="Vicaria" />
        </span>
        <meta itemProp="category" content={product.category} />

        <h1 itemProp="name">{product.name}</h1>
          <h2><span className="text-green">{product.subtitle}</span></h2>
          <p className="product-detail__description" itemProp="description">{product.description}</p>
          <div className="product-detail__price" itemProp="offers" itemScope itemType="https://schema.org/Offer">
            <meta itemProp="priceCurrency" content="ARS" />
            <meta itemProp="price" content={String(product.price)} />
            <meta itemProp="url" content={`${SITE_ORIGIN}${getProductPath(product)}`} />
            <meta itemProp="itemCondition" content="https://schema.org/NewCondition" />
            <div><small>Precio minorista por caja</small><strong>{formatPrice(product.price)}</strong></div>
            <span>Mínimo 1 caja</span>
          </div>
          {getBoxContent(product) && <p className="product-detail__pack">Cada caja contiene <strong>{getBoxContent(product)}</strong> de {product.name}.</p>}
          <QuantityPicker value={quantity} onChange={setQuantity} />
          <div className="product-detail__actions">
            <button className={`button button--red${isAdded ? " is-added" : ""}`} type="button" onClick={handleAddToCart}>Agregar al carrito</button>
            <a className="button button--green" href={createWhatsAppUrl(whatsappMessage)} target="_blank" rel="noopener noreferrer">Pedir por WhatsApp</a>
          </div>
          <div className="product-wholesale-benefits">
            <strong>Compra mayorista desde {WHOLESALE_MIN_BOXES} cajas</strong>
            <p>
              Al pedir {WHOLESALE_MIN_BOXES} cajas de este producto accedés a descuentos por
              volumen, beneficios comerciales y una cotización personalizada.
            </p>
          </div>
          <Link className="button button--outline wholesale-detail-button" to="/contacto">
            ¿Necesitás precio mayorista? Solicitá una cotización →
          </Link>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container detail-columns">
          <article>
            <h2>Beneficios del producto</h2>
            <ul className="check-list">
              {product.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}
            </ul>
          </article>
          <article>
            <h2>Modo de uso</h2>
            <ol className="steps-list">
              {product.instructions.map((instruction, index) => <li key={instruction}><span>{index + 1}</span><p>{instruction}</p></li>)}
            </ol>
          </article>
        </div>
      </section>

      <section className="section related-products">
        <div className="container">
          <div className="section-heading related-products__heading">
            <h2>Productos <span className="text-green">relacionados.</span></h2>
            <p>Conocé los demás productos Vicaria para el sistema de enfriamiento.</p>
          </div>
          <div className="product-grid">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
