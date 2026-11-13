import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodePassProps {
  code: string;
  size?: number;
}

export const QRCodePass: React.FC<QRCodePassProps> = ({ code, size = 180 }) => {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(code, {
      width: size * 2,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H', // High error correction permits center logo overlay
    })
      .then((url) => {
        if (isMounted) setDataUrl(url);
      })
      .catch((err) => console.error('Error generating QR Code:', err));

    return () => {
      isMounted = false;
    };
  }, [code, size]);

  return (
    <div 
      className="p-3 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center relative group"
      style={{ width: size, height: size }}
      title={`Código QR oficial para: ${code}`}
      aria-label={`Código de reserva: ${code}`}
    >
      {dataUrl ? (
        <img 
          src={dataUrl} 
          alt={`Código QR ${code}`} 
          className="w-full h-full object-contain rounded-lg"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-xs font-mono text-slate-400">
          Generando QR...
        </div>
      )}

      {/* Center branded mini badge */}
      <div className="absolute inset-0 m-auto w-10 h-10 bg-black rounded-xl border-2 border-[#D4AF37] flex items-center justify-center shadow-lg pointer-events-none">
        <span className="text-[#D4AF37] font-black text-[10px] tracking-tighter italic font-['Montserrat',sans-serif]">
          PR
        </span>
      </div>
    </div>
  );
};
