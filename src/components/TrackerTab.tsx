import React, { useState } from "react";
import { TrackerOrder, OrderStage, WorkshopPhoto } from "../types";

interface TrackerTabProps {
  orders: TrackerOrder[];
}

export const TrackerTab: React.FC<TrackerTabProps> = ({ orders }) => {
  const [searchCode, setSearchCode] = useState<string>("BG-2026-8942");
  const [selectedPhoto, setSelectedPhoto] = useState<WorkshopPhoto | null>(null);

  // Find order by searchCode
  const activeOrder = orders.find(
    (o) => o.id.toLowerCase().trim() === searchCode.toLowerCase().trim()
  ) || orders[0];

  const stages: { id: OrderStage; label: string; icon: string; desc: string }[] = [
    { id: "received", label: "1. Recibido", icon: "fa-inbox", desc: "Pedido registrado e ingresado a cola" },
    { id: "prepress", label: "2. Pre-Prensa", icon: "fa-sliders", desc: "Validación CMYK y RIP CTP" },
    { id: "printing", label: "3. En Impresión", icon: "fa-[#000273] fa-print", desc: "Imprimiendo en Plotter Roland" },
    { id: "delivery", label: "4. Listo / Entrega", icon: "fa-truck-fast", desc: "Empacado o listo para retiro" },
  ];

  const getStageIndex = (stage: OrderStage) => {
    switch (stage) {
      case "received": return 0;
      case "prepress": return 1;
      case "printing": return 2;
      case "delivery": return 3;
      default: return 0;
    }
  };

  const currentStageIdx = getStageIndex(activeOrder.currentStage);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-6 sm:p-10 border border-slate-200 dark:border-[#FFCC00]/30 relative overflow-hidden shadow-xl transition-colors duration-200">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-gradient-to-br from-[#000273]/20 via-[#d5118d]/20 to-[#FFCC00]/30 dark:from-[#000273] dark:via-[#d5118d] dark:to-[#FFCC00] rounded-full blur-3xl opacity-60 dark:opacity-25 pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FFCC00] text-slate-950 font-extrabold text-xs uppercase tracking-wider mb-3 shadow-xs">
            <i className="fa-solid fa-camera" />
            <span>Seguimiento Fotográfico en Vivo</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
            Rastreador de Pedidos en Taller Piura
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base font-medium">
            Transparencia total. Consulta el estado exacto de tu trabajo de impresión y observa fotografías reales capturadas por los operadores de Black Graphic durante el proceso.
          </p>
        </div>
      </div>

      {/* Search Order Bar & Preset Selector */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-1/2 relative">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-300 uppercase mb-1">
              Ingresa tu Código de Pedido
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Ej: BG-2026-8942"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-extrabold text-slate-900 dark:text-white uppercase focus:ring-2 focus:ring-[#000273] outline-none"
              />
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3.5 text-slate-400" />
            </div>
          </div>

          <div className="w-full md:w-1/2 flex items-center justify-start md:justify-end space-x-2 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-300 whitespace-nowrap">Órdenes Activas:</span>
            {orders.map((ord) => (
              <button
                key={ord.id}
                onClick={() => setSearchCode(ord.id)}
                className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                  activeOrder.id === ord.id
                    ? "bg-[#000273] text-white dark:bg-[#FFCC00] dark:text-slate-950"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {ord.id} ({ord.customerName})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Order Info & Progress Bar */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl space-y-8 border-2 border-[#000273]/20 dark:border-[#FFCC00]/20 shadow-lg">
        
        {/* Order Details Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-black text-[#000273] dark:text-[#FFCC00]">
                {activeOrder.id}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-500/30">
                ● En Producción Taller Piura
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
              {activeOrder.productName}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Cliente: <span className="text-slate-800 dark:text-slate-200 font-semibold">{activeOrder.customerName}</span> {activeOrder.companyName ? `(${activeOrder.companyName})` : ""}
            </p>
          </div>

          <div className="text-left md:text-right bg-slate-100/80 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="text-[10px] font-bold uppercase text-slate-400">Entrega Estimada en Piura</div>
            <div className="text-base font-black text-[#d5118d]">{activeOrder.estimatedDelivery}</div>
            <div className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-0.5">
              Total: S/. {activeOrder.totalPrice.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Interactive 4-Stage Progress Bar */}
        <div>
          <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-6">
            Línea de Tiempo de Producción en Vivo
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
            {stages.map((stg, index) => {
              const isCompleted = index <= currentStageIdx;
              const isCurrent = index === currentStageIdx;

              return (
                <div
                  key={stg.id}
                  className={`p-4 rounded-2xl border transition-all relative overflow-hidden ${
                    isCurrent
                      ? "bg-[#000273] text-white dark:bg-[#FFCC00] dark:text-slate-950 border-[#000273] dark:border-[#FFCC00] shadow-lg scale-[1.02]"
                      : isCompleted
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200"
                      : "bg-slate-100/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <i className={`fa-solid ${stg.icon} text-xl ${
                      isCurrent
                        ? "text-[#FFCC00] dark:text-slate-950"
                        : isCompleted
                        ? "text-emerald-500"
                        : "text-slate-400"
                    }`} />
                    {isCompleted && (
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isCurrent ? "bg-white text-black font-black" : "bg-emerald-500 text-white"
                      }`}>
                        {isCurrent ? "EN PROCESO" : "COMPLETADO"}
                      </span>
                    )}
                  </div>
                  <div className="font-extrabold text-sm">{stg.label}</div>
                  <div className={`text-[11px] mt-1 font-medium leading-tight ${
                    isCurrent ? "opacity-90" : "opacity-75"
                  }`}>
                    {stg.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Workshop Evidence Photos Feed */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
              <i className="fa-solid fa-[#000273] fa-camera-retro text-[#d5118d]" />
              <span>Evidencia Fotográfica del Taller ({activeOrder.photos.length} Capturas)</span>
            </h4>
            <span className="text-xs text-slate-500 font-semibold">
              Capturas en Vivo por Técnicos
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeOrder.photos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 cursor-pointer shadow-md hover:shadow-xl transition-all"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-[#FFCC00] font-mono text-[10px] font-bold px-2.5 py-1 rounded-lg border border-[#FFCC00]/30">
                    🕒 {photo.timestamp}
                  </span>
                </div>

                <div className="p-4 space-y-1">
                  <h5 className="font-extrabold text-sm text-white line-clamp-1 group-hover:text-[#FFCC00] transition-colors">
                    {photo.title}
                  </h5>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    "{photo.operatorNote}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-6 flex flex-wrap gap-3 justify-between items-center">
          <div className="text-xs text-slate-500 font-medium">
            <i className="fa-solid fa-location-dot text-[#d5118d] mr-1" />
            Taller Principal: Av. Grau, Piura - Perú
          </div>

          <div className="flex space-x-2">
            <a
              href={`https://wa.me/51906604475?text=Hola%20Black%20Graphic%2C%20consulto%20por%20mi%20pedido%20${activeOrder.id}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-2"
            >
              <i className="fa-brands fa-whatsapp text-sm" />
              <span>Contactar Operador</span>
            </a>
          </div>
        </div>

      </div>

      {/* Lightbox Modal for Photo Inspection */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-800 text-white hover:bg-rose-600 transition-colors flex items-center justify-center text-lg"
            >
              <i className="fa-solid fa-xmark" />
            </button>

            <div className="rounded-2xl overflow-hidden max-h-96">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2 text-white">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#FFCC00]">
                  🕒 Captura de Taller: {selectedPhoto.timestamp}
                </span>
                <span className="text-xs bg-[#000273] px-2.5 py-1 rounded font-bold uppercase">
                  {selectedPhoto.stage}
                </span>
              </div>
              <h3 className="text-lg font-black">{selectedPhoto.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <i className="fa-solid fa-quote-left text-[#d5118d] mr-2" />
                {selectedPhoto.operatorNote}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
