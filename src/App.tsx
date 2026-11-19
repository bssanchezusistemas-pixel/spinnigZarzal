import { lazy, Suspense, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { MobileFrame } from './components/common/MobileFrame';
import { BottomNav } from './components/common/BottomNav';
import { AccountForm } from './components/common/AdminLoginModal';
import { Screen1_Welcome } from './components/screens/Screen1_Welcome';
import { supabase } from './services/supabaseClient';
import * as studio from './services/studio';
import type { Bike, ClassSession, Reservation, ScreenId } from './types';

const Calendar = lazy(() =>
  import('./components/screens/Screen7_Calendar').then((m) => ({
    default: m.Screen7_Calendar,
  })),
);
const BikeMap = lazy(() =>
  import('./components/screens/Screen3_BikeSelection').then((m) => ({
    default: m.Screen3_BikeSelection,
  })),
);
const Confirm = lazy(() =>
  import('./components/screens/Screen4_Confirmation').then((m) => ({
    default: m.Screen4_Confirmation,
  })),
);
const Ticket = lazy(() =>
  import('./components/screens/Screen5_TicketQR').then((m) => ({
    default: m.Screen5_TicketQR,
  })),
);
const MyClasses = lazy(() =>
  import('./components/screens/Screen6_MyClasses').then((m) => ({
    default: m.Screen6_MyClasses,
  })),
);
const Cash = lazy(() =>
  import('./components/screens/Screen11_CierreCaja').then((m) => ({
    default: m.Screen11_CierreCaja,
  })),
);
const Dashboard = lazy(() =>
  import('./components/screens/Screen8_AdminDashboard').then((m) => ({
    default: m.Screen8_AdminDashboard,
  })),
);
const Fleet = lazy(() =>
  import('./components/screens/Screen9_BikeManagement').then((m) => ({
    default: m.Screen9_BikeManagement,
  })),
);
const Customers = lazy(() =>
  import('./components/screens/Screen10_ClientsList').then((m) => ({
    default: m.Screen10_ClientsList,
  })),
);
const Plans = lazy(() =>
  import('./components/screens/Screen_Plans').then((m) => ({
    default: m.Screen_Plans,
  })),
);

export function App() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [login, setLogin] = useState<'staff' | 'client' | null>(null);
  const [draft, setDraft] = useState<{
    session: ClassSession;
    bike: Bike;
  } | null>(null);
  const [destination, setDestination] = useState<ScreenId>('welcome');
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) =>
      setUser(session?.user ?? null),
    );
    return () => data.subscription.unsubscribe();
  }, []);
  function authenticate(staff: boolean, to: ScreenId) {
    setDestination(to);
    setLogin(staff ? 'staff' : 'client');
  }
  return (
    <div className="h-[100dvh] flex flex-col bg-[#06080B] text-slate-100 overflow-hidden">
      <MobileFrame isSimulator={false}>
        {login ? (
          <AccountForm
            key={login}
            staff={login === 'staff'}
            onBack={() => {
              setDraft(null);
              setDestination('welcome');
              setLogin(null);
            }}
            onSuccess={() => setLogin(null)}
          />
        ) : user === undefined ? (
          <p>Cargando sesión…</p>
        ) : (
          <Studio
            key={user?.id ?? 'guest'}
            user={user}
            initial={user ? destination : 'welcome'}
            draft={draft}
            authenticate={(staff, to, selection) => {
              setDraft(selection ?? null);
              authenticate(staff, to);
            }}
            onExit={() => {
              setDraft(null);
              setDestination('welcome');
            }}
          />
        )}
      </MobileFrame>
    </div>
  );
}

function Studio({
  user,
  initial,
  draft,
  authenticate,
  onExit,
}: {
  user: User | null;
  initial: ScreenId;
  draft: { session: ClassSession; bike: Bike } | null;
  authenticate: (
    staff: boolean,
    to: ScreenId,
    selection?: { session: ClassSession; bike: Bike },
  ) => void;
  onExit: () => void;
}) {
  const [screen, go] = useState<ScreenId>(initial);
  const [day, setDay] = useState(studio.today);
  const [version, update] = useState(0);
  const refresh = () => update((n) => n + 1);
  const [session, setSession] = useState<ClassSession | null>(
    draft?.session ?? null,
  );
  const [bike, setBike] = useState<Bike | null>(draft?.bike ?? null);
  const [ticket, setTicket] = useState<Reservation | null>(null);
  const [create, setCreate] = useState(false);
  const [error, setError] = useState('');
  const staff = studio.useResource(
    'role',
    async () =>
      user
        ? Boolean(
            await studio.result(
              supabase
                .from('studio_staff')
                .select('user_id')
                .eq('user_id', user.id)
                .maybeSingle(),
            ),
          )
        : false,
    version,
  );
  const profile = studio.useResource(
    'profile',
    () =>
      user?.phone_confirmed_at
        ? studio.result<{ name: string; plan: string | null }[]>(
            supabase.rpc('studio_my_profile'),
          )
        : Promise.resolve([]),
    version,
  );
  const identity = profile.value?.[0];
  const admin = staff.value === true;
  const schedule = screen === 'calendar' || screen === 'class-selection';
  const sessions = studio.useResource(
    day + schedule,
    () => (schedule ? studio.classesFor(day) : Promise.resolve([])),
    version,
  );
  const seats = studio.useResource(
    (session?.id ?? '') + screen,
    () =>
      session && screen === 'bike-selection'
        ? studio.seats(session.id)
        : Promise.resolve([]),
    version,
  );
  const history = studio.useResource(
    screen,
    () =>
      screen === 'my-classes' && user
        ? studio.tickets({ owner: user.id })
        : Promise.resolve([]),
    version,
  );
  const catalog = studio.useResource('plans', studio.plans, version);
  const staffCustomers = studio.useResource(
    screen + admin,
    () =>
      admin && ['clients-list', 'plans'].includes(screen)
        ? studio.clients()
        : Promise.resolve([]),
    version,
  );
  const fleet = studio.useResource(
    screen + admin,
    () =>
      admin && ['admin-dashboard', 'bike-management'].includes(screen)
        ? studio.physicalBikes()
        : Promise.resolve([]),
    version,
  );
  const summary = studio.useResource(
    screen + admin,
    () =>
      admin && screen === 'admin-dashboard'
        ? studio.cashDay(studio.today())
        : Promise.resolve(null),
    version,
  );
  useEffect(() => {
    function focus() {
      refresh();
    }
    window.addEventListener('focus', focus);
    return () => window.removeEventListener('focus', focus);
  }, []);
  function navigate(to: ScreenId) {
    setError('');
    setCreate(false);
    if (to === 'my-classes' && !user) {
      authenticate(false, to);
      return;
    }
    go(to);
  }
  async function logout() {
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error) {
      setError(error.message);
      return;
    }
    onExit();
    go('welcome');
  }
  function selectClass(c: ClassSession) {
    setSession(c);
    setBike(null);
    go('bike-selection');
  }
  async function editCustomer(
    id: string | null,
    planId: string,
    name = '',
    phone = '',
    email = '',
  ) {
    const plan = catalog.value?.find((p) => p.id === planId);
    if (!plan) throw new Error('Plan no disponible.');
    await studio.result(
      supabase.rpc('studio_client_plan', {
        p_id: id,
        p_plan: plan.id,
        p_label: plan.name,
        p_count: plan.classesCount,
        p_days: plan.validityDays,
        p_name: name,
        p_phone: phone,
        p_email: email,
      }),
    );
    refresh();
  }
  const failed =
    error ||
    profile.error ||
    staff.error ||
    sessions.error ||
    seats.error ||
    history.error ||
    catalog.error ||
    staffCustomers.error ||
    fleet.error ||
    summary.error;
  const adminOnly = [
    'admin-dashboard',
    'clients-list',
    'bike-management',
    'cierre-caja',
  ].includes(screen);
  const loading = (
    <p className="p-4" role="status">
      Cargando…
    </p>
  );
  return (
    <>
      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
        {failed && (
          <div role="alert" className="p-3 bg-red-950">
            {failed}{' '}
            <button
              className="underline"
              onClick={() => {
                setError('');
                refresh();
              }}
            >
              Reintentar
            </button>
          </div>
        )}
        <Suspense fallback={loading}>
          {adminOnly && !admin ? (
            staff.value === undefined ? (
              loading
            ) : (
              <div className="studio-panel">
                <p>Se necesita una cuenta de personal autorizada.</p>
                <button onClick={() => authenticate(true, 'admin-dashboard')}>
                  Ingresar
                </button>
              </div>
            )
          ) : (
            <>
              {screen === 'welcome' && (
                <Screen1_Welcome
                  currentUser={
                    user
                      ? {
                          name:
                            identity?.name ||
                            user.phone ||
                            user.email ||
                            'Rider',
                          clientType: identity?.plan
                            ? 'mensualidad'
                            : 'particular',
                          membershipStatus: identity?.plan ? 'active' : 'none',
                          membershipPlan: identity?.plan ?? undefined,
                        }
                      : null
                  }
                  onStartBooking={() => navigate('class-selection')}
                  onExploreSchedule={() => navigate('calendar')}
                  onViewPlans={() => navigate('plans')}
                  onOpenLoginModal={() =>
                    user
                      ? navigate('my-classes')
                      : authenticate(false, 'my-classes')
                  }
                  onOpenAdminLogin={() =>
                    admin
                      ? navigate('admin-dashboard')
                      : authenticate(true, 'admin-dashboard')
                  }
                />
              )}
              {schedule &&
                (sessions.value ? (
                  <Calendar
                    day={day}
                    changeDay={setDay}
                    scheduledClasses={sessions.value}
                    isAdmin={admin}
                    initialOpenCreateModal={create}
                    onSelectClass={selectClass}
                    onBack={() =>
                      navigate(admin ? 'admin-dashboard' : 'welcome')
                    }
                    onCreateClass={async (c) => {
                      await studio.saveClass(c);
                      refresh();
                    }}
                    onUpdateClass={async (c) => {
                      await studio.saveClass(c, c.id);
                      refresh();
                    }}
                    onDeleteClass={async (id) => {
                      await studio.result(
                        supabase
                          .from('classes')
                          .update({ status: 'cancelled' })
                          .eq('id', id)
                          .select('id')
                          .single(),
                      );
                      refresh();
                    }}
                  />
                ) : (
                  loading
                ))}
              {screen === 'bike-selection' &&
                session &&
                (seats.value ? (
                  <BikeMap
                    bikes={seats.value}
                    selectedBikeId={
                      seats.value?.find(
                        (s) => s.id === bike?.id && s.status === 'available',
                      )?.id ?? null
                    }
                    onSelectBike={(id) =>
                      setBike(
                        seats.value?.find(
                          (b) => b.id === id && b.status === 'available',
                        ) ?? null,
                      )
                    }
                    onBack={() => navigate('calendar')}
                    onConfirm={() => {
                      if (!user?.phone_confirmed_at) {
                        if (bike)
                          authenticate(false, 'confirmation', {
                            session,
                            bike,
                          });
                        return;
                      }
                      go('confirmation');
                    }}
                  />
                ) : (
                  loading
                ))}
              {screen === 'confirmation' &&
                session &&
                bike &&
                user &&
                (profile.value || profile.error) && (
                  <Confirm
                    session={session}
                    bike={bike}
                    phone={user.phone ?? ''}
                    defaultName={identity?.name}
                    hasPlan={Boolean(identity?.plan)}
                    onBack={() => {
                      setBike(null);
                      navigate('bike-selection');
                    }}
                    onConfirmed={(r) => {
                      setTicket(r);
                      go('ticket-qr');
                    }}
                  />
                )}
              {screen === 'ticket-qr' && ticket && user && (
                <Ticket
                  reservation={ticket}
                  onBack={() => navigate('my-classes')}
                  onGoToMyClasses={() => navigate('my-classes')}
                />
              )}
              {screen === 'my-classes' &&
                user &&
                (history.value ? (
                  <MyClasses
                    reservations={history.value}
                    onViewDetail={(r) => {
                      setTicket(r);
                      go('ticket-qr');
                    }}
                    onBookNewClass={() => navigate('class-selection')}
                  />
                ) : (
                  loading
                ))}
              {screen === 'plans' && catalog.value && (
                <Plans
                  plans={catalog.value}
                  clients={staffCustomers.value ?? []}
                  isAdmin={admin}
                  onBack={() => navigate(admin ? 'admin-dashboard' : 'welcome')}
                  onSelectPlanToBook={() => navigate('class-selection')}
                  onUpdatePlan={async (p) => {
                    await studio.result(
                      supabase
                        .from('studio_plans')
                        .upsert({ id: p.id, details: p })
                        .select('id')
                        .single(),
                    );
                    refresh();
                  }}
                />
              )}
              {screen === 'admin-dashboard' &&
                (summary.value && fleet.value && catalog.value ? (
                  <Dashboard
                    summary={summary.value}
                    bikes={fleet.value}
                    plans={catalog.value}
                    onNavigateScreen={navigate}
                    onLogoutAdmin={logout}
                    onOpenCreateClassModal={() => {
                      setCreate(true);
                      go('calendar');
                    }}
                  />
                ) : (
                  loading
                ))}
              {screen === 'bike-management' && fleet.value && (
                <Fleet
                  bikes={fleet.value}
                  onBack={() => navigate('admin-dashboard')}
                  onUpdateBikeStatus={async (id, status) => {
                    try {
                      await studio.result(
                        supabase
                          .from('bikes')
                          .update({ status })
                          .eq('id', id)
                          .select('id')
                          .single(),
                      );
                      refresh();
                    } catch (cause) {
                      setError(studio.message(cause));
                    }
                  }}
                />
              )}
              {screen === 'clients-list' &&
                staffCustomers.value &&
                catalog.value && (
                  <Customers
                    plans={catalog.value}
                    clients={staffCustomers.value}
                    onBack={() => navigate('admin-dashboard')}
                    onUpdateClientMembership={(id, _type, plan) =>
                      editCustomer(id, plan ?? 'individual')
                    }
                    onAddClient={(c) =>
                      editCustomer(
                        null,
                        c.membershipPlan ?? 'individual',
                        c.name,
                        c.phone,
                        c.email,
                      )
                    }
                  />
                )}
              {screen === 'cierre-caja' && (
                <Cash onBack={() => navigate('admin-dashboard')} />
              )}
            </>
          )}
        </Suspense>
      </div>
      {user && (
        <button
          className="self-end text-xs underline px-4 py-2"
          onClick={logout}
        >
          Cerrar sesión · {user.phone || user.email}
        </button>
      )}
      {screen !== 'welcome' && (
        <BottomNav
          currentScreen={screen}
          role={admin ? 'admin' : 'client'}
          onNavigate={navigate}
        />
      )}
    </>
  );
}
export default App;
