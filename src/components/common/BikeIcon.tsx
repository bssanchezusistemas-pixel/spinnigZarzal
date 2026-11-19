import React from 'react';
import type { BikeStatus } from '../../types';

interface BikeIconProps {
  number: string;
  status: BikeStatus;
  isSelected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const BikeIcon: React.FC<BikeIconProps> = ({
  number,
  status,
  isSelected = false,
  onClick,
  size = 'md',
}) => {
  // Color configuration - Available: Verde vibrante, Selected: Dorado/Amarillo, Reserved: Rojo
  let ringColor = 'border-emerald-500/70 text-emerald-300';
  let bgColor = 'bg-emerald-950/30 hover:bg-emerald-900/40';
  let glowClass = 'hover:shadow-[0_0_14px_rgba(16,185,129,0.35)]';
  let bikeStroke = '#10b981';

  if (isSelected || status === 'selected') {
    ringColor = 'border-[#F3C766] text-[#F3C766]';
    bgColor = 'bg-[#D4AF37]/25';
    glowClass = 'shadow-[0_0_22px_rgba(212,175,55,0.7)] scale-105 ring-2 ring-[#D4AF37]';
    bikeStroke = '#F3C766';
  } else if (status === 'reserved') {
    ringColor = 'border-rose-500/70 text-rose-400';
    bgColor = 'bg-rose-950/25';
    glowClass = '';
    bikeStroke = '#f87171';
  } else if (status === 'maintenance') {
    ringColor = 'border-zinc-600 text-zinc-400';
    bgColor = 'bg-zinc-900/50';
    glowClass = '';
    bikeStroke = '#71717a';
  }

  const dimension = 
    size === 'sm' 
      ? 'w-11 h-14' 
      : size === 'lg' 
      ? 'w-16 h-20 md:w-20 md:h-24' 
      : 'w-12 h-16 md:w-16 md:h-20';

  const isInteractive = status !== 'reserved' && status !== 'maintenance';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`flex flex-col items-center justify-center p-1.5 rounded-2xl transition-all duration-150 select-none group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
        isInteractive 
          ? 'active:scale-90 hover:scale-105 active:transition-none' 
          : 'opacity-80 cursor-pointer active:scale-95'
      } ${dimension} ${glowClass}`}
      title={`Bicicleta #${number} - ${status === 'available' ? 'Disponible' : status === 'selected' ? 'Seleccionada' : status === 'reserved' ? 'Reservada' : 'Mantenimiento'}`}
    >
      {/* Indoor Bike Vector Graphic */}
      <svg 
        viewBox="0 0 32 32" 
        className="w-6 h-6 md:w-7 md:h-7 transition-transform duration-150 group-hover:scale-110 group-active:scale-95" 
        fill="none" 
        stroke={bikeStroke} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        {/* Flywheel front */}
        <circle cx="22" cy="22" r="5" strokeWidth="1.8" />
        <circle cx="22" cy="22" r="1.5" fill={bikeStroke} />
        {/* Rear base */}
        <line x1="6" y1="26" x2="14" y2="26" strokeWidth="2.4" />
        {/* Front base */}
        <line x1="18" y1="26" x2="26" y2="26" strokeWidth="2.4" />
        {/* Frame: bottom bracket to flywheel */}
        <path d="M12 21L22 22" />
        {/* Seat post */}
        <line x1="12" y1="21" x2="10" y2="12" />
        {/* Saddle */}
        <path d="M7 12H13" strokeWidth="2.4" />
        {/* Main tube to handlebar stem */}
        <path d="M12 21L18 10" />
        {/* Handlebars */}
        <path d="M16 10H21L23 8" strokeWidth="2.2" />
        {/* Pedals & Crank */}
        <circle cx="12" cy="21" r="2" strokeWidth="1.4" />
      </svg>

      {/* Number Badge Pill */}
      <div 
        className={`mt-1 font-mono font-black text-xs md:text-sm tracking-wider px-2 py-0.5 rounded-lg border transition-all ${ringColor} ${bgColor}`}
      >
        {number}
      </div>
    </button>
  );
};
