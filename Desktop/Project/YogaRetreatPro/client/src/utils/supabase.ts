// client/src/utils/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Определяем тип для переменных окружения
interface SupabaseConfig {
  VITE_SUPABASE_URL: string
  VITE_SUPABASE_ANON_KEY: string
}

// Проверяем наличие необходимых переменных окружения
const config: SupabaseConfig = {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY
}

// Проверяем, что все переменные окружения установлены
if (!config.VITE_SUPABASE_URL || !config.VITE_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

// Создаем клиент с типизацией
export const supabase: SupabaseClient = createClient(
  config.VITE_SUPABASE_URL,
  config.VITE_SUPABASE_ANON_KEY,
  {
    // Дополнительные опции можно добавить здесь
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  }
)

// Типы для данных, которые вы будете использовать
export interface Retreat {
  id: number
  title: string
  description: string
  price: number
  image_url: string
  start_date: string
  end_date: string
  location: string
  max_participants: number
}

export interface Booking {
  id: number
  retreat_id: number
  user_email: string
  participants: number
  special_requests: string
  created_at: string
  status: 'pending' | 'confirmed' | 'cancelled'
}

// Типизированные обертки для часто используемых запросов
export const retreats = {
  getAll: () => supabase.from('retreats').select('*') as Promise<{ data: Retreat[] | null; error: any }>,
  getById: (id: number) => supabase.from('retreats').select('*').eq('id', id).single() as Promise<{ data: Retreat | null; error: any }>
}

export const bookings = {
  create: (booking: Omit<Booking, 'id' | 'created_at' | 'status'>) => 
    supabase.from('bookings').insert([booking]) as Promise<{ data: Booking | null; error: any }>,
  getByUser: (email: string) => 
    supabase.from('bookings').select('*').eq('user_email', email) as Promise<{ data: Booking[] | null; error: any }>
}