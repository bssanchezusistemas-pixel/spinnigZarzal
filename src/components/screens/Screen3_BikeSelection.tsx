import React from 'react';
import { ArrowLeft, MonitorPlay, Bike as BikeIconType, ShieldCheck, ArrowRight } from 'lucide-react';
import type { Bike } from '../../types';
import { BikeIcon } from '../common/BikeIcon';

interface Screen3BikeSelectionProps {
  bikes: Bike[];
  selectedBikeId: number | null;
  onSelectBike: (bikeId: number) => void;
  onConfirm: () => void;
  onBack: () => void;
}

export const Screen3_BikeSelection: React.FC<Screen3BikeSelectionProps> = ({
  bikes,
  selectedBikeId,
  onSelectBike,
  onConfirm,
  onBack,
}) => {
  // Rows division matching studio layout: 4 in row 1, 4 in row 2, 4 in row 3, 2 in row 4
  const row1 = bikes.slice(0, 4);
  const row2 = bikes.slice(4, 8);
  const row3 = bikes.slice(8, 12);
  const row4 = bikes.slice(12, 14);

  const selectedBikeObj = bikes.find(b => b.id === selectedBikeId);

  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 bg-[#090B0E] overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full">
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
              <h1 className="text-lg sm:text-xl font-black font-['Montserrat',sans-serif] text-white tracking-tight">
                Selecciona tu bicicleta
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Paso 2 de 3 • Vista de sala en tiempo real
              </p>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#131720] border border-[#222a38] text-xs font-bold text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            14 Bicicletas en Sala
          </span>
        </div>

        {/* Layout: Responsive 1 col on mobile, 2 col on PC */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          {/* Left / Center: Studio Stage & Cinema Bikes */}
          <div className="lg:col-span-8 space-y-3 sm:space-y-4">
            {/* Stage / Instructor Screen Area */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#0c1424] via-[#101b30] to-[#0a0e17] border border-[#1e2e4a] p-3 text-center shadow-[inset_0_0_30px_rgba(30,58,138,0.35)]">
              {/* Spotlight aura */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-14 bg-cyan-500/20 blur-xl pointer-events-none"></div>
              
              <div className="flex flex-col items-center justify-center gap-1 relative z-10 py-1">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#D4FF00] drop-shadow-[0_0_8px_rgba(212,255,0,0.6)]">
                  PANTHER RIDE STAGE
                </span>
                <div className="px-4 py-1.5 rounded-lg bg-black/75 border border-cyan-500/40 text-[10px] font-bold text-cyan-300 tracking-widest uppercase flex items-center gap-2 shadow-sm">
                  <MonitorPlay className="w-3.5 h-3.5 text-cyan-400" />
                  <span>PANTALLA / INSTRUCTOR EN VIVO</span>
                </div>
              </div>
            </div>

            {/* Studio Bike Layout Grid (Cinema style) */}
            <div className="bg-[#0e121a]/90 rounded-2xl border border-[#222938] p-4 sm:p-6 space-y-4 shadow-xl">
              <div className="text-center text-[10px] uppercase font-bold tracking-widest text-slate-400">
                Fila 1 (Frente al Instructor)
              </div>

              {/* Row 1: Bikes 01 to 04 */}
              <div className="grid grid-cols-4 gap-2 sm:gap-4 justify-items-center">
                {row1.map((bike) => (
                  <BikeIcon
                    key={bike.id}
                    number={bike.number}
                    status={bike.id === selectedBikeId ? 'selected' : bike.status}
                    isSelected={bike.id === selectedBikeId}
                    onClick={() => onSelectBike(bike.id)}
                  />
                ))}
              </div>

              <div className="text-center text-[10px] uppercase font-bold tracking-widest text-slate-400">
                Fila 2
              </div>

              {/* Row 2: Bikes 05 to 08 */}
              <div className="grid grid-cols-4 gap-2 sm:gap-4 justify-items-center">
                {row2.map((bike) => (
                  <BikeIcon
                    key={bike.id}
                    number={bike.number}
                    status={bike.id === selectedBikeId ? 'selected' : bike.status}
                    isSelected={bike.id === selectedBikeId}
                    onClick={() => onSelectBike(bike.id)}
                  />
                ))}
              </div>

              <div className="text-center text-[10px] uppercase font-bold tracking-widest text-slate-400">
                Fila 3
              </div>

              {/* Row 3: Bikes 09 to 12 */}
              <div className="grid grid-cols-4 gap-2 sm:gap-4 justify-items-center">
                {row3.map((bike) => (
                  <BikeIcon
                    key={bike.id}
                    number={bike.number}
                    status={bike.id === selectedBikeId ? 'selected' : bike.status}
                    isSelected={bike.id === selectedBikeId}
                    onClick={() => onSelectBike(bike.id)}
                  />
                ))}
              </div>

              <div className="text-center text-[10px] uppercase font-bold tracking-widest text-slate-400">
                Fila 4 (Elevada)
              </div>

              {/* Row 4: Bikes 13 and 14 (Centered) */}
              <div className="flex justify-center gap-6 sm:gap-10">
                {row4.map((bike) => (
                  <BikeIcon
                    key={bike.id}
                    number={bike.number}
                    status={bike.id === selectedBikeId ? 'selected' : bike.status}
                    isSelected={bike.id === selectedBikeId}
                    onClick={() => onSelectBike(bike.id)}
                  />
                ))}
              </div>

              {/* Status Legends */}
              <div className="pt-3 border-t border-[#222938] flex flex-wrap items-center justify-around gap-2 text-[11px] text-slate-400 select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>Disponible</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D4FF00] shadow-[0_0_8px_#D4FF00]"></span>
                  <span className="text-white font-bold">Seleccionada</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span>Reservada</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-600"></span>
                  <span>Mantenimiento</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column / Sticky Action Card */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#131720] border border-[#222a38] space-y-4 shadow-xl">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold block">
                Tu Selección
              </span>

              {selectedBikeObj ? (
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#1C222F] to-[#0E121A] border border-[#D4FF00]/50 shadow-[0_0_20px_rgba(212,255,0,0.1)] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#D4FF00] text-black font-black text-xl flex items-center justify-center font-['Montserrat',sans-serif] shadow-md">
                      #{selectedBikeObj.number}
                    </div>
                    <div>
                      <span className="text-sm font-black text-white block">
                        Bicicleta #{selectedBikeObj.number}
                      </span>
                      <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Excelente visibilidad
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#0E121A] border border-dashed border-[#222a38] text-center text-slate-400 text-xs py-6">
                  <BikeIconType className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <span>Toca una bicicleta en la sala para seleccionarla</span>
                </div>
              )}

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-[#222a38]">
                  <span className="text-slate-400">Ubicación</span>
                  <span className="font-bold text-white">Sala Indoor Cycling</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#222a38]">
                  <span className="text-slate-400">Asiento y Pedales</span>
                  <span className="font-bold text-white">Ajuste personalizado</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Modalidad</span>
                  <span className="font-bold text-[#D4FF00]">Mensualidad o Particular</span>
                </div>
              </div>

              {/* Confirm CTA Button */}
              <button
                type="button"
                onClick={onConfirm}
                disabled={!selectedBikeId}
                className={`w-full min-h-[52px] py-3.5 px-6 rounded-2xl font-black text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-150 active:scale-95 ${
                  selectedBikeId
                    ? 'bg-[#D4FF00] hover:bg-[#c6f000] text-black shadow-[0_4px_25px_rgba(212,255,0,0.35)] hover:shadow-[0_4px_30px_rgba(212,255,0,0.5)] cursor-pointer'
                    : 'bg-[#1C222F] text-slate-500 cursor-not-allowed border border-[#222938]'
                }`}
              >
                <span>
                  {selectedBikeObj 
                    ? `Confirmar bicicleta #${selectedBikeObj.number}` 
                    : 'Elige una bicicleta'}
                </span>
                {selectedBikeId && <ArrowRight className="w-4 h-4 stroke-[3]" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
