import { Link } from "wouter";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Search, Users, Clock, MapPin } from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
  retreatCount: number;
  imageUrl: string;
  popular?: boolean;
  color: string;
  benefits: string[];
  difficulty: "Начинающий" | "Средний" | "Продвинутый" | "Все уровни";
}

export default function Categories() {
  const categories: Category[] = [
    {
      id: "hatha-yoga",
      name: "Хатха йога",
      description: "Медленные, осознанные движения для глубокого познания йоги",
      retreatCount: 156,
      imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
      popular: true,
      color: "bg-sage-green",
      benefits: ["Гибкость", "Баланс", "Осознанность"],
      difficulty: "Все уровни"
    },
    {
      id: "vinyasa",
      name: "Виньяса",
      description: "Динамичные последовательности, синхронизированные с дыханием",
      retreatCount: 203,
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
      popular: true,
      color: "bg-warm-orange",
      benefits: ["Сила", "Выносливость", "Поток"],
      difficulty: "Средний"
    },
    {
      id: "ashtanga",
      name: "Аштанга",
      description: "Традиционная система йоги с фиксированными последовательностями",
      retreatCount: 89,
      imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      color: "bg-forest-green",
      benefits: ["Дисциплина", "Сила", "Очищение"],
      difficulty: "Продвинутый"
    },
    {
      id: "yin-yoga",
      name: "Инь йога",
      description: "Пассивные позы для глубокого расслабления и медитации",
      retreatCount: 124,
      imageUrl: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=400",
      popular: true,
      color: "bg-purple-500",
      benefits: ["Расслабление", "Гибкость", "Медитация"],
      difficulty: "Все уровни"
    },
    {
      id: "meditation",
      name: "Медитация",
      description: "Практики осознанности и внутреннего покоя",
      retreatCount: 178,
      imageUrl: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400",
      color: "bg-blue-500",
      benefits: ["Покой", "Концентрация", "Осознанность"],
      difficulty: "Все уровни"
    },
    {
      id: "detox",
      name: "Детокс",
      description: "Очищение тела и разума через йогу и правильное питание",
      retreatCount: 92,
      imageUrl: "https://images.unsplash.com/photo-1551524164-6cf2ac531400?w=400",
      color: "bg-green-500",
      benefits: ["Очищение", "Энергия", "Здоровье"],
      difficulty: "Все уровни"
    },
    {
      id: "wellness",
      name: "Велнес",
      description: "Комплексный подход к здоровью и благополучию",
      retreatCount: 145,
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
      color: "bg-pink-500",
      benefits: ["Здоровье", "Баланс", "Красота"],
      difficulty: "Все уровни"
    },
    {
      id: "spiritual",
      name: "Духовные практики",
      description: "Глубокое погружение в духовные аспекты йоги",
      retreatCount: 67,
      imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
      color: "bg-indigo-500",
      benefits: ["Духовность", "Мудрость", "Трансформация"],
      difficulty: "Средний"
    }
  ];

  const popularCategories = categories.filter(cat => cat.popular);
  const totalRetreats = categories.reduce((sum, cat) => sum + cat.retreatCount, 0);

  return (
    <div className="min-h-screen bg-[#fff6f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-forest-green mb-6">
            Найдите свой идеальный ретрит
          </h1>
          <p className="text-xl text-soft-gray max-w-3xl mx-auto mb-8">
            Выберите тип практики, который резонирует с вашей душой. От динамичной виньясы до 
            медитативной инь йоги — у нас есть ретрит для каждого уровня и стиля практики.
          </p>
          
          {/* Stats */}
          <div className="flex justify-center items-center gap-8 text-sm text-soft-gray mb-8">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-warm-orange" />
              <span>{totalRetreats} ретритов</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-sage-green" />
              <span>50+ стран</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-forest-green" />
              <span>Круглый год</span>
            </div>
          </div>
        </div>

        {/* Popular Categories */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-forest-green">Популярные направления</h2>
            <Badge className="bg-warm-orange text-black">Топ выбор</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {popularCategories.map((category) => (
              <Link key={category.id} href={`/category/${category.id}`}>
                <Card className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="relative">
                    <img 
                      src={category.imageUrl}
                      alt={category.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                      <p className="text-sm opacity-90">{category.retreatCount} ретритов</p>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className={`${category.color} text-white`}>
                        {category.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-soft-gray mb-4">{category.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {category.benefits.map((benefit) => (
                        <Badge key={benefit} variant="outline" className="text-xs border-sage-green text-sage-green">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* All Categories */}
        <div>
          <h2 className="text-2xl font-bold text-forest-green mb-8">Все типы ретритов</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/category/${category.id}`}>
                <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
                  <div className="relative">
                    <img 
                      src={category.imageUrl}
                      alt={category.name}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-2 left-3 text-white">
                      <h3 className="font-semibold text-sm">{category.name}</h3>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <Badge className={`${category.color} text-white text-xs`}>
                        {category.difficulty}
                      </Badge>
                      <span className="text-xs text-soft-gray">{category.retreatCount} ретритов</span>
                    </div>
                    <p className="text-xs text-soft-gray mb-3 line-clamp-2">{category.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {category.benefits.slice(0, 2).map((benefit) => (
                        <Badge key={benefit} variant="outline" className="text-xs border-sage-green text-sage-green">
                          {benefit}
                        </Badge>
                      ))}
                      {category.benefits.length > 2 && (
                        <Badge variant="outline" className="text-xs border-sage-green text-sage-green">
                          +{category.benefits.length - 2}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-sage-green/10 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-forest-green mb-4">
            Не можете определиться?
          </h3>
          <p className="text-soft-gray mb-6 max-w-2xl mx-auto">
            Наши эксперты помогут подобрать идеальный ретрит, учитывая ваш уровень практики, 
            предпочтения и цели. Получите персональную консультацию бесплатно.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/retreats">
              <button className="bg-warm-orange hover:bg-warm-orange/90 text-black font-semibold px-6 py-3 rounded-lg transition-colors">
                Посмотреть все ретриты
              </button>
            </Link>
            <Link href="/contact">
              <button className="border-2 border-sage-green text-sage-green hover:bg-sage-green hover:text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                Получить консультацию
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
