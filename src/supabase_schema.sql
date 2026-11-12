-- ==========================================================
-- BLACK RIDE INDOOR CYCLING - ESQUEMA SUPABASE POSTGRESQL (PRODUCCIÓN)
-- Studio Zarzal, Valle del Cauca, Colombia
-- ==========================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TIPOS ENUM
CREATE TYPE user_role AS ENUM ('client', 'admin', 'instructor');
CREATE TYPE class_status AS ENUM ('active', 'completed', 'cancelled');
CREATE TYPE booking_status AS ENUM ('confirmed', 'attended', 'cancelled');
CREATE TYPE bike_status AS ENUM ('available', 'reserved', 'maintenance');
CREATE TYPE client_type AS ENUM ('mensualidad', 'particular');
CREATE TYPE payment_status AS ENUM ('paid', 'pending', 'included_in_membership');
CREATE TYPE payment_method AS ENUM ('efectivo', 'nequi', 'bancolombia', 'tarjeta', 'mensualidad');

-- 3. TABLA DE PERFILES / CLIENTES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'client',
  client_type client_type DEFAULT 'particular',
  membership_status TEXT DEFAULT 'none', -- 'active', 'expired', 'none'
  membership_plan TEXT,                  -- 'Mensualidad Ilimitada', etc.
  membership_expires_at DATE,
  total_rides INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. TABLA DE BICICLETAS (14 Unidades - Sala Zarzal)
CREATE TABLE IF NOT EXISTS public.bikes (
  id SERIAL PRIMARY KEY,
  number VARCHAR(2) NOT NULL UNIQUE,
  status bike_status DEFAULT 'available',
  model TEXT DEFAULT 'Panther Studio Pro 2026',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Poblar las 14 bicicletas iniciales
INSERT INTO public.bikes (number, status) VALUES
  ('01', 'available'),
  ('02', 'available'),
  ('03', 'available'),
  ('04', 'available'),
  ('05', 'available'),
  ('06', 'available'),
  ('07', 'available'),
  ('08', 'available'),
  ('09', 'available'),
  ('10', 'available'),
  ('11', 'available'),
  ('12', 'available'),
  ('13', 'available'),
  ('14', 'available')
ON CONFLICT (number) DO NOTHING;

-- 5. TABLA DE CLASES PROGRAMADAS
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Indoor Cycling',
  class_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  instructor_id UUID REFERENCES public.profiles(id),
  instructor_name TEXT NOT NULL DEFAULT 'Andrés Ramírez',
  instructor_avatar TEXT,
  total_spots INTEGER DEFAULT 14,
  available_spots INTEGER DEFAULT 14,
  price_particular NUMERIC(10, 2) DEFAULT 10000, -- Tarifa clase individual $10.000 COP por sesión
  class_type TEXT DEFAULT 'Energía • Resistencia • Combinado',
  status class_status DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. TABLA DE RESERVAS
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_code VARCHAR(30) UNIQUE NOT NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  bike_id INTEGER REFERENCES public.bikes(id) NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  bike_number VARCHAR(2) NOT NULL,
  client_type client_type DEFAULT 'particular',
  payment_status payment_status DEFAULT 'pending',
  payment_method payment_method DEFAULT 'efectivo',
  amount_paid NUMERIC(10, 2) DEFAULT 0,
  status booking_status DEFAULT 'confirmed',
  qr_code_value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(class_id, bike_id) -- Garantía contra sobreventa del mismo asiento
);

-- 7. TABLA DE PAGOS Y VENTAS DIARIAS (FINANZAS)
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_date DATE DEFAULT CURRENT_DATE NOT NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_phone TEXT,
  concept TEXT NOT NULL, -- 'clase_particular', 'mensualidad', 'hidratacion', 'otro'
  concept_label TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  method payment_method NOT NULL DEFAULT 'efectivo',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. TABLA DE CIERRES DE CAJA (ARQUEOS DIARIOS)
CREATE TABLE IF NOT EXISTS public.cash_closures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  closure_date DATE UNIQUE NOT NULL,
  closed_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  closed_by TEXT NOT NULL,
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

-- 9. SEGURIDAD Y REGLAS ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bikes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cash_closures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública de clases activas" ON public.classes
  FOR SELECT USING (status = 'active');

CREATE POLICY "Lectura pública de bicicletas" ON public.bikes
  FOR SELECT USING (true);

CREATE POLICY "Usuarios ven sus propias reservas" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden crear reservas" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 10. TRIGGER PARA DESCONTAR Y REPONER CUPOS
CREATE OR REPLACE FUNCTION update_class_available_spots()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.classes 
    SET available_spots = available_spots - 1
    WHERE id = NEW.class_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.classes 
    SET available_spots = available_spots + 1
    WHERE id = OLD.class_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_spots ON public.bookings;
CREATE TRIGGER trg_update_spots
AFTER INSERT OR DELETE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION update_class_available_spots();
