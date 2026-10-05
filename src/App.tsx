import { useState } from 'react';
import type { ScreenId, UserRole, Bike, ClassSession, Reservation, ClientUser, BikeStatus } from './types';
import { initialBikes, defaultClass, scheduledClassesList, initialReservation, initialClients } from './data/mockData';
import { DemoToolbar } from './components/common/DemoToolbar';
import { MobileFrame } from './components/common/MobileFrame';
import { BottomNav } from './components/common/BottomNav';

// Screens
import { Screen1_Welcome } from './components/screens/Screen1_Welcome';
import { Screen2_ClassSelection } from './components/screens/Screen2_ClassSelection';
import { Screen3_BikeSelection } from './components/screens/Screen3_BikeSelection';
import { Screen4_Confirmation } from './components/screens/Screen4_Confirmation';
import { Screen5_TicketQR } from './components/screens/Screen5_TicketQR';
import { Screen6_MyClasses } from './components/screens/Screen6_MyClasses';
import { Screen7_Calendar } from './components/screens/Screen7_Calendar';
import { Screen8_AdminDashboard } from './components/screens/Screen8_AdminDashboard';
import { Screen9_BikeManagement } from './components/screens/Screen9_BikeManagement';
import { Screen10_ClientsList } from './components/screens/Screen10_ClientsList';

export function App() {
  // Navigation & Role states
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('welcome');
  const [role, setRole] = useState<UserRole>('client');
  const [isSimulator, setIsSimulator] = useState<boolean>(true);

  // Application Data states
  const [bikes, setBikes] = useState<Bike[]>(initialBikes);
  const [currentClass, setCurrentClass] = useState<ClassSession>(defaultClass);
  const [scheduledClasses] = useState<ClassSession[]>(scheduledClassesList);
  const [reservations, setReservations] = useState<Reservation[]>([initialReservation]);
  const [selectedBikeId, setSelectedBikeId] = useState<number | null>(7);
  const [clients] = useState<ClientUser[]>(initialClients);

  // Active reservation being viewed on Ticket QR screen
  const [activeReservation, setActiveReservation] = useState<Reservation>(initialReservation);

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
    setBikes(initialBikes);
    setCurrentClass(defaultClass);
    setReservations([initialReservation]);
    setSelectedBikeId(7);
    setActiveReservation(initialReservation);
    alert('Datos de la demo reiniciados al estado original.');
  };

  const handleStartBooking = () => {
    setCurrentScreen('class-selection');
  };

  const handleContinueClassSelection = (updated?: Partial<ClassSession>) => {
    if (updated) {
      setCurrentClass((prev) => ({ ...prev, ...updated }));
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

  const handleConfirmBooking = () => {
    const selectedBike = bikes.find((b) => b.id === selectedBikeId);
    const bikeNumber = selectedBike ? selectedBike.number : '07';

    const newBookingCode = `PR-20260925-0${bikeNumber}`;
    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      bookingCode: newBookingCode,
      classId: currentClass.id,
      className: currentClass.type,
      dateFormatted: currentClass.dateFormatted,
      time: currentClass.time,
      bikeNumber: bikeNumber,
      instructorName: currentClass.instructor.name,
      status: 'confirmed',
      qrValue: `PANTHER-RIDE:${newBookingCode}:BIKE-${bikeNumber}`,
      createdAt: new Date().toISOString(),
    };

    // Update bike state to reserved
    setBikes((prev) =>
      prev.map((b) =>
        b.id === selectedBikeId
          ? {
              ...b,
              status: 'reserved',
              reservedBy: {
                name: 'Cliente Demo (Tú)',
                email: 'cliente@demo.com',
                phone: '+57 300 000 0000',
                reservationCode: newBookingCode,
                time: currentClass.time,
              },
            }
          : b
      )
    );

    // Decrease spots
    setCurrentClass((prev) => ({
      ...prev,
      availableSpots: Math.max(0, prev.availableSpots - 1),
    }));

    setReservations((prev) => [newReservation, ...prev]);
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
    setBikes((prev) =>
      prev.map((b) => (b.id === bikeId ? { ...b, status: newStatus } : b))
    );
  };

  const selectedBikeObj = bikes.find((b) => b.id === selectedBikeId);

  return (
    <div className="min-h-screen bg-[#06080B] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
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
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* SCREEN 1: Inicio / Bienvenida */}
          {currentScreen === 'welcome' && (
            <Screen1_Welcome
              onStartBooking={handleStartBooking}
              onLogin={handleToggleRole}
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

          {/* SCREEN 4: Confirmación de Reserva */}
          {currentScreen === 'confirmation' && (
            <Screen4_Confirmation
              currentClass={currentClass}
              bikeNumber={selectedBikeObj ? selectedBikeObj.number : '07'}
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
              scheduledClasses={scheduledClasses}
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

          {/* SCREEN 9 (10): Gestión de Bicicletas */}
          {currentScreen === 'bike-management' && (
            <Screen9_BikeManagement
              bikes={bikes}
              onUpdateBikeStatus={handleUpdateBikeStatus}
              onBack={() => setCurrentScreen('admin-dashboard')}
            />
          )}

          {/* SCREEN 10 (11): Clientes y Reportes */}
          {currentScreen === 'clients-list' && (
            <Screen10_ClientsList
              clients={clients}
              onBack={() => setCurrentScreen('admin-dashboard')}
            />
          )}
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
