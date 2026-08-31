// Beneficios e instrucciones compartidos por las tres variedades de Sella Grietas.
const sharedSealantBenefits = [
  "Solución sin desarme de motor.",
  "No obstruye el sistema de enfriamiento.",
  "Solución permanente.",
  "Elaborado con materia prima importada.",
  "Actúa sobre pérdidas en blocks, camisas, tapas de cilindros y radiadores.",
];

const sharedInstructions = [
  "Disolver el producto en un recipiente pequeño.",
  "Desconectar la manguera de entrada directa al motor, donde se encuentra el termostato.",
  "Verter el producto por la manguera para que ingrese directamente al circuito.",
  "Volver a colocar la manguera en su posición original y poner el motor en marcha.",
];

const SEALANT_BOX_PRICE = 93600;
// Una solicitud es mayorista cuando un mismo producto alcanza esta cantidad.
export const WHOLESALE_MIN_BOXES = 10;
const SACHETS_PER_BOX = 24;

// Catálogo central: páginas, carrito y formularios leen estos mismos datos.
// Un precio null queda pendiente y nunca se suma como si fuera $0.
export const products = [
  {
    id: 1,
    category: "Limpieza del sistema",
    name: "Limpia Radiadores",
    subtitle: "Limpieza rápida · Cuida su motor",
    description:
      "Producto para la limpieza del sistema de enfriamiento. Elimina rápidamente óxidos, grasas, barros y otras sustancias contaminantes sin atacar metales, gomas ni plásticos.",
    image: "/img/limpia radiador.jpg",
    price: SEALANT_BOX_PRICE,
    boxContent: "24 unidades",
    benefits: [
      "Ayuda a remover óxidos, grasas y barros.",
      "No ataca metales, gomas ni plásticos.",
      "Limpieza rápida del sistema de enfriamiento.",
      "Formulación sin potasa.",
    ],
    instructions: [
      "Utilizá el producto siguiendo las indicaciones impresas en el envase.",
      "Ante cualquier duda sobre la aplicación, consultanos por WhatsApp antes de usarlo.",
    ],
  },
  {
    id: 2,
    category: "Línea pesada",
    name: "Sella Grietas FK20",
    subtitle: "Especial para camiones y línea pesada",
    description:
      "Solución sin desarme de motor para pérdidas en tapa de cilindro, block, camisas, radiador de calefacción y radiador de motor. Diseñado especialmente para vehículos de línea pesada.",
    image: "/img/sella grietas camiones.jpg",
    price: SEALANT_BOX_PRICE,
    sachetsPerBox: SACHETS_PER_BOX,
    benefits: sharedSealantBenefits,
    instructions: sharedInstructions,
  },
  {
    id: 3,
    category: "Línea Súper",
    name: "Sella Grietas Súper",
    subtitle: "Fórmula Súper Plus Especial",
    description:
      "Solución sin desarme de motor para pérdidas en tapa de cilindro, block, camisas, radiador de calefacción y radiador de motor. No obstruye el sistema de enfriamiento.",
    image: "/img/sella grietas super.jpg",
    price: SEALANT_BOX_PRICE,
    sachetsPerBox: SACHETS_PER_BOX,
    benefits: sharedSealantBenefits,
    instructions: sharedInstructions,
  },
  {
    id: 4,
    category: "Línea tradicional",
    name: "Sella Grietas",
    subtitle: "Tradicional · Ideal para radiadores plásticos",
    description:
      "Solución sin desarme de motor para pérdidas en tapa de cilindro, block, camisas, radiador de calefacción y radiador de motor. Ideal para radiadores plásticos.",
    image: "/img/sella grietas.jpg",
    price: SEALANT_BOX_PRICE,
    sachetsPerBox: SACHETS_PER_BOX,
    benefits: sharedSealantBenefits,
    instructions: sharedInstructions,
  },
];

// Unifica la presentación de sobres y unidades sin duplicar lógica en las páginas.
export const getBoxContent = (product) =>
  product.boxContent || (product.sachetsPerBox ? `${product.sachetsPerBox} sobres` : null);

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

// Formatea precios en pesos argentinos o avisa cuando todavía no fueron definidos.
export const formatPrice = (price) =>
  price === null ? "Precio por caja a confirmar" : currencyFormatter.format(price);
