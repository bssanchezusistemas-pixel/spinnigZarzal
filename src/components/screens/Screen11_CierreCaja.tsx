import React, { useState } from 'react';
import { 
  ArrowLeft, 
  DollarSign, 
  AlertCircle, 
  Users, 
  CheckCircle2, 
  Clock, 
  PlusCircle, 
  Lock, 
  Unlock, 
  MessageCircle, 
  Calendar
} from 'lucide-react';
import { db } from '../../services/db';
import type { PaymentMethod, Reservation } from '../../types';

interface Screen11CierreCajaProps {
  onBack: () => void;
  onRefreshData?: () => void;
}

export const Screen11_CierreCaja: React.FC<Screen11CierreCajaProps> = ({ onBack, onRefreshData }) => {
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-25');
  const [showCollectModal, setShowCollectModal] = useState<boolean>(false);
  const [selectedBookingToCollect, setSelectedBookingToCollect] = useState<Reservation | null>(null);
  const [collectMethod, setCollectMethod] = useState<PaymentMethod>('efectivo');
  
  // Extra payment modal
  const [showAddPaymentModal, setShowAddPaymentModal] = useState<boolean>(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newConcept, setNewConcept] = useState<'clase_particular' | 'mensualidad' | 'hidratacion' | 'otro'>('mensualidad');
  const [newAmount, setNewAmount] = useState<number>(120000);
  const [newMethod, setNewMethod] = useState<PaymentMethod>('nequi');
  const [newNotes, setNewNotes] = useState('');

  // Closure modal
  const [showClosureModal, setShowClosureModal] = useState<boolean>(false);
  const [closureNotes, setClosureNotes] = useState('');
  const [isBoxClosed, setIsBoxClosed] = useState<boolean>(false);

  // Compute live summary
  const summary = db.getCashSummary(selectedDate);

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleOpenCollect = (booking: Reservation) => {
    setSelectedBookingToCollect(booking);
    setCollectMethod('efectivo');
    setShowCollectModal(true);
  };

  const handleConfirmCollect = () => {
    if (!selectedBookingToCollect) return;
    db.markBookingAsPaid(selectedBookingToCollect.id, collectMethod, 15000);
    setShowCollectModal(false);
    setSelectedBookingToCollect(null);
    if (onRefreshData) onRefreshData();
  };

  const handleAddManualPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || newAmount <= 0) return;

    let conceptLabel = 'Pago registrado en recepción';
    if (newConcept === 'mensualidad') {
      if (newAmount === 28000) conceptLabel = 'Membresía STARTER (4 Clases • 8 Días)';
      else if (newAmount === 56000) conceptLabel = 'Membresía PRO (8 Clases • 15 Días)';
      else if (newAmount === 84000) conceptLabel = 'Membresía PREMIUM (12 Clases • 20 Días)';
      else if (newAmount === 120000) conceptLabel = 'Membresía ÉLITE (18 Clases • 30 Días)';
      else conceptLabel = `Membresía BLACK RIDE ($${newAmount.toLocaleString('es-CO')})`;
    } else if (newConcept === 'clase_particular') {
      conceptLabel = 'Clase Individual BLACK RIDE ($10.000)';
    } else if (newConcept === 'hidratacion') {
      conceptLabel = 'Bebidas e Hidratación';
    }

    db.addDailyPayment({
      date: selectedDate,
      time: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      clientName: newClientName,
      clientPhone: newClientPhone || '+57 300 000 0000',
      concept: newConcept,
      conceptLabel,
      amount: newAmount,
      method: newMethod,
      notes: newNotes,
    });

    setShowAddPaymentModal(false);
    setNewClientName('');
    setNewClientPhone('');
    setNewNotes('');
    if (onRefreshData) onRefreshData();
  };

  const handleCloseCashRegister = () => {
    db.saveCashClosure({
      id: `close-${selectedDate}`,
      date: selectedDate,
      closedAt: new Date().toISOString(),
      closedBy: 'Administración Panther Ride',
      totalIncome: summary.totalIncome,
      totalCash: summary.totalCash,
      totalNequi: summary.totalNequi,
      totalBancolombia: summary.totalBancolombia,
      totalCards: summary.totalCards,
      totalPending: summary.totalPending,
      totalRiders: summary.totalRiders,
      ridersWithMembership: summary.ridersWithMembership,
      ridersParticular: summary.ridersParticular,
      notes: closureNotes || 'Cierre de caja completado sin novedades.',
      status: 'closed',
    });
    setIsBoxClosed(true);
    setShowClosureModal(false);
  };

  const generateWhatsAppReport = () => {
    const text = `🐆 *BLACK RIDE - CIERRE DE CAJA OFICIAL*
📍 *Studio Zarzal, Valle*
📅 *Fecha:* ${selectedDate}
⏰ *Hora de Cierre:* ${new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}

💵 *RESUMEN FINANCIERO:*
• *Total Recaudado:* ${formatCOP(summary.totalIncome)}
• 💵 Efectivo en Caja: ${formatCOP(summary.totalCash)}
• 📱 Nequi: ${formatCOP(summary.totalNequi)}
• 🏦 Bancolombia: ${formatCOP(summary.totalBancolombia)}
• 💳 Tarjeta: ${formatCOP(summary.totalCards)}
• ⚠️ Pendiente por cobrar: ${formatCOP(summary.totalPending)}

👥 *ASISTENCIA Y SALA:*
• Total Alumnos: ${summary.totalRiders} riders
• Con Membresía: ${summary.ridersWithMembership} ($0 en entrada - Beneficio Bici Favorita)
• Clases Individuales: ${summary.ridersParticular} ($10.000 c/u)
• Ocupación de Sala: ${summary.occupancyPercent}% (14 bicis)

🚴 *LISTA DE ASISTENCIA:*
${summary.reservations.map(r => `• Bici #${r.bikeNumber} - ${r.clientName} (${r.clientType.toUpperCase()} - ${r.paymentStatus === 'paid' ? 'PAGADO' : r.paymentStatus === 'included_in_membership' ? 'MEMBRESÍA' : 'PENDIENTE'})`).join('\n')}

🔒 *Estado:* Caja Cuadrada y Archivada en BLACK RIDE Zarzal.`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div id="cierre-caja-scroll" className="flex-1 min-h-0 flex flex-col justify-between p-4 sm:p-6 bg-[#090B0E] overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 sm:pb-6 border-b border-[#222a38] gap-3">
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
                Cierre de Caja & Finanzas Diarias
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Panther Ride Zarzal • Control de Efectivo, Nequi y Mensualidades
              </p>
            </div>
          </div>

          {/* Date Selector Badge & Register State */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[#131720] border border-[#222a38] px-3 py-1.5 rounded-xl">
              <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
              >
                <option value="2026-09-25" className="bg-[#131720]">25 Sep 2026 (Hoy)</option>
                <option value="2026-09-24" className="bg-[#131720]">24 Sep 2026</option>
                <option value="2026-09-23" className="bg-[#131720]">23 Sep 2026</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setShowAddPaymentModal(true)}
              className="min-h-[38px] flex items-center gap-1.5 text-xs font-black text-black bg-gold-gradient hover:brightness-110 px-3 py-1.5 rounded-xl active:scale-95 transition-all duration-150 cursor-pointer shadow-md"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>+ Venta Extra</span>
            </button>
          </div>
        </div>

        {/* Box State Pill */}
        <div className="flex flex-wrap items-center justify-between p-3 rounded-2xl bg-[#131720] border border-[#222a38] my-4 gap-2">
          <div className="flex items-center gap-2">
            {isBoxClosed ? (
              <span className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-950/50 px-2.5 py-1 rounded-lg border border-amber-500/30">
                <Lock className="w-3.5 h-3.5" /> Caja Cerrada
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#F3E5AB] bg-[#D4AF37]/10 px-2.5 py-1 rounded-lg border border-[#D4AF37]/30">
                <Unlock className="w-3.5 h-3.5 text-[#D4AF37]" /> Caja Abierta (Turno Activo)
              </span>
            )}
            <span className="text-xs text-slate-400 hidden sm:inline">Recepción Sede Zarzal</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={generateWhatsAppReport}
              className="min-h-[36px] px-3 py-1.5 rounded-xl bg-gold-gradient hover:brightness-110 text-black font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all duration-150 cursor-pointer shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Reporte WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={() => setShowClosureModal(true)}
              className="min-h-[36px] px-3 py-1.5 rounded-xl bg-[#1C222F] hover:bg-[#252d3d] border border-[#222a38] text-white font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all duration-150 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>{isBoxClosed ? 'Ver Cierre' : 'Cerrar Caja'}</span>
            </button>
          </div>
        </div>

        {/* Responsive Grid: 1 col on mobile, 2 col on PC */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          {/* Left Column: Revenue Hero, Breakdown & Attendance */}
          <div className="lg:col-span-5 space-y-4">
            {/* Hero Revenue Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#151c27] via-[#10141d] to-[#0d1017] border border-[#222a38] shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span className="font-semibold uppercase tracking-wider text-[10px]">Total Recaudado Hoy</span>
                <span className="text-[#D4AF37] font-mono text-[10px] bg-black/50 px-2 py-0.5 rounded-md border border-[#D4AF37]/30 font-bold">
                  EN VIVO
                </span>
              </div>

              <div className="text-3xl font-black font-['Montserrat',sans-serif] tracking-tight text-gold-gradient drop-shadow-[0_0_12px_rgba(212,175,55,0.35)] my-1">
                {formatCOP(summary.totalIncome)}
              </div>

              {/* Breakdown Mini Cards */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#222a38]">
                <div className="p-2.5 rounded-xl bg-black/50 border border-[#D4AF37]/30 text-center">
                  <span className="text-[10px] text-slate-400 block font-medium">💵 Efectivo</span>
                  <span className="text-xs font-bold text-[#D4AF37] block mt-0.5">
                    {formatCOP(summary.totalCash)}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-black/50 border border-purple-500/20 text-center">
                  <span className="text-[10px] text-slate-400 block font-medium">📱 Nequi</span>
                  <span className="text-xs font-bold text-purple-300 block mt-0.5">
                    {formatCOP(summary.totalNequi)}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-black/50 border border-sky-500/20 text-center">
                  <span className="text-[10px] text-slate-400 block font-medium">🏦 Bancolombia</span>
                  <span className="text-xs font-bold text-sky-300 block mt-0.5">
                    {formatCOP(summary.totalBancolombia)}
                  </span>
                </div>
              </div>

              {/* Pending alert if any */}
              {summary.totalPending > 0 && (
                <div className="mt-3 p-2.5 rounded-xl bg-rose-950/50 border border-rose-500/40 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-rose-300 text-[11px]">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>Pendiente por cobrar en puerta:</span>
                  </div>
                  <span className="font-black text-rose-400">{formatCOP(summary.totalPending)}</span>
                </div>
              )}
            </div>

            {/* Attendance Breakdown (Mensualidades vs Particulares) */}
            <div className="grid grid-cols-2 gap-3">
              {/* Mensualidades */}
              <div className="p-4 rounded-2xl bg-[#131720] border border-[#222a38]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Mensualidades</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-white">{summary.ridersWithMembership}</span>
                  <span className="text-xs text-[#D4AF37] font-bold">Riders ($0 en sala)</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Con membresía activa</p>
              </div>

              {/* Particulares / Solo el día */}
              <div className="p-4 rounded-2xl bg-[#131720] border border-[#222a38]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Particulares</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-white">{summary.ridersParticular}</span>
                  <span className="text-xs text-sky-400 font-bold">Por el día</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Tarifa: $10.000 / clase</p>
              </div>
            </div>
          </div>

          {/* Right Column: Attendance / Who Booked & Cash Register Movements */}
          <div className="lg:col-span-7 space-y-4">
            {/* Section: Who Booked? (Reservas y Asistencia de la fecha) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#131720] border border-[#222a38] shadow-xl">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#222a38]">
                <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#D4AF37]" />
                  <span>¿Quién Reservó Hoy? ({summary.reservations.length} alumnos)</span>
                </h2>
                <span className="text-[10px] text-slate-400 font-medium">14 Cupos en Sala</span>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {summary.reservations.length > 0 ? (
                  summary.reservations.map((res) => (
                    <div
                      key={res.id}
                      className="p-3 rounded-xl bg-[#0E121A] border border-[#222a38] flex items-center justify-between hover:border-[#D4AF37]/40 transition-all duration-150"
                    >
                      <div className="flex items-center gap-3">
                        {/* Bike Number Badge */}
                        <div className="w-10 h-10 rounded-xl bg-black/60 border border-[#222a38] flex flex-col items-center justify-center shrink-0">
                          <span className="text-[8px] text-slate-400 uppercase leading-none">Bici</span>
                          <span className="text-xs font-black text-[#D4AF37] font-mono leading-none mt-0.5">
                            #{res.bikeNumber}
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">
                              {res.clientName}
                            </span>
                            {/* Membership Type Pill */}
                            {res.clientType === 'mensualidad' ? (
                              <span className="text-[9px] font-bold text-[#F3E5AB] bg-[#D4AF37]/15 px-1.5 py-0.2 rounded border border-[#D4AF37]/30">
                                Mensualidad
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold text-sky-400 bg-sky-950/60 px-1.5 py-0.2 rounded border border-sky-500/30">
                                Particular
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {res.time}
                            </span>
                            <span>•</span>
                            <span className="font-mono">{res.clientPhone}</span>
                          </div>
                        </div>
                      </div>

                      {/* Payment Status & Action */}
                      <div className="flex flex-col items-end gap-1">
                        {res.paymentStatus === 'included_in_membership' && (
                          <span className="text-[10px] font-bold text-[#F3E5AB] bg-[#D4AF37]/10 px-2 py-0.5 rounded-md border border-[#D4AF37]/20">
                            Cubierto ($0)
                          </span>
                        )}

                        {res.paymentStatus === 'paid' && (
                          <span className="text-[10px] font-bold text-[#F3E5AB] bg-[#D4AF37]/10 px-2 py-0.5 rounded-md border border-[#D4AF37]/20 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-[#D4AF37]" /> {formatCOP(res.amountPaid)}
                          </span>
                        )}

                        {res.paymentStatus === 'pending' && (
                          <button
                            type="button"
                            onClick={() => handleOpenCollect(res)}
                            className="min-h-[30px] text-[10px] font-black text-black bg-gold-gradient hover:brightness-110 px-2.5 py-1 rounded-lg active:scale-95 transition-all duration-150 cursor-pointer shadow-sm animate-pulse"
                          >
                            Cobrar $10.000
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-xl bg-[#0E121A] border border-[#222a38] text-center text-xs text-slate-400">
                    No hay reservas registradas para esta fecha.
                  </div>
                )}
              </div>
            </div>

            {/* Section: Payments & Register Breakdown */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#131720] border border-[#222a38] shadow-xl">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-3 pb-2 border-b border-[#222a38] flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                <span>Movimientos de Caja ({summary.payments.length})</span>
              </h2>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {summary.payments.map((p) => (
                  <div
                    key={p.id}
                    className="p-2.5 rounded-xl bg-[#0E121A] border border-[#222a38] flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{p.clientName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">[{p.time}]</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block">{p.conceptLabel}</span>
                      {p.notes && <span className="text-[9px] text-slate-400 italic block">{p.notes}</span>}
                    </div>

                    <div className="text-right">
                      <span className="font-black text-[#D4AF37] block">
                        {formatCOP(p.amount)}
                      </span>
                      <span className="text-[9px] uppercase font-bold text-slate-300 bg-black/60 px-1.5 py-0.5 rounded border border-[#222a38]">
                        {p.method}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: COBRAR EN RECEPCIÓN (PARTICULAR) */}
      {showCollectModal && selectedBookingToCollect && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#131720] border border-[#222a38] p-5 rounded-3xl shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-white text-sm font-['Montserrat',sans-serif]">Cobrar Clase en Recepción</h3>
              <button 
                type="button"
                onClick={() => setShowCollectModal(false)}
                className="text-xs text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0e121a] border border-[#222a38] text-xs space-y-1.5">
              <p className="text-slate-300">Cliente: <strong className="text-white">{selectedBookingToCollect.clientName}</strong></p>
              <p className="text-slate-300">Bicicleta: <strong className="text-[#D4AF37]">#{selectedBookingToCollect.bikeNumber}</strong></p>
              <p className="text-slate-300">Horario: <strong className="text-white">{selectedBookingToCollect.time}</strong></p>
              <p className="text-slate-300">Tarifa Clase Individual: <strong className="text-[#D4AF37] text-sm">$10.000 COP</strong></p>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-2 font-medium">Método de Pago:</label>
              <div className="grid grid-cols-3 gap-2">
                {(['efectivo', 'nequi', 'bancolombia'] as PaymentMethod[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setCollectMethod(m)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold capitalize transition-all duration-150 active:scale-95 cursor-pointer ${
                      collectMethod === m
                        ? 'bg-gold-gradient text-black shadow-md'
                        : 'bg-[#1C222F] text-slate-300 border border-[#222a38]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCollectModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#1C222F] text-slate-300 text-xs font-bold hover:bg-[#252d3d]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmCollect}
                className="flex-1 py-2.5 rounded-xl bg-gold-gradient hover:brightness-110 text-black text-xs font-black shadow-lg"
              >
                Confirmar Cobro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: AGREGAR PAGO MANUAL / VENTA EXTRA */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form 
            onSubmit={handleAddManualPayment}
            className="w-full max-w-sm bg-[#131720] border border-[#222a38] p-5 rounded-3xl shadow-2xl space-y-3.5"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-black text-white text-sm font-['Montserrat',sans-serif]">Registrar Venta o Ingreso Extra</h3>
              <button 
                type="button"
                onClick={() => setShowAddPaymentModal(false)}
                className="text-xs text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Nombre del Alumno / Cliente:</label>
              <input
                type="text"
                required
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                placeholder="Ej. Mateo Valencia"
                className="w-full px-3 py-2 rounded-xl bg-[#0e121a] border border-[#222a38] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Concepto:</label>
                <select
                  value={newConcept}
                  onChange={(e: any) => {
                    const c = e.target.value;
                    setNewConcept(c);
                    if (c === 'mensualidad') setNewAmount(84000); // Default to Premium
                    else if (c === 'clase_particular') setNewAmount(10000);
                    else if (c === 'hidratacion') setNewAmount(4000);
                  }}
                  className="w-full px-2 py-2 rounded-xl bg-[#0e121a] border border-[#222a38] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="mensualidad">Membresía PREMIUM ($84k - 12 clases)</option>
                  <option value="mensualidad_pro">Membresía PRO ($56k - 8 clases)</option>
                  <option value="mensualidad_starter">Membresía STARTER ($28k - 4 clases)</option>
                  <option value="mensualidad_elite">Membresía ÉLITE ($120k - 18 clases)</option>
                  <option value="clase_particular">Clase Individual ($10.000)</option>
                  <option value="hidratacion">Hidratación ($4.000)</option>
                  <option value="otro">Otro concepto</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Valor (COP):</label>
                <input
                  type="number"
                  required
                  value={newAmount}
                  onChange={(e) => setNewAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#0e121a] border border-[#222a38] text-xs text-white font-mono font-bold focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Medio de Pago:</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['efectivo', 'nequi', 'bancolombia', 'tarjeta'] as PaymentMethod[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setNewMethod(m)}
                    className={`py-1.5 px-1 rounded-xl text-[10px] font-bold capitalize transition-all duration-150 active:scale-95 cursor-pointer ${
                      newMethod === m
                        ? 'bg-gold-gradient text-black'
                        : 'bg-[#1C222F] text-slate-300 border border-[#222a38]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Notas / Detalle:</label>
              <input
                type="text"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="Ej. Pagó en Nequi a nombre de Laura"
                className="w-full px-3 py-2 rounded-xl bg-[#0e121a] border border-[#222a38] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddPaymentModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#1C222F] text-slate-300 text-xs font-bold hover:bg-[#252d3d]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-gold-gradient hover:brightness-110 text-black text-xs font-black shadow-lg"
              >
                Guardar Ingreso
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: CERRAR CAJA / ARQUEO */}
      {showClosureModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#131720] border border-[#222a38] p-5 rounded-3xl shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-white text-sm font-['Montserrat',sans-serif] flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Arqueo y Cierre Definitivo</span>
              </h3>
              <button 
                type="button"
                onClick={() => setShowClosureModal(false)}
                className="text-xs text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0e121a] border border-[#222a38] text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Recaudado:</span>
                <span className="font-black text-[#D4AF37] font-mono">{formatCOP(summary.totalIncome)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Efectivo Físico a Entregar:</span>
                <span className="font-bold text-[#D4AF37] font-mono">{formatCOP(summary.totalCash)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Transferencias (Nequi/Bancolombia):</span>
                <span className="font-bold text-white font-mono">{formatCOP(summary.totalNequi + summary.totalBancolombia)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Alumnos Atendidos:</span>
                <span className="font-bold text-white">{summary.totalRiders} riders</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Observaciones del Turno:</label>
              <textarea
                value={closureNotes}
                onChange={(e) => setClosureNotes(e.target.value)}
                placeholder="Ej. Caja cuadrada 100%, se entregan $150.000 en sobre al administrador."
                rows={2}
                className="w-full px-3 py-2 rounded-xl bg-[#0e121a] border border-[#222a38] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              ></textarea>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowClosureModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#1C222F] text-slate-300 text-xs font-bold hover:bg-[#252d3d]"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={handleCloseCashRegister}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black shadow-lg"
              >
                Confirmar y Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
