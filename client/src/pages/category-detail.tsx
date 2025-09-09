import { useState, useEffect } from "react";
import { Link, useParams } from "wouter";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ArrowLeft, Clock, Users, Target, Heart, Star, MapPin } from "lucide-react";
import RetreatCard from "../components/RetreatCard";

interface CategoryDetail {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  history: string;
  benefits: string[];
  techniques: string[];
  whoShouldTry: string[];
  whatToExpect: string[];
  retreatCount: number;
  imageUrl: string;
  difficulty: string;
  duration: string;
  intensity: "Низкая" | "Средняя" | "Высокая";
  philosophy: string;
  famousTeachers: string[];
}

interface Instructor {
  id: string;
  name: string;
  experience: string;
  specialization: string[];
  rating: number;
  retreatCount: number;
  imageUrl: string;
  bio: string;
}

export default function CategoryDetail() {
  const { categoryId } = useParams();
  const [selectedTab, setSelectedTab] = useState<"overview" | "retreats" | "instructors">("overview");

  const categoryDetails: { [key: string]: CategoryDetail } = {
    "hatha-yoga": {
      id: "hatha-yoga",
      name: "Хатха йога",
      shortDescription: "Медленные, осознанные движения для глубокого познания йоги",
      fullDescription: "Хатха йога - это классическая форма йоги, которая фокусируется на физических позах (асанах) и дыхательных техниках (пранаяме). Это идеальная практика для начинающих и тех, кто хочет углубить понимание основ йоги.",
      history: "Хатха йога возникла в средневековой Индии как система физических и духовных практик. Слово 'хатха' переводится как 'сила' и символизирует баланс между солнечной (ха) и лунной (тха) энергиями.",
      benefits: [
        "Улучшение гибкости и силы",
        "Снижение стресса и тревожности", 
        "Улучшение осанки",
        "Повышение концентрации",
        "Балансировка нервной системы",
        "Улучшение качества сна"
      ],
      techniques: [
        "Асаны (физические позы)",
        "Пранаяма (дыхательные техники)",
        "Медитация",
        "Релаксация",
        "Мантры"
      ],
      whoShouldTry: [
        "Новички в йоге",
        "Люди с ограниченной подвижностью",
        "Те, кто восстанавливается после травм",
        "Люди, ищущие спокойную практику",
        "Желающие изучить основы йоги"
      ],
      whatToExpect: [
        "Медленный темп практики",
        "Долгое удержание поз",
        "Акцент на правильном выравнивании",
        "Дыхательные упражнения",
        "Время для релаксации"
      ],
      retreatCount: 156,
      imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
      difficulty: "Все уровни",
      duration: "60-90 минут",
      intensity: "Низкая",
      philosophy: "Хатха йога учит нас находить баланс между усилием и расслаблением, между активностью и покоем. Это путь к гармонии тела, ума и духа.",
      famousTeachers: ["Б.К.С. Айенгар", "Т.К.В. Дешикачар", "Свами Сатьянанда"]
    },
    "vinyasa": {
      id: "vinyasa",
      name: "Виньяса",
      shortDescription: "Динамичные последовательности, синхронизированные с дыханием",
      fullDescription: "Виньяса йога - это динамичный стиль, где движения плавно переходят одно в другое в ритме дыхания. Каждое движение синхронизировано с вдохом или выдохом, создавая медитативный поток.",
      history: "Виньяса развилась из традиции Аштанга йоги, но предлагает больше творческой свободы в последовательностях. Популяризирована в западном мире в конце 20 века.",
      benefits: [
        "Улучшение сердечно-сосудистой системы",
        "Развитие силы и выносливости",
        "Повышение гибкости",
        "Улучшение координации",
        "Снятие стресса через движение",
        "Развитие осознанности"
      ],
      techniques: [
        "Виньяса флоу",
        "Уджайи пранаяма",
        "Бандхи (энергетические замки)",
        "Дришти (концентрация взгляда)",
        "Творческие последовательности"
      ],
      whoShouldTry: [
        "Люди с базовым опытом йоги",
        "Активные личности",
        "Те, кто любит разнообразие",
        "Желающие динамичную практику",
        "Стремящиеся к физическому вызову"
      ],
      whatToExpect: [
        "Плавные переходы между позами",
        "Синхронизация с дыханием",
        "Разнообразные последовательности",
        "Музыкальное сопровождение",
        "Творческий подход"
      ],
      retreatCount: 203,
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      difficulty: "Средний",
      duration: "60-75 минут",
      intensity: "Средняя",
      philosophy: "Виньяса учит нас течь с жизнью, принимать изменения и находить стабильность в движении. Это практика присутствия в каждом моменте.",
      famousTeachers: ["Шива Рей", "Джейсон Крэнделл", "Катрин Будиг"]
    }
  };

  const instructors: Instructor[] = [
    {
      id: "1",
      name: "Анна Петрова",
      experience: "8 лет",
      specialization: ["Хатха йога", "Медитация", "Пранаяма"],
      rating: 4.9,
      retreatCount: 24,
      imageUrl: "https://images.unsplash.com/photo-1494790108755-2616c9c2f0e4?w=200",
      bio: "Сертифицированный инструктор с глубоким пониманием традиционной йоги"
    },
    {
      id: "2", 
      name: "Михаил Волков",
      experience: "12 лет",
      specialization: ["Виньяса", "Аштанга", "Философия йоги"],
      rating: 4.8,
      retreatCount: 31,
      imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
      bio: "Практикует йогу более 15 лет, обучался в Индии у традиционных мастеров"
    }
  ];

  const category = categoryDetails[categoryId as string];

  if (!category) {
    return (
      <div className="min-h-screen bg-[#fff6f0] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-forest-green mb-4">Категория не найдена</h1>
          <Link href="/categories">
            <Button className="bg-warm-orange hover:bg-warm-orange/90 text-black">
              Вернуться к категориям
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff6f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/categories">
          <Button variant="outline" className="mb-6 border-sage-green text-sage-green hover:bg-sage-green hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к категориям
          </Button>
        </Link>

        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden mb-8">
          <img 
            src={category.imageUrl}
            alt={category.name}
            className="w-full h-64 md:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-4xl mx-auto px-6 text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{category.name}</h1>
              <p className="text-xl md:text-2xl mb-6 opacity-90">{category.shortDescription}</p>
              <div className="flex flex-wrap gap-4 items-center">
                <Badge className="bg-white text-black text-sm px-3 py-1">
                  {category.difficulty}
                </Badge>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{category.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  <span>Интенсивность: {category.intensity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{category.retreatCount} ретритов</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setSelectedTab("overview")}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              selectedTab === "overview" 
                ? "border-warm-orange text-warm-orange" 
                : "border-transparent text-gray-600 hover:text-forest-green"
            }`}
          >
            Обзор
          </button>
          <button
            onClick={() => setSelectedTab("retreats")}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              selectedTab === "retreats" 
                ? "border-warm-orange text-warm-orange" 
                : "border-transparent text-gray-600 hover:text-forest-green"
            }`}
          >
            Ретриты ({category.retreatCount})
          </button>
          <button
            onClick={() => setSelectedTab("instructors")}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              selectedTab === "instructors" 
                ? "border-warm-orange text-warm-orange" 
                : "border-transparent text-gray-600 hover:text-forest-green"
            }`}
          >
            Инструкторы
          </button>
        </div>

        {/* Tab Content */}
        {selectedTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-forest-green mb-4">О практике</h2>
                  <p className="text-gray-700 mb-4">{category.fullDescription}</p>
                  <p className="text-gray-700">{category.history}</p>
                </CardContent>
              </Card>

              {/* Philosophy */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-forest-green mb-4">Философия</h2>
                  <blockquote className="text-lg italic text-gray-700 border-l-4 border-sage-green pl-4">
                    {category.philosophy}
                  </blockquote>
                </CardContent>
              </Card>

              {/* What to Expect */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-forest-green mb-4">Чего ожидать</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.whatToExpect.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-warm-orange rounded-full" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Benefits */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-forest-green mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-warm-orange" />
                    Польза
                  </h3>
                  <ul className="space-y-2">
                    {category.benefits.map((benefit, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-sage-green rounded-full mt-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Techniques */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-forest-green mb-4">Техники</h3>
                  <div className="flex flex-wrap gap-2">
                    {category.techniques.map((technique, index) => (
                      <Badge key={index} variant="outline" className="border-sage-green text-sage-green">
                        {technique}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Who Should Try */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-forest-green mb-4">Подходит для</h3>
                  <ul className="space-y-2">
                    {category.whoShouldTry.map((item, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-warm-orange rounded-full mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Famous Teachers */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-forest-green mb-4">Известные учителя</h3>
                  <ul className="space-y-1">
                    {category.famousTeachers.map((teacher, index) => (
                      <li key={index} className="text-sm text-gray-700">
                        {teacher}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* CTA */}
              <Card className="bg-sage-green/10">
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-bold text-forest-green mb-2">Готовы попробовать?</h3>
                  <p className="text-sm text-gray-700 mb-4">Найдите идеальный ретрит по {category.name.toLowerCase()}</p>
                  <Link href={`/retreats?category=${category.id}`}>
                    <Button className="w-full bg-warm-orange hover:bg-warm-orange/90 text-black">
                      Посмотреть ретриты
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {selectedTab === "retreats" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-forest-green">
                Ретриты по {category.name.toLowerCase()} ({category.retreatCount})
              </h2>
              <Link href={`/retreats?category=${category.id}`}>
                <Button variant="outline" className="border-sage-green text-sage-green hover:bg-sage-green hover:text-white">
                  Все ретриты
                </Button>
              </Link>
            </div>
            <div className="text-center py-12 text-gray-500">
              <p>Здесь будут отображаться ретриты по выбранной категории</p>
              <Link href={`/retreats?category=${category.id}`}>
                <Button className="mt-4 bg-warm-orange hover:bg-warm-orange/90 text-black">
                  Посмотреть все ретриты
                </Button>
              </Link>
            </div>
          </div>
        )}

        {selectedTab === "instructors" && (
          <div>
            <h2 className="text-2xl font-bold text-forest-green mb-6">
              Инструкторы по {category.name.toLowerCase()}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {instructors.map((instructor) => (
                <Card key={instructor.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <img 
                        src={instructor.imageUrl}
                        alt={instructor.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-forest-green">{instructor.name}</h3>
                        <p className="text-sm text-gray-600">Опыт: {instructor.experience}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 text-warm-orange fill-current" />
                          <span className="text-sm font-medium">{instructor.rating}</span>
                          <span className="text-sm text-gray-500">({instructor.retreatCount} ретритов)</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">{instructor.bio}</p>
                    <div className="flex flex-wrap gap-1">
                      {instructor.specialization.map((spec, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-sage-green text-sage-green">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
