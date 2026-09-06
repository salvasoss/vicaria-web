// Contactos habilitados para recibir consultas y pedidos desde la web.
export const WHATSAPP_CONTACTS = [
  {
    id: "carlos",
    name: "Carlos",
    whatsappDisplay: "+54 9 3513 08-4206",
    whatsappNumber: "5493513084206",
  },
  {
    id: "lorena",
    name: "Lorena",
    whatsappDisplay: "+54 9 3515 38-2948",
    whatsappNumber: "5493515382948",
  },
];

// Lorena continúa como contacto predeterminado para el botón circular fijo.
export const BUSINESS = WHATSAPP_CONTACTS.find(
  ({ id }) => id === "lorena"
);

// Permite abrir el mensaje con el contacto elegido.
export const createWhatsAppUrl = (
  message,
  whatsappNumber = BUSINESS.whatsappNumber
) =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
