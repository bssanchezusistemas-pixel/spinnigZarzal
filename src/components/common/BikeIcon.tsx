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
  // Determine styles based on state
  let ringColor = 'border-emerald-500 text-emerald-400';
  let bgColor = 'bg-zinc-900/80';
  let glowClass = '';
  let bikeStroke = '#94a3b8';

  if (isSelected || status === 'selected') {
    ringColor = 'border-[#D4FF00] text-[#D4FF00]';
    bgColor = 'bg-[#D4FF00]/20';
    glowClass = 'shadow-[0_0_15px_rgba(212,255,0,0.5)] scale-105';
    bikeStroke = '#D4FF00';
  } else if (status === 'reserved') {
    ringColor = 'border-rose-500 text-rose-400';
    bgColor = 'bg-rose-950/30';
    bikeStroke = '#f87171';
  } else if (status === 'maintenance') {
    ringColor = 'border-amber-500 text-amber-400';
    bgColor = 'bg-amber-950/30';
    bikeStroke = '#fbbf24';
  }

  const dimension = size === 'sm' ? 'w-10 h-14' : size === 'lg' ? 'w-16 h-20' : 'w-12 h-16';

  return (
    <button
      type="button"
      onClick={status !== 'reserved' && status !== 'maintenance' ? onClick : onClick}
      className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all duration-200 select-none group cursor-pointer ${dimension} ${glowClass}`}
    >
      {/* Indoor Bike Vector Graphic */}
      <svg 
        viewBox="0 0 32 32" 
        className="w-6 h-6 transition-transform duration-200 group-hover:scale-110" 
        fill="none" 
        stroke={bikeStroke} 
        strokeWidth="1.8" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        {/* Flywheel front */}
        <circle cx="22" cy="22" r="5" strokeWidth="1.6" />
        <circle cx="22" cy="22" r="1.5" fill={bikeStroke} />
        {/* Rear base */}
        <line x1="6" y1="26" x2="14" y2="26" strokeWidth="2.2" />
        {/* Front base */}
        <line x1="18" y1="26" x2="26" y2="26" strokeWidth="2.2" />
        {/* Frame: bottom bracket to flywheel */}
        <path d="M12 21L22 22" />
        {/* Seat post */}
        <line x1="12" y1="21" x2="10" y2="12" />
        {/* Saddle */}
        <path d="M7 12H13" strokeWidth="2.2" />
        {/* Main tube to handlebar stem */}
        <path d="M12 21L18 10" />
        {/* Handlebars */}
        <path d="M16 10H21L23 8" strokeWidth="2" />
        {/* Pedals & Crank */}
        <circle cx="12" cy="21" r="2" strokeWidth="1.2" />
      </svg>

      {/* Number Badge Pill */}
      <div 
        className={`mt-1 font-mono font-bold text-xs tracking-wider px-1.5 py-0.5 rounded-md border transition-all ${ringColor} ${bgColor}`}
      >
        {number}
      </div>
    </button>
  );
};
