import React, { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Clock, Bike, Layers, User, Wallet, Check, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PantherLogo } from '../common/PantherLogo';
import { QRCodePass } from '../common/QRCodePass';
import type { Reservation } from '../../types';

interface Screen5TicketQRProps {
  reservation: Reservation;
  onBack: () => void;
  onGoToMyClasses: () => void;
}

export const Screen5_TicketQR: React.FC<Screen5TicketQRProps> = ({
  reservation,
  onBack,
  onGoToMyClasses,
}) => {
  const [walletAdded, setWalletAdded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Trigger celebratory confetti on screen load
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4FF00', '#FFFFFF', '#22C55E', '#38BDF8'],
      });
    } catch {
      // safe fallback if canvas not available
    }
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(reservation.bookingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddToWallet = () => {
    setWalletAdded(true);
    setTimeout(() => {
      alert(`¡Pase para Bicicleta #${reservation.bikeNumber} agregado exitosamente a tu Wallet digital!`);
    }, 300);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 bg-[#090B0E] overflow-y-auto">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full bg-[#131720] border border-[#222a38] text-slate-300 hover:text-white cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-base font-black font-['Montserrat',sans-serif] text-white tracking-tight">
            Mi reserva
          </h1>
          <div className="w-7"></div>
        </div>

        {/* Brand & Greeting */}
        <div className="flex flex-col items-center text-center my-1">
          <PantherLogo size="sm" showSubtitle={false} className="mb-1" />
          <h2 className="text-base font-extrabold text-white font-['Montserrat',sans-serif] tracking-tight">
            ¡Nos vemos en la sala!
          </h2>
          <p className="text-[11px] text-slate-400">Presenta este código en la entrada</p>
        </div>

        {/* QR Code Card */}
        <div className="flex flex-col items-center justify-center my-3">
          <QRCodePass code={reservation.bookingCode} size={160} />
          
          {/* Reservation Code with Copy button */}
          <div className="mt-2.5 flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Código de reserva:</span>
            <button
              onClick={handleCopyCode}
              className="px-2 py-0.5 rounded-md bg-[#131720] border border-[#222a38] text-xs font-mono font-bold text-[#D4FF00] flex items-center gap-1 hover:border-[#D4FF00]/50 transition-colors cursor-pointer"
            >
              <span>{reservation.bookingCode}</span>
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
            </button>
          </div>
        </div>

        {/* Ticket Details List */}
        <div className="bg-[#131720] rounded-2xl border border-[#222a38] p-3 space-y-2 text-xs">
          <div className="flex items-center gap-2.5 text-slate-200">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium">{reservation.dateFormatted}</span>
          </div>

          <div className="flex items-center gap-2.5 text-slate-200">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium">{reservation.time}</span>
          </div>

          <div className="flex items-center gap-2.5 text-[#D4FF00] font-bold">
            <Bike className="w-3.5 h-3.5 shrink-0" />
            <span>Bicicleta #{reservation.bikeNumber}</span>
          </div>

          <div className="flex items-center gap-2.5 text-slate-200">
            <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium">{reservation.className}</span>
          </div>

          <div className="flex items-center gap-2.5 text-slate-200">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium">{reservation.instructorName}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons: Wallet & My Classes */}
      <div className="pt-3 space-y-2">
        <button
          onClick={handleAddToWallet}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#131720] hover:bg-[#1a202c] border border-[#222a38] text-slate-100 font-bold text-xs tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
        >
          <Wallet className="w-4 h-4 text-[#D4FF00]" />
          <span>{walletAdded ? '✓ En Apple / Google Wallet' : 'Agregar a Wallet'}</span>
        </button>

        <button
          onClick={onGoToMyClasses}
          className="w-full py-2.5 text-center text-xs text-[#D4FF00] hover:underline font-semibold cursor-pointer"
        >
          Ver en "Mis Clases" →
        </button>
      </div>
    </div>
  );
};
