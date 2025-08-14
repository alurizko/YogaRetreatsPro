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
import { db } from './db';
import { users, retreats, instructors, bookings, reviews, blog_posts, retreat_instructors } from '../shared/schema';
function fillTestData() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Добавление пользователей
                return [4 /*yield*/, db.insert(users).values([
                        { id: '1', firstName: 'Анна', lastName: 'Смирнова', email: 'anna@example.com', password_hash: 'hash2', role: 'instructor' },
                        { id: '2', firstName: 'Ольга', lastName: 'Петрова', email: 'olga@example.com', password_hash: 'hash3', role: 'admin' },
                    ])];
                case 1:
                    // Добавление пользователей
                    _a.sent();
                    // Добавление ретритов
                    return [4 /*yield*/, db.insert(retreats).values([
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
                        ])];
                case 2:
                    // Добавление ретритов
                    _a.sent();
                    // Добавление преподавателей
                    return [4 /*yield*/, db.insert(instructors).values([
                            { firstName: 'Анна', lastName: 'Смирнова', bio: 'Сертифицированный инструктор', photoUrl: '' },
                            { firstName: 'Дмитрий', lastName: 'Кузнецов', bio: 'Опыт 10 лет', photoUrl: '' },
                        ])];
                case 3:
                    // Добавление преподавателей
                    _a.sent();
                    // Связка ретритов и преподавателей
                    return [4 /*yield*/, db.insert(retreat_instructors).values([
                            { retreat_id: 1, instructor_id: 1 },
                            { retreat_id: 1, instructor_id: 2 },
                            { retreat_id: 2, instructor_id: 1 },
                        ])];
                case 4:
                    // Связка ретритов и преподавателей
                    _a.sent();
                    // Добавление бронирований
                    return [4 /*yield*/, db.insert(bookings).values([
                            { participant_id: '1', retreatId: 1, participants: 1, totalAmount: "35000", status: 'confirmed' },
                            { participant_id: '1', retreatId: 2, participants: 1, totalAmount: "40000", status: 'confirmed' },
                            { participant_id: '2', retreatId: 1, participants: 1, totalAmount: "35000", status: 'confirmed' },
                        ])];
                case 5:
                    // Добавление бронирований
                    _a.sent();
                    // Добавление отзывов
                    return [4 /*yield*/, db.insert(reviews).values([
                            { user_id: '1', retreat_id: 1, rating: 5, comment: 'Очень понравилось!' },
                            { user_id: '2', retreat_id: 1, rating: 4, comment: 'Хороший опыт.' },
                        ])];
                case 6:
                    // Добавление отзывов
                    _a.sent();
                    // Добавление блог-постов
                    return [4 /*yield*/, db.insert(blog_posts).values([
                            { author_id: '1', title: 'Мой первый ретрит', content: 'Это было незабываемо!' },
                            { author_id: '2', title: 'Советы по йоге', content: 'Практикуйте каждый день.' },
                        ])];
                case 7:
                    // Добавление блог-постов
                    _a.sent();
                    console.log('Тестовые данные успешно добавлены!');
                    return [2 /*return*/];
            }
        });
    });
}
fillTestData()
    .catch(function (e) {
    console.error('Ошибка при добавлении тестовых данных:', e);
    process.exit(1);
})
    .then(function () { return process.exit(0); });
