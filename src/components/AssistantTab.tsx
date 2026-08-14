import React, { useState, useRef, useEffect } from "react";
import { AI_SUGGESTION_PROMPTS } from "../data";
import { ChatMessage } from "../types";

export const AssistantTab: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "assistant",
      text: "¡Hola! Soy el Asistente Creativo y Técnico de Black Graphic Piura 🎨✨\n\n¿En qué puedo ayudarte hoy?\n- Asesoría técnica: CMYK vs RGB, resolución DPI, márgenes de sangrado 3mm, viniles y acabados.\n- Redacción publicitaria (Copywriting): Slogans atrayentes, textos para volantes y promociones para tu negocio en Piura.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputPrompt).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al comunicarse con el servidor");
      }

      const rawText = data.reply || "No recibí respuesta del asistente.";
      const cleanText = rawText.replace(/\*\*/g, "").replace(/\*/g, "");

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "assistant",
        text: cleanText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error("Chat error:", err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: "assistant",
        text: "⚠️ Ocurrió una inconveniencia al consultar la AI. Por favor asegúrate de que el servidor Gemini esté activo o intenta nuevamente.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-6 sm:p-8 border border-slate-200 dark:border-[#FFCC00]/30 relative overflow-hidden shadow-xl transition-colors duration-200">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-gradient-to-br from-[#000273]/20 via-[#d5118d]/20 to-[#FFCC00]/30 dark:from-[#000273] dark:via-[#d5118d] dark:to-[#FFCC00] rounded-full blur-3xl opacity-60 dark:opacity-30 pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#d5118d] to-[#000273] text-white font-black text-xs uppercase tracking-wider mb-2 shadow-xs">
            <i className="fa-solid fa-wand-magic-sparkles" />
            <span>Gemini 3 Flash AI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-1">
            Asistente Creativo & Asesor Técnico
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-medium">
            Consulta dudas sobre preprensa, formatos de archivo para imprenta o solicita la redacción de slogans y textos publicitarios para tus campañas en Piura.
          </p>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="glass-card rounded-2xl flex flex-col h-[600px] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        
        {/* Messages Feed */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isUser ? "flex-row-reverse space-x-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 shadow-md ${
                    isUser
                      ? "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900"
                      : "bg-gradient-to-tr from-[#000273] to-[#d5118d] text-[#FFCC00] border border-[#FFCC00]/40"
                  }`}
                >
                  {isUser ? <i className="fa-solid fa-user" /> : <i className="fa-solid fa-sparkles" />}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[82%] space-y-1 ${isUser ? "text-right" : "text-left"}`}>
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? "bg-[#000273] text-white dark:bg-[#FFCC00] dark:text-slate-950 font-medium rounded-tr-none"
                        : "bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700/60"
                    }`}
                  >
                    {msg.text}
                  </div>

                  <div className="flex items-center space-x-2 text-[10px] text-slate-500 dark:text-slate-300 font-semibold px-1 justify-end">
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => handleCopyText(msg.text)}
                        className="hover:text-slate-700 dark:hover:text-slate-100 cursor-pointer ml-2"
                        title="Copiar texto"
                      >
                        <i className="fa-regular fa-copy" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Loading Indicator */}
          {isLoading && (
            <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-300 text-xs font-semibold animate-pulse pl-2">
              <div className="w-8 h-8 rounded-xl bg-[#000273] text-[#FFCC00] flex items-center justify-center">
                <i className="fa-solid fa-spinner fa-spin" />
              </div>
              <span>Gemini AI está redactando una respuesta técnica...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200/80 dark:border-slate-800 flex items-center space-x-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-300 shrink-0">
            Sugerencias:
          </span>
          {AI_SUGGESTION_PROMPTS.map((promptText, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(promptText)}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 border border-slate-200 dark:border-slate-700 hover:border-[#000273] dark:hover:border-[#FFCC00] shrink-0 transition-all cursor-pointer truncate max-w-xs"
            >
              {promptText}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Pregunta sobre CMYK, sangrado o pide un texto publicitario..."
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#000273]"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputPrompt.trim()}
            className="px-5 py-3 rounded-xl bg-[#000273] hover:bg-[#000273]/90 dark:bg-[#FFCC00] dark:text-slate-950 font-black text-xs text-white shadow-md disabled:opacity-50 transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <span>Enviar</span>
            <i className="fa-solid fa-paper-plane text-xs" />
          </button>
        </div>

      </div>
    </div>
  );
};
