import React, { useState, useRef } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Bike, 
  ChevronRight, 
  ChevronLeft,
  Menu, 
  Check, 
  Zap,
  AlertCircle,
  Sparkles
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
  if (!dateStr) return new Date();
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    return new Date(y, m, d);
  }
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
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
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const initialParsed = parseDateSafe(currentClass.date);
  // Si la fecha inicial está en el pasado (mock data), usar la fecha de hoy
  const initialDate = initialParsed.getTime() >= today.getTime() ? initialParsed : today;

  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [hasChosenDay, setHasChosenDay] = useState<boolean>(false);
  const [viewMonth, setViewMonth] = useState<number>(today.getMonth());
  const [viewYear, setViewYear] = useState<number>(today.getFullYear());
  const [selectedTime, setSelectedTime] = useState<string>(currentClass.time || '6:00 p. m.');

  const timeSectionRef = useRef<HTMLDivElement>(null);

  // Monthly calendar calculation
  const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
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
    setHasChosenDay(true);
    // Smooth scroll to time section
    setTimeout(() => {
      timeSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  };

  const handleSelectToday = () => {
    const now = new Date();
    setSelectedDate(now);
    setViewMonth(now.getMonth());
    setViewYear(now.getFullYear());
    setHasChosenDay(true);
    setTimeout(() => {
      timeSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
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
      <div className="max-w-3xl mx-auto w-full space-y-5">
        {/* Top Header */}
        <div className="flex items-center justify-between">
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
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-2">
            <Zap className="w-3.5 h-3.5" />
            <span>Paso 1 de 3 • Zarzal, Valle</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-['Montserrat',sans-serif] text-white tracking-tight">
            Configura tu sesión de pedaleo
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Revisa el tipo de sesión y selecciona la fecha en el calendario para elegir tu horario.
          </p>
        </div>

        {/* ============================================================== */}
        {/* 1. PRIMERO: RECORDATORIO Y TIPO DE CLASE                      */}
        {/* ============================================================== */}
        <div className="rounded-2xl bg-[#131720] border border-[#222a38] p-4 sm:p-5 space-y-4 shadow-xl">
          {/* Tipo de Clase Oficial */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#222a38]">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-gold-gradient text-black flex items-center justify-center font-black shadow-md shrink-0">
                <Bike className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-black font-['Montserrat',sans-serif] text-white tracking-tight">
                    Indoor Cycling
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[11px] font-black text-[#D4AF37] uppercase tracking-wide">
                    45 Minutos
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5 font-medium">
                  Fuerza, Ritmo & Resistencia cardiovascular sobre bicicleta estática
                </p>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-slate-400 bg-[#0E121A] px-3 py-1.5 rounded-xl border border-[#222a38]">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Modalidad Oficial</span>
            </div>
          </div>

          {/* Recordatorio de Puntualidad: Estar 15 minutos antes */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-[#D4AF37]/15 via-[#D4AF37]/10 to-transparent border border-[#D4AF37]/40 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/25 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shrink-0 mt-0.5 shadow-sm">
              <Clock className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="text-left space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-[#D4AF37] uppercase tracking-wide">
                  Recordatorio Importante: Estar 15 minutos antes
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Todas las sesiones tienen una duración de <strong>45 minutos</strong>. Por favor preséntate <strong>15 minutos antes</strong> de la hora para calibrar tu bicicleta (ajuste de sillín y manubrio) e iniciar puntual al ritmo de la música.
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. LUEGO: PONER SOLO EL CALENDARIO                             */}
        {/* ============================================================== */}
        <div className="rounded-2xl bg-[#131720] border border-[#222a38] p-4 sm:p-5 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#222a38]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1C222F] border border-[#222a38] text-[#D4AF37] flex items-center justify-center shrink-0 shadow-sm">
                <CalendarIcon className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                  Paso 1: Elige tu día
                </span>
                <span className="text-base font-extrabold text-white">
                  Calendario de Reservas
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSelectToday}
              className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-[#1C222F] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-xs font-bold text-[#D4AF37] hover:bg-[#D4AF37]/10 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Elegir Hoy ({today.getDate()} {MONTH_NAMES_ES[today.getMonth()].slice(0, 3)})</span>
            </button>
          </div>

          {/* Navegación de Mes */}
          <div className="flex items-center justify-between px-2 pt-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              aria-label="Mes anterior"
              className="min-h-[42px] min-w-[42px] p-2 rounded-xl bg-[#0E121A] border border-[#222a38] text-slate-300 hover:text-white hover:border-[#D4AF37]/50 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="text-center">
              <span className="font-black text-base sm:text-lg text-white tracking-wide font-['Montserrat',sans-serif] block">
                {MONTH_NAMES_ES[viewMonth]} {viewYear}
              </span>
              <span className="text-xs text-[#D4AF37] font-medium">
                Toca cualquier día para desbloquear los horarios
              </span>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              aria-label="Mes siguiente"
              className="min-h-[42px] min-w-[42px] p-2 rounded-xl bg-[#0E121A] border border-[#222a38] text-slate-300 hover:text-white hover:border-[#D4AF37]/50 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Encabezados de días de la semana */}
          <div className="grid grid-cols-7 gap-1.5 text-center pt-2">
            {daysOfWeek.map((day, idx) => (
              <span key={idx} className="text-xs font-bold text-slate-400 uppercase py-1">
                {day}
              </span>
            ))}
          </div>

          {/* Cuadrícula de días del mes */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
            {Array.from({ length: firstDayOfMonthIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-10 sm:h-12 w-full" />
            ))}

            {monthDays.map((dayNum) => {
              const thisDay = new Date(viewYear, viewMonth, dayNum);
              thisDay.setHours(0, 0, 0, 0);

              const isPast = thisDay.getTime() < today.getTime();
              const isTodayDate = isSameDay(thisDay, today);
              const isSelected = hasChosenDay && isSameDay(thisDay, selectedDate);

              return (
                <button
                  key={dayNum}
                  type="button"
                  disabled={isPast}
                  onClick={() => handleSelectDay(dayNum)}
                  className={`h-11 sm:h-12 w-full rounded-xl flex flex-col items-center justify-center font-bold transition-all duration-150 relative select-none ${
                    isPast
                      ? 'opacity-25 text-slate-600 border border-transparent cursor-not-allowed bg-transparent'
                      : isSelected
                      ? 'bg-gold-gradient text-black font-black shadow-[0_0_18px_rgba(212,175,55,0.45)] scale-105 ring-2 ring-[#D4AF37] cursor-pointer'
                      : isTodayDate
                      ? 'text-[#D4AF37] border-2 border-[#D4AF37]/60 bg-[#0E121A] hover:bg-[#1C222F] cursor-pointer'
                      : 'text-slate-200 hover:text-white bg-[#0E121A] hover:bg-[#1C222F] hover:border-[#D4AF37]/40 border border-[#222a38] cursor-pointer active:scale-95'
                  }`}
                >
                  <span className="text-sm sm:text-base font-extrabold">{dayNum}</span>
                  {isTodayDate && !isSelected && (
                    <span className="text-[9px] uppercase font-black text-[#D4AF37] -mt-0.5 tracking-tighter">
                      HOY
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Indicador de Estado del Día */}
          <div className="pt-3 border-t border-[#222a38] flex items-center justify-between">
            {hasChosenDay ? (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#D4AF37] font-bold">
                <div className="w-5 h-5 rounded-full bg-[#D4AF37] text-black flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>Día seleccionado: <strong>{formatFullDateES(selectedDate)}</strong></span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <AlertCircle className="w-4 h-4 text-[#D4AF37]" />
                <span>Haz clic en un día del calendario para continuar al horario</span>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* 3. ENTONCES PASA A ELEGIR LA HORA (SOLO TRAS ELEGIR EL DÍA)     */}
        {/* ============================================================== */}
        {hasChosenDay ? (
          <div 
            ref={timeSectionRef}
            className="rounded-2xl bg-[#131720] border-2 border-[#D4AF37]/40 p-4 sm:p-5 space-y-4 shadow-2xl transition-all duration-300 animate-fadeIn"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#222a38]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center shrink-0 shadow-sm">
                  <Clock className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-xs text-[#D4AF37] font-bold uppercase tracking-wider block">
                    Paso 2: Elige tu horario
                  </span>
                  <span className="text-base sm:text-lg font-black text-white">
                    Horarios para el {formatFullDateES(selectedDate)}
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/15 px-3 py-1 rounded-full border border-[#D4AF37]/30 self-start sm:self-auto">
                1 clic para elegir
              </span>
            </div>

            {/* Grid de 4 Horarios Disponibles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {times.map((t) => {
                const isSelected = selectedTime === t.time;
                return (
                  <button
                    key={t.time}
                    type="button"
                    onClick={() => setSelectedTime(t.time)}
                    className={`min-h-[58px] p-3.5 rounded-xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between active:scale-95 ${
                      isSelected
                        ? 'bg-gold-gradient border-[#D4AF37] text-black shadow-[0_0_18px_rgba(212,175,55,0.35)]'
                        : 'bg-[#0E121A] border-[#222a38] text-slate-300 hover:border-[#D4AF37]/50 hover:bg-[#151c27]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-sm sm:text-base font-black font-['Montserrat',sans-serif] ${isSelected ? 'text-black' : 'text-white'}`}>
                        {t.time}
                      </span>
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-black text-[#D4AF37] flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-[#222a38]" />
                      )}
                    </div>
                    <span className={`text-xs font-semibold truncate mt-1 ${isSelected ? 'text-black/80' : 'text-slate-400'}`}>
                      {t.label} • {t.intensity}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Coach & Cupos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* Instructor Card */}
              <div className="p-3.5 rounded-xl bg-[#0E121A] border border-[#222a38] flex items-center gap-3">
                <img 
                  src={currentClass.instructor.avatar} 
                  alt={currentClass.instructor.name} 
                  className="w-12 h-12 rounded-xl object-cover border-2 border-[#D4AF37]/80 shrink-0"
                />
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-bold block">Coach del Studio</span>
                  <span className="text-sm font-extrabold text-white block">
                    {currentClass.instructor.name}
                  </span>
                  <span className="text-xs text-[#D4AF37] font-semibold block mt-0.5">
                    ★ Certificado Indoor Cycling Pro
                  </span>
                </div>
              </div>

              {/* Cupos disponibles */}
              <div className="p-3.5 rounded-xl bg-[#0E121A] border border-[#222a38] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-400 font-bold uppercase">Cupos Disponibles</span>
                  <span className="text-xs sm:text-sm font-black text-[#D4AF37] font-mono">
                    {currentClass.availableSpots} / {currentClass.totalSpots} bicis libres
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#1C222F] overflow-hidden p-0.5 border border-[#222a38]">
                  <div 
                    className="h-full bg-gradient-to-r from-[#AA771C] via-[#D4AF37] to-[#F3E5AB] rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(212,175,55,0.4)]"
                    style={{ width: `${occupancyRatio}%` }}
                  ></div>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block text-right">
                  Sala Zarzal (14 Bicis)
                </span>
              </div>
            </div>

            {/* Botón Principal Continuar */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleContinue}
                className="w-full min-h-[54px] py-4 px-6 rounded-2xl bg-gold-gradient hover:brightness-110 text-black font-black text-base tracking-wide flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(212,175,55,0.4)] hover:shadow-[0_4px_30px_rgba(212,175,55,0.6)] active:scale-95 transition-all duration-150 cursor-pointer"
              >
                <span>Continuar a Selección de Bici ({selectedTime})</span>
                <ChevronRight className="w-5 h-5 stroke-[3]" />
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-[#131720]/60 border border-dashed border-[#222a38] p-5 text-center text-slate-400 space-y-1">
            <Clock className="w-7 h-7 text-slate-500 mx-auto mb-1 opacity-70" />
            <span className="text-sm font-bold text-slate-300 block">Horarios protegidos</span>
            <span className="text-xs text-slate-400 block">
              Selecciona primero el día de tu preferencia en el calendario para desbloquear los horarios.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
