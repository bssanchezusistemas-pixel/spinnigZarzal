-- Apply after the v1 studio schema, as database owner.
begin;
create schema if not exists studio_private;
revoke all on schema studio_private from public;
grant usage on schema studio_private to authenticated, anon;
create table public.studio_staff(user_id uuid primary key references auth.users on delete cascade);
alter table public.studio_staff enable row level security;
revoke all on public.studio_staff from public, anon, authenticated;
grant select on public.studio_staff to authenticated;
create policy staff_self on public.studio_staff for select to authenticated using(user_id=(select auth.uid()));
create function studio_private.staff() returns boolean language sql stable security definer set search_path='' as $$
 select exists(select from public.studio_staff where user_id=auth.uid())
$$;
create function studio_private.phone_key(p text) returns text language sql immutable as $$
 select regexp_replace(regexp_replace(p,'[^0-9]','','g'), '^57([0-9]{10})$', '\1')
$$;
create unique index clients_normalized_phone_key on public.clients(studio_private.phone_key(phone));
alter table public.reservations add column owner_id uuid references auth.users;
create index reservations_owner on public.reservations(owner_id);
-- Link only unambiguous legacy sessions. Unlinked tickets still occupy their original time slot.
update public.reservations r set class_id=c.id from public.classes c
 where r.class_id is null and (r.class_date,r.class_time)=(c.class_date,c.start_time)
 and not exists(select from public.classes x where x.id<>c.id and (x.class_date,x.start_time)=(c.class_date,c.start_time));
create unique index studio_one_room_session on public.classes(class_date,start_time) where status='active';
create unique index reservations_active_seat on public.reservations(class_id,bike_number) where status <> 'cancelled';
create unique index reservations_room_slot on public.reservations(class_date,class_time,bike_number) where status <> 'cancelled';
create unique index reservations_one_rider on public.reservations(class_id,owner_id) where status <> 'cancelled';
update public.bikes set status='available' where status='reserved';
alter table public.bikes add constraint bikes_physical_state check(status in ('available','maintenance'));
alter table public.daily_payments add column reservation_id uuid unique references public.reservations;
create index daily_payments_day on public.daily_payments(payment_date);
create table public.studio_plans(id text primary key, details jsonb not null);
revoke execute on function public.check_client_membership(text), public.confirm_booking_fast(text,date,time,text,text,text,text,text) from public,anon,authenticated;
do $$ declare t text; begin
 foreach t in array array['clients','memberships','bikes','classes','reservations','cash_closures','daily_payments','studio_plans'] loop
 execute format('alter table public.%I enable row level security',t);
 execute format('revoke all on public.%I from public,anon,authenticated',t);
 execute format('grant select on public.%I to authenticated',t);
 execute format('create policy studio_staff_read on public.%I for select to authenticated using ((select studio_private.staff()))',t);
 end loop;
end $$;
grant select on public.classes,public.studio_plans to anon;
create policy class_schedule on public.classes for select using(status='active');
create policy plan_catalog on public.studio_plans for select using(true);
create policy own_tickets on public.reservations for select to authenticated using(owner_id=(select auth.uid()));
grant insert,update on public.classes,public.studio_plans to authenticated;
grant update(status) on public.bikes to authenticated;
create policy staff_classes on public.classes for all to authenticated using((select studio_private.staff())) with check((select studio_private.staff()));
create policy staff_plans on public.studio_plans for all to authenticated using((select studio_private.staff())) with check((select studio_private.staff()));
create policy staff_bikes on public.bikes for update to authenticated using((select studio_private.staff())) with check((select studio_private.staff()));
create function studio_private.protect_session() returns trigger language plpgsql security definer set search_path='' as $$
declare booked integer;
begin
 select count(*) into booked from public.reservations where status<>'cancelled'
 and (class_id=old.id or (class_date,class_time)=(old.class_date,old.start_time));
 if booked>0 and (new.status is distinct from old.status or
 (new.class_date,new.start_time) is distinct from (old.class_date,old.start_time)
 or least(new.total_spots,new.available_spots)<booked) then
 raise exception 'La clase tiene reservas. Conserva el horario y los cupos ya asignados.'; end if;
 return new;
end $$;
create trigger protect_scheduled_session before update on public.classes for each row execute function studio_private.protect_session();

create function studio_private.seats(p_class uuid) returns table(id integer,number varchar,status text) language sql stable security definer set search_path='' as $$
 select b.id,b.number,case when b.status='maintenance' then b.status when exists(
 select from public.reservations r where (r.class_date,r.class_time)=(c.class_date,c.start_time)
 and r.bike_number=b.number and r.status<>'cancelled') then 'reserved' else 'available' end
 from public.bikes b join public.classes c on c.id=p_class and c.status='active' order by b.number
$$;
create function public.studio_seats(p_class uuid) returns table(id integer,number varchar,status text) language sql stable set search_path='' as $$select * from studio_private.seats(p_class)$$;

create function studio_private.book(p_class uuid,p_bike text,p_name text,p_request uuid,p_membership boolean) returns public.reservations
language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid(); verified_phone text; c public.classes; r public.reservations; member public.memberships; customer uuid; code text;
begin
 select studio_private.phone_key(a.phone) into verified_phone from auth.users a where a.id=u and phone_confirmed_at is not null;
 if verified_phone is null or verified_phone !~ '^[0-9]{10}$' then raise exception 'Verifica tu celular colombiano para reservar.'; end if;
 if nullif(trim(p_name),'') is null or p_request is null then raise exception 'Completa los datos de reserva.'; end if;
 select * into strict c from public.classes where id=p_class for update;
 select * into r from public.reservations where owner_id=u and class_id=p_class and status<>'cancelled';
 if found then
 if r.id=p_request or r.bike_number=p_bike then return r; end if;
 raise exception 'Ya tienes una bicicleta en esta clase.'; end if;
 perform pg_advisory_xact_lock(73219,c.class_date-date '2000-01-01');
 if exists(select from public.cash_closures where closure_date=c.class_date) or c.status<>'active' or c.class_date+c.start_time <= now() at time zone 'America/Bogota' then raise exception 'La sesión ya está cerrada.'; end if;
 perform from public.bikes where number=p_bike and status='available' for share;
 if not found or exists(select from public.reservations where (class_date,class_time,bike_number)=(c.class_date,c.start_time,p_bike) and status<>'cancelled') then raise exception 'Bicicleta ocupada o en mantenimiento. Elige otra.'; end if;
 if (select count(*) from public.reservations where (class_date,class_time)=(c.class_date,c.start_time) and status<>'cancelled') >= least(c.total_spots,c.available_spots) then raise exception 'Clase sin cupos.'; end if;
 insert into public.clients(full_name,phone) values(trim(p_name),verified_phone) on conflict do nothing;
 select id into strict customer from public.clients where studio_private.phone_key(clients.phone)=verified_phone and status='active';
 if p_membership then
 select * into member from public.memberships where client_id=customer and status='active' and remaining_classes>0 and start_date<=c.class_date and expires_at>=c.class_date order by expires_at,id limit 1 for update;
 if not found then raise exception 'No tienes saldo de membresía vigente para esa clase.'; end if;
 update public.memberships set remaining_classes=remaining_classes-1,status=case when remaining_classes=1 then 'exhausted' else status end where id=member.id;
 end if;
 code:='BR-'||substr(replace(gen_random_uuid()::text,'-',''),1,24);
 insert into public.reservations(id,owner_id,booking_code,class_id,class_date,class_time,bike_number,client_id,client_name,client_phone,client_type,payment_status,payment_method,amount_paid,status,qr_code_value,membership_id)
 values(p_request,u,code,c.id,c.class_date,c.start_time,p_bike,customer,trim(p_name),verified_phone,case when p_membership then 'mensualidad' else 'particular' end,case when p_membership then 'included_in_membership' else 'pending' end,case when p_membership then 'mensualidad' else 'efectivo' end,case when p_membership then 0 else c.price_particular end,'confirmed',code,member.id) returning * into r;
 update public.clients set total_rides=total_rides+1 where id=customer;
 return r;
end $$;
create function public.studio_book(p_class uuid,p_bike text,p_name text,p_request uuid,p_membership boolean) returns public.reservations language sql set search_path='' as $$select * from studio_private.book(p_class,p_bike,p_name,p_request,p_membership)$$;

create function studio_private.cash(p_day date,p_action text,p_data jsonb) returns void language plpgsql security definer set search_path='' as $$
declare r public.reservations; pay_method text:=p_data->>'method';
begin
 if not studio_private.staff() then raise exception 'Solo personal autorizado.'; end if;
 perform pg_advisory_xact_lock(73219,p_day-date '2000-01-01');
 if exists(select from public.cash_closures where closure_date=p_day) then raise exception 'La caja de esta jornada ya está cerrada.'; end if;
 if p_action='close' then
 insert into public.cash_closures(closure_date,closed_by,notes,total_income,total_cash,total_nequi,total_bancolombia,total_cards,total_pending,total_riders,riders_with_membership,riders_particular)
 select p_day,auth.uid()::text,p_data->>'notes',coalesce(sum(amount),0),coalesce(sum(amount) filter(where method='efectivo'),0),coalesce(sum(amount) filter(where method='nequi'),0),coalesce(sum(amount) filter(where method='bancolombia'),0),coalesce(sum(amount) filter(where method='tarjeta'),0),
 (select coalesce(sum(amount_paid),0) from public.reservations where class_date=p_day and status<>'cancelled' and payment_status='pending'),
 (select count(*) from public.reservations where class_date=p_day and status<>'cancelled'),
 (select count(*) from public.reservations where class_date=p_day and status<>'cancelled' and client_type='mensualidad'),
 (select count(*) from public.reservations where class_date=p_day and status<>'cancelled' and client_type='particular') from public.daily_payments where payment_date=p_day;
 return;
 end if;
 if pay_method is null or pay_method not in ('efectivo','nequi','bancolombia','tarjeta') then raise exception 'Medio de pago inválido.'; end if;
 if p_action='collect' then
 select * into strict r from public.reservations where id=(p_data->>'id')::uuid and class_date=p_day and status<>'cancelled' for update;
 if r.payment_status='paid' then return; end if;
 if r.payment_status<>'pending' then raise exception 'La reserva no tiene saldo pendiente.'; end if;
 insert into public.daily_payments(reservation_id,payment_date,payment_time,client_name,client_phone,concept,concept_label,amount,method)
 values(r.id,p_day,(now() at time zone 'America/Bogota')::time,r.client_name,r.client_phone,'clase_particular','Clase individual',r.amount_paid,pay_method);
 update public.reservations set payment_method=pay_method,payment_status='paid' where id=r.id;
 elsif p_action='sale' and (p_data->>'amount')::numeric>0 then
 insert into public.daily_payments(id,payment_date,payment_time,client_name,client_phone,concept,concept_label,amount,method,notes)
 values((p_data->>'id')::uuid,p_day,(now() at time zone 'America/Bogota')::time,p_data->>'name',p_data->>'phone',p_data->>'concept',p_data->>'label',(p_data->>'amount')::numeric,pay_method,p_data->>'notes') on conflict(id) do nothing;
 else raise exception 'Movimiento inválido.'; end if;
end $$;
create function public.studio_cash(p_day date,p_action text,p_data jsonb) returns void language sql set search_path='' as $$select studio_private.cash(p_day,p_action,p_data)$$;

create function studio_private.client_plan(p_id uuid,p_name text,p_phone text,p_email text,p_plan text,p_label text,p_count integer,p_days integer) returns void language plpgsql security definer set search_path='' as $$
begin
 if not studio_private.staff() then raise exception 'Solo personal autorizado.'; end if;
 if p_id is null then
 if studio_private.phone_key(p_phone) !~ '^[0-9]{10}$' then raise exception 'Celular inválido.'; end if;
 insert into public.clients(full_name,phone,email) values(p_name,studio_private.phone_key(p_phone),p_email) returning id into p_id;
 end if;
 perform from public.clients where id=p_id for update;
 update public.memberships set status='cancelled' where client_id=p_id and status='active';
 if p_plan<>'individual' then
 insert into public.memberships(client_id,plan_id,plan_name,total_classes,remaining_classes,start_date,expires_at)
 values(p_id,p_plan,p_label,p_count,p_count,(now() at time zone 'America/Bogota')::date,(now() at time zone 'America/Bogota')::date+p_days);
 end if;
 update public.clients set client_type=case when p_plan='individual' then 'particular' else 'mensualidad' end where id=p_id;
end $$;
create function public.studio_client_plan(p_id uuid,p_name text,p_phone text,p_email text,p_plan text,p_label text,p_count integer,p_days integer)
 returns void language sql set search_path='' as $$select studio_private.client_plan(p_id,p_name,p_phone,p_email,p_plan,p_label,p_count,p_days)$$;
revoke all on all functions in schema studio_private from public,anon,authenticated;
grant execute on function studio_private.seats(uuid) to anon,authenticated;
grant execute on function studio_private.staff(),studio_private.phone_key(text),studio_private.book(uuid,text,text,uuid,boolean),studio_private.cash(date,text,jsonb),studio_private.client_plan(uuid,text,text,text,text,text,integer,integer) to authenticated;
revoke all on function public.studio_book(uuid,text,text,uuid,boolean),public.studio_cash(date,text,jsonb),public.studio_client_plan(uuid,text,text,text,text,text,integer,integer) from public,anon;
grant execute on function public.studio_book(uuid,text,text,uuid,boolean),public.studio_cash(date,text,jsonb),public.studio_client_plan(uuid,text,text,text,text,text,integer,integer) to authenticated;
grant execute on function public.studio_seats(uuid) to anon,authenticated;
create function studio_private.day_capacity(p_day date) returns table(class_id uuid,free integer) language sql stable security definer set search_path='' as $$
 select c.id, greatest(0,least(
   least(c.total_spots,c.available_spots)-(select count(*)::int from public.reservations r where (r.class_date,r.class_time)=(c.class_date,c.start_time) and r.status<>'cancelled'),
   (select count(*)::int from studio_private.seats(c.id) b where b.status='available')
 )) from public.classes c where c.class_date=p_day and c.status='active'
$$;
create function public.studio_day_capacity(p_day date) returns table(class_id uuid,free integer) language sql stable set search_path='' as $$select * from studio_private.day_capacity(p_day)$$;
create function studio_private.my_profile() returns table(name text,plan text) language sql stable security definer set search_path='' as $$
 select c.full_name,(select m.plan_name from public.memberships m where m.client_id=c.id and m.status='active' and m.remaining_classes>0 and (now() at time zone 'America/Bogota')::date between m.start_date and m.expires_at order by m.expires_at,m.id limit 1)
 from auth.users a join public.clients c on studio_private.phone_key(c.phone)=studio_private.phone_key(a.phone)
 where a.id=auth.uid() and a.phone_confirmed_at is not null and c.status='active'
$$;
create function public.studio_my_profile() returns table(name text,plan text) language sql stable set search_path='' as $$select * from studio_private.my_profile()$$;
revoke all on function studio_private.day_capacity(date),studio_private.my_profile(),public.studio_my_profile() from public,anon;
grant execute on function studio_private.day_capacity(date),public.studio_day_capacity(date) to anon,authenticated;
grant execute on function studio_private.my_profile(),public.studio_my_profile() to authenticated;
commit;
