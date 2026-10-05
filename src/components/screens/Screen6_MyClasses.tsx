import React, { useState } from 'react';
import { Calendar, Clock, Bike, User, ChevronRight, CheckCircle2 } from 'lucide-react';
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
    <div className="flex-1 flex flex-col justify-between p-5 bg-[#090B0E] overflow-y-auto">
      <div>
        <h1 className="text-xl font-black font-['Montserrat',sans-serif] text-white tracking-tight mb-4 text-center">
          Mis clases
        </h1>

        {/* Tab Switcher: Próximas vs Historial */}
        <div className="p-1 rounded-2xl bg-[#131720] border border-[#222a38] flex items-center mb-5">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'upcoming'
                ? 'bg-[#D4FF00] text-black shadow-md shadow-[#D4FF00]/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Próximas
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-[#D4FF00] text-black shadow-md shadow-[#D4FF00]/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Historial
          </button>
        </div>

        {/* Class Cards List */}
        {activeTab === 'upcoming' ? (
          <div className="space-y-4">
            {reservations.length > 0 ? (
              reservations.map((res) => (
                <div
                  key={res.id}
                  className="rounded-3xl bg-[#131720] border border-[#222a38] overflow-hidden shadow-xl relative group transition-all hover:border-[#D4FF00]/40"
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
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#D4FF00] text-black text-[10px] font-black tracking-wide flex items-center gap-1 shadow-md">
                      <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                      <span>Confirmada</span>
                    </div>

                    <div className="absolute bottom-2 left-4">
                      <span className="text-lg font-black text-white font-['Montserrat',sans-serif] tracking-tight">
                        {res.className}
                      </span>
                    </div>
                  </div>

                  {/* Class Info Rows */}
                  <div className="p-4 space-y-2.5">
                    <div className="flex items-center gap-2.5 text-xs text-slate-200">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{res.dateFormatted}</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-xs text-slate-200">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{res.time}</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-xs font-bold text-[#D4FF00]">
                      <Bike className="w-3.5 h-3.5 shrink-0" />
                      <span>Bicicleta #{res.bikeNumber}</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-xs text-slate-200 pb-1">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{res.instructorName}</span>
                    </div>

                    {/* Ver Detalle Button */}
                    <button
                      onClick={() => onViewDetail(res)}
                      className="w-full mt-2 py-3 rounded-xl bg-[#1C222F] hover:bg-[#252d3d] border border-[#222a38] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Ver detalle y código QR</span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 px-4 rounded-3xl bg-[#131720] border border-[#222a38]">
                <Bike className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-white">No tienes clases próximas reservadas</p>
                <p className="text-[11px] text-slate-400 mt-1">¡Selecciona un horario y reserva tu bici!</p>
                <button
                  onClick={onBookNewClass}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-[#D4FF00] text-black font-extrabold text-xs cursor-pointer shadow-lg"
                >
                  Reservar ahora
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 px-4 rounded-3xl bg-[#131720] border border-[#222a38]">
            <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-bold text-white">Historial de clases vacío</p>
            <p className="text-[11px] text-slate-400 mt-1">Aquí verás las clases completadas y tus estadísticas de pedaleo.</p>
          </div>
        )}
      </div>

      <div className="pt-4">
        <button
          onClick={onBookNewClass}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#D4FF00] hover:bg-[#c4ed00] text-black font-extrabold text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(212,255,0,0.35)] transition-all cursor-pointer"
        >
          <span>Reservar otra clase</span>
        </button>
      </div>
    </div>
  );
};
