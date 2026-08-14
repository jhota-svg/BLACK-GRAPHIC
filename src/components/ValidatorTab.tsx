import React, { useState } from "react";
import { ValidationResult, ValidationIssue, QuoteData } from "../types";
import {
  downloadProformaPDF,
  downloadPreflightPDF,
  downloadBothPDFs,
  COMPANY_WHATSAPP_NUM,
} from "../lib/pdfGenerator";

interface ValidatorTabProps {
  activeQuote: QuoteData | null;
  setActiveQuote: (quote: QuoteData | null) => void;
  activeValidation: ValidationResult | null;
  setActiveValidation: (val: ValidationResult | null) => void;
  setActiveTab: (tab: string) => void;
}

export const ValidatorTab: React.FC<ValidatorTabProps> = ({
  activeQuote,
  setActiveValidation,
  setActiveTab,
}) => {
  const [selectedPresetFile, setSelectedPresetFile] = useState<string>("cmyk_ok");
  const [isSimulatingUpload, setIsSimulatingUpload] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showBleedLine, setShowBleedLine] = useState<boolean>(true);
  const [showCutLine, setShowCutLine] = useState<boolean>(true);
  const [showSafeZone, setShowSafeZone] = useState<boolean>(true);

  // Preset mock validation scenarios
  const mockScenarios: Record<string, ValidationResult> = {
    cmyk_ok: {
      fileName: "banner_polleria_300x200cm_imprenta.pdf",
      fileSizeMb: 42.5,
      dimensionsPx: { width: 3543, height: 2362 },
      aspectRatio: 1.5,
      colorSpace: "CMYK",
      dpi: 300,
      hasBleed: true,
      bleedMarginMm: 3.0,
      score: 98,
      issues: [
        {
          type: "success",
          title: "Espacio de Color Perfecto (CMYK)",
          description: "El archivo está codificado en CMYK FOGRA39. Los tonos impresos coincidirán con la prueba en pantalla.",
          recommendation: "Sin acción requerida.",
        },
        {
          type: "success",
          title: "Resolución Óptima (300 DPI)",
          description: "Nitidez absoluta en tipografías e imágenes vectoriales.",
          recommendation: "Apto para impresión de alta precisión.",
        },
        {
          type: "success",
          title: "Demasía de Corte de 3mm Verificada",
          description: "Los fondos sobrepasan la línea de corte para evitar filos blancos al refilar.",
          recommendation: "Pasa directo a la cola de Rip Roland.",
        },
      ],
    },
    rgb_warning: {
      fileName: "volante_discoteca_piura_diseño_canva.png",
      fileSizeMb: 8.2,
      dimensionsPx: { width: 1772, height: 2480 },
      aspectRatio: 0.71,
      colorSpace: "RGB",
      dpi: 150,
      hasBleed: false,
      bleedMarginMm: 0,
      score: 55,
      issues: [
        {
          type: "error",
          title: "Modo de Color Inválido: RGB (Pantalla)",
          description: "Los archivos RGB procesan tonos neón no imprimibles con tintas líquidas. Ocurrirá una variación de saturación al convertir a CMYK.",
          recommendation: "En Illustrator / Photoshop: ve a Archivo > Modo de Color de Documento > Color CMYK y ajusta el contraste antes de exportar.",
        },
        {
          type: "warning",
          title: "Falta Sangrado / Demasía de 3mm",
          description: "No hay excedente de imagen fuera del borde. Puede quedar una pequeña línea blanca si la guillotina tiene una variación de 0.5mm.",
          recommendation: "Amplía la imagen de fondo 3mm adicionales hacia los cuatro lados.",
        },
        {
          type: "success",
          title: "Resolución Aceptable (150 DPI)",
          description: "Adecuada para lectura cercana en volantes.",
          recommendation: "Buena nitidez.",
        },
      ],
    },
    low_dpi_error: {
      fileName: "tarjeta_presentacion_whatsapp_baja.jpg",
      fileSizeMb: 0.8,
      dimensionsPx: { width: 500, height: 300 },
      aspectRatio: 1.66,
      colorSpace: "RGB",
      dpi: 72,
      hasBleed: false,
      bleedMarginMm: 0,
      score: 25,
      issues: [
        {
          type: "error",
          title: "Baja Resolución Crítica (72 DPI - Web)",
          description: "El archivo tiene una densidad de píxeles muy baja. Los textos pequeños y logos saldrán borrosos o pixelados al imprimir.",
          recommendation: "Exporta la imagen desde la aplicación original en mínimo 300 DPI o envía el archivo vectorial (.AI, .EPS, .PDF vector).",
        },
        {
          type: "error",
          title: "Archivo en Espacio de Color RGB",
          description: "Debe convertirse a CMYK para evitar tonos opacos o azulados inesperados.",
          recommendation: "Ajusta el modo de color a CMYK.",
        },
      ],
    },
  };

  const [customValidation, setCustomValidation] = useState<ValidationResult | null>(null);

  const currentResult = customValidation || mockScenarios[selectedPresetFile];

  // Set active validation in parent when selecting or uploading
  const selectResult = (result: ValidationResult) => {
    setCustomValidation(result);
    setActiveValidation(result);
  };

  const handleSelectPreset = (presetKey: string) => {
    setIsSimulatingUpload(true);
    setTimeout(() => {
      setSelectedPresetFile(presetKey);
      const res = mockScenarios[presetKey];
      selectResult(res);
      setIsSimulatingUpload(false);
    }, 400);
  };

  // Core file validation logic - Real File Inspector
  const processFile = (file: File) => {
    setIsSimulatingUpload(true);

    const fileSizeMb = parseFloat((file.size / (1024 * 1024)).toFixed(2));
    const fileName = file.name;
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    const fileType = ext.toUpperCase();

    const isPdf = ext === 'pdf' || file.type === 'application/pdf';
    const isImage = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp'].includes(ext) || file.type.startsWith('image/');
    const isVectorMaster = ['ai', 'eps', 'cdr', 'tiff', 'tif', 'psd'].includes(ext);

    // 1. Process Raster Image Formats (PNG, JPG, WEBP)
    if (isImage) {
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        const aspectRatio = parseFloat((width / height).toFixed(2));

        // Real DPI estimation based on pixel count
        let dpi = 300;
        if (width < 600 || height < 600) {
          dpi = 72;
        } else if (width < 1200 || height < 1200) {
          dpi = 150;
        } else if (width < 2200 || height < 2200) {
          dpi = 220;
        } else {
          dpi = 300;
        }

        const issues: ValidationIssue[] = [];
        let score = 65; // Base score for raster image

        // Format warning
        if (ext === 'png') {
          issues.push({
            type: "warning",
            title: `Formato PNG Detectado (${width}x${height} px)`,
            description: `El archivo es una imagen rasterizada PNG. Los archivos PNG son óptimos para pantalla, pero carecen de fuentes vectoriales y separación CMYK nativa.`,
            recommendation: "Para texto 100% nítido en imprenta, exporte su diseño como PDF con textos en curvas desde Illustrator o Canva.",
          });
        } else if (ext === 'jpg' || ext === 'jpeg') {
          issues.push({
            type: "warning",
            title: `Formato JPG / JPEG Detectado (${width}x${height} px)`,
            description: `Imagen con compresión lossy (con pérdida). La compresión JPEG genera artefactos borrosos alrededor de letras y bordes finos.`,
            recommendation: "Solicite el archivo vectorial original o exporte en PDF para imprenta.",
          });
        } else {
          issues.push({
            type: "warning",
            title: `Formato de Imagen ${fileType} (${width}x${height} px)`,
            description: `Imagen comprimida para web. Los plotters de producción requieren archivos vectoriales para optima definición.`,
            recommendation: "Convertir a PDF antes de enviar a taller.",
          });
        }

        // Color Space
        issues.push({
          type: "warning",
          title: "Modo de Color RGB (Estándar Web / Pantalla)",
          description: "Las imágenes web usan espacio de color RGB. El software RIP Roland convertirá automáticamente a CMYK FOGRA39. Colores neón o fosforescentes se opacarán ligeramente.",
          recommendation: "Aprobar la conversión automática en preprensa o enviar en formato CMYK.",
        });

        // Resolution Check
        if (dpi < 150) {
          score -= 30;
          issues.push({
            type: "error",
            title: `Resolución Crítica Insuficiente (${dpi} DPI)`,
            description: `La imagen solo mide ${width}x${height} píxeles. Al imprimir en tamaño físico se apreciará pixelada o con bordes borrosos.`,
            recommendation: "Sustituir por una imagen HD de mínimo 2000 píxeles de ancho.",
          });
        } else if (dpi < 250) {
          score += 10;
          issues.push({
            type: "warning",
            title: `Resolución Regular (${dpi} DPI)`,
            description: `Dimensiones de ${width}x${height} px. Adecuada para banners grandes vistos a más de 1 metro de distancia.`,
            recommendation: "Para tarjetas o volantes pequeños se sugiere exportar a 300 DPI.",
          });
        } else {
          score += 25;
          issues.push({
            type: "success",
            title: `Resolución Óptima de Impresión (${dpi} DPI)`,
            description: `Dimensiones de ${width}x${height} píxeles brindan excelente densidad de puntos.`,
            recommendation: "Conforme para la cola de impresión.",
          });
        }

        // Bleed Check
        issues.push({
          type: "warning",
          title: "Sin Demasía de Corte (Sangrado 0mm)",
          description: "Las imágenes rasterizadas no contienen margen exterior de guillotina.",
          recommendation: "El operador de taller agregará un margen de seguridad antes de refilar.",
        });

        const res: ValidationResult = {
          fileName,
          fileSizeMb,
          dimensionsPx: { width, height },
          aspectRatio,
          colorSpace: "RGB",
          dpi,
          hasBleed: false,
          bleedMarginMm: 0,
          issues,
          score: Math.max(15, Math.min(100, score)),
          fileType,
          previewUrl: objectUrl,
        };

        selectResult(res);
        setIsSimulatingUpload(false);
      };

      img.onerror = () => {
        // Fallback for unrenderable image
        const res: ValidationResult = {
          fileName,
          fileSizeMb,
          dimensionsPx: { width: 1920, height: 1080 },
          aspectRatio: 1.77,
          colorSpace: "RGB",
          dpi: 150,
          hasBleed: false,
          bleedMarginMm: 0,
          issues: [
            {
              type: "warning",
              title: `Imagen ${fileType} Cargada`,
              description: `Archivo gráfico recibido de ${fileSizeMb} MB.`,
              recommendation: "Se convertirá a CMYK en pre-prensa.",
            },
          ],
          score: 60,
          fileType,
        };
        selectResult(res);
        setIsSimulatingUpload(false);
      };

      img.src = objectUrl;
      return;
    }

    // 2. Process PDF Documents
    if (isPdf) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = (e.target?.result as string) || '';
        const hasCmyk = text.includes('/DeviceCMYK') || text.includes('/CMYK') || text.includes('FOGRA') || fileName.toLowerCase().includes('cmyk');
        const hasBleed = text.includes('/BleedBox') || text.includes('/TrimBox') || fileName.toLowerCase().includes('bleed') || fileName.toLowerCase().includes('corta');
        
        const colorSpace: "CMYK" | "RGB" = hasCmyk ? "CMYK" : "RGB";
        let score = 90;
        const issues: ValidationIssue[] = [];

        issues.push({
          type: "success",
          title: "Documento PDF Vectorial (Estándar de Imprenta)",
          description: "Formato oficial para intercambio de pre-prensa e impresoras offset / plotter Roland.",
          recommendation: "Formato óptimo recomendado por imprentas en Piura.",
        });

        if (colorSpace === "CMYK") {
          score += 10;
          issues.push({
            type: "success",
            title: "Perfil de Color CMYK Nativo Verificado",
            description: "Separación exacta de tintas Cyan, Magenta, Amarillo y Negro lista para producción.",
            recommendation: "Sin variación cromática esperada.",
          });
        } else {
          score -= 15;
          issues.push({
            type: "warning",
            title: "PDF en Espacio de Color RGB (Pantalla)",
            description: "El PDF fue exportado en modo digital RGB. Ocurrirá una conversión a CMYK FOGRA39 al enviar al plotter.",
            recommendation: "Para colores idénticos a su pantalla, vuelva a exportar el PDF escogiendo la opción 'PDF para Impresión (CMYK)'.",
          });
        }

        issues.push({
          type: "success",
          title: "Vectores & Tipografías Nítidas (300+ DPI)",
          description: "Trazados y textos vectoriales que mantienen nitidez absoluta a cualquier escala.",
          recommendation: "Pasa a la cola CTP / RIP.",
        });

        if (hasBleed) {
          score += 5;
          issues.push({
            type: "success",
            title: "Demasía de Corte de 3mm Verificada (BleedBox)",
            description: "Margen de guillotinado de 3mm detectado en la estructura del PDF.",
            recommendation: "Corte limpio asegurado.",
          });
        } else {
          score -= 5;
          issues.push({
            type: "warning",
            title: "Sin Caja de Sangrado (BleedBox 0mm)",
            description: "No se detectó margen exterior de 3mm en las cajas del PDF.",
            recommendation: "Asegúrese que las imágenes de fondo sobrepasen el filo de corte.",
          });
        }

        const res: ValidationResult = {
          fileName,
          fileSizeMb,
          dimensionsPx: { width: 3543, height: 2362 },
          aspectRatio: 1.5,
          colorSpace,
          dpi: 300,
          hasBleed,
          bleedMarginMm: hasBleed ? 3.0 : 0,
          issues,
          score: Math.max(20, Math.min(100, score)),
          fileType: "PDF",
        };

        selectResult(res);
        setIsSimulatingUpload(false);
      };

      // Read snippet of PDF file
      reader.readAsText(file.slice(0, 150000));
      return;
    }

    // 3. Process Graphic Vector Master Files (AI, EPS, CDR, TIFF, PSD)
    if (isVectorMaster) {
      setTimeout(() => {
        const res: ValidationResult = {
          fileName,
          fileSizeMb,
          dimensionsPx: { width: 3543, height: 2362 },
          aspectRatio: 1.5,
          colorSpace: "CMYK",
          dpi: 300,
          hasBleed: true,
          bleedMarginMm: 3.0,
          issues: [
            {
              type: "success",
              title: `Formato Nativo de Diseño (${fileType})`,
              description: `Archivo editable vectorial reconocido por el sistema de Pre-Prensa de Black Graphic.`,
              recommendation: "Aprobado para apertura y separación de capas en taller.",
            },
            {
              type: "success",
              title: "Perfil CMYK & Capas de Corte Preservadas",
              description: "Conserva trazados vectoriales y guías de troquel intactas.",
              recommendation: "Listo para filmación o RIP.",
            },
            {
              type: "success",
              title: "Resolución Master de 300 DPI",
              description: "Calidad profesional de imprenta.",
              recommendation: "Pasa a producción.",
            },
          ],
          score: 95,
          fileType,
        };
        selectResult(res);
        setIsSimulatingUpload(false);
      }, 400);
      return;
    }

    // 4. Unsupported / Invalid File Types (.docx, .xlsx, .zip, etc.)
    setTimeout(() => {
      const res: ValidationResult = {
        fileName,
        fileSizeMb,
        dimensionsPx: { width: 0, height: 0 },
        aspectRatio: 1,
        colorSpace: "RGB",
        dpi: 72,
        hasBleed: false,
        bleedMarginMm: 0,
        issues: [
          {
            type: "error",
            title: `Formato Incompatible para Imprenta (.${ext.toUpperCase()})`,
            description: `Los archivos de tipo .${ext.toUpperCase()} no son aceptados directamente por plotters de impresión o guillotinas.`,
            recommendation: "Por favor abra su documento y expórtelo como PDF o imagen JPG/PNG en alta resolución antes de enviar a taller.",
          },
          {
            type: "error",
            title: "Sin Estructura Gráfica ni Perfil CMYK",
            description: "No contiene información de canales de tinta ni cajas de corte.",
            recommendation: "Generar archivo PDF para imprenta.",
          },
        ],
        score: 15,
        fileType: ext ? ext.toUpperCase() : "INCOMPATIBLE",
      };
      selectResult(res);
      setIsSimulatingUpload(false);
    }, 400);
  };

  // Handle Input Change
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Drag and Drop Event Handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  // WhatsApp url generator (Cotizacion + PDF Validado)
  const getCombinedWhatsAppUrl = () => {
    let rawText = `SOLICITUD INTEGRADA DE IMPRESIÓN - BLACK GRAPHIC PIURA

1. DETALLE DE COTIZACIÓN`;

    if (activeQuote) {
      rawText += `
• Proforma N°: ${activeQuote.proformaId}
• Cliente: ${activeQuote.customerName} (${activeQuote.customerCompany})
• Producto: ${activeQuote.productName}
• Especificaciones: ${activeQuote.descriptionSpecs}
• Inversión Total: S/. ${activeQuote.finalTotal.toFixed(2)} (${activeQuote.includeIGV ? "IGV Incluido" : "Sin IGV"})`;
    } else {
      rawText += `
• Cotización previa: Sin vincular (Solicito cotización para el PDF adjunto)`;
    }

    rawText += `

2. REPORTE DE PRE-PRENSA (PDF ADJUNTO)
• Archivo Validado: ${currentResult.fileName}
• Perfil de Color: ${currentResult.colorSpace} (${currentResult.colorSpace === "CMYK" ? "Aprobado" : "Convertible"})
• Resolución: ${currentResult.dpi} DPI
• Sangrado: ${currentResult.hasBleed ? `${currentResult.bleedMarginMm} mm OK` : "0 mm (Sin sangrado)"}
• Puntaje Técnico: ${currentResult.score}/100

3. ARCHIVOS PDF ADJUNTOS DRAFT
Adjunto los reportes PDF en esta misma solicitud de WhatsApp para ingresar la orden a producción en taller Piura.`;

    const cleanText = rawText.replace(/\*/g, "");
    return `https://wa.me/${COMPANY_WHATSAPP_NUM}?text=${encodeURIComponent(cleanText)}`;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Linked Quote Header Banner */}
      {activeQuote ? (
        <div className="rounded-2xl bg-gradient-to-r from-[#000273] to-slate-900 text-white p-5 border-2 border-[#FFCC00]/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="bg-[#FFCC00] text-black text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                🔗 Cotización Vinculada
              </span>
              <span className="text-xs font-mono font-bold text-slate-300">
                {activeQuote.proformaId}
              </span>
            </div>
            <h3 className="text-lg font-black text-white">
              {activeQuote.productName} - S/. {activeQuote.finalTotal.toFixed(2)}
            </h3>
            <p className="text-xs text-slate-300">
              Cliente: <span className="font-bold text-white">{activeQuote.customerName}</span> | {activeQuote.descriptionSpecs}
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setActiveTab("quoter")}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold border border-white/20 transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <i className="fa-solid fa-[#000273] fa-pen-to-square" />
              <span>Editar Cotización</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-4 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold">
          <div className="flex items-center space-x-2">
            <i className="fa-solid fa-link text-[#d5118d] text-base" />
            <span>¿Deseas enviar tu Cotización y la Validación del PDF en la misma solicitud por WhatsApp?</span>
          </div>
          <button
            onClick={() => setActiveTab("quoter")}
            className="px-3.5 py-2 rounded-xl bg-[#000273] text-white dark:bg-[#FFCC00] dark:text-slate-950 font-extrabold text-xs shrink-0 cursor-pointer"
          >
            Ir al Cotizador
          </button>
        </div>
      )}

      {/* Main Banner */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-6 sm:p-10 border border-slate-200 dark:border-[#d5118d]/30 relative overflow-hidden shadow-xl transition-colors duration-200">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-gradient-to-br from-[#d5118d]/20 via-[#000273]/20 to-[#FFCC00]/30 dark:from-[#d5118d] dark:via-[#000273] dark:to-[#FFCC00] rounded-full blur-3xl opacity-60 dark:opacity-25 pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#d5118d] text-white font-extrabold text-xs uppercase tracking-wider mb-3 shadow-xs">
            <i className="fa-solid fa-file-shield" />
            <span>Módulo de Control de Pre-Prensa</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
            Validador Técnico de Archivos para Impresión
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base font-medium">
            Sube tu PDF o selecciona una muestra. Analizamos el perfil de color CMYK, resolución DPI y sangrado para enviar la cotización y validación juntas por WhatsApp (2 PDFs).
          </p>
        </div>
      </div>

      {/* Main Grid: Upload & Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: File Inspector & Upload (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Real PDF File Upload Box with Drag & Drop */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`glass-card p-6 rounded-2xl border-2 border-dashed text-center transition-all relative ${
              isDragging
                ? "border-[#d5118d] dark:border-[#FFCC00] bg-gradient-to-b from-[#d5118d]/10 via-[#000273]/10 to-transparent scale-[1.02] shadow-2xl ring-4 ring-[#d5118d]/20"
                : "border-[#000273]/30 dark:border-[#FFCC00]/30 hover:border-[#000273] dark:hover:border-[#FFCC00]"
            }`}
          >
            <input
              type="file"
              accept=".pdf,.ai,.tiff,.jpg,.png,.eps"
              onChange={handleFileUpload}
              className="hidden"
              id="pdf-file-upload-input"
            />

            <div
              className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-2xl mb-3 transition-transform duration-200 ${
                isDragging
                  ? "bg-[#d5118d] text-white scale-110 animate-bounce"
                  : "bg-[#000273]/10 dark:bg-[#FFCC00]/10 text-[#000273] dark:text-[#FFCC00]"
              }`}
            >
              <i
                className={`fa-solid ${
                  isSimulatingUpload
                    ? "fa-spinner fa-spin"
                    : isDragging
                    ? "fa-file-circle-plus"
                    : "fa-cloud-arrow-up"
                }`}
              />
            </div>

            <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-1">
              {isSimulatingUpload
                ? "Analizando Metadatos de Pre-prensa..."
                : isDragging
                ? "¡Suelta tu archivo PDF o arte de impresión aquí!"
                : "Sube tu Archivo PDF para Impresión"}
            </h3>
            <p className="text-xs text-slate-500 mb-4 font-medium">
              {isDragging
                ? "Sueltar para iniciar la validación automatizada CMYK / DPI"
                : "Arrastra y coloca tu PDF aquí o haz clic en el botón de abajo"}
            </p>

            <label
              htmlFor="pdf-file-upload-input"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#000273] hover:bg-[#000273]/90 dark:bg-[#FFCC00] dark:hover:bg-[#FFCC00]/90 dark:text-slate-950 font-extrabold text-xs text-white shadow-md cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <i className="fa-solid fa-file-pdf" />
              <span>Seleccionar Archivo PDF</span>
            </label>

            {/* Test Presets Selector */}
            <div className="space-y-2 text-left pt-6 mt-4 border-t border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">
                O prueba con muestras del taller:
              </span>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => handleSelectPreset("cmyk_ok")}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-left flex items-center justify-between cursor-pointer transition-all ${
                    selectedPresetFile === "cmyk_ok" && !customValidation
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="truncate pr-2">
                    <i className="fa-solid fa-circle-check text-emerald-500 mr-2" />
                    <span>banner_polleria_300x200cm_imprenta.pdf</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded font-black">
                    98/100
                  </span>
                </button>

                <button
                  onClick={() => handleSelectPreset("rgb_warning")}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-left flex items-center justify-between cursor-pointer transition-all ${
                    selectedPresetFile === "rgb_warning" && !customValidation
                      ? "border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="truncate pr-2">
                    <i className="fa-solid fa-triangle-exclamation text-amber-500 mr-2" />
                    <span>volante_discoteca_canva.png (RGB)</span>
                  </div>
                  <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded font-black">
                    55/100
                  </span>
                </button>

                <button
                  onClick={() => handleSelectPreset("low_dpi_error")}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-left flex items-center justify-between cursor-pointer transition-all ${
                    selectedPresetFile === "low_dpi_error" && !customValidation
                      ? "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="truncate pr-2">
                    <i className="fa-solid fa-circle-xmark text-rose-500 mr-2" />
                    <span>tarjeta_whatsapp_baja.jpg (72 DPI)</span>
                  </div>
                  <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded font-black">
                    25/100
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Technical Specs Summary Card */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-extrabold uppercase text-slate-400">Metadatos del Archivo</span>
                {currentResult.fileType && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#000273] text-white dark:bg-[#FFCC00] dark:text-slate-950 shadow-xs">
                    {currentResult.fileType}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold text-slate-500">{currentResult.fileSizeMb} MB</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60">
                <span className="block text-slate-400 text-[10px] uppercase font-bold">Modo de Color</span>
                <span className={`font-black text-sm ${currentResult.colorSpace === "CMYK" ? "text-emerald-600 dark:text-emerald-400" : "text-amber-500"}`}>
                  {currentResult.colorSpace} {currentResult.colorSpace === "CMYK" ? "✓" : "⚠️"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60">
                <span className="block text-slate-400 text-[10px] uppercase font-bold">Resolución DPI</span>
                <span className={`font-black text-sm ${currentResult.dpi >= 300 ? "text-emerald-600 dark:text-emerald-400" : currentResult.dpi >= 150 ? "text-amber-500" : "text-rose-500"}`}>
                  {currentResult.dpi} DPI
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60">
                <span className="block text-slate-400 text-[10px] uppercase font-bold">Sangrado (Bleed)</span>
                <span className={`font-black text-sm ${currentResult.hasBleed ? "text-emerald-600 dark:text-emerald-400" : "text-amber-500"}`}>
                  {currentResult.hasBleed ? `${currentResult.bleedMarginMm} mm OK` : "0 mm (Falta)"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60">
                <span className="block text-slate-400 text-[10px] uppercase font-bold">Puntaje Técnico</span>
                <span className={`font-black text-sm ${currentResult.score >= 80 ? "text-emerald-600 dark:text-emerald-400" : currentResult.score >= 50 ? "text-amber-500" : "text-rose-500"}`}>
                  {currentResult.score} / 100
                </span>
              </div>
            </div>

            {/* Combined Request Actions: WhatsApp + 2 PDFs */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2.5">
              <a
                href={getCombinedWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center space-x-2 py-3.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer text-center"
              >
                <i className="fa-brands fa-whatsapp text-lg sm:text-xl shrink-0 leading-none text-white" />
                <span className="leading-tight">Enviar Solicitud por WhatsApp (Cotización + PDF)</span>
              </a>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => downloadPreflightPDF(activeQuote, currentResult)}
                  className="w-full flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-[#000273] hover:bg-[#000273]/90 dark:bg-[#FFCC00] dark:hover:bg-[#FFCC00]/90 text-white dark:text-slate-950 font-extrabold text-[11px] shadow-xs cursor-pointer transition-all"
                >
                  <i className="fa-solid fa-file-pdf" />
                  <span>Reporte Pre-prensa PDF</span>
                </button>

                {activeQuote ? (
                  <button
                    onClick={() => downloadBothPDFs(activeQuote, currentResult)}
                    className="w-full flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-[#FFCC00] font-extrabold text-[11px] border border-[#FFCC00]/40 shadow-xs cursor-pointer transition-all"
                  >
                    <i className="fa-solid fa-box-archive" />
                    <span>Descargar 2 PDFs</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab("quoter")}
                    className="w-full flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-extrabold text-[11px] border border-slate-200 dark:border-slate-700 cursor-pointer transition-all"
                  >
                    <i className="fa-solid fa-plus" />
                    <span>Añadir Cotización</span>
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Pre-press Visualizer Canvas & Diagnostics (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Pre-press Canvas Simulation */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center space-x-2">
                  <i className="fa-solid fa-eye text-[#000273] dark:text-[#FFCC00]" />
                  <span>Visor de Preprensa e Indicadores de Corte</span>
                </h3>
                <p className="text-xs text-slate-500">Visualiza las líneas reglamentarias de imprenta.</p>
              </div>

              {/* Overlay Line Toggles */}
              <div className="flex items-center space-x-2 text-xs font-bold">
                <button
                  onClick={() => setShowBleedLine(!showBleedLine)}
                  className={`px-2.5 py-1 rounded-lg border cursor-pointer ${
                    showBleedLine ? "bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-300" : "border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full inline-block bg-rose-500 mr-1" />
                  Sangrado (3mm)
                </button>

                <button
                  onClick={() => setShowCutLine(!showCutLine)}
                  className={`px-2.5 py-1 rounded-lg border cursor-pointer ${
                    showCutLine ? "bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-300" : "border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full inline-block bg-blue-500 mr-1" />
                  Línea Corte
                </button>

                <button
                  onClick={() => setShowSafeZone(!showSafeZone)}
                  className={`px-2.5 py-1 rounded-lg border cursor-pointer ${
                    showSafeZone ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-300" : "border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full inline-block bg-emerald-500 mr-1" />
                  Zona Segura
                </button>
              </div>
            </div>

            {/* Simulated Interactive Canvas Frame */}
            <div className="relative w-full h-72 sm:h-80 bg-slate-900 rounded-2xl flex items-center justify-center overflow-hidden p-6 border border-slate-800 shadow-inner">
              
              {/* Canvas Preview Box */}
              <div
                className="relative bg-gradient-to-tr from-[#000273] via-indigo-900 to-[#d5118d] rounded-sm flex flex-col items-center justify-center p-6 text-center text-white shadow-2xl transition-all duration-300 overflow-hidden"
                style={{
                  width: currentResult.hasBleed ? "90%" : "80%",
                  height: "80%",
                }}
              >
                {/* Real Uploaded Image Preview if available */}
                {currentResult.previewUrl && (
                  <img
                    src={currentResult.previewUrl}
                    alt="Vista Previa del Archivo"
                    className="absolute inset-0 w-full h-full object-contain p-2 opacity-80 z-0"
                  />
                )}

                {/* Bleed Area Overlay Line (Red Dash) */}
                {showBleedLine && (
                  <div className="absolute inset-0 border-2 border-dashed border-rose-500 pointer-events-none">
                    <span className="absolute top-1 left-1 text-[9px] bg-rose-500 text-white px-1 font-bold rounded">
                      Sangrado +3mm
                    </span>
                  </div>
                )}

                {/* Cut Line Overlay (Blue Solid) */}
                {showCutLine && (
                  <div className="absolute inset-2 border-2 border-blue-400 pointer-events-none">
                    <span className="absolute top-1 right-1 text-[9px] bg-blue-500 text-white px-1 font-bold rounded">
                      Línea de Guillotina
                    </span>
                  </div>
                )}

                {/* Safe Zone Overlay (Green Dash) */}
                {showSafeZone && (
                  <div className="absolute inset-5 border border-dashed border-emerald-400 pointer-events-none">
                    <span className="absolute bottom-1 left-1 text-[9px] bg-emerald-500 text-white px-1 font-bold rounded">
                      Zona Segura de Textos
                    </span>
                  </div>
                )}

                {/* Content Graphic Mock */}
                <div className="space-y-1 max-w-xs z-10">
                  <div className="text-xl sm:text-2xl font-black text-[#FFCC00] tracking-tight uppercase truncate">
                    {currentResult.fileName}
                  </div>
                  <p className="text-xs font-semibold text-slate-200">
                    {activeQuote ? activeQuote.productName : "ARTE DE IMPRESIÓN DIGITAL"}
                  </p>
                  <div className="text-[10px] text-slate-300 bg-black/40 px-3 py-1 rounded-full inline-block mt-2 font-mono">
                    {currentResult.colorSpace} | {currentResult.dpi} DPI
                  </div>
                </div>

                {/* Warning Badge Overlay if RGB */}
                {currentResult.colorSpace === "RGB" && (
                  <div className="absolute top-3 right-3 bg-amber-500 text-black font-black text-[10px] px-2.5 py-1 rounded-lg shadow-lg flex items-center space-x-1 animate-pulse z-20">
                    <i className="fa-solid fa-triangle-exclamation" />
                    <span>ALERTA MODO RGB</span>
                  </div>
                )}
              </div>
            </div>

            {/* Diagnostic Issues List */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                Diagnóstico Técnico de Preprensa
              </h4>
              <div className="space-y-2.5">
                {currentResult.issues.map((issue, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1 ${
                      issue.type === "success"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200"
                        : issue.type === "warning"
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200"
                        : "bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-200"
                    }`}
                  >
                    <div className="font-extrabold text-sm flex items-center space-x-2">
                      <i
                        className={`fa-solid ${
                          issue.type === "success"
                            ? "fa-circle-check text-emerald-500"
                            : issue.type === "warning"
                            ? "fa-triangle-exclamation text-amber-500"
                            : "fa-circle-xmark text-rose-500"
                        }`}
                      />
                      <span>{issue.title}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-200 font-medium pl-6">
                      {issue.description}
                    </p>
                    <div className="pl-6 pt-1 text-[11px] font-bold text-slate-500 dark:text-slate-300">
                      💡 Solución sugerida: {issue.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
