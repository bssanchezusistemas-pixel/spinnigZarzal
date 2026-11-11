import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  isSimulator: boolean;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children, isSimulator }) => {
  // Desktop Fluid / Full-Width Responsive Mode
  if (!isSimulator) {
    return (
      <main className="w-full flex-1 flex flex-col bg-[#07090C] text-slate-100 overflow-x-hidden">
        <div className="w-full max-w-6xl mx-auto flex-1 min-h-0 flex flex-col px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
          {children}
        </div>
      </main>
    );
  }

  // Simulator Mode (iPhone on PC, Full Screen on Mobile)
  return (
    <div className="flex-1 flex items-center justify-center p-0 md:p-6 overflow-y-auto bg-gradient-to-b from-[#06080B] via-[#0B0F15] to-[#06080B]">
      {/* Smartphone Device Shell on Desktop; Natural Fullscreen on Mobile */}
      <div className="w-full h-full md:w-[395px] md:h-[840px] md:max-h-[92vh] bg-[#07090C] md:rounded-[48px] md:border-[8px] md:border-[#1A222F] md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_50px_rgba(212,255,0,0.12)] relative flex flex-col overflow-hidden md:ring-1 md:ring-white/10 transition-all duration-300">
        
        {/* Dynamic Island Pill (Desktop Simulator Only) */}
        <div className="hidden md:flex absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-40 items-center justify-end pr-2 pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-[#222]"></div>
        </div>

        {/* Status Bar (Desktop Simulator Only) */}
        <div className="hidden md:flex h-11 px-7 pt-2.5 items-center justify-between text-xs text-white select-none z-30 shrink-0">
          <span className="font-semibold tracking-tight text-[13px]">9:41</span>
          <div className="flex items-center gap-1.5 opacity-90">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 fill-white" />
          </div>
        </div>

        {/* Screen Content Viewport */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden relative">
          {children}
        </div>

        {/* Home Indicator Bar (Desktop Simulator Only) */}
        <div className="hidden md:flex h-4 w-full items-center justify-center bg-[#07090C] shrink-0 select-none pb-1">
          <div className="w-32 h-1 bg-white/20 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
