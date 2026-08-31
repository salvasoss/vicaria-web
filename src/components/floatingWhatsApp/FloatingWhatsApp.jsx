import { createWhatsAppUrl } from "../../config/business";
import "./floatingWhatsApp.scss";

// Mantiene disponible una consulta general a WhatsApp desde cualquier página.
export const FloatingWhatsApp = () => (
  <a
    className="floating-whatsapp"
    href={createWhatsAppUrl("Hola Vicaria, quisiera hacer una consulta.")}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Consultar a Vicaria por WhatsApp"
    title="Consultar por WhatsApp"
  >
    <img src="/img/whatsapp.png" alt="" />
  </a>
);
