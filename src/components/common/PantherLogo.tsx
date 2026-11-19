import React from 'react';

export interface PantherLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showSubtitle?: boolean;
  showText?: boolean;
  layout?: 'horizontal' | 'vertical';
  className?: string;
}

export const PantherLogo: React.FC<PantherLogoProps> = ({ 
  size = 'md', 
  showSubtitle = true,
  showText = true,
  layout,
  className = '' 
}) => {
  const isHorizontal = layout ? layout === 'horizontal' : size === 'sm';

  const sizeMap = {
    sm: { img: 'w-9 h-9 sm:w-10 sm:h-10', text: 'text-xs sm:text-sm', sub: 'text-[8px] sm:text-[9px]' },
    md: { img: 'w-11 h-11 sm:w-12 sm:h-12', text: 'text-sm sm:text-base', sub: 'text-[9px] sm:text-[10px]' },
    lg: { img: 'w-16 h-16', text: 'text-lg sm:text-xl', sub: 'text-xs' },
    hero: { img: 'w-24 h-24 sm:w-28 sm:h-28', text: 'text-2xl sm:text-3xl', sub: 'text-xs sm:text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex select-none items-center ${isHorizontal ? 'flex-row gap-2.5' : 'flex-col gap-2 text-center'} ${className}`}>
      {/* Circular Luxury Panther Logo with Gold Glow Ring (matching /boost Screen1_Welcome) */}
      <div className="relative group shrink-0">
        <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#AA771C] opacity-80 blur-xs group-hover:opacity-100 transition duration-300" />
        <img 
          src="/logo.jpg" 
          alt="Black Ride Indoor Cycling" 
          fetchPriority="high"
          decoding="async"
          className={`relative ${currentSize.img} rounded-full object-cover border border-[#D4AF37]/50 shadow-lg shadow-black`}
        />
      </div>

      {/* Typography */}
      {showText && (
        <div className={`flex flex-col ${isHorizontal ? 'text-left' : 'items-center text-center'}`}>
          <div className="flex items-center gap-1.5 tracking-wider font-extrabold uppercase font-['Montserrat',sans-serif]">
            <span className={`text-white ${currentSize.text} drop-shadow-sm`}>
              BLACK
            </span>
            <span className={`text-gold-gradient ${currentSize.text} drop-shadow-[0_0_12px_rgba(212,175,55,0.5)]`}>
              RIDE
            </span>
          </div>
          {showSubtitle && (
            <span className={`text-slate-400 font-bold tracking-[0.22em] uppercase ${currentSize.sub} mt-0.5`}>
              INDOOR CYCLING • ZARZAL
            </span>
          )}
        </div>
      )}
    </div>
  );
};
