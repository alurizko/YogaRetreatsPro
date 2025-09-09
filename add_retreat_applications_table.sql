-- Добавление таблицы заявок организаторов ретритов
-- Валюта: гривна, телефон: +38 (099) XXX-XX-XX

CREATE TABLE IF NOT EXISTS "retreat_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,                    -- Название ретрита
	"location" varchar(200) NOT NULL,               -- Местоположение
	"description" text NOT NULL,                    -- Описание ретрита
	"price" numeric(10, 2) NOT NULL,               -- Цена в гривнах
	"duration" integer NOT NULL,                    -- Длительность в днях
	"capacity" integer NOT NULL,                    -- Максимальное количество участников
	"email" varchar(150) NOT NULL,                  -- Email для связи
	"phone" varchar(20),                           -- Телефон (формат: +38 (099) XXX-XX-XX)
	"status" varchar DEFAULT 'pending' NOT NULL,    -- Статус заявки: 'pending' | 'approved' | 'rejected'
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

-- Добавляем индекс для быстрого поиска по статусу
CREATE INDEX IF NOT EXISTS "idx_retreat_applications_status" ON "retreat_applications" ("status");

-- Добавляем индекс для быстрого поиска по email
CREATE INDEX IF NOT EXISTS "idx_retreat_applications_email" ON "retreat_applications" ("email");
