import { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { QuoterTab } from "./components/QuoterTab";
import { ValidatorTab } from "./components/ValidatorTab";
import { TrackerTab } from "./components/TrackerTab";
import { AssistantTab } from "./components/AssistantTab";
import { AdminTab } from "./components/AdminTab";
import { INITIAL_ORDERS } from "./data";
import { TrackerOrder, QuoteData, ValidationResult } from "./types";
import { COMPANY_PHONE } from "./lib/pdfGenerator";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("quoter");
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("bg_theme");
      if (saved !== null) return saved === "dark";
    }
    return true; // Default dark for luxury print look
  });

  const [orders, setOrders] = useState<TrackerOrder[]>(INITIAL_ORDERS);

  // Shared state for combining Quote + PDF Preflight validation in a single request
  const [activeQuote, setActiveQuote] = useState<QuoteData | null>(null);
  const [activeValidation, setActiveValidation] = useState<ValidationResult | null>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("bg_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("bg_theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden flex flex-col bg-slate-50 dark:bg-[#030617] text-slate-900 dark:text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#FFCC00] selection:text-black">
      
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main App Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-8 overflow-x-hidden">
        {activeTab === "quoter" && (
          <QuoterTab
            activeQuote={activeQuote}
            setActiveQuote={setActiveQuote}
            activeValidation={activeValidation}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === "validator" && (
          <ValidatorTab
            activeQuote={activeQuote}
            setActiveQuote={setActiveQuote}
            activeValidation={activeValidation}
            setActiveValidation={setActiveValidation}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === "tracker" && <TrackerTab orders={orders} />}
        {activeTab === "assistant" && <AssistantTab />}
        {activeTab === "admin" && (
          <AdminTab orders={orders} setOrders={setOrders} setActiveTab={setActiveTab} />
        )}
      </main>

      {/* Studio Footer */}
      <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-[#030617]/80 backdrop-blur-md py-6 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-[#000273] dark:text-[#FFCC00]">BLACK GRAPHIC</span>
            <span>© 2026 - Imprenta & Pre-prensa Digital Piura, Perú</span>
          </div>

          <div className="flex items-center space-x-4 font-semibold">
            <span className="flex items-center space-x-1">
              <i className="fa-solid fa-location-dot text-[#d5118d]" />
              <span>Av. Grau, Zona Centro - Piura</span>
            </span>
            <a
              href={`https://wa.me/51906604475?text=Hola%20Black%20Graphic%2C%20quisiera%20consultar%20con%20un%20asesor.`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1.5 hover:text-emerald-500 transition-colors cursor-pointer"
            >
              <i className="fa-brands fa-whatsapp text-emerald-500 text-sm shrink-0 leading-none" />
              <span className="leading-none">{COMPANY_PHONE}</span>
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
