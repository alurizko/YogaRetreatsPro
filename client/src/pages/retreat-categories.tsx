import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Circle, 
  Mountain, 
  Waves, 
  Heart, 
  Leaf, 
  Sun, 
  Moon, 
  Users, 
  Sparkles,
  TreePine,
  Flower2,
  Zap
} from "lucide-react";

const categories = [
  {
    id: "hatha",
    title: "Хатха йога",
    description: "Медленные, осознанные движения для глубокого понимания асан",
    icon: Circle,
    color: "bg-sage-green",
    count: 156,
    popular: true
  },
  {
    id: "vinyasa",
    title: "Виньяса",
    description: "Динамичные последовательности, синхронизированные с дыханием",
    icon: Zap,
    color: "bg-warm-orange",
    count: 203,
    popular: true
  },
  {
    id: "ashtanga",
    title: "Аштанга",
    description: "Традиционная система йоги с фиксированными последовательностями",
    icon: Mountain,
    color: "bg-forest-green",
    count: 89,
    popular: false
  },
  {
    id: "yin",
    title: "Инь йога",
    description: "Пассивные позы для глубокого расслабления и медитации",
    icon: Moon,
    color: "bg-purple-500",
    count: 124,
    popular: true
  },
  {
    id: "meditation",
    title: "Медитация",
    description: "Практики осознанности и внутреннего покоя",
    icon: Sparkles,
    color: "bg-blue-500",
    count: 178,
    popular: true
  },
  {
    id: "detox",
    title: "Детокс",
    description: "Очищение тела и разума через йогу и правильное питание",
    icon: Leaf,
    color: "bg-green-500",
    count: 67,
    popular: false
  },
  {
    id: "beach",
    title: "Йога на пляже",
    description: "Практика у моря с звуками волн и морским воздухом",
    icon: Waves,
    color: "bg-cyan-500",
    count: 142,
    popular: true
  },
  {
    id: "mountain",
    title: "Горная йога",
    description: "Ретриты в горах с чистым воздухом и потрясающими видами",
    icon: TreePine,
    color: "bg-emerald-600",
    count: 98,
    popular: false
  },
  {
    id: "healing",
    title: "Исцеляющая йога",
    description: "Терапевтические практики для восстановления и лечения",
    icon: Heart,
    color: "bg-pink-500",
    count: 134,
    popular: true
  },
  {
    id: "spiritual",
    title: "Духовные практики",
    description: "Глубокие духовные традиции и философия йоги",
    icon: Sun,
    color: "bg-yellow-500",
    count: 76,
    popular: false
  },
  {
    id: "women",
    title: "Женские ретриты",
    description: "Специальные программы для женщин всех возрастов",
    icon: Flower2,
    color: "bg-rose-500",
    count: 112,
    popular: true
  },
  {
    id: "group",
    title: "Групповые ретриты",
    description: "Путешествия с единомышленниками и новыми друзьями",
    icon: Users,
    color: "bg-indigo-500",
    count: 189,
    popular: true
  }
];

const locations = [
  { name: "Бали, Индонезия", count: 234, flag: "🇮🇩" },
  { name: "Ришикеш, Индия", count: 189, flag: "🇮🇳" },
  { name: "Коста-Рика", count: 156, flag: "🇨🇷" },
  { name: "Тоскана, Италия", count: 143, flag: "🇮🇹" },
  { name: "Тулум, Мексика", count: 128, flag: "🇲🇽" },
  { name: "Миконос, Греция", count: 112, flag: "🇬🇷" },
  { name: "Марракеш, Марокко", count: 98, flag: "🇲🇦" },
  { name: "Убуд, Бали", count: 87, flag: "🇮🇩" }
];

export default function RetreatCategories() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#fff6f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-forest-green mb-4">
            Найдите свой идеальный ретрит
          </h1>
          <p className="text-lg text-soft-gray max-w-3xl mx-auto">
            Выберите тип практики, который резонирует с вашей душой. От динамичной виньясы до медитативной инь йоги — 
            у нас есть ретрит для каждого уровня и стиля практики.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-forest-green mb-8 text-center">Типы ретритов</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Link key={category.id} href={`/retreats?type=${category.id}`}>
                  <Card className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer relative">
                    {category.popular && (
                      <div className="absolute top-3 right-3 z-10">
                        <Badge className="bg-warm-orange text-black font-semibold text-xs">
                          Популярно
                        </Badge>
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className={`p-3 rounded-full ${category.color} text-white mr-4`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-forest-green">{category.title}</h3>
                          <p className="text-sm text-soft-gray">{category.count} ретритов</p>
                        </div>
                      </div>
                      <p className="text-sm text-soft-gray line-clamp-2 mb-4">
                        {category.description}
                      </p>
                      <Button 
                        variant="outline" 
                        className="w-full border-sage-green text-forest-green hover:bg-sage-green/10"
                      >
                        Смотреть ретриты
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Popular Destinations */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-forest-green mb-8 text-center">Популярные направления</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {locations.map((location) => (
              <Link key={location.name} href={`/retreats?location=${encodeURIComponent(location.name)}`}>
                <Card className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">{location.flag}</div>
                    <h3 className="text-lg font-semibold text-forest-green mb-2">{location.name}</h3>
                    <p className="text-sm text-soft-gray">{location.count} ретритов</p>
                    <Button 
                      variant="outline" 
                      className="w-full mt-4 border-sage-green text-forest-green hover:bg-sage-green/10"
                    >
                      Исследовать
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-forest-green mb-4">Почему выбирают YogaRetreatPro?</h2>
            <p className="text-soft-gray max-w-2xl mx-auto">
              Мы тщательно отбираем каждый ретрит, чтобы гарантировать вам незабываемый опыт трансформации
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-sage-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-sage-green" />
              </div>
              <h3 className="font-semibold text-forest-green mb-2">Проверенные организаторы</h3>
              <p className="text-sm text-soft-gray">Все наши партнеры имеют сертификаты и многолетний опыт</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-warm-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-warm-orange" />
              </div>
              <h3 className="font-semibold text-forest-green mb-2">Реальные отзывы</h3>
              <p className="text-sm text-soft-gray">Только честные отзывы от реальных участников</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-sage-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-sage-green" />
              </div>
              <h3 className="font-semibold text-forest-green mb-2">Лучшие цены</h3>
              <p className="text-sm text-soft-gray">Гарантия лучшей цены и прозрачное ценообразование</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-warm-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-warm-orange" />
              </div>
              <h3 className="font-semibold text-forest-green mb-2">Поддержка 24/7</h3>
              <p className="text-sm text-soft-gray">Мы всегда готовы помочь на русском языке</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
