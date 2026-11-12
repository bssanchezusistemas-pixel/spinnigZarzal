import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Bike, ChevronRight, Menu, Check, Zap } from 'lucide-react';
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
  const [selectedClassType, setSelectedClassType] = useState<string>(currentClass.type);

  const times = [
    { time: '6:00 a. m.', label: 'Apertura Mañana', intensity: 'Media-Alta' },
    { time: '8:00 a. m.', label: 'Energía Matutina', intensity: 'Alta' },
    { time: '6:00 p. m.', label: 'Hora Pico / Resistencia', intensity: 'Extrema' },
    { time: '7:30 p. m.', label: 'Cierre Nocturno', intensity: 'Alta' },
  ];

  const classTypes = [
    { id: 'Indoor Cycling', name: 'Indoor Cycling', subtitle: 'Fuerza & Ritmo • 50 min' },
    { id: 'Power Sprint', name: 'Power Sprint', subtitle: 'HIIT & Quema calórica • 45 min' },
    { id: 'Endurance Ride', name: 'Endurance Ride', subtitle: 'Resistencia cardiovascular • 60 min' },
  ];

  const handleContinue = () => {
    onContinue({ 
      time: selectedTime,
      type: selectedClassType,
    });
  };

  const occupancyRatio = (currentClass.availableSpots / currentClass.totalSpots) * 100;

  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 bg-[#090B0E] overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <PantherLogo size="sm" showSubtitle={false} />
          <button 
            onClick={onOpenMenu}
            aria-label="Menú principal"
            className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-[#131720] border border-[#222a38] text-slate-300 hover:text-white hover:border-[#D4AF37]/50 active:scale-95 transition-all duration-150 cursor-pointer flex items-center justify-center"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Page Title & Context */}
        <div className="mb-5 sm:mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider mb-2">
            <Zap className="w-3 h-3" />
            <span>Paso 1 de 3 • Zarzal, Valle</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black font-['Montserrat',sans-serif] text-white tracking-tight">
            Configura tu sesión de pedaleo
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Selecciona tu horario preferido y modalidad de entrenamiento.
          </p>
        </div>

        {/* Responsive Content Grid: 1 col on mobile, 2 col on PC */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
          {/* Left Column (Inputs & Time Pills) */}
          <div className="md:col-span-7 space-y-4">
            {/* 1. Fecha Card */}
            <div className="p-4 rounded-2xl bg-[#131720] border border-[#222a38] flex items-center justify-between transition-all hover:border-[#333f52]">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#1C222F] flex items-center justify-center text-[#D4AF37] shrink-0 border border-[#222a38]">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">Fecha de sesión</span>
                  <span className="text-sm font-bold text-white block mt-0.5">
                    {currentClass.dateFormatted}
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-slate-400 bg-black/40 px-2.5 py-1 rounded-lg border border-[#222a38]">
                Hoy
              </span>
            </div>

            {/* 2. Horarios interactivos en 1 clic */}
            <div className="p-4 rounded-2xl bg-[#131720] border border-[#222a38]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Selecciona Horario
                </span>
                <span className="text-[11px] text-[#D4AF37] font-bold">1 clic para elegir</span>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                {times.map((t) => {
                  const isSelected = selectedTime === t.time;
                  return (
                    <button
                      key={t.time}
                      type="button"
                      onClick={() => setSelectedTime(t.time)}
                      className={`min-h-[52px] p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between active:scale-95 ${
                        isSelected
                          ? 'bg-gold-gradient border-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.35)]'
                          : 'bg-[#0E121A] border-[#222a38] text-slate-300 hover:border-[#D4AF37]/40 hover:bg-[#151c27]'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`text-xs font-black font-['Montserrat',sans-serif] ${isSelected ? 'text-black' : 'text-white'}`}>
                          {t.time}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3] text-black" />}
                      </div>
                      <span className={`text-[10px] font-medium truncate mt-1 ${isSelected ? 'text-black/80' : 'text-slate-400'}`}>
                        {t.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Modalidad / Tipo de clase interactivo */}
            <div className="p-4 rounded-2xl bg-[#131720] border border-[#222a38]">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block mb-3 flex items-center gap-1.5">
                <Bike className="w-3.5 h-3.5 text-[#D4AF37]" />
                Modalidad de pedaleo
              </span>

              <div className="space-y-2">
                {classTypes.map((type) => {
                  const isSelected = selectedClassType === type.name;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedClassType(type.name)}
                      className={`w-full min-h-[48px] p-3 rounded-xl border text-left flex items-center justify-between transition-all duration-150 active:scale-95 cursor-pointer ${
                        isSelected
                          ? 'bg-[#1C222F] border-[#D4AF37] shadow-sm'
                          : 'bg-[#0E121A] border-[#222a38] hover:border-slate-600'
                      }`}
                    >
                      <div>
                        <span className={`text-xs font-bold block ${isSelected ? 'text-[#D4AF37]' : 'text-white'}`}>
                          {type.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {type.subtitle}
                        </span>
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                        isSelected 
                          ? 'bg-[#D4AF37] border-[#D4AF37] text-black' 
                          : 'border-slate-600 bg-transparent'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column (Coach & Studio Spots & CTA) */}
          <div className="md:col-span-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Instructor Card */}
              <div className="p-4 rounded-2xl bg-[#131720] border border-[#222a38]">
                <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block mb-3">
                  Coach del Studio
                </span>
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <img 
                      src={currentClass.instructor.avatar} 
                      alt={currentClass.instructor.name} 
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-[#D4AF37]/80 shadow-md"
                    />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#D4AF37] rounded-full border-2 border-[#131720]"></span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Instructor Principal</span>
                    <span className="text-sm font-extrabold text-white block">
                      {currentClass.instructor.name}
                    </span>
                    <span className="text-[11px] text-[#D4AF37] font-semibold flex items-center gap-1 mt-0.5">
                      ★ Certificado Indoor Cycling Pro
                    </span>
                  </div>
                </div>
              </div>

              {/* Cupos disponibles visual indicator */}
              <div className="p-4 rounded-2xl bg-[#131720] border border-[#222a38]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-300">Cupos disponibles en sala</span>
                  <span className="text-sm font-black text-[#D4AF37] font-mono">
                    {currentClass.availableSpots} / {currentClass.totalSpots} bicis
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2.5 rounded-full bg-[#1C222F] overflow-hidden p-0.5 border border-[#222a38]">
                  <div 
                    className="h-full bg-gradient-to-r from-[#AA771C] via-[#D4AF37] to-[#F3E5AB] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(212,175,55,0.4)]"
                    style={{ width: `${occupancyRatio}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                  <span>Sala Zarzal (14 Bicis)</span>
                  <span className="text-[#D4AF37] font-medium">Bicicletas libres</span>
                </div>
              </div>
            </div>

            {/* Big Interactive Primary CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleContinue}
                className="w-full min-h-[52px] py-3.5 px-6 rounded-2xl bg-gold-gradient hover:brightness-110 text-black font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(212,175,55,0.35)] hover:shadow-[0_4px_30px_rgba(212,175,55,0.5)] active:scale-95 transition-all duration-150 cursor-pointer"
              >
                <span>Continuar a Selección de Bici</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
