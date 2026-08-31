import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { QuantityPicker } from "../components/quantityPicker/QuantityPicker";
import { ProductCard } from "../components/productCard/ProductCard";
import { useCart } from "../context/CartContext";
import { createWhatsAppUrl } from "../config/business";
import { formatPrice, getBoxContent, products } from "../mock/vicariaProducts";

export const ProductDetailPage = () => {
  // Busca el producto indicado por la URL y mantiene localmente la cantidad elegida.
  const { itemId } = useParams();
  const product = products.find((item) => item.id === Number(itemId));
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    // Al pasar a otro producto relacionado, reinicia el selector en una caja.
    setQuantity(1);
  }, [itemId]);

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
    "Hola Vicaria, quiero consultar por este producto:",
    "",
    `Producto: ${product.name}`,
    `Cantidad: ${quantity} caja${quantity === 1 ? "" : "s"}`,
    `Precio por caja: ${formatPrice(product.price)}`,
    getBoxContent(product) ? `Contenido: ${getBoxContent(product)} por caja` : null,
    "",
    "Quisiera coordinar el pedido y el envío.",
  ].filter(Boolean).join("\n");

  return (
    <>
      <div className="detail-breadcrumb container">
        <Link to="/productos">Productos</Link><span aria-hidden="true">/</span><span>{product.name}</span>
      </div>
      <section className="product-detail container">
        <div className="product-detail__visual">
          <span>{product.category}</span>
          <img src={product.image} alt={`Caja de ${product.name} Vicaria`} />
        </div>
        <div className="product-detail__info">
          <span className="eyebrow">Venta por caja</span>
          <h1>{product.name}</h1>
          <h2><span className="text-green">{product.subtitle}</span></h2>
          <p className="product-detail__description">{product.description}</p>
          <div className="product-detail__price">
            <div><small>Precio minorista por caja</small><strong>{formatPrice(product.price)}</strong></div>
            <span>Mínimo 1 caja</span>
          </div>
          {getBoxContent(product) && <p className="product-detail__pack">Cada caja contiene <strong>{getBoxContent(product)}</strong> de {product.name}.</p>}
          <QuantityPicker value={quantity} onChange={setQuantity} />
          <div className="product-detail__actions">
            <button className="button button--red" type="button" onClick={() => addItem(product.id, quantity)}>Agregar al carrito</button>
            <a className="button button--green" href={createWhatsAppUrl(whatsappMessage)} target="_blank" rel="noopener noreferrer">Pedir por WhatsApp</a>
          </div>
          <Link className="button button--outline wholesale-detail-button" to="/contacto">
            ¿Necesitás precio mayorista? Solicitá una cotización →
          </Link>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container detail-columns">
          <article>
            <span className="eyebrow">Ventajas</span>
            <h2>Beneficios del producto</h2>
            <ul className="check-list">
              {product.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}
            </ul>
          </article>
          <article>
            <span className="eyebrow">Aplicación</span>
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
            <span className="eyebrow">También te puede interesar</span>
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
