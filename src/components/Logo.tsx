import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  src?: string;
  srcLight?: string;
  srcDark?: string;
}

export const BlackGraphicLogo: React.FC<LogoProps> = ({
  className = "",
  size = 48,
  showText = false,
  src,
  srcLight,
  srcDark,
}) => {
  // Direct Official Image URLs from imgbb provided by user
  const defaultLightLogoUrl = "https://i.ibb.co/3mqX1FJF/logs.png";
  const defaultDarkLogoUrl = "https://i.ibb.co/xt2WtJnM/logs-2.png";

  const lightImageUrl = srcLight || src || defaultLightLogoUrl;
  const darkImageUrl = srcDark || src || defaultDarkLogoUrl;

  // Vector SVG Fallbacks for maximum crispness and zero broken image states
  const fallbackLightSvgUri = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="98" fill="%230099FF"/><g fill="%23000273"><path d="M52 24C60 24 66 24 72 24H126C158 24 176 42 176 68C176 90 156 106 126 108C154 114 170 136 160 168C142 140 128 122 98 110H72V176H52V24Z"/><path d="M126 108Q170 120 160 168C142 140 128 122 98 110Z"/><path d="M100 100L120 132C122 142 118 154 110 162H90C82 154 78 142 80 132L100 100Z"/><rect x="87" y="164" width="26" height="6" rx="1"/><rect x="85" y="172" width="30" height="20" rx="1.5"/></g><path d="M72 42H120C134 42 146 50 146 68C146 84 134 90 120 90H72V42Z" fill="%230099FF"/><circle cx="100" cy="128" r="4" fill="%230099FF"/><line x1="100" y1="104" x2="100" y2="124" stroke="%230099FF" stroke-width="3" stroke-linecap="round"/></svg>`;

  const fallbackDarkSvgUri = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="98" fill="%23FFCC00"/><g fill="%23FFFFFF"><path d="M52 24C60 24 66 24 72 24H126C158 24 176 42 176 68C176 90 156 106 126 108C154 114 170 136 160 168C142 140 128 122 98 110H72V176H52V24Z"/><path d="M126 108Q170 120 160 168C142 140 128 122 98 110Z"/><path d="M100 100L120 132C122 142 118 154 110 162H90C82 154 78 142 80 132L100 100Z"/><rect x="87" y="164" width="26" height="6" rx="1"/><rect x="85" y="172" width="30" height="20" rx="1.5"/></g><path d="M72 42H120C134 42 146 50 146 68C146 84 134 90 120 90H72V42Z" fill="%23FFCC00"/><circle cx="100" cy="128" r="4" fill="%23FFCC00"/><line x1="100" y1="104" x2="100" y2="124" stroke="%23FFCC00" stroke-width="3" stroke-linecap="round"/></svg>`;

  return (
    <div className={`flex items-center space-x-3.5 bg-transparent p-0 m-0 border-none shadow-none ${className}`}>
      {/* Completely transparent container - NO rounded borders (border-radius), NO background card */}
      <div 
        className="bg-transparent p-0 m-0 border-0 shadow-none rounded-none shrink-0 flex items-center justify-center overflow-visible"
        style={{ width: size, height: size }}
      >
        {/* Light Mode Logo Image */}
        <img
          src={lightImageUrl}
          alt="Black Graphic Piura Logo (Modo Claro)"
          referrerPolicy="no-referrer"
          style={{ width: size, height: size }}
          className="w-full h-full object-contain bg-transparent border-0 outline-none shadow-none rounded-none p-0 transition-transform duration-300 hover:scale-105 block dark:hidden"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackLightSvgUri;
          }}
        />

        {/* Dark Mode Logo Image */}
        <img
          src={darkImageUrl}
          alt="Black Graphic Piura Logo (Modo Oscuro)"
          referrerPolicy="no-referrer"
          style={{ width: size, height: size }}
          className="w-full h-full object-contain bg-transparent border-0 outline-none shadow-none rounded-none p-0 transition-transform duration-300 hover:scale-105 hidden dark:block"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackDarkSvgUri;
          }}
        />
      </div>

      {showText && (
        <div className="select-none">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-semibold font-bubble uppercase tracking-wider title-gradient">
              BLACK GRAPHIC
            </h1>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-[#FFCC00]/20 text-[#000273] dark:bg-[#FFCC00] dark:text-black border border-[#FFCC00]/50">
              Piura, Perú
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-300 font-medium hidden xs:block">
            Estudio de Impresión & Pre-prensa Digital
          </p>
        </div>
      )}
    </div>
  );
};
