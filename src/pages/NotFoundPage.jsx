import { Link } from "react-router-dom";

export const NotFoundPage = () => (
  <section className="section section--soft">
    <div className="container empty-state"><h2>Esta página no existe.</h2><p>Volvé al inicio o explorá el catálogo de productos Vicaria.</p><Link className="button button--red" to="/">Ir al inicio</Link></div>
  </section>
);
