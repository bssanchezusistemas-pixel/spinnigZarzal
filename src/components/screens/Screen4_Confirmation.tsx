import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Ticket, 
  Edit3, 
  Check, 
  Sparkles, 
  MessageCircle, 
  Loader2
} from 'lucide-react';
import { PantherLogo } from '../common/PantherLogo';
import type { ClassSession, ClientType } from '../../types';
import { checkClientMembershipByPhone, type MembershipCheckResult } from '../../services/supabaseClient';

interface Screen4ConfirmationProps {
  currentClass: ClassSession;
  bikeNumber: string;
  clientType: ClientType;
  onSelectClientType: (type: ClientType) => void;
  clientName: string;
  clientPhone: string;
  onChangeClientInfo: (name: string, phone: string) => void;
  onConfirmBooking: (bookingCode?: string) => void;
  onBack: () => void;
}

export const Screen4_Confirmation: React.FC<Screen4ConfirmationProps> = ({
  currentClass,
  bikeNumber,
  clientType,
  onSelectClientType,
  clientName,
  clientPhone,
  onChangeClientInfo,
  onConfirmBooking,
  onBack,
}) => {
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [membershipData, setMembershipData] = useState<MembershipCheckResult | null>(null);

  // Generar código único unificado para WhatsApp y el QR (ej. BR-8392)
  const [unifiedCode] = useState(() => `BR-${Math.floor(1000 + Math.random() * 9000)}`);

  // Verificar membresía en Supabase cuando cambie el número de teléfono
  useEffect(() => {
    const clean = clientPhone.replace(/[^0-9]/g, '');
    if (clean.length < 7) {
      setMembershipData(null);
      return;
    }

    let isCancelled = false;
    setIsVerifying(true);

    const timer = setTimeout(async () => {
      try {
        const result = await checkClientMembershipByPhone(clientPhone);
        if (isCancelled) return;

        setMembershipData(result);
        if (result.has_membership) {
          onSelectClientType('mensualidad');
          if (result.client_name && !clientName) {
            onChangeClientInfo(result.client_name, clientPhone);
          }
        } else {
          onSelectClientType('particular');
          if (result.client_name && !clientName) {
            onChangeClientInfo(result.client_name, clientPhone);
          }
        }
      } catch (err) {
        console.error('Error verificando membresía:', err);
      } finally {
        if (!isCancelled) setIsVerifying(false);
      }
    }, 450);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [clientPhone]);

  // Manejar confirmación directa por WhatsApp
  const handleConfirmAndOpenWhatsApp = () => {
    const isMembership = clientType === 'mensualidad';
    const cleanStudioPhone = '573154829102'; // Número oficial de recepción BLACK RIDE Zarzal

    const text = `🐆 *BLACK RIDE ZARZAL - CONFIRMACIÓN DE RESERVA*
📍 *Studio Zarzal, Valle*

• *Alumno:* ${clientName || 'Rider'}
• *Celular:* ${clientPhone}
• *Bicicleta Asignada:* #${bikeNumber}
• *Modalidad:* ${isMembership ? 'MEMBRESÍA ACTIVA ($0 COP)' : 'CLASE INDIVIDUAL ($10.000 COP)'}
• *Clase:* ${currentClass.type}
• *Fecha:* ${currentClass.dateFormatted} a las ${currentClass.time}
• *Código QR Oficial:* *${unifiedCode}*

¡Nos vemos en la sala para darlo todo! 🚴⚡`;

    const encoded = encodeURIComponent(text);
    const waUrl = `https://wa.me/${cleanStudioPhone}?text=${encoded}`;

    // Abrir WhatsApp en pestaña nueva
    window.open(waUrl, '_blank');

    // Continuar a la pantalla de emisión del Ticket QR
    onConfirmBooking(unifiedCode);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 bg-[#090B0E] overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              aria-label="Volver"
              className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-[#131720] border border-[#222a38] text-slate-300 hover:text-white hover:border-[#D4AF37]/40 active:scale-95 transition-all duration-150 cursor-pointer flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-black font-['Montserrat',sans-serif] text-white tracking-tight">
                Confirmar reserva
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Paso 3 de 3 • Verificación automática de membresía y pase QR
              </p>
            </div>
          </div>
          <PantherLogo size="sm" showSubtitle={false} />
        </div>

        {/* Responsive Grid: 1 col on mobile, 2 col on PC */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-start">
          {/* Left Column: Summary of class and bike */}
          <div className="md:col-span-6 space-y-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#131720] border border-[#222a38] space-y-3.5 shadow-xl">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold block">
                Detalles del Pedaleo
              </span>

              {/* Class & Bike Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#1C222F] to-[#0E121A] border border-[#222a38] flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Modalidad</span>
                  <span className="text-base font-black text-white font-['Montserrat',sans-serif]">
                    {currentClass.type}
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Studio Zarzal • 45 minutos
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Bici</span>
                  <div className="px-3 py-1.5 rounded-xl bg-gold-gradient text-black font-black text-lg font-mono inline-block shadow-md">
                    #{bikeNumber}
                  </div>
                </div>
              </div>

              {/* Rows */}
              <div className="space-y-2.5 pt-1">
                {/* Fecha */}
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#0E121A] border border-[#222a38]">
                  <div className="w-9 h-9 rounded-lg bg-[#1C222F] flex items-center justify-center text-[#D4AF37] shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Fecha</span>
                    <span className="text-xs font-bold text-white">
                      {currentClass.dateFormatted}
                    </span>
                  </div>
                </div>

                {/* Hora */}
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#0E121A] border border-[#222a38]">
                  <div className="w-9 h-9 rounded-lg bg-[#1C222F] flex items-center justify-center text-[#D4AF37] shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Horario</span>
                    <span className="text-xs font-bold text-white">
                      {currentClass.time}
                    </span>
                  </div>
                </div>

                {/* Coach */}
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#0E121A] border border-[#222a38]">
                  <img 
                    src={currentClass.instructor.avatar} 
                    alt={currentClass.instructor.name} 
                    className="w-9 h-9 rounded-lg object-cover border border-[#D4AF37]/50 shrink-0"
                  />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Instructor</span>
                    <span className="text-xs font-bold text-white">
                      {currentClass.instructor.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Unified Code Preview Pill */}
            <div className="p-3.5 rounded-2xl bg-[#0E121A] border border-[#222a38] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Código Único de Reserva</span>
                <span className="text-[11px] text-slate-400">Se enviará a WhatsApp e irá impreso en tu QR</span>
              </div>
              <span className="text-xs font-mono font-black text-[#D4AF37] bg-black/60 px-2.5 py-1 rounded-lg border border-[#D4AF37]/30">
                {unifiedCode}
              </span>
            </div>
          </div>

          {/* Right Column: Rider Info & Real-Time Membership Detection */}
          <div className="md:col-span-6 space-y-4">
            {/* Rider Info Card with Phone Input */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#131720] border border-[#222a38] shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">
                  Datos del Rider
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditingInfo(!isEditingInfo)}
                  className="min-h-[32px] px-2.5 py-1 rounded-lg bg-[#1C222F] border border-[#222a38] text-[11px] font-bold text-[#D4AF37] hover:border-[#D4AF37]/50 active:scale-95 transition-all duration-150 flex items-center gap-1 cursor-pointer"
                >
                  {isEditingInfo ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Listo</span>
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </>
                  )}
                </button>
              </div>

              {isEditingInfo ? (
                <div className="space-y-2.5 pt-1">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Nombre completo:</label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => onChangeClientInfo(e.target.value, clientPhone)}
                      placeholder="Nombre del alumno"
                      className="w-full px-3 py-2 rounded-xl bg-[#0E121A] border border-[#222a38] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">WhatsApp / Celular (10 dígitos):</label>
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => onChangeClientInfo(clientName, e.target.value)}
                      placeholder="Ej. 3154829102"
                      className="w-full px-3 py-2 rounded-xl bg-[#0E121A] border border-[#222a38] text-xs text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-[#0E121A] border border-[#222a38] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#1C222F] flex items-center justify-center text-slate-300">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">{clientName || 'Rider'}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{clientPhone}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {isVerifying ? (
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin text-[#D4AF37]" />
                        <span>Verificando...</span>
                      </span>
                    ) : (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        clientType === 'mensualidad' 
                          ? 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/40' 
                          : 'bg-black/50 text-slate-300 border-[#222a38]'
                      }`}>
                        {clientType === 'mensualidad' ? '✓ Membresía Activa' : 'Particular'}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Live Membership Verification Feedback Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#131720] border border-[#222a38] space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">
                  Estado de Membresía (Supabase)
                </span>
                {isVerifying && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" />}
              </div>

              {membershipData?.has_membership ? (
                /* Card: Membresía Válida Detectada */
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#1E190E] via-[#15130A] to-[#1E190E] border border-[#D4AF37]/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#D4AF37] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#F3C766]" />
                      <span>{membershipData.plan_name || 'Membresía Activa'}</span>
                    </span>
                    <span className="text-[10px] font-bold text-black bg-[#D4AF37] px-2 py-0.5 rounded-full">
                      $0 COP
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1 border-t border-[#D4AF37]/20">
                    <span>Cupos disponibles: <strong className="text-white">{membershipData.remaining_classes} clases</strong></span>
                    <span>Vence: <strong className="text-white">{membershipData.expires_at}</strong></span>
                  </div>
                  <p className="text-[10px] text-[#F3E5AB]/90 italic">
                    ✓ Beneficio exclusivo: Tu bicicleta favorita (#{bikeNumber}) queda asignada sin costo en sala.
                  </p>
                </div>
              ) : (
                /* Card: Particular / Sin membresía */
                <div className="p-3.5 rounded-xl bg-[#0E121A] border border-[#222a38] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Ticket className="w-4 h-4 text-sky-400" />
                      <span>Clase Individual (Por el día)</span>
                    </span>
                    <span className="text-xs font-mono font-black text-sky-400">
                      $10.000 COP
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {membershipData?.message || 'Tarifa oficial para riders sin membresía activa. Pago en recepción o Nequi.'}
                  </p>
                </div>
              )}
            </div>

            {/* Total to pay / confirmation */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#131720] to-[#0E121A] border border-[#222a38] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-400 block">Total a liquidar:</span>
                  <span className="text-[11px] text-slate-400 italic">
                    {clientType === 'mensualidad' 
                      ? '✓ Cubierto por tu Membresía BLACK RIDE' 
                      : 'Pago en recepción de Zarzal o en línea ($10.000 COP)'}
                  </span>
                </div>
                <span className="text-2xl font-black text-white font-mono">
                  {clientType === 'mensualidad' ? '$0 COP' : '$10.000 COP'}
                </span>
              </div>

              {/* Direct WhatsApp + QR Generation Button */}
              <button
                type="button"
                onClick={handleConfirmAndOpenWhatsApp}
                className="w-full min-h-[52px] py-4 px-6 rounded-2xl bg-gold-gradient hover:brightness-110 text-black font-black text-sm tracking-wide flex items-center justify-center gap-2.5 shadow-[0_4px_25px_rgba(212,175,55,0.35)] hover:shadow-[0_4px_30px_rgba(212,175,55,0.5)] active:scale-95 transition-all duration-150 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-black stroke-none" />
                <span>Confirmar por WhatsApp & Obtener QR</span>
              </button>

              <p className="text-center text-[10px] text-slate-400">
                Al confirmar, se abrirá WhatsApp con el código <strong>{unifiedCode}</strong> y se generará tu pase digital de acceso.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
