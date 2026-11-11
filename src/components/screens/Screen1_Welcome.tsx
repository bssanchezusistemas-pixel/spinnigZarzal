import React from 'react';
import { Calendar, Lock, MapPin, Zap, ChevronRight } from 'lucide-react';
import { PantherLogo } from '../common/PantherLogo';

interface Screen1WelcomeProps {
  onStartBooking: () => void;
  onLogin: () => void;
}

export const Screen1_Welcome: React.FC<Screen1WelcomeProps> = ({ onStartBooking, onLogin }) => {
  return (
    <div className="flex-1 min-h-0 flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden bg-gradient-to-b from-[#06080b] via-[#090b0e] to-[#040507]">
      {/* Background Panther Ambience & Lighting */}
      <div className="absolute top-0 left-0 right-0 h-96 pointer-events-none overflow-hidden opacity-60">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D4FF00]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl"></div>

        {/* Panther Eyes Glow in darkness */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 flex items-center justify-center gap-16 opacity-90 drop-shadow-[0_0_20px_#FFE600]">
          <div className="w-5 h-2.5 bg-[#FFE600] rounded-full rotate-12 shadow-[0_0_15px_#FFE600] animate-pulse"></div>
          <div className="w-5 h-2.5 bg-[#FFE600] rounded-full -rotate-12 shadow-[0_0_15px_#FFE600] animate-pulse"></div>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
      </div>

      {/* Top Branding Section */}
      <div className="relative z-10 flex flex-col items-center pt-4 sm:pt-8 text-center max-w-lg mx-auto">
        <PantherLogo size="hero" showSubtitle={true} className="mb-3" />
        
        {/* Slogan Pill */}
        <div className="mt-2 px-4 py-1.5 rounded-full bg-black/60 border border-[#D4FF00]/30 backdrop-blur-md shadow-inner flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-[#D4FF00] fill-[#D4FF00]" />
          <p className="text-xs tracking-[0.22em] uppercase font-black font-['Montserrat',sans-serif] text-slate-100">
            <span className="text-[#D4FF00]">TU ENERGÍA</span> NOS MUEVE
          </p>
        </div>
      </div>

      {/* Center Studio Emblem */}
      <div className="relative z-10 my-auto py-6 flex flex-col items-center justify-center">
        <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full border border-[#222a38] flex items-center justify-center relative bg-gradient-to-b from-[#131720]/80 to-transparent p-4 shadow-[0_0_40px_rgba(0,0,0,0.8)] group hover:border-[#D4FF00]/40 transition-all duration-300">
          <div className="absolute inset-0 rounded-full border border-[#D4FF00]/20 animate-ping opacity-20 pointer-events-none"></div>
          
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-black font-['Montserrat',sans-serif] italic tracking-tight text-white">
              INDOOR
            </div>
            <div className="text-sm sm:text-base font-black font-['Montserrat',sans-serif] tracking-widest text-[#D4FF00] drop-shadow-[0_0_12px_rgba(212,255,0,0.5)]">
              CYCLING STUDIO
            </div>
            <div className="mt-2 text-[10px] sm:text-xs text-slate-400 font-bold tracking-wider uppercase">
              14 BICICLETAS • SONIDO PRO
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Buttons Section */}
      <div className="relative z-10 flex flex-col gap-3 w-full max-w-md mx-auto pb-2">
        {/* Primary Action Button: Reservar clase */}
        <button
          onClick={onStartBooking}
          className="w-full py-4 px-6 rounded-2xl bg-[#D4FF00] hover:bg-[#c4ed00] text-black font-extrabold text-base tracking-wide flex items-center justify-center gap-2.5 shadow-[0_4px_25px_rgba(212,255,0,0.35)] transition-all duration-150 active:scale-[0.97] hover:shadow-[0_6px_30px_rgba(212,255,0,0.45)] cursor-pointer group"
        >
          <Calendar className="w-5 h-5 stroke-[2.5] transition-transform group-hover:scale-110" />
          <span>Reservar tu bicicleta</span>
          <ChevronRight className="w-4 h-4 stroke-[3] ml-auto transition-transform group-hover:translate-x-1" />
        </button>

        {/* Secondary Action: Iniciar sesión / Panel Staff */}
        <button
          onClick={onLogin}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#12161F] hover:bg-[#1a202c] border border-[#222a38] hover:border-slate-500 text-slate-200 font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.97] cursor-pointer"
        >
          <Lock className="w-4 h-4 text-slate-400" />
          <span>Acceso Staff / Administrador</span>
        </button>

        {/* Footer City Badge */}
        <div className="mt-2 flex items-center justify-center gap-1.5 text-slate-400 text-xs font-semibold tracking-wider uppercase select-none">
          <MapPin className="w-3.5 h-3.5 text-[#D4FF00]" />
          <span>Zarzal, Valle del Cauca</span>
        </div>
      </div>
    </div>
  );
};
