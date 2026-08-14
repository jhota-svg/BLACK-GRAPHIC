import React, { useState } from "react";
import { TrackerOrder, OrderStage, WorkshopPhoto } from "../types";
import { WORKSHOP_PRESET_PHOTOS } from "../data";

interface AdminTabProps {
  orders: TrackerOrder[];
  setOrders: React.Dispatch<React.SetStateAction<TrackerOrder[]>>;
  setActiveTab: (tab: string) => void;
}

export const AdminTab: React.FC<AdminTabProps> = ({ orders, setOrders, setActiveTab }) => {
  // Security PIN state
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [pinError, setPinError] = useState<string | null>(null);
  const [showPin, setShowPin] = useState<boolean>(false);

  const CORRECT_PIN = "123";

  // Order selection states
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || "BG-2026-8942");

  // New photo input states
  const [customPhotoTitle, setCustomPhotoTitle] = useState<string>("");
  const [customPhotoNote, setCustomPhotoNote] = useState<string>("");
  const [selectedPresetPhotoIndex, setSelectedPresetPhotoIndex] = useState<number>(0);

  // New Order Creation states
  const [newCustomerName, setNewCustomerName] = useState<string>("");
  const [newProductName, setNewProductName] = useState<string>("");
  const [newPrice, setNewPrice] = useState<number>(150);

  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const currentOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const handleUnlockPIN = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pinInput.trim() === CORRECT_PIN) {
      setIsUnlocked(true);
      setPinError(null);
      setPinInput("");
      showNotification("🔓 Acceso de Administrador Autorizado con éxito.");
    } else {
      setPinError("PIN Incorrecto. Por favor ingresa el PIN por defecto: 123");
    }
  };

  const handleKeypadPress = (val: string) => {
    if (pinInput.length < 6) {
      setPinInput((prev) => prev + val);
      setPinError(null);
    }
  };

  const handleKeypadClear = () => {
    setPinInput("");
    setPinError(null);
  };

  const handleLockSession = () => {
    setIsUnlocked(false);
    setPinInput("");
    setPinError(null);
  };

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  // Change stage handler
  const handleChangeStage = (newStage: OrderStage) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === selectedOrderId) {
          return {
            ...ord,
            currentStage: newStage,
          };
        }
        return ord;
      })
    );
    showNotification(`Etapa de la orden ${selectedOrderId} actualizada a: ${newStage.toUpperCase()}`);
  };

  // Add Workshop Photo Evidence Handler
  const handleAddWorkshopPhoto = () => {
    const preset = WORKSHOP_PRESET_PHOTOS[selectedPresetPhotoIndex];
    const newPhoto: WorkshopPhoto = {
      id: `p-${Date.now()}`,
      imageUrl: preset.imageUrl,
      stage: currentOrder.currentStage,
      title: customPhotoTitle || preset.title,
      operatorNote: customPhotoNote || preset.note,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === selectedOrderId) {
          return {
            ...ord,
            photos: [newPhoto, ...ord.photos],
          };
        }
        return ord;
      })
    );

    setCustomPhotoTitle("");
    setCustomPhotoNote("");
    showNotification(`📷 Nueva evidencia fotográfica añadida a la orden ${selectedOrderId}`);
  };

  // Add New Order
  const handleCreateNewOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName || !newProductName) return;

    const newId = `BG-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: TrackerOrder = {
      id: newId,
      customerName: newCustomerName,
      phone: "+51 987 654 321",
      productName: newProductName,
      specs: "Especificaciones ingresadas por Administrador en Taller",
      quantity: 1,
      totalPrice: newPrice,
      currentStage: "received",
      estimatedDelivery: "Mañana 6:00 PM (Piura)",
      createdAt: new Date().toLocaleString(),
      photos: [
        {
          id: `p-init-${Date.now()}`,
          imageUrl: WORKSHOP_PRESET_PHOTOS[0].imageUrl,
          stage: "received",
          title: "Ingreso Manual por Administrador",
          operatorNote: "Pedido generado desde el Simulador Admin.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ],
    };

    setOrders([newOrder, ...orders]);
    setSelectedOrderId(newId);
    setNewCustomerName("");
    setNewProductName("");
    showNotification(`✅ Nueva Orden ${newId} creada con éxito.`);
  };

  // -------------------------------------------------------------
  // SECURITY LOCK SCREEN (IF NOT UNLOCKED)
  // -------------------------------------------------------------
  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto my-6 sm:my-10 animate-fade-in">
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 text-center relative overflow-hidden">
          {/* Subtle glowing background accent */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-[#000273] dark:bg-[#FFCC00] rounded-full blur-3xl opacity-20 pointer-events-none" />

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#000273]/10 dark:bg-[#FFCC00]/20 text-[#000273] dark:text-[#FFCC00] ring-4 ring-[#000273]/5 dark:ring-[#FFCC00]/10 mx-auto">
            <i className="fa-solid fa-lock text-2xl" />
          </div>

          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-[#FFCC00]/20 text-[#000273] dark:bg-[#FFCC00] dark:text-black font-extrabold text-[10px] uppercase tracking-wider">
              Capa de Seguridad
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Panel de Administración
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Acceso restringido para el personal encargado del taller y pre-prensa en Black Graphic.
            </p>
          </div>

          {/* Test PIN Info Box */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs text-left flex items-start space-x-3">
            <i className="fa-solid fa-key text-amber-500 text-base mt-0.5" />
            <div>
              <p className="font-extrabold">PIN de Prueba de Demostración:</p>
              <p className="font-medium text-[11px] text-amber-700 dark:text-amber-200">
                Ingresa el PIN <strong className="font-black underline text-[#000273] dark:text-[#FFCC00]">123</strong> para desbloquear el simulador.
              </p>
            </div>
          </div>

          {/* PIN Input Form */}
          <form onSubmit={handleUnlockPIN} className="space-y-4">
            <div className="relative">
              <input
                type={showPin ? "text" : "password"}
                maxLength={6}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(null);
                }}
                placeholder="Ingresar PIN (Ej: 123)"
                className="w-full px-4 py-3 text-center text-xl font-black tracking-widest rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#000273] dark:focus:ring-[#FFCC00] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                title={showPin ? "Ocultar PIN" : "Ver PIN"}
              >
                <i className={`fa-solid ${showPin ? "fa-eye-slash" : "fa-eye"} text-sm`} />
              </button>
            </div>

            {pinError && (
              <p className="text-xs font-bold text-rose-600 dark:text-rose-400 animate-shake">
                <i className="fa-solid fa-triangle-exclamation mr-1" />
                {pinError}
              </p>
            )}

            {/* Virtual Touch Keypad for Quick Use */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeypadPress(num)}
                  className="py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-extrabold text-base border border-slate-200 dark:border-slate-700/60 transition-all cursor-pointer active:scale-95"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={handleKeypadClear}
                className="py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs border border-rose-500/20 transition-all cursor-pointer"
              >
                Borrar
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress("0")}
                className="py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-extrabold text-base border border-slate-200 dark:border-slate-700/60 transition-all cursor-pointer active:scale-95"
              >
                0
              </button>
              <button
                type="submit"
                className="py-2.5 rounded-xl bg-[#000273] dark:bg-[#FFCC00] text-white dark:text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer active:scale-95 flex items-center justify-center space-x-1"
              >
                <span>OK</span>
                <i className="fa-solid fa-arrow-right text-xs" />
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#000273] hover:bg-[#000273]/90 dark:bg-[#FFCC00] dark:hover:bg-[#FFCC00]/90 text-white dark:text-slate-950 font-black text-sm shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2 mt-4"
            >
              <i className="fa-solid fa-lock-open" />
              <span>Desbloquear Panel de Control</span>
            </button>
          </form>

          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            © Black Graphic Piura • Módulo de Gestión Interna de Pedidos
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // UNLOCKED ADMIN PANEL CONTENT
  // -------------------------------------------------------------
  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-6 sm:p-8 border border-slate-200 dark:border-[#FFCC00]/30 relative overflow-hidden shadow-xl transition-colors duration-200">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-gradient-to-br from-[#000273]/20 via-[#d5118d]/20 to-[#FFCC00]/30 dark:from-[#000273] dark:via-[#d5118d] dark:to-[#FFCC00] rounded-full blur-3xl opacity-60 dark:opacity-30 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-3xl space-y-2">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-[#FFCC00] text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-xs">
                <i className="fa-solid fa-sliders" />
                <span>Simulador de Panel de Administración</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] uppercase border border-emerald-500/40">
                <i className="fa-solid fa-shield-halved" />
                <span>Sesión PIN Protegida</span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Panel de Control para Técnicos y Operadores
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-medium">
              Administra las órdenes de trabajo activas, avanza las etapas de producción (Recibido, Pre-prensa, Impresión, Entrega), sube fotos reales del avance del taller y crea nuevos pedidos para probar el Rastreador (Tab 3) en tiempo real.
            </p>
          </div>

          <button
            onClick={handleLockSession}
            className="shrink-0 px-4 py-2.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 text-xs font-bold transition-all cursor-pointer flex items-center space-x-2"
          >
            <i className="fa-solid fa-lock" />
            <span>Bloquear / Salir</span>
          </button>
        </div>
      </div>

      {notificationMsg && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 rounded-2xl font-bold text-xs sm:text-sm text-center shadow-lg animate-bounce">
          {notificationMsg}
        </div>
      )}

      {/* Main Grid Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Order Status Controls (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="glass-card p-6 rounded-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center space-x-2">
                <i className="fa-solid fa-route text-[#000273] dark:text-[#FFCC00]" />
                <span>1. Selecciona Orden & Cambiar Etapa</span>
              </h3>
            </div>

            {/* Select active order */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-300 uppercase mb-1">
                Orden a Modificar:
              </label>
              <select
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-extrabold text-sm text-slate-900 dark:text-white outline-none"
              >
                {orders.map((ord) => (
                  <option key={ord.id} value={ord.id} className="bg-slate-900 text-white font-semibold">
                    {ord.id} - {ord.customerName} ({ord.productName})
                  </option>
                ))}
              </select>
            </div>

            {/* Current status display */}
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-300">Estado Actual de la Orden:</span>
              <div className="text-base font-black text-[#000273] dark:text-[#FFCC00] uppercase">
                Etapa: {currentOrder.currentStage}
              </div>
            </div>

            {/* Change Stage Action Buttons */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                Avanzar Etapa de Producción:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleChangeStage("received")}
                  className={`p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                    currentOrder.currentStage === "received" ? "bg-[#000273] text-white font-extrabold shadow-md" : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  1. Recibido
                </button>

                <button
                  onClick={() => handleChangeStage("prepress")}
                  className={`p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                    currentOrder.currentStage === "prepress" ? "bg-[#000273] text-white font-extrabold shadow-md" : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  2. Pre-Prensa
                </button>

                <button
                  onClick={() => handleChangeStage("printing")}
                  className={`p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                    currentOrder.currentStage === "printing" ? "bg-[#000273] text-white font-extrabold shadow-md" : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  3. En Impresión
                </button>

                <button
                  onClick={() => handleChangeStage("delivery")}
                  className={`p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                    currentOrder.currentStage === "delivery" ? "bg-[#000273] text-white font-extrabold shadow-md" : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  4. Listo / Entrega
                </button>
              </div>
            </div>

            <button
              onClick={() => setActiveTab("tracker")}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <i className="fa-solid fa-eye text-[#FFCC00]" />
              <span>Ver Cambios en el Rastreador (Tab 3)</span>
            </button>
          </div>

          {/* Upload Workshop Photo Form */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <i className="fa-solid fa-camera text-[#d5118d]" />
              <span>2. Subir Evidencia Fotográfica al Rastreador</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Selecciona Captura Muestra del Taller
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {WORKSHOP_PRESET_PHOTOS.map((ph, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedPresetPhotoIndex(idx)}
                      className={`h-16 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                        selectedPresetPhotoIndex === idx ? "border-[#FFCC00] scale-105 shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={ph.imageUrl} alt={ph.title} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Título de la Captura
                </label>
                <input
                  type="text"
                  placeholder={WORKSHOP_PRESET_PHOTOS[selectedPresetPhotoIndex].title}
                  value={customPhotoTitle}
                  onChange={(e) => setCustomPhotoTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nota del Técnico / Operador
                </label>
                <textarea
                  rows={2}
                  placeholder={WORKSHOP_PRESET_PHOTOS[selectedPresetPhotoIndex].note}
                  value={customPhotoNote}
                  onChange={(e) => setCustomPhotoNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleAddWorkshopPhoto}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
              >
                + Publicar Foto en Rastreador del Cliente
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Add Custom Order Simulator (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          <form onSubmit={handleCreateNewOrder} className="glass-card p-6 rounded-2xl space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <i className="fa-solid fa-plus text-[#000273] dark:text-[#FFCC00]" />
              <span>3. Registrar Nueva Orden Simulada</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nombre del Cliente / Empresa
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Cevichería El Mero Piurano"
                value={newCustomerName}
                onChange={(e) => setNewCustomerName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Descripción del Producto
              </label>
              <input
                type="text"
                required
                placeholder="Ej: 2000 Volantes A5 Couché 150g"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Monto Total (S/.)
              </label>
              <input
                type="number"
                min="10"
                max="10000"
                value={newPrice}
                onChange={(e) => setNewPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#000273] hover:bg-[#000273]/90 dark:bg-[#FFCC00] dark:text-slate-950 font-black text-xs text-white transition-all cursor-pointer"
            >
              + Crear e Iniciar Orden en Taller
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};

