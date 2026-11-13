import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Bike, 
  ChevronRight, 
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Menu, 
  Check, 
  Zap 
} from 'lucide-react';
import { PantherLogo } from '../common/PantherLogo';
import type { ClassSession } from '../../types';

interface Screen2ClassSelectionProps {
  currentClass: ClassSession;
  onContinue: (updatedClass?: Partial<ClassSession>) => void;
  onOpenMenu?: () => void;
}

const MONTH_NAMES_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DAY_NAMES_ES = [
  'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
];

const DAY_SHORT_ES = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
const MONTH_SHORT_ES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

const formatFullDateES = (d: Date): string => {
  return `${DAY_NAMES_ES[d.getDay()]}, ${d.getDate()} de ${MONTH_NAMES_ES[d.getMonth()].toLowerCase()} de ${d.getFullYear()}`;
};

const formatISODate = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const parseDateSafe = (dateStr?: string): Date => {
  if (!dateStr) return new Date(2026, 8, 25);
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    return new Date(y, m, d);
  }
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? new Date(2026, 8, 25) : parsed;
};

const isSameDay = (d1: Date, d2: Date) => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

export const Screen2_ClassSelection: React.FC<Screen2ClassSelectionProps> = ({
  currentClass,
  onContinue,
  onOpenMenu,
}) => {
  const initialDate = parseDateSafe(currentClass.date);
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [viewMonth, setViewMonth] = useState<number>(initialDate.getMonth());
  const [viewYear, setViewYear] = useState<number>(initialDate.getFullYear());
  const [selectedTime, setSelectedTime] = useState<string>(currentClass.time);

  // Generate 14 upcoming days for quick tap selection
  const quickDays = Array.from({ length: 14 }, (_, i) => {
    return new Date(initialDate.getFullYear(), initialDate.getMonth(), initialDate.getDate() + i);
  });

  // Monthly calendar calculation
  const daysOfWeek = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const daysInViewMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfMonthIndex = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7; // Monday = 0
  const monthDays = Array.from({ length: daysInViewMonth }, (_, i) => i + 1);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleSelectDay = (dayNum: number) => {
    const newDate = new Date(viewYear, viewMonth, dayNum);
    setSelectedDate(newDate);
  };

  const times = [
    { time: '6:00 a. m.', label: 'Apertura Mañana', intensity: 'Media-Alta' },
    { time: '8:00 a. m.', label: 'Energía Matutina', intensity: 'Alta' },
    { time: '6:00 p. m.', label: 'Hora Pico / Resistencia', intensity: 'Extrema' },
    { time: '7:30 p. m.', label: 'Cierre Nocturno', intensity: 'Alta' },
  ];

  const handleContinue = () => {
    onContinue({ 
      date: formatISODate(selectedDate),
      dateFormatted: formatFullDateES(selectedDate),
      time: selectedTime,
      type: 'Indoor Cycling',
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
            Elige la fecha y el horario para tu sesión de pedaleo.
          </p>
        </div>

        {/* Responsive Content Grid: 1 col on mobile, 2 col on PC */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
          {/* Left Column (Inputs, Calendar & Time Pills) */}
          <div className="md:col-span-7 space-y-4">
            {/* 1. Fecha Card & Calendario Selector */}
            <div className="p-4 rounded-2xl bg-[#131720] border border-[#222a38] space-y-3.5 transition-all">
              {/* Header card with selected date */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#1C222F] flex items-center justify-center text-[#D4AF37] shrink-0 border border-[#222a38] shadow-sm">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">
                      Fecha de sesión
                    </span>
                    <span className="text-sm font-bold text-white block mt-0.5">
                      {formatFullDateES(selectedDate)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isSameDay(selectedDate, initialDate) && (
                    <span className="text-[11px] font-bold text-[#D4AF37] bg-[#D4AF37]/15 px-2.5 py-1 rounded-lg border border-[#D4AF37]/30">
                      Hoy
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowCalendar(!showCalendar)}
                    aria-label={showCalendar ? "Ocultar calendario" : "Abrir calendario completo"}
                    className="min-h-[38px] px-3 py-1.5 rounded-xl bg-[#1C222F] border border-[#222a38] hover:border-[#D4AF37]/50 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>{showCalendar ? 'Cerrar' : 'Calendario'}</span>
                    {showCalendar ? (
                      <ChevronUp className="w-3.5 h-3.5 text-[#D4AF37]" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-[#D4AF37]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Select Days (Horizontal Carousel) */}
              <div>
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block mb-2">
                  Días disponibles para reservar:
                </span>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {quickDays.map((d, idx) => {
                    const isSelected = isSameDay(d, selectedDate);
                    const isInitial = isSameDay(d, initialDate);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedDate(d);
                          setViewMonth(d.getMonth());
                          setViewYear(d.getFullYear());
                        }}
                        className={`min-w-[62px] p-2 rounded-xl border text-center transition-all duration-150 flex flex-col items-center justify-center shrink-0 cursor-pointer active:scale-95 ${
                          isSelected
                            ? 'bg-gold-gradient border-[#D4AF37] text-black shadow-[0_0_12px_rgba(212,175,55,0.4)] font-bold scale-[1.02]'
                            : 'bg-[#0E121A] border-[#222a38] text-slate-300 hover:border-[#D4AF37]/40 hover:bg-[#151c27]'
                        }`}
                      >
                        <span className={`text-[10px] font-bold ${isSelected ? 'text-black' : 'text-slate-400'}`}>
                          {isInitial ? 'HOY' : DAY_SHORT_ES[d.getDay()]}
                        </span>
                        <span className={`text-sm font-black font-['Montserrat',sans-serif] my-0.5 ${isSelected ? 'text-black' : 'text-white'}`}>
                          {d.getDate()}
                        </span>
                        <span className={`text-[9px] uppercase font-semibold ${isSelected ? 'text-black/80' : 'text-slate-400'}`}>
                          {MONTH_SHORT_ES[d.getMonth()]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Expandable Monthly Calendar */}
              {showCalendar && (
                <div className="pt-3 border-t border-[#222a38] space-y-3">
                  {/* Month Navigation */}
                  <div className="flex items-center justify-between px-1">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      aria-label="Mes anterior"
                      className="min-h-[34px] min-w-[34px] p-1.5 rounded-lg bg-[#0E121A] border border-[#222a38] text-slate-300 hover:text-white hover:border-[#D4AF37]/40 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="text-center">
                      <span className="font-extrabold text-sm text-white tracking-wide font-['Montserrat',sans-serif] block">
                        {MONTH_NAMES_ES[viewMonth]} {viewYear}
                      </span>
                      <span className="text-[10px] text-slate-400">Selecciona el día que prefieras</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      aria-label="Mes siguiente"
                      className="min-h-[34px] min-w-[34px] p-1.5 rounded-lg bg-[#0E121A] border border-[#222a38] text-slate-300 hover:text-white hover:border-[#D4AF37]/40 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Day of Week Headers */}
                  <div className="grid grid-cols-7 gap-1 text-center mb-1">
                    {daysOfWeek.map((day, idx) => (
                      <span key={idx} className="text-[10px] font-bold text-slate-400 py-1">
                        {day}
                      </span>
                    ))}
                  </div>

                  {/* Days Grid */}
                  <div className="grid grid-cols-7 gap-1 text-center text-xs">
                    {Array.from({ length: firstDayOfMonthIndex }).map((_, i) => (
                      <div key={`empty-${i}`} className="h-8 w-8 mx-auto" />
                    ))}

                    {monthDays.map((dayNum) => {
                      const thisDay = new Date(viewYear, viewMonth, dayNum);
                      const isSelected = isSameDay(thisDay, selectedDate);
                      const isTodayDate = isSameDay(thisDay, initialDate);

                      return (
                        <button
                          key={dayNum}
                          type="button"
                          onClick={() => handleSelectDay(dayNum)}
                          className={`h-8 w-8 sm:h-9 sm:w-9 mx-auto rounded-xl flex items-center justify-center font-bold transition-all duration-150 cursor-pointer active:scale-95 ${
                            isSelected
                              ? 'bg-gold-gradient text-black font-black shadow-md shadow-[#D4AF37]/40 scale-105'
                              : isTodayDate
                              ? 'text-[#D4AF37] border border-[#D4AF37]/50 hover:bg-[#1C222F]'
                              : 'text-slate-300 hover:text-white hover:bg-[#1C222F] border border-transparent'
                          }`}
                        >
                          {dayNum}
                        </button>
                      );
                    })}
                  </div>

                  {/* Footer actions inside calendar */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#222a38]/60">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDate(initialDate);
                        setViewMonth(initialDate.getMonth());
                        setViewYear(initialDate.getFullYear());
                      }}
                      className="text-[11px] text-[#D4AF37] hover:underline font-semibold cursor-pointer"
                    >
                      Volver a Hoy
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCalendar(false)}
                      className="px-3 py-1 rounded-lg bg-[#D4AF37] text-black text-xs font-bold active:scale-95 transition-all cursor-pointer"
                    >
                      Listo
                    </button>
                  </div>
                </div>
              )}
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

            {/* 3. Modalidad Oficial (Indoor Cycling 45 min) & Recordatorio de Puntualidad */}
            <div className="p-4 rounded-2xl bg-[#131720] border border-[#222a38]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider flex items-center gap-1.5">
                  <Bike className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Modalidad de Pedaleo
                </span>
                <span className="text-[11px] font-bold text-[#D4AF37] bg-[#D4AF37]/15 px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30">
                  45 Minutos
                </span>
              </div>

              {/* Tarjeta Informativa de Modalidad Única Oficial */}
              <div className="p-3.5 rounded-xl bg-[#0E121A] border border-[#222a38] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <Bike className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-white block">
                      Indoor Cycling
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Fuerza, Ritmo & Resistencia • 45 min
                    </span>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full bg-[#D4AF37] flex items-center justify-center text-black shadow-[0_0_10px_rgba(212,175,55,0.4)]">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              {/* Recordatorio de Puntualidad: Estar 15 minutos antes */}
              <div className="mt-3 p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-[#D4AF37] block">
                    Estar 15 minutos antes
                  </span>
                  <span className="text-[11px] text-slate-300 leading-relaxed block mt-0.5">
                    Todas las sesiones tienen una duración de <strong>45 minutos</strong>. Por favor preséntate <strong>15 minutos antes</strong> para acomodar tu bicicleta e iniciar puntual al ritmo de la música.
                  </span>
                </div>
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
