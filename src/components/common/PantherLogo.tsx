import React from 'react';

interface PantherLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showSubtitle?: boolean;
  className?: string;
}

export const PantherLogo: React.FC<PantherLogoProps> = ({ 
  size = 'md', 
  showSubtitle = true,
  className = '' 
}) => {
  const sizeMap = {
    sm: { icon: 24, text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 36, text: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 54, text: 'text-2xl', sub: 'text-xs' },
    hero: { icon: 84, text: 'text-4xl', sub: 'text-sm' }
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Panther Head with Glowing Eyes & Lightning Motif */}
      <div className="relative flex items-center justify-center">
        <svg 
          width={currentSize.icon * 1.2} 
          height={currentSize.icon} 
          viewBox="0 0 100 85" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_0_15px_rgba(212,255,0,0.35)]"
        >
          {/* Outer fierce panther silhouette */}
          <path 
            d="M8 58C12 40 28 26 44 20L62 10L68 18L80 14L86 24C92 34 94 48 88 62C82 72 70 78 58 78C42 78 30 72 20 66L8 58Z" 
            fill="#12161E" 
            stroke="#D4FF00" 
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Panther Ears */}
          <path d="M44 20L40 4L54 14" fill="#1C2331" stroke="#D4FF00" strokeWidth="2" />
          <path d="M78 14L88 2L88 18" fill="#1C2331" stroke="#D4FF00" strokeWidth="2" />
          
          {/* Lightning Bolt Slash */}
          <path 
            d="M62 6L40 38H56L44 74L76 34H58L68 14" 
            fill="#D4FF00" 
            className="animate-pulse"
          />

          {/* Glowing Eyes */}
          <ellipse cx="62" cy="38" rx="4" ry="2.5" fill="#FFE500" className="drop-shadow-[0_0_8px_#FFE500]" />
          <circle cx="63" cy="38" r="1.2" fill="#000000" />
          
          {/* Fangs & Jaw accent */}
          <path d="M70 54L66 64L76 58" fill="#FFFFFF" />
          <path d="M54 56L50 62L58 60" fill="#FFFFFF" />
          
          {/* Brow aggressive lines */}
          <path d="M52 30L68 34" stroke="#D4FF00" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Typography */}
      <div className="text-center mt-2">
        <div className="flex items-center justify-center tracking-tighter font-extrabold italic uppercase font-['Montserrat',sans-serif]">
          <span className={`text-white ${currentSize.text} drop-shadow-sm`}>PANTHER</span>
          <span className={`text-[#D4FF00] ml-1.5 ${currentSize.text} drop-shadow-[0_0_12px_rgba(212,255,0,0.5)]`}>
            RIDE
          </span>
        </div>
        {showSubtitle && (
          <div className={`text-zinc-400 font-semibold tracking-[0.25em] uppercase ${currentSize.sub} -mt-0.5`}>
            INDOOR CYCLING
          </div>
        )}
      </div>
    </div>
  );
};
