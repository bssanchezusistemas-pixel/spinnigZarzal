import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, Bike, User, CheckCircle2, ShieldCheck, Ticket } from 'lucide-react';
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
    <div className="flex-1 flex flex-col justify-between p-4 bg-[#090B0E] overflow-y-auto">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-3 mb-3">
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
        <div className="flex justify-center my-2">
          <PantherLogo size="sm" showSubtitle={true} />
        </div>

        {/* Modalidad de Cliente Selector (Mensualidad vs Particular) */}
        <div className="mb-3 p-3 rounded-2xl bg-[#131720] border border-[#222a38]">
          <span className="text-[11px] text-slate-400 block mb-2 font-medium">
            ¿Cómo vas a asistir hoy?
          </span>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onSelectClientType('mensualidad')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                clientType === 'mensualidad'
                  ? 'bg-emerald-950/50 border-emerald-500 text-white shadow-md shadow-emerald-950'
                  : 'bg-[#0e121a] border-[#222a38] text-slate-400 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Mensualidad
                </span>
                {clientType === 'mensualidad' && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                )}
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold block">Costo $0 en sala</span>
              <span className="text-[9px] text-slate-400">Plan mensual activo</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectClientType('particular')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                clientType === 'particular'
                  ? 'bg-sky-950/50 border-sky-500 text-white shadow-md shadow-sky-950'
                  : 'bg-[#0e121a] border-[#222a38] text-slate-400 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  <Ticket className="w-3.5 h-3.5 text-sky-400" />
                  Particular
                </span>
                {clientType === 'particular' && (
                  <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                )}
              </div>
              <span className="text-[10px] text-sky-400 font-semibold block">$15.000 COP</span>
              <span className="text-[9px] text-slate-400">Pago por el día</span>
            </button>
          </div>
        </div>

        {/* Client Name & Phone Card */}
        <div className="mb-3 p-3 rounded-2xl bg-[#131720] border border-[#222a38]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-slate-400 font-medium">Datos del Alumno / Rider:</span>
            <button
              onClick={() => setIsEditingInfo(!isEditingInfo)}
              className="text-[10px] text-[#D4FF00] font-bold hover:underline cursor-pointer"
            >
              {isEditingInfo ? 'Listo' : 'Editar'}
            </button>
          </div>

          {isEditingInfo ? (
            <div className="space-y-2 pt-1">
              <input
                type="text"
                value={clientName}
                onChange={(e) => onChangeClientInfo(e.target.value, clientPhone)}
                placeholder="Nombre completo"
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#0e121a] border border-[#222a38] text-xs text-white focus:outline-none focus:border-[#D4FF00]"
              />
              <input
                type="text"
                value={clientPhone}
                onChange={(e) => onChangeClientInfo(clientName, e.target.value)}
                placeholder="Celular (WhatsApp)"
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#0e121a] border border-[#222a38] text-xs text-white focus:outline-none focus:border-[#D4FF00]"
              />
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">{clientName}</span>
                <span className="text-[10px] text-slate-400 font-mono">{clientPhone}</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/40 text-slate-300 border border-[#222a38]">
                {clientType === 'mensualidad' ? 'VIP Mensual' : 'Drop-in'}
              </span>
            </div>
          )}
        </div>

        {/* Booking Summary Card */}
        <div className="p-3.5 rounded-2xl bg-[#131720] border border-[#222a38] space-y-2.5 shadow-lg">
          {/* Fecha */}
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#222a38]/60">
            <div className="w-8 h-8 rounded-xl bg-[#1C222F] flex items-center justify-center text-slate-300 shrink-0">
              <Calendar className="w-3.5 h-3.5 text-slate-300" />
            </div>
            <div>
              <span className="text-[9px] text-slate-400 font-medium block">Fecha</span>
              <span className="text-xs font-bold text-white">
                {currentClass.dateFormatted}
              </span>
            </div>
          </div>

          {/* Hora */}
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#222a38]/60">
            <div className="w-8 h-8 rounded-xl bg-[#1C222F] flex items-center justify-center text-slate-300 shrink-0">
              <Clock className="w-3.5 h-3.5 text-slate-300" />
            </div>
            <div>
              <span className="text-[9px] text-slate-400 font-medium block">Hora</span>
              <span className="text-xs font-bold text-white">
                {currentClass.time}
              </span>
            </div>
          </div>

          {/* Bicicleta */}
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#222a38]/60">
            <div className="w-8 h-8 rounded-xl bg-[#D4FF00]/10 border border-[#D4FF00]/40 flex items-center justify-center text-[#D4FF00] shrink-0">
              <Bike className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[9px] text-slate-400 font-medium block">Bicicleta Asignada</span>
              <span className="text-sm font-black text-[#D4FF00]">
                #{bikeNumber}
              </span>
            </div>
          </div>

          {/* Instructor */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1C222F] flex items-center justify-center text-slate-300 shrink-0">
              <User className="w-3.5 h-3.5 text-slate-300" />
            </div>
            <div>
              <span className="text-[9px] text-slate-400 font-medium block">Coach</span>
              <span className="text-xs font-bold text-white">
                {currentClass.instructor.name}
              </span>
            </div>
          </div>
        </div>

        {/* Pricing / Payment Policy */}
        <div className="mt-3 p-3 rounded-2xl bg-[#0E121A] border border-[#222a38]">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-medium text-slate-300">
              {clientType === 'mensualidad' ? 'Total Reserva:' : 'Total Clase del Día:'}
            </span>
            <span className="text-xl font-black text-white font-mono">
              {clientType === 'mensualidad' ? '$ 0 COP' : '$ 15.000 COP'}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 italic text-center">
            {clientType === 'mensualidad' 
              ? '✓ Cubierto 100% por tu suscripción mensual activa' 
              : 'Se cancela en la recepción (Efectivo o Nequi) al ingresar'}
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
          <span>Confirmar reserva Bici #{bikeNumber}</span>
        </button>
      </div>
    </div>
  );
};
