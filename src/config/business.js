// Datos centrales de contacto: al cambiarlos acá se actualizan todos los accesos a WhatsApp.
export const BUSINESS = {
  whatsappDisplay: "+54 9 3515 38-2948",
  whatsappNumber: "5493515382948",
};

// Codifica el mensaje para que textos, saltos de línea y símbolos no alteren la URL.
export const createWhatsAppUrl = (message) =>
  `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(message)}`;
