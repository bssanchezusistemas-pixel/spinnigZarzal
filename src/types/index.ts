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
  | 'clients-list';    // 11. Clientes y reportes

export type UserRole = 'client' | 'admin';

export type BikeStatus = 'available' | 'selected' | 'reserved' | 'maintenance';

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
  price: number;
  type: string;
  description: string;
  status: 'active' | 'completed' | 'cancelled';
}

export interface Reservation {
  id: string;
  bookingCode: string;
  classId: string;
  className: string;
  dateFormatted: string;
  time: string;
  bikeNumber: string;
  instructorName: string;
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
  totalRides: number;
  joinedDate: string;
}
