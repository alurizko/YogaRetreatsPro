import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
// Удалён импорт setupAuth, isAuthenticated из ./replitAuth
import { insertRetreatSchema, insertBookingSchema, insertRefundRequestSchema, insertRetreatApplicationSchema, retreat_applications } from "@shared/schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { db } from "./db";
import crypto from "crypto";
import passport from "passport";
import session from "express-session";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import cookieParser from "cookie-parser";
import nodemailer from "nodemailer";

let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-06-30.basil",
  });
} else {
  console.warn('Warning: STRIPE_SECRET_KEY not configured. Payment functionality will be disabled.');
}

// Временное хранилище токенов сброса пароля (для теста)
const resetTokens: Record<string, string> = {};

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint для заявок организаторов ретритов (публичный, без аутентификации)
  app.post("/api/retreat-applications", async (req, res) => {
    try {
      console.log("Получена заявка организатора:", req.body);
      
      // Валидируем данные с помощью Zod схемы
      const validatedData = insertRetreatApplicationSchema.parse(req.body);
      
      // Временно сохраняем в файл вместо БД (пока не настроим подключение)
      const fs = require('fs');
      const path = require('path');
      
      const applicationWithId = {
        id: Date.now(), // Временный ID
        ...validatedData,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Сохраняем в файл applications.json
      const applicationsFile = path.join(process.cwd(), 'applications.json');
      let applications = [];
      
      try {
        if (fs.existsSync(applicationsFile)) {
          const data = fs.readFileSync(applicationsFile, 'utf8');
          applications = JSON.parse(data);
        }
      } catch (err) {
        console.log('Создаем новый файл applications.json');
      }
      
      applications.push(applicationWithId);
      fs.writeFileSync(applicationsFile, JSON.stringify(applications, null, 2));
      
      console.log("Заявка успешно сохранена в файл:", applicationWithId);
      
      res.status(201).json({
        success: true,
        message: "Заявка успешно отправлена! Мы свяжемся с вами в течение 24 часов.",
        application: applicationWithId
      });
    } catch (error) {
      console.error("Ошибка при сохранении заявки:", error);
      
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          message: "Ошибка валидации данных",
          errors: error
        });
      }
      
      res.status(500).json({
        success: false,
        message: "Ошибка сервера при обработке заявки"
      });
    }
  });

  // Настройка express-session и passport
  app.use(session({
    secret: process.env.SESSION_SECRET || "your_secret",
    resave: false,
    saveUninitialized: false,
  }));
  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(passport.session());

  // Настройка стратегии Google
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback"
  },
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      try {
        // Проверяем, есть ли пользователь в базе по email (а не только по id)
        let usersResult = await db.select().from(users).where(eq(users.email, profile.emails?.[0].value));
        let user;
        if (usersResult.length) {
          user = usersResult[0];
        } else {
          // Подставляем дефолтные значения, если имя или фамилия отсутствуют
          const firstName = profile.name?.givenName || "Google";
          const lastName = profile.name?.familyName || "User";
          const [newUser] = await db.insert(users).values({
            id: profile.id, // profile.id можно оставить, если он уникален
            email: profile.emails?.[0].value,
            firstName,
            lastName,
            role: "user"
          }).returning();
          user = newUser;
        }
        // ВРЕМЕННЫЙ ЛОГ для отладки
        console.log("[GoogleStrategy] user.id:", user.id, "user.email:", user.email);
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));
  passport.serializeUser((user: any, done) => {
    done(null, user);
  });
  passport.deserializeUser((user: any, done) => {
    done(null, user);
  });

  // Google OAuth маршруты с поддержкой режимов регистрации и входа
  app.get('/api/auth/google', (req, res, next) => {
    console.log(`🔍 [Google OAuth] === НАЧАЛО ЗАПРОСА ===`);
    console.log(`🔍 [Google OAuth] URL: ${req.url}`);
    console.log(`🔍 [Google OAuth] Query params:`, req.query);
    
    const mode = req.query.mode as string; // 'register' или 'login'
    const prompt = req.query.prompt as string; // 'select_account' для выбора аккаунта
    
    console.log(`🔍 [Google OAuth] Запрос аутентификации: mode=${mode}, prompt=${prompt}`);
    
    // Сохраняем режим в сессии для использования в callback
    req.session = req.session || {};
    (req.session as any).googleMode = mode;
    
    // Настройки аутентификации Google
    const authOptions: any = { 
      scope: ['profile', 'email'] 
    };
    
    // Если указан prompt=select_account, добавляем его в опции
    if (prompt === 'select_account') {
      authOptions.prompt = 'select_account';
      console.log(`🔍 [Google OAuth] Добавлен prompt=select_account`);
    }
    
    console.log(`🔍 [Google OAuth] Опции аутентификации:`, authOptions);
    console.log(`🔍 [Google OAuth] Вызываем passport.authenticate`);
    
    passport.authenticate('google', authOptions)(req, res, next);
    
    console.log(`🔍 [Google OAuth] === КОНЕЦ ЗАПРОСА ===`);
  });

  app.get('/api/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    async (req, res) => {
      try {
        let user = req.user as any;
        const mode = (req.session as any)?.googleMode || 'login';
        
        console.log(`🔍 [Google OAuth] === НАЧАЛО CALLBACK ===`);
        console.log(`🔍 [Google OAuth] Режим: ${mode}`);
        console.log(`🔍 [Google OAuth] Email: ${user.email}`);
        console.log(`🔍 [Google OAuth] User ID: ${user.id}`);
        console.log(`🔍 [Google OAuth] User object:`, JSON.stringify(user, null, 2));
        
        if (mode === 'register') {
          // Режим регистрации - проверяем, существует ли пользователь
          const existingUser = await db.select().from(users).where(eq(users.email, user.email));
          
          if (existingUser.length > 0) {
            // Пользователь уже существует — предлагаем выбрать другой аккаунт через Google
            const retryCount = (req.session as any)?.googleRegisterRetry ?? 0;
            console.log(`🔍 [Google OAuth] Пользователь ${user.email} уже существует. retryCount=${retryCount}`);
            if (retryCount < 1) {
              (req.session as any).googleRegisterRetry = retryCount + 1;
              console.log('🔍 [Google OAuth] Повторная попытка с prompt=select_account');
              res.redirect('/api/auth/google?mode=register&prompt=select_account');
              return;
            }
            (req.session as any).googleRegisterRetry = 0;
            console.log('🔍 [Google OAuth] Превышено число попыток. Возврат с ошибкой на /auth');
            res.redirect('http://localhost:5173/auth?error=user_exists&email=' + encodeURIComponent(user.email));
            return;
          }
          
          // Пользователь не существует - создаем нового
          console.log(`🔍 [Google OAuth] Создаем нового пользователя: ${user.email}`);
          const [newUser] = await db.insert(users).values({
            id: user.id,
            email: user.email,
            firstName: user.firstName || user.name?.givenName || 'Google',
            lastName: user.lastName || user.name?.familyName || 'User',
            role: "user"
          }).returning();
          user = newUser;
        } else {
          // Режим входа - проверяем, существует ли пользователь
          const existingUser = await db.select().from(users).where(eq(users.email, user.email));
          
          if (existingUser.length === 0) {
            // Пользователь не существует - создаем его в базе данных и выполняем вход
            console.log(`🔍 [Google OAuth] Пользователь ${user.email} не найден, создаем в базе данных и выполняем вход`);
            const [newUser] = await db.insert(users).values({
              id: user.id,
              email: user.email,
              firstName: user.firstName || user.name?.givenName || 'Google',
              lastName: user.lastName || user.name?.familyName || 'User',
              role: "user"
            }).returning();
            user = newUser;
          } else {
            // Пользователь существует - обновляем данные из Google
            console.log(`🔍 [Google OAuth] Пользователь ${user.email} найден, обновляем данные и выполняем вход`);
            await db.update(users).set({
              firstName: user.firstName || user.name?.givenName || existingUser[0].firstName,
              lastName: user.lastName || user.name?.familyName || existingUser[0].lastName,
              updatedAt: new Date()
            }).where(eq(users.email, user.email));
            user = existingUser[0];
          }
        }
        
        console.log(`🔍 [Google OAuth] Генерируем JWT токен для пользователя: ${user.email}`);
        // Генерируем JWT
        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET!,
          { expiresIn: "7d" }
        );
        
        // Отправляем токен через httpOnly cookie
        res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
        
        // Сбрасываем счётчик повторов регистрации
        try { (req.session as any).googleRegisterRetry = 0; } catch {}
        // Редиректим на фронтенд-дэшборд
        res.redirect('http://localhost:5173/participant/dashboard');
        console.log(`🔍 [Google OAuth] === КОНЕЦ CALLBACK ===`);
      } catch (error) {
        console.error('🔍 [Google OAuth] Ошибка в callback:', error);
        res.redirect('http://localhost:5173?error=auth_failed');
      }
    }
  );

  // Удалён вызов setupAuth(app);

  // Удалить или заменить все использования isAuthenticated на (req, res, next) => next() для теста
  // Auth routes
  app.get('/api/auth/user', async (req, res, next) => {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ message: "Not authenticated" });
      let payload;
      try {
        payload = jwt.verify(token, process.env.JWT_SECRET!);
      } catch {
        return res.status(401).json({ message: "Invalid token" });
      }
      // Поиск пользователя в БД по id из токена
      const userId = (payload as any).id;
      const usersResult = await db.select().from(users).where(eq(users.id, userId));
      if (!usersResult.length) {
        return res.status(404).json({ message: "User not found" });
      }
      const user = usersResult[0];
      res.json({ id: user.id, role: user.role, email: user.email });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Эндпоинт для выхода пользователя (logout)
  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token', { httpOnly: true, sameSite: 'lax' });
    res.status(200).json({ message: "Logged out" });
  });

  // Эндпоинт для получения email пользователя из JWT в cookie
  app.get('/api/me', (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Not authenticated" });
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!);
      res.json({ email: (payload as any).email });
    } catch {
      res.status(401).json({ message: "Invalid token" });
    }
  });

  // Регистрация пользователя
  app.post('/api/register', async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: "Имя, фамилия, email и пароль обязательны" });
      }
      // нормализуем email
      const normalizedEmail = String(email).trim().toLowerCase();
      // Проверка, что email не занят
      const existing = await db.select().from(users).where(eq(users.email, normalizedEmail));
      if (existing.length > 0) {
        return res.status(400).json({ message: "Email уже зарегистрирован" });
      }
      // Генерация уникального id
      const id = crypto.randomUUID();
      // Хеширование пароля
      const password_hash = await bcrypt.hash(password, 10);
      // Создание пользователя
      const [user] = await db.insert(users).values({
        id,
        firstName,
        lastName,
        email: normalizedEmail,
        role: "user",
        password_hash,
      }).returning();
      // Генерация JWT
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: "7d" });
      res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
      res.json({ token, user: { id: user.id, email: user.email } });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Ошибка регистрации" });
    }
  });

  // Вход пользователя
  app.post('/api/login', async (req, res) => {
    try {
      // Получаем email и пароль из тела запроса
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email и пароль обязательны" });
      }
      // Поиск пользователя по email
      const existing = await db.select().from(users).where(eq(users.email, email));
      if (existing.length === 0) {
        return res.status(400).json({ message: "Пользователь не найден" });
      }
      const user = existing[0];
      // Проверка наличия хэша пароля
      if (!user.password_hash) {
        return res.status(400).json({ message: "У пользователя отсутствует пароль. Обратитесь к администратору." });
      }
      // Сравнение пароля с хэшем
      const valid = await bcrypt.compare(password, (user as any).password_hash);
      if (!valid) {
        return res.status(400).json({ message: "Неверный пароль" });
      }
      // Генерация JWT-токена
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: "7d" });
      res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
      res.json({ user: { id: user.id, email: user.email } });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Ошибка входа" });
    }
  });

  // Retreat routes
  app.get('/api/retreats', (req, res) => {
    try {
      // Возвращаем фиктивный список ретритов
      const retreats = [
        { id: 1, title: 'Yoga Retreat', organizerId: 'test-user', price: '100', currentParticipants: 0, maxParticipants: 10 },
      ];
      res.json(retreats);
    } catch (error) {
      console.error("Error fetching retreats:", (error as any));
      res.status(500).json({ message: "Failed to fetch retreats" });
    }
  });

  app.get('/api/retreats/:id', (req, res) => {
    try {
      const id = parseInt(req.params.id);
      // Возвращаем фиктивный ретрит
      const retreat = { id, organizerId: 'test-user', price: '100', currentParticipants: 0, maxParticipants: 10 };
      res.json(retreat);
    } catch (error) {
      console.error("Error fetching retreat:", (error as any));
      res.status(500).json({ message: "Failed to fetch retreat" });
    }
  });

  app.post('/api/retreats', (req, res, next) => {
    try {
      // Используем фиктивного пользователя-организатора
      const user = { id: 'test-user', role: 'organizer' };
      if (!user || user.role !== 'organizer') {
        return res.status(403).json({ message: "Only organizers can create retreats" });
      }
      const retreatData = insertRetreatSchema.parse({
        ...req.body,
        organizerId: user.id,
      });
      // Возвращаем фиктивный созданный ретрит
      const retreat = { ...retreatData, id: 2, currentParticipants: 0 };
      res.status(201).json(retreat);
    } catch (error) {
      console.error("Error creating retreat:", (error as any));
      res.status(400).json({ message: (error as any).message || "Failed to create retreat" });
    }
  });

  app.get('/api/organizer/retreats', (req, res, next) => {
    try {
      // Используем фиктивного пользователя-организатора
      const user = { id: 'test-user', role: 'organizer' };
      const retreats = [
        { id: 1, title: 'Yoga Retreat', organizerId: user.id, price: '100', currentParticipants: 0, maxParticipants: 10 },
      ];
      res.json(retreats);
    } catch (error) {
      console.error("Error fetching organizer retreats:", (error as any));
      res.status(500).json({ message: "Failed to fetch retreats" });
    }
  });

  // Booking routes
  app.get('/api/bookings', (req, res, next) => {
    try {
      // Используем фиктивного пользователя-участника
      const user = { id: 'test-user', role: 'participant' };
      const bookings = [
        { id: 1, retreatId: 1, participantId: user.id, participants: 1, totalAmount: '100', status: 'confirmed' },
      ];
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", (error as any));
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.get('/api/retreats/:id/bookings', (req, res, next) => {
    try {
      const retreatId = parseInt(req.params.id);
      // Используем фиктивного пользователя-организатора
      const user = { id: 'test-user', role: 'organizer' };
      // Check if user is the organizer of this retreat
      const retreat = { organizerId: 'test-user' };
      if (!retreat || retreat.organizerId !== user.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      const bookings = [
        { id: 1, retreatId, participantId: 'test-user', participants: 1, totalAmount: '100', status: 'confirmed' },
      ];
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching retreat bookings:", (error as any));
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Stripe payment routes
  app.post("/api/create-payment-intent", (req, res, next) => {
    try {
      if (!stripe) {
        return res.status(503).json({ message: "Payment processing is currently unavailable. Please contact support." });
      }
      const { retreatId, participants } = req.body;
      // Используем фиктивного пользователя-участника
      const user = { id: 'test-user', role: 'participant' };
      const retreat = { price: '100', currentParticipants: 0, maxParticipants: 10 };
      if (!retreat) {
        return res.status(404).json({ message: "Retreat not found" });
      }
      if (retreat.currentParticipants + participants > retreat.maxParticipants) {
        return res.status(400).json({ message: "Not enough spots available" });
      }
      const amount = parseFloat(retreat.price) * participants;
      res.json({ clientSecret: 'test-client-secret' });
    } catch (error) {
      console.error("Error creating payment intent:", (error as any));
      res.status(500).json({ message: "Error creating payment intent: " + (error as any).message });
    }
  });

  app.post("/api/confirm-booking", (req, res, next) => {
    try {
      if (!stripe) {
        return res.status(503).json({ message: "Payment processing is currently unavailable. Please contact support." });
      }
      const { paymentIntentId, retreatId, participants } = req.body;
      // Используем фиктивного пользователя-участника
      const user = { id: 'test-user', role: 'participant' };
      // Проверяем фиктивный payment intent
      if (paymentIntentId !== 'test-client-secret') {
        return res.status(400).json({ message: "Payment not successful" });
      }
      const retreat = { id: retreatId, price: '100', maxParticipants: 10, currentParticipants: 0 };
      if (!retreat) {
        return res.status(404).json({ message: "Retreat not found" });
      }
      const totalAmount = parseFloat(retreat.price) * participants;
      // Создаём фиктивное бронирование
      const booking = { id: 2, retreatId, participantId: user.id, participants, totalAmount: totalAmount.toString(), status: 'confirmed' };
      res.json(booking);
    } catch (error) {
      console.error("Error confirming booking:", (error as any));
      res.status(500).json({ message: "Error confirming booking: " + (error as any).message });
    }
  });

  // Refund routes
  app.post('/api/refund-requests', (req, res, next) => {
    try {
      // Используем фиктивного пользователя-участника
      const user = { id: 'test-user', role: 'participant' };
      const { bookingId, reason } = req.body;
      // Проверяем фиктивное бронирование
      const booking = { id: bookingId, participantId: user.id };
      if (!booking || booking.participantId !== user.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      // Создаём фиктивный запрос на возврат
      const refundRequest = { id: 1, bookingId, reason, status: 'pending' };
      res.status(201).json(refundRequest);
    } catch (error) {
      console.error("Error creating refund request:", (error as any));
      res.status(400).json({ message: (error as any).message || "Failed to create refund request" });
    }
  });

  app.post('/api/process-refund/:id', (req, res, next) => {
    try {
      const refundRequestId = parseInt(req.params.id);
      const { approved, adminNotes } = req.body;
      // Используем фиктивного пользователя-организатора
      const user = { id: 'test-user', role: 'organizer' };
      // Проверяем фиктивный запрос на возврат и бронирование
      const refundRequest: any = { id: refundRequestId, bookingId: 1, status: 'pending', refundAmount: null, adminNotes: null, processedDate: null };
      const booking = { id: 1, retreatId: 1, participantId: 'test-user', participants: 1, totalAmount: '100', status: 'confirmed', stripePaymentIntentId: 'test-client-secret' };
      const retreat = { id: 1, organizerId: 'test-user' };
      if (!retreat || retreat.organizerId !== user.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      if (approved) {
        // Фиктивный возврат Stripe
        const refund = { id: 'test-refund-id' };
        // Обновляем фиктивные статусы
        booking.status = 'refunded';
        refundRequest.status = 'processed';
        refundRequest.refundAmount = booking.totalAmount;
        refundRequest.adminNotes = adminNotes;
        refundRequest.processedDate = new Date();
      } else {
        refundRequest.status = 'denied';
        refundRequest.adminNotes = adminNotes;
        refundRequest.processedDate = new Date();
      }
      res.json(refundRequest);
    } catch (error) {
      console.error("Error processing refund:", (error as any));
      res.status(500).json({ message: "Error processing refund: " + (error as any).message });
    }
  });

  // Восстановление пароля (отправка письма через nodemailer)
  app.post('/api/forgot-password', async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email обязателен" });
    }
    // Проверяем, есть ли такой пользователь
    const usersResult = await db.select().from(users).where(eq(users.email, email));
    if (usersResult.length > 0) {
      // Генерируем токен для сброса пароля
      const resetToken = Math.random().toString(36).slice(2) + Date.now();
      // Сохраняем связь токен <-> email (в памяти)
      resetTokens[resetToken] = email;
      const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_FROM) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
        try {
          await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: email,
            subject: "Восстановление пароля YogaRetreatPro",
            text: `Для сброса пароля перейдите по ссылке: ${resetLink}`,
            html: `<p>Для сброса пароля <a href='${resetLink}'>перейдите по ссылке</a>.</p>`
          });
          console.log(`Письмо для сброса пароля отправлено на ${email}`);
        } catch (err) {
          console.error("Ошибка отправки письма:", err);
        }
      } else {
        console.log(`Ссылка для сброса пароля для ${email}: ${resetLink}`);
        console.warn("SMTP не настроен. Письмо не отправлено.");
      }
    }
    // Всегда возвращаем успех, чтобы не раскрывать, есть ли email
    res.json({ message: "Если email зарегистрирован, инструкция по восстановлению отправлена!" });
  });

  // Эндпоинт для сброса пароля
  app.post('/api/reset-password', async (req, res) => {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ message: "Токен и новый пароль обязательны" });
    }
    const email = resetTokens[token];
    if (!email) {
      return res.status(400).json({ message: "Недействительный или устаревший токен" });
    }
    // Находим пользователя по email
    const usersResult = await db.select().from(users).where(eq(users.email, email));
    if (!usersResult.length) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    // Хэшируем новый пароль
    const password_hash = await bcrypt.hash(password, 10);
    // Обновляем пароль в базе
    await db.update(users).set({ password_hash }).where(eq(users.email, email));
    // Удаляем токен (одноразовый)
    delete resetTokens[token];
    res.json({ message: "Пароль успешно изменён!" });
  });

  // Регистрация через Google (проверка данных Google аккаунта)
  app.post('/api/google-register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Все поля обязательны" });
    }

    try {
      // Проверяем, существует ли пользователь с таким email
      const existingUser = await db.select().from(users).where(eq(users.email, email));
      if (existingUser.length > 0) {
        return res.status(409).json({ message: "Пользователь с таким Email уже существует" });
      }

      // Здесь должна быть проверка данных Google аккаунта
      // Для демонстрации просто создаем пользователя
      // В реальном приложении здесь нужно проверить данные через Google API
      
      const password_hash = await bcrypt.hash(password, 10);
      const [newUser] = await db.insert(users).values({
        id: email, // Используем email как id для совместимости
        email,
        firstName,
        lastName,
        password_hash,
        role: "user"
      }).returning();

      // Генерируем JWT токен
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
      res.json({ 
        message: "Пользователь успешно зарегистрирован через Google",
        token,
        user: { id: newUser.id, email: newUser.email, firstName: newUser.firstName, lastName: newUser.lastName }
      });
    } catch (error) {
      console.error("Ошибка регистрации через Google:", error);
      res.status(500).json({ message: "Ошибка регистрации" });
    }
  });

  // Регистрация партнера/организатора
  app.post('/api/auth/register-partner', async (req, res) => {
    try {
      const { name, surname, email, phone, company, experience, password, role } = req.body;
      
      if (!name || !surname || !email || !password) {
        return res.status(400).json({ 
          success: false, 
          message: "Имя, фамилия, email и пароль обязательны" 
        });
      }

      // Нормализуем email
      const normalizedEmail = String(email).trim().toLowerCase();
      
      // Проверяем, что email не занят
      const existing = await db.select().from(users).where(eq(users.email, normalizedEmail));
      if (existing.length > 0) {
        return res.status(409).json({ 
          success: false, 
          message: "Пользователь с таким email уже зарегистрирован" 
        });
      }

      // Генерация уникального id
      const id = crypto.randomUUID();
      
      // Хеширование пароля
      const password_hash = await bcrypt.hash(password, 10);
      
      // Создание пользователя-организатора
      const [user] = await db.insert(users).values({
        id,
        firstName: name,
        lastName: surname,
        email: normalizedEmail,
        role: "organizer", // Устанавливаем роль организатора
        password_hash,
      }).returning();

      // Генерация JWT
      const token = jwt.sign(
        { id: user.id, email: user.email }, 
        process.env.JWT_SECRET!, 
        { expiresIn: "7d" }
      );
      
      res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
      
      res.status(201).json({ 
        success: true,
        message: "Аккаунт партнера успешно создан",
        user: { 
          id: user.id, 
          email: user.email, 
          firstName: user.firstName, 
          lastName: user.lastName,
          role: user.role 
        }
      });
    } catch (error) {
      console.error("Partner registration error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Ошибка при создании аккаунта партнера" 
      });
    }
  });

  // Вход через Google (проверка данных Google аккаунта)
  app.post('/api/google-login', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email и пароль обязательны" });
    }

    try {
      // Ищем пользователя по email
      const usersResult = await db.select().from(users).where(eq(users.email, email));
      if (usersResult.length === 0) {
        return res.status(404).json({ message: "Пользователь с такими данными не зарегистрирован" });
      }

      const user = usersResult[0];

      // Проверяем пароль
      if (!user.password_hash) {
        return res.status(401).json({ message: "Пользователь не имеет пароля" });
      }
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Неверный пароль" });
      }

      // Здесь должна быть дополнительная проверка данных Google аккаунта
      // В реальном приложении здесь нужно проверить данные через Google API

      // Генерируем JWT токен
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
      res.json({ 
        message: "Успешный вход через Google",
        token,
        user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName }
      });
    } catch (error) {
      console.error("Ошибка входа через Google:", error);
      res.status(500).json({ message: "Ошибка входа" });
    }
  });

  // API endpoint для заявок организаторов ретритов
  app.post("/api/retreat-applications", async (req, res) => {
    try {
      console.log("Получена заявка организатора:", req.body);
      
      // Валидируем данные с помощью Zod схемы
      const validatedData = insertRetreatApplicationSchema.parse(req.body);
      
      // Временно сохраняем в файл вместо БД (пока не настроим подключение)
      const fs = require('fs');
      const path = require('path');
      
      const applicationWithId = {
        id: Date.now(), // Временный ID
        ...validatedData,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Сохраняем в файл applications.json
      const applicationsFile = path.join(process.cwd(), 'applications.json');
      let applications = [];
      
      try {
        if (fs.existsSync(applicationsFile)) {
          const data = fs.readFileSync(applicationsFile, 'utf8');
          applications = JSON.parse(data);
        }
      } catch (err) {
        console.log('Создаем новый файл applications.json');
      }
      
      applications.push(applicationWithId);
      fs.writeFileSync(applicationsFile, JSON.stringify(applications, null, 2));
      
      console.log("Заявка успешно сохранена в файл:", applicationWithId);
      
      res.status(201).json({
        success: true,
        message: "Заявка успешно отправлена! Мы свяжемся с вами в течение 24 часов.",
        application: applicationWithId
      });
    } catch (error) {
      console.error("Ошибка при сохранении заявки:", error);
      
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          message: "Ошибка валидации данных",
          errors: error
        });
      }
      
      res.status(500).json({
        success: false,
        message: "Ошибка сервера при обработке заявки"
      });
    }
  });

  // Обработка всех остальных маршрутов (кроме API) — возвращаем пустой ответ
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api/')) {
      res.status(200).send('');
    } else {
      res.status(404).json({ message: 'API route not found' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}