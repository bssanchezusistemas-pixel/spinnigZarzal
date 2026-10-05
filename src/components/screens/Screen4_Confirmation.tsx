import React from 'react';
import { ArrowLeft, Calendar, Clock, Bike, Layers, User, CheckCircle2 } from 'lucide-react';
import { PantherLogo } from '../common/PantherLogo';
import type { ClassSession } from '../../types';

interface Screen4ConfirmationProps {
  currentClass: ClassSession;
  bikeNumber: string;
  onConfirmBooking: () => void;
  onBack: () => void;
}

export const Screen4_Confirmation: React.FC<Screen4ConfirmationProps> = ({
  currentClass,
  bikeNumber,
  onConfirmBooking,
  onBack,
}) => {
  return (
    <div className="flex-1 flex flex-col justify-between p-5 bg-[#090B0E] overflow-y-auto">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full bg-[#131720] border border-[#222a38] text-slate-300 hover:text-white cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-base font-black font-['Montserrat',sans-serif] text-white tracking-tight">
            Confirmar reserva
          </h1>
        </div>

        {/* Brand Banner */}
        <div className="flex justify-center my-3">
          <PantherLogo size="md" showSubtitle={true} />
        </div>

        {/* Booking Summary Card */}
        <div className="mt-4 p-4 rounded-2xl bg-[#131720] border border-[#222a38] space-y-3.5 shadow-lg">
          {/* Fecha */}
          <div className="flex items-center gap-3 pb-3 border-b border-[#222a38]/60">
            <div className="w-9 h-9 rounded-xl bg-[#1C222F] flex items-center justify-center text-slate-300 shrink-0">
              <Calendar className="w-4 h-4 text-slate-300" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-medium block">Fecha</span>
              <span className="text-xs font-bold text-white">
                {currentClass.dateFormatted}
              </span>
            </div>
          </div>

          {/* Hora */}
          <div className="flex items-center gap-3 pb-3 border-b border-[#222a38]/60">
            <div className="w-9 h-9 rounded-xl bg-[#1C222F] flex items-center justify-center text-slate-300 shrink-0">
              <Clock className="w-4 h-4 text-slate-300" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-medium block">Hora</span>
              <span className="text-xs font-bold text-white">
                {currentClass.time}
              </span>
            </div>
          </div>

          {/* Bicicleta */}
          <div className="flex items-center gap-3 pb-3 border-b border-[#222a38]/60">
            <div className="w-9 h-9 rounded-xl bg-[#D4FF00]/10 border border-[#D4FF00]/40 flex items-center justify-center text-[#D4FF00] shrink-0">
              <Bike className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-medium block">Bicicleta</span>
              <span className="text-sm font-black text-[#D4FF00]">
                #{bikeNumber}
              </span>
            </div>
          </div>

          {/* Tipo de clase */}
          <div className="flex items-center gap-3 pb-3 border-b border-[#222a38]/60">
            <div className="w-9 h-9 rounded-xl bg-[#1C222F] flex items-center justify-center text-slate-300 shrink-0">
              <Layers className="w-4 h-4 text-slate-300" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-medium block">Tipo de clase</span>
              <span className="text-xs font-bold text-white">
                {currentClass.type}
              </span>
            </div>
          </div>

          {/* Instructor */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1C222F] flex items-center justify-center text-slate-300 shrink-0">
              <User className="w-4 h-4 text-slate-300" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-medium block">Instructor</span>
              <span className="text-xs font-bold text-white">
                {currentClass.instructor.name}
              </span>
            </div>
          </div>
        </div>

        {/* Pricing / Payment Policy */}
        <div className="mt-4 p-3.5 rounded-2xl bg-[#0E121A] border border-[#222a38] text-center">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-medium text-slate-300">Total</span>
            <span className="text-xl font-black text-white">$ 0</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 italic">
            (Reserva sin costo, se paga en la entrada)
          </p>
        </div>
      </div>

      {/* Confirm Action */}
      <div className="pt-3">
        <button
          onClick={onConfirmBooking}
          className="w-full py-4 px-6 rounded-2xl bg-[#D4FF00] hover:bg-[#c4ed00] text-black font-extrabold text-base tracking-wide flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(212,255,0,0.35)] transition-all active:scale-[0.98] cursor-pointer"
        >
          <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
          <span>Confirmar reserva</span>
        </button>
      </div>
    </div>
  );
};
