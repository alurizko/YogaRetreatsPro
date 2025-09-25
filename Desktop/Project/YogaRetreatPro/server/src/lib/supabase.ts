// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'placeholder-anon-key'

// Проверка конфигурации
const isSupabaseConfigured = process.env.SUPABASE_URL && 
                            process.env.SUPABASE_SERVICE_ROLE_KEY && 
                            process.env.SUPABASE_ANON_KEY

if (!isSupabaseConfigured) {
  console.warn('⚠️  Supabase не настроен. Используются заглушки. Функции базы данных не будут работать.')
}

// Клиент с service role ключом для серверных операций
export const supabaseAdmin = isSupabaseConfigured ? createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
}) : null

// Клиент с anon ключом для публичных операций
export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null

export { isSupabaseConfigured }

// Экспорт типов будет добавлен позже при генерации схемы