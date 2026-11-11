import type { Bike, ClassSession, ClientUser, Reservation, DailyPayment, CashClosure, PaymentMethod } from '../types';
import { 
  initialBikes, 
  scheduledClassesList, 
  initialClients, 
  initialReservations, 
  initialDailyPayments, 
  initialCashClosure 
} from '../data/mockData';

const STORAGE_KEYS = {
  BIKES: 'panther_ride_bikes_v2',
  CLASSES: 'panther_ride_classes_v2',
  CLIENTS: 'panther_ride_clients_v2',
  RESERVATIONS: 'panther_ride_reservations_v2',
  PAYMENTS: 'panther_ride_payments_v2',
  CLOSURES: 'panther_ride_closures_v2',
};

// Safe JSON parser
function getStoredItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return defaultValue;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage:`, e);
  }
}

export const db = {
  // Bikes
  getBikes(): Bike[] {
    return getStoredItem<Bike[]>(STORAGE_KEYS.BIKES, initialBikes);
  },
  saveBikes(bikes: Bike[]): void {
    setStoredItem(STORAGE_KEYS.BIKES, bikes);
  },

  // Classes
  getClasses(): ClassSession[] {
    return getStoredItem<ClassSession[]>(STORAGE_KEYS.CLASSES, scheduledClassesList);
  },
  saveClasses(classes: ClassSession[]): void {
    setStoredItem(STORAGE_KEYS.CLASSES, classes);
  },

  // Clients
  getClients(): ClientUser[] {
    return getStoredItem<ClientUser[]>(STORAGE_KEYS.CLIENTS, initialClients);
  },
  saveClients(clients: ClientUser[]): void {
    setStoredItem(STORAGE_KEYS.CLIENTS, clients);
  },
  addClient(newClient: Omit<ClientUser, 'id' | 'totalRides' | 'joinedDate'>): ClientUser {
    const clients = this.getClients();
    const created: ClientUser = {
      ...newClient,
      id: `c-${Date.now()}`,
      totalRides: 0,
      joinedDate: 'Noviembre 2026',
    };
    this.saveClients([created, ...clients]);
    return created;
  },

  // Reservations
  getReservations(): Reservation[] {
    return getStoredItem<Reservation[]>(STORAGE_KEYS.RESERVATIONS, initialReservations);
  },
  saveReservations(reservations: Reservation[]): void {
    setStoredItem(STORAGE_KEYS.RESERVATIONS, reservations);
  },
  createReservation(reservation: Reservation): void {
    const reservations = this.getReservations();
    this.saveReservations([reservation, ...reservations]);

    // Also update bike status in the room
    const bikes = this.getBikes();
    const bikeNum = parseInt(reservation.bikeNumber, 10);
    const updatedBikes = bikes.map((b) => 
      b.id === bikeNum || b.number === reservation.bikeNumber
        ? {
            ...b,
            status: 'reserved' as const,
            reservedBy: {
              name: reservation.clientName,
              email: `${reservation.clientName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
              phone: reservation.clientPhone,
              reservationCode: reservation.bookingCode,
              time: reservation.time,
              clientType: reservation.clientType,
              paymentStatus: reservation.paymentStatus,
            }
          }
        : b
    );
    this.saveBikes(updatedBikes);

    // If reservation has a payment already paid (particular with nequi/efectivo), register payment
    if (reservation.paymentStatus === 'paid' && reservation.amountPaid > 0) {
      this.addDailyPayment({
        date: reservation.date,
        time: reservation.time,
        clientName: reservation.clientName,
        clientPhone: reservation.clientPhone,
        concept: 'clase_particular',
        conceptLabel: `Clase Particular (Bici #${reservation.bikeNumber})`,
        amount: reservation.amountPaid,
        method: reservation.paymentMethod,
        notes: `Reserva ${reservation.bookingCode}`,
        bookingId: reservation.id,
      });
    }
  },

  // Daily Payments
  getDailyPayments(): DailyPayment[] {
    return getStoredItem<DailyPayment[]>(STORAGE_KEYS.PAYMENTS, initialDailyPayments);
  },
  saveDailyPayments(payments: DailyPayment[]): void {
    setStoredItem(STORAGE_KEYS.PAYMENTS, payments);
  },
  addDailyPayment(payment: Omit<DailyPayment, 'id' | 'createdAt'>): DailyPayment {
    const payments = this.getDailyPayments();
    const created: DailyPayment = {
      ...payment,
      id: `pay-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.saveDailyPayments([created, ...payments]);
    return created;
  },

  // Mark pending reservation as paid in reception
  markBookingAsPaid(bookingId: string, method: PaymentMethod, amount: number = 15000): void {
    const reservations = this.getReservations();
    let updatedBooking: Reservation | undefined;

    const updatedReservations = reservations.map((res) => {
      if (res.id === bookingId) {
        updatedBooking = {
          ...res,
          paymentStatus: 'paid' as const,
          paymentMethod: method,
          amountPaid: amount,
        };
        return updatedBooking;
      }
      return res;
    });

    this.saveReservations(updatedReservations);

    // Also update bike reservedBy if active
    if (updatedBooking) {
      const bikes = this.getBikes();
      const updatedBikes = bikes.map((b) => 
        b.number === updatedBooking?.bikeNumber && b.reservedBy
          ? {
              ...b,
              reservedBy: {
                ...b.reservedBy,
                paymentStatus: 'paid' as const,
              }
            }
          : b
      );
      this.saveBikes(updatedBikes);

      // Register new payment
      this.addDailyPayment({
        date: updatedBooking.date,
        time: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
        clientName: updatedBooking.clientName,
        clientPhone: updatedBooking.clientPhone,
        concept: 'clase_particular',
        conceptLabel: `Pago en recepción (Bici #${updatedBooking.bikeNumber})`,
        amount: amount,
        method: method,
        notes: `Cobro en puerta de reserva ${updatedBooking.bookingCode}`,
        bookingId: updatedBooking.id,
      });
    }
  },

  // Cash Closures
  getCashClosures(): CashClosure[] {
    return getStoredItem<CashClosure[]>(STORAGE_KEYS.CLOSURES, [initialCashClosure]);
  },
  saveCashClosure(closure: CashClosure): void {
    const closures = this.getCashClosures();
    const existingIndex = closures.findIndex((c) => c.date === closure.date);
    if (existingIndex >= 0) {
      closures[existingIndex] = closure;
      setStoredItem(STORAGE_KEYS.CLOSURES, closures);
    } else {
      setStoredItem(STORAGE_KEYS.CLOSURES, [closure, ...closures]);
    }
  },

  // Dynamic Cash Summary calculation for any specific date
  getCashSummary(dateStr: string = '2026-09-25') {
    const payments = this.getDailyPayments().filter((p) => p.date === dateStr);
    const reservations = this.getReservations().filter((r) => r.date === dateStr);

    let totalIncome = 0;
    let totalCash = 0;
    let totalNequi = 0;
    let totalBancolombia = 0;
    let totalCards = 0;

    payments.forEach((p) => {
      totalIncome += p.amount;
      if (p.method === 'efectivo') totalCash += p.amount;
      else if (p.method === 'nequi') totalNequi += p.amount;
      else if (p.method === 'bancolombia') totalBancolombia += p.amount;
      else if (p.method === 'tarjeta') totalCards += p.amount;
    });

    let totalPending = 0;
    let ridersWithMembership = 0;
    let ridersParticular = 0;

    reservations.forEach((r) => {
      if (r.clientType === 'mensualidad') {
        ridersWithMembership++;
      } else {
        ridersParticular++;
        if (r.paymentStatus === 'pending') {
          totalPending += 15000;
        }
      }
    });

    const totalRiders = reservations.length;
    const occupancyPercent = totalRiders > 0 ? Math.round((totalRiders / 14) * 100) : 0;

    return {
      date: dateStr,
      totalIncome,
      totalCash,
      totalNequi,
      totalBancolombia,
      totalCards,
      totalPending,
      totalRiders,
      ridersWithMembership,
      ridersParticular,
      occupancyPercent,
      payments,
      reservations,
    };
  },

  // Reset demo to factory defaults
  resetDatabase(): void {
    localStorage.removeItem(STORAGE_KEYS.BIKES);
    localStorage.removeItem(STORAGE_KEYS.CLASSES);
    localStorage.removeItem(STORAGE_KEYS.CLIENTS);
    localStorage.removeItem(STORAGE_KEYS.RESERVATIONS);
    localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
    localStorage.removeItem(STORAGE_KEYS.CLOSURES);
  }
};
