import React, { useState } from 'react';
import { ArrowLeft, Search, MessageCircle, ShieldCheck, Ticket } from 'lucide-react';
import type { ClientUser, ClientType } from '../../types';

interface Screen10ClientsListProps {
  clients: ClientUser[];
  onBack: () => void;
  onUpdateClientMembership?: (clientId: string, type: ClientType) => void;
}

export const Screen10_ClientsList: React.FC<Screen10ClientsListProps> = ({ 
  clients, 
  onBack,
  onUpdateClientMembership
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'mensualidad' | 'particular'>('all');

  const filteredClients = clients.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm);

    if (filter === 'all') return matchesSearch;
    return matchesSearch && c.clientType === filter;
  });

  return (
    <div className="flex-1 flex flex-col justify-between p-4 bg-[#090B0E] overflow-y-auto">
      <div>
        {/* Top Header */}
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full bg-[#131720] border border-[#222a38] text-slate-300 hover:text-white cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-base font-black font-['Montserrat',sans-serif] text-white tracking-tight">
              Clientes & Membresías
            </h1>
            <span className="text-[10px] text-slate-400">Directorio Oficial Panther Ride</span>
          </div>
          <span className="text-[10px] text-slate-400 ml-auto bg-[#131720] px-2 py-1 rounded-md border border-[#222a38]">
            {filteredClients.length} riders
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative mb-3">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, celular..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#131720] border border-[#222a38] focus:border-[#D4FF00] focus:outline-none text-xs text-white placeholder-slate-400 transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-[#D4FF00] text-black shadow-md shadow-[#D4FF00]/20'
                : 'bg-[#131720] text-slate-400 hover:text-white border border-[#222a38]'
            }`}
          >
            Todos ({clients.length})
          </button>
          <button
            onClick={() => setFilter('mensualidad')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              filter === 'mensualidad'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'bg-[#131720] text-emerald-400 hover:text-white border border-emerald-500/30'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Mensualidades</span>
          </button>
          <button
            onClick={() => setFilter('particular')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              filter === 'particular'
                ? 'bg-sky-500 text-black shadow-md'
                : 'bg-[#131720] text-sky-400 hover:text-white border border-sky-500/30'
            }`}
          >
            <Ticket className="w-3 h-3" />
            <span>Particulares</span>
          </button>
        </div>

        {/* Client Directory List */}
        <div className="space-y-2.5">
          {filteredClients.map((client) => {
            const hasMembership = client.clientType === 'mensualidad';

            return (
              <div
                key={client.id}
                className="p-3 rounded-2xl bg-[#131720] border border-[#222a38] flex items-center justify-between hover:border-[#D4FF00]/40 transition-all group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={client.avatar}
                    alt={client.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#222a38] group-hover:border-[#D4FF00]/50 transition-colors"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">
                        {client.name}
                      </span>
                      {hasMembership ? (
                        <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/30">
                          Mensualidad
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold text-sky-400 bg-sky-950/60 px-1.5 py-0.2 rounded border border-sky-500/30">
                          Particular
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {client.phone}
                    </span>
                    <span className="text-[9px] text-slate-400 block">
                      {hasMembership 
                        ? `Vence: ${client.membershipExpiresAt || 'Activa'}` 
                        : `${client.totalRides} clases tomadas`}
                    </span>
                  </div>
                </div>

                {/* Actions: Toggle Membership & WhatsApp */}
                <div className="flex flex-col items-end gap-1.5">
                  <a
                    href={`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(client.name)},%20te%20escribimos%20de%20Panther%20Ride%20Zarzal!`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 rounded-lg bg-[#1C222F] hover:bg-emerald-600 hover:text-white text-slate-400 transition-colors text-[10px] flex items-center gap-1 px-2 cursor-pointer"
                    title="Contactar por WhatsApp"
                  >
                    <MessageCircle className="w-3 h-3 text-emerald-400" />
                    <span>WhatsApp</span>
                  </a>

                  {onUpdateClientMembership && (
                    <button
                      onClick={() => onUpdateClientMembership(client.id, hasMembership ? 'particular' : 'mensualidad')}
                      className={`text-[9px] font-semibold px-2 py-0.5 rounded transition-all cursor-pointer ${
                        hasMembership
                          ? 'text-slate-400 bg-black/40 hover:text-rose-400'
                          : 'text-[#D4FF00] bg-[#D4FF00]/10 hover:bg-[#D4FF00]/20'
                      }`}
                    >
                      {hasMembership ? 'Cambiar a Particular' : '+ Asignar Mensualidad'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-3">
        <p className="text-[10px] text-center text-slate-400">
          Zarzal, Valle • Base de Datos de Clientes Panther Ride
        </p>
      </div>
    </div>
  );
};
