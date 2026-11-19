import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { BLACK_RIDE_PLANS } from '../types';
import type {
  Bike,
  ClassSession,
  Reservation,
  ClientUser,
  MembershipPlan,
} from '../types';

export const today = () =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
export const dateLabel = (day: string) =>
  new Date(day + 'T12:00:00').toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
export function message(cause: unknown) {
  return typeof cause === 'object' && cause && 'message' in cause
    ? String(cause.message)
    : 'No se pudo completar la operación.';
}
export async function result<T>(
  query: PromiseLike<{ data: T | null; error: unknown }>,
) {
  const { data, error } = await query;
  if (error) throw error;
  return data as T;
}
// Keyed results prevent a previous date, session or identity flashing while a new request loads.
export function useResource<T>(
  key: string,
  load: () => Promise<T>,
  revision = 0,
): { value?: T; error?: string } {
  const [state, setState] = useState<{
    key: string;
    value?: T;
    error?: string;
  }>();
  useEffect(() => {
    let active = true;
    load().then(
      (value) => {
        if (active) setState({ key, value });
      },
      (cause) => {
        if (active) setState({ key, error: message(cause) });
      },
    );
    return () => {
      active = false;
    };
    // The key contains all query parameters and the refresh counter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, revision]);
  return state?.key === key ? state : {};
}

const classColumns =
  'id,title,date:class_date,time:start_time,coach:instructor_name,avatar:instructor_avatar,totalSpots:total_spots,availableSpots:available_spots,priceParticular:price_particular,type:class_type,status';
export async function classesFor(day: string): Promise<ClassSession[]> {
  const [rows, counts] = await Promise.all([
    result(
      supabase
        .from('classes')
        .select(classColumns)
        .eq('class_date', day)
        .eq('status', 'active')
        .order('start_time'),
    ),
    result<{ class_id: string; free: number }[]>(
      supabase.rpc('studio_day_capacity', { p_day: day }),
    ),
  ]);
  return rows.map((r) => ({
    ...r,
    free: counts.find((v) => v.class_id === r.id)?.free ?? 0,
    time: r.time.slice(0, 5),
    dateFormatted: dateLabel(r.date),
    instructor: { name: r.coach, avatar: r.avatar, specialty: r.type },
    description: r.type,
  }));
}
export async function saveClass(c: Omit<ClassSession, 'id'>, id?: string) {
  const row = {
    title: c.title,
    class_date: c.date,
    start_time: c.time,
    instructor_name: c.instructor.name,
    instructor_avatar: c.instructor.avatar,
    total_spots: c.totalSpots,
    available_spots: c.availableSpots,
    price_particular: c.priceParticular,
    class_type: c.description,
    status: c.status,
  };
  await result(
    (id
      ? supabase.from('classes').update(row).eq('id', id)
      : supabase.from('classes').insert(row)
    )
      .select('id')
      .single(),
  );
}
export const seats = (id: string) =>
  result<Bike[]>(supabase.rpc('studio_seats', { p_class: id }));
export const physicalBikes = () =>
  result<Bike[]>(
    supabase.from('bikes').select('id,number,status').order('number'),
  );
const ticketColumns =
  'id,bookingCode:booking_code,classId:class_id,date:class_date,time:class_time,bikeNumber:bike_number,clientName:client_name,clientPhone:client_phone,clientType:client_type,paymentStatus:payment_status,paymentMethod:payment_method,amountPaid:amount_paid,status,qrValue:qr_code_value,createdAt:created_at,classes(title,instructor_name)';
export async function tickets(filter: { owner: string } | { day: string }) {
  const q = supabase
    .from('reservations')
    .select(ticketColumns)
    .neq('status', 'cancelled')
    .order('class_date')
    .order('class_time');
  const rows = await result(
    'owner' in filter
      ? q.eq('owner_id', filter.owner)
      : q.eq('class_date', filter.day),
  );
  return rows.map((row) => {
    const c = row.classes as unknown as {
      title: string;
      instructor_name: string;
    } | null;
    return {
      ...row,
      time: row.time.slice(0, 5),
      dateFormatted: dateLabel(row.date),
      className: c?.title ?? 'Indoor Cycling',
      instructorName: c?.instructor_name ?? 'Studio Zarzal',
    } as Reservation;
  });
}
export async function book(
  c: ClassSession,
  bike: Bike,
  name: string,
  request: string,
  membership: boolean,
): Promise<Reservation> {
  const r = (await result(
    supabase
      .rpc('studio_book', {
        p_class: c.id,
        p_bike: bike.number,
        p_name: name,
        p_request: request,
        p_membership: membership,
      })
      .single(),
  )) as Record<string, string>;
  return {
    id: r.id,
    bookingCode: r.booking_code,
    classId: r.class_id,
    className: c.title,
    date: r.class_date,
    dateFormatted: dateLabel(r.class_date),
    time: r.class_time.slice(0, 5),
    bikeNumber: r.bike_number,
    instructorName: c.instructor.name,
    clientName: r.client_name,
    clientPhone: r.client_phone,
    clientType: r.client_type,
    paymentStatus: r.payment_status,
    paymentMethod: r.payment_method,
    amountPaid: Number(r.amount_paid),
    status: r.status,
    qrValue: r.qr_code_value,
    createdAt: r.created_at,
  } as Reservation;
}
export async function plans() {
  const overrides = await result(
    supabase.from('studio_plans').select('id,details'),
  );
  return BLACK_RIDE_PLANS.map(
    (p) =>
      (overrides.find((r) => r.id === p.id)?.details as MembershipPlan) ?? p,
  );
}
export async function clients(): Promise<ClientUser[]> {
  const rows = await result(
    supabase
      .from('clients')
      .select(
        'id,name:full_name,email,phone,avatar:avatar_url,status,totalRides:total_rides,joinedDate:joined_date,memberships(plan_name,expires_at,start_date,status,remaining_classes)',
      )
      .order('full_name'),
  );
  return rows.map((r) => {
    const m = r.memberships.find(
      (m) =>
        m.status === 'active' &&
        m.remaining_classes > 0 &&
        m.start_date <= today() &&
        m.expires_at >= today(),
    );
    return {
      ...r,
      email: r.email ?? '',
      avatar: r.avatar ?? '',
      clientType: m ? 'mensualidad' : 'particular',
      membershipStatus: m ? 'active' : 'none',
      membershipPlan: m?.plan_name,
      membershipExpiresAt: m?.expires_at,
    };
  });
}
export async function cashDay(day: string) {
  const [reservations, payments, closure, classes] = await Promise.all([
    tickets({ day }),
    result(
      supabase
        .from('daily_payments')
        .select(
          'id,date:payment_date,time:payment_time,clientName:client_name,conceptLabel:concept_label,amount,method,notes',
        )
        .eq('payment_date', day),
    ),
    result<{
      total_income: number;
      total_cash: number;
      total_nequi: number;
      total_bancolombia: number;
      total_cards: number;
      total_pending: number;
      total_riders: number;
      riders_with_membership: number;
      riders_particular: number;
      notes: string;
      closed_at: string;
    } | null>(
      supabase
        .from('cash_closures')
        .select(
          'total_income,total_cash,total_nequi,total_bancolombia,total_cards,total_pending,total_riders,riders_with_membership,riders_particular,notes,closed_at',
        )
        .eq('closure_date', day)
        .maybeSingle(),
    ),
    classesFor(day),
  ]);
  const sum = (method?: string) =>
    payments.reduce(
      (n, p) => n + (!method || method === p.method ? p.amount : 0),
      0,
    );
  const riders = reservations.length;
  const members = reservations.filter(
    (r) => r.clientType === 'mensualidad',
  ).length;
  const capacity = classes.reduce((n, c) => n + c.totalSpots, 0);
  return {
    reservations,
    payments,
    closure,
    totalIncome: closure?.total_income ?? sum(),
    totalCash: closure?.total_cash ?? sum('efectivo'),
    totalNequi: closure?.total_nequi ?? sum('nequi'),
    totalBancolombia: closure?.total_bancolombia ?? sum('bancolombia'),
    totalCards: closure?.total_cards ?? sum('tarjeta'),
    totalRiders: closure?.total_riders ?? riders,
    ridersWithMembership: closure?.riders_with_membership ?? members,
    ridersParticular: closure?.riders_particular ?? riders - members,
    totalPending:
      closure?.total_pending ??
      reservations.reduce(
        (n, r) => n + (r.paymentStatus === 'pending' ? r.amountPaid : 0),
        0,
      ),
    occupancyPercent: capacity ? Math.round((riders * 100) / capacity) : 0,
  };
}
export const cashAction = (day: string, action: string, data: object) =>
  result(
    supabase.rpc('studio_cash', { p_day: day, p_action: action, p_data: data }),
  );
