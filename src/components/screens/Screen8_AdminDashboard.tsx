import React from 'react';
import { 
  CalendarPlus, 
  Bike, 
  Ticket, 
  Users, 
  CreditCard, 
  Settings,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Activity,
  Sparkles,
  Award
} from 'lucide-react';
import { PantherLogo } from '../common/PantherLogo';
import { db } from '../../services/db';
import { BLACK_RIDE_PLANS } from '../../types';
import type { ScreenId } from '../../types';

interface Screen8AdminDashboardProps {
  onNavigateScreen: (screen: ScreenId) => void;
  onOpenCreateClassModal?: () => void;
}

export const Screen8_AdminDashboard: React.FC<Screen8AdminDashboardProps> = ({
  onNavigateScreen,
  onOpenCreateClassModal,
}) => {
  const summary = db.getCashSummary('2026-09-25');
  const bikes = db.getBikes();
  const availableBikes = bikes.filter(b => b.status === 'available').length;

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const adminActions = [
    {
      title: 'Planes y Tarifas',
      desc: 'Starter ($28k), Pro ($56k), Premium ($84k), Élite ($120k)',
      icon: Award,
      action: () => onNavigateScreen('plans'),
      highlight: true,
      badge: 'Tarifas 2026',
    },
    {
      title: 'Crear nueva clase',
      desc: 'Horarios, instructores y cupos de pedaleo',
      icon: CalendarPlus,
      action: () => (onOpenCreateClassModal ? onOpenCreateClassModal() : onNavigateScreen('calendar')),
      highlight: false,
      badge: 'Nuevo Horario',
    },
    {
      title: 'Gestión de Bicicletas',
      desc: '14 bicis en sala: Disponibles, reservadas o taller',
      icon: Bike,
      action: () => onNavigateScreen('bike-management'),
      highlight: false,
      badge: `${availableBikes} Libres`,
    },
    {
      title: 'Reservas y Asistencia',
      desc: 'Monitoreo de asistencia y tickets activos',
      icon: Ticket,
      action: () => onNavigateScreen('my-classes'),
      highlight: false,
      badge: `${summary.totalRiders} Alumnos`,
    },
    {
      title: 'Directorio CRM de Clientes',
      desc: 'Control de membresías activas y particulares',
      icon: Users,
      action: () => onNavigateScreen('clients-list'),
      highlight: false,
      badge: 'Clientes',
    },
    {
      title: 'Cierre de Caja & Finanzas',
      desc: 'Arqueo diario, Nequi, Efectivo y export WhatsApp',
      icon: CreditCard,
      action: () => onNavigateScreen('cierre-caja'),
      highlight: true,
      badge: `$${(summary.totalIncome / 1000).toFixed(0)}k Hoy`,
    },
  ];

  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 bg-[#090B0E] overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full">
        {/* Top Branding Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between pb-4 sm:pb-6 border-b border-[#222a38] gap-3">
          <div className="flex items-center gap-3">
            <PantherLogo size="sm" showSubtitle={false} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black font-['Montserrat',sans-serif] text-white tracking-tight">
                  Panel de Administración BLACK RIDE 🐆
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold text-amber-400">
                  ADMIN ZARZAL
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Control de operaciones, membresías, caja y 14 bicicletas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D4AF37]"></span>
            </span>
            <span className="text-xs font-semibold text-[#D4AF37]">Studio Zarzal Activo</span>
          </div>
        </div>

        {/* Studio Live KPIs Grid: 2 on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-5">
          {/* Card 1: Occupancy */}
          <div className="p-4 rounded-2xl bg-[#131720] border border-[#222a38] shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-slate-400 font-medium">Ocupación Sala</span>
              <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-white font-mono block">
              {summary.occupancyPercent}%
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block">
              {summary.totalRiders} de 14 bicicletas
            </span>
          </div>

          {/* Card 2: Cash Income */}
          <button
            type="button"
            onClick={() => onNavigateScreen('cierre-caja')}
            className="p-4 rounded-2xl bg-gradient-to-br from-[#131720] to-[#0E121A] border border-[#D4AF37]/30 hover:border-[#D4AF37]/70 text-left transition-all duration-150 active:scale-95 cursor-pointer shadow-sm group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-[#D4AF37] font-bold">Total Caja Hoy</span>
              <DollarSign className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-[#D4AF37] font-mono block">
              ${summary.totalIncome.toLocaleString('es-CO')}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Ver arqueo y pagos →
            </span>
          </button>

          {/* Card 3: Bikes Active */}
          <div className="p-4 rounded-2xl bg-[#131720] border border-[#222a38] shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-slate-400 font-medium">Bicicletas Libres</span>
              <Bike className="w-4 h-4 text-sky-400" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-white font-mono block">
              {availableBikes} / 14
            </span>
            <span className="text-[10px] text-[#D4AF37] mt-1 block font-medium">
              Listas para reservar
            </span>
          </div>

          {/* Card 4: Riders Type */}
          <div className="p-4 rounded-2xl bg-[#131720] border border-[#222a38] shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-slate-400 font-medium">Asistencia</span>
              <Activity className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs font-bold text-[#F3E5AB] bg-[#D4AF37]/15 px-2 py-0.5 rounded border border-[#D4AF37]/30">
                {summary.ridersWithMembership} Membresía
              </span>
              <span className="text-xs font-bold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-500/30">
                {summary.ridersParticular} Partic.
              </span>
            </div>
          </div>
        </div>

        {/* Dedicated Admin Plans & Pricing Banner (NEW!) */}
        <div className="mb-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#17202C] via-[#10151E] to-[#17202C] border border-[#222a38] shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#222a38]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center text-black font-black">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-white font-['Montserrat',sans-serif]">
                    Tarifas Vigentes BLACK RIDE
                  </h3>
                  <span className="text-[10px] font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
                    4 Planes + Individual
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Beneficio oficial: <strong>Mi bicicleta favorita</strong> (1 a 14) para miembros
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateScreen('plans')}
              className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-gold-gradient hover:brightness-110 text-black font-black text-xs active:scale-95 transition-all duration-150 cursor-pointer shadow-md flex items-center gap-1"
            >
              <span>Ver Portal de Planes</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Pricing Chips Preview */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-3">
            {BLACK_RIDE_PLANS.map((plan) => (
              <div 
                key={plan.id}
                className="p-2.5 rounded-xl bg-black/50 border border-[#222a38] hover:border-[#D4AF37]/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black uppercase text-slate-300 truncate">
                    {plan.name}
                  </span>
                  <span className="text-[9px] text-[#D4AF37] font-bold">
                    {plan.classesCount} cls
                  </span>
                </div>
                <span className="text-sm font-black text-white font-mono block">
                  {formatCOP(plan.price)}
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5">
                  {plan.validityText}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Tiles Grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {adminActions.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={item.action}
                className="p-5 rounded-2xl bg-[#131720] hover:bg-[#1a202c] border border-[#222a38] hover:border-[#D4AF37]/50 flex flex-col justify-between min-h-[125px] transition-all duration-150 active:scale-95 text-left group cursor-pointer shadow-md"
              >
                <div className="w-full flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#1C222F] flex items-center justify-center text-slate-200 group-hover:text-[#D4AF37] group-hover:scale-105 transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    item.highlight 
                      ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30' 
                      : 'text-slate-400 bg-black/50 border border-[#222a38]'
                  }`}>
                    {item.badge}
                  </span>
                </div>

                <div className="w-full mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-white group-hover:text-[#D4AF37] transition-colors font-['Montserrat',sans-serif]">
                      {item.title}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                    {item.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Studio Settings Bar */}
        <div className="mt-4 sm:mt-6">
          <button
            type="button"
            onClick={() => onNavigateScreen('plans')}
            className="w-full min-h-[48px] p-4 rounded-2xl bg-[#131720] hover:bg-[#1a202c] border border-[#222a38] hover:border-slate-500 flex items-center justify-between active:scale-98 transition-all duration-150 cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1C222F] flex items-center justify-center text-slate-400 group-hover:text-[#D4AF37]">
                <Settings className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-white block">Políticas & Tarifas de Membresía</span>
                <span className="text-[10px] text-slate-400">BLACK RIDE • Zarzal, Valle del Cauca</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
};
