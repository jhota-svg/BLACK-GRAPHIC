import React, { useState } from "react";
import { BlackGraphicLogo } from "./Logo";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
}) => {
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);

  const tabs = [
    { id: "quoter", label: "Cotizador", icon: "fa-calculator" },
    { id: "validator", label: "Validador Preprensa", icon: "fa-file-circle-check" },
    { id: "tracker", label: "Rastreador Taller", icon: "fa-route" },
    { id: "assistant", label: "Asistente AI", icon: "fa-wand-magic-sparkles" },
    { id: "admin", label: "Simulador Admin", icon: "fa-sliders" },
  ];

  return (
    <header className="sticky top-0 z-50 glass-nav transition-all duration-300 shadow-xs w-full max-w-[100vw] overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          
          {/* Logo & Studio Info */}
          <div className="flex items-center cursor-pointer shrink-0" onClick={() => setActiveTab("quoter")}>
            <BlackGraphicLogo size={38} showText={true} className="sm:hidden" />
            <BlackGraphicLogo size={46} showText={true} className="hidden sm:flex" />
          </div>

          {/* Quick Info & Actions (Responsive compact layout for mobile) */}
          <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
            {/* Clickable Schedule Badge */}
            <button
              onClick={() => setShowScheduleModal(true)}
              className="flex items-center space-x-1.5 sm:space-x-2 text-[11px] sm:text-xs font-bold px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl sm:rounded-full bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200 border border-emerald-500/30 hover:bg-emerald-500/20 dark:hover:bg-emerald-500/30 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Haz clic para ver los horarios de atención"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="hidden md:inline whitespace-nowrap font-extrabold">Taller Piura: 8:00 AM - 8:00 PM</span>
              <span className="md:hidden text-xs font-extrabold">Horario</span>
              <i className="fa-solid fa-clock text-[11px] opacity-80 shrink-0" />
            </button>

            {/* Dark Mode Toggle (Compact & aligned) */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-[#FFCC00] hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer flex items-center justify-center shrink-0 w-9 h-9 sm:w-10 sm:h-10"
              title={darkMode ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
              aria-label="Cambiar tema de color"
            >
              <i className={`fa-solid ${darkMode ? "fa-sun text-yellow-400" : "fa-moon text-[#000273]"} text-sm sm:text-base`} />
            </button>

            {/* WhatsApp Contact (Icon only on small screens, full text on larger screens) */}
            <a
              href="https://wa.me/51906604475?text=Hola%20Black%20Graphic%2C%20quisiera%20consultar%20con%20un%20asesor."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all shrink-0 cursor-pointer h-9 sm:h-10"
              title="Comunícate con un asesor por WhatsApp"
            >
              <i className="fa-brands fa-whatsapp text-lg shrink-0 leading-none text-white" />
              <span className="hidden lg:inline text-xs leading-none whitespace-nowrap">Comunícate con un asesor</span>
              <span className="hidden sm:inline lg:hidden text-xs leading-none whitespace-nowrap">Asesor</span>
            </a>
          </div>
        </div>

        {/* Navigation Tabs Bar (Smooth horizontal scrolling without overflowing page) */}
        <div className="flex overflow-x-auto space-x-1 sm:space-x-2 py-2 border-t border-slate-200/60 dark:border-slate-800/80 no-scrollbar w-full max-w-full">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-[#000273] text-white dark:bg-[#FFCC00] dark:text-slate-950 shadow-md shadow-[#000273]/20 dark:shadow-[#FFCC00]/20"
                    : "text-slate-600 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <i className={`fa-solid ${tab.icon} ${isActive ? "text-[#FFCC00] dark:text-slate-950" : "text-slate-400 dark:text-slate-300"}`} />
                <span>{tab.label}</span>
                {tab.id === "assistant" && (
                  <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-[#d5118d] text-white">
                    AI
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>

      {/* Schedule Panel Modal */}
      {showScheduleModal && (
        <div
          onClick={() => setShowScheduleModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 text-slate-900 dark:text-white cursor-default"
          >
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center font-bold text-lg">
                  <i className="fa-solid fa-clock" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg leading-tight">Horarios de Atención</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Black Graphic - Taller Piura</p>
                </div>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-sm" />
              </button>
            </div>

            {/* Schedule Items List */}
            <div className="space-y-2.5">
              {/* Lunes a Viernes */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50">
                <div className="flex items-center space-x-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <div>
                    <div className="text-xs font-black uppercase text-slate-900 dark:text-slate-100">Lunes a Viernes</div>
                    <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">8:00 AM - 8:00 PM</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 text-[10px] font-extrabold uppercase">
                  Abierto
                </span>
              </div>

              {/* Sábados */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50">
                <div className="flex items-center space-x-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div>
                    <div className="text-xs font-black uppercase text-slate-900 dark:text-slate-100">Sábados</div>
                    <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">8:00 AM - 5:00 PM</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 text-[10px] font-extrabold uppercase">
                  Hasta 5:00 PM
                </span>
              </div>

              {/* Feriados */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50">
                <div className="flex items-center space-x-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div>
                    <div className="text-xs font-black uppercase text-slate-900 dark:text-slate-100">Feriados</div>
                    <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">8:00 AM - 5:00 PM</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 text-[10px] font-extrabold uppercase">
                  Especial
                </span>
              </div>

              {/* Domingos */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20">
                <div className="flex items-center space-x-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <div>
                    <div className="text-xs font-black uppercase text-rose-700 dark:text-rose-300">Domingos</div>
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">No hay atención</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-300 text-[10px] font-extrabold uppercase">
                  Cerrado
                </span>
              </div>
            </div>

            {/* Footer Location & WhatsApp */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400 font-medium">
                <i className="fa-solid fa-location-dot text-[#d5118d]" />
                <span>Av. Grau, Centro - Piura</span>
              </div>

              <a
                href="https://wa.me/51906604475?text=Hola%20Black%20Graphic%2C%20quisiera%20consultar%20sobre%20los%20horarios%20de%20atenci%C3%B3n."
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
              >
                <i className="fa-brands fa-whatsapp text-sm" />
                <span>Consultar por WhatsApp</span>
              </a>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};

