import React, { useState } from 'react';
import { ArrowLeft, Search, MessageCircle, ShieldCheck, Ticket, X, Award } from 'lucide-react';
import type { ClientUser, ClientType } from '../../types';
import { BLACK_RIDE_PLANS } from '../../types';

interface Screen10ClientsListProps {
  clients: ClientUser[];
  onBack: () => void;
  onUpdateClientMembership?: (clientId: string, type: ClientType, planName?: string, expiresAt?: string) => void;
}

export const Screen10_ClientsList: React.FC<Screen10ClientsListProps> = ({ 
  clients, 
  onBack,
  onUpdateClientMembership
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'mensualidad' | 'particular'>('all');
  const [selectedClientForPlan, setSelectedClientForPlan] = useState<ClientUser | null>(null);

  const filteredClients = clients.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm);

    if (filter === 'all') return matchesSearch;
    return matchesSearch && c.clientType === filter;
  });

  const mensualidadCount = clients.filter(c => c.clientType === 'mensualidad').length;
  const particularCount = clients.filter(c => c.clientType === 'particular').length;

  const handleAssignPlan = (planId: string) => {
    if (!selectedClientForPlan || !onUpdateClientMembership) return;
    const plan = BLACK_RIDE_PLANS.find(p => p.id === planId);
    if (!plan) return;

    if (plan.id === 'individual') {
      onUpdateClientMembership(selectedClientForPlan.id, 'particular', 'CLASE INDIVIDUAL ($10.000)');
    } else {
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + plan.validityDays);
      const formattedExp = expDate.toISOString().split('T')[0];
      onUpdateClientMembership(
        selectedClientForPlan.id, 
        'mensualidad', 
        `${plan.name} (${plan.classesCount} clases • ${plan.validityText})`,
        formattedExp
      );
    }
    setSelectedClientForPlan(null);
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
              className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-[#131720] border border-[#222a38] text-slate-300 hover:text-white hover:border-[#D4AF37]/40 active:scale-95 transition-all duration-150 cursor-pointer flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-black font-['Montserrat',sans-serif] text-white tracking-tight">
                Clientes & Membresías BLACK RIDE 🐆
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Directorio oficial y asignación de planes de pedaleo
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-slate-300 bg-[#131720] px-3 py-1.5 rounded-xl border border-[#222a38] hidden sm:inline-block">
            {filteredClients.length} Riders Registrados
          </span>
        </div>

        {/* Search & Filter Bar */}
        <div className="space-y-3 mb-5">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, WhatsApp, correo..."
              className="w-full min-h-[46px] pl-10 pr-10 py-2.5 rounded-xl bg-[#131720] border border-[#222a38] focus:border-[#D4AF37] focus:outline-none text-xs sm:text-sm text-white placeholder-slate-400 transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-gold-gradient text-black shadow-md shadow-[#D4AF37]/20'
                  : 'bg-[#131720] text-slate-400 hover:text-white border border-[#222a38]'
              }`}
            >
              Todos ({clients.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('mensualidad')}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                filter === 'mensualidad'
                  ? 'bg-[#D4AF37] text-black shadow-md'
                  : 'bg-[#131720] text-[#D4AF37] hover:text-white border border-[#D4AF37]/30'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Membresías ({mensualidadCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setFilter('particular')}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                filter === 'particular'
                  ? 'bg-sky-500 text-black shadow-md'
                  : 'bg-[#131720] text-sky-400 hover:text-white border border-sky-500/30'
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Particulares ({particularCount})</span>
            </button>
          </div>
        </div>

        {/* Client Directory Grid: 1 col on mobile, 2 col on PC */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {filteredClients.map((client) => {
            const hasMembership = client.clientType === 'mensualidad';

            return (
              <div
                key={client.id}
                className="p-4 rounded-2xl bg-[#131720] border border-[#222a38] flex flex-col justify-between hover:border-[#D4AF37]/40 transition-all duration-150 group shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={client.avatar}
                      alt={client.name}
                      className="w-12 h-12 rounded-xl object-cover border border-[#222a38] group-hover:border-[#D4AF37]/50 transition-colors"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white font-['Montserrat',sans-serif]">
                          {client.name}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 block font-mono mt-0.5">
                        {client.phone}
                      </span>
                      <span className="text-[11px] text-[#D4AF37] font-semibold block mt-0.5">
                        {client.membershipPlan || (hasMembership ? 'Membresía Activa' : 'Clase Individual')}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {hasMembership 
                          ? `Vence: ${client.membershipExpiresAt || 'Vigente'} • ${client.totalRides} clases tomadas` 
                          : `${client.totalRides} clases tomadas (Particular $10.000)`}
                      </span>
                    </div>
                  </div>

                  <div>
                    {hasMembership ? (
                      <span className="text-[10px] font-bold text-[#F3E5AB] bg-[#D4AF37]/15 px-2 py-1 rounded-lg border border-[#D4AF37]/30 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        Miembro
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-sky-400 bg-sky-950/60 px-2 py-1 rounded-lg border border-sky-500/30 flex items-center gap-1">
                        <Ticket className="w-3 h-3" />
                        Individual
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Actions Bar */}
                <div className="pt-3 mt-3 border-t border-[#222a38] flex items-center justify-between gap-2">
                  <a
                    href={`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(client.name)},%20te%20escribimos%20de%20BLACK%20RIDE%20Zarzal!%20🐆`}
                    target="_blank"
                    rel="noreferrer"
                    className="min-h-[36px] px-3 py-1.5 rounded-xl bg-[#1C222F] hover:bg-emerald-600 hover:text-white text-slate-300 active:scale-95 transition-all duration-150 text-xs flex items-center gap-1.5 cursor-pointer"
                    title="Contactar por WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp</span>
                  </a>

                  {onUpdateClientMembership && (
                    <button
                      type="button"
                      onClick={() => setSelectedClientForPlan(client)}
                      className="min-h-[36px] text-xs font-bold px-3 py-1.5 rounded-xl active:scale-95 transition-all duration-150 cursor-pointer bg-[#1C222F] hover:bg-[#252d3d] border border-[#222a38] text-white hover:border-[#D4AF37]/50 flex items-center gap-1"
                    >
                      <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Cambiar Plan</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12 px-4 rounded-3xl bg-[#131720] border border-[#222a38]">
            <Search className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-white">No se encontraron clientes</p>
            <p className="text-xs text-slate-400 mt-1">Prueba con otro término de búsqueda.</p>
          </div>
        )}
      </div>

      <div className="pt-4 text-center">
        <p className="text-[11px] text-slate-400">
          Zarzal, Valle del Cauca • Base de Datos de Clientes BLACK RIDE 🐆
        </p>
      </div>

      {/* PLAN SELECTION MODAL FOR ADMIN */}
      {selectedClientForPlan && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#131720] border border-[#222a38] p-5 rounded-3xl shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#222a38]">
              <div>
                <h3 className="font-black text-white text-sm font-['Montserrat',sans-serif]">
                  Asignar Plan BLACK RIDE
                </h3>
                <span className="text-xs text-slate-400">
                  Alumno: <strong className="text-white">{selectedClientForPlan.name}</strong>
                </span>
              </div>
              <button 
                type="button"
                onClick={() => setSelectedClientForPlan(null)}
                className="text-xs text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {BLACK_RIDE_PLANS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleAssignPlan(p.id)}
                  className="w-full p-3 rounded-xl bg-[#0E121A] border border-[#222a38] hover:border-[#D4AF37] hover:bg-[#151C27] text-left transition-all duration-150 flex items-center justify-between group active:scale-98 cursor-pointer"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-white group-hover:text-[#D4AF37]">
                        {p.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {p.validityText}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {p.classesCount} clases • {p.tagline}
                    </span>
                  </div>
                  <span className="text-xs font-black text-[#D4AF37] font-mono">
                    ${(p.price / 1000).toFixed(0)}k COP
                  </span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setSelectedClientForPlan(null)}
              className="w-full py-2.5 rounded-xl bg-[#1C222F] text-slate-300 text-xs font-bold hover:bg-[#252d3d]"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
