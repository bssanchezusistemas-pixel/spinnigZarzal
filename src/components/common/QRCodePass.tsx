import React from 'react';

interface QRCodePassProps {
  code: string;
  size?: number;
}

export const QRCodePass: React.FC<QRCodePassProps> = ({ code, size = 180 }) => {
  return (
    <div 
      className="p-3 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center relative group"
      style={{ width: size, height: size }}
      title={`Código QR para ${code}`}
      aria-label={`Código de reserva: ${code}`}
    >
      {/* High contrast QR representation */}
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full text-black"
        fill="currentColor"
      >
        {/* Corner 1: Top-Left Finder */}
        <rect x="5" y="5" width="26" height="26" rx="4" fill="black" />
        <rect x="9" y="9" width="18" height="18" rx="2" fill="white" />
        <rect x="13" y="13" width="10" height="10" rx="1" fill="black" />

        {/* Corner 2: Top-Right Finder */}
        <rect x="69" y="5" width="26" height="26" rx="4" fill="black" />
        <rect x="73" y="9" width="18" height="18" rx="2" fill="white" />
        <rect x="77" y="13" width="10" height="10" rx="1" fill="black" />

        {/* Corner 3: Bottom-Left Finder */}
        <rect x="5" y="69" width="26" height="26" rx="4" fill="black" />
        <rect x="9" y="73" width="18" height="18" rx="2" fill="white" />
        <rect x="13" y="77" width="10" height="10" rx="1" fill="black" />

        {/* Timing pattern & data dots */}
        <rect x="35" y="10" width="5" height="5" />
        <rect x="45" y="10" width="5" height="5" />
        <rect x="55" y="10" width="5" height="5" />
        <rect x="10" y="35" width="5" height="5" />
        <rect x="10" y="45" width="5" height="5" />
        <rect x="10" y="55" width="5" height="5" />

        {/* Data clusters */}
        <rect x="35" y="20" width="8" height="5" />
        <rect x="50" y="20" width="12" height="5" />
        <rect x="35" y="30" width="5" height="10" />
        <rect x="44" y="35" width="12" height="5" />
        <rect x="60" y="30" width="6" height="10" />
        <rect x="70" y="35" width="10" height="5" />
        <rect x="85" y="35" width="10" height="10" />

        <rect x="25" y="45" width="8" height="8" />
        <rect x="40" y="48" width="6" height="12" />
        <rect x="52" y="45" width="15" height="5" />
        <rect x="72" y="48" width="8" height="8" />
        <rect x="85" y="52" width="10" height="5" />

        <rect x="35" y="65" width="10" height="5" />
        <rect x="50" y="60" width="8" height="12" />
        <rect x="65" y="65" width="6" height="10" />
        <rect x="75" y="60" width="10" height="5" />
        <rect x="88" y="68" width="7" height="12" />

        <rect x="35" y="78" width="8" height="12" />
        <rect x="48" y="78" width="12" height="6" />
        <rect x="65" y="80" width="8" height="10" />
        <rect x="78" y="75" width="6" height="15" />
        <rect x="88" y="85" width="7" height="6" />
      </svg>

      {/* Center branded mini badge */}
      <div className="absolute inset-0 m-auto w-10 h-10 bg-black rounded-xl border-2 border-[#D4FF00] flex items-center justify-center shadow-lg">
        <span className="text-[#D4FF00] font-black text-[10px] tracking-tighter italic">PR</span>
      </div>
    </div>
  );
};
