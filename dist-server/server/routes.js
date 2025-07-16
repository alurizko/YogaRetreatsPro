var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { createServer } from "http";
import Stripe from "stripe";
// Удалён импорт setupAuth, isAuthenticated из ./replitAuth
import { insertRetreatSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { db } from "./db";
var stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2025-06-30.basil",
    });
}
else {
    console.warn('Warning: STRIPE_SECRET_KEY not configured. Payment functionality will be disabled.');
}
export function registerRoutes(app) {
    return __awaiter(this, void 0, void 0, function () {
        var httpServer;
        var _this = this;
        return __generator(this, function (_a) {
            // Удалён вызов setupAuth(app);
            // Удалить или заменить все использования isAuthenticated на (req, res, next) => next() для теста
            // Auth routes
            app.get('/api/auth/user', function (req, res, next) {
                try {
                    // Возвращаем фиктивного пользователя для теста
                    var user = { id: 'test-user', role: 'organizer', email: 'test@example.com' };
                    res.json(user);
                }
                catch (error) {
                    console.error("Error fetching user:", error);
                    res.status(500).json({ message: "Failed to fetch user" });
                }
            });
            // Регистрация пользователя
            app.post('/api/register', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var _a, firstName, lastName, email, password, existing, id, password_hash, user, token, error_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 4, , 5]);
                            _a = req.body, firstName = _a.firstName, lastName = _a.lastName, email = _a.email, password = _a.password;
                            if (!firstName || !lastName || !email || !password) {
                                return [2 /*return*/, res.status(400).json({ message: "Имя, фамилия, email и пароль обязательны" })];
                            }
                            return [4 /*yield*/, db.select().from(users).where(eq(users.email, email))];
                        case 1:
                            existing = _b.sent();
                            if (existing.length > 0) {
                                return [2 /*return*/, res.status(400).json({ message: "Email уже зарегистрирован" })];
                            }
                            id = crypto.randomUUID();
                            return [4 /*yield*/, bcrypt.hash(password, 10)];
                        case 2:
                            password_hash = _b.sent();
                            return [4 /*yield*/, db.insert(users).values({
                                    id: id,
                                    firstName: firstName,
                                    lastName: lastName,
                                    email: email,
                                    role: "user",
                                    password_hash: password_hash,
                                }).returning()];
                        case 3:
                            user = (_b.sent())[0];
                            token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
                            res.json({ token: token, user: { id: user.id, email: user.email } });
                            return [3 /*break*/, 5];
                        case 4:
                            error_1 = _b.sent();
                            console.error("Registration error:", error_1);
                            res.status(500).json({ message: "Ошибка регистрации" });
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            }); });
            // Вход пользователя
            app.post('/api/login', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var _a, email, password, existing, user, valid, token, error_2;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            _a = req.body, email = _a.email, password = _a.password;
                            if (!email || !password) {
                                return [2 /*return*/, res.status(400).json({ message: "Email и пароль обязательны" })];
                            }
                            return [4 /*yield*/, db.select().from(users).where(eq(users.email, email))];
                        case 1:
                            existing = _b.sent();
                            if (existing.length === 0) {
                                return [2 /*return*/, res.status(400).json({ message: "Пользователь не найден" })];
                            }
                            user = existing[0];
                            // Проверка наличия хэша пароля
                            if (!user.password_hash) {
                                return [2 /*return*/, res.status(400).json({ message: "У пользователя отсутствует пароль. Обратитесь к администратору." })];
                            }
                            return [4 /*yield*/, bcrypt.compare(password, user.password_hash)];
                        case 2:
                            valid = _b.sent();
                            if (!valid) {
                                return [2 /*return*/, res.status(400).json({ message: "Неверный пароль" })];
                            }
                            token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
                            res.json({ token: token, user: { id: user.id, email: user.email } });
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _b.sent();
                            console.error("Login error:", error_2);
                            res.status(500).json({ message: "Ошибка входа" });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            // Retreat routes
            app.get('/api/retreats', function (req, res) {
                try {
                    // Возвращаем фиктивный список ретритов
                    var retreats = [
                        { id: 1, title: 'Yoga Retreat', organizerId: 'test-user', price: '100', currentParticipants: 0, maxParticipants: 10 },
                    ];
                    res.json(retreats);
                }
                catch (error) {
                    console.error("Error fetching retreats:", error);
                    res.status(500).json({ message: "Failed to fetch retreats" });
                }
            });
            app.get('/api/retreats/:id', function (req, res) {
                try {
                    var id = parseInt(req.params.id);
                    // Возвращаем фиктивный ретрит
                    var retreat = { id: id, organizerId: 'test-user', price: '100', currentParticipants: 0, maxParticipants: 10 };
                    res.json(retreat);
                }
                catch (error) {
                    console.error("Error fetching retreat:", error);
                    res.status(500).json({ message: "Failed to fetch retreat" });
                }
            });
            app.post('/api/retreats', function (req, res, next) {
                try {
                    // Используем фиктивного пользователя-организатора
                    var user = { id: 'test-user', role: 'organizer' };
                    if (!user || user.role !== 'organizer') {
                        return res.status(403).json({ message: "Only organizers can create retreats" });
                    }
                    var retreatData = insertRetreatSchema.parse(__assign(__assign({}, req.body), { organizerId: user.id }));
                    // Возвращаем фиктивный созданный ретрит
                    var retreat = __assign(__assign({}, retreatData), { id: 2, currentParticipants: 0 });
                    res.status(201).json(retreat);
                }
                catch (error) {
                    console.error("Error creating retreat:", error);
                    res.status(400).json({ message: error.message || "Failed to create retreat" });
                }
            });
            app.get('/api/organizer/retreats', function (req, res, next) {
                try {
                    // Используем фиктивного пользователя-организатора
                    var user = { id: 'test-user', role: 'organizer' };
                    var retreats = [
                        { id: 1, title: 'Yoga Retreat', organizerId: user.id, price: '100', currentParticipants: 0, maxParticipants: 10 },
                    ];
                    res.json(retreats);
                }
                catch (error) {
                    console.error("Error fetching organizer retreats:", error);
                    res.status(500).json({ message: "Failed to fetch retreats" });
                }
            });
            // Booking routes
            app.get('/api/bookings', function (req, res, next) {
                try {
                    // Используем фиктивного пользователя-участника
                    var user = { id: 'test-user', role: 'participant' };
                    var bookings = [
                        { id: 1, retreatId: 1, participantId: user.id, participants: 1, totalAmount: '100', status: 'confirmed' },
                    ];
                    res.json(bookings);
                }
                catch (error) {
                    console.error("Error fetching bookings:", error);
                    res.status(500).json({ message: "Failed to fetch bookings" });
                }
            });
            app.get('/api/retreats/:id/bookings', function (req, res, next) {
                try {
                    var retreatId = parseInt(req.params.id);
                    // Используем фиктивного пользователя-организатора
                    var user = { id: 'test-user', role: 'organizer' };
                    // Check if user is the organizer of this retreat
                    var retreat = { organizerId: 'test-user' };
                    if (!retreat || retreat.organizerId !== user.id) {
                        return res.status(403).json({ message: "Access denied" });
                    }
                    var bookings = [
                        { id: 1, retreatId: retreatId, participantId: 'test-user', participants: 1, totalAmount: '100', status: 'confirmed' },
                    ];
                    res.json(bookings);
                }
                catch (error) {
                    console.error("Error fetching retreat bookings:", error);
                    res.status(500).json({ message: "Failed to fetch bookings" });
                }
            });
            // Stripe payment routes
            app.post("/api/create-payment-intent", function (req, res, next) {
                try {
                    if (!stripe) {
                        return res.status(503).json({ message: "Payment processing is currently unavailable. Please contact support." });
                    }
                    var _a = req.body, retreatId = _a.retreatId, participants = _a.participants;
                    // Используем фиктивного пользователя-участника
                    var user = { id: 'test-user', role: 'participant' };
                    var retreat = { price: '100', currentParticipants: 0, maxParticipants: 10 };
                    if (!retreat) {
                        return res.status(404).json({ message: "Retreat not found" });
                    }
                    if (retreat.currentParticipants + participants > retreat.maxParticipants) {
                        return res.status(400).json({ message: "Not enough spots available" });
                    }
                    var amount = parseFloat(retreat.price) * participants;
                    res.json({ clientSecret: 'test-client-secret' });
                }
                catch (error) {
                    console.error("Error creating payment intent:", error);
                    res.status(500).json({ message: "Error creating payment intent: " + error.message });
                }
            });
            app.post("/api/confirm-booking", function (req, res, next) {
                try {
                    if (!stripe) {
                        return res.status(503).json({ message: "Payment processing is currently unavailable. Please contact support." });
                    }
                    var _a = req.body, paymentIntentId = _a.paymentIntentId, retreatId = _a.retreatId, participants = _a.participants;
                    // Используем фиктивного пользователя-участника
                    var user = { id: 'test-user', role: 'participant' };
                    // Проверяем фиктивный payment intent
                    if (paymentIntentId !== 'test-client-secret') {
                        return res.status(400).json({ message: "Payment not successful" });
                    }
                    var retreat = { id: retreatId, price: '100', maxParticipants: 10, currentParticipants: 0 };
                    if (!retreat) {
                        return res.status(404).json({ message: "Retreat not found" });
                    }
                    var totalAmount = parseFloat(retreat.price) * participants;
                    // Создаём фиктивное бронирование
                    var booking = { id: 2, retreatId: retreatId, participantId: user.id, participants: participants, totalAmount: totalAmount.toString(), status: 'confirmed' };
                    res.json(booking);
                }
                catch (error) {
                    console.error("Error confirming booking:", error);
                    res.status(500).json({ message: "Error confirming booking: " + error.message });
                }
            });
            // Refund routes
            app.post('/api/refund-requests', function (req, res, next) {
                try {
                    // Используем фиктивного пользователя-участника
                    var user = { id: 'test-user', role: 'participant' };
                    var _a = req.body, bookingId = _a.bookingId, reason = _a.reason;
                    // Проверяем фиктивное бронирование
                    var booking = { id: bookingId, participantId: user.id };
                    if (!booking || booking.participantId !== user.id) {
                        return res.status(403).json({ message: "Access denied" });
                    }
                    // Создаём фиктивный запрос на возврат
                    var refundRequest = { id: 1, bookingId: bookingId, reason: reason, status: 'pending' };
                    res.status(201).json(refundRequest);
                }
                catch (error) {
                    console.error("Error creating refund request:", error);
                    res.status(400).json({ message: error.message || "Failed to create refund request" });
                }
            });
            app.post('/api/process-refund/:id', function (req, res, next) {
                try {
                    var refundRequestId = parseInt(req.params.id);
                    var _a = req.body, approved = _a.approved, adminNotes = _a.adminNotes;
                    // Используем фиктивного пользователя-организатора
                    var user = { id: 'test-user', role: 'organizer' };
                    // Проверяем фиктивный запрос на возврат и бронирование
                    var refundRequest = { id: refundRequestId, bookingId: 1, status: 'pending', refundAmount: null, adminNotes: null, processedDate: null };
                    var booking = { id: 1, retreatId: 1, participantId: 'test-user', participants: 1, totalAmount: '100', status: 'confirmed', stripePaymentIntentId: 'test-client-secret' };
                    var retreat = { id: 1, organizerId: 'test-user' };
                    if (!retreat || retreat.organizerId !== user.id) {
                        return res.status(403).json({ message: "Access denied" });
                    }
                    if (approved) {
                        // Фиктивный возврат Stripe
                        var refund = { id: 'test-refund-id' };
                        // Обновляем фиктивные статусы
                        booking.status = 'refunded';
                        refundRequest.status = 'processed';
                        refundRequest.refundAmount = booking.totalAmount;
                        refundRequest.adminNotes = adminNotes;
                        refundRequest.processedDate = new Date();
                    }
                    else {
                        refundRequest.status = 'denied';
                        refundRequest.adminNotes = adminNotes;
                        refundRequest.processedDate = new Date();
                    }
                    res.json(refundRequest);
                }
                catch (error) {
                    console.error("Error processing refund:", error);
                    res.status(500).json({ message: "Error processing refund: " + error.message });
                }
            });
            httpServer = createServer(app);
            return [2 /*return*/, httpServer];
        });
    });
}
