import { useState, lazy, Suspense } from 'react';
import type { ScreenId, UserRole, Bike, ClassSession, Reservation, ClientUser, BikeStatus, ClientType, MembershipPlan } from './types';
import { db } from './services/db';
import { supabase } from './services/supabaseClient';
import { DemoToolbar } from './components/common/DemoToolbar';
import { MobileFrame } from './components/common/MobileFrame';
import { BottomNav } from './components/common/BottomNav';

// Eager load Screen 1 for instantaneous First Contentful Paint (FCP)
import { Screen1_Welcome } from './components/screens/Screen1_Welcome';

// Lazy load remaining screens to eliminate bundle bloat & defer heavy libs (qrcode, confetti, charts)
const Screen_Plans = lazy(() => import('./components/screens/Screen_Plans').then(m => ({ default: m.Screen_Plans })));
const Screen2_ClassSelection = lazy(() => import('./components/screens/Screen2_ClassSelection').then(m => ({ default: m.Screen2_ClassSelection })));
const Screen3_BikeSelection = lazy(() => import('./components/screens/Screen3_BikeSelection').then(m => ({ default: m.Screen3_BikeSelection })));
const Screen4_Confirmation = lazy(() => import('./components/screens/Screen4_Confirmation').then(m => ({ default: m.Screen4_Confirmation })));
const Screen5_TicketQR = lazy(() => import('./components/screens/Screen5_TicketQR').then(m => ({ default: m.Screen5_TicketQR })));
const Screen6_MyClasses = lazy(() => import('./components/screens/Screen6_MyClasses').then(m => ({ default: m.Screen6_MyClasses })));
const Screen7_Calendar = lazy(() => import('./components/screens/Screen7_Calendar').then(m => ({ default: m.Screen7_Calendar })));
const Screen8_AdminDashboard = lazy(() => import('./components/screens/Screen8_AdminDashboard').then(m => ({ default: m.Screen8_AdminDashboard })));
const Screen9_BikeManagement = lazy(() => import('./components/screens/Screen9_BikeManagement').then(m => ({ default: m.Screen9_BikeManagement })));
const Screen10_ClientsList = lazy(() => import('./components/screens/Screen10_ClientsList').then(m => ({ default: m.Screen10_ClientsList })));
const Screen11_CierreCaja = lazy(() => import('./components/screens/Screen11_CierreCaja').then(m => ({ default: m.Screen11_CierreCaja })));

function ScreenFallback() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#090B0E] text-slate-400">
      <div className="w-9 h-9 rounded-full border-2 border-[#D4AF37]/30 border-t-[#D4AF37] animate-spin mb-3"></div>
      <span className="text-xs font-mono tracking-wider text-slate-400">Cargando pantalla...</span>
    </div>
  );
}

export function App() {
  // Navigation & Role states
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('welcome');
  const [role, setRole] = useState<UserRole>('client');
  const [isSimulator, setIsSimulator] = useState<boolean>(true);

  // Persistent Application Data states (Loaded from DB)
  const [bikes, setBikes] = useState<Bike[]>(() => db.getBikes());
  const [classes, setClasses] = useState<ClassSession[]>(() => db.getClasses());
  const [currentClass, setCurrentClass] = useState<ClassSession>(() => db.getClasses()[2] || db.getClasses()[0]);
  const [reservations, setReservations] = useState<Reservation[]>(() => db.getReservations());
  const [clients, setClients] = useState<ClientUser[]>(() => db.getClients());
  const [selectedBikeId, setSelectedBikeId] = useState<number | null>(7);

  // Booking Flow User State
  const [bookingClientType, setBookingClientType] = useState<ClientType>('mensualidad');
  const [bookingClientName, setBookingClientName] = useState<string>('Laura Gómez');
  const [bookingClientPhone, setBookingClientPhone] = useState<string>('+57 300 123 4567');

  // Active reservation being viewed on Ticket QR screen
  const [activeReservation, setActiveReservation] = useState<Reservation>(() => 
    db.getReservations()[0] || {
      id: 'res-default',
      bookingCode: 'BR-20260925-007',
      classId: 'class-evening-1',
      className: 'Indoor Cycling',
      date: '2026-09-25',
      dateFormatted: 'Viernes, 25 de septiembre de 2026',
      time: '6:00 p. m.',
      bikeNumber: '07',
      instructorName: 'Andrés Ramírez',
      clientName: 'Laura Gómez',
      clientPhone: '+57 300 123 4567',
      clientType: 'mensualidad',
      paymentStatus: 'included_in_membership',
      paymentMethod: 'mensualidad',
      amountPaid: 0,
      status: 'confirmed',
      qrValue: 'BLACK-RIDE:BR-20260925-007:BIKE-07',
      createdAt: new Date().toISOString(),
    }
  );

  // Refresh data from db
  const refreshAllData = () => {
    setBikes(db.getBikes());
    setClasses(db.getClasses());
    setReservations(db.getReservations());
    setClients(db.getClients());
  };

  // Handlers
  const handleToggleRole = () => {
    if (role === 'client') {
      setRole('admin');
      setCurrentScreen('admin-dashboard');
    } else {
      setRole('client');
      setCurrentScreen('welcome');
    }
  };

  const handleResetData = () => {
    db.resetDatabase();
    refreshAllData();
    setSelectedBikeId(7);
    alert('Base de datos restaurada al estado oficial de BLACK RIDE Zarzal.');
  };

  const handleStartBooking = () => {
    setCurrentScreen('class-selection');
  };

  const handleContinueClassSelection = (updated?: Partial<ClassSession>) => {
    if (updated) {
      const newClass = { ...currentClass, ...updated };
      setCurrentClass(newClass);
    }
    setCurrentScreen('bike-selection');
  };

  const handleSelectBike = (bikeId: number) => {
    const targetBike = bikes.find((b) => b.id === bikeId);
    if (targetBike && targetBike.status !== 'reserved' && targetBike.status !== 'maintenance') {
      setSelectedBikeId(bikeId);
    }
  };

  const handleConfirmBikeSelection = () => {
    if (selectedBikeId) {
      setCurrentScreen('confirmation');
    }
  };

  const handleConfirmBooking = (customCode?: string) => {
    const selectedBike = bikes.find((b) => b.id === selectedBikeId);
    const bikeNumber = selectedBike ? selectedBike.number : '07';

    // Código unificado que viaja en el texto, WhatsApp y exactamente dentro del QR
    const newBookingCode = customCode || `BR-${Math.floor(1000 + Math.random() * 9000)}`;
    const isMembership = bookingClientType === 'mensualidad';

    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      bookingCode: newBookingCode,
      classId: currentClass.id,
      className: currentClass.type,
      date: currentClass.date,
      dateFormatted: currentClass.dateFormatted,
      time: currentClass.time,
      bikeNumber: bikeNumber,
      instructorName: currentClass.instructor.name,
      clientName: bookingClientName,
      clientPhone: bookingClientPhone,
      clientType: bookingClientType,
      paymentStatus: isMembership ? 'included_in_membership' : 'pending',
      paymentMethod: isMembership ? 'mensualidad' : 'efectivo',
      amountPaid: isMembership ? 0 : 10000, // Tarifa clase individual $10.000 COP
      status: 'confirmed',
      qrValue: newBookingCode, // ¡Exactamente el mismo código que lee el QR!
      createdAt: new Date().toISOString(),
    };

    // Guardar en base de datos local
    db.createReservation(newReservation);
    refreshAllData();

    // Sincronizar en Supabase en segundo plano
    Promise.resolve(
      supabase.rpc('confirm_booking_fast', {
        p_booking_code: newBookingCode,
        p_class_date: currentClass.date,
        p_class_time: currentClass.time.includes('p') ? '18:00:00' : '06:30:00',
        p_bike_number: bikeNumber,
        p_client_name: bookingClientName,
        p_client_phone: bookingClientPhone,
        p_client_type: bookingClientType,
        p_payment_method: isMembership ? 'mensualidad' : 'efectivo',
      })
    ).then(({ data, error }) => {
      if (error) console.warn('Supabase booking sync warning:', error);
      else console.log('Supabase booking confirmed:', data);
    }).catch(console.error);

    setActiveReservation(newReservation);
    setCurrentScreen('ticket-qr');
  };

  const handleViewTicketDetail = (res: Reservation) => {
    setActiveReservation(res);
    setCurrentScreen('ticket-qr');
  };

  const handleSelectClassFromCalendar = (cls: ClassSession) => {
    setCurrentClass(cls);
    setCurrentScreen('bike-selection');
  };

  const handleUpdateBikeStatus = (bikeId: number, newStatus: BikeStatus) => {
    const updated = bikes.map((b) => (b.id === bikeId ? { ...b, status: newStatus } : b));
    db.saveBikes(updated);
    setBikes(updated);
  };

  const handleUpdateClientMembership = (clientId: string, type: ClientType, planName?: string, expiresAt?: string) => {
    const updated = clients.map((c) => 
      c.id === clientId
        ? {
            ...c,
            clientType: type,
            membershipStatus: type === 'mensualidad' ? ('active' as const) : ('none' as const),
            membershipPlan: planName || (type === 'mensualidad' ? 'PREMIUM (12 clases • 20 días)' : 'CLASE INDIVIDUAL ($10.000)'),
            membershipExpiresAt: expiresAt || (type === 'mensualidad' ? '2026-10-25' : undefined),
          }
        : c
    );
    db.saveClients(updated);
    setClients(updated);
  };

  const handleSelectPlanToBook = (plan: MembershipPlan) => {
    if (plan.isMembership) {
      setBookingClientType('mensualidad');
    } else {
      setBookingClientType('particular');
    }
    setCurrentScreen('class-selection');
  };

  const selectedBikeObj = bikes.find((b) => b.id === selectedBikeId);

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full bg-[#06080B] text-slate-100 flex flex-col overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Demo Presentation Bar */}
      <DemoToolbar
        currentScreen={currentScreen}
        onSelectScreen={setCurrentScreen}
        role={role}
        onToggleRole={handleToggleRole}
        isSimulator={isSimulator}
        onToggleSimulator={() => setIsSimulator(!isSimulator)}
        onResetData={handleResetData}
      />

      {/* Main Content inside Phone Frame or Full Width */}
      <MobileFrame isSimulator={isSimulator}>
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden relative">
          <Suspense fallback={<ScreenFallback />}>
            {/* SCREEN 1: Inicio / Bienvenida (Eager Loaded) */}
            {currentScreen === 'welcome' && (
              <Screen1_Welcome
                onStartBooking={handleStartBooking}
                onLogin={handleToggleRole}
                onExploreSchedule={() => setCurrentScreen('calendar')}
                onViewPlans={() => setCurrentScreen('plans')}
              />
            )}

            {/* SCREEN: Planes y Membresías BLACK RIDE */}
            {currentScreen === 'plans' && (
              <Screen_Plans
                onBack={() => setCurrentScreen(role === 'admin' ? 'admin-dashboard' : 'welcome')}
                onSelectPlanToBook={handleSelectPlanToBook}
                isAdmin={role === 'admin'}
              />
            )}

            {/* SCREEN 2: Selección de Clase */}
            {currentScreen === 'class-selection' && (
              <Screen2_ClassSelection
                currentClass={currentClass}
                onContinue={handleContinueClassSelection}
                onOpenMenu={handleToggleRole}
              />
            )}

            {/* SCREEN 3: Elección de Bicicleta */}
            {currentScreen === 'bike-selection' && (
              <Screen3_BikeSelection
                bikes={bikes}
                selectedBikeId={selectedBikeId}
                onSelectBike={handleSelectBike}
                onConfirm={handleConfirmBikeSelection}
                onBack={() => setCurrentScreen('class-selection')}
              />
            )}

            {/* SCREEN 4: Confirmación de Reserva (Lógica Membresía vs Individual) */}
            {currentScreen === 'confirmation' && (
              <Screen4_Confirmation
                currentClass={currentClass}
                bikeNumber={selectedBikeObj ? selectedBikeObj.number : '07'}
                clientType={bookingClientType}
                onSelectClientType={setBookingClientType}
                clientName={bookingClientName}
                clientPhone={bookingClientPhone}
                onChangeClientInfo={(name, phone) => {
                  setBookingClientName(name);
                  setBookingClientPhone(phone);
                }}
                onConfirmBooking={handleConfirmBooking}
                onBack={() => setCurrentScreen('bike-selection')}
              />
            )}

            {/* SCREEN 5: Ticket / QR de Ingreso */}
            {currentScreen === 'ticket-qr' && (
              <Screen5_TicketQR
                reservation={activeReservation}
                onBack={() => setCurrentScreen('confirmation')}
                onGoToMyClasses={() => setCurrentScreen('my-classes')}
              />
            )}

            {/* SCREEN 6: Mis Clases */}
            {currentScreen === 'my-classes' && (
              <Screen6_MyClasses
                reservations={reservations}
                onViewDetail={handleViewTicketDetail}
                onBookNewClass={() => setCurrentScreen('class-selection')}
              />
            )}

            {/* SCREEN 7: Calendario de Clases */}
            {currentScreen === 'calendar' && (
              <Screen7_Calendar
                scheduledClasses={classes}
                onSelectClass={handleSelectClassFromCalendar}
                onBack={() => setCurrentScreen(role === 'admin' ? 'admin-dashboard' : 'welcome')}
              />
            )}

            {/* SCREEN 8: Panel de Administrador */}
            {currentScreen === 'admin-dashboard' && (
              <Screen8_AdminDashboard
                onNavigateScreen={setCurrentScreen}
                onOpenCreateClassModal={() => setCurrentScreen('calendar')}
              />
            )}

            {/* SCREEN 9: Gestión de Bicicletas */}
            {currentScreen === 'bike-management' && (
              <Screen9_BikeManagement
                bikes={bikes}
                onUpdateBikeStatus={handleUpdateBikeStatus}
                onBack={() => setCurrentScreen('admin-dashboard')}
              />
            )}

            {/* SCREEN 10: Clientes y Membresías */}
            {currentScreen === 'clients-list' && (
              <Screen10_ClientsList
                clients={clients}
                onBack={() => setCurrentScreen('admin-dashboard')}
                onUpdateClientMembership={handleUpdateClientMembership}
              />
            )}

            {/* SCREEN 11: Cierre de Caja y Finanzas */}
            {currentScreen === 'cierre-caja' && (
              <Screen11_CierreCaja
                onBack={() => setCurrentScreen('admin-dashboard')}
                onRefreshData={refreshAllData}
              />
            )}
          </Suspense>
        </div>

        {/* Bottom Navigation Bar */}
        {currentScreen !== 'welcome' && (
          <BottomNav
            currentScreen={currentScreen}
            onNavigate={setCurrentScreen}
            role={role}
          />
        )}
      </MobileFrame>
    </div>
  );
}

export default App;
