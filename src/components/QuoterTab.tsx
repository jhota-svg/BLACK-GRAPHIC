import React, { useState, useMemo } from "react";
import heroBannerImage from "../assets/images/hero_banner_print_1786102985864.jpg";
import { PRODUCTS } from "../data";
import { ProductType, QuoteData, ValidationResult } from "../types";
import {
  downloadProformaPDF,
  downloadBothPDFs,
  COMPANY_WHATSAPP_NUM,
} from "../lib/pdfGenerator";

interface QuoterTabProps {
  activeQuote: QuoteData | null;
  setActiveQuote: (quote: QuoteData) => void;
  activeValidation: ValidationResult | null;
  setActiveTab: (tab: string) => void;
}

export const QuoterTab: React.FC<QuoterTabProps> = ({
  activeQuote,
  setActiveQuote,
  activeValidation,
  setActiveTab,
}) => {
  const [showTutorialModal, setShowTutorialModal] = useState<boolean>(false);
  const [showCatalogModal, setShowCatalogModal] = useState<boolean>(false);

  const [selectedProduct, setSelectedProduct] = useState<ProductType>(
    activeQuote?.productType || "banner"
  );

  const [proformaId] = useState<string>(
    () => activeQuote?.proformaId || `PROF-${Math.floor(10000 + Math.random() * 90000)}`
  );

  // Banner inputs
  const [bannerWidthM, setBannerWidthM] = useState<number>(3.0);
  const [bannerHeightM, setBannerHeightM] = useState<number>(2.0);
  const [bannerType, setBannerType] = useState<"standard" | "blackout" | "backlit">("standard");
  const [bannerEyelets, setBannerEyelets] = useState<boolean>(true);
  const [bannerUV, setBannerUV] = useState<boolean>(false);
  const [bannerPockets, setBannerPockets] = useState<boolean>(false);
  const [bannerQty, setBannerQty] = useState<number>(1);

  // Flyers inputs
  const [flyerSize, setFlyerSize] = useState<"A6" | "A5" | "A4">("A5");
  const [flyerPaper, setFlyerPaper] = useState<"coucle115" | "coucle150" | "coucle250">("coucle150");
  const [flyerSides, setFlyerSides] = useState<"1side" | "2sides">("2sides");
  const [flyerQty, setFlyerQty] = useState<number>(1000);

  // Cards inputs
  const [cardFinish, setCardFinish] = useState<"mate" | "brillante" | "uv_sectorizado" | "hot_stamping">("mate");
  const [cardCorners, setCardCorners] = useState<boolean>(false);
  const [cardBoxes, setCardBoxes] = useState<number>(1); // Hundreds

  // Vinyl inputs
  const [vinylWidthM, setVinylWidthM] = useState<number>(1.5);
  const [vinylHeightM, setVinylHeightM] = useState<number>(1.0);
  const [vinylType, setVinylType] = useState<"brillante" | "mate" | "microperforado" | "transparente" | "troquelado">("brillante");
  const [vinylLamination, setVinylLamination] = useState<boolean>(true);
  const [vinylQty, setVinylQty] = useState<number>(1);

  // Tampography inputs
  const [tampographyColors, setTampographyColors] = useState<number>(1);
  const [tampographyQty, setTampographyQty] = useState<number>(500);

  // Mugs inputs
  const [mugType, setMugType] = useState<"blanca" | "magica" | "interior_color">("blanca");
  const [mugQty, setMugQty] = useState<number>(12);

  // RollUp inputs
  const [rollupSize, setRollupSize] = useState<"85x200" | "100x200" | "120x200">("85x200");
  const [rollupQty, setRollupQty] = useState<number>(1);

  // Manuals / Documents inputs
  const [manualSize, setManualSize] = useState<"A4" | "A5" | "Carta" | "Personalizado">("A4");
  const [manualCustomWidth, setManualCustomWidth] = useState<number>(21.0); // cm
  const [manualCustomHeight, setManualCustomHeight] = useState<number>(29.7); // cm
  const [manualPages, setManualPages] = useState<number>(17);
  const [manualQuantity, setManualQuantity] = useState<number>(1);
  const [manualPrintType, setManualPrintType] = useState<"laser_color" | "laser_bn" | "mixto">("laser_color");
  const [manualSubstrate, setManualSubstrate] = useState<"bond75" | "couche115" | "couche150" | "couche250" | "opalina180">("couche150");
  const [manualCover, setManualCover] = useState<"couche250" | "same" | "tapadura" | "opalina250" | "micas_pvc">("couche250");
  const [manualFinish, setManualFinish] = useState<string>("espiral_plastico");

  // Global Special Indications / Suggestions for all products
  const [specialNotes, setSpecialNotes] = useState<string>(activeQuote?.specialNotes || "");

  // Help Visual Guide Modal State
  const [helpModalProduct, setHelpModalProduct] = useState<ProductType | null>(null);

  // Product Selector View Toggle
  const [showMoreProducts, setShowMoreProducts] = useState<boolean>(false);

  // Common options
  const [isExpress, setIsExpress] = useState<boolean>(activeQuote?.isExpress ?? false);
  const [includeIGV, setIncludeIGV] = useState<boolean>(activeQuote?.includeIGV ?? true);

  // Customer details for proforma
  const [customerName, setCustomerName] = useState<string>(activeQuote?.customerName || "");
  const [customerCompany, setCustomerCompany] = useState<string>(activeQuote?.customerCompany || "");

  // Saved Proformas list
  const [savedProformas, setSavedProformas] = useState<any[]>([]);
  const [showSavedSuccessModal, setShowSavedSuccessModal] = useState<boolean>(false);

  const selectManualFinish = (finishId: string) => {
    setManualFinish(finishId);
  };

  // Dynamic Price Calculations
  const calculation = useMemo(() => {
    let subtotal = 0;
    let descriptionSpecs = "";
    let areaTotalM2 = 0;
    let manualUnitPricePerSheet = 0;
    let manualCostPerCopy = 0;
    let manualDiscountPercent = 0;
    let manualDiscountTierLabel = "";
    let manualVolumeTiers: Array<{
      label: string;
      min: number;
      max: number;
      discount: number;
      pricePerSheet: number;
      costPerCopy: number;
      isActive: boolean;
    }> = [];

    if (selectedProduct === "banner") {
      areaTotalM2 = bannerWidthM * bannerHeightM;
      let ratePerM2 = 18.0; // Standard 13oz
      if (bannerType === "blackout") ratePerM2 = 24.0;
      if (bannerType === "backlit") ratePerM2 = 32.0;

      subtotal = areaTotalM2 * ratePerM2 * bannerQty;

      // Add-ons
      if (bannerEyelets) subtotal += 8.0 * bannerQty; // Ojales reforzados
      if (bannerUV) subtotal += areaTotalM2 * 5.0 * bannerQty;
      if (bannerPockets) subtotal += 6.0 * bannerQty;

      // Bulk discount for banners > 10m²
      if (areaTotalM2 * bannerQty >= 10) {
        subtotal *= 0.9; // 10% off
      }

      descriptionSpecs = `Banner ${bannerWidthM}m x ${bannerHeightM}m (${areaTotalM2.toFixed(2)}m²) - ${
        bannerType === "standard" ? "Lona 13oz" : bannerType === "blackout" ? "Blackout 15oz" : "Backlit Translúcida"
      } ${bannerEyelets ? "+ Ojales de metal" : ""} ${bannerUV ? "+ Barniz UV" : ""} ${bannerPockets ? "+ Bolsillos" : ""} (Cant: ${bannerQty})`;
    } else if (selectedProduct === "flyers") {
      let baseRatePerThousand = 120.0; // A5 150g 2 sides
      if (flyerSize === "A6") baseRatePerThousand = 80.0;
      if (flyerSize === "A4") baseRatePerThousand = 220.0;

      if (flyerPaper === "coucle115") baseRatePerThousand *= 0.85;
      if (flyerPaper === "coucle250") baseRatePerThousand *= 1.25;

      if (flyerSides === "1side") baseRatePerThousand *= 0.75;

      const thousands = flyerQty / 1000;
      subtotal = baseRatePerThousand * thousands;

      // Volume discount
      if (flyerQty >= 5000) subtotal *= 0.82;
      else if (flyerQty >= 2000) subtotal *= 0.9;

      descriptionSpecs = `Volantes ${flyerSize} en Couclé ${
        flyerPaper === "coucle115" ? "115g" : flyerPaper === "coucle150" ? "150g" : "250g"
      } (${flyerSides === "1side" ? "Tiro solo" : "Tiro y Retiro full color"}) (Cant: ${flyerQty} unids)`;
    } else if (selectedProduct === "cards") {
      let baseRatePerHundred = 65.0;
      if (cardFinish === "brillante") baseRatePerHundred = 55.0;
      if (cardFinish === "uv_sectorizado") baseRatePerHundred = 95.0;
      if (cardFinish === "hot_stamping") baseRatePerHundred = 135.0;

      subtotal = baseRatePerHundred * cardBoxes;
      if (cardCorners) subtotal += 10.0 * cardBoxes;

      // Discount for >= 5 boxes
      if (cardBoxes >= 5) subtotal *= 0.85;

      descriptionSpecs = `Tarjetas de Presentación Couclé 350g (${
        cardFinish === "mate"
          ? "Plastificado Mate"
          : cardFinish === "brillante"
          ? "Brillo UV"
          : cardFinish === "uv_sectorizado"
          ? "Mate + UV Sectorizado"
          : "Plastificado Mate + Pan de Oro"
      }) ${cardCorners ? "+ Puntas Redondeadas" : ""} (Cant: ${cardBoxes * 100} tarjetas / ${cardBoxes} cientos)`;
    } else if (selectedProduct === "manuals") {
      // General printing market rate per page / sheet based on substrate & print type
      let rawRatePerSheet = 1.40; // default Couché 150g Color
      if (manualPrintType === "laser_color") {
        if (manualSubstrate === "bond75") rawRatePerSheet = 0.60;
        else if (manualSubstrate === "couche115") rawRatePerSheet = 1.00;
        else if (manualSubstrate === "couche150") rawRatePerSheet = 1.40;
        else if (manualSubstrate === "couche250") rawRatePerSheet = 1.90;
        else if (manualSubstrate === "opalina180") rawRatePerSheet = 1.60;
      } else if (manualPrintType === "laser_bn") {
        if (manualSubstrate === "bond75") rawRatePerSheet = 0.15;
        else if (manualSubstrate === "couche115") rawRatePerSheet = 0.40;
        else if (manualSubstrate === "couche150") rawRatePerSheet = 0.55;
        else if (manualSubstrate === "couche250") rawRatePerSheet = 0.80;
        else if (manualSubstrate === "opalina180") rawRatePerSheet = 0.70;
      } else if (manualPrintType === "mixto") {
        if (manualSubstrate === "bond75") rawRatePerSheet = 0.35;
        else if (manualSubstrate === "couche115") rawRatePerSheet = 0.70;
        else if (manualSubstrate === "couche150") rawRatePerSheet = 0.95;
        else if (manualSubstrate === "couche250") rawRatePerSheet = 1.30;
        else if (manualSubstrate === "opalina180") rawRatePerSheet = 1.10;
      }

      let sizeMultiplier = 1.0;
      if (manualSize === "A5") sizeMultiplier = 0.70;
      if (manualSize === "Carta") sizeMultiplier = 1.0;
      if (manualSize === "Personalizado") {
        const areaCm2 = manualCustomWidth * manualCustomHeight;
        sizeMultiplier = Math.max(0.5, Math.min(3.0, areaCm2 / 623.7));
      }

      // Cover extra cost per copy
      let coverCostPerUnit = 0.0;
      let coverLabel = "Mismo Gramaje de Páginas Interiores";
      if (manualCover === "couche250") {
        coverCostPerUnit = 2.50;
        coverLabel = "Portada/Contraportada Couché 250g";
      } else if (manualCover === "same") {
        coverCostPerUnit = 0.0;
        coverLabel = "Mismo Gramaje de Páginas Interiores";
      } else if (manualCover === "tapadura") {
        coverCostPerUnit = 30.0;
        coverLabel = "Tapa Dura Termolaminada / Empastada";
      } else if (manualCover === "opalina250") {
        coverCostPerUnit = 3.50;
        coverLabel = "Cartulina Opalina 250g Lisa";
      } else if (manualCover === "micas_pvc") {
        coverCostPerUnit = 1.50;
        coverLabel = "Micas PVC Transparente / Pavonada";
      }

      // Finish cost per copy (mutually exclusive)
      let finishCostPerUnit = 0.0;
      let finishLabel = "Espiral Plástico / Espiralado";
      if (manualFinish === "espiral_plastico") {
        finishCostPerUnit = 4.50;
        finishLabel = "Espiral Plástico / Espiralado";
      } else if (manualFinish === "anillado_metalico") {
        finishCostPerUnit = 7.50;
        finishLabel = "Anillado Metálico Ring Wire";
      } else if (manualFinish === "empastado_tapadura") {
        finishCostPerUnit = 35.0;
        finishLabel = "Empastado / Tapa Dura Cuerina";
      } else if (manualFinish === "engrapado") {
        finishCostPerUnit = 2.00;
        finishLabel = "Engrapado a Caballete";
      } else if (manualFinish === "solo_compaginado") {
        finishCostPerUnit = 1.00;
        finishLabel = "Solo Compaginado y Corte";
      } else if (manualFinish === "sin_acabado") {
        finishCostPerUnit = 0.0;
        finishLabel = "Sin Acabado Adicional";
      }

      // Volume discount factor based on total copies or volume
      let discountFactor = 1.0;
      let discountPct = 0;
      let discountTierLabel = "Tarifa unitaria";

      if (manualQuantity === 1) {
        discountFactor = 1.00;
        discountPct = 0;
        discountTierLabel = "Tarifa unitaria";
      } else if (manualQuantity >= 2 && manualQuantity <= 4) {
        discountFactor = 0.95;
        discountPct = 5;
        discountTierLabel = "2 - 4 ejemplares (-5%)";
      } else if (manualQuantity >= 5 && manualQuantity <= 9) {
        discountFactor = 0.90;
        discountPct = 10;
        discountTierLabel = "5 - 9 ejemplares (-10%)";
      } else if (manualQuantity >= 10 && manualQuantity <= 19) {
        discountFactor = 0.85;
        discountPct = 15;
        discountTierLabel = "10 - 19 ejemplares (-15%)";
      } else if (manualQuantity >= 20 && manualQuantity <= 49) {
        discountFactor = 0.80;
        discountPct = 20;
        discountTierLabel = "20 - 49 ejemplares (-20%)";
      } else if (manualQuantity >= 50) {
        discountFactor = 0.75;
        discountPct = 25;
        discountTierLabel = "50+ ejemplares (-25%)";
      }

      const baseRatePerSheet = rawRatePerSheet * sizeMultiplier;
      const discountedRatePerSheet = baseRatePerSheet * discountFactor;
      const pagesCostPerCopy = discountedRatePerSheet * manualPages;
      const extraPerCopy = coverCostPerUnit + finishCostPerUnit;
      const costPerCopy = pagesCostPerCopy + extraPerCopy;
      
      subtotal = Math.max(5.0, costPerCopy * manualQuantity);
      const unitPricePerSheet = subtotal / (manualPages * manualQuantity);

      manualUnitPricePerSheet = unitPricePerSheet;
      manualCostPerCopy = costPerCopy;
      manualDiscountPercent = discountPct;
      manualDiscountTierLabel = discountTierLabel;

      const printTypeLabel =
        manualPrintType === "laser_color"
          ? "Láser Color HD"
          : manualPrintType === "laser_bn"
          ? "Láser B/N"
          : "Mixto (Color + B/N)";

      const substrateLabel =
        manualSubstrate === "bond75"
          ? "Papel Bond 75g"
          : manualSubstrate === "couche115"
          ? "Papel Couché 115g"
          : manualSubstrate === "couche150"
          ? "Papel Couché 150g"
          : manualSubstrate === "couche250"
          ? "Papel Couché 250g"
          : "Opalina 180g";

      const sizeLabel =
        manualSize === "Personalizado"
          ? `Personalizado (${manualCustomWidth}x${manualCustomHeight} cm)`
          : manualSize;

      descriptionSpecs = `Doc/Manual ${sizeLabel} (${manualPages} págs) - ${printTypeLabel} en ${substrateLabel} | Carátula: ${coverLabel} | Acabado: ${finishLabel} (Cant: ${manualQuantity} ejemplar${manualQuantity > 1 ? "es" : ""} @ S/. ${unitPricePerSheet.toFixed(2)}/hoja)`;
    } else if (selectedProduct === "vinyl") {
      areaTotalM2 = vinylWidthM * vinylHeightM;
      let ratePerM2 = 35.0; // Vinyl brillante
      if (vinylType === "mate") ratePerM2 = 35.0;
      if (vinylType === "microperforado") ratePerM2 = 45.0;
      if (vinylType === "transparente") ratePerM2 = 40.0;
      if (vinylType === "troquelado") ratePerM2 = 55.0;

      subtotal = areaTotalM2 * ratePerM2 * vinylQty;
      if (vinylLamination) subtotal += areaTotalM2 * 10.0 * vinylQty;

      if (areaTotalM2 * vinylQty >= 8) subtotal *= 0.88;

      descriptionSpecs = `Vinil ${vinylType.toUpperCase()} ${vinylWidthM}m x ${vinylHeightM}m (${areaTotalM2.toFixed(2)}m²) ${
        vinylLamination ? "+ Laminado Matte Antirrayaduras" : ""
      } (Cant: ${vinylQty})`;
    } else if (selectedProduct === "tampography") {
      let ratePerUnit = 1.5;
      if (tampographyColors === 2) ratePerUnit = 2.2;
      if (tampographyColors >= 3) ratePerUnit = 3.0;

      subtotal = ratePerUnit * tampographyQty + 45.0; // S/. 45 matriz clisé
      if (tampographyQty >= 1000) subtotal *= 0.85;

      descriptionSpecs = `Tampografía / Merchandising (${tampographyColors} Color${tampographyColors > 1 ? "es" : ""}) + Clisé de grabado (Cant: ${tampographyQty} unids)`;
    } else if (selectedProduct === "mugs") {
      let ratePerUnit = 15.0;
      if (mugType === "magica") ratePerUnit = 24.0;
      if (mugType === "interior_color") ratePerUnit = 18.0;

      subtotal = ratePerUnit * mugQty;
      if (mugQty >= 36) subtotal *= 0.88;

      descriptionSpecs = `Tazas Sublimadas 11oz (${
        mugType === "blanca" ? "Blanca Clásica" : mugType === "magica" ? "Taza Mágica Termosensible" : "Interior de Color"
      }) HD Full Color (Cant: ${mugQty} unids)`;
    } else if (selectedProduct === "rollup") {
      let ratePerUnit = 110.0;
      if (rollupSize === "100x200") ratePerUnit = 135.0;
      if (rollupSize === "120x200") ratePerUnit = 165.0;

      subtotal = ratePerUnit * rollupQty;
      if (rollupQty >= 5) subtotal *= 0.9;

      descriptionSpecs = `Banner Roll-Up Retráctil Alum. (${rollupSize.replace("x", " x ")} cm) + Estuche (Cant: ${rollupQty} unids)`;
    }

    // Express surge (+25%)
    if (isExpress) {
      subtotal *= 1.25;
    }

    const subtotalNoIGV = subtotal / (includeIGV ? 1.18 : 1.0);
    const igvAmount = includeIGV ? subtotal - subtotalNoIGV : subtotal * 0.18;
    const finalTotal = includeIGV ? subtotal : subtotal + igvAmount;

    return {
      subtotalNoIGV,
      igvAmount,
      finalTotal,
      descriptionSpecs,
      areaTotalM2,
      manualUnitPricePerSheet,
      manualCostPerCopy,
      manualDiscountPercent,
      manualDiscountTierLabel,
      manualVolumeTiers,
    };
  }, [
    selectedProduct,
    bannerWidthM,
    bannerHeightM,
    bannerType,
    bannerEyelets,
    bannerUV,
    bannerPockets,
    bannerQty,
    flyerSize,
    flyerPaper,
    flyerSides,
    flyerQty,
    cardFinish,
    cardCorners,
    cardBoxes,
    manualSize,
    manualCustomWidth,
    manualCustomHeight,
    manualPages,
    manualQuantity,
    manualPrintType,
    manualSubstrate,
    manualCover,
    manualFinish,
    vinylWidthM,
    vinylHeightM,
    vinylType,
    vinylLamination,
    vinylQty,
    tampographyColors,
    tampographyQty,
    mugType,
    mugQty,
    rollupSize,
    rollupQty,
    isExpress,
    includeIGV,
  ]);

  // Current active QuoteData representation
  const currentQuoteData: QuoteData = useMemo(() => {
    const prodObj = PRODUCTS.find((p) => p.id === selectedProduct);
    return {
      proformaId,
      productType: selectedProduct,
      productName: prodObj ? prodObj.name : "Impresión Digital",
      customerName: customerName.trim() || "Cliente General",
      customerCompany: customerCompany.trim() || "No especificado",
      descriptionSpecs: calculation.descriptionSpecs,
      specialNotes: specialNotes.trim(),
      subtotalNoIGV: calculation.subtotalNoIGV,
      igvAmount: calculation.igvAmount,
      finalTotal: calculation.finalTotal,
      includeIGV,
      isExpress,
      createdAt: new Date().toLocaleDateString("es-PE"),
    };
  }, [
    proformaId,
    selectedProduct,
    customerName,
    customerCompany,
    calculation,
    specialNotes,
    includeIGV,
    isExpress,
  ]);

  // Handle step 2: Validate PDF
  const handleGoToValidator = () => {
    setActiveQuote(currentQuoteData);
    setActiveTab("validator");
  };

  // Handle WhatsApp Link Generator (Includes Both Quote & Validation if present)
  const whatsappUrl = useMemo(() => {
    let rawText = `SOLICITUD INTEGRADA DE IMPRESIÓN - BLACK GRAPHIC PIURA

1. DETALLE DE COTIZACIÓN
• Proforma N°: ${currentQuoteData.proformaId}
• Cliente: ${currentQuoteData.customerName}
• Empresa / Negocio: ${currentQuoteData.customerCompany}
• Producto: ${currentQuoteData.productName}
• Especificaciones: ${currentQuoteData.descriptionSpecs}`;

    if (currentQuoteData.specialNotes) {
      rawText += `\n• Indicaciones Especiales: ${currentQuoteData.specialNotes}`;
    }

    rawText += `\n• Modalidad: ${isExpress ? "Servicio Express Prioritario (4 hrs Piura)" : "Entrega Estándar (24-48 hrs)"}
• Inversión Total: S/. ${currentQuoteData.finalTotal.toFixed(2)} (${includeIGV ? "IGV Incluido" : "Sin IGV"})`;

    if (activeValidation) {
      rawText += `

2. REPORTE DE PRE-PRENSA (PDF ADJUNTO)
• Archivo Validado: ${activeValidation.fileName}
• Perfil de Color: ${activeValidation.colorSpace} (${activeValidation.colorSpace === "CMYK" ? "Aprobado para Impresión" : "Convertible"})
• Resolución: ${activeValidation.dpi} DPI
• Sangrado / Demasía: ${activeValidation.hasBleed ? `${activeValidation.bleedMarginMm} mm OK` : "Falta Sangrado (0 mm)"}
• Puntaje Técnico: ${activeValidation.score}/100`;
    } else {
      rawText += `

2. ARCHIVO DE IMPRESIÓN PDF
(Iré a la sección Validador para adjuntar el PDF de diseño en la misma solicitud)`;
    }

    rawText += `

Hola equipo de Black Graphic, envío mi cotización ${activeValidation ? "y la validación de mi PDF " : ""}para procesar la orden en el taller de Piura.`;

    const cleanText = rawText.replace(/\*/g, "");

    return `https://wa.me/${COMPANY_WHATSAPP_NUM}?text=${encodeURIComponent(cleanText)}`;
  }, [currentQuoteData, isExpress, includeIGV, activeValidation]);

  // Download PDF Proforma
  const handleDownloadPDF = (proformaIdOverride?: string) => {
    const pId = proformaIdOverride || currentQuoteData.proformaId;
    const quoteObj = { ...currentQuoteData, proformaId: pId };
    downloadProformaPDF(quoteObj);

    setActiveQuote(quoteObj);

    const newProforma = {
      id: pId,
      date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      customer: currentQuoteData.customerName,
      specs: currentQuoteData.descriptionSpecs,
      total: currentQuoteData.finalTotal,
    };
    setSavedProformas((prev) => [newProforma, ...prev]);
    setShowSavedSuccessModal(true);
    setTimeout(() => setShowSavedSuccessModal(false), 3500);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Banner / Title Header Container with Image & Bottom-Right Buttons */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 border border-slate-200 dark:border-[#FFCC00]/30 shadow-xl transition-colors duration-200 h-48 sm:h-64 sm:h-72">
        {/* Full Image background */}
        <img
          src={heroBannerImage}
          alt="Black Graphic Piura Taller"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

        {/* Bottom Right Medium Buttons: Tutorial & Catálogo */}
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 flex items-center space-x-2.5 sm:space-x-3 z-10">
          <button
            onClick={() => setShowTutorialModal(true)}
            className="flex items-center space-x-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-white/90 hover:bg-white text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg backdrop-blur-md hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/50"
          >
            <i className="fa-solid fa-circle-play text-emerald-600 text-sm sm:text-base shrink-0" />
            <span className="whitespace-nowrap">Tutorial</span>
          </button>

          <button
            onClick={() => setShowCatalogModal(true)}
            className="flex items-center space-x-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-[#000273] hover:bg-[#000273]/90 text-white dark:bg-[#FFCC00] dark:hover:bg-[#FFCC00]/90 dark:text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20 dark:border-black/10"
          >
            <i className="fa-solid fa-book-open text-xs sm:text-sm shrink-0" />
            <span className="whitespace-nowrap">Catálogo</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Products Selector & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Product Selector & Configuration Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Product Type Tabs */}
          <div className="glass-card p-4 rounded-2xl">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              1. Selecciona el Tipo de Producto
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(showMoreProducts ? PRODUCTS : PRODUCTS.slice(0, 4)).map((prod) => {
                const isSelected = selectedProduct === prod.id;
                return (
                  <div key={prod.id} className="relative group">
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(prod.id)}
                      className={`w-full p-3.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between h-full relative ${
                        isSelected
                          ? "bg-[#000273] text-white border-[#000273] dark:bg-[#FFCC00] dark:text-slate-950 dark:border-[#FFCC00] shadow-md scale-[1.02]"
                          : "bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <i className={`${prod.icon} text-xl ${isSelected ? "text-[#FFCC00] dark:text-slate-950" : "text-[#000273] dark:text-[#FFCC00]"}`} />
                      </div>
                      <div>
                        <div className="font-extrabold text-xs sm:text-sm leading-tight pr-5">{prod.name}</div>
                        <div className={`text-[10px] mt-1 font-semibold ${isSelected ? "text-slate-200 dark:text-slate-900 font-bold" : "text-slate-500 dark:text-slate-300"}`}>
                          Desde S/. {prod.basePrice.toFixed(2)} /{prod.unitLabel}
                        </div>
                      </div>
                    </button>

                    {/* Question mark (?) help button on the top right corner */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setHelpModalProduct(prod.id);
                      }}
                      title={`Ver guía visual y ejemplos de ${prod.name}`}
                      className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center font-black text-[11px] shadow-sm transition-all z-10 cursor-pointer ${
                        isSelected
                          ? "bg-white/20 hover:bg-white text-white hover:text-slate-900 dark:bg-black/20 dark:hover:bg-black dark:text-black dark:hover:text-[#FFCC00]"
                          : "bg-slate-200/90 hover:bg-[#d5118d] text-slate-700 hover:text-white dark:bg-slate-800 dark:hover:bg-[#d5118d] dark:text-slate-300 dark:hover:text-white border border-slate-300 dark:border-slate-700"
                      }`}
                    >
                      <i className="fa-solid fa-question text-[10px]" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Lower Middle "Ver Más" Button */}
            <div className="flex justify-center pt-3 border-t border-slate-200/60 dark:border-slate-800/60 mt-3">
              <button
                type="button"
                onClick={() => setShowMoreProducts(!showMoreProducts)}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#000273] dark:text-[#FFCC00] font-extrabold text-xs transition-all cursor-pointer shadow-xs active:scale-95 border border-slate-200/80 dark:border-slate-700"
              >
                <span>{showMoreProducts ? "Ver Menos Productos" : "Ver Más Productos"}</span>
                <i className={`fa-solid ${showMoreProducts ? "fa-chevron-up" : "fa-chevron-down"} text-[10px]`} />
              </button>
            </div>
          </div>

          {/* Configuration Form Based on Selected Product */}
          <div className="glass-card p-6 rounded-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
                <i className="fa-solid fa-sliders text-[#d5118d]" />
                <span>2. Especificaciones Técnicas y Medidas</span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">Taller Piura</span>
            </div>

            {/* BANNER CONFIGURATION */}
            {selectedProduct === "banner" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Ancho (Metros)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="0.5"
                        max="20"
                        value={bannerWidthM}
                        onChange={(e) => setBannerWidthM(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-[#000273] outline-none"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">m</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Alto (Metros)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="0.5"
                        max="20"
                        value={bannerHeightM}
                        onChange={(e) => setBannerHeightM(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-[#000273] outline-none"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">m</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-100 dark:bg-slate-800/50 p-3 rounded-xl flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                  <span>Área Total Calculada:</span>
                  <span className="text-base font-extrabold text-[#000273] dark:text-[#FFCC00]">
                    {calculation.areaTotalM2.toFixed(2)} m²
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tipo de Lona / Sustrato
                  </label>
                  <select
                    value={bannerType}
                    onChange={(e: any) => setBannerType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm text-slate-900 dark:text-white outline-none"
                  >
                    <option value="standard">Lona Standard 13oz Brillante (S/. 18/m²)</option>
                    <option value="blackout">Lona Blackout 15oz Opaca Alta Densidad (S/. 24/m²)</option>
                    <option value="backlit">Lona Backlit Translúcida para Caja de Luz (S/. 32/m²)</option>
                  </select>
                </div>

                {/* Banner Finishes Checkboxes */}
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Acabados Incluidos
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <label className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                      bannerEyelets ? "border-[#000273] bg-[#000273]/10 text-[#000273] dark:border-[#FFCC00] dark:bg-[#FFCC00]/10 dark:text-[#FFCC00]" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                    }`}>
                      <input
                        type="checkbox"
                        checked={bannerEyelets}
                        onChange={(e) => setBannerEyelets(e.target.checked)}
                        className="rounded text-[#000273]"
                      />
                      <span>Ojales de Metal</span>
                    </label>

                    <label className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                      bannerUV ? "border-[#000273] bg-[#000273]/10 text-[#000273] dark:border-[#FFCC00] dark:bg-[#FFCC00]/10 dark:text-[#FFCC00]" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                    }`}>
                      <input
                        type="checkbox"
                        checked={bannerUV}
                        onChange={(e) => setBannerUV(e.target.checked)}
                        className="rounded text-[#000273]"
                      />
                      <span>Laminado UV Protector</span>
                    </label>

                    <label className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                      bannerPockets ? "border-[#000273] bg-[#000273]/10 text-[#000273] dark:border-[#FFCC00] dark:bg-[#FFCC00]/10 dark:text-[#FFCC00]" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                    }`}>
                      <input
                        type="checkbox"
                        checked={bannerPockets}
                        onChange={(e) => setBannerPockets(e.target.checked)}
                        className="rounded text-[#000273]"
                      />
                      <span>Bolsillos para Tubo</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Cantidad de Banners
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={bannerQty}
                    onChange={(e) => setBannerQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>
            )}

            {/* FLYERS CONFIGURATION */}
            {selectedProduct === "flyers" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Tamaño del Volante
                    </label>
                    <select
                      value={flyerSize}
                      onChange={(e: any) => setFlyerSize(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm text-slate-900 dark:text-white outline-none"
                    >
                      <option value="A6">A6 (10 x 14 cm) - Bolsillo</option>
                      <option value="A5">A5 (15 x 21 cm) - Estándar Promocional</option>
                      <option value="A4">A4 (21 x 29.7 cm) - Afiche / Hoja Completa</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Gramaje de Papel Couclé
                    </label>
                    <select
                      value={flyerPaper}
                      onChange={(e: any) => setFlyerPaper(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm text-slate-900 dark:text-white outline-none"
                    >
                      <option value="coucle115">Couclé 115g (Económico / Ligero)</option>
                      <option value="coucle150">Couclé 150g (Estándar Imprenta)</option>
                      <option value="coucle250">Couclé 250g (Rígido / Premium)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Impresión
                    </label>
                    <select
                      value={flyerSides}
                      onChange={(e: any) => setFlyerSides(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm text-slate-900 dark:text-white outline-none"
                    >
                      <option value="1side">Solo 1 Lado (Tiro Full Color)</option>
                      <option value="2sides">2 Lados (Tiro y Retiro Full Color)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Cantidad de Unidades
                    </label>
                    <select
                      value={flyerQty}
                      onChange={(e: any) => setFlyerQty(parseInt(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm text-slate-900 dark:text-white outline-none"
                    >
                      <option value={1000}>1,000 Unidades (1 Millar)</option>
                      <option value={2000}>2,000 Unidades (Desc. 10%)</option>
                      <option value={5000}>5,000 Unidades (Desc. 18% Mayorista)</option>
                      <option value={10000}>10,000 Unidades (Campaña Masiva)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* CARDS CONFIGURATION */}
            {selectedProduct === "cards" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Acabado de Tarjeta Corporativa
                  </label>
                  <select
                    value={cardFinish}
                    onChange={(e: any) => setCardFinish(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm text-slate-900 dark:text-white outline-none"
                  >
                    <option value="mate">Plastificado Mate Clásico (S/. 65 x ciento)</option>
                    <option value="brillante">Brillo UV Total (S/. 55 x ciento)</option>
                    <option value="uv_sectorizado">Plastificado Mate + UV Sectorizado en Logo (S/. 95 x ciento)</option>
                    <option value="hot_stamping">Plastificado Mate + Pan de Oro/Plata Hot Stamping (S/. 135 x ciento)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Cantidad de Cientos (x100)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={cardBoxes}
                      onChange={(e) => setCardBoxes(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm text-slate-900 dark:text-white outline-none"
                    />
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">Total: {cardBoxes * 100} Tarjetas</p>
                  </div>

                  <div className="flex items-center pt-5">
                    <label className={`flex items-center space-x-2 p-3 rounded-xl border text-xs font-bold cursor-pointer w-full transition-all ${
                      cardCorners ? "border-[#000273] bg-[#000273]/10 text-[#000273] dark:border-[#FFCC00] dark:bg-[#FFCC00]/10 dark:text-[#FFCC00]" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                    }`}>
                      <input
                        type="checkbox"
                        checked={cardCorners}
                        onChange={(e) => setCardCorners(e.target.checked)}
                        className="rounded text-[#000273]"
                      />
                      <span>Troquel de Puntas Redondeadas (+S/.10)</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* VINYL CONFIGURATION */}
            {selectedProduct === "vinyl" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Ancho (Metros)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.2"
                      max="10"
                      value={vinylWidthM}
                      onChange={(e) => setVinylWidthM(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Alto (Metros)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.2"
                      max="10"
                      value={vinylHeightM}
                      onChange={(e) => setVinylHeightM(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tipo de Vinil
                  </label>
                  <select
                    value={vinylType}
                    onChange={(e: any) => setVinylType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm text-slate-900 dark:text-white outline-none"
                  >
                    <option value="brillante">Vinil Adhesivo Brillante (S/. 35/m²)</option>
                    <option value="mate">Vinil Adhesivo Mate Antireflejo (S/. 35/m²)</option>
                    <option value="microperforado">Vinil Microperforado para Ventanas/Vehículos (S/. 45/m²)</option>
                    <option value="transparente">Vinil Transparente Cristal (S/. 40/m²)</option>
                    <option value="troquelado">Vinil Troquelado con Forma Especial / Stickers (S/. 55/m²)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Cantidad
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={vinylQty}
                      onChange={(e) => setVinylQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm text-slate-900 dark:text-white outline-none"
                    />
                  </div>

                  <div className="flex items-center pt-5">
                    <label className={`flex items-center space-x-2 p-3 rounded-xl border text-xs font-bold cursor-pointer w-full transition-all ${
                      vinylLamination ? "border-[#000273] bg-[#000273]/10 text-[#000273] dark:border-[#FFCC00] dark:bg-[#FFCC00]/10 dark:text-[#FFCC00]" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                    }`}>
                      <input
                        type="checkbox"
                        checked={vinylLamination}
                        onChange={(e) => setVinylLamination(e.target.checked)}
                        className="rounded text-[#000273]"
                      />
                      <span>Protección Laminado Mate (+S/.10/m²)</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* TAMPOGRAPHY CONFIGURATION */}
            {selectedProduct === "tampography" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Número de Tintas / Colores de Impresión
                    </label>
                    <select
                      value={tampographyColors}
                      onChange={(e) => setTampographyColors(parseInt(e.target.value) || 1)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm text-slate-900 dark:text-white outline-none"
                    >
                      <option value={1}>1 Color (S/. 1.50 / unid + S/. 45 Clisé)</option>
                      <option value={2}>2 Colores (S/. 2.20 / unid + S/. 45 Clisé)</option>
                      <option value={3}>3 Colores o más (S/. 3.00 / unid + S/. 45 Clisé)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Cantidad de Unidades (Lapiceros, Tomatodos, etc)
                    </label>
                    <input
                      type="number"
                      min="50"
                      step="50"
                      value={tampographyQty}
                      onChange={(e) => setTampographyQty(Math.max(50, parseInt(e.target.value) || 50))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-800 dark:text-amber-300 font-semibold flex items-center space-x-2">
                  <i className="fa-solid fa-circle-info text-sm shrink-0" />
                  <span>Incluye S/. 45.00 por preparación de matriz de grabado / clisé tampográfico.</span>
                </div>
              </div>
            )}

            {/* MUGS CONFIGURATION */}
            {selectedProduct === "mugs" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Modelo de Taza Sublimada
                    </label>
                    <select
                      value={mugType}
                      onChange={(e: any) => setMugType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm text-slate-900 dark:text-white outline-none"
                    >
                      <option value="blanca">Taza Blanca Cerámica 11oz (S/. 15.00 / unid)</option>
                      <option value="interior_color">Taza con Interior y Asa de Color (S/. 18.00 / unid)</option>
                      <option value="magica">Taza Mágica Termosensible Black (S/. 24.00 / unid)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Cantidad de Tazas
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={mugQty}
                      onChange={(e) => setMugQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ROLLUP CONFIGURATION */}
            {selectedProduct === "rollup" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Dimensiones del Roll-Up
                    </label>
                    <select
                      value={rollupSize}
                      onChange={(e: any) => setRollupSize(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm text-slate-900 dark:text-white outline-none"
                    >
                      <option value="85x200">85 cm x 200 cm (Estructura Estándar S/. 110.00)</option>
                      <option value="100x200">100 cm x 200 cm (Estructura Ancha S/. 135.00)</option>
                      <option value="120x200">120 cm x 200 cm (Estructura XL S/. 165.00)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Cantidad de Estructuras
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={rollupQty}
                      onChange={(e) => setRollupQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* MANUALS / DOCUMENTS CONFIGURATION */}
            {selectedProduct === "manuals" && (
              <div className="space-y-4">
                {/* Size & Quantity of Copies Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Tamaño del Documento
                    </label>
                    <select
                      value={manualSize}
                      onChange={(e: any) => setManualSize(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm text-slate-900 dark:text-white outline-none"
                    >
                      <option value="A4">A4 (21.0 x 29.7 cm) - Estándar Tesis / Manuales</option>
                      <option value="A5">A5 (14.8 x 21.0 cm) - Folleto / Bolsillo</option>
                      <option value="Carta">Carta (21.6 x 27.9 cm) - Formato Ejecutivo</option>
                      <option value="Personalizado">Personalizado (Medidas a Medida)</option>
                    </select>
                  </div>

                  {manualSize === "Personalizado" ? (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Ancho (cm)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          min="5"
                          max="40"
                          value={manualCustomWidth}
                          onChange={(e) => setManualCustomWidth(Math.max(5, parseFloat(e.target.value) || 5))}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm text-slate-900 dark:text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Alto (cm)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          min="5"
                          max="50"
                          value={manualCustomHeight}
                          onChange={(e) => setManualCustomHeight(Math.max(5, parseFloat(e.target.value) || 5))}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm text-slate-900 dark:text-white outline-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          Cantidad de Ejemplares / Juegos
                        </label>
                        <span className="text-[10px] font-bold text-[#000273] dark:text-[#FFCC00]">
                          {manualQuantity === 1 ? "1 juego unitario" : `${manualQuantity} juegos idénticos`}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="1"
                          max="1000"
                          value={manualQuantity}
                          onChange={(e) => setManualQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm text-slate-900 dark:text-white outline-none"
                        />
                        <div className="flex space-x-1 shrink-0">
                          {[1, 2, 5, 10, 20].map((qty) => (
                            <button
                              key={qty}
                              type="button"
                              onClick={() => setManualQuantity(qty)}
                              className={`px-2 py-1 text-[10px] font-extrabold rounded-lg border transition-all ${
                                manualQuantity === qty
                                  ? "bg-[#000273] text-white border-[#000273] dark:bg-[#FFCC00] dark:text-slate-950 dark:border-[#FFCC00]"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
                              }`}
                            >
                              {qty}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {manualSize === "Personalizado" && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Cantidad de Ejemplares / Juegos
                      </label>
                      <span className="text-[10px] font-bold text-[#000273] dark:text-[#FFCC00]">
                        {manualQuantity === 1 ? "1 juego unitario" : `${manualQuantity} juegos`}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        value={manualQuantity}
                        onChange={(e) => setManualQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm text-slate-900 dark:text-white outline-none"
                      />
                      <div className="flex space-x-1 shrink-0">
                        {[1, 2, 5, 10, 20].map((qty) => (
                          <button
                            key={qty}
                            type="button"
                            onClick={() => setManualQuantity(qty)}
                            className={`px-2 py-1 text-[10px] font-extrabold rounded-lg border transition-all ${
                              manualQuantity === qty
                                ? "bg-[#000273] text-white border-[#000273] dark:bg-[#FFCC00] dark:text-slate-950 dark:border-[#FFCC00]"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
                            }`}
                          >
                            {qty}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Pages & Print Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Cantidad de Páginas / Hojas (por ejemplar)
                      </label>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        {manualPages * manualQuantity} págs totales
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="1"
                        max="2000"
                        value={manualPages}
                        onChange={(e) => setManualPages(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm text-slate-900 dark:text-white outline-none"
                      />
                      <div className="flex space-x-1 shrink-0">
                        {[17, 30, 50, 100].map((pgs) => (
                          <button
                            key={pgs}
                            type="button"
                            onClick={() => setManualPages(pgs)}
                            className={`px-2 py-1 text-[10px] font-extrabold rounded-lg border transition-all ${
                              manualPages === pgs
                                ? "bg-[#000273] text-white border-[#000273] dark:bg-[#FFCC00] dark:text-slate-950 dark:border-[#FFCC00]"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
                            }`}
                          >
                            {pgs}p
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Tipo de Impresión
                    </label>
                    <select
                      value={manualPrintType}
                      onChange={(e: any) => setManualPrintType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm text-slate-900 dark:text-white outline-none"
                    >
                      <option value="laser_color">Láser Color (Full Color HD - Alta Fidelidad)</option>
                      <option value="laser_bn">Láser Blanco y Negro (Alta Densidad)</option>
                      <option value="mixto">Mixto (Páginas Color + Páginas B/N)</option>
                    </select>
                  </div>
                </div>

                {/* Substrates: Interior & Cover Paper */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Interior Substrate */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Papel y Gramaje Interior
                    </label>
                    <select
                      value={manualSubstrate}
                      onChange={(e: any) => setManualSubstrate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm text-slate-900 dark:text-white outline-none"
                    >
                      <option value="couche150">Papel Couché 150g (Satinado / Ilustración - Recomendado)</option>
                      <option value="couche115">Papel Couché 115g (Satinado Ligero Catálogos)</option>
                      <option value="couche250">Papel Couché 250g (Cartilla Rígida)</option>
                      <option value="bond75">Papel Bond 75g (Clásico Lectura / Tesis)</option>
                      <option value="opalina180">Opalina 180g (Textura Lisa Premium Diplomas)</option>
                    </select>
                  </div>

                  {/* Cover & Back Cover (Portada y Contraportada) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Portada y Contraportada (Carátula)
                    </label>
                    <select
                      value={manualCover}
                      onChange={(e: any) => setManualCover(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm text-slate-900 dark:text-white outline-none"
                    >
                      <option value="couche250">Portada/Contraportada Couché 250g (+S/. 2.50)</option>
                      <option value="same">Mismo Gramaje que Páginas Interiores</option>
                      <option value="tapadura">Tapa Dura Termolaminada / Empastada (+S/. 30.00)</option>
                      <option value="opalina250">Cartulina Opalina 250g Lisa (+S/. 3.50)</option>
                      <option value="micas_pvc">Micas PVC Transparente + Posterior Pavonada (+S/. 1.50)</option>
                    </select>
                  </div>
                </div>

                {/* Discrete dynamic unit rate preview */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Tarifa calculada:</span>
                    <span className="font-extrabold text-[#000273] dark:text-[#FFCC00]">
                      S/. {(calculation.manualUnitPricePerSheet || 0).toFixed(2)} / hoja
                    </span>
                  </div>
                  {calculation.manualDiscountPercent > 0 ? (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-[10.5px]">
                      -{calculation.manualDiscountPercent}% por volumen
                    </span>
                  ) : (
                    <span className="text-[10.5px] text-slate-400 font-medium">
                      Tarifa unitaria
                    </span>
                  )}
                </div>

                {/* Included Finishes Radio Cards (Single select, mutually exclusive) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Acabado Incluido (Selección única)
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Solo se puede seleccionar un acabado a la vez
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      {
                        id: "espiral_plastico",
                        name: "Espiral Plástico / Espiralado",
                        desc: "Espiral continuo de PVC flexible + micas de protección (Ideal manuales y guías)",
                        badge: "Económico y Flexible",
                      },
                      {
                        id: "anillado_metalico",
                        name: "Anillado Metálico Ring Wire",
                        desc: "Doble espiral metálico Ring-O premium + micas transparentes / pavonadas",
                        badge: "Presentación Ejecutiva",
                      },
                      {
                        id: "empastado_tapadura",
                        name: "Empastado / Tapa Dura",
                        desc: "Tapa dura forrada en cuerina con grabado institucional en pan de oro",
                        badge: "Tesis & Libros",
                      },
                      {
                        id: "engrapado",
                        name: "Engrapado a Caballete",
                        desc: "Doble grapa metálica central en el lomo para cuadernillos y folletos",
                        badge: "Folletos & Revistas",
                      },
                      {
                        id: "solo_compaginado",
                        name: "Solo Compaginado y Corte",
                        desc: "Hojas ordenadas por secuencia y refiladas en guillotina industrial",
                        badge: "En Bloque",
                      },
                      {
                        id: "sin_acabado",
                        name: "Sin Acabado Adicional",
                        desc: "Hojas sueltas impresas sin encuadernar listas para archivar",
                        badge: "Hojas Sueltas",
                      },
                    ].map((finish) => {
                      const isSelected = manualFinish === finish.id;
                      return (
                        <div
                          key={finish.id}
                          onClick={() => selectManualFinish(finish.id)}
                          className={`relative p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start space-x-3 select-none ${
                            isSelected
                              ? "border-[#000273] bg-[#000273]/10 text-[#000273] dark:border-[#FFCC00] dark:bg-[#FFCC00]/15 dark:text-[#FFCC00] shadow-xs scale-[1.01]"
                              : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                          }`}
                        >
                          {/* Radio circle */}
                          <div className="mt-0.5 shrink-0">
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                                isSelected
                                  ? "border-[#000273] bg-[#000273] dark:border-[#FFCC00] dark:bg-[#FFCC00]"
                                  : "border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-800"
                              }`}
                            >
                              {isSelected && (
                                <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-slate-950" />
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col flex-1 min-w-0 pr-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className={`font-bold leading-tight ${isSelected ? "text-[#000273] dark:text-[#FFCC00]" : "text-slate-900 dark:text-white"}`}>
                                {finish.name}
                              </span>
                            </div>
                            <span className="text-[10.5px] font-normal opacity-80 mt-1 leading-snug">
                              {finish.desc}
                            </span>
                            <span className="inline-block mt-1.5 text-[9px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                              {finish.badge}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Global Indications / Suggestions Text Area for ALL products */}
            <div className="border-t border-slate-200/80 dark:border-slate-800 pt-4">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <i className="fa-solid fa-pen-to-square text-[#d5118d]" />
                  <span>Indicaciones Especiales / Sugerencias</span>
                </span>
                <span className="text-[10px] font-normal text-slate-400">Para todos los productos de la web</span>
              </label>
              <textarea
                rows={3}
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="Escribe detalles libres sobre tu pedido (ej: carátula con solapa plastificada mate, dividir en 2 tomos, entrega en Av. Grau 450, instrucciones de corte o perforado)..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-[#000273] dark:focus:border-[#FFCC00] resize-y"
              />
            </div>

            <div className="border-t border-slate-200/80 dark:border-slate-800 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className={`flex items-center space-x-3 p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                isExpress ? "border-[#d5118d] bg-[#d5118d]/10 text-[#d5118d] font-extrabold" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
              }`}>
                <input
                  type="checkbox"
                  checked={isExpress}
                  onChange={(e) => setIsExpress(e.target.checked)}
                  className="rounded text-[#d5118d]"
                />
                <div className="flex flex-col">
                  <span>⚡ Servicio Express Piura (4 Horas)</span>
                  <span className="text-[10px] font-normal opacity-80">+25% Recargo por cola prioritaria</span>
                </div>
              </label>

              <label className={`flex items-center space-x-3 p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                includeIGV ? "border-[#000273] bg-[#000273]/10 text-[#000273] dark:border-[#FFCC00] dark:text-[#FFCC00]" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
              }`}>
                <input
                  type="checkbox"
                  checked={includeIGV}
                  onChange={(e) => setIncludeIGV(e.target.checked)}
                  className="rounded text-[#000273]"
                />
                <div className="flex flex-col">
                  <span>🧾 Incluir IGV (18%) - Factura</span>
                  <span className="text-[10px] font-normal opacity-80">Emisión de Comprobante Electrónico</span>
                </div>
              </label>
            </div>

          </div>
        </div>

        {/* Right Column: Live Summary & Price Counter Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 rounded-2xl sticky top-28 border-2 border-[#000273]/20 dark:border-[#FFCC00]/30 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <span className="text-xs font-black uppercase tracking-widest text-[#d5118d]">
                Resumen de Proforma
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-[#000273]/10 text-[#000273] dark:bg-[#FFCC00]/20 dark:text-[#FFCC00]">
                Imprenta Directa
              </span>
            </div>

            {/* Price Counter Display - Strictly implementing specified Mode Gradients */}
            <div className="my-6 text-center p-6 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-inner">
              <div className="text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-1">
                Inversión Estimada
              </div>
              
              {/* Dynamic Price Title Gradient per Strict Spec Requirement */}
              <div className="text-4xl sm:text-5xl font-black title-gradient tracking-tight my-1">
                S/. {calculation.finalTotal.toFixed(2)}
              </div>

              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {includeIGV ? "Precios incluyen IGV (18%)" : "Precio Subtotal sin IGV"}
              </p>
            </div>

            {/* Specs Summary */}
            <div className="space-y-3 text-xs border-t border-slate-200 dark:border-slate-800 pt-4">
              <div className="flex justify-between text-slate-700 dark:text-slate-200">
                <span className="font-semibold">Producto:</span>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  {PRODUCTS.find((p) => p.id === selectedProduct)?.name}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 font-semibold leading-relaxed border border-slate-200 dark:border-slate-700">
                <i className="fa-solid fa-circle-info text-[#d5118d] mr-1.5" />
                {calculation.descriptionSpecs}
              </div>

              {selectedProduct === "manuals" && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-xs space-y-1.5">
                  <div className="flex justify-between font-bold text-amber-900 dark:text-amber-200">
                    <span>Precio por Hoja:</span>
                    <span className="text-[#000273] dark:text-[#FFCC00] font-black">
                      S/. {(calculation.manualUnitPricePerSheet || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Hojas por Ejemplar:</span>
                    <span className="font-semibold">{manualPages} hojas</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Total Ejemplares:</span>
                    <span className="font-semibold">{manualQuantity} juego{manualQuantity > 1 ? "s" : ""}</span>
                  </div>
                  {calculation.manualDiscountPercent > 0 && (
                    <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-bold">
                      <span>Descuento por Tiraje:</span>
                      <span>-{calculation.manualDiscountPercent}% dto.</span>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-slate-700 dark:text-slate-200 font-semibold">
                  <span>Subtotal Neto:</span>
                  <span className="font-bold text-slate-900 dark:text-white">S/. {calculation.subtotalNoIGV.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-700 dark:text-slate-200 font-semibold">
                  <span>IGV (18%):</span>
                  <span className="font-bold text-slate-900 dark:text-white">S/. {calculation.igvAmount.toFixed(2)}</span>
                </div>
                {isExpress && (
                  <div className="flex justify-between text-[#d5118d] font-bold">
                    <span>Recargo Prioridad Express:</span>
                    <span>+25%</span>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Inputs for Proforma */}
            <div className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-4">
              <input
                type="text"
                placeholder="Tu Nombre / Razón Social (Opcional)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/90 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 outline-none"
              />
              <input
                type="text"
                placeholder="Nombre del Negocio en Piura (Opcional)"
                value={customerCompany}
                onChange={(e) => setCustomerCompany(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/90 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 outline-none"
              />
            </div>

            {/* Active Validation Attached Badge */}
            {activeValidation ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-xs font-black text-emerald-600 dark:text-emerald-400">
                  <span className="flex items-center space-x-1">
                    <i className="fa-solid fa-file-circle-check text-sm" />
                    <span>PDF Validado Vinculado</span>
                  </span>
                  <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-extrabold">
                    {activeValidation.score}/100
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate">
                  {activeValidation.fileName} ({activeValidation.colorSpace}, {activeValidation.dpi} DPI)
                </div>
              </div>
            ) : (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-amber-700 dark:text-amber-300 text-xs font-bold">
                <span className="flex items-center space-x-1.5">
                  <i className="fa-solid fa-triangle-exclamation" />
                  <span>¿Tienes tu archivo PDF listo?</span>
                </span>
                <span className="text-[10px] underline font-extrabold cursor-pointer" onClick={handleGoToValidator}>
                  Validar ahora
                </span>
              </div>
            )}

            {/* Primary Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleGoToValidator}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-[#d5118d] to-[#000273] hover:opacity-95 text-white font-black text-xs shadow-md transition-all cursor-pointer"
              >
                <i className="fa-solid fa-cloud-arrow-up text-sm" />
                <span>Paso 2: Validar PDF de Impresión (Ir al Validador)</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center space-x-2 py-3.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer text-center"
              >
                <i className="fa-brands fa-whatsapp text-lg sm:text-xl shrink-0 leading-none text-white" />
                <span className="leading-tight">Solicitar por WhatsApp (2 PDFs Integrados)</span>
              </a>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => handleDownloadPDF()}
                  className="w-full flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-[#000273] hover:bg-[#000273]/90 dark:bg-[#FFCC00] dark:hover:bg-[#FFCC00]/90 text-white dark:text-slate-950 font-extrabold text-[11px] shadow-xs transition-all cursor-pointer"
                >
                  <i className="fa-solid fa-file-pdf" />
                  <span>PDF Proforma</span>
                </button>

                {activeValidation && (
                  <button
                    onClick={() => downloadBothPDFs(currentQuoteData, activeValidation)}
                    className="w-full flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-[#FFCC00] font-extrabold text-[11px] border border-[#FFCC00]/40 shadow-xs transition-all cursor-pointer"
                  >
                    <i className="fa-solid fa-box-archive" />
                    <span>Descargar 2 PDFs</span>
                  </button>
                )}
              </div>
            </div>

            {showSavedSuccessModal && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs font-bold text-center animate-bounce mt-2">
                ¡PDF Generado y Proforma Guardada con Éxito!
              </div>
            )}

            {/* Saved Proformas Mini List */}
            {savedProformas.length > 0 && (
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-300">
                  Proformas Guardadas ({savedProformas.length})
                </span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {savedProformas.map((prof) => (
                    <div key={prof.id} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-[11px] flex justify-between items-center border border-slate-200 dark:border-slate-700/60">
                      <div className="truncate pr-2">
                        <span className="font-bold text-[#000273] dark:text-[#FFCC00]">{prof.id}:</span>{" "}
                        <span className="text-slate-700 dark:text-slate-200 font-semibold">{prof.customer}</span>
                      </div>
                      <div className="flex items-center space-x-2 shrink-0">
                        <span className="font-extrabold text-slate-900 dark:text-white">
                          S/. {prof.total.toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleDownloadPDF(prof.id)}
                          title="Descargar PDF de esta proforma"
                          className="px-2 py-1 rounded-lg bg-[#000273] text-white dark:bg-[#FFCC00] dark:text-slate-950 text-[10px] font-extrabold hover:opacity-90 cursor-pointer flex items-center space-x-1"
                        >
                          <i className="fa-solid fa-download" />
                          <span>PDF</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Tutorial Modal */}
      {showTutorialModal && (
        <div
          onClick={() => setShowTutorialModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto cursor-default"
          >
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center font-bold text-xl">
                  <i className="fa-solid fa-circle-play" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg sm:text-xl leading-tight">Guía Paso a Paso</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Aprende a cotizar y validar tus trabajos de imprenta</p>
                </div>
              </div>
              <button
                onClick={() => setShowTutorialModal(false)}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-base" />
              </button>
            </div>

            {/* Steps list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center space-x-2 text-[#000273] dark:text-[#FFCC00] font-black text-xs uppercase tracking-wider">
                  <span className="w-6 h-6 rounded-lg bg-[#000273] text-white dark:bg-[#FFCC00] dark:text-slate-950 flex items-center justify-center text-xs">1</span>
                  <span>Selecciona Producto</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  Elige entre Gigantografías, Tarjetas, Volantes, Vinilos o Trípticos para activar sus tarifas base.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center space-x-2 text-[#000273] dark:text-[#FFCC00] font-black text-xs uppercase tracking-wider">
                  <span className="w-6 h-6 rounded-lg bg-[#000273] text-white dark:bg-[#FFCC00] dark:text-slate-950 flex items-center justify-center text-xs">2</span>
                  <span>Configura Medidas</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  Ingresa ancho, alto y cantidad. El sistema calculará el área en m² o millares automáticamente.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center space-x-2 text-[#000273] dark:text-[#FFCC00] font-black text-xs uppercase tracking-wider">
                  <span className="w-6 h-6 rounded-lg bg-[#000273] text-white dark:bg-[#FFCC00] dark:text-slate-950 flex items-center justify-center text-xs">3</span>
                  <span>Revisa Desglose y PDF</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  Visualiza el total con IGV y genera tu Proforma PDF oficial lista para descargar.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center space-x-2 text-[#000273] dark:text-[#FFCC00] font-black text-xs uppercase tracking-wider">
                  <span className="w-6 h-6 rounded-lg bg-[#000273] text-white dark:bg-[#FFCC00] dark:text-slate-950 flex items-center justify-center text-xs">4</span>
                  <span>Valida en Pre-prensa</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  Sube tu archivo gráfico en la pestaña Validador para auditar 300 DPI, modo CMYK FOGRA39 y sangrado de 3mm.
                </p>
              </div>
            </div>

            {/* Footer action */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-3">
              <button
                onClick={() => setShowTutorialModal(false)}
                className="px-6 py-2.5 rounded-xl bg-[#000273] hover:bg-[#000273]/90 text-white dark:bg-[#FFCC00] dark:hover:bg-[#FFCC00]/90 dark:text-slate-950 font-extrabold text-xs transition-all cursor-pointer shadow-md"
              >
                ¡Entendido, empezar a cotizar!
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Catalog Modal */}
      {showCatalogModal && (
        <div
          onClick={() => setShowCatalogModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto cursor-default"
          >
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-[#000273]/10 text-[#000273] dark:bg-[#FFCC00]/20 dark:text-[#FFCC00] flex items-center justify-center font-bold text-xl">
                  <i className="fa-solid fa-book-open" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg sm:text-xl leading-tight">Catálogo de Impresión & Servicios</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Black Graphic - Taller & Pre-prensa Piura</p>
                </div>
              </div>
              <button
                onClick={() => setShowCatalogModal(false)}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-base" />
              </button>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PRODUCTS.map((prod) => (
                <div
                  key={prod.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex flex-col justify-between space-y-3.5 hover:border-[#000273] dark:hover:border-[#FFCC00] transition-all group shadow-xs"
                >
                  <div className="space-y-3">
                    {/* Visual Reference Image Container (1.5 aspect ratio style: full width + proportional height) */}
                    <div className="relative w-full h-36 sm:h-40 rounded-xl overflow-hidden bg-slate-900 border border-slate-200/50 dark:border-slate-700/50">
                      {prod.imageUrl ? (
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-800 text-slate-400">
                          <i className={`${prod.icon} text-4xl mb-2 text-[#FFCC00]`} />
                          <span className="text-xs font-bold">Muestra Gráfica</span>
                        </div>
                      )}

                      {/* Top Right Product Icon Badge */}
                      <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-lg bg-slate-950/70 backdrop-blur-md text-[#FFCC00] flex items-center justify-center text-sm border border-white/20 shadow-md">
                        <i className={prod.icon} />
                      </div>

                      {/* Bottom Gradient Overlay with Label */}
                      <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex items-center justify-between text-white">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-500/30">
                          Referencia Visual
                        </span>
                        <span className="text-xs font-black text-white">
                          S/. {prod.basePrice.toFixed(2)} /{prod.unitLabel}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 text-[#000273] dark:text-[#FFCC00] mb-1">
                        <span className="font-extrabold text-base text-slate-900 dark:text-white">{prod.name}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                        {prod.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/50 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-slate-400">
                      Tarifa desde: <strong className="text-slate-900 dark:text-white font-extrabold">S/. {prod.basePrice.toFixed(2)}</strong>
                    </span>
                    <button
                      onClick={() => {
                        setSelectedProduct(prod.id);
                        setShowCatalogModal(false);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#000273] hover:bg-[#000273]/90 text-white dark:bg-[#FFCC00] dark:hover:bg-[#FFCC00]/90 dark:text-slate-950 font-black text-xs transition-all cursor-pointer shadow-xs active:scale-95 flex items-center space-x-1"
                    >
                      <span>Cotizar</span>
                      <i className="fa-solid fa-arrow-right text-[10px]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Catalog WhatsApp CTA */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                ¿Necesitas un proyecto especial o volumen corporativo?
              </div>
              <a
                href="https://wa.me/51906604475?text=Hola%20Black%20Graphic%2C%20quisiera%20solicitar%20el%20cat%C3%A1logo%20completo%20de%20servicios."
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer shrink-0"
              >
                <i className="fa-brands fa-whatsapp text-sm" />
                <span>Consultar Catálogo por WhatsApp</span>
              </a>
            </div>

          </div>
        </div>
      )}

      {/* Visual Guide / Help (?) Modal */}
      {helpModalProduct && (
        <div
          onClick={() => setHelpModalProduct(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 text-slate-900 dark:text-white max-h-[92vh] overflow-y-auto cursor-default"
          >
            {(() => {
              const helpProd = PRODUCTS.find((p) => p.id === helpModalProduct);
              if (!helpProd) return null;
              const examples = helpProd.examples || [];

              return (
                <>
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#000273]/10 text-[#000273] dark:bg-[#FFCC00]/20 dark:text-[#FFCC00] flex items-center justify-center font-bold text-xl shadow-xs">
                        <i className={helpProd.icon} />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-extrabold text-lg sm:text-xl leading-tight">
                            Guía Visual & Proyectos: {helpProd.name}
                          </h3>
                          <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            Referencia Técnica
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                          Muestras visuales de acabados y tipos de proyectos que puedes realizar bajo esta configuración
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setHelpModalProduct(null)}
                      className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-all cursor-pointer"
                    >
                      <i className="fa-solid fa-xmark text-base" />
                    </button>
                  </div>

                  {/* Examples Grid: Pure Visual Reference Blocks */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {examples.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 flex flex-col justify-between space-y-3 shadow-xs hover:border-[#000273]/50 dark:hover:border-[#FFCC00]/50 transition-all group"
                      >
                        <div className="space-y-3">
                          {/* Reference Photo */}
                          <div className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden bg-slate-950 border border-slate-200/40 dark:border-slate-700/40">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-slate-900 to-slate-800 text-slate-400">
                                <i className="fa-solid fa-image text-3xl mb-2 text-[#FFCC00]" />
                                <span className="text-xs font-semibold">Muestra de Taller</span>
                              </div>
                            )}

                            {/* Overlay Badge */}
                            <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-amber-300 border border-amber-500/30 shadow-md">
                              Ejemplo #{idx + 1}
                            </div>

                            {item.recommendedFinish && (
                              <div className="absolute bottom-2.5 inset-x-2.5 p-2 rounded-lg bg-slate-950/85 backdrop-blur-md text-white border border-white/10 shadow-lg">
                                <div className="text-[9px] font-black uppercase tracking-wider text-[#FFCC00]">
                                  Acabado Recomendado:
                                </div>
                                <div className="text-[11px] font-bold truncate">
                                  {item.recommendedFinish}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Info Block */}
                          <div>
                            <h4 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug">
                              {item.title}
                            </h4>
                            {item.subtitle && (
                              <p className="text-xs font-bold text-[#000273] dark:text-[#FFCC00] mt-0.5">
                                {item.subtitle}
                              </p>
                            )}
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium mt-2">
                              {item.context || item.description}
                            </p>
                          </div>
                        </div>

                        {/* Tags */}
                        {item.tags && item.tags.length > 0 && (
                          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/50 flex flex-wrap gap-1.5">
                            {item.tags.map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-200/70 dark:bg-slate-700/70 text-slate-700 dark:text-slate-300"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Tarifa base desde: <strong className="text-slate-900 dark:text-white font-black">S/. {helpProd.basePrice.toFixed(2)} /{helpProd.unitLabel}</strong>
                    </div>

                    <div className="flex items-center space-x-2.5 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setHelpModalProduct(null)}
                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-extrabold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                      >
                        Cerrar Guía
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProduct(helpProd.id);
                          setHelpModalProduct(null);
                        }}
                        className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#000273] hover:bg-[#000273]/90 text-white dark:bg-[#FFCC00] dark:hover:bg-[#FFCC00]/90 dark:text-slate-950 font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                      >
                        <i className="fa-solid fa-sliders text-xs" />
                        <span>Configurar esta Proforma</span>
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
