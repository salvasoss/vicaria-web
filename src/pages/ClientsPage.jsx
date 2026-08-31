import { Link } from "react-router-dom";

const clientTypes = [
  ["CR", "Casas de repuestos", "Productos para sumar a una oferta confiable de soluciones automotrices."],
  ["DI", "Distribuidores", "Una marca con trayectoria para abastecer distintos puntos de venta."],
  ["TM", "Talleres mecánicos", "Soluciones prácticas para profesionales que trabajan todos los días con motores."],
  ["LU", "Lubricentros", "Productos complementarios para el mantenimiento del sistema de enfriamiento."],
];

export const ClientsPage = () => (
  <>
    <section className="page-hero clients-hero">
      <div className="container">
        <span className="eyebrow">Clientes Vicaria</span>
        <h1 className="page-title">Confianza construida<br /><span className="text-yellow-on-dark">a través del tiempo.</span></h1>
        <p className="page-intro">Acompañamos a comercios, distribuidores y profesionales del rubro automotor con productos de calidad y atención directa.</p>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <div className="section-heading"><span className="eyebrow">Una red diversa</span><h2>Soluciones para quienes <span className="text-red">mueven el mercado automotor.</span></h2><p>Vicaria llega a distintos tipos de clientes, desde compradores particulares hasta canales de reventa.</p></div>
        <div className="client-type-grid">
          {clientTypes.map(([initials, title, text]) => (
            <article key={title} className="client-type-card">
              <div className="client-mark" aria-hidden="true">{initials}</div>
              <h2>{title}</h2>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="section section--soft">
      <div className="container confidence-grid">
        <div className="confidence-photo"><img src="/img/motor 6.jpg" alt="Profesional trabajando en un motor" loading="lazy" decoding="async" /><div><strong>+70</strong><span>años de trayectoria</span></div></div>
        <div className="confidence-copy">
          <span className="eyebrow">Respaldo Vicaria</span>
          <h2>Una relación que no termina con la compra.</h2>
          <p>Nuestro objetivo es ofrecer una experiencia clara: información precisa, contacto directo y coordinación personalizada para cada pedido.</p>
          <ul className="check-list"><li>Atención para mayoristas y minoristas.</li><li>Envíos a todo el territorio nacional.</li><li>Asesoramiento directo antes de confirmar.</li><li>Calidad respaldada por décadas de experiencia.</li></ul>
        </div>
      </div>
    </section>

    <section className="client-cta">
      <div className="container"><div><span>Sumate a nuestra red</span><h2>¿Querés distribuir productos Vicaria?</h2></div><Link className="button button--light" to="/contacto">Solicitar cotización</Link></div>
    </section>
  </>
);
