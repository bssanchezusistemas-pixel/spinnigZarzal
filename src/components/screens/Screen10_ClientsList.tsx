import React, { useState } from 'react';
import { ArrowLeft, Search, MessageCircle } from 'lucide-react';
import type { ClientUser } from '../../types';

interface Screen10ClientsListProps {
  clients: ClientUser[];
  onBack: () => void;
}

export const Screen10_ClientsList: React.FC<Screen10ClientsListProps> = ({ clients, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredClients = clients.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm);

    if (filter === 'all') return matchesSearch;
    return matchesSearch && c.status === filter;
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
          <h1 className="text-base font-black font-['Montserrat',sans-serif] text-white tracking-tight">
            Clientes
          </h1>
          <span className="text-[10px] text-slate-400 ml-auto bg-[#131720] px-2 py-1 rounded-md border border-[#222a38]">
            {filteredClients.length} registrados
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative mb-3">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar cliente..."
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
            Todos
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filter === 'active'
                ? 'bg-[#D4FF00] text-black shadow-md shadow-[#D4FF00]/20'
                : 'bg-[#131720] text-slate-400 hover:text-white border border-[#222a38]'
            }`}
          >
            Activos
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filter === 'inactive'
                ? 'bg-[#D4FF00] text-black shadow-md shadow-[#D4FF00]/20'
                : 'bg-[#131720] text-slate-400 hover:text-white border border-[#222a38]'
            }`}
          >
            Inactivos
          </button>
        </div>

        {/* Client Directory List */}
        <div className="space-y-2.5">
          {filteredClients.map((client) => (
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
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      {client.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    {client.email}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    {client.phone}
                  </span>
                </div>
              </div>

              {/* Status pill & WhatsApp action */}
              <div className="flex flex-col items-end gap-1.5">
                <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
                  Activo
                </span>

                <a
                  href={`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(client.name)},%20te%20escribimos%20de%20Panther%20Ride%20Zarzal!`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 rounded-lg bg-[#1C222F] hover:bg-emerald-600 hover:text-white text-slate-400 transition-colors text-[10px] flex items-center gap-1 px-2"
                  title="Contactar por WhatsApp"
                >
                  <MessageCircle className="w-3 h-3 text-emerald-400" />
                  <span>Chat</span>
                </a>
              </div>
            </div>
          ))}
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
