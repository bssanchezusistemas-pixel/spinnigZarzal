import React, { useRef, useState } from 'react';
import { Calendar, Lock, MapPin, ChevronRight, Volume2, VolumeX, Play, Pause, Sparkles, User, ShieldCheck, Ticket } from 'lucide-react';
import type { ClientUser } from '../../types';

interface Screen1WelcomeProps {
  onStartBooking: () => void;
  onLogin: () => void;
  onExploreSchedule?: () => void;
  onViewPlans?: () => void;
  currentUser?: ClientUser | null;
  onOpenLoginModal?: () => void;
  onLogout?: () => void;
}

export const Screen1_Welcome: React.FC<Screen1WelcomeProps> = ({ 
  onStartBooking, 
  onLogin, 
  onExploreSchedule,
  onViewPlans,
  currentUser = null,
  onOpenLoginModal,
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

  const hasActiveMembership = currentUser?.clientType === 'mensualidad' && currentUser?.membershipStatus === 'active';

  return (
    <div className="w-full h-full flex flex-col justify-between relative overflow-y-auto overflow-x-hidden bg-[#06080B] text-slate-100 select-none">
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

      {/* 2. Top Header & Floating Navbar */}
      <header className="relative z-20 flex items-center justify-between px-3.5 sm:px-6 py-2.5 sm:py-4 w-full max-w-5xl mx-auto shrink-0">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#AA771C] opacity-75 blur-xs group-hover:opacity-100 transition duration-300" />
            <img 
              src="/logo.jpg" 
              alt="Black Ride Indoor Cycling" 
              width="44"
              height="44"
              fetchPriority="high"
              decoding="async"
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

        {/* User Status / Login & Video Controls */}
        <div className="flex items-center gap-2">
          {/* User Logged in Chip OR Login Button */}
          {currentUser ? (
            <button
              onClick={onOpenLoginModal}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-black/60 border border-white/20 hover:border-[#D4FF00] backdrop-blur-md transition-all active:scale-95 cursor-pointer shadow-sm text-left"
              title="Ver mi estado de cuenta"
            >
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-6 h-6 rounded-full object-cover border border-[#D4FF00]" 
              />
              <div className="hidden sm:flex flex-col">
                <span className="text-[11px] font-bold text-white leading-none truncate max-w-[110px]">
                  {currentUser.name}
                </span>
                <span className={`text-[9px] font-black leading-none mt-0.5 ${hasActiveMembership ? 'text-emerald-400' : 'text-sky-300'}`}>
                  {hasActiveMembership ? '✓ Membresía' : 'Particular ($10k)'}
                </span>
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenLoginModal}
              className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[#D4FF00] hover:bg-[#c6f000] text-black font-black text-[10px] sm:text-xs tracking-wider uppercase flex items-center gap-1.5 backdrop-blur-md transition-all active:scale-95 cursor-pointer shadow-md"
            >
              <User className="w-3 h-3 stroke-[3]" />
              <span>Iniciar Sesión</span>
            </button>
          )}

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
            className="px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#D4AF37]/40 text-slate-300 hover:text-white font-semibold text-[10px] sm:text-[11px] tracking-wider uppercase flex items-center gap-1 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
            title="Panel de Administración"
          >
            <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#D4AF37]" />
            <span className="hidden md:inline">Admin</span>
          </button>
        </div>
      </header>

      {/* 3. Center Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 max-w-3xl mx-auto py-2 sm:py-6">
        {/* User Verified Status Chip if Logged In */}
        {currentUser ? (
          <div 
            onClick={onOpenLoginModal}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-lg mb-3 cursor-pointer transition-all active:scale-95 ${
              hasActiveMembership
                ? 'bg-emerald-950/70 border border-emerald-500/50 hover:border-emerald-400'
                : 'bg-sky-950/70 border border-sky-500/50 hover:border-sky-400'
            }`}
          >
            {hasActiveMembership ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] sm:text-xs text-white font-bold">
                  Hola, <strong>{currentUser.name}</strong> • Membresía Activa ({currentUser.membershipPlan || 'Plan Vigente'})
                </span>
                <span className="text-[9px] font-black bg-[#D4FF00] text-black px-2 py-0.2 rounded-full">
                  $0 COP
                </span>
              </>
            ) : (
              <>
                <Ticket className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-[11px] sm:text-xs text-white font-bold">
                  Hola, <strong>{currentUser.name}</strong> • Particular ($10.000 COP)
                </span>
                <span className="text-[9px] font-bold text-sky-300 bg-black/40 px-2 py-0.2 rounded-full border border-sky-500/30">
                  Sin Membresía
                </span>
              </>
            )}
          </div>
        ) : (
          /* Animated Status Pill */
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-[#D4AF37]/35 backdrop-blur-md shadow-lg shadow-black/40 mb-3 sm:mb-4 animate-pulse-subtle">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFE600] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFE600]" />
            </span>
            <span className="text-[9px] sm:text-xs uppercase tracking-[0.2em] font-extrabold text-slate-200">
              SALA ACTIVA · 14 CUPOS EXCLUSIVOS
            </span>
          </div>
        )}

        {/* Main Headline */}
        <h1 className="text-[clamp(1.5rem,5.5vw,3.25rem)] font-black uppercase tracking-tight leading-[1.08] mb-2 sm:mb-3">
          <span className="text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
            DOMINA EL RITMO.
          </span>
          <br />
          <span className="text-gold-gradient drop-shadow-[0_4px_24px_rgba(212,175,55,0.4)]">
            DESPIERTA LA BESTIA.
          </span>
        </h1>

        {/* Persuasive Subtitle */}
        <p className="text-[11px] sm:text-xs md:text-sm text-slate-300 max-w-xs sm:max-w-md font-normal mb-4 sm:mb-6 leading-tight sm:leading-relaxed drop-shadow-sm px-1">
          45 minutos de adrenalina pura con luces de club, audio inmersivo y selección de puesto en tiempo real.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 w-full max-w-xs sm:max-w-md mx-auto">
          {/* Primary CTA: Reservar Bicicleta */}
          <button
            onClick={onStartBooking}
            className="w-full py-3 sm:py-3.5 px-5 rounded-2xl bg-gold-gradient hover:brightness-110 text-black font-black text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_6px_25px_rgba(212,175,55,0.35)] hover:shadow-[0_8px_32px_rgba(212,175,55,0.5)] transition-all duration-200 active:scale-[0.97] cursor-pointer group min-h-[46px]"
          >
            <Calendar className="w-4 h-4 stroke-[2.5] transition-transform group-hover:scale-110" />
            <span className="uppercase tracking-wider">
              {currentUser 
                ? (hasActiveMembership ? 'Reservar mi Bici ($0 COP)' : 'Reservar mi Bici ($10.000)')
                : 'Elegir mi Bicicleta'}
            </span>
            <ChevronRight className="w-4 h-4 stroke-[3] ml-auto transition-transform group-hover:translate-x-1" />
          </button>

          {/* Secondary & Tertiary CTA row */}
          <div className="grid grid-cols-2 gap-2 w-full">
            {/* Login / Check Status Button if not logged in */}
            {!currentUser ? (
              <button
                onClick={onOpenLoginModal}
                className="w-full py-2.5 px-3 rounded-xl bg-[#131720]/95 hover:bg-[#1A222F] border border-[#D4FF00]/40 hover:border-[#D4FF00] text-[#D4FF00] font-black text-[11px] sm:text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 backdrop-blur-md transition-all duration-200 active:scale-[0.97] cursor-pointer shadow-md min-h-[44px]"
              >
                <User className="w-3.5 h-3.5 text-[#D4FF00]" />
                <span>Iniciar Sesión</span>
              </button>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="w-full py-2.5 px-3 rounded-xl bg-[#131720]/90 hover:bg-[#1A222F] border border-white/20 text-slate-200 font-bold text-[11px] sm:text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 backdrop-blur-md transition-all duration-200 active:scale-[0.97] cursor-pointer min-h-[44px]"
              >
                <User className="w-3.5 h-3.5 text-[#D4FF00]" />
                <span>Mi Cuenta</span>
              </button>
            )}

            {/* Plans button */}
            {onViewPlans && (
              <button
                onClick={onViewPlans}
                className="w-full py-2.5 px-3 rounded-xl bg-black/60 hover:bg-black/80 border border-white/15 hover:border-[#D4AF37]/50 text-slate-200 hover:text-white font-bold text-[11px] sm:text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 backdrop-blur-md transition-all duration-200 active:scale-[0.97] cursor-pointer min-h-[44px]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Membresías</span>
              </button>
            )}
          </div>

          {/* Explore full calendar link */}
          {onExploreSchedule && (
            <button
              onClick={onExploreSchedule}
              className="text-[11px] text-slate-400 hover:text-[#D4AF37] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer pt-0.5"
            >
              <Calendar className="w-3 h-3 text-[#D4AF37]" />
              <span>Ver todos los horarios del mes</span>
            </button>
          )}
        </div>
      </main>

      {/* 4. Bottom Feature Badges & Location */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto px-3 sm:px-6 pb-3 sm:pb-6 shrink-0">
        {/* 3 Pillars Cards */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-4 mb-2.5 sm:mb-4">
          {/* Card 1: 14 Bicicletas */}
          <div className="p-2 sm:p-3.5 rounded-xl bg-black/55 border border-white/10 hover:border-[#D4AF37]/35 backdrop-blur-md transition-colors flex flex-col items-center sm:items-start text-center sm:text-left">
            <span className="text-[11px] sm:text-base font-black text-[#FFE600] tracking-tight">
              14 BICIS
            </span>
            <span className="text-[8px] sm:text-xs text-slate-400 font-medium tracking-wide">
              Bici favorita
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
