import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Bike, 
  ChevronRight as RightIcon, 
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import type { ClassSession } from '../../types';

interface Screen7CalendarProps {
  scheduledClasses: ClassSession[];
  onSelectClass: (cls: ClassSession) => void;
  onBack: () => void;
  isAdmin?: boolean;
  onCreateClass?: (newClass: Omit<ClassSession, 'id'>) => void;
  onUpdateClass?: (updatedClass: ClassSession) => void;
  onDeleteClass?: (classId: string) => void;
  initialOpenCreateModal?: boolean;
}

const PRESET_COACHES = [
  {
    name: 'Andrés Ramírez',
    specialty: 'Master Coach • Resistencia y Ritmo',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Camila Torres',
    specialty: 'Morning Boost • Cadencia Alta',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Laura Gómez',
    specialty: 'Power Sprint • Resistencia Extrema',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Mateo Valencia',
    specialty: 'Cardio Boost & Escaladas',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
  },
];

export const Screen7_Calendar: React.FC<Screen7CalendarProps> = ({
  scheduledClasses,
  onSelectClass,
  onBack,
  isAdmin = false,
  onCreateClass,
  onUpdateClass,
  onDeleteClass,
  initialOpenCreateModal = false,
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(25);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState<boolean>(initialOpenCreateModal);
  const [editingClass, setEditingClass] = useState<ClassSession | null>(null);
  const [deletingClassId, setDeletingClassId] = useState<string | null>(null);

  // Form State for Create & Edit
  const [formTime, setFormTime] = useState('6:00 p. m.');
  const [formTitle, setFormTitle] = useState('Indoor Cycling');
  const [formCoachName, setFormCoachName] = useState('Andrés Ramírez');
  const [formCoachSpecialty, setFormCoachSpecialty] = useState('Master Coach • Resistencia');
  const [formCoachAvatar, setFormCoachAvatar] = useState(PRESET_COACHES[0].avatar);
  const [formTotalSpots, setFormTotalSpots] = useState(14);
  const [formAvailableSpots, setFormAvailableSpots] = useState(14);
  const [formDescription, setFormDescription] = useState('Energía • Resistencia • Ritmo y Potencia');

  const daysOfWeek = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);

  // Open Edit Modal for a class
  const handleOpenEdit = (cls: ClassSession, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingClass(cls);
    setFormTime(cls.time);
    setFormTitle(cls.title);
    setFormCoachName(cls.instructor.name);
    setFormCoachSpecialty(cls.instructor.specialty);
    setFormCoachAvatar(cls.instructor.avatar);
    setFormTotalSpots(cls.totalSpots);
    setFormAvailableSpots(cls.availableSpots);
    setFormDescription(cls.description);
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setFormTime('7:00 a. m.');
    setFormTitle('Indoor Cycling');
    setFormCoachName('Andrés Ramírez');
    setFormCoachSpecialty('Master Coach • Resistencia y Ritmo');
    setFormCoachAvatar(PRESET_COACHES[0].avatar);
    setFormTotalSpots(14);
    setFormAvailableSpots(14);
    setFormDescription('Energía • Resistencia • Ritmo y Potencia');
    setShowCreateModal(true);
  };

  // Select Coach preset
  const handleSelectPresetCoach = (name: string) => {
    const coach = PRESET_COACHES.find(c => c.name === name);
    if (coach) {
      setFormCoachName(coach.name);
      setFormCoachSpecialty(coach.specialty);
      setFormCoachAvatar(coach.avatar);
    } else {
      setFormCoachName(name);
    }
  };

  // Save new class
  const handleSaveCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onCreateClass) return;

    const newClass: Omit<ClassSession, 'id'> = {
      title: formTitle.trim() || 'Indoor Cycling',
      date: `2026-09-${String(selectedDay).padStart(2, '0')}`,
      dateFormatted: `${selectedDay} de Septiembre de 2026`,
      time: formTime.trim(),
      instructor: {
        name: formCoachName.trim() || 'Coach BLACK RIDE',
        avatar: formCoachAvatar || PRESET_COACHES[0].avatar,
        specialty: formCoachSpecialty.trim() || 'Indoor Cycling Coach',
      },
      totalSpots: Number(formTotalSpots) || 14,
      availableSpots: Number(formAvailableSpots) || 14,
      priceParticular: 10000,
      type: 'Indoor Cycling',
      description: formDescription.trim() || 'Energía • Resistencia • Ritmo',
      status: 'active',
    };

    onCreateClass(newClass);
    setShowCreateModal(false);
  };

  // Save updated class
  const handleSaveUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass || !onUpdateClass) return;

    const updated: ClassSession = {
      ...editingClass,
      title: formTitle.trim() || editingClass.title,
      time: formTime.trim() || editingClass.time,
      instructor: {
        name: formCoachName.trim() || editingClass.instructor.name,
        avatar: formCoachAvatar || editingClass.instructor.avatar,
        specialty: formCoachSpecialty.trim() || editingClass.instructor.specialty,
      },
      totalSpots: Number(formTotalSpots) || editingClass.totalSpots,
      availableSpots: Number(formAvailableSpots) || editingClass.availableSpots,
      description: formDescription.trim() || editingClass.description,
    };

    onUpdateClass(updated);
    setEditingClass(null);
  };

  // Delete class
  const handleConfirmDelete = (classId: string) => {
    if (onDeleteClass) {
      onDeleteClass(classId);
    }
    setDeletingClassId(null);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 bg-[#090B0E] overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              aria-label="Volver"
              className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-[#131720] border border-[#222a38] text-slate-300 hover:text-white hover:border-[#D4AF37]/40 active:scale-95 transition-all duration-150 cursor-pointer flex items-center justify-center shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black font-['Montserrat',sans-serif] text-white tracking-tight">
                  Calendario de clases
                </h1>
                {isAdmin && (
                  <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-bold">
                    ADMIN
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400">
                {isAdmin 
                  ? 'Gestiona, agrega, edita o elimina horarios y asigna profesores' 
                  : 'Reserva con antelación para asegurar tu bicicleta preferida'}
              </p>
            </div>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={handleOpenCreate}
              className="min-h-[42px] px-3.5 sm:px-4 py-2 rounded-xl bg-gold-gradient hover:brightness-110 text-black text-xs font-black flex items-center gap-1.5 shadow-md shadow-[#D4AF37]/20 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Nuevo Horario</span>
            </button>
          )}
        </div>

        {/* Responsive Grid: 1 col on mobile, 2 col on PC */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-start">
          {/* Left Column: Calendar Date Grid */}
          <div className="md:col-span-6 space-y-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#131720] border border-[#222a38] shadow-xl">
              {/* Month Selector */}
              <div className="flex items-center justify-between px-1 mb-4">
                <button 
                  type="button"
                  className="min-h-[36px] min-w-[36px] p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#1C222F] active:scale-95 transition-all duration-150 cursor-pointer flex items-center justify-center"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="text-center">
                  <span className="font-extrabold text-sm text-white tracking-wide font-['Montserrat',sans-serif] block">
                    Septiembre 2026
                  </span>
                  <span className="text-[10px] text-slate-400">Studio Zarzal</span>
                </div>
                <button 
                  type="button"
                  className="min-h-[36px] min-w-[36px] p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#1C222F] active:scale-95 transition-all duration-150 cursor-pointer flex items-center justify-center"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Days of week header */}
              <div className="grid grid-cols-7 gap-1 text-center mb-2.5">
                {daysOfWeek.map((day, idx) => (
                  <span key={idx} className="text-[11px] font-bold text-slate-400 py-1">
                    {day}
                  </span>
                ))}
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
                <div></div>

                {calendarDays.map((day) => {
                  const isSelected = day === selectedDay;
                  const hasClasses = day === 25 || day === 24 || day === 26 || day === 28;

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setSelectedDay(day)}
                      className={`h-9 w-9 sm:h-10 sm:w-10 mx-auto rounded-xl flex flex-col items-center justify-center font-bold transition-all duration-150 relative cursor-pointer active:scale-95 ${
                        isSelected
                          ? 'bg-gold-gradient text-black shadow-md shadow-[#D4AF37]/40 font-black scale-105'
                          : hasClasses
                          ? 'text-white hover:bg-[#1C222F] border border-transparent hover:border-[#D4AF37]/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-[#1C222F]/50'
                      }`}
                    >
                      <span>{day}</span>
                      {!isSelected && hasClasses && (
                        <span className="w-1 h-1 rounded-full bg-[#D4AF37] mt-0.5"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Classes Scheduled for the Selected Day */}
          <div className="md:col-span-6 space-y-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#131720] border border-[#222a38] shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#222a38]">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-bold block">
                    Horarios programados
                  </span>
                  <span className="text-sm font-black text-white">
                    {selectedDay} de Septiembre de 2026
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 rounded-lg border border-[#D4AF37]/30">
                    {scheduledClasses.length} sesiones
                  </span>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={handleOpenCreate}
                      className="p-1.5 rounded-lg bg-[#1C222F] hover:bg-[#D4AF37] hover:text-black text-[#D4AF37] border border-[#222a38] transition-all"
                      title="Agregar horario"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {scheduledClasses.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  <Clock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="font-bold text-white">No hay clases programadas para este día</p>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={handleOpenCreate}
                      className="mt-3 px-4 py-2 rounded-xl bg-gold-gradient text-black font-black text-xs inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Crear Primera Clase</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2.5 pt-1">
                  {scheduledClasses.map((cls) => (
                    <div
                      key={cls.id}
                      onClick={() => onSelectClass(cls)}
                      className="p-3.5 rounded-xl bg-[#0E121A] border border-[#222a38] flex items-center justify-between hover:border-[#D4AF37]/60 active:scale-98 transition-all duration-150 cursor-pointer group shadow-sm relative"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#1C222F] flex items-center justify-center text-[#D4AF37] group-hover:scale-105 transition-all shrink-0">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-white">
                              {cls.time}
                            </span>
                            <span className="text-[11px] text-slate-300 font-medium">
                              {cls.title}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Bike className="w-3 h-3 text-[#D4AF37]" />
                            <span>Coach: <strong className="text-slate-200">{cls.instructor.name}</strong></span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-[#D4AF37] bg-[#D4AF37]/15 px-2 py-0.5 rounded-lg border border-[#D4AF37]/30">
                          {cls.availableSpots}/{cls.totalSpots} cupos
                        </span>

                        {isAdmin ? (
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={(e) => handleOpenEdit(cls, e)}
                              className="p-1.5 rounded-lg bg-[#1C222F] hover:bg-[#252d3d] border border-[#222a38] text-slate-300 hover:text-[#D4AF37] transition-all"
                              title="Editar horario y profesor"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeletingClassId(cls.id);
                              }}
                              className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 transition-all"
                              title="Eliminar clase"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <RightIcon className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>
                  {isAdmin 
                    ? 'Haz clic en el lápiz para editar clase o profesor, o en la tarjeta para ver sala'
                    : 'Haz clic en un horario para seleccionar tu bicicleta'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: CREAR NUEVA CLASE / HORARIO (ADMIN) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#131720] border border-[#222a38] p-5 sm:p-6 rounded-3xl shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-[#222a38]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gold-gradient flex items-center justify-center text-black font-black">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-white text-base font-['Montserrat',sans-serif]">
                    Crear Nueva Clase / Horario
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Programar sesión de Indoor Cycling y asignar instructor
                  </span>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-[#1C222F] border border-[#222a38]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCreate} className="space-y-4">
              {/* Horario & Titulo */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Horario de Clase *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    placeholder="Ej. 6:00 p. m. o 7:00 a. m."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E121A] border border-[#222a38] text-white text-xs sm:text-sm focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Título / Modalidad *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Indoor Cycling / Sprint"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E121A] border border-[#222a38] text-white text-xs sm:text-sm focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              {/* Instructor Selector */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Profesor / Instructor Asignado *
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {PRESET_COACHES.map((coach) => (
                    <button
                      key={coach.name}
                      type="button"
                      onClick={() => handleSelectPresetCoach(coach.name)}
                      className={`p-2 rounded-xl border text-left text-xs transition-all flex items-center gap-2 ${
                        formCoachName === coach.name
                          ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white'
                          : 'bg-[#0E121A] border-[#222a38] text-slate-400 hover:text-white'
                      }`}
                    >
                      <img 
                        src={coach.avatar} 
                        alt={coach.name} 
                        className="w-7 h-7 rounded-lg object-cover shrink-0" 
                      />
                      <span className="font-bold truncate">{coach.name}</span>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={formCoachName}
                    onChange={(e) => setFormCoachName(e.target.value)}
                    placeholder="Nombre del Coach"
                    className="w-full px-3 py-2 rounded-xl bg-[#0E121A] border border-[#222a38] text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                  <input
                    type="text"
                    value={formCoachSpecialty}
                    onChange={(e) => setFormCoachSpecialty(e.target.value)}
                    placeholder="Especialidad (ej. Master Coach)"
                    className="w-full px-3 py-2 rounded-xl bg-[#0E121A] border border-[#222a38] text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              {/* Cupos totales & Cupos disponibles */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Cupos Totales Sala
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    required
                    value={formTotalSpots}
                    onChange={(e) => setFormTotalSpots(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E121A] border border-[#222a38] text-white font-mono text-xs sm:text-sm focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Cupos Disponibles
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={formTotalSpots}
                    required
                    value={formAvailableSpots}
                    onChange={(e) => setFormAvailableSpots(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E121A] border border-[#222a38] text-white font-mono text-xs sm:text-sm focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Descripción / Enfoque de Intensidad
                </label>
                <input
                  type="text"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Ej. Resistencia pura • Ritmo acelerado • Sprint final"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E121A] border border-[#222a38] text-white text-xs sm:text-sm focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[#222a38] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#1C222F] text-slate-300 text-xs font-bold hover:bg-[#252d3d]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gold-gradient hover:brightness-110 text-black text-xs font-black flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Publicar Horario</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR CLASE / HORARIO / PROFESOR (ADMIN) */}
      {editingClass && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#131720] border border-[#222a38] p-5 sm:p-6 rounded-3xl shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-[#222a38]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gold-gradient flex items-center justify-center text-black font-black">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-white text-base font-['Montserrat',sans-serif]">
                    Editar Clase / Profesor
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Cambiar horario, instructor asignado y cupos de la sesión
                  </span>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setEditingClass(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-[#1C222F] border border-[#222a38]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUpdate} className="space-y-4">
              {/* Horario & Titulo */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Horario de Clase *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E121A] border border-[#222a38] text-white text-xs sm:text-sm focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Título / Modalidad *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E121A] border border-[#222a38] text-white text-xs sm:text-sm focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              {/* Instructor Selector */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Profesor / Instructor Asignado *
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {PRESET_COACHES.map((coach) => (
                    <button
                      key={coach.name}
                      type="button"
                      onClick={() => handleSelectPresetCoach(coach.name)}
                      className={`p-2 rounded-xl border text-left text-xs transition-all flex items-center gap-2 ${
                        formCoachName === coach.name
                          ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white'
                          : 'bg-[#0E121A] border-[#222a38] text-slate-400 hover:text-white'
                      }`}
                    >
                      <img 
                        src={coach.avatar} 
                        alt={coach.name} 
                        className="w-7 h-7 rounded-lg object-cover shrink-0" 
                      />
                      <span className="font-bold truncate">{coach.name}</span>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={formCoachName}
                    onChange={(e) => setFormCoachName(e.target.value)}
                    placeholder="Nombre del Coach"
                    className="w-full px-3 py-2 rounded-xl bg-[#0E121A] border border-[#222a38] text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                  <input
                    type="text"
                    value={formCoachSpecialty}
                    onChange={(e) => setFormCoachSpecialty(e.target.value)}
                    placeholder="Especialidad (ej. Master Coach)"
                    className="w-full px-3 py-2 rounded-xl bg-[#0E121A] border border-[#222a38] text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              {/* Cupos totales & Cupos disponibles */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Cupos Totales Sala
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    required
                    value={formTotalSpots}
                    onChange={(e) => setFormTotalSpots(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E121A] border border-[#222a38] text-white font-mono text-xs sm:text-sm focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Cupos Disponibles
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={formTotalSpots}
                    required
                    value={formAvailableSpots}
                    onChange={(e) => setFormAvailableSpots(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E121A] border border-[#222a38] text-white font-mono text-xs sm:text-sm focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Descripción / Enfoque de Intensidad
                </label>
                <input
                  type="text"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E121A] border border-[#222a38] text-white text-xs sm:text-sm focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[#222a38] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingClass(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#1C222F] text-slate-300 text-xs font-bold hover:bg-[#252d3d]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gold-gradient hover:brightness-110 text-black text-xs font-black flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deletingClassId && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#131720] border border-rose-500/40 p-5 rounded-3xl shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-950/60 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-white text-sm font-['Montserrat',sans-serif]">
                  ¿Eliminar este Horario?
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Esta acción retirará la clase del calendario de reservas.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingClassId(null)}
                className="px-4 py-2 rounded-xl bg-[#1C222F] text-slate-300 text-xs font-bold hover:bg-[#252d3d]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleConfirmDelete(deletingClassId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md active:scale-95 transition-all cursor-pointer"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
