import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Link } from "wouter";
import { Heart, Star, MapPin, Clock, Users, TrendingUp, Target, Sparkles } from "lucide-react";

interface UserPreferences {
  experience: "beginner" | "intermediate" | "advanced";
  styles: string[];
  intensity: "low" | "medium" | "high";
  duration: "short" | "medium" | "long";
  budget: "budget" | "mid" | "luxury";
  location: string[];
  goals: string[];
  previousRetreats: string[];
}

interface RecommendationReason {
  type: "style_match" | "experience_level" | "location_preference" | "goal_alignment" | "trending" | "instructor_match";
  description: string;
  confidence: number;
}

interface RecommendedRetreat {
  id: string;
  title: string;
  location: string;
  price: number;
  duration: number;
  startDate: string;
  description: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  features: string[];
  instructor: string;
  style: string;
  intensity: "low" | "medium" | "high";
  reasons: RecommendationReason[];
  matchScore: number;
}

interface PersonalizedRecommendationsProps {
  userPreferences?: UserPreferences;
  className?: string;
}

export default function PersonalizedRecommendations({ userPreferences, className }: PersonalizedRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<RecommendedRetreat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock user preferences if not provided
  const defaultPreferences: UserPreferences = {
    experience: "intermediate",
    styles: ["vinyasa", "hatha"],
    intensity: "medium",
    duration: "medium",
    budget: "mid",
    location: ["bali", "india", "costa-rica"],
    goals: ["stress-relief", "flexibility", "mindfulness"],
    previousRetreats: ["yoga-basics", "meditation-intro"]
  };

  const currentPreferences = userPreferences || defaultPreferences;

  // Mock recommendation algorithm
  useEffect(() => {
    const generateRecommendations = () => {
      const mockRetreats: RecommendedRetreat[] = [
        {
          id: "rec-1",
          title: "Виньяса Флоу в Убуде",
          location: "Убуд, Бали, Индонезия",
          price: 120,
          duration: 7,
          startDate: "2025-03-15",
          description: "Динамичная практика виньясы в сердце Бали с акцентом на осознанность",
          imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
          rating: 4.8,
          reviewCount: 124,
          features: ["Питание включено", "Массаж", "Экскурсии"],
          instructor: "Анна Петрова",
          style: "vinyasa",
          intensity: "medium",
          matchScore: 95,
          reasons: [
            { type: "style_match", description: "Соответствует вашему предпочтению виньяса йоги", confidence: 90 },
            { type: "location_preference", description: "Бали - одна из ваших предпочитаемых локаций", confidence: 85 },
            { type: "experience_level", description: "Подходит для среднего уровня практики", confidence: 80 }
          ]
        },
        {
          id: "rec-2",
          title: "Хатха и Медитация в Ришикеше",
          location: "Ришикеш, Индия",
          price: 85,
          duration: 10,
          startDate: "2025-04-01",
          description: "Традиционная хатха йога с глубокой медитативной практикой",
          imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
          rating: 4.9,
          reviewCount: 89,
          features: ["Вегетарианское меню", "Медитация", "Горы"],
          instructor: "Михаил Волков",
          style: "hatha",
          intensity: "low",
          matchScore: 88,
          reasons: [
            { type: "style_match", description: "Хатха йога входит в ваши предпочтения", confidence: 85 },
            { type: "goal_alignment", description: "Медитация поможет достичь осознанности", confidence: 90 },
            { type: "location_preference", description: "Индия соответствует вашим интересам", confidence: 80 }
          ]
        },
        {
          id: "rec-3",
          title: "Стресс-релиф Ретрит в Коста-Рике",
          location: "Мануэль Антонио, Коста-Рика",
          price: 95,
          duration: 5,
          startDate: "2025-05-10",
          description: "Специальная программа для снятия стресса с йогой на пляже",
          imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
          rating: 4.7,
          reviewCount: 67,
          features: ["Пляж рядом", "Серфинг", "Spa-процедуры"],
          instructor: "Елена Смирнова",
          style: "restorative",
          intensity: "low",
          matchScore: 82,
          reasons: [
            { type: "goal_alignment", description: "Идеально для снятия стресса", confidence: 95 },
            { type: "location_preference", description: "Коста-Рика в вашем списке предпочтений", confidence: 80 },
            { type: "trending", description: "Популярно среди пользователей с похожими интересами", confidence: 75 }
          ]
        }
      ];

      setRecommendations(mockRetreats);
      setIsLoading(false);
    };

    // Simulate API call delay
    setTimeout(generateRecommendations, 1000);
  }, [currentPreferences]);

  const getReasonIcon = (type: RecommendationReason["type"]) => {
    switch (type) {
      case "style_match":
        return <Target className="w-4 h-4" />;
      case "location_preference":
        return <MapPin className="w-4 h-4" />;
      case "goal_alignment":
        return <Heart className="w-4 h-4" />;
      case "trending":
        return <TrendingUp className="w-4 h-4" />;
      case "experience_level":
        return <Users className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 80) return "text-blue-600 bg-blue-100";
    if (score >= 70) return "text-orange-600 bg-orange-100";
    return "text-gray-600 bg-gray-100";
  };

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-warm-orange animate-pulse" />
          <h2 className="text-2xl font-bold text-forest-green">Подбираем для вас...</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg" />
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-200 rounded mb-4" />
                <div className="h-8 bg-gray-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-warm-orange" />
          <h2 className="text-2xl font-bold text-forest-green">Рекомендации для вас</h2>
        </div>
        <Badge className="bg-warm-orange text-black">
          Персонализировано
        </Badge>
      </div>

      {/* User Preferences Summary */}
      <Card className="bg-sage-green/5 border-sage-green/20">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-forest-green">Ваши предпочтения:</span>
            {currentPreferences.styles.map((style) => (
              <Badge key={style} variant="outline" className="border-sage-green text-sage-green text-xs">
                {style}
              </Badge>
            ))}
            <Badge variant="outline" className="border-sage-green text-sage-green text-xs">
              {currentPreferences.experience}
            </Badge>
            <Badge variant="outline" className="border-sage-green text-sage-green text-xs">
              {currentPreferences.intensity} интенсивность
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {recommendations.map((retreat) => (
          <Card key={retreat.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
            {/* Match Score Badge */}
            <div className="absolute top-3 right-3 z-10">
              <Badge className={`${getMatchScoreColor(retreat.matchScore)} font-semibold`}>
                {retreat.matchScore}% совпадение
              </Badge>
            </div>

            {/* Image */}
            <div className="relative">
              <img 
                src={retreat.imageUrl}
                alt={retreat.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            <CardContent className="p-6">
              {/* Title and Rating */}
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-forest-green line-clamp-2">{retreat.title}</h3>
                <div className="flex items-center gap-1 ml-2">
                  <Star className="w-4 h-4 text-warm-orange fill-current" />
                  <span className="text-sm font-medium">{retreat.rating}</span>
                </div>
              </div>

              {/* Location and Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600 text-sm">
                  <MapPin className="w-4 h-4 mr-2" />
                  {retreat.location}
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <Clock className="w-4 h-4 mr-2" />
                  {retreat.duration} дней • {retreat.instructor}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-700 mb-4 line-clamp-2">{retreat.description}</p>

              {/* Why Recommended */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-forest-green mb-2">Почему мы рекомендуем:</h4>
                <div className="space-y-1">
                  {retreat.reasons.slice(0, 2).map((reason, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                      <div className="text-sage-green">
                        {getReasonIcon(reason.type)}
                      </div>
                      <span>{reason.description}</span>
                    </div>
                  ))}
                  {retreat.reasons.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{retreat.reasons.length - 2} других причин
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-1 mb-4">
                {retreat.features.slice(0, 3).map((feature) => (
                  <Badge key={feature} variant="outline" className="text-xs border-sage-green text-sage-green">
                    {feature}
                  </Badge>
                ))}
              </div>

              {/* Price and CTA */}
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-lg font-bold text-forest-green">
                    от €{retreat.price}
                  </div>
                  <div className="text-xs text-gray-500">за день</div>
                </div>
                <Link href={`/retreat/${retreat.id}`}>
                  <Button className="bg-warm-orange hover:bg-warm-orange/90 text-black font-semibold">
                    Подробнее
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View All Link */}
      <div className="text-center">
        <Link href="/retreats">
          <Button variant="outline" className="border-sage-green text-sage-green hover:bg-sage-green hover:text-white">
            Посмотреть все ретриты
          </Button>
        </Link>
      </div>
    </div>
  );
}
