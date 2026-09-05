// Beneficios e instrucciones compartidos por las tres variedades de Sella Grietas.
const sharedSealantBenefits = [
  "Solución sin desarme de motor.",
  "No obstruye el sistema de enfriamiento.",
  "Solución permanente.",
  "Elaborado con materia prima importada.",
  "Actúa sobre pérdidas en blocks, camisas, tapas de cilindros y radiadores.",
];

const sharedInstructions = [
  "Si la perdida es en el block, tapa de cilindros o camisas, disolver el producto en un recipiente pequeño.",
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
    slug: "limpia-radiadores",
    category: "Limpieza del sistema",
    name: "Limpia Radiadores",
    subtitle: "Limpieza rápida · Cuida su motor",
    description:
      "Producto para la limpieza del sistema de enfriamiento. Elimina rápidamente óxidos, grasas, barros y otras sustancias contaminantes sin atacar metales, gomas ni plásticos.",
    image: "/img/productos/limpia-radiadores-vicaria.webp",
    imageWidth: 576,
    imageHeight: 1446,
    imageAlt: "Caja de Limpia Radiadores Vicaria para el sistema de enfriamiento",
    price: SEALANT_BOX_PRICE,
    boxContent: "24 unidades",
    benefits: [
      "Ayuda a remover óxidos, grasas y barros.",
      "No ataca metales, gomas ni plásticos.",
      "Limpieza rápida del sistema de enfriamiento.",
      "Formulación sin potasa, a base de Sodas y Fosfatos.",
    ],
    instructions: [
      "Volcar un sobre en el Radiador del auto y 2 sobres en camionetas.",
      "Luego de 150 km cambiar el agua del radiador.",
      "Si desea una limpieza rápida, llevar la temperatura a 90°C y dejar actuar durante 25 minutos",
      "Desagotar y con el motor en frio lavar y volver a llenar.",
    ],
  },
  {
    id: 2,
    slug: "sella-grietas-fk20",
    category: "Línea pesada",
    name: "Sella Grietas FK20",
    subtitle: "Especial para camiones y línea pesada",
    description:
      "Solución sin desarme de motor para pérdidas en tapa de cilindro, block, camisas, radiador de calefacción y radiador de motor. Diseñado especialmente para vehículos de línea pesada.",
    image: "/img/productos/sella-grietas-fk20-vicaria.webp",
    imageWidth: 577,
    imageHeight: 1477,
    imageAlt: "Caja de Sella Grietas FK20 Vicaria para camiones y línea pesada",
    price: SEALANT_BOX_PRICE,
    sachetsPerBox: SACHETS_PER_BOX,
    benefits: sharedSealantBenefits,
    instructions: sharedInstructions,
  },
  {
    id: 3,
    slug: "sella-grietas-super",
    category: "Línea Súper",
    name: "Sella Grietas Súper",
    subtitle: "Fórmula Súper Plus Especial",
    description:
      "Solución sin desarme de motor para pérdidas en tapa de cilindro, block, camisas, radiador de calefacción y radiador de motor. No obstruye el sistema de enfriamiento.",
    image: "/img/productos/sella-grietas-super-vicaria.webp",
    imageWidth: 526,
    imageHeight: 1345,
    imageAlt: "Caja de Sella Grietas Súper Plus Especial Vicaria",
    price: SEALANT_BOX_PRICE,
    sachetsPerBox: SACHETS_PER_BOX,
    benefits: sharedSealantBenefits,
    instructions: sharedInstructions,
  },
  {
    id: 4,
    slug: "sella-grietas-tradicional",
    category: "Línea tradicional",
    name: "Sella Grietas",
    subtitle: "Tradicional · Ideal para radiadores plásticos",
    description:
      "Solución sin desarme de motor para pérdidas en tapa de cilindro, block, camisas, radiador de calefacción y radiador de motor. Ideal para radiadores plásticos.",
    image: "/img/productos/sella-grietas-tradicional-vicaria.webp",
    imageWidth: 590,
    imageHeight: 1449,
    imageAlt: "Caja de Sella Grietas tradicional Vicaria para radiadores plásticos",
    price: SEALANT_BOX_PRICE,
    sachetsPerBox: SACHETS_PER_BOX,
    benefits: sharedSealantBenefits,
    instructions: sharedInstructions,
  },
];

// Unifica la presentación de sobres y unidades sin duplicar lógica en las páginas.
export const getBoxContent = (product) =>
  product.boxContent || (product.sachetsPerBox ? `${product.sachetsPerBox} sobres` : null);

// Centraliza las URLs públicas para que enlaces, sitemap y etiquetas canonical coincidan.
export const getProductPath = (product) => `/productos/${product.slug}`;

// Acepta el slug actual y los identificadores numéricos de enlaces antiguos.
export const getProductByRouteParam = (routeParam) =>
  products.find((product) => product.slug === routeParam || product.id === Number(routeParam));

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

// Formatea precios en pesos argentinos o avisa cuando todavía no fueron definidos.
export const formatPrice = (price) =>
  price === null ? "Precio por caja a confirmar" : currencyFormatter.format(price);
