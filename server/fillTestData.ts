import { db } from './db';
import { users, retreats, instructors, bookings, reviews, blog_posts, retreat_instructors } from '../shared/schema';

async function fillTestData() {
  // Добавление пользователей
  await db.insert(users).values([
    { id: '1', firstName: 'Анна', lastName: 'Смирнова', email: 'anna@example.com', password_hash: 'hash2', role: 'instructor' },
    { id: '2', firstName: 'Ольга', lastName: 'Петрова', email: 'olga@example.com', password_hash: 'hash3', role: 'admin' },
  ]);

  // Добавление ретритов
  await db.insert(retreats).values([
    {
      title: 'Йога-ретрит на Байкале',
      description: 'Незабываемый опыт на природе',
      location: 'Байкал',
      startDate: '2024-07-10',
      endDate: '2024-07-20',
      price: "35000",
      maxParticipants: 20,
      currentParticipants: 0,
      organizerId: '2',
      isActive: true,
    },
    {
      title: 'Морской йога-тур',
      description: 'Йога и море',
      location: 'Сочи',
      startDate: '2024-08-01',
      endDate: '2024-08-10',
      price: "40000",
      maxParticipants: 15,
      currentParticipants: 0,
      organizerId: '2',
      isActive: true,
    }
  ]);

  // Добавление преподавателей
  await db.insert(instructors).values([
    { firstName: 'Анна', lastName: 'Смирнова', bio: 'Сертифицированный инструктор', photoUrl: '' },
    { firstName: 'Дмитрий', lastName: 'Кузнецов', bio: 'Опыт 10 лет', photoUrl: '' },
  ]);

  // Связка ретритов и преподавателей
  await db.insert(retreat_instructors).values([
    { retreat_id: 1, instructor_id: 1 },
    { retreat_id: 1, instructor_id: 2 },
    { retreat_id: 2, instructor_id: 1 },
  ]);

  // Добавление бронирований
  await db.insert(bookings).values([
    { participant_id: '1', retreatId: 1, participants: 1, totalAmount: "35000", status: 'confirmed' },
    { participant_id: '1', retreatId: 2, participants: 1, totalAmount: "40000", status: 'confirmed' },
    { participant_id: '2', retreatId: 1, participants: 1, totalAmount: "35000", status: 'confirmed' },
  ]);

  // Добавление отзывов
  await db.insert(reviews).values([
    { user_id: '1', retreat_id: 1, rating: 5, comment: 'Очень понравилось!' },
    { user_id: '2', retreat_id: 1, rating: 4, comment: 'Хороший опыт.' },
  ]);

  // Добавление блог-постов
  await db.insert(blog_posts).values([
    { author_id: '1', title: 'Мой первый ретрит', content: 'Это было незабываемо!' },
    { author_id: '2', title: 'Советы по йоге', content: 'Практикуйте каждый день.' },
  ]);

  console.log('Тестовые данные успешно добавлены!');
}

fillTestData()
  .catch((e) => {
    console.error('Ошибка при добавлении тестовых данных:', e);
    process.exit(1);
  })
  .then(() => process.exit(0)); 