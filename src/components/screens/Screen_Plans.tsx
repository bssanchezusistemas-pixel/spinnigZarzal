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
  Sparkles,
  Edit2,
  Users,
  X,
  Phone,
  ShieldCheck,
  Ticket
} from 'lucide-react';
import { PantherLogo } from '../common/PantherLogo';
import { BLACK_RIDE_POLICIES } from '../../types';
import type { MembershipPlan, ClientUser } from '../../types';
import { db } from '../../services/db';

interface ScreenPlansProps {
  onBack: () => void;
  onSelectPlanToBook?: (plan: MembershipPlan) => void;
  isAdmin?: boolean;
  plans?: MembershipPlan[];
  clients?: ClientUser[];
  onUpdatePlan?: (updated: MembershipPlan) => void;
}

export const Screen_Plans: React.FC<ScreenPlansProps> = ({
  onBack,
  onSelectPlanToBook,
  isAdmin = false,
  plans: propPlans,
  clients: propClients,
  onUpdatePlan: propOnUpdatePlan,
}) => {
  const [localPlans, setLocalPlans] = useState<MembershipPlan[]>(() => db.getPlans());
  const plans = propPlans || localPlans;
  const [selectedPlanId, setSelectedPlanId] = useState<string>('premium');

  // Modals state
  const [viewingStudentsPlan, setViewingStudentsPlan] = useState<MembershipPlan | null>(null);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editTagline, setEditTagline] = useState('');
  const [editPrice, setEditPrice] = useState(0);
  const [editClassesCount, setEditClassesCount] = useState(1);
  const [editValidityDays, setEditValidityDays] = useState(1);
  const [editValidityText, setEditValidityText] = useState('');
  const [editBenefits, setEditBenefits] = useState('');

  const clients = propClients || db.getClients();

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const selectedPlan = plans.find(p => p.id === selectedPlanId) || plans[2] || plans[0];

  const handleWhatsAppContact = (plan: MembershipPlan) => {
    const text = `Hola *BLACK RIDE Zarzal*! 🐆 Quiero adquirir el plan *${plan.name}* (${formatCOP(plan.price)} - ${plan.classesCount} clases con vigencia de ${plan.validityText}). ¿Cuáles son los métodos de pago disponibles (Nequi / Bancolombia)?`;
    window.open(`https://wa.me/573001234567?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Open Edit Modal
  const handleOpenEditModal = (plan: MembershipPlan) => {
    setEditingPlan(plan);
    setEditName(plan.name);
    setEditTagline(plan.tagline);
    setEditPrice(plan.price);
    setEditClassesCount(plan.classesCount);
    setEditValidityDays(plan.validityDays);
    setEditValidityText(plan.validityText);
    setEditBenefits(plan.benefits.join('\n'));
  };

  // Save Edit Form
  const handleSavePlanEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    const benefitsArray = editBenefits
      .split('\n')
      .map(b => b.trim())
      .filter(b => b.length > 0);

    const updated: MembershipPlan = {
      ...editingPlan,
      name: editName.trim() || editingPlan.name,
      tagline: editTagline.trim() || editingPlan.tagline,
      price: Number(editPrice) || editingPlan.price,
      classesCount: Number(editClassesCount) || editingPlan.classesCount,
      validityDays: Number(editValidityDays) || editingPlan.validityDays,
      validityText: editValidityText.trim() || `${editValidityDays} días`,
      benefits: benefitsArray.length > 0 ? benefitsArray : editingPlan.benefits,
    };

    // Update in db
    db.updatePlan(updated);

    // Update in local state
    setLocalPlans((prev: MembershipPlan[]) => prev.map((p: MembershipPlan) => p.id === updated.id ? updated : p));

    // Propagate up if parent passed callback
    if (propOnUpdatePlan) {
      propOnUpdatePlan(updated);
    }

    setEditingPlan(null);
  };

  // Find enrolled students for a specific plan
  const getEnrolledStudents = (plan: MembershipPlan) => {
    return clients.filter(c => {
      if (plan.isMembership) {
        return c.membershipPlan?.toLowerCase().includes(plan.name.toLowerCase());
      } else {
        return c.clientType === 'particular' || c.membershipPlan?.toLowerCase().includes('individual');
      }
    });
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
              className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-[#131720] border border-[#222a38] text-slate-300 hover:text-white hover:border-[#D4AF37]/40 active:scale-95 transition-all duration-150 cursor-pointer flex items-center justify-center shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black font-['Montserrat',sans-serif] text-white tracking-tight">
                  Membresías & Tarifas BLACK RIDE 🐆
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[10px] font-bold text-[#D4AF37]">
                  {isAdmin ? 'MODO ADMIN' : 'Zarzal'}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400">
                {isAdmin 
                  ? 'Gestiona precios, cupos de clases y consulta los alumnos inscritos por plan'
                  : 'No pares, supera tus límites • Elige tu plan y activa tu energía'}
              </p>
            </div>
          </div>
          <PantherLogo size="sm" showSubtitle={false} />
        </div>

        {/* Motivational / Admin Context Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#141B26] via-[#0E131C] to-[#141B26] border border-[#222a38] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37] block">
                {isAdmin ? 'Administración de Tarifas Oficiales' : 'Entrenamiento de Alto Rendimiento'}
              </span>
              <p className="text-xs text-slate-300 mt-0.5">
                Todas las membresías incluyen el beneficio exclusivo: <strong>Mi bicicleta favorita</strong>.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 border border-[#222a38] text-xs font-bold text-slate-300">
            <Bike className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>14 Bicicletas Pro en Sala</span>
          </div>
        </div>

        {/* Plans Grid: 1 col on mobile, 2 col on tablet, 3-4 col on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {plans.filter(p => p.isMembership).map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            const enrolledCount = getEnrolledStudents(plan).length;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-150 flex flex-col justify-between cursor-pointer relative group ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#18202E] to-[#0F141F] border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.25)] scale-[1.02]'
                    : plan.highlight
                    ? 'bg-[#131720] border-[#D4AF37]/50 hover:border-[#D4AF37]'
                    : 'bg-[#10141D] border-[#222a38] hover:border-slate-500 hover:bg-[#141924]'
                }`}
              >
                {/* Badge if highlight */}
                {plan.badge && (
                  <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gold-gradient text-black shadow-md">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Membresía
                    </span>
                    <span className="text-[11px] font-bold text-[#F3E5AB] bg-[#D4AF37]/15 px-2 py-0.5 rounded-md border border-[#D4AF37]/30">
                      {plan.validityText}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xl font-black font-['Montserrat',sans-serif] text-white tracking-tight">
                      {plan.name}
                    </h3>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditModal(plan);
                        }}
                        className="p-1.5 rounded-lg bg-[#1C222F] border border-[#222a38] hover:border-[#D4AF37] text-slate-300 hover:text-[#D4AF37] active:scale-95 transition-all"
                        title={`Editar Tarifa ${plan.name}`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {plan.tagline}
                  </p>

                  {/* Price */}
                  <div className="my-3 pb-3 border-b border-[#222a38]">
                    <span className="text-2xl sm:text-3xl font-black text-[#D4AF37] font-mono tracking-tight block">
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
                        <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5 stroke-[3]" />
                        <span className="text-[11px] leading-tight">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Action */}
                <div className="pt-4 mt-4 border-t border-[#222a38] space-y-2">
                  {isAdmin ? (
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewingStudentsPlan(plan);
                        }}
                        className="w-full min-h-[42px] py-2.5 px-3 rounded-xl font-black text-xs tracking-wide flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-95 cursor-pointer shadow-md bg-gold-gradient hover:brightness-110 text-black"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Ver Alumnos ({enrolledCount})</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditModal(plan);
                        }}
                        className="w-full min-h-[36px] py-1.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-95 cursor-pointer bg-[#1C222F] hover:bg-[#252d3d] text-slate-300 border border-[#222a38] hover:border-[#D4AF37]/50"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Editar Tarifa</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectPlanToBook) onSelectPlanToBook(plan);
                        else handleWhatsAppContact(plan);
                      }}
                      className={`w-full min-h-[42px] py-2.5 px-4 rounded-xl font-black text-xs tracking-wide flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-95 cursor-pointer shadow-md ${
                        isSelected
                          ? 'bg-gold-gradient hover:brightness-110 text-black shadow-[0_0_15px_rgba(212,175,55,0.35)]'
                          : 'bg-[#1C222F] hover:bg-[#252d3d] text-white border border-[#222a38] hover:border-[#D4AF37]/50'
                      }`}
                    >
                      <span>Elegir Plan</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Individual Class Card (Drop-in $10.000) */}
        {(() => {
          const individualPlan = plans.find(p => !p.isMembership) || {
            id: 'individual' as const,
            name: 'CLASE INDIVIDUAL',
            tagline: 'Entrena solo el día que quieras',
            price: 10000,
            classesCount: 1,
            validityDays: 1,
            validityText: 'Por el día',
            isMembership: false,
            highlight: false,
            badge: 'Sin Membresía',
            benefits: [
              '1 clase individual',
              'Sin cláusula ni membresía requerida',
              'Asignación entre bicicletas disponibles de la sala',
              'Pago en recepción o en línea ($10.000 COP)',
            ],
          };
          const enrolledIndividual = getEnrolledStudents(individualPlan).length;

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
                  {formatCOP(individualPlan.price)} <span className="text-xs font-normal text-slate-400 font-sans">COP / clase</span>
                </span>
                
                {isAdmin ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setViewingStudentsPlan(individualPlan)}
                      className="min-h-[42px] px-4 py-2 rounded-xl bg-gold-gradient hover:brightness-110 text-black font-black text-xs active:scale-95 transition-all duration-150 cursor-pointer shadow-md flex items-center gap-1.5"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Ver Alumnos ({enrolledIndividual})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(individualPlan)}
                      className="min-h-[42px] px-3.5 py-2 rounded-xl bg-[#1C222F] hover:bg-[#252d3d] text-white border border-[#222a38] font-bold text-xs active:scale-95 transition-all duration-150 cursor-pointer flex items-center gap-1"
                      title="Editar tarifa individual"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Editar</span>
                    </button>
                  </div>
                ) : (
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
                )}
              </div>
            </div>
          );
        })()}

        {/* 2 Special Cards: 1. Beneficio Bicicleta Favorita, 2. Política de Membresía */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-6">
          {/* Card 1: Beneficio Mi Bicicleta Favorita */}
          <div className="md:col-span-6 p-5 rounded-2xl bg-gradient-to-br from-[#131720] to-[#0E121A] border border-[#222a38] space-y-3 shadow-xl">
            <div className="flex items-center gap-2.5 pb-2 border-b border-[#222a38]">
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
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
                  <span className="w-5 h-5 rounded-full bg-[#1C222F] border border-[#D4AF37]/40 text-[#D4AF37] font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
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
              <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">
                {BLACK_RIDE_POLICIES.membershipPolicy.slogan}
              </span>
            </div>
          </div>
        </div>

        {/* Direct WhatsApp Call to Action */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#17202C] via-[#101924] to-[#17202C] border border-[#D4AF37]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-11 h-11 rounded-xl bg-gold-gradient flex items-center justify-center text-black font-black shrink-0 shadow-lg shadow-[#D4AF37]/20">
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
            className="w-full sm:w-auto min-h-[46px] px-6 py-2.5 rounded-xl bg-gold-gradient hover:brightness-110 text-black font-black text-xs flex items-center justify-center gap-2 active:scale-95 transition-all duration-150 cursor-pointer shadow-lg"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Adquirir {selectedPlan.name} ({formatCOP(selectedPlan.price)})</span>
          </button>
        </div>
      </div>

      {/* MODAL: VER ALUMNOS POR PLAN (ADMIN) */}
      {viewingStudentsPlan && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#131720] border border-[#222a38] p-5 sm:p-6 rounded-3xl shadow-2xl space-y-4 max-h-[88vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-[#222a38]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center text-black font-black">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-white text-base font-['Montserrat',sans-serif]">
                    Alumnos del Plan {viewingStudentsPlan.name}
                  </h3>
                  <span className="text-[11px] text-[#D4AF37] font-semibold">
                    {formatCOP(viewingStudentsPlan.price)} • {viewingStudentsPlan.validityText}
                  </span>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setViewingStudentsPlan(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-[#1C222F] border border-[#222a38]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Students List */}
            {(() => {
              const enrolled = getEnrolledStudents(viewingStudentsPlan);

              if (enrolled.length === 0) {
                return (
                  <div className="text-center py-10 px-4 rounded-2xl bg-[#0E121A] border border-[#222a38]">
                    <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm font-bold text-white">No hay alumnos inscritos en este plan</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Los riders registrados con la tarifa {viewingStudentsPlan.name} aparecerán aquí automáticamente.
                    </p>
                  </div>
                );
              }

              return (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                    <span>{enrolled.length} alumno(s) inscritos actualmente</span>
                    <span className="text-[#D4AF37] font-bold">Activos</span>
                  </div>

                  <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
                    {enrolled.map((student) => (
                      <div 
                        key={student.id}
                        className="p-3.5 rounded-xl bg-[#0E121A] border border-[#222a38] flex items-center justify-between gap-3 hover:border-[#D4AF37]/40 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-10 h-10 rounded-xl object-cover border border-[#222a38] shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-white font-['Montserrat',sans-serif]">
                                {student.name}
                              </span>
                              {student.clientType === 'mensualidad' ? (
                                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                              ) : (
                                <Ticket className="w-3.5 h-3.5 text-sky-400" />
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 block font-mono">
                              {student.phone}
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              {student.membershipExpiresAt 
                                ? `Vence: ${student.membershipExpiresAt} • ${student.totalRides} clases tomadas`
                                : `${student.totalRides} clases tomadas`}
                            </span>
                          </div>
                        </div>

                        <a
                          href={`https://wa.me/${student.phone.replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(student.name)},%20te%20escribimos%20de%20BLACK%20RIDE%20Zarzal!%20🐆`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl bg-[#1C222F] hover:bg-[#252d3d] border border-[#222a38] text-[#D4AF37] hover:text-white transition-all shrink-0"
                          title="Contactar por WhatsApp"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            <div className="pt-2 border-t border-[#222a38] flex justify-end">
              <button
                type="button"
                onClick={() => setViewingStudentsPlan(null)}
                className="px-5 py-2.5 rounded-xl bg-[#1C222F] hover:bg-[#252d3d] text-slate-300 text-xs font-bold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR TARIFA / PLAN (ADMIN) */}
      {editingPlan && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#131720] border border-[#222a38] p-5 sm:p-6 rounded-3xl shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-[#222a38]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gold-gradient flex items-center justify-center text-black font-black">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-white text-base font-['Montserrat',sans-serif]">
                    Editar Tarifa — {editingPlan.name}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Modifica precios, cupos de clases y beneficios oficiales
                  </span>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setEditingPlan(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-[#1C222F] border border-[#222a38]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePlanEdit} className="space-y-4">
              {/* Plan Name */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Nombre del Plan
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E121A] border border-[#222a38] text-white text-xs sm:text-sm focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              {/* Tagline */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Subtítulo / Lema
                </label>
                <input
                  type="text"
                  value={editTagline}
                  onChange={(e) => setEditTagline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E121A] border border-[#222a38] text-white text-xs sm:text-sm focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              {/* Price & Classes Count in 2 columns */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Precio (COP)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    required
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E121A] border border-[#222a38] text-white font-mono text-xs sm:text-sm focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Número de Clases
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editClassesCount}
                    onChange={(e) => setEditClassesCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E121A] border border-[#222a38] text-white font-mono text-xs sm:text-sm focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              {/* Validity Days & Validity Text */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Días de Vigencia
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editValidityDays}
                    onChange={(e) => {
                      const days = Number(e.target.value);
                      setEditValidityDays(days);
                      setEditValidityText(`${days} días`);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E121A] border border-[#222a38] text-white font-mono text-xs sm:text-sm focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Etiqueta de Vigencia
                  </label>
                  <input
                    type="text"
                    required
                    value={editValidityText}
                    onChange={(e) => setEditValidityText(e.target.value)}
                    placeholder="Ej. 20 días"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E121A] border border-[#222a38] text-white text-xs sm:text-sm focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              {/* Benefits */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Beneficios del Plan (Uno por línea)
                </label>
                <textarea
                  rows={4}
                  value={editBenefits}
                  onChange={(e) => setEditBenefits(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E121A] border border-[#222a38] text-white text-xs focus:border-[#D4AF37] focus:outline-none leading-relaxed"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[#222a38] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#1C222F] text-slate-300 text-xs font-bold hover:bg-[#252d3d]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gold-gradient hover:brightness-110 text-black text-xs font-black flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
