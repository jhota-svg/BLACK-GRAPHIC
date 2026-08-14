import { ProductConfig, TrackerOrder, WorkshopPhoto } from "./types";
import bannerImg from "./assets/images/catalog_banner_1786103523749.jpg";
import flyersImg from "./assets/images/catalog_flyers_1786103534289.jpg";
import cardsImg from "./assets/images/catalog_cards_1786103547332.jpg";
import vinylImg from "./assets/images/catalog_vinyl_1786103560330.jpg";
import manualsImg from "./assets/images/catalog_manuals_1786672028616.jpg";
import thesisImg from "./assets/images/thesis_hardcover_1786672042752.jpg";
import ringManualImg from "./assets/images/manual_ring_bound_1786672058047.jpg";
import reportsImg from "./assets/images/reports_booklets_1786672071993.jpg";
import vinylPerforatedImg from "./assets/images/vinyl_perforated_window_1786674351067.jpg";
import ceramicMugWhiteImg from "./assets/images/ceramic_mug_white_1786674675998.jpg";
import magicMugImg from "./assets/images/magic_mug_heat_1786674687302.jpg";
import promoBottlesImg from "./assets/images/promo_bottles_print_1786674699015.jpg";
import promoPensImg from "./assets/images/promo_pens_tampography_1786674720636.jpg";
import tampographyImg from "./assets/images/catalog_tampography_1786103949838.jpg";
import mugsImg from "./assets/images/catalog_mugs_1786103965042.jpg";
import rollupImg from "./assets/images/catalog_rollup_1786103980722.jpg";

export const PRODUCTS: ProductConfig[] = [
  {
    id: "banner",
    name: "Banner Gigantografía",
    description: "Lona Vinílica 13oz / Blackout / Backlit con tinta ecosolvente de alta resolución para intemperie.",
    icon: "fa-solid fa-scroll",
    basePrice: 18.0, // S/. per m²
    unitLabel: "m²",
    imageUrl: bannerImg,
    examples: [
      {
        title: "Banners Publicitarios Comerciales",
        subtitle: "Lona 13oz con Ojales Reforzados",
        description: "Ideal para fachadas de locales comerciales, promociones y letreros exteriores resistentes al sol.",
        imageUrl: bannerImg,
        tags: ["Fachadas", "Promociones", "Resistente"],
        recommendedFinish: "Ojales cada 50cm + Dobladillo sellado",
      },
      {
        title: "Gigantografías de Eventos y Fondos",
        subtitle: "Lona Blackout Antirreflejo",
        description: "Fondos de prensa, conferencias, cumpleaños y escenarios que no traslucen la luz posterior.",
        imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
        tags: ["Eventos", "Escenarios", "Sin Reflejos"],
        recommendedFinish: "Bolsillos para tubos o bastidor de madera",
      },
    ],
  },
  {
    id: "flyers",
    name: "Volantes / Flyers",
    description: "Impresión Offset / Digital en Papel Couclé 115g, 150g o 250g de alto brillo y definición.",
    icon: "fa-solid fa-newspaper",
    basePrice: 120.0, // S/. per 1000 units
    unitLabel: "millar",
    imageUrl: flyersImg,
    examples: [
      {
        title: "Volantes Promocionales A5",
        subtitle: "Couclé 150g Tiro y Retiro Full Color",
        description: "El formato rey para volanteo masivo, lanzamientos comerciales, cartas de menú e inauguraciones.",
        imageUrl: flyersImg,
        tags: ["Volanteo", "Restaurantes", "Eventos"],
        recommendedFinish: "Corte recto de precisión",
      },
      {
        title: "Dípticos y Trípticos Informativos",
        subtitle: "Couclé 250g con Marcado y Doblado",
        description: "Folletos corporativos y cartas para clínicas, colegios y empresas con doble o triple cuerpo.",
        imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
        tags: ["Corporativo", "Dípticos", "Presentación"],
        recommendedFinish: "Plastificado mate + Hendido",
      },
    ],
  },
  {
    id: "cards",
    name: "Tarjetas de Presentación",
    description: "Tarjetas corporativas en Couclé 350g con plastificado mate, brillo UV sectorizado o pan de oro.",
    icon: "fa-solid fa-address-card",
    basePrice: 65.0, // S/. per 100 units
    unitLabel: "ciento",
    imageUrl: cardsImg,
    examples: [
      {
        title: "Tarjetas Corporativas Premium",
        subtitle: "Couclé 350g Mate + Brillo UV Sectorizado",
        description: "Destaque su logotipo y datos clave con relieve brillante sobre un fondo mate suave al tacto.",
        imageUrl: cardsImg,
        tags: ["Ejecutivos", "UV Sectorizado", "Gama Alta"],
        recommendedFinish: "Bordes redondeados opcionales",
      },
      {
        title: "Tarjetas Hot Stamping Dorado",
        subtitle: "Acabado Foil Oro / Plata en Couclé 350g",
        description: "Diseñadas para marcas de lujo, boutiques, clínicas exclusivas y bufetes legales.",
        imageUrl: "https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=800&q=80",
        tags: ["Lujo", "Pan de Oro", "Elegancia"],
        recommendedFinish: "Plastificado soft-touch + Foil dorado",
      },
    ],
  },
  {
    id: "manuals",
    name: "Documentos / Manuales",
    description: "Impresión láser B/N y Color para tesis, manuales, catálogos, dosieres e informes con acabados profesionales.",
    icon: "fa-solid fa-book-bookmark",
    basePrice: 0.15, // S/. per page
    unitLabel: "pág",
    imageUrl: manualsImg,
    examples: [
      {
        title: "Tesis y Proyectos de Grado",
        subtitle: "Empastado Tapa Dura con Letras Doradas",
        description: "Encuadernación institucional de alta resistencia en cuerina azul marino, guinda o negra con estampado en pan de oro/plata para universidades e institutos.",
        imageUrl: thesisImg,
        tags: ["Tesis", "Tapa Dura", "Universidades", "Letras Doradas"],
        recommendedFinish: "Empastado Cuerina + Grabado Dorado + Papel Bond 75g/Opalina",
      },
      {
        title: "Manuales de Identidad y Guías de Marca",
        subtitle: "Anillado Metálico Doble Ring (Wire-O)",
        description: "Presentaciones corporativas de apertura 360°, tapas de polipropileno traslúcido y hojas interiores en couché satinado de 150g con reproducción exacta de color CMYK.",
        imageUrl: ringManualImg,
        tags: ["Manuales", "Brand Guidelines", "Doble Ring", "Couché"],
        recommendedFinish: "Anillado Metálico + Portada Mica + Couché 150g",
      },
      {
        title: "Informes Técnicos, Balances y Dosieres",
        subtitle: "Espiral Plástico o Engrapado al Caballete",
        description: "Ideal para balances contables, propuestas de licitación, auditorías, cuadernos de obra y manuales de capacitación de rápida distribución.",
        imageUrl: reportsImg,
        tags: ["Informes", "Espiral", "Auditorías", "Económico"],
        recommendedFinish: "Espiral Plástico + Carátula Transparente + Bond 75g",
      },
      {
        title: "Libros, Revistas y Catálogos Corporativos",
        subtitle: "Lomo Cuadrado / Tapa Blanda Couché 250g",
        description: "Producción editorial de tiraje corto y mediano, revistas institucionales, catálogos de productos y recetarios con encuadernación rústica cosida o fresada.",
        imageUrl: manualsImg,
        tags: ["Editorial", "Catálogos", "Revistas", "Lomo Cuadrado"],
        recommendedFinish: "Compaginado y Corte + Couché 115g/150g + Portada 250g",
      },
    ],
  },
  {
    id: "vinyl",
    name: "Vinil Adhesivo / Troquelado",
    description: "Vinil brillante, mate, microperforado o transparente con corte plotter de precisión.",
    icon: "fa-solid fa-scissors",
    basePrice: 35.0, // S/. per m²
    unitLabel: "m²",
    imageUrl: vinylImg,
    examples: [
      {
        title: "Stickers Troquelados por Forma",
        subtitle: "Vinil Adhesivo Glossy + Corte Plotter",
        description: "Etiquetas resistentes al agua y al frío para empaques de delivery, botellas, bolsas y packaging.",
        imageUrl: vinylImg,
        tags: ["Packaging", "Stickers", "Corte Personalizado"],
        recommendedFinish: "Troquelado exacto en plancha o sueltos",
      },
      {
        title: "Vinil Microperforado para Vidrieras y Autos",
        subtitle: "Visión One-Way Vision HD",
        description: "Permite ver hacia afuera desde el interior mientras muestra publicidad exterior nítida en vitrinas y lunas de autos.",
        imageUrl: vinylPerforatedImg,
        tags: ["Vehículos", "Fachadas", "Vidrieras"],
        recommendedFinish: "Instalación en cristal limpio",
      },
    ],
  },
  {
    id: "tampography",
    name: "Artículos Promocionales & Tampografía",
    description: "Impresión de alta adherencia sobre plástico, aluminio o cerámica para lapiceros, tomatodos y merchandising.",
    icon: "fa-solid fa-pen-nib",
    basePrice: 1.5, // S/. per unit
    unitLabel: "unidad",
    imageUrl: promoBottlesImg,
    examples: [
      {
        title: "Lapiceros Publicitarios Corporativos",
        subtitle: "Grabado en Tampografía 1 a 3 Tintas",
        description: "El regalo promocional más efectivo y económico para ferias, eventos institucionales y clientes.",
        imageUrl: promoPensImg,
        tags: ["Lapiceros", "Merchandising", "Corporativo"],
        recommendedFinish: "Grabado tampográfico con secado UV",
      },
      {
        title: "Tomatodos y Botellas Deportivas",
        subtitle: "Impresión sobre Aluminio y Plástico Curvo",
        description: "Grabado de alta adherencia sobre superficies curvas en tomatodos de metal, aluminio y polímeros térmicos.",
        imageUrl: promoBottlesImg,
        tags: ["Tomatodos", "Aluminio", "Superficies Curvas"],
        recommendedFinish: "Matriz clisé de precisión",
      },
    ],
  },
  {
    id: "mugs",
    name: "Tazas Sublimadas & Cerámica",
    description: "Tazas de cerámica de 11oz personalizadas en sublimación HD full color resistente al microondas.",
    icon: "fa-solid fa-mug-hot",
    basePrice: 15.0, // S/. per unit
    unitLabel: "unidad",
    imageUrl: ceramicMugWhiteImg,
    examples: [
      {
        title: "Tazas Blancas de Cerámica 11oz",
        subtitle: "Sublimación Fotográfica HD Full Color",
        description: "Vista en primer plano: acabado brillante impecable con colores vivos de alta durabilidad aptos para lavavajillas y microondas.",
        imageUrl: ceramicMugWhiteImg,
        tags: ["Fotográfico", "Regalos", "Corporativo", "Cerámica 11oz"],
        recommendedFinish: "Caja individual blanca",
      },
      {
        title: "Tazas Mágicas Termosensibles",
        subtitle: "Revelado Térmico al Verter Líquido Caliente",
        description: "Muestra real de transición: taza que descubre el diseño personalizado a todo color al contacto con café o agua caliente.",
        imageUrl: magicMugImg,
        tags: ["Efecto Mágico", "Sorpresa", "Exclusivo", "Termosensible"],
        recommendedFinish: "Sublimación térmica especial",
      },
    ],
  },
  {
    id: "rollup",
    name: "Banner Roll-Up Retráctil",
    description: "Estructura de aluminio retráctil + Banner impreso en Lona o Film con bolso de transporte.",
    icon: "fa-solid fa-display",
    basePrice: 110.0, // S/. per unit
    unitLabel: "unidad",
    imageUrl: rollupImg,
    examples: [
      {
        title: "Roll-Up Publicitario 85x200 cm",
        subtitle: "Estructura de Aluminio + Lona Mate Antirreflejo",
        description: "Portátil, ultraligero y de armado en 30 segundos. Incluye estuche de transporte con asa.",
        imageUrl: rollupImg,
        tags: ["Stands", "Ferias", "Portátil"],
        recommendedFinish: "Lona Mate 13oz o Film Sintético",
      },
      {
        title: "Roll-Up Ancho 100x200 / 120x200 cm",
        subtitle: "Mayor Impacto Visual para Exhibición",
        description: "Ideal para entradas de conferencias, centros médicos, hoteles y recepción de oficinas.",
        imageUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80",
        tags: ["Gran Formato", "Recepción", "Conferencias"],
        recommendedFinish: "Base pesada de aluminio anodizado",
      },
    ],
  },
];

export const INITIAL_ORDERS: TrackerOrder[] = [
  {
    id: "BG-2026-8942",
    customerName: "Carlos Mendoza",
    companyName: "Pollería El Leñador - Piura",
    phone: "+51 969 123 456",
    productName: "Banner Gigantografía 3.0m x 2.0m + 1000 Volantes A5",
    specs: "Lona 13oz con ojales de metal en esquinas + Volantes Couclé 150g tiro/retiro",
    quantity: 1,
    totalPrice: 285.0,
    currentStage: "printing",
    estimatedDelivery: "Hoy 5:30 PM (Piura Centro)",
    createdAt: "2026-07-24 09:15 AM",
    photos: [
      {
        id: "p1",
        imageUrl: "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&w=800&q=80",
        stage: "received",
        title: "Orden Registrada e Inserción en Cola RIP",
        operatorNote: "Archivo recibido y verificado por Pre-Prensa. Parámetros CMYK aprobados.",
        timestamp: "09:20 AM",
      },
      {
        id: "p2",
        imageUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80",
        stage: "prepress",
        title: "RIP y Calibración de Color Roland TrueVIS",
        operatorNote: "Perfiles de color ajustados para lona 13oz en Plotter Roland Solvente #2.",
        timestamp: "10:45 AM",
      },
      {
        id: "p3",
        imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
        stage: "printing",
        title: "Impresión en Alta Resolución (1440 DPI)",
        operatorNote: "Imprimiendo banner 3x2m a velocidad estándar. Colores vibrantes verificados.",
        timestamp: "01:30 PM",
      },
    ],
  },
  {
    id: "BG-2026-9011",
    customerName: "Dra. Valeria Silva",
    companyName: "Clínica Dental OdontoSalud Piura",
    phone: "+51 978 456 789",
    productName: "500 Tarjetas de Presentación de Lujo",
    specs: "Couclé 350g, Plastificado Mate + Brillo UV Sectorizado en Isotipo",
    quantity: 5,
    totalPrice: 195.0,
    currentStage: "prepress",
    estimatedDelivery: "Mañana 11:00 AM",
    createdAt: "2026-07-24 11:00 AM",
    photos: [
      {
        id: "p101",
        imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80",
        stage: "received",
        title: "Recepción de Archivo vectorial .PDF",
        operatorNote: "Diseño recibido en vector editable. Mascara para sectorizado UV lista.",
        timestamp: "11:05 AM",
      },
      {
        id: "p102",
        imageUrl: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=800&q=80",
        stage: "prepress",
        title: "Armado de Pliego Offset y Marcas de Registro",
        operatorNote: "Revisando márgenes de sangrado 3mm y zonas de corte guillotine.",
        timestamp: "11:40 AM",
      },
    ],
  },
];

export const WORKSHOP_PRESET_PHOTOS = [
  {
    imageUrl: "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&w=800&q=80",
    title: "Recepción de Orden y Verificación de Arte",
    note: "El diseñador de preprensa revisa demasía y modo de color en estación de trabajo.",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80",
    title: "Ajuste de Cabezales y Perfilado de Tintas",
    note: "Iniciando calibración de cabezal MicroPiezo para máxima nitidez de texto.",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    title: "Impresión Continua en Plotter de Gran Formato",
    note: "Paso de impresión activa. Monitoreo constante de tensión de sustrato.",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    title: "Corte y Troquelado con Plotter Láser/Cuchilla",
    note: "Troquelado de bordes siguiendo el trazado vectorial del cliente.",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
    title: "Control de Calidad y Colocación de Ojales",
    note: "Ojales reforzados instalados en las 4 esquinas. Inspección visual aprobada.",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80",
    title: "Empaque Protector y Salida a Despacho",
    note: "Producto empacado herméticamente listo para retiro en tienda o delivery en Piura.",
  },
];

export const AI_SUGGESTION_PROMPTS = [
  "¿Cómo preparo mi diseño en CMYK con 3mm de demasía en Illustrator?",
  "Redacta 3 slogans potentes para promocionar un restaurante marino en Piura.",
  "¿Qué diferencia hay entre vinil brillante, vinil mate y microperforado?",
  "Escribe el texto para un volante promocional de gran inauguración con descuento.",
];
