import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Check, 
  Bike, 
  AlertTriangle, 
  MessageCircle, 
  ChevronRight,
  Flame,
  Award,
  Sparkles
} from 'lucide-react';
import { PantherLogo } from '../common/PantherLogo';
import { BLACK_RIDE_PLANS, BLACK_RIDE_POLICIES } from '../../types';
import type { MembershipPlan } from '../../types';

interface ScreenPlansProps {
  onBack: () => void;
  onSelectPlanToBook?: (plan: MembershipPlan) => void;
  isAdmin?: boolean;
}

export const Screen_Plans: React.FC<ScreenPlansProps> = ({
  onBack,
  onSelectPlanToBook,
  isAdmin = false,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('premium');

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const selectedPlan = BLACK_RIDE_PLANS.find(p => p.id === selectedPlanId) || BLACK_RIDE_PLANS[2];

  const handleWhatsAppContact = (plan: MembershipPlan) => {
    const text = `Hola *BLACK RIDE Zarzal*! 🐆 Quiero adquirir el plan *${plan.name}* (${formatCOP(plan.price)} - ${plan.classesCount} clases con vigencia de ${plan.validityText}). ¿Cuáles son los métodos de pago disponibles (Nequi / Bancolombia)?`;
    window.open(`https://wa.me/573001234567?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 bg-[#090B0E] overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              aria-label="Volver"
              className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-[#131720] border border-[#222a38] text-slate-300 hover:text-white hover:border-[#D4FF00]/40 active:scale-95 transition-all duration-150 cursor-pointer flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black font-['Montserrat',sans-serif] text-white tracking-tight">
                  Membresías & Tarifas BLACK RIDE 🐆
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-[#D4FF00]/10 border border-[#D4FF00]/30 text-[10px] font-bold text-[#D4FF00]">
                  Zarzal
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400">
                No pares, supera tus límites • Elige tu plan y activa tu energía
              </p>
            </div>
          </div>
          <PantherLogo size="sm" showSubtitle={false} />
        </div>

        {/* Motivational Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#141B26] via-[#0E131C] to-[#141B26] border border-[#222a38] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4FF00]/10 border border-[#D4FF00]/30 flex items-center justify-center text-[#D4FF00] shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#D4FF00] block">
                Entrenamiento de Alto Rendimiento
              </span>
              <p className="text-xs text-slate-300 mt-0.5">
                Todas las membresías incluyen el beneficio exclusivo: <strong>Mi bicicleta favorita</strong>.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 border border-[#222a38] text-xs font-bold text-slate-300">
            <Bike className="w-3.5 h-3.5 text-[#D4FF00]" />
            <span>14 Bicicletas Pro en Sala</span>
          </div>
        </div>

        {/* Plans Grid: 1 col on mobile, 2 col on tablet, 3-4 col on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {BLACK_RIDE_PLANS.filter(p => p.isMembership).map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-150 flex flex-col justify-between cursor-pointer relative group ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#18202E] to-[#0F141F] border-[#D4FF00] shadow-[0_0_25px_rgba(212,255,0,0.18)] scale-[1.02]'
                    : plan.highlight
                    ? 'bg-[#131720] border-[#D4FF00]/50 hover:border-[#D4FF00]'
                    : 'bg-[#10141D] border-[#222a38] hover:border-slate-500 hover:bg-[#141924]'
                }`}
              >
                {/* Badge if highlight */}
                {plan.badge && (
                  <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#D4FF00] text-black shadow-md">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Membresía
                    </span>
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                      {plan.validityText}
                    </span>
                  </div>

                  <h3 className="text-xl font-black font-['Montserrat',sans-serif] text-white tracking-tight">
                    {plan.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {plan.tagline}
                  </p>

                  {/* Price */}
                  <div className="my-3 pb-3 border-b border-[#222a38]">
                    <span className="text-2xl sm:text-3xl font-black text-[#D4FF00] font-mono tracking-tight block">
                      {formatCOP(plan.price)}
                    </span>
                    <span className="text-[11px] font-bold text-slate-300 block mt-0.5">
                      {plan.classesCount} Clases • {formatCOP(Math.round(plan.price / plan.classesCount))}/clase
                    </span>
                  </div>

                  {/* Benefits */}
                  <ul className="space-y-2 text-xs text-slate-300">
                    {plan.benefits.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#D4FF00] shrink-0 mt-0.5 stroke-[3]" />
                        <span className="text-[11px] leading-tight">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Action */}
                <div className="pt-4 mt-4 border-t border-[#222a38]">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectPlanToBook) onSelectPlanToBook(plan);
                      else handleWhatsAppContact(plan);
                    }}
                    className={`w-full min-h-[42px] py-2.5 px-4 rounded-xl font-black text-xs tracking-wide flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-95 cursor-pointer shadow-md ${
                      isSelected
                        ? 'bg-[#D4FF00] hover:bg-[#c6f000] text-black shadow-[0_0_15px_rgba(212,255,0,0.3)]'
                        : 'bg-[#1C222F] hover:bg-[#252d3d] text-white border border-[#222a38] hover:border-[#D4FF00]/50'
                    }`}
                  >
                    <span>{isAdmin ? 'Ver Alumnos' : 'Elegir Plan'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Individual Class Card (Drop-in $10.000) */}
        {(() => {
          const individualPlan = BLACK_RIDE_PLANS.find(p => !p.isMembership)!;
          return (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#131720] border border-[#222a38] flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-950/60 border border-sky-500/40 flex items-center justify-center text-sky-400 shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-white font-['Montserrat',sans-serif]">
                      {individualPlan.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-sky-950/60 text-sky-400 border border-sky-500/30 text-[10px] font-bold">
                      Sin Membresía
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    ¿Quieres probar una clase o entrenar de forma ocasional? Paga solo el día que asistas.
                  </p>
                  <span className="text-[11px] text-slate-400 italic block mt-1">
                    * Se te asignará una bicicleta entre las que estén disponibles en la sala.
                  </span>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
                <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                  $10.000 <span className="text-xs font-normal text-slate-400 font-sans">COP / clase</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (onSelectPlanToBook) onSelectPlanToBook(individualPlan);
                    else handleWhatsAppContact(individualPlan);
                  }}
                  className="min-h-[42px] px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-black text-xs active:scale-95 transition-all duration-150 cursor-pointer shadow-md"
                >
                  Reservar Clase Individual
                </button>
              </div>
            </div>
          );
        })()}

        {/* 2 Special Cards: 1. Beneficio Bicicleta Favorita, 2. Política de Membresía */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-6">
          {/* Card 1: Beneficio Mi Bicicleta Favorita */}
          <div className="md:col-span-6 p-5 rounded-2xl bg-gradient-to-br from-[#131720] to-[#0E121A] border border-[#222a38] space-y-3 shadow-xl">
            <div className="flex items-center gap-2.5 pb-2 border-b border-[#222a38]">
              <div className="w-8 h-8 rounded-lg bg-[#D4FF00]/10 border border-[#D4FF00]/30 flex items-center justify-center text-[#D4FF00]">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-black text-white font-['Montserrat',sans-serif]">
                {BLACK_RIDE_POLICIES.favoriteBike.title}
              </h3>
            </div>

            <p className="text-xs text-slate-300 font-medium">
              Los clientes con membresía activa disfrutan de exclusividad para:
            </p>

            <ul className="space-y-2 text-xs text-slate-300">
              {BLACK_RIDE_POLICIES.favoriteBike.points.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#1C222F] border border-[#D4FF00]/40 text-[#D4FF00] font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <div className="p-3 rounded-xl bg-black/50 border border-[#222a38] text-[11px] text-slate-400 space-y-1 mt-3">
              <p className="text-sky-300 font-medium">
                • {BLACK_RIDE_POLICIES.favoriteBike.individualNote}
              </p>
              <p className="text-amber-300/90 italic">
                • ⚠️ {BLACK_RIDE_POLICIES.favoriteBike.warning}
              </p>
            </div>
          </div>

          {/* Card 2: Política de Membresía 🐆 */}
          <div className="md:col-span-6 p-5 rounded-2xl bg-gradient-to-br from-[#131720] to-[#0E121A] border border-[#222a38] space-y-3 shadow-xl">
            <div className="flex items-center gap-2.5 pb-2 border-b border-[#222a38]">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-black text-white font-['Montserrat',sans-serif]">
                {BLACK_RIDE_POLICIES.membershipPolicy.title}
              </h3>
            </div>

            <p className="text-xs text-slate-300">
              {BLACK_RIDE_POLICIES.membershipPolicy.intro}
            </p>

            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                ⚠️ Importante:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {BLACK_RIDE_POLICIES.membershipPolicy.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5"></span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 text-center">
              <span className="text-xs font-black uppercase tracking-wider text-[#D4FF00]">
                {BLACK_RIDE_POLICIES.membershipPolicy.slogan}
              </span>
            </div>
          </div>
        </div>

        {/* Direct WhatsApp Call to Action */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-[#101924] to-emerald-950/60 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-11 h-11 rounded-xl bg-emerald-500 flex items-center justify-center text-black font-black shrink-0 shadow-lg shadow-emerald-500/20">
              <MessageCircle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-sm font-black text-white block">
                ¿Deseas activar tu membresía hoy en Zarzal?
              </span>
              <span className="text-xs text-slate-300">
                Escríbenos por WhatsApp y te activamos de inmediato con Nequi o Bancolombia
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleWhatsAppContact(selectedPlan)}
            className="w-full sm:w-auto min-h-[46px] px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs flex items-center justify-center gap-2 active:scale-95 transition-all duration-150 cursor-pointer shadow-lg"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Adquirir {selectedPlan.name} ({formatCOP(selectedPlan.price)})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
