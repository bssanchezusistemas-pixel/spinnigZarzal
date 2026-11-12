import React, { useRef, useState } from 'react';
import { Calendar, Lock, MapPin, ChevronRight, Volume2, VolumeX, Play, Pause, Sparkles } from 'lucide-react';

interface Screen1WelcomeProps {
  onStartBooking: () => void;
  onLogin: () => void;
  onExploreSchedule?: () => void;
  onViewPlans?: () => void;
}

export const Screen1_Welcome: React.FC<Screen1WelcomeProps> = ({ 
  onStartBooking, 
  onLogin, 
  onExploreSchedule,
  onViewPlans
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col justify-between relative overflow-y-auto overflow-x-hidden bg-[#06080B] text-slate-100 select-none">
      {/* 1. Cinematic Background Video Layer (Panther Silhouette & Gold Flywheel) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          poster="/panther_poster.jpg"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.78] contrast-[1.08] transition-transform duration-1000 ease-out"
        >
          <source src="/panther_hero.mp4" type="video/mp4" />
        </video>

        {/* Cinematic Vignette & Readability Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#06080B]/85 via-[#06080B]/45 to-[#06080B]" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#06080B]/25 to-[#06080B]/90" />
        
        {/* Subtle Gold Aura in Center */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Top Header & Floating Navbar (Inspirado en Têmpera / Apple) */}
      <header className="relative z-20 flex items-center justify-between px-3.5 sm:px-6 py-2.5 sm:py-4 w-full max-w-5xl mx-auto shrink-0">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#AA771C] opacity-75 blur-xs group-hover:opacity-100 transition duration-300" />
            <img 
              src="/logo.jpg" 
              alt="Black Ride Indoor Cycling" 
              className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover border border-[#D4AF37]/40 shadow-lg shadow-black"
            />
          </div>

          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xs sm:text-base tracking-widest text-white">
                BLACK
              </span>
              <span className="font-black text-xs sm:text-base tracking-widest text-gold-gradient">
                RIDE
              </span>
            </div>
            <span className="text-[8px] sm:text-[9px] tracking-[0.25em] uppercase font-bold text-slate-400">
              INDOOR CYCLING
            </span>
          </div>
        </div>

        {/* Video Controls & Staff Access */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Video Play/Pause Micro-control */}
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pausar video de fondo" : "Reproducir video"}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/50 border border-white/10 hover:border-[#D4AF37]/40 flex items-center justify-center text-slate-300 hover:text-white backdrop-blur-md transition-all active:scale-95 cursor-pointer"
            title={isPlaying ? "Pausar video" : "Reproducir video"}
          >
            {isPlaying ? <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-0.5" />}
          </button>

          {/* Video Mute/Unmute */}
          <button
            onClick={toggleMute}
            aria-label={isMuted ? "Activar audio" : "Silenciar audio"}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/50 border border-white/10 hover:border-[#D4AF37]/40 flex items-center justify-center text-slate-300 hover:text-white backdrop-blur-md transition-all active:scale-95 cursor-pointer"
            title={isMuted ? "Activar sonido" : "Silenciar"}
          >
            {isMuted ? <VolumeX className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D4AF37]" />}
          </button>

          {/* Staff Login Button */}
          <button
            onClick={onLogin}
            className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#D4AF37]/40 text-slate-300 hover:text-white font-semibold text-[10px] sm:text-[11px] tracking-wider uppercase flex items-center gap-1.5 backdrop-blur-md transition-all active:scale-95 cursor-pointer ml-0.5"
          >
            <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#D4AF37]" />
            <span className="hidden sm:inline">Staff</span>
          </button>
        </div>
      </header>

      {/* 3. Center Hero Section (High Impact Headline, Pill Tag & CTAs) */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 max-w-3xl mx-auto py-1 sm:py-8">
        {/* Animated Status Pill */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-black/60 border border-[#D4AF37]/35 backdrop-blur-md shadow-lg shadow-black/40 mb-2 sm:mb-4 animate-pulse-subtle">
          <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFE600] opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-[#FFE600]" />
          </span>
          <span className="text-[8.5px] sm:text-xs uppercase tracking-[0.2em] font-extrabold text-slate-200">
            SALA ACTIVA · 14 CUPOS EXCLUSIVOS
          </span>
        </div>

        {/* Main Headline (Estilo Têmpera / Dark Luxury) */}
        <h1 className="text-2xl lg:text-5xl font-black uppercase tracking-tight leading-[1.08] mb-1.5 sm:mb-3">
          <span className="text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
            DOMINA EL RITMO.
          </span>
          <br />
          <span className="text-gold-gradient drop-shadow-[0_4px_24px_rgba(212,175,55,0.4)]">
            DESPIERTA LA BESTIA.
          </span>
        </h1>

        {/* Persuasive Subtitle */}
        <p className="text-[10px] sm:text-xs md:text-base text-slate-300 max-w-xs sm:max-w-xl font-normal mb-3 sm:mb-6 leading-tight sm:leading-relaxed drop-shadow-sm px-1">
          45 minutos de adrenalina pura con luces de club, audio inmersivo y selección de puesto en tiempo real.
        </p>

        {/* Dual Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full max-w-xs sm:max-w-xl mx-auto">
          {/* Primary CTA: Reservar Bicicleta */}
          <button
            onClick={onStartBooking}
            className="w-full sm:flex-1 py-2.5 sm:py-3.5 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-gold-gradient hover:brightness-110 text-black font-black text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_6px_25px_rgba(212,175,55,0.35)] hover:shadow-[0_8px_32px_rgba(212,175,55,0.5)] transition-all duration-200 active:scale-[0.97] cursor-pointer group"
          >
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5] transition-transform group-hover:scale-110" />
            <span className="uppercase tracking-wider">Elegir mi Bicicleta</span>
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3] ml-auto transition-transform group-hover:translate-x-1" />
          </button>

          {/* Secondary CTA: Ver Planes y Membresías */}
          {onViewPlans && (
            <button
              onClick={onViewPlans}
              className="w-full sm:w-auto py-2.5 sm:py-3.5 px-4 sm:px-5 rounded-xl sm:rounded-2xl bg-[#131720]/90 hover:bg-[#1A222F] border border-[#D4AF37]/40 text-[#D4AF37] font-black text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 backdrop-blur-md transition-all duration-200 active:scale-[0.97] cursor-pointer shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Ver Membresías</span>
            </button>
          )}

          {/* Tertiary CTA: Ver Horarios / Sala */}
          <button
            onClick={onExploreSchedule || onStartBooking}
            className="w-full sm:w-auto py-2.5 sm:py-3.5 px-3 sm:px-4 rounded-xl sm:rounded-2xl bg-black/60 hover:bg-black/80 border border-white/15 hover:border-[#D4AF37]/50 text-slate-200 hover:text-white font-bold text-[10px] sm:text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 backdrop-blur-md transition-all duration-200 active:scale-[0.97] cursor-pointer"
          >
            <span>Horarios</span>
          </button>
        </div>
      </main>

      {/* 4. Bottom Feature Badges & Location (Directo de la estructura del video Têmpera) */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto px-3 sm:px-6 pb-2.5 sm:pb-6 shrink-0">
        {/* 3 Pillars Cards */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-4 mb-2.5 sm:mb-4">
          {/* Card 1: 14 Bicicletas */}
          <div className="p-2 sm:p-3.5 rounded-xl bg-black/55 border border-white/10 hover:border-[#D4AF37]/35 backdrop-blur-md transition-colors flex flex-col items-center sm:items-start text-center sm:text-left">
            <span className="text-[11px] sm:text-base font-black text-[#FFE600] tracking-tight">
              14 BICIS
            </span>
            <span className="text-[8px] sm:text-xs text-slate-400 font-medium tracking-wide">
              Mapa en vivo
            </span>
          </div>

          {/* Card 2: Audio Club */}
          <div className="p-2 sm:p-3.5 rounded-xl bg-black/55 border border-white/10 hover:border-[#D4AF37]/35 backdrop-blur-md transition-colors flex flex-col items-center sm:items-start text-center sm:text-left">
            <span className="text-[11px] sm:text-base font-black text-white tracking-tight">
              SHOW CLUB
            </span>
            <span className="text-[8px] sm:text-xs text-slate-400 font-medium tracking-wide">
              Luces & Sonido
            </span>
          </div>

          {/* Card 3: 45 Minutos */}
          <div className="p-2 sm:p-3.5 rounded-xl bg-black/55 border border-white/10 hover:border-[#D4AF37]/35 backdrop-blur-md transition-colors flex flex-col items-center sm:items-start text-center sm:text-left">
            <span className="text-[11px] sm:text-base font-black text-[#FFE600] tracking-tight">
              45 MIN
            </span>
            <span className="text-[8px] sm:text-xs text-slate-400 font-medium tracking-wide">
              Cardio Potencia
            </span>
          </div>
        </div>

        {/* Location & Studio Stamp */}
        <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase select-none">
          <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D4AF37]" />
          <span>Zarzal, Valle del Cauca</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-500 font-normal">Black Ride Studio</span>
        </div>
      </footer>
    </div>
  );
};
