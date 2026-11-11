import React, { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Clock, Bike, User, Wallet, Check, Copy, ArrowRight, Share2 } from 'lucide-react';
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
    try {
      confetti({
        particleCount: 65,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#D4FF00', '#FFFFFF', '#22C55E', '#38BDF8'],
      });
    } catch {
      // safe fallback
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Panther Ride - Bici #${reservation.bikeNumber}`,
        text: `Mi reserva para Indoor Cycling en Zarzal: Bici #${reservation.bikeNumber} (${reservation.dateFormatted} a las ${reservation.time}). Código: ${reservation.bookingCode}`,
      }).catch(() => {});
    } else {
      handleCopyCode();
      alert('Información de la reserva copiada al portapapeles para compartir por WhatsApp');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 bg-[#090B0E] overflow-y-auto">
      <div className="max-w-2xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            aria-label="Volver"
            className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-[#131720] border border-[#222a38] text-slate-300 hover:text-white hover:border-[#D4FF00]/40 active:scale-95 transition-all duration-150 cursor-pointer flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <PantherLogo size="sm" showSubtitle={false} />
          <button
            onClick={handleShare}
            aria-label="Compartir"
            className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-[#131720] border border-[#222a38] text-slate-300 hover:text-[#D4FF00] hover:border-[#D4FF00]/40 active:scale-95 transition-all duration-150 cursor-pointer flex items-center justify-center"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Brand & Greeting */}
        <div className="text-center mb-5">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-2">
            ✓ Reserva Confirmada en Sala
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white font-['Montserrat',sans-serif] tracking-tight">
            ¡Nos vemos en la sala!
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Presenta este código QR en la recepción al llegar
          </p>
        </div>

        {/* Premium Digital Boarding Pass Ticket */}
        <div className="rounded-3xl bg-gradient-to-b from-[#131720] via-[#0E121A] to-[#131720] border border-[#222a38] p-5 sm:p-6 shadow-2xl relative overflow-hidden mb-6">
          {/* Subtle neon glow edge */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4FF00] to-transparent"></div>

          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center py-2">
            <div className="p-3 bg-white rounded-2xl shadow-xl">
              <QRCodePass code={reservation.bookingCode} size={170} />
            </div>

            {/* Reservation Code with Copy button */}
            <div className="mt-3.5 flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Código oficial:</span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="min-h-[36px] px-3 py-1 rounded-xl bg-[#1C222F] border border-[#222a38] hover:border-[#D4FF00]/50 active:scale-95 text-xs font-mono font-black text-[#D4FF00] flex items-center gap-1.5 transition-all duration-150 cursor-pointer shadow-sm"
              >
                <span>{reservation.bookingCode}</span>
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              </button>
            </div>
          </div>

          {/* Ticket Details Divider */}
          <div className="my-4 border-t border-dashed border-[#222a38] relative">
            <div className="absolute -left-8 -top-3 w-6 h-6 rounded-full bg-[#090B0E]"></div>
            <div className="absolute -right-8 -top-3 w-6 h-6 rounded-full bg-[#090B0E]"></div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="p-2.5 rounded-xl bg-[#090B0E] border border-[#222a38]">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block flex items-center gap-1">
                <Bike className="w-3 h-3 text-[#D4FF00]" />
                Bicicleta
              </span>
              <span className="text-base font-black text-[#D4FF00] font-mono mt-0.5 block">
                #{reservation.bikeNumber}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#090B0E] border border-[#222a38]">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#D4FF00]" />
                Horario
              </span>
              <span className="text-xs font-bold text-white mt-1 block">
                {reservation.time}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#090B0E] border border-[#222a38]">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#D4FF00]" />
                Fecha
              </span>
              <span className="text-xs font-bold text-white mt-1 block truncate">
                {reservation.dateFormatted}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#090B0E] border border-[#222a38]">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block flex items-center gap-1">
                <User className="w-3 h-3 text-[#D4FF00]" />
                Coach
              </span>
              <span className="text-xs font-bold text-white mt-1 block truncate">
                {reservation.instructorName}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Wallet & My Classes */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleAddToWallet}
            className="w-full min-h-[48px] py-3.5 px-6 rounded-2xl bg-[#131720] hover:bg-[#1a202c] border border-[#222a38] hover:border-[#D4FF00]/40 text-slate-100 font-extrabold text-xs tracking-wide flex items-center justify-center gap-2.5 active:scale-95 transition-all duration-150 cursor-pointer shadow-md"
          >
            <Wallet className="w-4 h-4 text-[#D4FF00]" />
            <span>{walletAdded ? '✓ Guardado en tu Wallet Digital' : 'Agregar a Apple / Google Wallet'}</span>
          </button>

          <button
            type="button"
            onClick={onGoToMyClasses}
            className="w-full min-h-[48px] py-3.5 px-6 rounded-2xl bg-[#D4FF00] hover:bg-[#c6f000] text-black font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(212,255,0,0.35)] active:scale-95 transition-all duration-150 cursor-pointer"
          >
            <span>Ver en "Mis Clases"</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
