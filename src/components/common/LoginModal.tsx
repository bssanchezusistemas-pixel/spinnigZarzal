import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Ticket, 
  Phone, 
  Sparkles, 
  ArrowRight, 
  AlertCircle, 
  UserPlus, 
  CheckCircle2,
  Lock,
  LogOut
} from 'lucide-react';
import { db } from '../../services/db';
import type { ClientUser } from '../../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: ClientUser | null;
  onLoginSuccess: (user: ClientUser) => void;
  onLogout: () => void;
  onViewPlans?: () => void;
  onContinueBooking?: (user: ClientUser) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
  onViewPlans,
  onContinueBooking,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [verifiedClient, setVerifiedClient] = useState<ClientUser | null>(currentUser);
  const [hasSearched, setHasSearched] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerName, setRegisterName] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');

  if (!isOpen) return null;

  const quickDemoRiders = [
    { name: 'Laura Gómez', phone: '3001234567', label: 'Laura (Membresía Premium)', hasMem: true },
    { name: 'Valentina Rojas', phone: '3001112233', label: 'Valentina (Membresía Pro)', hasMem: true },
    { name: 'Diego López', phone: '3206543210', label: 'Diego (Particular)', hasMem: false },
    { name: 'Camila Torres', phone: '3104567890', label: 'Camila (Particular)', hasMem: false },
  ];

  const handleSearch = (query: string) => {
    const term = query.trim();
    if (!term) {
      setVerifiedClient(null);
      setHasSearched(false);
      return;
    }

    const found = db.findClientByPhoneOrEmail(term);
    setVerifiedClient(found || null);
    setHasSearched(true);
  };

  const handleSelectQuickRider = (phone: string) => {
    setSearchInput(phone);
    handleSearch(phone);
  };

  const handleConfirmLogin = (client: ClientUser) => {
    db.setCurrentUser(client);
    onLoginSuccess(client);
    if (onContinueBooking) {
      onContinueBooking(client);
    } else {
      onClose();
    }
  };

  const handleRegisterNewRider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerName.trim() || !registerPhone.trim()) return;

    const newClient = db.addClient({
      name: registerName.trim(),
      phone: registerPhone.trim().startsWith('+57') ? registerPhone.trim() : `+57 ${registerPhone.trim()}`,
      email: `${registerName.trim().toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      status: 'active',
      clientType: 'particular',
      membershipStatus: 'none',
      membershipPlan: 'CLASE INDIVIDUAL ($10.000)',
    });

    handleConfirmLogin(newClient);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-gradient-to-b from-[#131720] via-[#0E121A] to-[#131720] border border-[#222a38] rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden text-slate-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Neon accent top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4FF00] to-transparent"></div>

        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#222a38]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-black/60 border border-[#D4FF00]/40 flex items-center justify-center text-[#D4FF00]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black font-['Montserrat',sans-serif] text-white tracking-tight flex items-center gap-1.5">
                <span>Acceso de Alumno</span>
                <span className="text-[10px] font-bold text-[#D4FF00] bg-[#D4FF00]/10 px-2 py-0.2 rounded-full border border-[#D4FF00]/30">
                  BLACK RIDE
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Verifica tu estado y membresía en la base de datos
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            aria-label="Cerrar modal"
            className="w-8 h-8 rounded-full bg-[#1C222F] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Logged in Banner if active */}
        {currentUser && !verifiedClient && (
          <div className="p-3 rounded-2xl bg-[#1C222F]/80 border border-[#222a38] mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-9 h-9 rounded-xl object-cover border border-[#D4FF00]/40"
              />
              <div>
                <span className="text-xs font-bold text-white block">{currentUser.name}</span>
                <span className="text-[10px] text-[#D4FF00] font-semibold">
                  {currentUser.clientType === 'mensualidad' ? '✓ Membresía Activa' : 'Particular ($10.000)'}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onLogout();
                setVerifiedClient(null);
                setHasSearched(false);
              }}
              className="text-[11px] text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/40 border border-rose-500/30 cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span>Salir</span>
            </button>
          </div>
        )}

        {!isRegistering ? (
          <div className="space-y-4">
            {/* Search Input Box */}
            <div>
              <label className="text-[11px] text-slate-300 font-bold block mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#D4FF00]" />
                <span>Ingresa tu Celular / WhatsApp o Email</span>
              </label>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  placeholder="Ej: 300 123 4567 o laura@gmail.com"
                  className="w-full min-h-[46px] pl-10 pr-4 py-2.5 rounded-xl bg-[#0E121A] border border-[#222a38] focus:border-[#D4FF00] focus:outline-none text-xs sm:text-sm text-white placeholder-slate-500 transition-colors"
                  autoFocus
                />
              </div>
            </div>

            {/* Quick Demo Selector Chips */}
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-1.5">
                O prueba con un rider de demostración:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {quickDemoRiders.map((r) => (
                  <button
                    key={r.phone}
                    type="button"
                    onClick={() => handleSelectQuickRider(r.phone)}
                    className={`p-2 rounded-xl border text-left text-[11px] font-bold transition-all active:scale-95 cursor-pointer flex items-center justify-between ${
                      searchInput.includes(r.phone)
                        ? 'bg-[#D4FF00] text-black border-[#D4FF00] shadow-md shadow-[#D4FF00]/20'
                        : 'bg-[#0E121A] border-[#222a38] text-slate-300 hover:border-[#D4FF00]/40'
                    }`}
                  >
                    <span className="truncate">{r.label}</span>
                    {r.hasMem ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 ml-1 shrink-0"></span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-sky-400 ml-1 shrink-0"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Verification Result Card */}
            {hasSearched && verifiedClient && (
              <div className={`p-4 rounded-2xl border transition-all animate-in zoom-in-95 duration-200 ${
                verifiedClient.clientType === 'mensualidad' && verifiedClient.membershipStatus === 'active'
                  ? 'bg-gradient-to-br from-emerald-950/70 via-[#101924] to-emerald-950/70 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                  : 'bg-gradient-to-br from-sky-950/70 via-[#101924] to-[#121620] border-sky-500/60 shadow-[0_0_20px_rgba(56,189,248,0.15)]'
              }`}>
                {/* User Header */}
                <div className="flex items-start justify-between pb-3 border-b border-white/10 gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={verifiedClient.avatar} 
                      alt={verifiedClient.name} 
                      className="w-12 h-12 rounded-xl object-cover border-2 border-white/20"
                    />
                    <div>
                      <span className="text-sm font-black text-white font-['Montserrat',sans-serif] block">
                        {verifiedClient.name}
                      </span>
                      <span className="text-xs text-slate-300 font-mono">
                        {verifiedClient.phone}
                      </span>
                    </div>
                  </div>

                  {verifiedClient.clientType === 'mensualidad' && verifiedClient.membershipStatus === 'active' ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-black text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Con Membresía</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-sky-500 text-black text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                      <Ticket className="w-3.5 h-3.5" />
                      <span>Particular</span>
                    </span>
                  )}
                </div>

                {/* Status Details */}
                <div className="py-3 space-y-2 text-xs">
                  {verifiedClient.clientType === 'mensualidad' && verifiedClient.membershipStatus === 'active' ? (
                    <>
                      <div className="flex items-center justify-between text-slate-200">
                        <span className="text-slate-400">Plan de Membresía:</span>
                        <strong className="text-emerald-400 font-bold">{verifiedClient.membershipPlan || 'Plan Activo'}</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-200">
                        <span className="text-slate-400">Vigencia hasta:</span>
                        <span className="text-white font-mono font-semibold">{verifiedClient.membershipExpiresAt || 'Vigente'}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-200">
                        <span className="text-slate-400">Costo de reserva:</span>
                        <strong className="text-emerald-400 text-sm font-mono">$0 COP (Cubierto)</strong>
                      </div>

                      <div className="p-2.5 rounded-xl bg-black/50 border border-emerald-500/30 text-[11px] text-emerald-300 mt-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#D4FF00] shrink-0" />
                        <span><strong>Beneficio BLACK RIDE activo:</strong> Puedes elegir tu bicicleta favorita (#01 a #14) en sala.</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between text-slate-200">
                        <span className="text-slate-400">Modalidad de cuenta:</span>
                        <strong className="text-sky-300 font-bold">Clase Individual (Drop-in)</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-200">
                        <span className="text-slate-400">Tarifa por sesión:</span>
                        <strong className="text-white text-sm font-mono">$10.000 COP</strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/50 border border-sky-500/30 text-[11px] text-slate-300 mt-2 space-y-1">
                        <p className="text-sky-300">
                          ℹ️ No tienes membresía activa en este momento. Se te asignará una bicicleta entre las disponibles en sala.
                        </p>
                        <p className="text-slate-400 text-[10px]">
                          Puedes adquirir un plan (STARTER $28k, PRO $56k, PREMIUM $84k, ÉLITE $120k) para clases desde $6.666 COP.
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => handleConfirmLogin(verifiedClient)}
                    className="w-full min-h-[46px] py-3 px-4 rounded-xl bg-[#D4FF00] hover:bg-[#c6f000] text-black font-black text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(212,255,0,0.3)] active:scale-95 transition-all duration-150 cursor-pointer"
                  >
                    <span>
                      {verifiedClient.clientType === 'mensualidad'
                        ? 'Continuar a Reservar Bici ($0 COP)'
                        : 'Continuar como Particular ($10.000 COP)'}
                    </span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </button>

                  {verifiedClient.clientType === 'particular' && onViewPlans && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onViewPlans();
                      }}
                      className="w-full py-2 text-center text-xs text-[#D4FF00] hover:underline font-bold cursor-pointer"
                    >
                      Ver Planes y Adquirir Membresía →
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Not Found State -> Register new rider */}
            {hasSearched && !verifiedClient && (
              <div className="p-4 rounded-2xl bg-[#0E121A] border border-[#222a38] text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                <div>
                  <span className="text-xs font-bold text-white block">
                    No encontramos un rider registrado con este dato
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    ¿Es tu primera vez en BLACK RIDE? Regístrate en 5 segundos.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(true);
                    setRegisterPhone(searchInput.replace(/[^0-9]/g, ''));
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1C222F] hover:bg-[#252d3d] border border-[#D4FF00]/40 text-[#D4FF00] font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Registrarme como Nuevo Rider</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Quick Registration Form */
          <form onSubmit={handleRegisterNewRider} className="space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#222a38]">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-[#D4FF00]" />
                <span>Registro de Nuevo Rider</span>
              </span>
              <button
                type="button"
                onClick={() => setIsRegistering(false)}
                className="text-[11px] text-slate-400 hover:text-white"
              >
                Volver a buscar
              </button>
            </div>

            <div>
              <label className="text-[11px] text-slate-300 font-semibold block mb-1">Nombre completo:</label>
              <input
                type="text"
                required
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                placeholder="Ej. Juan Pérez"
                className="w-full px-3 py-2 rounded-xl bg-[#0E121A] border border-[#222a38] text-xs text-white focus:outline-none focus:border-[#D4FF00]"
                autoFocus
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-300 font-semibold block mb-1">Celular / WhatsApp:</label>
              <input
                type="text"
                required
                value={registerPhone}
                onChange={(e) => setRegisterPhone(e.target.value)}
                placeholder="Ej. 315 000 0000"
                className="w-full px-3 py-2 rounded-xl bg-[#0E121A] border border-[#222a38] text-xs text-white focus:outline-none focus:border-[#D4FF00]"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#0E121A] border border-[#222a38] text-[11px] text-slate-400">
              <p>
                ✓ Quedarás registrado en la base de datos de BLACK RIDE Zarzal como <strong>Particular ($10.000 COP)</strong>.
              </p>
              <p className="mt-1 text-slate-400">
                Podrás adquirir una membresía en cualquier momento para activar el beneficio de bicicleta favorita.
              </p>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setIsRegistering(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#1C222F] text-slate-300 text-xs font-bold hover:bg-[#252d3d]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#D4FF00] hover:bg-[#c6f000] text-black text-xs font-black shadow-lg"
              >
                Registrarme y Entrar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
