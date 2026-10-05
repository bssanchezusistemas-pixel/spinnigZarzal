import React, { useState } from 'react';
import { ArrowLeft, Bike as BikeIconType, Wrench, CheckCircle, User, Clock, Phone, AlertTriangle } from 'lucide-react';
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
  // Default inspected bike is #07 (matches mockup)
  const [inspectedBikeId, setInspectedBikeId] = useState<number>(7);

  const inspectedBike = bikes.find((b) => b.id === inspectedBikeId) || bikes[0];

  const row1 = bikes.slice(0, 4);
  const row2 = bikes.slice(4, 8);
  const row3 = bikes.slice(8, 12);
  const row4 = bikes.slice(12, 14);

  return (
    <div className="flex-1 flex flex-col justify-between p-4 pb-8 bg-[#090B0E] overflow-y-auto">
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
            Bicicletas
          </h1>
          <span className="text-[10px] text-slate-400 ml-auto bg-[#131720] px-2 py-1 rounded-md border border-[#222a38]">
            Sala Zarzal (14 unidades)
          </span>
        </div>

        {/* 14 Bikes Room Layout */}
        <div className="bg-[#0e121a] rounded-2xl border border-[#222938] p-3 pt-4 space-y-2.5 shadow-inner">
          <div className="text-center text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-2">
            Tarima Instructor
          </div>

          {/* Row 1 */}
          <div className="grid grid-cols-4 gap-2 justify-items-center">
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
          <div className="grid grid-cols-4 gap-2 justify-items-center">
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
          <div className="grid grid-cols-4 gap-2 justify-items-center">
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
          <div className="flex justify-center gap-6">
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
          <div className="pt-2 border-t border-[#222a38] flex items-center justify-around text-[10px] text-slate-400 px-1 select-none">
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

        {/* Selected Bike Inspector Card (Matches Screen 10) */}
        <div className="mt-3.5 p-4 rounded-2xl bg-[#131720] border border-[#222a38] shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-[#222a38]">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#1C222F] flex items-center justify-center text-[#D4FF00]">
                <BikeIconType className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-black text-white font-['Montserrat',sans-serif]">
                  Bicicleta #{inspectedBike.number}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Studio Zarzal • Modelo Pro 2026
                </span>
              </div>
            </div>

            {/* Status Pill */}
            <div>
              {inspectedBike.status === 'reserved' && (
                <span className="px-2.5 py-1 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-400 text-[10px] font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                  Reservada
                </span>
              )}
              {inspectedBike.status === 'available' && (
                <span className="px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Disponible
                </span>
              )}
              {inspectedBike.status === 'maintenance' && (
                <span className="px-2.5 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-400 text-[10px] font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Mantenimiento
                </span>
              )}
            </div>
          </div>

          {/* Reserved info if active */}
          {inspectedBike.status === 'reserved' && inspectedBike.reservedBy && (
            <div className="py-2.5 space-y-1.5 text-xs text-slate-200">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Cliente: <strong>{inspectedBike.reservedBy.name}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Hora: {inspectedBike.reservedBy.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[11px] text-slate-300">{inspectedBike.reservedBy.phone}</span>
              </div>
            </div>
          )}

          {inspectedBike.status === 'available' && (
            <div className="py-3 text-xs text-slate-400 text-center">
              Esta bicicleta está libre y lista para ser reservada por cualquier alumno.
            </div>
          )}

          {inspectedBike.status === 'maintenance' && (
            <div className="py-3 text-xs text-amber-400/90 text-center flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Bicicleta en revisión técnica. Bloqueada para reservas.</span>
            </div>
          )}

          {/* Admin Control Actions */}
          <div className="pt-2 border-t border-[#222a38] grid grid-cols-2 gap-2">
            {inspectedBike.status === 'maintenance' ? (
              <button
                onClick={() => onUpdateBikeStatus(inspectedBike.id, 'available')}
                className="py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Habilitar bici</span>
              </button>
            ) : (
              <button
                onClick={() => onUpdateBikeStatus(inspectedBike.id, 'maintenance')}
                className="py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Mantenimiento</span>
              </button>
            )}

            {inspectedBike.status === 'reserved' ? (
              <button
                onClick={() => onUpdateBikeStatus(inspectedBike.id, 'available')}
                className="py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/40 text-rose-400 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Liberar cupo</span>
              </button>
            ) : (
              <button
                onClick={() => onUpdateBikeStatus(inspectedBike.id, 'reserved')}
                className="py-2 px-3 rounded-xl bg-[#1C222F] hover:bg-[#252d3d] border border-[#222a38] text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Asignar manual</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="pt-2 text-center text-[10px] text-slate-400">
        Toca cualquier bicicleta para inspeccionar o cambiar su estado
      </div>
    </div>
  );
};
