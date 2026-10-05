import React, { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Clock, Bike, ChevronRight as RightIcon } from 'lucide-react';
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
  // September 2026 starts on Tuesday -> 1 empty slot
  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="flex-1 flex flex-col justify-between p-5 bg-[#090B0E] overflow-y-auto">
      <div>
        {/* Top Header */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full bg-[#131720] border border-[#222a38] text-slate-300 hover:text-white cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-base font-black font-['Montserrat',sans-serif] text-white tracking-tight">
            Calendario
          </h1>
        </div>

        {/* Month Selector */}
        <div className="flex items-center justify-between px-2 mb-3">
          <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#131720] cursor-pointer">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-extrabold text-sm text-white tracking-wide font-['Montserrat',sans-serif]">
            Septiembre 2026
          </span>
          <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#131720] cursor-pointer">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Calendar Grid Card */}
        <div className="p-3 rounded-2xl bg-[#131720] border border-[#222a38] shadow-md mb-5">
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {daysOfWeek.map((day, idx) => (
              <span key={idx} className="text-[11px] font-bold text-slate-400">
                {day}
              </span>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            <div></div>

            {calendarDays.map((day) => {
              const isSelected = day === selectedDay;
              const hasClasses = day === 25 || day === 24 || day === 26 || day === 28;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`h-8 w-8 mx-auto rounded-full flex items-center justify-center font-bold transition-all relative cursor-pointer ${
                    isSelected
                      ? 'bg-[#D4FF00] text-black shadow-md shadow-[#D4FF00]/40 font-extrabold scale-105'
                      : hasClasses
                      ? 'text-white hover:bg-[#1C222F]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{day}</span>
                  {!isSelected && hasClasses && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#D4FF00]"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Classes Available on selected day */}
        <div>
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            Clases disponibles ({selectedDay} de Septiembre)
          </h2>

          <div className="space-y-2.5">
            {scheduledClasses.map((cls) => (
              <div
                key={cls.id}
                onClick={() => onSelectClass(cls)}
                className="p-3.5 rounded-2xl bg-[#131720] border border-[#222a38] flex items-center justify-between hover:border-[#D4FF00]/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#1C222F] flex items-center justify-center text-[#D4FF00] group-hover:scale-110 transition-transform">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-white">
                        {cls.time}
                      </span>
                      <span className="text-[11px] text-slate-400">
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
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-500/30">
                    {cls.availableSpots}/{cls.totalSpots}
                  </span>
                  <RightIcon className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-3">
        <p className="text-[10px] text-center text-slate-400">
          Toca cualquier clase para seleccionar tu bicicleta en la sala
        </p>
      </div>
    </div>
  );
};
