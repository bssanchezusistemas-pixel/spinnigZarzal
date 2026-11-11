import React, { useState } from 'react';
import { ArrowLeft, Bike as BikeIconType, Wrench, CheckCircle, User, Clock, Phone, AlertTriangle, UserPlus } from 'lucide-react';
import type { Bike, BikeStatus } from '../../types';
import { BikeIcon } from '../common/BikeIcon';

interface Screen9BikeManagementProps {
  bikes: Bike[];
  onUpdateBikeStatus: (bikeId: number, newStatus: BikeStatus) => void;
  onBack: () => void;
}

export const Screen9_BikeManagement: React.FC<Screen9BikeManagementProps> = ({
  bikes,
  onUpdateBikeStatus,
  onBack,
}) => {
  const [inspectedBikeId, setInspectedBikeId] = useState<number>(7);

  const inspectedBike = bikes.find((b) => b.id === inspectedBikeId) || bikes[0];

  const row1 = bikes.slice(0, 4);
  const row2 = bikes.slice(4, 8);
  const row3 = bikes.slice(8, 12);
  const row4 = bikes.slice(12, 14);

  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 bg-[#090B0E] overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full">
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
                Gestión de Bicicletas en Sala
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-400">
                14 bicicletas • Asignación manual y bloqueo por mantenimiento
              </p>
            </div>
          </div>

          <span className="text-xs text-[#D4FF00] bg-[#D4FF00]/10 px-3 py-1 rounded-full border border-[#D4FF00]/30 font-bold hidden sm:inline-block">
            Sala Indoor Zarzal
          </span>
        </div>

        {/* Responsive Grid: 1 col on mobile, 2 col on PC */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          {/* Left Column: 14 Bikes Room Layout */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#0e121a]/95 rounded-2xl border border-[#222938] p-4 sm:p-6 space-y-3.5 shadow-xl">
              <div className="text-center text-[10px] uppercase font-bold tracking-widest text-slate-400 pb-1 border-b border-[#222938]">
                Tarima / Instructor en Vivo
              </div>

              {/* Row 1 */}
              <div className="grid grid-cols-4 gap-2 sm:gap-4 justify-items-center">
                {row1.map((b) => (
                  <BikeIcon
                    key={b.id}
                    number={b.number}
                    status={b.status}
                    isSelected={b.id === inspectedBikeId}
                    onClick={() => setInspectedBikeId(b.id)}
                  />
                ))}
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-4 gap-2 sm:gap-4 justify-items-center">
                {row2.map((b) => (
                  <BikeIcon
                    key={b.id}
                    number={b.number}
                    status={b.status}
                    isSelected={b.id === inspectedBikeId}
                    onClick={() => setInspectedBikeId(b.id)}
                  />
                ))}
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-4 gap-2 sm:gap-4 justify-items-center">
                {row3.map((b) => (
                  <BikeIcon
                    key={b.id}
                    number={b.number}
                    status={b.status}
                    isSelected={b.id === inspectedBikeId}
                    onClick={() => setInspectedBikeId(b.id)}
                  />
                ))}
              </div>

              {/* Row 4 (Centered) */}
              <div className="flex justify-center gap-6 sm:gap-10">
                {row4.map((b) => (
                  <BikeIcon
                    key={b.id}
                    number={b.number}
                    status={b.status}
                    isSelected={b.id === inspectedBikeId}
                    onClick={() => setInspectedBikeId(b.id)}
                  />
                ))}
              </div>

              {/* Status Indicators Legend */}
              <div className="pt-3 border-t border-[#222a38] flex flex-wrap items-center justify-around gap-2 text-[11px] text-slate-400 select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>Disponible</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span>Reservada</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span>Mantenimiento</span>
                </div>
              </div>
            </div>

            <p className="text-center text-[11px] text-slate-400">
              Toca cualquier bici en el mapa para inspeccionar sus datos o cambiar su estado
            </p>
          </div>

          {/* Right Column: Bike Inspector Details & Actions */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-[#131720] border border-[#222a38] shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#222a38]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#1C222F] flex items-center justify-center text-[#D4FF00] font-black text-xl font-['Montserrat',sans-serif]">
                    #{inspectedBike.number}
                  </div>
                  <div>
                    <span className="text-sm font-black text-white font-['Montserrat',sans-serif] block">
                      Bicicleta #{inspectedBike.number}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Studio Zarzal • Modelo Pro 2026
                    </span>
                  </div>
                </div>

                {/* Status Pill */}
                <div>
                  {inspectedBike.status === 'reserved' && (
                    <span className="px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-400 text-xs font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                      Reservada
                    </span>
                  )}
                  {inspectedBike.status === 'available' && (
                    <span className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Disponible
                    </span>
                  )}
                  {inspectedBike.status === 'maintenance' && (
                    <span className="px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-400 text-xs font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      Mantenimiento
                    </span>
                  )}
                </div>
              </div>

              {/* Reserved info if active */}
              {inspectedBike.status === 'reserved' && inspectedBike.reservedBy && (
                <div className="p-3.5 rounded-xl bg-[#0E121A] border border-[#222a38] space-y-2 text-xs text-slate-200">
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Alumno: <strong className="text-white">{inspectedBike.reservedBy.name}</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>Horario: {inspectedBike.reservedBy.time}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300 font-mono">{inspectedBike.reservedBy.phone}</span>
                  </div>
                </div>
              )}

              {inspectedBike.status === 'available' && (
                <div className="p-4 rounded-xl bg-[#0E121A] border border-[#222a38] text-xs text-slate-400 text-center">
                  <BikeIconType className="w-8 h-8 text-emerald-400 mx-auto mb-1.5" />
                  <span>Esta bicicleta está completamente libre y habilitada para reservas en línea.</span>
                </div>
              )}

              {inspectedBike.status === 'maintenance' && (
                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-300 text-center flex items-center justify-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>Bicicleta bloqueada en taller o revisión técnica. No aparece disponible al cliente.</span>
                </div>
              )}

              {/* Admin Control Interactive Buttons */}
              <div className="pt-2 border-t border-[#222a38] space-y-2.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Acciones Rápidas de Admin
                </span>

                <div className="grid grid-cols-2 gap-2.5">
                  {inspectedBike.status === 'maintenance' ? (
                    <button
                      type="button"
                      onClick={() => onUpdateBikeStatus(inspectedBike.id, 'available')}
                      className="min-h-[44px] py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black flex items-center justify-center gap-1.5 active:scale-95 transition-all duration-150 cursor-pointer shadow-md"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Habilitar Bici</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onUpdateBikeStatus(inspectedBike.id, 'maintenance')}
                      className="min-h-[44px] py-2.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all duration-150 cursor-pointer"
                    >
                      <Wrench className="w-4 h-4" />
                      <span>A Taller</span>
                    </button>
                  )}

                  {inspectedBike.status === 'reserved' ? (
                    <button
                      type="button"
                      onClick={() => onUpdateBikeStatus(inspectedBike.id, 'available')}
                      className="min-h-[44px] py-2.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/40 text-rose-400 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all duration-150 cursor-pointer"
                    >
                      <span>Liberar Cupo</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onUpdateBikeStatus(inspectedBike.id, 'reserved')}
                      className="min-h-[44px] py-2.5 px-3 rounded-xl bg-[#1C222F] hover:bg-[#252d3d] border border-[#222a38] text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all duration-150 cursor-pointer"
                    >
                      <UserPlus className="w-4 h-4 text-[#D4FF00]" />
                      <span>Asignar Manual</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
