# Настройка Google OAuth для YogaRetreatPro

## Шаги для настройки Google OAuth

### 1. Создание проекта в Google Cloud Console

1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект или выберите существующий
3. Включите Google+ API и Google OAuth2 API

### 2. Создание OAuth 2.0 Client ID

1. В меню слева выберите "APIs & Services" > "Credentials"
2. Нажмите "Create Credentials" > "OAuth 2.0 Client IDs"
3. Выберите тип приложения "Web application"
4. Заполните форму:
   - **Name**: YogaRetreatPro
   - **Authorized JavaScript origins**:
     - `http://localhost:5173` (для разработки)
     - `http://localhost:5000` (для сервера)
   - **Authorized redirect URIs**:
     - `http://localhost:5000/api/auth/google/callback`

### 3. Настройка переменных окружения

Создайте файл `.env` в корне проекта со следующими переменными:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# JWT Secret (сгенерируйте случайную строку)
JWT_SECRET=your_jwt_secret_here

# Session Secret (сгенерируйте случайную строку)
SESSION_SECRET=your_session_secret_here

# Database Configuration
DATABASE_URL=your_database_url_here

# Stripe Configuration (опционально)
STRIPE_SECRET_KEY=your_stripe_secret_key_here

# SMTP Configuration (опционально, для сброса пароля)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=your_email@gmail.com
```

### 4. Генерация секретных ключей

Для генерации JWT_SECRET и SESSION_SECRET используйте:

```bash
# Для JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Для SESSION_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Запуск приложения

1. Установите зависимости: `npm install`
2. Запустите сервер разработки: `npm run dev`
3. Откройте http://localhost:5000

### 6. Тестирование

1. Перейдите на страницу `/auth`
2. Нажмите "Войти через Google" или "Зарегистрироваться через Google"
3. Должно произойти перенаправление на Google для авторизации
4. После успешной авторизации вы будете перенаправлены обратно в приложение

## Структура файлов

- `client/src/components/GoogleAuthButtons.tsx` - Компонент кнопок Google OAuth
- `client/src/pages/auth.tsx` - Страница входа/регистрации
- `server/routes.ts` - Серверные маршруты для Google OAuth
- `server/googleAuth.ts` - Настройка Google OAuth стратегии

## Особенности реализации

1. **Поддержка режимов**: Система поддерживает режимы 'login' и 'register' через параметр `mode`
2. **Автоматическая регистрация**: Если пользователь не существует, он автоматически создается при входе
3. **JWT токены**: После успешной авторизации генерируется JWT токен
4. **Безопасность**: Используются httpOnly cookies для хранения токенов
5. **Обработка ошибок**: Реализована обработка различных сценариев ошибок

## Troubleshooting

### Проблема: "redirect_uri_mismatch"

- Убедитесь, что URI в Google Cloud Console точно совпадает с GOOGLE_CALLBACK_URL

### Проблема: "invalid_client"

- Проверьте правильность GOOGLE_CLIENT_ID и GOOGLE_CLIENT_SECRET

### Проблема: "access_denied"

- Убедитесь, что Google+ API включен в проекте

### Проблема: CORS ошибки

- Проверьте настройки CORS в server/index.ts
- Убедитесь, что origin настроен правильно
