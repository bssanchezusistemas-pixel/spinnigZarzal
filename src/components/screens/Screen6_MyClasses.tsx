import React, { useState } from 'react';
import { Calendar, Clock, Bike, User, ChevronRight, CheckCircle2, Plus } from 'lucide-react';
import type { Reservation } from '../../types';

interface Screen6MyClassesProps {
  reservations: Reservation[];
  onViewDetail: (res: Reservation) => void;
  onBookNewClass: () => void;
}

export const Screen6_MyClasses: React.FC<Screen6MyClassesProps> = ({
  reservations,
  onViewDetail,
  onBookNewClass,
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');

  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 bg-[#090B0E] overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-black font-['Montserrat',sans-serif] text-white tracking-tight">
              Mis clases de pedaleo
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Gestiona tus reservas y tickets digitales
            </p>
          </div>

          <button
            type="button"
            onClick={onBookNewClass}
            className="hidden sm:inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl bg-gold-gradient hover:brightness-110 text-black font-black text-xs transition-all duration-150 active:scale-95 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Nueva Reserva</span>
          </button>
        </div>

        {/* Tab Switcher: Próximas vs Historial */}
        <div className="max-w-xs mx-auto p-1 rounded-2xl bg-[#131720] border border-[#222a38] flex items-center mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 min-h-[40px] py-2 text-xs font-bold rounded-xl transition-all duration-150 active:scale-95 cursor-pointer ${
              activeTab === 'upcoming'
                ? 'bg-gold-gradient text-black shadow-md shadow-[#D4AF37]/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Próximas ({reservations.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex-1 min-h-[40px] py-2 text-xs font-bold rounded-xl transition-all duration-150 active:scale-95 cursor-pointer ${
              activeTab === 'history'
                ? 'bg-gold-gradient text-black shadow-md shadow-[#D4AF37]/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Historial
          </button>
        </div>

        {/* Class Cards Grid */}
        {activeTab === 'upcoming' ? (
          <div>
            {reservations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reservations.map((res) => (
                  <div
                    key={res.id}
                    className="rounded-3xl bg-[#131720] border border-[#222a38] overflow-hidden shadow-xl relative group transition-all duration-150 hover:border-[#D4AF37]/40 flex flex-col justify-between"
                  >
                    {/* Studio Image Header with Badge */}
                    <div className="h-32 w-full relative overflow-hidden bg-zinc-800">
                      <img
                        src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80"
                        alt="Indoor cycling room"
                        className="w-full h-full object-cover brightness-75 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#131720] via-transparent to-black/40"></div>

                      {/* Badge Confirmada */}
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-gold-gradient text-black text-[10px] font-black tracking-wide flex items-center gap-1 shadow-md">
                        <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                        <span>Confirmada</span>
                      </div>

                      <div className="absolute bottom-2 left-4">
                        <span className="text-base font-black text-white font-['Montserrat',sans-serif] tracking-tight">
                          {res.className}
                        </span>
                      </div>
                    </div>

                    {/* Class Info Rows */}
                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5 text-xs text-slate-200">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{res.dateFormatted}</span>
                        </div>

                        <div className="flex items-center gap-2.5 text-xs text-slate-200">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{res.time}</span>
                        </div>

                        <div className="flex items-center gap-2.5 text-xs font-bold text-[#D4AF37]">
                          <Bike className="w-3.5 h-3.5 shrink-0" />
                          <span>Bicicleta #{res.bikeNumber}</span>
                        </div>

                        <div className="flex items-center gap-2.5 text-xs text-slate-200 pb-1">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{res.instructorName}</span>
                        </div>
                      </div>

                      {/* Ver Detalle Button */}
                      <button
                        type="button"
                        onClick={() => onViewDetail(res)}
                        className="w-full min-h-[44px] mt-3 py-2.5 px-4 rounded-xl bg-[#1C222F] hover:bg-[#252d3d] border border-[#222a38] hover:border-[#D4AF37]/40 text-white text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all duration-150 cursor-pointer shadow-sm"
                      >
                        <span>Ver detalle y código QR</span>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4 rounded-3xl bg-[#131720] border border-[#222a38]">
                <Bike className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-bold text-white">No tienes clases próximas reservadas</p>
                <p className="text-xs text-slate-400 mt-1">¡Selecciona un horario y reserva tu bici en la sala!</p>
                <button
                  type="button"
                  onClick={onBookNewClass}
                  className="mt-4 min-h-[44px] px-6 py-2.5 rounded-xl bg-gold-gradient hover:brightness-110 text-black font-extrabold text-xs active:scale-95 transition-all duration-150 cursor-pointer shadow-lg"
                >
                  Reservar ahora
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 px-4 rounded-3xl bg-[#131720] border border-[#222a38]">
            <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-white">Historial de clases vacío</p>
            <p className="text-xs text-slate-400 mt-1">Aquí verás las clases completadas y tus estadísticas de pedaleo en Panther Ride.</p>
          </div>
        )}
      </div>

      {/* Bottom Action for Mobile */}
      <div className="pt-4 sm:hidden">
        <button
          type="button"
          onClick={onBookNewClass}
          className="w-full min-h-[50px] py-3.5 px-6 rounded-2xl bg-gold-gradient hover:brightness-110 text-black font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(212,175,55,0.35)] active:scale-95 transition-all duration-150 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Reservar otra clase</span>
        </button>
      </div>
    </div>
  );
};
