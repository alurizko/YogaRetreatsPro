-- Создание схемы базы данных для YogaRetreatPro в Supabase

-- Включаем расширения
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Таблица профилей пользователей
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'organizer', 'admin')),
  avatar_url TEXT,
  phone TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Таблица категорий ретритов
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица стран
CREATE TABLE countries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица ретритов
CREATE TABLE retreats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  organizer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id),
  country_id UUID REFERENCES countries(id),
  location TEXT,
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  price_from DECIMAL(10, 2),
  price_to DECIMAL(10, 2),
  currency TEXT DEFAULT 'USD',
  duration_days INTEGER,
  max_participants INTEGER,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'all_levels')),
  age_min INTEGER,
  age_max INTEGER,
  start_date DATE,
  end_date DATE,
  booking_deadline DATE,
  featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled', 'completed')),
  images TEXT[], -- Массив URL изображений
  amenities TEXT[], -- Массив удобств
  included TEXT[], -- Что включено
  not_included TEXT[], -- Что не включено
  schedule JSONB, -- Расписание по дням
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица бронирований
CREATE TABLE bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  retreat_id UUID REFERENCES retreats(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  participants_count INTEGER DEFAULT 1,
  total_price DECIMAL(10, 2),
  currency TEXT DEFAULT 'USD',
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  payment_method TEXT,
  special_requests TEXT,
  emergency_contact JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица отзывов
CREATE TABLE reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  retreat_id UUID REFERENCES retreats(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  rating_overall INTEGER CHECK (rating_overall >= 1 AND rating_overall <= 5),
  rating_location INTEGER CHECK (rating_location >= 1 AND rating_location <= 5),
  rating_accommodation INTEGER CHECK (rating_accommodation >= 1 AND rating_accommodation <= 5),
  rating_food INTEGER CHECK (rating_food >= 1 AND rating_food <= 5),
  rating_instructor INTEGER CHECK (rating_instructor >= 1 AND rating_instructor <= 5),
  rating_value INTEGER CHECK (rating_value >= 1 AND rating_value <= 5),
  title TEXT,
  comment TEXT,
  pros TEXT[],
  cons TEXT[],
  recommended BOOLEAN DEFAULT TRUE,
  verified BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица избранного
CREATE TABLE wishlists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  retreat_id UUID REFERENCES retreats(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, retreat_id)
);

-- Таблица блога
CREATE TABLE blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  excerpt TEXT,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category TEXT,
  tags TEXT[],
  featured_image TEXT,
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица платежей
CREATE TABLE payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT,
  amount DECIMAL(10, 2),
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'cancelled')),
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для оптимизации
CREATE INDEX idx_retreats_organizer ON retreats(organizer_id);
CREATE INDEX idx_retreats_category ON retreats(category_id);
CREATE INDEX idx_retreats_country ON retreats(country_id);
CREATE INDEX idx_retreats_status ON retreats(status);
CREATE INDEX idx_retreats_featured ON retreats(featured);
CREATE INDEX idx_retreats_dates ON retreats(start_date, end_date);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_retreat ON bookings(retreat_id);
CREATE INDEX idx_reviews_retreat ON reviews(retreat_id);
CREATE INDEX idx_wishlists_user ON wishlists(user_id);

-- Функции для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггеры для автоматического обновления updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_retreats_updated_at BEFORE UPDATE ON retreats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Политики безопасности (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE retreats ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Политики для profiles
CREATE POLICY "Пользователи могут просматривать публичные профили" ON profiles FOR SELECT USING (true);
CREATE POLICY "Пользователи могут обновлять свой профиль" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Политики для retreats
CREATE POLICY "Все могут просматривать опубликованные ретриты" ON retreats FOR SELECT USING (status = 'published');
CREATE POLICY "Организаторы могут управлять своими ретритами" ON retreats FOR ALL USING (auth.uid() = organizer_id);

-- Политики для bookings
CREATE POLICY "Пользователи могут просматривать свои бронирования" ON bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Пользователи могут создавать бронирования" ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Пользователи могут обновлять свои бронирования" ON bookings FOR UPDATE USING (auth.uid() = user_id);

-- Политики для reviews
CREATE POLICY "Все могут просматривать отзывы" ON reviews FOR SELECT USING (true);
CREATE POLICY "Пользователи могут создавать отзывы" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Пользователи могут обновлять свои отзывы" ON reviews FOR UPDATE USING (auth.uid() = user_id);

-- Политики для wishlists
CREATE POLICY "Пользователи могут управлять своим избранным" ON wishlists FOR ALL USING (auth.uid() = user_id);

-- Политики для blog_posts
CREATE POLICY "Все могут читать опубликованные посты" ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Авторы могут управлять своими постами" ON blog_posts FOR ALL USING (auth.uid() = author_id);

-- Политики для payments
CREATE POLICY "Пользователи могут просматривать свои платежи" ON payments FOR SELECT USING (
  auth.uid() IN (
    SELECT user_id FROM bookings WHERE id = booking_id
  )
);

-- Вставка базовых данных
INSERT INTO categories (name, slug, description, icon, color) VALUES
('Йога', 'yoga', 'Ретриты по йоге для всех уровней', '🧘‍♀️', '#8B5CF6'),
('Медитация', 'meditation', 'Медитативные практики и майндфулнесс', '🧘‍♂️', '#06B6D4'),
('Детокс', 'detox', 'Очищение тела и разума', '🌿', '#10B981'),
('Велнес', 'wellness', 'Комплексное оздоровление', '💆‍♀️', '#F59E0B'),
('Духовность', 'spiritual', 'Духовные практики и развитие', '✨', '#EC4899'),
('Женские', 'womens', 'Ретриты специально для женщин', '👩', '#EF4444'),
('Ментальное здоровье', 'mental-health', 'Работа с психическим здоровьем', '🧠', '#6366F1'),
('Приключения', 'adventure', 'Активные ретриты и приключения', '🏔️', '#F97316'),
('Люкс', 'luxury', 'Премиальные ретриты высокого класса', '💎', '#A855F7'),
('Бюджетные', 'budget', 'Доступные ретриты для всех', '💰', '#22C55E');

INSERT INTO countries (name, code) VALUES
('Россия', 'RU'),
('Индия', 'IN'),
('Таиланд', 'TH'),
('Индонезия', 'ID'),
('Коста-Рика', 'CR'),
('Мексика', 'MX'),
('Перу', 'PE'),
('Непал', 'NP'),
('Турция', 'TR'),
('Греция', 'GR'),
('Испания', 'ES'),
('Португалия', 'PT'),
('Италия', 'IT'),
('Франция', 'FR'),
('Германия', 'DE'),
('Австрия', 'AT'),
('Швейцария', 'CH'),
('США', 'US'),
('Канада', 'CA'),
('Австралия', 'AU');
