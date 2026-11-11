export type ScreenId = 
  | 'welcome'          // 1. Pantalla de inicio
  | 'class-selection'  // 2. Selección de clase
  | 'bike-selection'   // 3. Elección de bicicleta
  | 'confirmation'     // 4. Confirmación
  | 'ticket-qr'        // 5. Ticket / QR de ingreso
  | 'my-classes'       // 6. Mis clases
  | 'calendar'         // 7. Calendario
  | 'admin-dashboard'  // 8. Panel de administrador
  | 'bike-management'  // 10. Gestión de bicicletas
  | 'clients-list'     // 11. Clientes y reportes
  | 'cierre-caja';     // 12. Cierre de caja y finanzas

export type UserRole = 'client' | 'admin';

export type BikeStatus = 'available' | 'selected' | 'reserved' | 'maintenance';

export type ClientType = 'mensualidad' | 'particular';

export type PaymentStatus = 'paid' | 'pending' | 'included_in_membership';

export type PaymentMethod = 'efectivo' | 'nequi' | 'bancolombia' | 'tarjeta' | 'mensualidad';

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
  priceParticular: number; // Precio para quien viene solo el día (ej. 15.000 COP)
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
  amountPaid: number; // 0 si es mensualidad, o valor de clase
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
  membershipPlan?: string; // ej. 'Mensualidad Ilimitada'
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
