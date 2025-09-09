# YogaRetreatPro

Современная платформа для поиска и бронирования ретритов по йоге с поддержкой Google OAuth аутентификации.

## 🚀 Особенности

- **Google OAuth интеграция** - быстрая регистрация и вход через Google
- **Современный UI/UX** - дизайн в стиле BookYogaRetreats
- **Responsive дизайн** - адаптация под все устройства
- **JWT аутентификация** - безопасная система авторизации
- **TypeScript** - полная типизация
- **React + Vite** - быстрая разработка
- **Express.js** - надежный бэкенд

## 🛠 Технологии

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI
- React Query
- Wouter (роутинг)

### Backend

- Express.js
- TypeScript
- Passport.js (Google OAuth)
- JWT
- Drizzle ORM
- PostgreSQL

## 📦 Установка

1. Клонируйте репозиторий:

```bash
git clone <repository-url>
cd YogaRetreatPro
```

2. Установите зависимости:

```bash
npm install
```

3. Настройте переменные окружения (см. [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)):

```bash
cp .env.example .env
# Отредактируйте .env файл
```

4. Запустите проект:

```bash
npm run dev
```

5. Откройте http://localhost:5000

## 🔐 Настройка Google OAuth

Подробные инструкции по настройке Google OAuth находятся в файле [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md).

### Быстрая настройка:

1. Создайте проект в [Google Cloud Console](https://console.cloud.google.com/)
2. Включите Google+ API
3. Создайте OAuth 2.0 Client ID
4. Настройте redirect URI: `http://localhost:5000/api/auth/google/callback`
5. Добавьте credentials в `.env` файл

## 📁 Структура проекта

```
YogaRetreatPro/
├── client/                 # Frontend React приложение
│   ├── src/
│   │   ├── components/     # React компоненты
│   │   │   ├── GoogleAuthButtons.tsx  # Кнопки Google OAuth
│   │   │   └── AuthModal.tsx          # Модальное окно авторизации
│   │   ├── pages/         # Страницы приложения
│   │   │   └── auth.tsx   # Страница входа/регистрации
│   │   └── hooks/         # React хуки
│   └── ...
├── server/                # Backend Express приложение
│   ├── routes.ts          # API маршруты
│   ├── googleAuth.ts      # Google OAuth настройка
│   └── ...
├── shared/                # Общие типы и схемы
└── ...
```

## 🎨 Компоненты Google OAuth

### GoogleAuthButtons

Универсальный компонент для отображения кнопок Google OAuth:

```tsx
import GoogleAuthButtons from "@/components/GoogleAuthButtons";

// Базовое использование
<GoogleAuthButtons onGoogleAuth={handleGoogleAuth} />

// С вариантами дизайна
<GoogleAuthButtons
  onGoogleAuth={handleGoogleAuth}
  variant="hero"        // 'default' | 'hero' | 'compact'
  showRegister={true}   // показать кнопку регистрации
/>
```

### Страница авторизации

Полноценная страница входа/регистрации доступна по адресу `/auth`:

- Google OAuth кнопки
- Традиционные формы входа/регистрации
- Восстановление пароля
- Адаптивный дизайн

## 🔄 API Endpoints

### Google OAuth

- `GET /api/auth/google?mode=login` - Вход через Google
- `GET /api/auth/google?mode=register` - Регистрация через Google
- `GET /api/auth/google/callback` - Callback для Google OAuth

### Аутентификация

- `GET /api/auth/user` - Получить данные пользователя
- `POST /api/auth/logout` - Выйти из системы
- `POST /api/login` - Традиционный вход
- `POST /api/register` - Традиционная регистрация

## 🎯 Использование

### Для пользователей:

1. Перейдите на главную страницу
2. Нажмите "Войти через Google" или "Зарегистрироваться через Google"
3. Авторизуйтесь через Google
4. Начните поиск ретритов

### Для разработчиков:

1. Настройте Google OAuth (см. GOOGLE_OAUTH_SETUP.md)
2. Запустите проект
3. Протестируйте авторизацию
4. Настройте базу данных

## 🐛 Troubleshooting

### Проблемы с Google OAuth:

- Проверьте правильность redirect URI
- Убедитесь, что API включены в Google Cloud Console
- Проверьте переменные окружения

### Проблемы с CORS:

- Проверьте настройки CORS в server/index.ts
- Убедитесь, что origin настроен правильно

### Проблемы с базой данных:

- Проверьте подключение к базе данных
- Убедитесь, что миграции выполнены

## 📝 Лицензия

MIT License

## 🤝 Вклад в проект

1. Fork репозиторий
2. Создайте feature branch
3. Внесите изменения
4. Создайте Pull Request

## 📞 Поддержка

Если у вас есть вопросы или проблемы, создайте Issue в репозитории.
