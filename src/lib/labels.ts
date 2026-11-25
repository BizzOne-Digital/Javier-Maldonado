import { useSiteContext } from "@/lib/site-context";

type Locale = "en" | "es";

type LabelTree = {
  [key: string]: string | LabelTree;
};

const en: LabelTree = {
  nav: {
    home: "Home",
    listings: "Listings",
    services: "Services",
    calculators: "Calculators",
    about: "About",
    blog: "Blog",
    contact: "Contact",
    bookConsultation: "Book Consultation",
    skipIntro: "Skip intro",
    call: "Call",
    menu: "Menu",
    close: "Close",
  },
  services: {
    buying: "Buying",
    selling: "Selling",
    investing: "Investing",
    relocation: "Relocation",
  },
  calculators: {
    mortgage: "Mortgage Calculator",
    purchase: "Purchase Calculator",
    cmhc: "CMHC Insurance",
    landTransfer: "Land Transfer Tax",
    homeWorth: "Home Worth Request",
  },
  forms: {
    name: "Full name",
    email: "Email",
    phone: "Phone",
    message: "Message",
    submit: "Submit",
    sending: "Sending…",
    success: "Thank you — we'll be in touch shortly.",
    error: "Something went wrong. Please try again.",
    next: "Next",
    back: "Back",
    address: "Property address",
    city: "City",
    timeline: "Timeline",
    budget: "Budget",
    preferredDate: "Preferred date",
    preferredTime: "Preferred time",
    consultationType: "Consultation type",
    propertyType: "Property type",
    bedrooms: "Bedrooms",
    reason: "Reason for valuation",
  },
  home: {
    heroTitle: "Luxury real estate across the GTA",
    heroSubtitle: "Personalized guidance for buyers, sellers, and investors.",
    searchPlaceholder: "Search by city or neighbourhood",
    trustLicensed: "Licensed Realtor®",
    trustLocal: "GTA specialist",
    trustBilingual: "English & Spanish",
    featuredListings: "Featured listings",
    viewAll: "View all listings",
    serviceJourney: "Your journey",
    areasWeServe: "Areas we serve",
    calculatorPreview: "Plan with confidence",
    testimonials: "Client stories",
    finalCta: "Ready to make your next move?",
    finalCtaSub: "Book a private consultation with Javier.",
  },
  calculators_ui: {
    reset: "Reset",
    print: "Print",
    disclaimer: "Disclaimer",
    results: "Results",
    inputs: "Inputs",
  },
  listings: {
    filters: "Filters",
    apply: "Apply filters",
    clear: "Clear all",
    beds: "beds",
    baths: "baths",
    forSale: "For sale",
    forLease: "For lease",
    sold: "Sold",
    noResults: "No listings match your filters.",
  },
  journey: {
    title: "Four stages to your goal",
    subtitle: "A guided path for buyers, sellers, and investors.",
    learnMore: "Learn more",
    discoverTitle: "Discover",
    discoverDesc: "Explore neighbourhoods, market trends, and properties aligned with your lifestyle.",
    planTitle: "Plan",
    planDesc: "Use calculators and strategy sessions to understand costs and financing.",
    executeTitle: "Execute",
    executeDesc: "Negotiate, inspect, and close with a trusted advisor at every step.",
    growTitle: "Grow",
    growDesc: "Build wealth through investment properties and long-term portfolio planning.",
  },
  footer: {
    rights: "All rights reserved.",
    brokerage: "Brokerage",
  },
};

const es: LabelTree = {
  nav: {
    home: "Inicio",
    listings: "Propiedades",
    services: "Servicios",
    calculators: "Calculadoras",
    about: "Acerca de",
    blog: "Blog",
    contact: "Contacto",
    bookConsultation: "Reservar consulta",
    skipIntro: "Saltar intro",
    call: "Llamar",
    menu: "Menú",
    close: "Cerrar",
  },
  services: {
    buying: "Comprar",
    selling: "Vender",
    investing: "Invertir",
    relocation: "Reubicación",
  },
  calculators: {
    mortgage: "Calculadora de hipoteca",
    purchase: "Calculadora de compra",
    cmhc: "Seguro CMHC",
    landTransfer: "Impuesto de transferencia",
    homeWorth: "Valor de su hogar",
  },
  forms: {
    name: "Nombre completo",
    email: "Correo electrónico",
    phone: "Teléfono",
    message: "Mensaje",
    submit: "Enviar",
    sending: "Enviando…",
    success: "Gracias — nos pondremos en contacto pronto.",
    error: "Algo salió mal. Inténtelo de nuevo.",
    next: "Siguiente",
    back: "Atrás",
    address: "Dirección de la propiedad",
    city: "Ciudad",
    timeline: "Plazo",
    budget: "Presupuesto",
    preferredDate: "Fecha preferida",
    preferredTime: "Hora preferida",
    consultationType: "Tipo de consulta",
    propertyType: "Tipo de propiedad",
    bedrooms: "Habitaciones",
    reason: "Motivo de la valoración",
  },
  home: {
    heroTitle: "Bienes raíces de lujo en el GTA",
    heroSubtitle: "Asesoría personalizada para compradores, vendedores e inversionistas.",
    searchPlaceholder: "Buscar por ciudad o vecindario",
    trustLicensed: "Agente licenciado®",
    trustLocal: "Especialista del GTA",
    trustBilingual: "Inglés y español",
    featuredListings: "Propiedades destacadas",
    viewAll: "Ver todas",
    serviceJourney: "Su recorrido",
    areasWeServe: "Zonas que servimos",
    calculatorPreview: "Planifique con confianza",
    testimonials: "Historias de clientes",
    finalCta: "¿Listo para su próximo paso?",
    finalCtaSub: "Reserve una consulta privada con Javier.",
  },
  calculators_ui: {
    reset: "Restablecer",
    print: "Imprimir",
    disclaimer: "Aviso legal",
    results: "Resultados",
    inputs: "Datos",
  },
  listings: {
    filters: "Filtros",
    apply: "Aplicar filtros",
    clear: "Limpiar todo",
    beds: "hab",
    baths: "baños",
    forSale: "En venta",
    forLease: "En alquiler",
    sold: "Vendido",
    noResults: "No hay propiedades con estos filtros.",
  },
  journey: {
    title: "Cuatro etapas hacia su meta",
    subtitle: "Un recorrido guiado para compradores, vendedores e inversionistas.",
    learnMore: "Saber más",
    discoverTitle: "Descubrir",
    discoverDesc: "Explore vecindarios, tendencias del mercado y propiedades acordes a su estilo de vida.",
    planTitle: "Planificar",
    planDesc: "Use calculadoras y sesiones estratégicas para entender costos y financiamiento.",
    executeTitle: "Ejecutar",
    executeDesc: "Negocie, inspeccione y cierre con un asesor de confianza en cada paso.",
    growTitle: "Crecer",
    growDesc: "Construya patrimonio con propiedades de inversión y planificación a largo plazo.",
  },
  footer: {
    rights: "Todos los derechos reservados.",
    brokerage: "Correduría",
  },
};

export const labelTrees: Record<Locale, LabelTree> = { en, es };
const trees = labelTrees;

function getPath(tree: LabelTree, path: string): string {
  const parts = path.split(".");
  let current: string | LabelTree = tree;
  for (const part of parts) {
    if (typeof current !== "object" || !(part in current)) return path;
    current = current[part];
  }
  return typeof current === "string" ? current : path;
}

export function useLabels(locale: Locale) {
  const tree = trees[locale] ?? trees.en;
  const { labelOverrides } = useSiteContext();
  const overrides = labelOverrides[locale] ?? {};
  return (key: string) => {
    const o = overrides[key];
    return typeof o === "string" && o ? o : getPath(tree, key);
  };
}
