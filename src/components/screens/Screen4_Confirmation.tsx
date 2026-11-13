import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, User, CheckCircle2, ShieldCheck, Ticket, Edit3, Check } from 'lucide-react';
import { PantherLogo } from '../common/PantherLogo';
import type { ClassSession, ClientType } from '../../types';

interface Screen4ConfirmationProps {
  currentClass: ClassSession;
  bikeNumber: string;
  clientType: ClientType;
  onSelectClientType: (type: ClientType) => void;
  clientName: string;
  clientPhone: string;
  onChangeClientInfo: (name: string, phone: string) => void;
  onConfirmBooking: () => void;
  onBack: () => void;
}

export const Screen4_Confirmation: React.FC<Screen4ConfirmationProps> = ({
  currentClass,
  bikeNumber,
  clientType,
  onSelectClientType,
  clientName,
  clientPhone,
  onChangeClientInfo,
  onConfirmBooking,
  onBack,
}) => {
  const [isEditingInfo, setIsEditingInfo] = useState(false);

  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 bg-[#090B0E] overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              aria-label="Volver"
              className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-[#131720] border border-[#222a38] text-slate-300 hover:text-white hover:border-[#D4AF37]/40 active:scale-95 transition-all duration-150 cursor-pointer flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-black font-['Montserrat',sans-serif] text-white tracking-tight">
                Confirmar reserva
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Paso 3 de 3 • Revisa tus datos antes de emitir tu ticket
              </p>
            </div>
          </div>
          <PantherLogo size="sm" showSubtitle={false} />
        </div>

        {/* Responsive Grid: 1 col on mobile, 2 col on PC */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-start">
          {/* Left Column: Summary of class and bike */}
          <div className="md:col-span-6 space-y-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#131720] border border-[#222a38] space-y-3.5 shadow-xl">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold block">
                Detalles del Pedaleo
              </span>

              {/* Class & Bike Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#1C222F] to-[#0E121A] border border-[#222a38] flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Modalidad</span>
                  <span className="text-base font-black text-white font-['Montserrat',sans-serif]">
                    {currentClass.type}
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Studio Zarzal • 45 minutos
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Bici</span>
                  <div className="px-3 py-1.5 rounded-xl bg-gold-gradient text-black font-black text-lg font-mono inline-block shadow-md">
                    #{bikeNumber}
                  </div>
                </div>
              </div>

              {/* Rows */}
              <div className="space-y-2.5 pt-1">
                {/* Fecha */}
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#0E121A] border border-[#222a38]">
                  <div className="w-9 h-9 rounded-lg bg-[#1C222F] flex items-center justify-center text-[#D4AF37] shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Fecha</span>
                    <span className="text-xs font-bold text-white">
                      {currentClass.dateFormatted}
                    </span>
                  </div>
                </div>

                {/* Hora */}
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#0E121A] border border-[#222a38]">
                  <div className="w-9 h-9 rounded-lg bg-[#1C222F] flex items-center justify-center text-[#D4AF37] shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Horario</span>
                    <span className="text-xs font-bold text-white">
                      {currentClass.time}
                    </span>
                  </div>
                </div>

                {/* Coach */}
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#0E121A] border border-[#222a38]">
                  <img 
                    src={currentClass.instructor.avatar} 
                    alt={currentClass.instructor.name} 
                    className="w-9 h-9 rounded-lg object-cover border border-[#D4AF37]/50 shrink-0"
                  />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Instructor</span>
                    <span className="text-xs font-bold text-white">
                      {currentClass.instructor.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Rider Info & Pricing Modalidad & Action Button */}
          <div className="md:col-span-6 space-y-4">
            {/* Modalidad de Cliente Selector (Mensualidad vs Particular) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#131720] border border-[#222a38] space-y-3 shadow-xl">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold block">
                Modalidad de Asistencia
              </span>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => onSelectClientType('mensualidad')}
                  className={`min-h-[64px] p-3 rounded-xl border text-left transition-all duration-150 active:scale-95 cursor-pointer flex flex-col justify-between ${
                    clientType === 'mensualidad'
                      ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-white shadow-lg shadow-[#D4AF37]/20'
                      : 'bg-[#0E121A] border-[#222a38] text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                      Mensualidad
                    </span>
                    {clientType === 'mensualidad' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F3C766] shadow-[0_0_6px_#D4AF37]"></span>
                    )}
                  </div>
                  <span className="text-xs text-[#D4AF37] font-extrabold block">$0 en sala</span>
                  <span className="text-[9px] text-slate-400">Plan mensual activo</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectClientType('particular')}
                  className={`min-h-[64px] p-3 rounded-xl border text-left transition-all duration-150 active:scale-95 cursor-pointer flex flex-col justify-between ${
                    clientType === 'particular'
                      ? 'bg-sky-950/60 border-sky-500 text-white shadow-lg shadow-sky-950/50'
                      : 'bg-[#0E121A] border-[#222a38] text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Ticket className="w-4 h-4 text-sky-400" />
                      Clase Individual
                    </span>
                    {clientType === 'particular' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8]"></span>
                    )}
                  </div>
                  <span className="text-xs text-sky-400 font-extrabold block">$10.000 COP</span>
                  <span className="text-[9px] text-slate-400">Sin membresía (Día)</span>
                </button>
              </div>
            </div>

            {/* Rider Info Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#131720] border border-[#222a38] shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">
                  Datos del Rider
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditingInfo(!isEditingInfo)}
                  className="min-h-[32px] px-2.5 py-1 rounded-lg bg-[#1C222F] border border-[#222a38] text-[11px] font-bold text-[#D4AF37] hover:border-[#D4AF37]/50 active:scale-95 transition-all duration-150 flex items-center gap-1 cursor-pointer"
                >
                  {isEditingInfo ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Listo</span>
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </>
                  )}
                </button>
              </div>

              {isEditingInfo ? (
                <div className="space-y-2.5 pt-1">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Nombre completo:</label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => onChangeClientInfo(e.target.value, clientPhone)}
                      placeholder="Nombre del alumno"
                      className="w-full px-3 py-2 rounded-xl bg-[#0E121A] border border-[#222a38] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">WhatsApp / Celular:</label>
                    <input
                      type="text"
                      value={clientPhone}
                      onChange={(e) => onChangeClientInfo(clientName, e.target.value)}
                      placeholder="+57 300 000 0000"
                      className="w-full px-3 py-2 rounded-xl bg-[#0E121A] border border-[#222a38] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-[#0E121A] border border-[#222a38] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#1C222F] flex items-center justify-center text-slate-300">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">{clientName}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{clientPhone}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/50 text-slate-300 border border-[#222a38]">
                    {clientType === 'mensualidad' ? 'VIP Mensual' : 'Particular'}
                  </span>
                </div>
              )}
            </div>

            {/* Total to pay / confirmation */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#131720] to-[#0E121A] border border-[#222a38] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-400 block">Total a liquidar:</span>
                  <span className="text-[11px] text-slate-400 italic">
                    {clientType === 'mensualidad' 
                      ? '✓ Cubierto por tu Membresía BLACK RIDE' 
                      : 'Pago en recepción o en línea ($10.000)'}
                  </span>
                </div>
                <span className="text-2xl font-black text-white font-mono">
                  {clientType === 'mensualidad' ? '$0 COP' : '$10.000 COP'}
                </span>
              </div>

              {/* Black Ride Policy Notice */}
              <div className="p-2.5 rounded-xl bg-black/40 border border-[#222a38] text-[10px] text-slate-400">
                {clientType === 'mensualidad' ? (
                  <p className="text-[#D4AF37]">
                    🚴 <strong>Beneficio BLACK RIDE:</strong> Has seleccionado tu bicicleta favorita (#{bikeNumber}).
                  </p>
                ) : (
                  <p className="text-sky-300">
                    ℹ️ <strong>Clase individual ($10.000):</strong> Sujeta a disponibilidad de bicicletas en sala.
                  </p>
                )}
              </div>

              {/* Confirm CTA Button */}
              <button
                type="button"
                onClick={onConfirmBooking}
                className="w-full min-h-[52px] py-4 px-6 rounded-2xl bg-gold-gradient hover:brightness-110 text-black font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(212,175,55,0.35)] hover:shadow-[0_4px_30px_rgba(212,175,55,0.5)] active:scale-95 transition-all duration-150 cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                <span>Confirmar Reserva Bici #{bikeNumber}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
