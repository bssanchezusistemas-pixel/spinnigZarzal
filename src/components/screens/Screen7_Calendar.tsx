import React, { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Clock, Bike, ChevronRight as RightIcon, Sparkles } from 'lucide-react';
import type { ClassSession } from '../../types';

interface Screen7CalendarProps {
  scheduledClasses: ClassSession[];
  onSelectClass: (cls: ClassSession) => void;
  onBack: () => void;
}

export const Screen7_Calendar: React.FC<Screen7CalendarProps> = ({
  scheduledClasses,
  onSelectClass,
  onBack,
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(25);

  const daysOfWeek = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 bg-[#090B0E] overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              aria-label="Volver"
              className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-[#131720] border border-[#222a38] text-slate-300 hover:text-white hover:border-[#D4FF00]/40 active:scale-95 transition-all duration-150 cursor-pointer flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-black font-['Montserrat',sans-serif] text-white tracking-tight">
                Calendario de clases
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Reserva con antelación para asegurar tu bicicleta preferida
              </p>
            </div>
          </div>
        </div>

        {/* Responsive Grid: 1 col on mobile, 2 col on PC */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-start">
          {/* Left Column: Calendar Date Grid */}
          <div className="md:col-span-6 space-y-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#131720] border border-[#222a38] shadow-xl">
              {/* Month Selector */}
              <div className="flex items-center justify-between px-1 mb-4">
                <button 
                  type="button"
                  className="min-h-[36px] min-w-[36px] p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#1C222F] active:scale-95 transition-all duration-150 cursor-pointer flex items-center justify-center"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="text-center">
                  <span className="font-extrabold text-sm text-white tracking-wide font-['Montserrat',sans-serif] block">
                    Septiembre 2026
                  </span>
                  <span className="text-[10px] text-slate-400">Studio Zarzal</span>
                </div>
                <button 
                  type="button"
                  className="min-h-[36px] min-w-[36px] p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#1C222F] active:scale-95 transition-all duration-150 cursor-pointer flex items-center justify-center"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Days of week header */}
              <div className="grid grid-cols-7 gap-1 text-center mb-2.5">
                {daysOfWeek.map((day, idx) => (
                  <span key={idx} className="text-[11px] font-bold text-slate-400 py-1">
                    {day}
                  </span>
                ))}
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
                <div></div>

                {calendarDays.map((day) => {
                  const isSelected = day === selectedDay;
                  const hasClasses = day === 25 || day === 24 || day === 26 || day === 28;

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setSelectedDay(day)}
                      className={`h-9 w-9 sm:h-10 sm:w-10 mx-auto rounded-xl flex flex-col items-center justify-center font-bold transition-all duration-150 relative cursor-pointer active:scale-95 ${
                        isSelected
                          ? 'bg-[#D4FF00] text-black shadow-md shadow-[#D4FF00]/40 font-black scale-105'
                          : hasClasses
                          ? 'text-white hover:bg-[#1C222F] border border-transparent hover:border-[#D4FF00]/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-[#1C222F]/50'
                      }`}
                    >
                      <span>{day}</span>
                      {!isSelected && hasClasses && (
                        <span className="w-1 h-1 rounded-full bg-[#D4FF00] mt-0.5"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Classes Scheduled for the Selected Day */}
          <div className="md:col-span-6 space-y-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#131720] border border-[#222a38] shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#222a38]">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-bold block">
                    Horarios programados
                  </span>
                  <span className="text-sm font-black text-white">
                    {selectedDay} de Septiembre de 2026
                  </span>
                </div>
                <span className="text-xs font-bold text-[#D4FF00] bg-[#D4FF00]/10 px-2.5 py-1 rounded-lg border border-[#D4FF00]/30">
                  {scheduledClasses.length} sesiones
                </span>
              </div>

              <div className="space-y-2.5 pt-1">
                {scheduledClasses.map((cls) => (
                  <div
                    key={cls.id}
                    onClick={() => onSelectClass(cls)}
                    className="p-3.5 rounded-xl bg-[#0E121A] border border-[#222a38] flex items-center justify-between hover:border-[#D4FF00]/60 active:scale-98 transition-all duration-150 cursor-pointer group shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#1C222F] flex items-center justify-center text-[#D4FF00] group-hover:scale-105 transition-all">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-white">
                            {cls.time}
                          </span>
                          <span className="text-[11px] text-slate-300 font-medium">
                            {cls.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Bike className="w-3 h-3 text-[#D4FF00]" />
                          <span>Coach: {cls.instructor.name}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-500/30">
                        {cls.availableSpots}/{cls.totalSpots} cupos
                      </span>
                      <RightIcon className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4FF00]" />
                <span>Haz clic en un horario para seleccionar tu bicicleta</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
