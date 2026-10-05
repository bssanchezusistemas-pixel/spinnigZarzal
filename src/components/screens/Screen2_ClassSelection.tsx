import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Bike, User, ChevronRight, Menu } from 'lucide-react';
import { PantherLogo } from '../common/PantherLogo';
import type { ClassSession } from '../../types';

interface Screen2ClassSelectionProps {
  currentClass: ClassSession;
  onContinue: (updatedClass?: Partial<ClassSession>) => void;
  onOpenMenu?: () => void;
}

export const Screen2_ClassSelection: React.FC<Screen2ClassSelectionProps> = ({
  currentClass,
  onContinue,
  onOpenMenu,
}) => {
  const [selectedTime, setSelectedTime] = useState<string>(currentClass.time);
  const [showTimeModal, setShowTimeModal] = useState<boolean>(false);

  const times = ['6:00 a. m.', '8:00 a. m.', '6:00 p. m.', '7:30 p. m.'];

  return (
    <div className="flex-1 flex flex-col justify-between p-5 bg-[#090B0E] overflow-y-auto">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <PantherLogo size="sm" showSubtitle={false} />
          <button 
            onClick={onOpenMenu}
            className="p-2 rounded-xl bg-[#131720] border border-[#222a38] text-slate-300 hover:text-white cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <h1 className="text-xl font-black font-['Montserrat',sans-serif] text-white tracking-tight mb-5">
          Reservar clase
        </h1>

        {/* Form Selection Cards */}
        <div className="space-y-3">
          {/* 1. Fecha */}
          <div className="p-3.5 rounded-2xl bg-[#131720] border border-[#222a38] flex items-center justify-between transition-colors hover:border-[#D4FF00]/40 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1C222F] flex items-center justify-center text-slate-300">
                <CalendarIcon className="w-5 h-5 text-slate-300" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">Fecha</span>
                <span className="text-xs font-bold text-white">
                  {currentClass.dateFormatted}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          {/* 2. Hora */}
          <div 
            onClick={() => setShowTimeModal(true)}
            className="p-3.5 rounded-2xl bg-[#131720] border border-[#222a38] flex items-center justify-between transition-colors hover:border-[#D4FF00]/40 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1C222F] flex items-center justify-center text-slate-300">
                <Clock className="w-5 h-5 text-slate-300" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">Hora</span>
                <span className="text-xs font-bold text-white">
                  {selectedTime}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          {/* 3. Tipo de clase */}
          <div className="p-3.5 rounded-2xl bg-[#131720] border border-[#222a38] flex items-center justify-between transition-colors hover:border-[#D4FF00]/40 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1C222F] flex items-center justify-center text-[#D4FF00]">
                <Bike className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">Tipo de clase</span>
                <span className="text-xs font-bold text-white block">
                  {currentClass.type}
                </span>
                <span className="text-[10px] text-slate-400">
                  {currentClass.description}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          {/* 4. Instructor */}
          <div className="p-3.5 rounded-2xl bg-[#131720] border border-[#222a38] flex items-center justify-between transition-colors hover:border-[#D4FF00]/40 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1C222F] flex items-center justify-center text-slate-300">
                <User className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">Instructor</span>
                <span className="text-xs font-bold text-white block">
                  {currentClass.instructor.name}
                </span>
              </div>
            </div>
            <img 
              src={currentClass.instructor.avatar} 
              alt={currentClass.instructor.name} 
              className="w-9 h-9 rounded-full object-cover border-2 border-[#D4FF00]/60 shadow-sm"
            />
          </div>
        </div>

        {/* Cupos disponibles */}
        <div className="mt-5 p-4 rounded-2xl bg-[#131720] border border-[#222a38]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-300">Cupos disponibles</span>
            <span className="text-xs font-extrabold text-[#D4FF00]">
              {currentClass.availableSpots} / {currentClass.totalSpots}
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-[#1C222F] overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-[#D4FF00] rounded-full transition-all duration-500"
              style={{ width: `${(currentClass.availableSpots / currentClass.totalSpots) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Continue Action */}
      <div className="pt-4">
        <button
          onClick={() => onContinue({ time: selectedTime })}
          className="w-full py-4 px-6 rounded-2xl bg-[#D4FF00] hover:bg-[#c4ed00] text-black font-extrabold text-base tracking-wide flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(212,255,0,0.35)] transition-all active:scale-[0.98] cursor-pointer"
        >
          <span>Continuar</span>
        </button>
      </div>

      {/* Time Picker Modal */}
      {showTimeModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end">
          <div className="w-full bg-[#131720] border-t border-[#222a38] p-5 rounded-t-3xl animate-in slide-in-from-bottom">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white text-sm">Selecciona horario</h3>
              <button 
                onClick={() => setShowTimeModal(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cerrar
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {times.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setSelectedTime(t);
                    setShowTimeModal(false);
                  }}
                  className={`py-3 rounded-xl text-xs font-bold transition-all ${
                    selectedTime === t
                      ? 'bg-[#D4FF00] text-black shadow-lg shadow-[#D4FF00]/20'
                      : 'bg-[#1C222F] text-slate-200 hover:bg-[#252d3d]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
