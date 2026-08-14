import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Initialize Gemini AI SDK
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "Black Graphic Studio Piura" });
  });

  // Gemini AI Chat Assistant Endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, systemPromptCustom } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "El mensaje es requerido" });
      }

      const defaultSystemPrompt = `Eres el Asistente Creativo y Especialista Técnico de Impresión de 'Black Graphic', un prestigioso estudio de diseño e imprenta ubicado en Piura, Perú (Av. Grau / Zona Centro, Piura).

Tu trabajo es ayudar a clientes y diseñadores en:
1. Asesoría técnica de preprensa e impresión publicitaria: explicación de CMYK vs RGB, resolución recomendada (300 DPI para papelería, 150 DPI para gigantografías), márgenes de sangrado/demasía (3mm), tipos de vinil (adhesivo, microperforado, troquelado), acabados (laminado mate/brillante, ojales, troquel).
2. Redacción publicitaria (Copywriting): slogans persuasivos, mensajes para volantes, ofertas para redes sociales y banners para negocios piuranos (pollerías, cevicherías, tiendas de ropa, eventos, consultorios).
3. Recomendación de formatos según la necesidad comercial del cliente.

Instrucciones de tono e inicio de respuesta:
- Sé amable, profesional, súper claro y entusiasta.
- Utiliza español neutro con amabilidad peruana/piurana si aplica.
- CRÍTICO: NUNCA utilices asteriscos dobles (**) ni ningunos asteriscos para negritas. Escribe texto limpio sin ningún asterisco (* o **), para que sea perfectamente legible sin código de formato visible.
- Menciona que Black Graphic garantiza colores nítidos, alta durabilidad en exteriores e impresión de alta definición en Piura.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: message,
        config: {
          systemInstruction: systemPromptCustom || defaultSystemPrompt,
          temperature: 0.7,
        },
      });

      const cleanReply = (response.text || "").replace(/\*\*/g, "").replace(/\*/g, "");

      res.json({ reply: cleanReply });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({
        error: "Ocurrió un inconveniente al comunicarse con el Asistente AI de Black Graphic.",
        details: error.message || String(error),
      });
    }
  });

  // Vite Middleware integration for Dev / Production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Black Graphic Studio server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
