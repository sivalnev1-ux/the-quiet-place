/**
 * Supabase client — готов к подключению.
 *
 * Шаги для активации:
 * 1. Создай проект на https://supabase.com
 * 2. Скопируй .env.local.example → .env.local
 * 3. Заполни NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY
 * 4. Раскомментируй код ниже
 * 5. Выполни SQL из секции schema в Supabase SQL Editor
 * 6. Замени useLocalStorage-хуки в store.ts на Supabase-запросы
 */

// import { createClient } from '@supabase/supabase-js';
//
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
//
// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ---------------------------------------------------------------------------
// Supabase SQL Schema
// ---------------------------------------------------------------------------
/*
-- Выполни в Supabase SQL Editor:

CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  price_per_hour DECIMAL(10,2) NOT NULL,
  price_per_night DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_number TEXT UNIQUE NOT NULL,
  room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  booking_type TEXT CHECK (booking_type IN ('hourly', 'nightly')) NOT NULL,
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')) DEFAULT 'pending',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE room_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cleaning_buffer_minutes INTEGER DEFAULT 30,
  whatsapp_number TEXT DEFAULT '+79001234567',
  currency TEXT DEFAULT '₽'
);

-- Начальные данные
INSERT INTO settings (cleaning_buffer_minutes, whatsapp_number, currency)
VALUES (30, '+79001234567', '₽');

INSERT INTO rooms (name, description, price_per_hour, price_per_night) VALUES
  ('Room 1', 'Уютный номер с двуспальной кроватью', 500, 3500),
  ('Room 2', 'Просторный люкс с рабочей зоной', 700, 4500),
  ('Room 3', 'Романтический номер с панорамным видом', 600, 4000);

-- RLS политики (если нужна защита)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Разрешить чтение для всех
CREATE POLICY "Public read rooms" ON rooms FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);

-- Разрешить создание броней всем
CREATE POLICY "Public insert bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read bookings" ON bookings FOR SELECT USING (true);
*/

export {};
