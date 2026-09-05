import { Link } from "react-router-dom";

// Datos de la línea de tiempo; cada posición utiliza su imagen de motor correspondiente.
const milestones = [
  { year: "1954", title: "El comienzo", text: "Nace Vicaria como una marca familiar orientada a resolver necesidades reales del mercado automotor.", image: "/img/historia/vicaria-origenes-automotor.webp", imageWidth: 768, imageHeight: 506, imageAlt: "Motor clásico que representa los comienzos de Vicaria en 1954" },
  { year: "Crecimiento", title: "Muchos kilómetros, más clientes", text: "La marca amplía su llegada a comercios, profesionales y compradores de todo el país, recorriendo millones de kilómetros.", image: "/img/historia/vicaria-crecimiento-automotor.webp", imageWidth: 450, imageHeight: 300, imageAlt: "Detalle de motor que representa el crecimiento de Vicaria" },
  { year: "+70 años", title: "Una fórmula que perdura", text: "Décadas de experiencia permitieron perfeccionar productos confiables y accesibles.", image: "/img/historia/vicaria-experiencia-automotor.webp", imageWidth: 1400, imageHeight: 933, imageAlt: "Motor moderno que representa más de 70 años de experiencia Vicaria" },
  { year: "Hoy", title: "La historia continúa", text: "Vicaria mantiene su esencia y acerca sus soluciones a clientes mayoristas y minoristas.", image: "/img/historia/vicaria-actualidad-automotor.webp", imageWidth: 1400, imageHeight: 933, imageAlt: "Sistema automotor actual acompañado por productos Vicaria" },
];

export const AboutPage = () => (
  <>
    <section className="about-hero">
      <img
        src="/img/historia/vicaria-experiencia-automotor.webp"
        alt="Motor de automóvil que representa la historia de Vicaria"
        width="1400"
        height="933"
        fetchpriority="high"
      />
      <div className="about-hero__veil" />
      <div className="container about-hero__content">
        <h1>Una historia que empezó en <span className="text-yellow-on-dark">1954.</span></h1>
        <p>Más de siete décadas acompañando al mercado automotor con soluciones de calidad, experiencia familiar y precios accesibles.</p>
      </div>
    </section>

    <section className="section">
      <div className="container about-intro">
        <div><h2>Experiencia que se convierte en <span className="marker-highlight">confianza.</span></h2></div>
        <div className="about-intro__copy"><p>Vicaria es una marca familiar dedicada a productos para el sistema de enfriamiento automotor. Desde sus comienzos trabaja para acercar soluciones prácticas sin comprometer la calidad.</p><p>La utilización de materia prima importada y el conocimiento construido durante más de 70 años forman parte de una identidad que continúa evolucionando.</p></div>
      </div>
    </section>

    <section className="section section--soft history-section">
      <div className="container">
        <div className="section-heading"><h2>De <span className="text-red">generación en generación.</span></h2><p>Un recorrido visual por los momentos que definieron la trayectoria de Vicaria.</p></div>
        <div className="timeline">
          {milestones.map((item) => (
            <article className="timeline-item" key={item.year}>
              <div className="timeline-item__image">
                <img src={item.image} alt={item.imageAlt} width={item.imageWidth} height={item.imageHeight} loading="lazy" decoding="async" />
              </div>
              <div className="timeline-item__copy"><span>{item.year}</span><h3>{item.title}</h3><p>{item.text}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="section about-values">
      <div className="container">
        <div className="section-heading"><h2>Calidad, accesibilidad y cercanía.</h2></div>
        <div className="value-grid">
          <article><h3>Calidad</h3><p>Productos desarrollados con materia prima importada y una fórmula perfeccionada con experiencia.</p></article>
          <article><h3>Accesibilidad</h3><p>Soluciones pensadas para ofrecer una relación equilibrada entre rendimiento y precio.</p></article>
          <article><h3>Cercanía</h3><p>Atención directa para compradores particulares, comercios y distribuidores.</p></article>
        </div>
      </div>
    </section>

    <section className="home-final-cta">
      <div className="container home-final-cta__content">
        <div><span>El próximo capítulo</span><h2>Conocé nuestros productos.</h2><p>Elegí la solución indicada y armá tu pedido directamente desde la web.</p></div>
        <Link className="button button--light" to="/productos">Ver productos</Link>
      </div>
    </section>
  </>
);
