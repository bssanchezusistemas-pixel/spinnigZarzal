import React from 'react';
import { 
  CalendarPlus, 
  Bike, 
  Ticket, 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings,
  ChevronRight,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { PantherLogo } from '../common/PantherLogo';
import { db } from '../../services/db';
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

  const adminActions = [
    {
      title: 'Crear clase',
      icon: CalendarPlus,
      action: () => (onOpenCreateClassModal ? onOpenCreateClassModal() : onNavigateScreen('calendar')),
      highlight: true,
      badge: 'Nuevo',
    },
    {
      title: 'Ver bicicletas',
      icon: Bike,
      action: () => onNavigateScreen('bike-management'),
      highlight: false,
      badge: '14 Bicis',
    },
    {
      title: 'Reservas',
      icon: Ticket,
      action: () => onNavigateScreen('my-classes'),
      highlight: false,
      badge: `${summary.totalRiders} hoy`,
    },
    {
      title: 'Clientes CRM',
      icon: Users,
      action: () => onNavigateScreen('clients-list'),
      highlight: false,
      badge: 'Directorio',
    },
    {
      title: 'Cierre de Caja',
      icon: CreditCard,
      action: () => onNavigateScreen('cierre-caja'),
      highlight: true,
      badge: `$${(summary.totalIncome / 1000).toFixed(0)}k hoy`,
    },
    {
      title: 'Finanzas & Arqueo',
      icon: BarChart3,
      action: () => onNavigateScreen('cierre-caja'),
      highlight: false,
      badge: 'Reporte',
    },
  ];

  return (
    <div className="flex-1 flex flex-col justify-between p-5 bg-[#090B0E] overflow-y-auto">
      <div>
        {/* Top Branding Header */}
        <div className="flex flex-col items-center text-center pt-2 mb-4">
          <PantherLogo size="md" showSubtitle={false} className="mb-2" />
          <h1 className="text-lg font-black font-['Montserrat',sans-serif] text-white tracking-tight">
            Panel de administrador
          </h1>
          <p className="text-[11px] text-slate-400">Control total del studio Zarzal</p>
        </div>

        {/* Quick Studio Stats Pill */}
        <div className="mb-4 grid grid-cols-2 gap-2">
          {/* Occupancy card */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-[#131720] to-[#1C222F] border border-[#222a38] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-slate-400 font-medium">Ocupación Hoy</span>
              <TrendingUp className="w-3.5 h-3.5 text-[#D4FF00]" />
            </div>
            <span className="text-sm font-extrabold text-white">{summary.occupancyPercent}% (Clase 6 PM)</span>
          </div>

          {/* Cash revenue card */}
          <button
            onClick={() => onNavigateScreen('cierre-caja')}
            className="p-3 rounded-2xl bg-gradient-to-r from-[#131720] to-[#1C222F] border border-emerald-500/30 hover:border-emerald-500/60 transition-all text-left flex flex-col justify-between cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-emerald-400 font-bold">Caja Hoy</span>
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="text-sm font-extrabold text-emerald-400 font-mono">
              ${summary.totalIncome.toLocaleString('es-CO')}
            </span>
          </button>
        </div>

        {/* 2-Column Action Tiles Grid */}
        <div className="grid grid-cols-2 gap-3">
          {adminActions.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={item.action}
                className="p-4 rounded-2xl bg-[#131720] hover:bg-[#1a202c] border border-[#222a38] hover:border-[#D4FF00]/40 flex flex-col items-start justify-between min-h-[105px] transition-all text-left group cursor-pointer shadow-md"
              >
                <div className="w-full flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-[#1C222F] flex items-center justify-center text-slate-200 group-hover:text-[#D4FF00] group-hover:scale-105 transition-all">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    item.highlight 
                      ? 'bg-[#D4FF00]/10 text-[#D4FF00] border border-[#D4FF00]/30' 
                      : 'text-slate-400 bg-black/50'
                  }`}>
                    {item.badge}
                  </span>
                </div>

                <div className="w-full flex items-center justify-between mt-3">
                  <span className="text-xs font-bold text-white group-hover:text-[#D4FF00] transition-colors">
                    {item.title}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Configuration tile full width */}
        <button
          onClick={() => alert('Configuración de Studio: Nombre, Horarios, Instructores, Tarifas ($15.000 Particular / $120.000 Mensual)')}
          className="w-full mt-3 p-3.5 rounded-2xl bg-[#131720] hover:bg-[#1a202c] border border-[#222a38] flex items-center justify-between transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#1C222F] flex items-center justify-center text-slate-400 group-hover:text-[#D4FF00]">
              <Settings className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white">Configuración del Studio</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      <div className="pt-3">
        <p className="text-[10px] text-center text-slate-400">
          Zarzal, Valle • Sistema Panther Ride Pro v2.0
        </p>
      </div>
    </div>
  );
};
