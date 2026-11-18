import React, { useState } from 'react';
import { ShieldAlert, Lock, Eye, EyeOff, ChevronRight, X, AlertCircle } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

// Master Admin Passwords accepted for Black Ride Zarzal
const VALID_ADMIN_KEYS = ['blackride2026', '1234', 'admin', 'zarzal2026'];

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const cleanInput = password.trim();

    // Check custom password saved in localStorage or standard master keys
    const customKey = localStorage.getItem('black_ride_admin_master_pin');
    const isMasterValid = VALID_ADMIN_KEYS.includes(cleanInput.toLowerCase()) || (customKey && cleanInput === customKey);

    setTimeout(() => {
      setIsSubmitting(false);
      if (isMasterValid) {
        sessionStorage.setItem('black_ride_admin_auth', 'true');
        setPassword('');
        setError(null);
        onLoginSuccess();
      } else {
        setError('Clave de administrador incorrecta. Acceso restringido exclusivamente al personal de BLACK RIDE.');
      }
    }, 250);
  };

  const handleClose = () => {
    setPassword('');
    setError(null);
    onClose();
  };

  return (
    <div 
      role="dialog" 
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div 
        className="relative w-full max-w-sm rounded-3xl bg-[#090B0E] border border-[#D4AF37]/40 shadow-[0_0_50px_rgba(212,175,55,0.2)] p-6 text-slate-100 flex flex-col gap-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Top Gold Highlight */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Cerrar ventana"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#131720] border border-[#222a38] text-slate-400 hover:text-white hover:border-[#D4AF37]/40 flex items-center justify-center active:scale-95 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon & Title */}
        <div className="flex flex-col items-center text-center pt-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1C222F] to-[#131720] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.25)] mb-3">
            <ShieldAlert className="w-7 h-7 stroke-[2.2]" />
          </div>

          <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 mb-1.5">
            Área Exclusiva
          </span>

          <h2 className="text-lg font-black font-['Montserrat',sans-serif] text-white tracking-tight">
            Acceso Administrativo
          </h2>

          <p className="text-xs text-slate-400 mt-1 max-w-[260px] leading-relaxed">
            Panel restringido para administración de caja, 14 bicicletas, clases y membresías.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 mt-1">
          <div>
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Clave Maestra del Studio
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#D4AF37]">
                <Lock className="w-4 h-4" />
              </div>

              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                autoFocus
                placeholder="Ingresa clave o PIN admin"
                className="w-full pl-10 pr-11 py-3 rounded-xl bg-[#131720] border border-[#222a38] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-white text-sm placeholder:text-slate-500 outline-none transition-all"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={showPassword ? 'Ocultar clave' : 'Mostrar clave'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/50 flex items-start gap-2 text-left animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span className="text-[11px] text-red-200 leading-tight">
                {error}
              </span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!password || isSubmitting}
            className="w-full min-h-[46px] py-3 px-4 rounded-xl bg-gold-gradient hover:brightness-110 disabled:opacity-50 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(212,175,55,0.35)] active:scale-95 transition-all cursor-pointer"
          >
            <span>{isSubmitting ? 'Verificando...' : 'Ingresar al Panel'}</span>
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>

          {/* Cancel button */}
          <button
            type="button"
            onClick={handleClose}
            className="w-full py-2 text-center text-xs text-slate-400 hover:text-white font-medium transition-colors cursor-pointer"
          >
            Volver al Studio (Clientes)
          </button>
        </form>

        {/* Footer Lock Hint */}
        <div className="pt-2 border-t border-[#222a38]/60 text-center">
          <span className="text-[10px] text-slate-500 font-medium">
            🔒 Los clientes no pueden ver ni acceder a esta sección.
          </span>
        </div>
      </div>
    </div>
  );
};
