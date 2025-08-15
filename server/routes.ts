import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
// Удалён импорт setupAuth, isAuthenticated из ./replitAuth
import { insertRetreatSchema, insertBookingSchema, insertRefundRequestSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { db } from "./db";
import passport from "passport";
import session from "express-session";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import cookieParser from "cookie-parser";

let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-06-30.basil",
  });
} else {
  console.warn('Warning: STRIPE_SECRET_KEY not configured. Payment functionality will be disabled.');
}

export async function registerRoutes(app: Express): Promise<Server> {
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
      // Минимальная интеграция: пользователь создаётся на лету
      let user = {
        id: profile.id,
        email: profile.emails?.[0].value,
        firstName: profile.name?.givenName,
        lastName: profile.name?.familyName,
        role: "participant"
      };
      // Можно добавить сохранение в БД, если нужно
      return done(null, user);
    }
  ));
  passport.serializeUser((user: any, done) => {
    done(null, user);
  });
  passport.deserializeUser((user: any, done) => {
    done(null, user);
  });

  // Google OAuth маршруты
  app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  app.get('/api/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    (req, res) => {
      const user = req.user as any;
      // Генерируем JWT
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );
      // Отправляем токен через httpOnly cookie
      res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
      // Редиректим на дашборд
      res.redirect('/participant-dashboard');
    }
  );

  // Удалён вызов setupAuth(app);

  // Удалить или заменить все использования isAuthenticated на (req, res, next) => next() для теста
  // Auth routes
  app.get('/api/auth/user', (req, res, next) => {
    try {
      // Возвращаем фиктивного пользователя для теста
      const user = { id: 'test-user', role: 'organizer', email: 'test@example.com' };
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
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
      // Проверка, что email не занят
      const existing = await db.select().from(users).where(eq(users.email, email));
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
        email,
        role: "user",
        password_hash,
      }).returning();
      // Генерация JWT
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: "7d" });
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
      res.json({ token, user: { id: user.id, email: user.email } });
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
      const body = req.body as any;
      console.log("/api/retreats body:", req.body);
      const retreatData = insertRetreatSchema.parse({
        ...body,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        price: body.price != null ? String(body.price) : undefined,
        imageUrl: body.imageUrl ? String(body.imageUrl) : undefined,
        isActive: body.isActive != null ? Boolean(body.isActive) : true,
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

  // (удалён временный эндпоинт /api/delete-user)

  const httpServer = createServer(app);
  return httpServer;
}