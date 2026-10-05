-- ==========================================================
-- PANTHER RIDE INDOOR CYCLING - ESQUEMA SUPABASE POSTGRESQL
-- Studio Zarzal, Valle
-- ==========================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TIPOS ENUM
CREATE TYPE user_role AS ENUM ('client', 'admin', 'instructor');
CREATE TYPE class_status AS ENUM ('active', 'completed', 'cancelled');
CREATE TYPE booking_status AS ENUM ('confirmed', 'attended', 'cancelled');
CREATE TYPE bike_status AS ENUM ('available', 'reserved', 'maintenance');

-- 3. TABLA DE PERFILES (Vinculada a Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'client',
  total_rides INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. TABLA DE BICICLETAS (14 Unidades de la Sala Zarzal)
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
  price NUMERIC(10, 2) DEFAULT 0,
  class_type TEXT DEFAULT 'Energía • Resistencia • Combinado',
  status class_status DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. TABLA DE RESERVAS (Evita sobreventa y doble asiento)
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_code VARCHAR(30) UNIQUE NOT NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  bike_id INTEGER REFERENCES public.bikes(id) NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  bike_number VARCHAR(2) NOT NULL,
  status booking_status DEFAULT 'confirmed',
  total_paid NUMERIC(10, 2) DEFAULT 0,
  qr_code_value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(class_id, bike_id) -- Garantía absoluta contra doble reserva de la misma bicicleta
);

-- 7. REGLAS ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bikes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública para la sala y clases
CREATE POLICY "Cualquiera puede ver clases activas" ON public.classes
  FOR SELECT USING (status = 'active');

CREATE POLICY "Cualquiera puede ver disponibilidad de bicicletas" ON public.bikes
  FOR SELECT USING (true);

-- Políticas de reservas para usuarios autenticados
CREATE POLICY "Los usuarios pueden ver sus propias reservas" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden crear reservas" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 8. TRIGGER DE ACTUALIZACIÓN DE CUPOS DISPONIBLES
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

CREATE TRIGGER trg_update_spots
AFTER INSERT OR DELETE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION update_class_available_spots();
