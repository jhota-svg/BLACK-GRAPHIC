import { jsPDF } from "jspdf";
import { QuoteData, ValidationResult } from "../types";

export const COMPANY_PHONE = "+51 906604475";
export const COMPANY_WHATSAPP_NUM = "51906604475";

/**
 * Generates and downloads the Official Quote Proforma PDF
 */
export function downloadProformaPDF(quote: QuoteData): void {
  const pId = quote.proformaId || `PROF-${Math.floor(10000 + Math.random() * 90000)}`;
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Dark Blue Header Bar
  doc.setFillColor(0, 2, 115);
  doc.rect(0, 0, 210, 38, "F");

  // Yellow Accent Bar
  doc.setFillColor(255, 204, 0);
  doc.rect(0, 38, 210, 3, "F");

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("BLACK GRAPHIC", 14, 18);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("ESTUDIO DE IMPRESIÓN & PRE-PRENSA DIGITAL", 14, 25);
  doc.text(`Av. Grau, Zona Centro - Piura, Perú | Tel/WhatsApp: ${COMPANY_PHONE}`, 14, 31);

  // Proforma Badge Box
  doc.setFillColor(255, 204, 0);
  doc.roundedRect(138, 9, 58, 20, 3, 3, "F");
  doc.setTextColor(3, 6, 23);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("PROFORMA OFICIAL", 142, 16);
  doc.setFontSize(10);
  doc.text(`N°: ${pId}`, 142, 23);

  // Date & Location Info
  const currentDate = new Date().toLocaleDateString("es-PE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("INFORMACIÓN DE EMISIÓN", 14, 50);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Fecha: ${currentDate}`, 14, 57);
  doc.text("Validez: 7 Días Calendario", 14, 63);
  doc.text("Atención: Taller Central Piura", 14, 69);

  // Customer Box Right
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(108, 44, 88, 30, 3, 3, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(0, 2, 115);
  doc.text("DATOS DEL CLIENTE", 113, 51);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text(`Cliente: ${quote.customerName || "Cliente General"}`, 113, 58);
  doc.text(`Empresa / Negocio: ${quote.customerCompany || "No especificado"}`, 113, 64);
  doc.text("Ciudad: Piura - Perú", 113, 70);

  // Service Table Header
  let y = 82;
  doc.setFillColor(0, 2, 115);
  doc.rect(14, y, 182, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("DETALLE Y ESPECIFICACIONES TÉCNICAS", 18, y + 6.5);
  doc.text("MODALIDAD", 130, y + 6.5);
  doc.text("IMPORTE (S/.)", 168, y + 6.5);

  // Table Content Box
  y += 10;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.rect(14, y, 182, 38, "D");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(quote.productName, 18, y + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  const splitSpecs = doc.splitTextToSize(quote.descriptionSpecs, 105);
  doc.text(splitSpecs, 18, y + 15);

  // Priority Column
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  if (quote.isExpress) {
    doc.setTextColor(213, 17, 141);
    doc.text("Express (4 hrs)", 130, y + 8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text("Atención prioritaria", 130, y + 14);
  } else {
    doc.setTextColor(16, 185, 129);
    doc.text("Estándar (24-48h)", 130, y + 8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text("Cola regular", 130, y + 14);
  }

  // Price Column
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(`S/. ${quote.finalTotal.toFixed(2)}`, 168, y + 8);

  // Economic Summary Box & Special Notes Box
  y += 45;

  // Left Box: Special Notes or Quality Badge
  if (quote.specialNotes && quote.specialNotes.trim()) {
    doc.setFillColor(254, 249, 195);
    doc.setDrawColor(234, 179, 8);
    doc.roundedRect(14, y, 88, 36, 3, 3, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(161, 98, 7);
    doc.text("INDICACIONES ESPECIALES DEL CLIENTE", 18, y + 7);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    const splitNotes = doc.splitTextToSize(quote.specialNotes.trim(), 80);
    doc.text(splitNotes.slice(0, 5), 18, y + 13);
  } else {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(14, y, 88, 36, 3, 3, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(0, 2, 115);
    doc.text("COMPROMISO DE CALIDAD PIURA", 18, y + 7);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text("• Impresión con tintas originales y alta definición.", 18, y + 14);
    doc.text("• Calibración de color CMYK ISO en taller Piura.", 18, y + 20);
    doc.text("• Asesoría técnica directa de Pre-Prensa.", 18, y + 26);
  }

  // Right Box: Financial Summary
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(108, y, 88, 36, 3, 3, "FD");

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text("Subtotal Neto:", 113, y + 9);
  doc.text(`S/. ${quote.subtotalNoIGV.toFixed(2)}`, 190, y + 9, { align: "right" });

  doc.text("IGV (18%):", 113, y + 16);
  doc.text(`S/. ${quote.igvAmount.toFixed(2)}`, 190, y + 16, { align: "right" });

  if (quote.isExpress) {
    doc.text("Recargo Express (25%):", 113, y + 22);
    doc.text("Incluido", 190, y + 22, { align: "right" });
  }

  doc.setDrawColor(203, 213, 225);
  doc.line(113, y + 25, 190, y + 25);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(0, 2, 115);
  doc.text("TOTAL A INVERTIR:", 113, y + 31);
  doc.text(`S/. ${quote.finalTotal.toFixed(2)}`, 190, y + 31, { align: "right" });

  // Terms and Guarantee Section
  y += 42;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, y, 182, 34, 3, 3, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("TÉRMINOS Y CONDICIONES DE IMPRENTA EN PIURA", 18, y + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text("1. Para iniciar el trabajo en taller se requiere la aprobación del arte final en CMYK y adelanto del 50%.", 18, y + 14);
  doc.text("2. Verifique la ortografía, resolución (300 DPI) y márgenes de corte antes de dar la conformidad.", 18, y + 19);
  doc.text("3. Envíos y entregas a domicilio disponibles previa coordinación en la ciudad de Piura y alrededores.", 18, y + 24);
  doc.text("4. Proforma generada automáticamente por el sistema de Pre-Prensa de Black Graphic.", 18, y + 29);

  // Footer Bar
  doc.setFillColor(0, 2, 115);
  doc.rect(0, 282, 210, 15, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("BLACK GRAPHIC PIURA - GARANTÍA DE CALIDAD Y COLOR EN IMPRESIÓN DIGITAL", 105, 290, { align: "center" });

  doc.save(`1_Proforma_BlackGraphic_${pId}.pdf`);
}

/**
 * Generates and downloads the Technical Preflight Validation Report PDF
 */
export function downloadPreflightPDF(
  quote: QuoteData | null,
  validation: ValidationResult
): void {
  const pId = quote?.proformaId || `PRE-${Math.floor(10000 + Math.random() * 90000)}`;
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Dark Pink/Magenta & Blue Header Bar
  doc.setFillColor(213, 17, 141); // #d5118d
  doc.rect(0, 0, 210, 38, "F");

  // Yellow Accent Bar
  doc.setFillColor(255, 204, 0);
  doc.rect(0, 38, 210, 3, "F");

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("BLACK GRAPHIC", 14, 18);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("REPORTE TÉCNICO DE VALIDACIÓN DE PRE-PRENSA DIGITAL", 14, 25);
  doc.text(`Av. Grau, Zona Centro - Piura, Perú | Tel/WhatsApp: ${COMPANY_PHONE}`, 14, 31);

  // Score Badge Box
  doc.setFillColor(255, 204, 0);
  doc.roundedRect(138, 9, 58, 20, 3, 3, "F");
  doc.setTextColor(3, 6, 23);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("PUNTAJE DE ARTE", 142, 16);
  doc.setFontSize(13);
  doc.text(`${validation.score} / 100`, 142, 23);

  // File Metadata Section
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("INFORMACIÓN DEL ARCHIVO ANALIZADO", 14, 50);

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, 54, 182, 32, 3, 3, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(0, 2, 115);
  doc.text(`Nombre de Archivo: ${validation.fileName}`, 18, 61);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(`• Tamaño: ${validation.fileSizeMb} MB`, 18, 67);
  doc.text(`• Perfil de Color: ${validation.colorSpace} ${validation.colorSpace === "CMYK" ? "(Aprobado para Impresión)" : "(Convertible)"}`, 18, 73);
  doc.text(`• Resolución de Imagen: ${validation.dpi} DPI`, 18, 79);

  doc.text(`• Demasía de Corte (Bleed): ${validation.hasBleed ? `${validation.bleedMarginMm} mm OK` : "0 mm (Falta Sangrado)"}`, 108, 67);
  doc.text(`• Dimensiones: ${validation.dimensionsPx.width} x ${validation.dimensionsPx.height} px`, 108, 73);
  if (quote) {
    doc.text(`• Cotización Vinculada: N° ${quote.proformaId} (${quote.productName})`, 108, 79);
  } else {
    doc.text(`• Cotización Vinculada: Sin cotización previa`, 108, 79);
  }

  // Diagnostics Table Header
  let y = 94;
  doc.setFillColor(0, 2, 115);
  doc.rect(14, y, 182, 9, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("DIAGNÓSTICO TÉCNICO DE TALLER & SOLUCIONES", 18, y + 6);

  y += 9;

  validation.issues.forEach((issue) => {
    // Determine color background
    if (issue.type === "success") {
      doc.setFillColor(240, 253, 244);
      doc.setDrawColor(187, 247, 208);
    } else if (issue.type === "warning") {
      doc.setFillColor(254, 252, 232);
      doc.setDrawColor(254, 240, 138);
    } else {
      doc.setFillColor(254, 242, 242);
      doc.setDrawColor(254, 202, 202);
    }

    doc.roundedRect(14, y + 3, 182, 26, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    if (issue.type === "success") doc.setTextColor(22, 101, 52);
    else if (issue.type === "warning") doc.setTextColor(133, 77, 14);
    else doc.setTextColor(153, 27, 27);

    const prefix = issue.type === "success" ? "✓ APROBADO: " : issue.type === "warning" ? "⚠️ ADVERTENCIA: " : "✖ ERROR CRÍTICO: ";
    doc.text(`${prefix}${issue.title}`, 18, y + 9);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    const splitDesc = doc.splitTextToSize(issue.description, 174);
    doc.text(splitDesc, 18, y + 15);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 116, 139);
    doc.text(`Recomendación: ${issue.recommendation}`, 18, y + 24);

    y += 28;
  });

  // Stamp Box bottom
  y = Math.max(y + 8, 220);
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, 182, 35, 3, 3, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(0, 2, 115);
  doc.text("DICTAMEN FINAL DE PRE-PRENSA - TALLER BLACK GRAPHIC PIURA", 18, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  if (validation.score >= 80) {
    doc.text("AUTORIZADO: El archivo cumple los estándares de color y resolución requeridos.", 18, y + 14);
    doc.text("Pasa directamente a la cola de Rip y calibración de plotter Roland / Offset.", 18, y + 19);
  } else {
    doc.text("OBSERVADO: El archivo presenta observaciones técnicas que pueden afectar la impresión.", 18, y + 14);
    doc.text("Revisar las sugerencias antes de dar la conformidad de impresión en taller.", 18, y + 19);
  }

  doc.text(`Atendido por: Dpto. de Pre-Prensa Digital Piura | Fecha: ${new Date().toLocaleDateString()}`, 18, y + 26);

  // Footer Bar
  doc.setFillColor(0, 2, 115);
  doc.rect(0, 282, 210, 15, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("BLACK GRAPHIC PIURA - CONTROL TÉCNICO DE CALIDAD DE IMPRESIÓN DIGITAL", 105, 290, { align: "center" });

  doc.save(`2_Reporte_PrePrensa_BlackGraphic_${pId}.pdf`);
}

/**
 * Downloads both PDFs (Quote Proforma + Technical Preflight Report)
 */
export function downloadBothPDFs(
  quote: QuoteData,
  validation: ValidationResult
): void {
  downloadProformaPDF(quote);
  setTimeout(() => {
    downloadPreflightPDF(quote, validation);
  }, 400);
}
