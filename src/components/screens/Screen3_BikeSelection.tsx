import React from 'react';
import { ArrowLeft, MonitorPlay } from 'lucide-react';
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
    <div className="flex-1 flex flex-col justify-between p-4 pb-8 bg-[#090B0E] overflow-y-auto">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full bg-[#131720] border border-[#222a38] text-slate-300 hover:text-white cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-base font-black font-['Montserrat',sans-serif] text-white tracking-tight">
            Selecciona tu bicicleta
          </h1>
        </div>
        <p className="text-[11px] text-slate-400 pl-8 leading-tight">
          Elige la bici que prefieras. Cada número representa una bicicleta de la sala.
        </p>

        {/* Stage / Instructor Screen Area */}
        <div className="mt-4 mb-3 relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#0c1424] via-[#101b30] to-[#0a0e17] border border-[#1e2e4a] p-3 text-center shadow-[inset_0_0_25px_rgba(30,58,138,0.3)]">
          {/* Spotlight aura */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-12 bg-cyan-500/20 blur-xl"></div>
          
          {/* Small studio simulation graphics */}
          <div className="flex flex-col items-center justify-center gap-1 relative z-10 py-1">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#D4FF00] drop-shadow-[0_0_8px_rgba(212,255,0,0.6)]">
              PANTHER RIDE
            </span>
            <div className="px-4 py-1 rounded-md bg-black/70 border border-cyan-500/40 text-[9px] font-bold text-cyan-300 tracking-widest uppercase flex items-center gap-1.5 shadow-sm">
              <MonitorPlay className="w-3 h-3 text-cyan-400" />
              <span>PANTALLA / INSTRUCTOR</span>
            </div>
          </div>
        </div>

        {/* Studio Bike Layout Grid (Cinema style) */}
        <div className="bg-[#0e121a]/80 rounded-2xl border border-[#222938]/60 p-3 pt-4 space-y-3 shadow-inner">
          {/* Row 1: Bikes 01 to 04 */}
          <div className="grid grid-cols-4 gap-2 justify-items-center">
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

          {/* Row 2: Bikes 05 to 08 */}
          <div className="grid grid-cols-4 gap-2 justify-items-center">
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

          {/* Row 3: Bikes 09 to 12 */}
          <div className="grid grid-cols-4 gap-2 justify-items-center">
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

          {/* Row 4: Bikes 13 and 14 (Centered) */}
          <div className="flex justify-center gap-6">
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
          <div className="pt-2 border-t border-[#222938]/80 flex items-center justify-between text-[10px] text-slate-400 px-1 select-none">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Disponible</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#D4FF00] shadow-[0_0_6px_#D4FF00]"></span>
              <span>Seleccionada</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>Reservada</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-zinc-500"></span>
              <span>No disponible</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Button */}
      <div className="pt-3">
        <button
          onClick={onConfirm}
          disabled={!selectedBikeId}
          className={`w-full py-4 px-6 rounded-2xl font-extrabold text-sm tracking-wide flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
            selectedBikeId
              ? 'bg-[#D4FF00] hover:bg-[#c4ed00] text-black shadow-[0_4px_25px_rgba(212,255,0,0.35)] cursor-pointer'
              : 'bg-[#1C222F] text-slate-500 cursor-not-allowed border border-[#222938]'
          }`}
        >
          <span>
            {selectedBikeObj 
              ? `Confirmar bicicleta #${selectedBikeObj.number}` 
              : 'Selecciona una bicicleta'}
          </span>
        </button>
      </div>
    </div>
  );
};
