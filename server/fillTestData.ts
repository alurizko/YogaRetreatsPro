import { db } from './db';
import { users, retreats, instructors, bookings, reviews, blog_posts, retreat_instructors } from '../shared/schema';

async function fillTestData() {
  // Добавление пользователей
  await db.insert(users).values([
    { name: 'Анна Смирнова', email: 'anna@example.com', password_hash: 'hash2', role: 'instructor' },
    { name: 'Ольга Петрова', email: 'olga@example.com', password_hash: 'hash3', role: 'admin' },
  ]);

  // Добавление ретритов
  await db.insert(retreats).values({
    title: 'Йога-ретрит на Байкале',
    description: 'Незабываемый опыт на природе',
    location: 'Байкал',
    start_date: '2024-07-10',
    end_date: '2024-07-20',
    price: 35000,
    available_slots: 20
  });

  await db.insert(retreats).values({
    title: 'Морской йога-тур',
    description: 'Йога и море',
    location: 'Сочи',
    start_date: '2024-08-01',
    end_date: '2024-08-10',
    price: 40000,
    available_slots: 15
  });

  // Добавление преподавателей
  await db.insert(instructors).values([
    { name: 'Анна Смирнова', bio: 'Сертифицированный инструктор', photo_url: '' },
    { name: 'Дмитрий Кузнецов', bio: 'Опыт 10 лет', photo_url: '' },
  ]);

  // Связка ретритов и преподавателей
  await db.insert(retreat_instructors).values([
    { retreat_id: 1, instructor_id: 1 },
    { retreat_id: 1, instructor_id: 2 },
    { retreat_id: 2, instructor_id: 1 },
  ]);

  // Добавление бронирований
  await db.insert(bookings).values([
    { user_id: 1, retreat_id: 1 },
    { user_id: 1, retreat_id: 2 },
    { user_id: 3, retreat_id: 1 },
  ]);

  // Добавление отзывов
  await db.insert(reviews).values([
    { user_id: 1, retreat_id: 1, rating: 5, comment: 'Очень понравилось!' },
    { user_id: 3, retreat_id: 1, rating: 4, comment: 'Хороший опыт.' },
  ]);

  // Добавление блог-постов
  await db.insert(blog_posts).values([
    { author_id: 1, title: 'Мой первый ретрит', content: 'Это было незабываемо!' },
    { author_id: 3, title: 'Советы по йоге', content: 'Практикуйте каждый день.' },
  ]);

  console.log('Тестовые данные успешно добавлены!');
}

fillTestData()
  .catch((e) => {
    console.error('Ошибка при добавлении тестовых данных:', e);
    process.exit(1);
  })
  .then(() => process.exit(0)); 