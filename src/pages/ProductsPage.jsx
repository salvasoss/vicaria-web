import { Link } from "react-router-dom";
import { ProductCard } from "../components/productCard/ProductCard";
import { products } from "../mock/vicariaProducts";

// Renderiza el catálogo desde la fuente central para que tarjetas y precios sean consistentes.
export const ProductsPage = () => (
  <>
    <section className="page-hero">
      <div className="container">
        <h1 className="page-title"><span className="text-yellow-on-dark">Productos</span> Vicaria</h1>
        <p className="page-intro">Elegí la solución indicada, agregá las cajas que necesites y enviá <strong className="text-yellow-on-dark">todo tu pedido por WhatsApp</strong>. Compra mínima: una caja por producto.</p>
      </div>
    </section>
    <section className="section products-page">
      <div className="container">
        <div className="catalog-note">
          <span className="status-pill">Venta minorista por caja</span>
          <p>¿Necesitás volumen para reventa? <Link to="/contacto">Consultá precios mayoristas.</Link></p>
        </div>
        <div className="product-grid">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </section>
  </>
);
