export type ScreenId = 
  | 'welcome'          // 1. Pantalla de inicio
  | 'class-selection'  // 2. Selección de clase
  | 'bike-selection'   // 3. Elección de bicicleta
  | 'confirmation'     // 4. Confirmación
  | 'ticket-qr'        // 5. Ticket / QR de ingreso
  | 'my-classes'       // 6. Mis clases
  | 'calendar'         // 7. Calendario
  | 'plans'            // 8. Planes y Membresías BLACK RIDE
  | 'admin-dashboard'  // 9. Panel de administrador
  | 'bike-management'  // 10. Gestión de bicicletas
  | 'clients-list'     // 11. Clientes y reportes
  | 'cierre-caja';     // 12. Cierre de caja y finanzas

export type UserRole = 'client' | 'admin';

export type BikeStatus = 'available' | 'selected' | 'reserved' | 'maintenance';

export type ClientType = 'mensualidad' | 'particular';

export type PaymentStatus = 'paid' | 'pending' | 'included_in_membership';

export type PaymentMethod = 'efectivo' | 'nequi' | 'bancolombia' | 'tarjeta' | 'mensualidad';

export type MembershipPlanId = 'starter' | 'pro' | 'premium' | 'elite' | 'individual';

export interface MembershipPlan {
  id: MembershipPlanId;
  name: string;
  tagline: string;
  price: number;
  classesCount: number;
  validityDays: number;
  validityText: string;
  isMembership: boolean;
  highlight?: boolean;
  badge?: string;
  benefits: string[];
}

export const BLACK_RIDE_PLANS: MembershipPlan[] = [
  {
    id: 'starter',
    name: 'STARTER',
    tagline: 'Para iniciar tu entrenamiento',
    price: 28000,
    classesCount: 4,
    validityDays: 8,
    validityText: '8 días',
    isMembership: true,
    highlight: false,
    badge: 'Inicio Rápido',
    benefits: [
      '4 clases de Indoor Cycling',
      'Vigencia: 8 días calendario',
      'Beneficio BLACK RIDE: Mi bicicleta favorita (1 a 14)',
      'Reserva anticipada desde el portal web',
      'Cambio de bicicleta según disponibilidad',
    ],
  },
  {
    id: 'pro',
    name: 'PRO',
    tagline: 'Constancia y rendimiento',
    price: 56000,
    classesCount: 8,
    validityDays: 15,
    validityText: '15 días',
    isMembership: true,
    highlight: false,
    badge: 'Recomendado',
    benefits: [
      '8 clases de Indoor Cycling',
      'Vigencia: 15 días calendario',
      'Beneficio BLACK RIDE: Mi bicicleta favorita (1 a 14)',
      'Reserva anticipada garantizada',
      'Cambio de bicicleta en cada clase si está libre',
    ],
  },
  {
    id: 'premium',
    name: 'PREMIUM',
    tagline: 'El plan favorito de nuestros riders',
    price: 84000,
    classesCount: 12,
    validityDays: 20,
    validityText: '20 días',
    isMembership: true,
    highlight: true,
    badge: 'Más Popular 🔥',
    benefits: [
      '12 clases de Indoor Cycling',
      'Vigencia: 20 días calendario',
      'Beneficio BLACK RIDE: Mi bicicleta favorita (1 a 14)',
      'Prioridad de reserva en horarios pico',
      'Seguimiento de asistencia y progreso',
    ],
  },
  {
    id: 'elite',
    name: 'ÉLITE',
    tagline: 'Potencia total y constancia mensual',
    price: 120000,
    classesCount: 18,
    validityDays: 30,
    validityText: '30 días',
    isMembership: true,
    highlight: false,
    badge: 'Mejor Tarifa',
    benefits: [
      '18 clases de Indoor Cycling',
      'Vigencia: 30 días calendario (1 mes)',
      'Beneficio BLACK RIDE: Mi bicicleta favorita (1 a 14)',
      'Mejor tarifa por clase ($6.666 COP/sesión)',
      'Acceso prioritario a eventos especiales',
    ],
  },
  {
    id: 'individual',
    name: 'CLASE INDIVIDUAL',
    tagline: 'Entrena solo el día que quieras',
    price: 10000,
    classesCount: 1,
    validityDays: 1,
    validityText: 'Por el día',
    isMembership: false,
    highlight: false,
    badge: 'Sin Membresía',
    benefits: [
      '1 clase individual',
      'Sin cláusula ni membresía requerida',
      'Asignación entre bicicletas disponibles de la sala',
      'Pago en recepción o en línea ($10.000 COP)',
    ],
  },
];

export const BLACK_RIDE_POLICIES = {
  favoriteBike: {
    title: 'Beneficio BLACK RIDE: Mi bicicleta favorita 🚴',
    points: [
      'Elegir su bicicleta favorita entre la número 1 y la 14.',
      'Reservar esa misma bicicleta para sus próximas clases.',
      'Consultar su disponibilidad en tiempo real desde el portal.',
      'Cambiar de bicicleta cuando quieran, siempre que esté libre.',
    ],
    individualNote: 'Clientes de clase individual: pagarán $10.000 y se les asignará una bicicleta entre las que estén disponibles.',
    warning: 'Política de reserva: La bicicleta favorita no queda reservada permanentemente. Se debe confirmar en cada clase y estará sujeta a disponibilidad.',
  },
  membershipPolicy: {
    title: 'BLACK RIDE – Política de Membresía 🐆',
    intro: 'En BLACK RIDE queremos que cada entrenamiento cuente. Todas nuestras membresías tienen una cantidad determinada de clases y una vigencia establecida.',
    rules: [
      'Cada membresía tiene fecha de vencimiento estricta.',
      'Las clases deben utilizarse dentro del tiempo establecido.',
      'Al finalizar la vigencia, la membresía se cierra automáticamente.',
      'Las clases no utilizadas se pierden y no son acumulables.',
      'Para continuar entrenando, será necesario adquirir una nueva membresía.',
    ],
    slogan: 'BLACK RIDE – No pares, supera tus límites.',
  },
};

export interface Bike {
  id: number;
  number: string; // '01', '02', ..., '14'
  status: BikeStatus;
  reservedBy?: {
    name: string;
    email: string;
    phone: string;
    reservationCode: string;
    time: string;
    clientType?: ClientType;
    paymentStatus?: PaymentStatus;
  };
}

export interface ClassSession {
  id: string;
  title: string;
  date: string;
  dateFormatted: string;
  time: string;
  instructor: {
    name: string;
    avatar: string;
    specialty: string;
  };
  totalSpots: number;
  availableSpots: number;
  priceParticular: number; // 10.000 COP
  type: string;
  description: string;
  status: 'active' | 'completed' | 'cancelled';
}

export interface Reservation {
  id: string;
  bookingCode: string;
  classId: string;
  className: string;
  date: string; // YYYY-MM-DD
  dateFormatted: string;
  time: string;
  bikeNumber: string;
  instructorName: string;
  clientName: string;
  clientPhone: string;
  clientType: ClientType; // 'mensualidad' o 'particular'
  paymentStatus: PaymentStatus; // 'paid', 'pending', 'included_in_membership'
  paymentMethod: PaymentMethod;
  amountPaid: number; // 0 si es membresía, o 10000 si es particular
  status: 'confirmed' | 'attended' | 'cancelled';
  qrValue: string;
  createdAt: string;
}

export interface ClientUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  status: 'active' | 'inactive';
  clientType: ClientType; // 'mensualidad' o 'particular'
  membershipStatus: 'active' | 'expired' | 'none';
  membershipPlan?: string; // ej. 'PREMIUM (12 clases)', 'PRO (8 clases)'
  membershipExpiresAt?: string; // YYYY-MM-DD
  totalRides: number;
  joinedDate: string;
}

export interface DailyPayment {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  clientName: string;
  clientPhone: string;
  concept: 'clase_particular' | 'mensualidad' | 'hidratacion' | 'otro';
  conceptLabel: string;
  amount: number;
  method: PaymentMethod;
  notes?: string;
  bookingId?: string;
  createdAt: string;
}

export interface CashClosure {
  id: string;
  date: string; // YYYY-MM-DD
  closedAt: string;
  closedBy: string;
  totalIncome: number;
  totalCash: number;
  totalNequi: number;
  totalBancolombia: number;
  totalCards: number;
  totalPending: number;
  totalRiders: number;
  ridersWithMembership: number;
  ridersParticular: number;
  notes: string;
  status: 'closed' | 'open';
}
