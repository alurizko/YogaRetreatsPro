import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import path from 'path'

// Загружаем .env файл из корневой папки проекта
dotenv.config({ path: './.env' })

// Создаем клиенты Supabase (поддерживаем и VITE_* как запасной вариант для URL/ANON в dev)
const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL)!
const supabaseAnonKey = (process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY)!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Проверка конфигурации Supabase
const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && supabaseServiceKey)

const app = express()
const PORT = 5000 // Фиксированный порт 5000

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    supabaseConfigured: isSupabaseConfigured
  })
})

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Пожалуйста, укажите email и пароль' })
    }

    if (!isSupabaseConfigured || !supabase) {
      return res.status(503).json({ error: 'База данных не настроена. Обратитесь к администратору.' })
    }

    // Аутентификация через Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      // Если ошибка связана с неподтвержденным email, автоматически подтверждаем
      if (error.message.includes('Email not confirmed')) {
        try {
          if (!supabaseAdmin) {
            return res.status(503).json({ error: 'База данных не настроена' })
          }
          
          // Получаем пользователя по email
          const { data: userData, error: userError } = await supabaseAdmin.auth.admin.listUsers()
          const user = userData?.users?.find(u => u.email === email)
          
          if (user) {
            // Подтверждаем email
            await supabaseAdmin.auth.admin.updateUserById(user.id, {
              email_confirm: true
            })
            
            // Пробуем войти снова
            const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
              email,
              password
            })
            
            if (retryError || !retryData.user) {
              return res.status(401).json({ error: 'Ошибка входа после подтверждения email' })
            }
            
            // Используем данные после повторного входа
            Object.assign(data, retryData)
          } else {
            return res.status(401).json({ error: 'Пользователь не найден' })
          }
        } catch (confirmError) {
          return res.status(401).json({ error: 'Ошибка подтверждения email' })
        }
      } else {
        return res.status(401).json({ error: 'Неверный email или пароль' })
      }
    }

    if (!data.user) {
      return res.status(401).json({ error: 'Пользователь не найден' })
    }

    // Получаем дополнительную информацию о пользователе из таблицы profiles
    let profile = null
    if (supabaseAdmin) {
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()
      
      if (profileError) {
        console.error('Profile error:', profileError)
      } else {
        profile = profileData
      }
    }

    return res.json({
      success: true,
      data: {
        id: data.user.id,
        email: data.user.email,
        firstName: profile?.first_name || 'Пользователь',
        lastName: profile?.last_name || '',
        role: profile?.role || 'user',
        token: data.session?.access_token
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' })
  }
})

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Пожалуйста, заполните все поля' })
    }

    if (!isSupabaseConfigured || !supabaseAdmin || !supabase) {
      return res.status(503).json({ error: 'База данных не настроена. Обратитесь к администратору.' })
    }

    // Регистрация через Supabase с автоподтверждением для разработки
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Автоматически подтверждаем email
      user_metadata: {
        first_name: firstName,
        last_name: lastName
      }
    })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    if (!data.user) {
      return res.status(400).json({ error: 'Ошибка создания пользователя' })
    }

    // Создаем профиль пользователя
    if (supabaseAdmin) {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: data.user.id,
          first_name: firstName,
          last_name: lastName,
          email: email,
          role: 'user'
        })

      if (profileError) {
        console.error('Profile creation error:', profileError)
      }
    }

    // Создаем сессию для нового пользователя
    let sessionData = null
    if (supabase) {
      const { data: session, error: sessionError } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      sessionData = session
    }

    return res.status(201).json({
      success: true,
      data: {
        id: data.user.id,
        email: data.user.email,
        firstName,
        lastName,
        role: 'user',
        token: sessionData?.session?.access_token || null
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' })
  }
})

// API endpoints для ретритов
app.get('/api/retreats', async (req, res) => {
  try {
    if (!isSupabaseConfigured || !supabaseAdmin) {
      return res.status(503).json({ error: 'База данных не настроена. Обратитесь к администратору.' })
    }

    const { page = 1, limit = 12, category, country, priceFrom, priceTo, search } = req.query
    
    let query = supabaseAdmin
      .from('retreats')
      .select(`
        *,
        categories(name, slug),
        countries(name, code),
        profiles(first_name, last_name)
      `)
      .eq('status', 'published')

    if (category) {
      query = query.eq('categories.slug', category)
    }
    
    if (country) {
      query = query.eq('countries.code', country)
    }
    
    if (priceFrom) {
      query = query.gte('price_from', priceFrom)
    }
    
    if (priceTo) {
      query = query.lte('price_to', priceTo)
    }
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const offset = (Number(page) - 1) * Number(limit)
    query = query.range(offset, offset + Number(limit) - 1)

    const { data, error } = await query

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.json({
      success: true,
      data: data || [],
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: data?.length || 0
      }
    })
  } catch (error) {
    console.error('Retreats error:', error)
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' })
  }
})

app.get('/api/retreats/:id', async (req, res) => {
  try {
    if (!isSupabaseConfigured || !supabaseAdmin) {
      return res.status(503).json({ error: 'База данных не настроена. Обратитесь к администратору.' })
    }

    const { id } = req.params

    const { data, error } = await supabaseAdmin
      .from('retreats')
      .select(`
        *,
        categories(name, slug),
        countries(name, code),
        profiles(first_name, last_name, avatar_url, bio)
      `)
      .eq('id', id)
      .eq('status', 'published')
      .single()

    if (error || !data) {
      return res.status(404).json({ error: 'Ретрит не найден' })
    }

    return res.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Retreat detail error:', error)
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' })
  }
})

app.get('/api/categories', async (req, res) => {
  try {
    if (!isSupabaseConfigured || !supabaseAdmin) {
      return res.status(503).json({ error: 'База данных не настроена. Обратитесь к администратору.' })
    }

    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .order('name')

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.json({
      success: true,
      data: data || []
    })
  } catch (error) {
    console.error('Categories error:', error)
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' })
  }
})

app.get('/api/countries', async (req, res) => {
  try {
    if (!isSupabaseConfigured || !supabaseAdmin) {
      return res.status(503).json({ error: 'База данных не настроена. Обратитесь к администратору.' })
    }

    const { data, error } = await supabaseAdmin
      .from('countries')
      .select('*')
      .order('name')

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.json({
      success: true,
      data: data || []
    })
  } catch (error) {
    console.error('Countries error:', error)
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' })
  }
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  if (isSupabaseConfigured) {
    console.log('Supabase configured successfully')
  } else {
    console.log('Warning: Supabase is not configured')
  }
})

export default app