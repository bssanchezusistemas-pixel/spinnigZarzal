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
    if (newConcept === 'mensualidad') conceptLabel = 'Mensualidad Ilimitada Panther';
    else if (newConcept === 'clase_particular') conceptLabel = 'Clase individual particular';
    else if (newConcept === 'hidratacion') conceptLabel = 'Bebidas e Hidratación';

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
    const text = `🚴 *PANTHER RIDE - CIERRE DE CAJA OFICIAL*
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
• Con Mensualidad: ${summary.ridersWithMembership} ($0 en entrada)
• Particulares: ${summary.ridersParticular} ($15.000 c/u)
• Ocupación de Sala: ${summary.occupancyPercent}% (14 bicis)

🚴 *LISTA DE ASISTENCIA:*
${summary.reservations.map(r => `• Bici #${r.bikeNumber} - ${r.clientName} (${r.clientType.toUpperCase()} - ${r.paymentStatus === 'paid' ? 'PAGADO' : r.paymentStatus === 'included_in_membership' ? 'MENSUALIDAD' : 'PENDIENTE'})`).join('\n')}

🔒 *Estado:* Caja Cuadrada y Archivada.`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div id="cierre-caja-scroll" className="flex-1 min-h-0 flex flex-col justify-between p-4 bg-[#090B0E] overflow-y-auto">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBack}
              className="p-1.5 rounded-full bg-[#131720] border border-[#222a38] text-slate-300 hover:text-white cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-base font-black font-['Montserrat',sans-serif] text-white tracking-tight">
                Cierre de Caja & Finanzas
              </h1>
              <span className="text-[10px] text-slate-400">Panther Ride • Zarzal</span>
            </div>
          </div>

          {/* Date Selector Badge */}
          <div className="flex items-center gap-1.5 bg-[#131720] border border-[#222a38] px-2.5 py-1 rounded-xl">
            <Calendar className="w-3.5 h-3.5 text-[#D4FF00]" />
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
        </div>

        {/* Box State Pill */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#131720] border border-[#222a38] mb-3">
          <div className="flex items-center gap-2">
            {isBoxClosed ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-500/30">
                <Lock className="w-3 h-3" /> Caja Cerrada
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-500/30">
                <Unlock className="w-3 h-3" /> Caja Abierta (Turno Activo)
              </span>
            )}
            <span className="text-[10px] text-slate-400">Recepción Sede Zarzal</span>
          </div>

          <button
            onClick={() => setShowAddPaymentModal(true)}
            className="flex items-center gap-1 text-[11px] font-bold text-black bg-[#D4FF00] hover:bg-[#c4ed00] px-2.5 py-1 rounded-lg transition-all cursor-pointer shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Venta Extra</span>
          </button>
        </div>

        {/* Hero Revenue Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#151c27] via-[#10141d] to-[#0d1017] border border-[#222a38] shadow-xl relative overflow-hidden mb-3">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4FF00]/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-medium uppercase tracking-wider text-[10px]">Total Vendido / Ingresos del Día</span>
            <span className="text-[#D4FF00] font-mono text-[10px] bg-black/40 px-2 py-0.5 rounded-md border border-[#D4FF00]/30 font-bold">
              EN VIVO
            </span>
          </div>

          <div className="text-2xl font-black text-white font-['Montserrat',sans-serif] tracking-tight text-[#D4FF00] drop-shadow-[0_0_12px_rgba(212,255,0,0.3)]">
            {formatCOP(summary.totalIncome)}
          </div>

          {/* Breakdown Mini Cards */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#222a38]/80">
            <div className="p-2 rounded-xl bg-black/40 border border-emerald-500/20">
              <span className="text-[9px] text-slate-400 block font-medium">💵 Efectivo</span>
              <span className="text-xs font-bold text-emerald-400">
                {formatCOP(summary.totalCash)}
              </span>
            </div>

            <div className="p-2 rounded-xl bg-black/40 border border-purple-500/20">
              <span className="text-[9px] text-slate-400 block font-medium">📱 Nequi</span>
              <span className="text-xs font-bold text-purple-300">
                {formatCOP(summary.totalNequi)}
              </span>
            </div>

            <div className="p-2 rounded-xl bg-black/40 border border-sky-500/20">
              <span className="text-[9px] text-slate-400 block font-medium">🏦 Bancolombia</span>
              <span className="text-xs font-bold text-sky-300">
                {formatCOP(summary.totalBancolombia)}
              </span>
            </div>
          </div>

          {/* Pending alert if any */}
          {summary.totalPending > 0 && (
            <div className="mt-2.5 p-2 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-rose-300 text-[11px]">
                <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>Pendiente por cobrar en puerta:</span>
              </div>
              <span className="font-bold text-rose-400">{formatCOP(summary.totalPending)}</span>
            </div>
          )}
        </div>

        {/* Attendance Breakdown (Mensualidades vs Particulares) */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {/* Mensualidades */}
          <div className="p-3 rounded-2xl bg-[#131720] border border-[#222a38]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Mensualidades</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-white">{summary.ridersWithMembership}</span>
              <span className="text-[10px] text-emerald-400 font-bold">Riders ($0 en sala)</span>
            </div>
            <p className="text-[9px] text-slate-400 mt-0.5">Tienen plan mensual activo</p>
          </div>

          {/* Particulares / Solo el día */}
          <div className="p-3 rounded-2xl bg-[#131720] border border-[#222a38]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Particulares</span>
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-white">{summary.ridersParticular}</span>
              <span className="text-[10px] text-sky-400 font-bold">Por el día</span>
            </div>
            <p className="text-[9px] text-slate-400 mt-0.5">Tarifa: $15.000 / clase</p>
          </div>
        </div>

        {/* Section: Who Booked? (Reservas y Asistencia de la fecha) */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#D4FF00]" />
              <span>¿Quién Reservó? ({summary.reservations.length} alumnos)</span>
            </h2>
            <span className="text-[10px] text-slate-400">Sala 14 cupos</span>
          </div>

          <div className="space-y-2">
            {summary.reservations.length > 0 ? (
              summary.reservations.map((res) => (
                <div
                  key={res.id}
                  className="p-3 rounded-2xl bg-[#131720] border border-[#222a38] flex items-center justify-between hover:border-[#D4FF00]/40 transition-all"
                >
                  <div className="flex items-center gap-3">
                    {/* Bike Number Badge */}
                    <div className="w-9 h-9 rounded-xl bg-black/60 border border-[#222a38] flex flex-col items-center justify-center shrink-0">
                      <span className="text-[8px] text-slate-400 uppercase leading-none">Bici</span>
                      <span className="text-xs font-black text-[#D4FF00] font-mono leading-none mt-0.5">
                        #{res.bikeNumber}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">
                          {res.clientName}
                        </span>
                        {/* Membership Type Pill */}
                        {res.clientType === 'mensualidad' ? (
                          <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/30">
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
                        <span>{res.clientPhone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Status & Action */}
                  <div className="flex flex-col items-end gap-1">
                    {res.paymentStatus === 'included_in_membership' && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        Cubierto ($0)
                      </span>
                    )}

                    {res.paymentStatus === 'paid' && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {formatCOP(res.amountPaid)}
                      </span>
                    )}

                    {res.paymentStatus === 'pending' && (
                      <button
                        onClick={() => handleOpenCollect(res)}
                        className="text-[10px] font-bold text-black bg-[#D4FF00] hover:bg-[#c4ed00] px-2.5 py-1 rounded-md transition-all cursor-pointer shadow-sm animate-pulse"
                      >
                        Cobrar $15.000
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-2xl bg-[#131720] border border-[#222a38] text-center text-xs text-slate-400">
                No hay reservas registradas para esta fecha.
              </div>
            )}
          </div>
        </div>

        {/* Section: Payments & Register Breakdown */}
        <div className="mb-4">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Detalle de Movimientos de Caja ({summary.payments.length})</span>
          </h2>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {summary.payments.map((p) => (
              <div
                key={p.id}
                className="p-2.5 rounded-xl bg-[#131720] border border-[#222a38] flex items-center justify-between text-xs"
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
                  <span className="font-extrabold text-[#D4FF00] block">
                    {formatCOP(p.amount)}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-slate-400 bg-black/50 px-1.5 py-0.2 rounded border border-[#222a38]">
                    {p.method}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div className="pt-2 border-t border-[#222a38] space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {/* Send via WhatsApp */}
          <button
            onClick={generateWhatsAppReport}
            className="py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Reporte WhatsApp</span>
          </button>

          {/* Close Cash Register */}
          <button
            onClick={() => setShowClosureModal(true)}
            className="py-3 px-3 rounded-xl bg-[#1C222F] hover:bg-[#252d3d] border border-[#222a38] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Lock className="w-4 h-4 text-amber-400" />
            <span>{isBoxClosed ? 'Ver Cierre Realizado' : 'Cerrar Caja'}</span>
          </button>
        </div>
      </div>

      {/* MODAL 1: COBRAR EN RECEPCIÓN (PARTICULAR) */}
      {showCollectModal && selectedBookingToCollect && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#131720] border border-[#222a38] p-5 rounded-3xl shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-white text-sm">Cobrar Clase en Recepción</h3>
              <button 
                onClick={() => setShowCollectModal(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[#0e121a] border border-[#222a38] text-xs space-y-1">
              <p className="text-slate-300">Cliente: <strong className="text-white">{selectedBookingToCollect.clientName}</strong></p>
              <p className="text-slate-300">Bicicleta: <strong className="text-[#D4FF00]">#{selectedBookingToCollect.bikeNumber}</strong></p>
              <p className="text-slate-300">Hora: <strong className="text-white">{selectedBookingToCollect.time}</strong></p>
              <p className="text-slate-300">Monto: <strong className="text-emerald-400 text-sm">$15.000 COP</strong></p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-2 block">
                Selecciona medio de pago:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['efectivo', 'nequi', 'bancolombia'] as PaymentMethod[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setCollectMethod(m)}
                    className={`py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                      collectMethod === m
                        ? 'bg-[#D4FF00] text-black shadow-md'
                        : 'bg-[#1C222F] text-slate-300 hover:bg-[#252d3d]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setShowCollectModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#1C222F] text-slate-300 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmCollect}
                className="flex-1 py-2.5 rounded-xl bg-[#D4FF00] text-black text-xs font-extrabold"
              >
                Confirmar Cobro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: REGISTRAR VENTA / PAGO EXTRA (MENSUALIDAD O PRODUCTO) */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form 
            onSubmit={handleAddManualPayment}
            className="w-full max-w-sm bg-[#131720] border border-[#222a38] p-5 rounded-3xl shadow-2xl space-y-3"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-white text-sm">Registrar Pago / Venta Extra</h3>
              <button 
                type="button"
                onClick={() => setShowAddPaymentModal(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Nombre del Alumno / Cliente:</label>
              <input
                type="text"
                required
                placeholder="Ej. Valentina Gómez"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0e121a] border border-[#222a38] text-xs text-white focus:outline-none focus:border-[#D4FF00]"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Concepto:</label>
              <select
                value={newConcept}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setNewConcept(val);
                  if (val === 'mensualidad') setNewAmount(120000);
                  else if (val === 'clase_particular') setNewAmount(15000);
                  else if (val === 'hidratacion') setNewAmount(5000);
                }}
                className="w-full px-3 py-2 rounded-xl bg-[#0e121a] border border-[#222a38] text-xs text-white focus:outline-none focus:border-[#D4FF00]"
              >
                <option value="mensualidad">Mensualidad Ilimitada ($120.000 COP)</option>
                <option value="clase_particular">Clase Particular ($15.000 COP)</option>
                <option value="hidratacion">Hidratación / Bebidas</option>
                <option value="otro">Otro Concepto</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Monto ($ COP):</label>
                <input
                  type="number"
                  required
                  min="1000"
                  step="1000"
                  value={newAmount}
                  onChange={(e) => setNewAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#0e121a] border border-[#222a38] text-xs text-white focus:outline-none focus:border-[#D4FF00]"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Medio de Pago:</label>
                <select
                  value={newMethod}
                  onChange={(e) => setNewMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0e121a] border border-[#222a38] text-xs text-white focus:outline-none focus:border-[#D4FF00]"
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="nequi">Nequi</option>
                  <option value="bancolombia">Bancolombia</option>
                  <option value="tarjeta">Tarjeta</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Observaciones / Teléfono:</label>
              <input
                type="text"
                placeholder="Ej. Cel: 310 123 4567 • Comprobante #1234"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0e121a] border border-[#222a38] text-xs text-white focus:outline-none focus:border-[#D4FF00]"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setShowAddPaymentModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#1C222F] text-slate-300 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#D4FF00] text-black text-xs font-extrabold"
              >
                Guardar Pago
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: CONFIRMAR CIERRE DE CAJA */}
      {showClosureModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#131720] border border-[#222a38] p-5 rounded-3xl shadow-2xl space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-white text-sm">Cierre de Caja del Día</h3>
              <button 
                type="button"
                onClick={() => setShowClosureModal(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-[#0e121a] border border-[#222a38] text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Total en Efectivo (Caja):</span>
                <strong className="text-emerald-400">{formatCOP(summary.totalCash)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total en Nequi / Bancolombia:</span>
                <strong className="text-sky-300">{formatCOP(summary.totalNequi + summary.totalBancolombia)}</strong>
              </div>
              <div className="flex justify-between border-t border-[#222a38] pt-1">
                <span className="text-white font-bold">Total General del Día:</span>
                <strong className="text-[#D4FF00] text-sm">{formatCOP(summary.totalIncome)}</strong>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Notas de Cierre / Arqueo:</label>
              <textarea
                rows={2}
                placeholder="Ej. Cuadrado con el dinero en efectivo de recepción..."
                value={closureNotes}
                onChange={(e) => setClosureNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0e121a] border border-[#222a38] text-xs text-white focus:outline-none focus:border-[#D4FF00]"
              ></textarea>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setShowClosureModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#1C222F] text-slate-300 text-xs font-bold"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={handleCloseCashRegister}
                className="flex-1 py-2.5 rounded-xl bg-[#D4FF00] text-black text-xs font-extrabold"
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
