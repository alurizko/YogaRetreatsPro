-- 1. Таблица пользователей
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'admin', 'instructor')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Таблица ретритов
CREATE TABLE retreats (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    location VARCHAR(200),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    available_slots INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Таблица преподавателей
CREATE TABLE instructors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    bio TEXT,
    photo_url VARCHAR(255),
    email VARCHAR(150) UNIQUE
);

-- 4. Таблица бронирований
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    retreat_id INTEGER REFERENCES retreats(id) ON DELETE CASCADE,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'confirmed', 'canceled')),
    total_price NUMERIC(10,2) NOT NULL
);

-- 5. Таблица-связка ретритов и преподавателей
CREATE TABLE retreat_instructors (
    retreat_id INTEGER REFERENCES retreats(id) ON DELETE CASCADE,
    instructor_id INTEGER REFERENCES instructors(id) ON DELETE CASCADE,
    PRIMARY KEY (retreat_id, instructor_id)
);

-- 6. Таблица отзывов
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    retreat_id INTEGER REFERENCES retreats(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Таблица блог-постов
CREATE TABLE blog_posts (
    id SERIAL PRIMARY KEY,
    author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Таблица FAQ
CREATE TABLE faq (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Таблица заявок организаторов ретритов
CREATE TABLE retreat_applications (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,                    -- Название ретрита
    location VARCHAR(200) NOT NULL,               -- Местоположение
    description TEXT NOT NULL,                    -- Описание ретрита
    price NUMERIC(10,2) NOT NULL,                -- Цена в гривнах
    duration INTEGER NOT NULL,                    -- Длительность в днях
    capacity INTEGER NOT NULL,                    -- Максимальное количество участников
    email VARCHAR(150) NOT NULL,                  -- Email для связи
    phone VARCHAR(20),                           -- Телефон (необязательное поле)
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')), -- Статус заявки
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);