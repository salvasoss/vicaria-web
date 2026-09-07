import { Link } from "react-router-dom";
import { Globe, ShieldCheck, Waves, Wrench } from "lucide-react";
import { ProductCard } from "../components/productCard/ProductCard";
import { products } from "../mock/vicariaProducts";

const benefits = [
  { icon: Wrench, title: "Sellado sin desarme", text: "Los Sella Grietas actúan sobre las pérdidas sin necesidad de desarmar el motor." },
  { icon: Waves, title: "Limpieza profunda", text: "El Limpia Radiadores elimina rápidamente óxidos, grasas, residuos y sedimentos acumulados." },
  { icon: ShieldCheck, title: "Cuida los componentes", text: "Su fórmula de limpieza no ataca metales, empaquetaduras, gomas ni tejidos." },
  { icon: Globe, title: "Múltiples aplicaciones", text: "Para pérdidas en tapa de cilindro, block, camisas, radiador de calefacción y radiador del motor." },
];

export const HomePage = () => {
  
  return (
  <>
    <section className="home-hero">
      {/* Reproduce automáticamente el video de fondo en bucle y sin sonido.
       playsInline evita que se abra a pantalla completa en dispositivos móviles. */}
      <video autoPlay loop muted playsInline preload="auto" aria-hidden="true">
        <source src="/videos/videofondo.mp4" type="video/mp4" />
      </video>
      <div className="home-hero__veil" />
      <div className="container home-hero__content">
        <div className="home-hero__copy">
          <h1 className="hero-title">
            <span className="hero-title__stat">
              <span className="hero-title__lead">Más de</span> <span className="marker-highlight">70 años</span>
            </span>{" "}
            <span className="hero-title__line">cuidando el corazón de cada motor.</span>
          </h1>
          <p>
            Soluciones Vicaria para <strong className="hero-keyword">sellar perdidas del motor</strong>{" "} y 
            <strong className="hero-keyword"> mantener limpio el sistema de refrigeración: </strong>{" "}
            calidad, experiencia y rendimiento para compradores {" "}
            <strong className="hero-keyword">minoristas, comercios y distribuidores.</strong>
          </p>
          <div className="hero-actions">
            <Link className="button button--light" to="/productos">Comprar productos <span aria-hidden="true">→</span></Link>
            <Link className="button hero-secondary" to="/contacto">Venta por mayor</Link>
          </div>
          <p className="hero-note">Desde 1954 · Venta mínima de 1 caja · Envíos a todo el país</p>
        </div>
        <div className="hero-products" aria-label="Productos Vicaria">
          {products.map((product, index) => (
            <img
              key={product.id}
              className={`hero-product hero-product--${index + 1}`}
              src={product.image}
              alt={product.imageAlt}
              width={product.imageWidth}
              height={product.imageHeight}
              loading="eager"
              fetchpriority={index === 1 ? "high" : "auto"}
              decoding="async"
            />
          ))}
          <span>Calidad<br /><strong>Vicaria</strong></span>
        </div>
      </div>
    </section>

    <section className="trust-strip" aria-label="Datos destacados de Vicaria">
      <div className="container trust-strip__grid">
        <div><strong>1954</strong><span>El comienzo de nuestra historia</span></div>
        <div><strong>+70 años</strong><span>De experiencia automotriz</span></div>
        <div><strong>Todo el país</strong><span>Envíos nacionales</span></div>
        <div><strong>2 canales</strong><span>Mayorista y minorista</span></div>
      </div>
    </section>

    <section className="section section--soft">
      <div className="container">
        <div className="section-heading">
          <h2> Fórmulas confiables para proteger tu motor.</h2>
          <p>Productos desarrollados para sellar pérdidas y eliminar óxidos, grasas y sedimentos del circuito de refrigeración, sin afectar sus componentes.</p>
        </div>
        <div className="benefit-grid">
          {benefits.map(({ icon: Icon, title, text }) => (
            <article className="benefit-card" key={title}>
              <span className="benefit-card__icon"><Icon aria-hidden="true" strokeWidth={1.75} /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <div className="section-heading products-heading">
          <div>
            <h2>La fórmula indicada para <span className="text-green">cada necesidad.</span></h2>
          </div>
          <Link className="text-link" to="/productos">Ver catálogo completo <span aria-hidden="true">→</span></Link>
        </div>
        <div className="product-grid">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </section>

    <section className="section home-story">
      <div className="container home-story__grid">
        <div className="home-story__image">
          <img
            src="/img/historia/motor-vicaria-trayectoria.webp"
            alt="Motor de automóvil que representa la trayectoria de Vicaria desde 1954"
            width="1400"
            height="933"
            loading="lazy"
            decoding="async"
          />
          <strong>70+</strong>
          <span>años de experiencia</span>
        </div>
        <div>
          <h2>Una <span className="text-yellow-on-dark">marca familiar</span> que creció junto al mercado automotor.</h2>
          <p>Desde 1954, Vicaria desarrolla soluciones prácticas y confiables para sellar pérdidas en componentes del motor y radiadores, además de limpiar y mantener el circuito de refrigeración.</p>
          <p>Hoy continuamos esa trayectoria acercando nuestras soluciones a clientes minoristas, casas de repuestos y distribuidores.</p>
          <Link className="button button--red" to="/acerca">Conocer Vicaria</Link>
        </div>
      </div>
    </section>

    <section className="home-final-cta">
      <div className="container home-final-cta__content">
        <div>
          <span>¿Comprás para tu comercio?</span>
          <h2>Solicitá una propuesta mayorista.</h2>
          <p>Contanos qué productos necesitás y coordinamos cantidades, precios y envío directamente por WhatsApp.</p>
        </div>
        <Link className="button button--light" to="/contacto">Consultar por mayor</Link>
      </div>
    </section>
  </>
  );
};
