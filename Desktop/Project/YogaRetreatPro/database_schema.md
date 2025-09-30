# YogaRetreatPro — Структура базы данных и примеры вставок (10 записей на таблицу)

Этот документ отражает текущую схему из `supabase_schema.sql` и даёт примеры массовой вставки (по 10 записей) для каждой таблицы. Примеры рассчитаны на PostgreSQL/Supabase и используют `generate_series`, `uuid_generate_v4()`, `NOW()` и выбор случайных внешних ключей через `ORDER BY random()` — удобно для быстрого наполнения тестовыми данными без ручного подбора UUID.

Важно: перед вставкой убедитесь, что схема создана (выполнен файл `supabase_schema.sql`), а также расширение `uuid-ossp` включено.

---

## 1) profiles
Содержит пользовательские профили из `auth.users` (FK по `id`).

Колонки: `id (UUID, PK, FK->auth.users.id)`, `first_name`, `last_name`, `email`, `role ('user'|'organizer'|'admin')`, `avatar_url`, `phone`, `bio`, `created_at`, `updated_at`.

Пример (10 записей). В демо мы генерируем произвольные id (НЕ связанные с `auth.users`). Для реальной загрузки используйте настоящие `auth.users.id`:

```sql
-- DEMO-вставка 10 профилей с произвольными UUID (для настоящей среды лучше использовать реальные auth.users.id)
INSERT INTO profiles (id, first_name, last_name, email, role, avatar_url, phone, bio)
SELECT uuid_generate_v4(),
       ('Имя_' || gs)::text,
       ('Фамилия_' || gs)::text,
       ('user' || gs || '@example.com')::text,
       (ARRAY['user','organizer','admin'])[1 + (random()*2)::int],
       NULL,
       ('+7-900-000-0' || LPAD(gs::text, 2, '0'))::text,
       'Краткая биография пользователя'
FROM generate_series(1,10) AS gs;
```

---

## 2) categories
Справочник категорий ретритов.

Колонки: `id (UUID, PK)`, `name`, `slug (UNIQUE)`, `description`, `icon`, `color`, `created_at`.

```sql
INSERT INTO categories (id, name, slug, description, icon, color)
SELECT uuid_generate_v4(),
       ('Категория ' || gs)::text,
       ('category-' || gs)::text,
       'Описание категории',
       '🏷️',
       (ARRAY['#8B5CF6','#06B6D4','#10B981','#F59E0B','#EC4899','#EF4444','#6366F1','#F97316','#A855F7','#22C55E'])[gs]
FROM generate_series(1,10) AS gs;
```

---

## 3) countries
Справочник стран.

Колонки: `id (UUID, PK)`, `name`, `code (UNIQUE)`, `created_at`.

```sql
INSERT INTO countries (id, name, code)
SELECT uuid_generate_v4(),
       ('Страна ' || gs)::text,
       ('C' || LPAD(gs::text, 2, '0'))::text
FROM generate_series(1,10) AS gs;
```

---

## 4) retreats
Карточки ретритов с FK на организатора (`profiles.id`), категорию и страну.

Ключевые поля: `title`, `slug (UNIQUE)`, `organizer_id (FK)`, `category_id (FK)`, `country_id (FK)`, `location`, `price_from`, `duration_days`, `status ('draft'|'published'|'cancelled'|'completed')`, `images[]`, `amenities[]`, `schedule JSONB` и пр.

```sql
-- Для связей берём случайные id из справочников/профилей
INSERT INTO retreats (
  id, title, slug, description, short_description,
  organizer_id, category_id, country_id,
  location, address, latitude, longitude,
  price_from, price_to, currency,
  duration_days, max_participants, difficulty_level,
  age_min, age_max, start_date, end_date, booking_deadline,
  featured, status, images, amenities, included, not_included, schedule
)
SELECT uuid_generate_v4(),
       ('Ретрит #' || gs)::text,
       ('retreat-' || gs)::text,
       'Полное описание ретрита',
       'Короткое описание',
       (SELECT id FROM profiles ORDER BY random() LIMIT 1),
       (SELECT id FROM categories ORDER BY random() LIMIT 1),
       (SELECT id FROM countries ORDER BY random() LIMIT 1),
       'Город/Локация',
       'Адрес ретрита',
       (55 + random())::numeric(10,8),
       (37 + random())::numeric(11,8),
       (500 + (random()*1500))::numeric(10,2),
       (2000 + (random()*2000))::numeric(10,2),
       'USD',
       (3 + (random()*12))::int,
       (10 + (random()*20))::int,
       (ARRAY['beginner','intermediate','advanced','all_levels'])[1 + (random()*3)::int],
       16, 70,
       (CURRENT_DATE + (gs || ' days')::interval)::date,
       (CURRENT_DATE + ((gs+7) || ' days')::interval)::date,
       (CURRENT_DATE + ((gs-1) || ' days')::interval)::date,
       (gs % 3 = 0),
       (ARRAY['draft','published','cancelled','completed'])[1 + (random()*3)::int],
       ARRAY['https://picsum.photos/seed/' || gs || '/800/600'],
       ARRAY['wifi','meals','transfer'],
       ARRAY['проживание','питание'],
       ARRAY['перелёт'],
       jsonb_build_object('day1','Йога и знакомство','day2','Экскурсия')
FROM generate_series(1,10) AS gs;
```

---

## 5) bookings
Бронирования пользователя на конкретный ретрит.

Колонки: `id (UUID, PK)`, `user_id (FK profiles)`, `retreat_id (FK retreats)`, `status ('pending'|'confirmed'|'cancelled'|'completed')`, `participants_count`, `total_price`, `currency`, `payment_status`, `payment_method`, `special_requests`, `emergency_contact JSONB`.

```sql
INSERT INTO bookings (
  id, user_id, retreat_id, status, participants_count,
  total_price, currency, payment_status, payment_method,
  special_requests, emergency_contact
)
SELECT uuid_generate_v4(),
       (SELECT id FROM profiles ORDER BY random() LIMIT 1),
       (SELECT id FROM retreats ORDER BY random() LIMIT 1),
       (ARRAY['pending','confirmed','cancelled','completed'])[1 + (random()*3)::int],
       (1 + (random()*4))::int,
       (500 + (random()*3000))::numeric(10,2),
       'USD',
       (ARRAY['pending','paid','refunded','failed'])[1 + (random()*3)::int],
       (ARRAY['card','cash','bank_transfer','stripe'])[1 + (random()*3)::int],
       'Особые пожелания',
       jsonb_build_object('name','Контактное лицо','phone','+7-911-000-00-00')
FROM generate_series(1,10) AS gs;
```

---

## 6) reviews
Отзывы пользователей о ретритах (опционально привязаны к бронированию).

Оценки: `rating_overall/location/accommodation/food/instructor/value` (1..5).

```sql
INSERT INTO reviews (
  id, user_id, retreat_id, booking_id,
  rating_overall, rating_location, rating_accommodation, rating_food, rating_instructor, rating_value,
  title, comment, pros, cons, recommended, verified, helpful_count
)
SELECT uuid_generate_v4(),
       (SELECT id FROM profiles ORDER BY random() LIMIT 1),
       (SELECT id FROM retreats ORDER BY random() LIMIT 1),
       (SELECT id FROM bookings ORDER BY random() LIMIT 1),
       (3 + (random()*2))::int,
       (3 + (random()*2))::int,
       (3 + (random()*2))::int,
       (3 + (random()*2))::int,
       (3 + (random()*2))::int,
       (3 + (random()*2))::int,
       'Заголовок отзыва',
       'Подробный комментарий об опыте участия в ретрите',
       ARRAY['расположение','питание','инструктор'],
       ARRAY['длительная дорога'],
       true,
       (gs % 2 = 0),
       (random()*20)::int
FROM generate_series(1,10) AS gs;
```

---

## 7) wishlists
Избранные ретриты по пользователям (уникальная пара `user_id` + `retreat_id`).

```sql
-- Чтобы избежать конфликта уникальности, выбираем пары через подзапрос
INSERT INTO wishlists (id, user_id, retreat_id)
SELECT uuid_generate_v4(), p.id, r.id
FROM (
  SELECT id FROM profiles ORDER BY random() LIMIT 10
) p
JOIN (
  SELECT id FROM retreats ORDER BY random() LIMIT 10
) r ON true
LIMIT 10;
```

---

## 8) blog_posts
Посты блога.

Колонки: `id (UUID, PK)`, `title`, `slug (UNIQUE)`, `content`, `excerpt`, `author_id (FK profiles)`, `category`, `tags[]`, `featured_image`, `published`.

```sql
INSERT INTO blog_posts (
  id, title, slug, content, excerpt, author_id, category, tags, featured_image, published, published_at
)
SELECT uuid_generate_v4(),
       ('Пост блога #' || gs)::text,
       ('blog-post-' || gs)::text,
       'Содержимое статьи...',
       'Краткое описание...',
       (SELECT id FROM profiles ORDER BY random() LIMIT 1),
       'Новости',
       ARRAY['йога','ретриты'],
       'https://picsum.photos/seed/blog' || gs || '/1200/630',
       (gs % 3 = 0),
       CASE WHEN gs % 3 = 0 THEN NOW() ELSE NULL END
FROM generate_series(1,10) AS gs;
```

---

## 9) payments
Платежи по бронированиям.

Колонки: `id (UUID, PK)`, `booking_id (FK)`, `stripe_payment_intent_id`, `amount`, `currency`, `status ('pending'|'succeeded'|'failed'|'cancelled')`, `payment_method`.

```sql
INSERT INTO payments (
  id, booking_id, stripe_payment_intent_id, amount, currency, status, payment_method
)
SELECT uuid_generate_v4(),
       (SELECT id FROM bookings ORDER BY random() LIMIT 1),
       ('pi_' || encode(gen_random_bytes(8),'hex')),
       (500 + (random()*3000))::numeric(10,2),
       'USD',
       (ARRAY['pending','succeeded','failed','cancelled'])[1 + (random()*3)::int],
       (ARRAY['card','stripe','bank_transfer'])[1 + (random()*2)::int]
FROM generate_series(1,10) AS gs;
```

---

## 10) Индексы, триггеры, политики
Эти объекты уже присутствуют в `supabase_schema.sql` (см. разделы `CREATE INDEX`, функцию `update_updated_at_column()`, триггеры `update_*_updated_at`, RLS `ENABLE ROW LEVEL SECURITY` и `CREATE POLICY ...`). В тестовых вставках переопределять их не требуется.

---

## Порядок применения
- Выполните `supabase_schema.sql` (создание таблиц/индексов/политик/триггеров).
- Затем, при необходимости наполнения тестовыми данными, выполните нужные блоки из этого файла (по таблицам).
- Если нужны реальные связи с `auth.users`, заранее создайте пользователей и используйте их `auth.users.id` вместо случайных UUID в примере для `profiles`.
