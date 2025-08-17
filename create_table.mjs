import { Pool } from 'pg';
import fs from 'fs';

// Используем переменную окружения DATABASE_URL
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://localhost:5432/yogaretreats';

const pool = new Pool({ connectionString: DATABASE_URL });

async function createTable() {
  try {
    console.log('🔌 Подключаемся к базе данных...');
    
    // SQL для создания таблицы
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS retreat_applications (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        location VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        duration INTEGER NOT NULL,
        capacity INTEGER NOT NULL,
        email VARCHAR(150) NOT NULL,
        phone VARCHAR(20),
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_retreat_applications_status ON retreat_applications (status);
      CREATE INDEX IF NOT EXISTS idx_retreat_applications_email ON retreat_applications (email);
    `;
    
    console.log('📝 Создаем таблицу retreat_applications...');
    await pool.query(createTableSQL);
    
    console.log('✅ Таблица успешно создана!');
    
    // Проверяем структуру таблицы
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'retreat_applications'
      ORDER BY ordinal_position;
    `);
    
    if (result.rows.length > 0) {
      console.log('\n📋 Структура таблицы retreat_applications:');
      result.rows.forEach(row => {
        console.log(`- ${row.column_name}: ${row.data_type} ${row.is_nullable === 'NO' ? '(NOT NULL)' : ''} ${row.column_default ? `DEFAULT ${row.column_default}` : ''}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    
    if (error.message.includes('already exists')) {
      console.log('ℹ️  Таблица уже существует!');
    }
  } finally {
    await pool.end();
    console.log('\n🔌 Соединение закрыто');
  }
}

createTable();
