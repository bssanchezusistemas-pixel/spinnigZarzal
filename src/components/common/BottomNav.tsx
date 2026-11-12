import React from 'react';
import { Home, Calendar, Bike as BikeIconNav, Users, DollarSign, Award } from 'lucide-react';
import type { ScreenId, UserRole } from '../../types';

interface BottomNavProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  role: UserRole;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate, role }) => {
  if (role === 'client') {
    const navItems = [
      { id: 'welcome' as ScreenId, label: 'Inicio', icon: Home },
      { id: 'plans' as ScreenId, label: 'Planes', icon: Award },
      { id: 'class-selection' as ScreenId, label: 'Reservar', icon: BikeIconNav },
      { id: 'my-classes' as ScreenId, label: 'Mis clases', icon: Calendar },
      { id: 'calendar' as ScreenId, label: 'Calendario', icon: Calendar },
    ];

    return (
      <nav className="h-16 border-t border-[#222938] bg-[#0E121A]/95 backdrop-blur-md px-2 flex items-center justify-around z-20 shrink-0 select-none">
        {navItems.map((item) => {
          const isActive = 
            currentScreen === item.id || 
            (item.id === 'class-selection' && (currentScreen === 'bike-selection' || currentScreen === 'confirmation' || currentScreen === 'ticket-qr'));
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center justify-center flex-1 py-1 transition-colors duration-200 cursor-pointer"
            >
              <Icon 
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${
                  isActive ? 'text-[#D4AF37] scale-110 drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]' : 'text-slate-400 hover:text-slate-200'
                }`} 
              />
              <span 
                className={`text-[10px] mt-1 font-medium transition-colors ${
                  isActive ? 'text-[#D4AF37] font-bold' : 'text-slate-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    );
  }

  // Admin Bottom Nav
  const adminNavItems = [
    { id: 'admin-dashboard' as ScreenId, label: 'Admin', icon: Home },
    { id: 'plans' as ScreenId, label: 'Tarifas', icon: Award },
    { id: 'calendar' as ScreenId, label: 'Clases', icon: Calendar },
    { id: 'bike-management' as ScreenId, label: 'Bicis', icon: BikeIconNav },
    { id: 'clients-list' as ScreenId, label: 'Clientes', icon: Users },
    { id: 'cierre-caja' as ScreenId, label: 'Caja', icon: DollarSign },
  ];

  return (
    <nav className="h-16 border-t border-[#222938] bg-[#0E121A]/95 backdrop-blur-md px-1 flex items-center justify-around z-20 shrink-0 select-none">
      {adminNavItems.map((item) => {
        const isActive = currentScreen === item.id;
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="flex flex-col items-center justify-center flex-1 py-1 transition-colors duration-200 cursor-pointer"
          >
            <Icon 
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${
                isActive ? 'text-[#D4AF37] scale-110 drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]' : 'text-slate-400 hover:text-slate-200'
              }`} 
            />
            <span 
              className={`text-[9px] sm:text-[10px] mt-1 font-medium transition-colors ${
                isActive ? 'text-[#D4AF37] font-bold' : 'text-slate-400'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
