-- ==========================================================
-- BLACK RIDE INDOOR CYCLING - SCHEMA & MEMBERSHIP VERIFICATION
-- Studio Zarzal, Valle del Cauca, Colombia
-- ==========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLA DE CLIENTES
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  email TEXT,
  avatar_url TEXT,
  client_type TEXT DEFAULT 'particular', -- 'mensualidad' | 'particular'
  status TEXT DEFAULT 'active',          -- 'active' | 'inactive'
  total_rides INTEGER DEFAULT 0,
  joined_date TEXT DEFAULT 'Noviembre 2026',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. TABLA DE MEMBRESÍAS
CREATE TABLE IF NOT EXISTS public.memberships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  plan_id TEXT NOT NULL,                -- 'starter' | 'pro' | 'premium' | 'elite'
  plan_name TEXT NOT NULL,              -- 'STARTER (4 Clases)', etc.
  total_classes INTEGER NOT NULL,
  remaining_classes INTEGER NOT NULL,
  start_date DATE DEFAULT CURRENT_DATE NOT NULL,
  expires_at DATE NOT NULL,
  status TEXT DEFAULT 'active',         -- 'active' | 'expired' | 'exhausted' | 'cancelled'
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. TABLA DE BICICLETAS (14 Unidades en Sala)
CREATE TABLE IF NOT EXISTS public.bikes (
  id SERIAL PRIMARY KEY,
  number VARCHAR(2) NOT NULL UNIQUE,
  status TEXT DEFAULT 'available',       -- 'available' | 'reserved' | 'maintenance'
  model TEXT DEFAULT 'Panther Studio Pro 2026',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Poblar 14 bicicletas
INSERT INTO public.bikes (number, status) VALUES
  ('01', 'available'), ('02', 'available'), ('03', 'available'), ('04', 'available'),
  ('05', 'available'), ('06', 'available'), ('07', 'available'), ('08', 'available'),
  ('09', 'available'), ('10', 'available'), ('11', 'available'), ('12', 'available'),
  ('13', 'available'), ('14', 'available')
ON CONFLICT (number) DO NOTHING;

-- 4. TABLA DE CLASES PROGRAMADAS
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Indoor Cycling',
  class_date DATE NOT NULL,
  start_time TIME NOT NULL,
  instructor_name TEXT NOT NULL DEFAULT 'Andrés Ramírez',
  instructor_avatar TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  total_spots INTEGER DEFAULT 14,
  available_spots INTEGER DEFAULT 14,
  price_particular NUMERIC(10, 2) DEFAULT 10000,
  class_type TEXT DEFAULT 'Energía • Resistencia • Ritmo',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. TABLA DE RESERVAS
CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_code VARCHAR(30) UNIQUE NOT NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  class_date DATE NOT NULL,
  class_time TIME NOT NULL,
  bike_number VARCHAR(2) NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_type TEXT DEFAULT 'particular',       -- 'mensualidad' | 'particular'
  payment_status TEXT DEFAULT 'pending',       -- 'paid' | 'pending' | 'included_in_membership'
  payment_method TEXT DEFAULT 'efectivo',
  amount_paid NUMERIC(10, 2) DEFAULT 0,
  status TEXT DEFAULT 'confirmed',             -- 'confirmed' | 'attended' | 'cancelled'
  qr_code_value TEXT NOT NULL,
  membership_id UUID REFERENCES public.memberships(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. TABLA DE CIERRE DE CAJA
CREATE TABLE IF NOT EXISTS public.cash_closures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  closure_date DATE UNIQUE NOT NULL,
  closed_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  closed_by TEXT NOT NULL DEFAULT 'Administración Black Ride',
  total_income NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total_cash NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total_nequi NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total_bancolombia NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total_cards NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total_pending NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total_riders INTEGER NOT NULL DEFAULT 0,
  riders_with_membership INTEGER NOT NULL DEFAULT 0,
  riders_particular INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  status TEXT DEFAULT 'closed',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. TABLA DE PAGOS Y VENTAS DIARIAS
CREATE TABLE IF NOT EXISTS public.daily_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_date DATE DEFAULT CURRENT_DATE NOT NULL,
  payment_time TIME DEFAULT CURRENT_TIME NOT NULL,
  client_name TEXT NOT NULL,
  client_phone TEXT,
  concept TEXT NOT NULL,
  concept_label TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  method TEXT NOT NULL DEFAULT 'efectivo',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==========================================================
-- 8. FUNCIÓN RPC: CONSULTAR MEMBRESÍA POR WHATSAPP / CELULAR
-- ==========================================================
CREATE OR REPLACE FUNCTION public.check_client_membership(p_phone TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_clean_phone TEXT;
  v_client RECORD;
  v_membership RECORD;
BEGIN
  -- Limpiar el número de teléfono: solo dígitos
  v_clean_phone := regexp_replace(p_phone, '[^0-9]', '', 'g');
  
  -- Si tiene prefijo 57 (Colombia) y 12 dígitos, extraer los últimos 10
  IF length(v_clean_phone) = 12 AND starts_with(v_clean_phone, '57') THEN
    v_clean_phone := substring(v_clean_phone from 3);
  END IF;

  -- Buscar al cliente (coincidencia con los últimos 10 dígitos o teléfono directo)
  SELECT * INTO v_client
  FROM public.clients
  WHERE regexp_replace(phone, '[^0-9]', '', 'g') LIKE '%' || v_clean_phone
  ORDER BY created_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'found', false,
      'has_membership', false,
      'client_type', 'particular',
      'price_to_pay', 10000,
      'message', 'Cliente no registrado. Tarifa particular $10.000 COP'
    );
  END IF;

  -- Buscar membresía activa con cupos y dentro de fecha de vigencia
  SELECT * INTO v_membership
  FROM public.memberships
  WHERE client_id = v_client.id
    AND status = 'active'
    AND expires_at >= CURRENT_DATE
    AND remaining_classes > 0
  ORDER BY expires_at ASC
  LIMIT 1;

  IF FOUND THEN
    RETURN jsonb_build_object(
      'found', true,
      'client_id', v_client.id,
      'client_name', v_client.full_name,
      'phone', v_client.phone,
      'has_membership', true,
      'client_type', 'mensualidad',
      'membership_id', v_membership.id,
      'plan_id', v_membership.plan_id,
      'plan_name', v_membership.plan_name,
      'remaining_classes', v_membership.remaining_classes,
      'total_classes', v_membership.total_classes,
      'expires_at', v_membership.expires_at,
      'price_to_pay', 0,
      'benefit_favorite_bike', true,
      'message', '¡Membresía Activa! Beneficio Mi Bicicleta Favorita ($0 COP)'
    );
  ELSE
    RETURN jsonb_build_object(
      'found', true,
      'client_id', v_client.id,
      'client_name', v_client.full_name,
      'phone', v_client.phone,
      'has_membership', false,
      'client_type', 'particular',
      'price_to_pay', 10000,
      'message', 'Cliente registrado sin membresía activa. Tarifa particular $10.000 COP'
    );
  END IF;
END;
$$;

-- ==========================================================
-- 9. FUNCIÓN RPC: CREAR RESERVA CON DESCUENTO ATÓMICO
-- ==========================================================
CREATE OR REPLACE FUNCTION public.confirm_booking_fast(
  p_booking_code TEXT,
  p_class_date DATE,
  p_class_time TIME,
  p_bike_number TEXT,
  p_client_name TEXT,
  p_client_phone TEXT,
  p_client_type TEXT,
  p_payment_method TEXT DEFAULT 'efectivo'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_client_id UUID;
  v_membership RECORD;
  v_payment_status TEXT;
  v_amount_paid NUMERIC(10, 2) := 0;
  v_clean_phone TEXT;
  v_reservation_id UUID;
BEGIN
  v_clean_phone := regexp_replace(p_client_phone, '[^0-9]', '', 'g');
  IF length(v_clean_phone) = 12 AND starts_with(v_clean_phone, '57') THEN
    v_clean_phone := substring(v_clean_phone from 3);
  END IF;

  -- 1. Buscar o crear cliente
  SELECT id INTO v_client_id
  FROM public.clients
  WHERE regexp_replace(phone, '[^0-9]', '', 'g') LIKE '%' || v_clean_phone
  LIMIT 1;

  IF v_client_id IS NULL THEN
    INSERT INTO public.clients (full_name, phone, client_type)
    VALUES (p_client_name, p_client_phone, p_client_type)
    RETURNING id INTO v_client_id;
  END IF;

  -- 2. Validar si tiene membresía activa para aplicar beneficio
  IF p_client_type = 'mensualidad' THEN
    SELECT * INTO v_membership
    FROM public.memberships
    WHERE client_id = v_client_id
      AND status = 'active'
      AND expires_at >= CURRENT_DATE
      AND remaining_classes > 0
    FOR UPDATE
    LIMIT 1;

    IF FOUND THEN
      -- Descontar 1 clase
      UPDATE public.memberships
      SET remaining_classes = remaining_classes - 1,
          status = CASE WHEN remaining_classes - 1 <= 0 THEN 'exhausted' ELSE 'active' END
      WHERE id = v_membership.id;

      v_payment_status := 'included_in_membership';
      v_amount_paid := 0;
    ELSE
      -- Si no tiene membresía real, se fija como particular
      p_client_type := 'particular';
      v_payment_status := 'pending';
      v_amount_paid := 10000;
    END IF;
  ELSE
    v_payment_status := 'pending';
    v_amount_paid := 10000;
  END IF;

  -- 3. Crear la reserva
  INSERT INTO public.reservations (
    booking_code,
    class_date,
    class_time,
    bike_number,
    client_id,
    client_name,
    client_phone,
    client_type,
    payment_status,
    payment_method,
    amount_paid,
    status,
    qr_code_value,
    membership_id
  ) VALUES (
    p_booking_code,
    p_class_date,
    p_class_time,
    p_bike_number,
    v_client_id,
    p_client_name,
    p_client_phone,
    p_client_type,
    v_payment_status,
    p_payment_method,
    v_amount_paid,
    'confirmed',
    p_booking_code, -- El código QR lleva exactamente el mismo texto
    CASE WHEN FOUND THEN v_membership.id ELSE NULL END
  ) RETURNING id INTO v_reservation_id;

  -- Actualizar estado de bicicleta a reservada
  UPDATE public.bikes
  SET status = 'reserved'
  WHERE number = p_bike_number;

  -- Incrementar contador de clases del cliente
  UPDATE public.clients
  SET total_rides = total_rides + 1
  WHERE id = v_client_id;

  RETURN jsonb_build_object(
    'success', true,
    'reservation_id', v_reservation_id,
    'booking_code', p_booking_code,
    'client_type', p_client_type,
    'payment_status', v_payment_status,
    'amount_paid', v_amount_paid,
    'remaining_classes', CASE WHEN v_membership.id IS NOT NULL THEN v_membership.remaining_classes - 1 ELSE 0 END
  );
END;
$$;

-- ==========================================================
-- 10. CLIENTES Y MEMBRESÍAS DE PRUEBA INICIALES
-- ==========================================================
DO $$
DECLARE
  v_c1 UUID;
  v_c2 UUID;
  v_c3 UUID;
BEGIN
  -- Cliente 1: Mateo Valencia (Con Membresía Activa PREMIUM - 12 clases)
  INSERT INTO public.clients (full_name, phone, email, client_type, total_rides)
  VALUES ('Mateo Valencia', '3154829102', 'mateo.valencia@gmail.com', 'mensualidad', 4)
  ON CONFLICT (phone) DO UPDATE SET full_name = EXCLUDED.full_name
  RETURNING id INTO v_c1;

  INSERT INTO public.memberships (client_id, plan_id, plan_name, total_classes, remaining_classes, expires_at, status)
  VALUES (v_c1, 'premium', 'PREMIUM (12 clases • 20 días)', 12, 8, CURRENT_DATE + INTERVAL '20 days', 'active')
  ON CONFLICT DO NOTHING;

  -- Cliente 2: Valentina Ríos (Con Membresía PRO - 8 clases)
  INSERT INTO public.clients (full_name, phone, email, client_type, total_rides)
  VALUES ('Valentina Ríos', '3128945612', 'valentina.rios@gmail.com', 'mensualidad', 2)
  ON CONFLICT (phone) DO UPDATE SET full_name = EXCLUDED.full_name
  RETURNING id INTO v_c2;

  INSERT INTO public.memberships (client_id, plan_id, plan_name, total_classes, remaining_classes, expires_at, status)
  VALUES (v_c2, 'pro', 'PRO (8 clases • 15 días)', 8, 6, CURRENT_DATE + INTERVAL '15 days', 'active')
  ON CONFLICT DO NOTHING;

  -- Cliente 3: Carlos Restrepo (Particular - Sin membresía)
  INSERT INTO public.clients (full_name, phone, email, client_type, total_rides)
  VALUES ('Carlos Restrepo', '3187654321', 'carlos.restrepo@hotmail.com', 'particular', 1)
  ON CONFLICT (phone) DO UPDATE SET full_name = EXCLUDED.full_name
  RETURNING id INTO v_c3;
END $$;
