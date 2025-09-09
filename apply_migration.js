const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Читаем DATABASE_URL из переменных окружения
try {
  require('dotenv').config();
} catch (error) {
  console.log('dotenv не найден, используем переменные окружения системы');
}

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL не найден в переменных окружения');
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function applyMigration() {
  try {
    console.log('Подключаемся к базе данных...');
    
    // Читаем SQL-скрипт
    const sql = fs.readFileSync('./add_retreat_applications_table.sql', 'utf8');
    
    console.log('Применяем миграцию...');
    
    // Выполняем SQL-скрипт
    await pool.query(sql);
    
    console.log('✅ Таблица retreat_applications успешно создана!');
    
    // Проверяем, что таблица создалась
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'retreat_applications'
      ORDER BY ordinal_position;
    `);
    
    console.log('\n📋 Структура таблицы retreat_applications:');
    result.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type} ${row.is_nullable === 'NO' ? '(NOT NULL)' : ''}`);
    });
    
  } catch (error) {
    console.error('❌ Ошибка при применении миграции:', error.message);
    
    if (error.message.includes('already exists')) {
      console.log('ℹ️  Таблица уже существует, проверяем её структуру...');
      
      try {
        const result = await pool.query(`
          SELECT column_name, data_type, is_nullable 
          FROM information_schema.columns 
          WHERE table_name = 'retreat_applications'
          ORDER BY ordinal_position;
        `);
        
        if (result.rows.length > 0) {
          console.log('\n📋 Текущая структура таблицы retreat_applications:');
          result.rows.forEach(row => {
            console.log(`- ${row.column_name}: ${row.data_type} ${row.is_nullable === 'NO' ? '(NOT NULL)' : ''}`);
          });
        } else {
          console.log('❌ Таблица не найдена');
        }
      } catch (checkError) {
        console.error('Ошибка при проверке таблицы:', checkError.message);
      }
    }
  } finally {
    await pool.end();
    console.log('\n🔌 Соединение с базой данных закрыто');
  }
}

applyMigration();
