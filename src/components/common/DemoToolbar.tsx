import React from 'react';
import type { ScreenId, UserRole } from '../../types';
import { Smartphone, Monitor, UserCheck, ShieldCheck, RefreshCw } from 'lucide-react';

interface DemoToolbarProps {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  role: UserRole;
  onToggleRole: () => void;
  isSimulator: boolean;
  onToggleSimulator: () => void;
  onResetData: () => void;
}

export const DemoToolbar: React.FC<DemoToolbarProps> = ({
  currentScreen,
  onSelectScreen,
  role,
  onToggleRole,
  isSimulator,
  onToggleSimulator,
  onResetData,
}) => {
  const screens: { id: ScreenId; label: string; number: string; role: 'client' | 'admin' | 'both' }[] = [
    { id: 'welcome', label: 'Inicio', number: '1', role: 'client' },
    { id: 'class-selection', label: 'Clase', number: '2', role: 'client' },
    { id: 'bike-selection', label: 'Elegir Bici', number: '3', role: 'client' },
    { id: 'confirmation', label: 'Confirmar', number: '4', role: 'client' },
    { id: 'ticket-qr', label: 'Ticket QR', number: '5', role: 'client' },
    { id: 'my-classes', label: 'Mis Clases', number: '6', role: 'client' },
    { id: 'calendar', label: 'Calendario', number: '7', role: 'both' },
    { id: 'admin-dashboard', label: 'Panel Admin', number: '8', role: 'admin' },
    { id: 'bike-management', label: 'Gestión Bicis', number: '10', role: 'admin' },
    { id: 'clients-list', label: 'Clientes', number: '11', role: 'admin' },
  ];

  return (
    <header className="bg-[#0b0e14]/95 border-b border-[#222a38] text-xs px-3 py-2 flex flex-wrap items-center justify-between gap-2 shadow-2xl z-50">
      {/* Brand & Demo Pill */}
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4FF00] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4FF00]"></span>
        </span>
        <span className="font-extrabold tracking-tight text-white font-['Montserrat',sans-serif]">
          PANTHER <span className="text-[#D4FF00]">RIDE</span>
        </span>
        <span className="bg-[#1f2633] text-[#D4FF00] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#D4FF00]/30">
          DEMO COMERCIAL
        </span>
      </div>

      {/* Screen Quick Selector (Tabs 1 to 11) */}
      <div className="hidden lg:flex items-center gap-1 overflow-x-auto max-w-xl py-1">
        {screens.map((s) => {
          const isActive = currentScreen === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onSelectScreen(s.id)}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                isActive
                  ? 'bg-[#D4FF00] text-black font-bold shadow-[0_0_10px_rgba(212,255,0,0.4)]'
                  : 'bg-[#141923] text-slate-400 hover:text-white hover:bg-[#1c2331]'
              }`}
            >
              <span className="opacity-70 text-[9px]">#{s.number}</span>
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Control Actions: Switch Role, Switch Device Frame, Reset */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Role Switcher */}
        <button
          onClick={onToggleRole}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141923] border border-[#222a38] hover:border-[#D4FF00]/50 transition-colors text-slate-200 cursor-pointer text-[11px]"
          title="Cambiar perspectiva de vista"
        >
          {role === 'client' ? (
            <>
              <UserCheck className="w-3.5 h-3.5 text-[#D4FF00]" />
              <span>Rol: <strong className="text-[#D4FF00]">Cliente</strong></span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Rol: <strong className="text-amber-400">Admin</strong></span>
            </>
          )}
        </button>

        {/* Device Frame Toggle */}
        <button
          onClick={onToggleSimulator}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141923] border border-[#222a38] hover:border-slate-500 transition-colors text-slate-200 cursor-pointer text-[11px]"
          title="Cambiar modo de vista"
        >
          {isSimulator ? (
            <>
              <Monitor className="w-3.5 h-3.5 text-sky-400" />
              <span>Pantalla Completa</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-sky-400" />
              <span>Simulador Móvil</span>
            </>
          )}
        </button>

        {/* Reset Demo State */}
        <button
          onClick={onResetData}
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#141923] border border-[#222a38] hover:bg-rose-950/40 hover:text-rose-300 transition-colors text-slate-400 cursor-pointer text-[11px]"
          title="Reiniciar datos de la demo"
        >
          <RefreshCw className="w-3 h-3" />
          <span className="hidden md:inline">Reiniciar</span>
        </button>
      </div>
    </header>
  );
};
