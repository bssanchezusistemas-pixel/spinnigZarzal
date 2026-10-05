import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  isSimulator: boolean;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children, isSimulator }) => {
  if (!isSimulator) {
    return (
      <main className="w-full min-h-[calc(100vh-45px)] max-w-md mx-auto bg-[#090B0E] relative flex flex-col shadow-2xl">
        {/* Mobile Status Bar (9:41) */}
        <div className="h-10 px-6 pt-2 flex items-center justify-between text-xs text-white select-none z-30 shrink-0">
          <span className="font-semibold tracking-tight text-[13px]">9:41</span>
          <div className="flex items-center gap-1.5 opacity-90">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 fill-white" />
          </div>
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {children}
        </div>
      </main>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center p-3 md:p-6 overflow-y-auto bg-gradient-to-b from-[#090b0e] via-[#0d1117] to-[#090b0e]">
      {/* Smartphone Device Shell */}
      <div className="w-[390px] h-[820px] max-h-[92vh] bg-[#090B0E] rounded-[48px] border-[8px] border-[#1E2533] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(212,255,0,0.1)] relative flex flex-col overflow-hidden ring-1 ring-white/10 transition-all duration-300">
        
        {/* Dynamic Island Pill */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-40 flex items-center justify-end pr-2 pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-[#222]"></div>
        </div>

        {/* Status Bar */}
        <div className="h-11 px-7 pt-2.5 flex items-center justify-between text-xs text-white select-none z-30 shrink-0">
          <span className="font-semibold tracking-tight text-[13px]">9:41</span>
          <div className="flex items-center gap-1.5 opacity-90">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 fill-white" />
          </div>
        </div>

        {/* Screen Content Viewport */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {children}
        </div>

        {/* Home Indicator Bar */}
        <div className="h-4 w-full flex items-center justify-center bg-[#090B0E] shrink-0 select-none pb-1">
          <div className="w-32 h-1 bg-white/30 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
