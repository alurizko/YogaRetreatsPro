import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Checkbox } from "../components/ui/checkbox";
import { Search, Filter, Star, MapPin, Calendar, Users, Heart } from "lucide-react";
import RetreatCard from "../components/RetreatCard";
import StarRating from "../components/StarRating";
import AdvancedFilters, { FilterState } from "../components/AdvancedFilters";

// Временный тип для ретрита
interface Retreat {
  id: string;
  title: string;
  location: string;
  price: number;
  duration: number;
  startDate: string;
  description: string;
  imageUrl?: string;
  rating?: number;
  features?: string[];
  reviewCount?: number;
  reviews?: Review[];
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  helpful: number;
  verified: boolean;
  retreatDate?: string;
}

export default function Retreats() {
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchDuration, setSearchDuration] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [retreatType, setRetreatType] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [accommodation, setAccommodation] = useState("");
  const [mealPlan, setMealPlan] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("recommended");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [minRating, setMinRating] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<FilterState>({
    instructors: [],
    styles: [],
    tags: [],
    minRating: "",
    priceRange: "",
    duration: "",
    location: "",
    intensity: "",
    accommodation: "",
    mealPlan: "",
    language: "",
    groupSize: ""
  });

  // Handle category filter from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    if (category) {
      const categoryMap: { [key: string]: string } = {
        'hatha-yoga': 'hatha',
        'vinyasa': 'vinyasa',
        'ashtanga': 'ashtanga',
        'yin-yoga': 'yin',
        'meditation': 'meditation',
        'detox': 'detox',
        'wellness': 'wellness',
        'spiritual': 'spiritual'
      };
      setRetreatType(categoryMap[category] || category);
      setShowFilters(true);
    }
  }, [location]);

  // Временные данные для демонстрации
  const [isLoading] = useState(false);
  const retreats: Retreat[] = [
    {
      id: "1",
      title: "Йога-ретрит на Бали",
      location: "Убуд, Бали, Индонезия",
      price: 120,
      duration: 7,
      startDate: "2025-03-15",
      description: "Погрузитесь в мир йоги и медитации в сердце Бали",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
      rating: 4.8,
      reviewCount: 124,
      features: ["Питание включено", "Массаж", "Экскурсии"],
      reviews: [
        {
          id: "r1",
          userId: "u1",
          userName: "Анна К.",
          rating: 5,
          title: "Невероятный опыт!",
          content: "Лучший ретрит в моей жизни. Инструкторы профессиональные, место волшебное, питание отличное.",
          date: "2024-12-15",
          helpful: 23,
          verified: true,
          retreatDate: "2024-11-20"
        }
      ]
    },
    {
      id: "2",
      title: "Горный ретрит в Гималаях",
      location: "Ришикеш, Индия",
      price: 85,
      duration: 10,
      startDate: "2025-04-01",
      description: "Традиционная йога в священном городе Ришикеш",
      imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
      rating: 4.9,
      reviewCount: 89,
      features: ["Вегетарианское меню", "Медитация", "Горы"]
    },
    {
      id: "3",
      title: "Пляжный ретрит в Коста-Рике",
      location: "Мануэль Антонио, Коста-Рика",
      price: 95,
      duration: 5,
      startDate: "2025-05-10",
      description: "Йога на пляже с видом на Тихий океан",
      imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      rating: 4.7,
      reviewCount: 67,
      features: ["Пляж рядом", "Серфинг", "Spa-процедуры"]
    },
    {
      id: "4",
      title: "Детокс-ретрит в Тоскане",
      location: "Тоскана, Италия",
      price: 150,
      duration: 6,
      startDate: "2025-06-20",
      description: "Очищение тела и души в живописной Тоскане",
      imageUrl: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400",
      rating: 4.6,
      reviewCount: 45,
      features: ["Детокс", "Органическое питание", "Винные туры"]
    },
    {
      id: "5",
      title: "Зимний ретрит в Альпах",
      location: "Шамони, Франция",
      price: 180,
      duration: 4,
      startDate: "2025-02-15",
      description: "Йога и медитация в заснеженных Альпах",
      imageUrl: "https://images.unsplash.com/photo-1551524164-6cf2ac531400?w=400",
      rating: 4.5,
      reviewCount: 32,
      features: ["Горные лыжи", "Сауна", "Горячие источники"]
    },
    {
      id: "6",
      title: "Тропический ретрит на Мальдивах",
      location: "Мальдивы",
      price: 250,
      duration: 8,
      startDate: "2025-07-05",
      description: "Роскошный ретрит на частном острове",
      imageUrl: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=400",
      rating: 5.0,
      reviewCount: 18,
      features: ["Люкс размещение", "Дайвинг", "Частный пляж"]
    }
  ];

  const filteredRetreats = retreats.filter(retreat => {
    const matchesSearch = searchTerm === "" || 
      retreat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      retreat.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      retreat.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = searchLocation === "" || 
      retreat.location.toLowerCase().includes(searchLocation.toLowerCase());
    
    const matchesDuration = searchDuration === "" || 
      (searchDuration === "short" && retreat.duration <= 3) ||
      (searchDuration === "medium" && retreat.duration >= 4 && retreat.duration <= 7) ||
      (searchDuration === "long" && retreat.duration > 7);
    
    const matchesPrice = priceRange === "" ||
      (priceRange === "budget" && retreat.price <= 50) ||
      (priceRange === "mid" && retreat.price > 50 && retreat.price <= 100) ||
      (priceRange === "luxury" && retreat.price > 100);
    
    const matchesType = retreatType === "" || retreat.style === retreatType;
    
    const matchesLevel = skillLevel === "" || retreat.skillLevel === skillLevel;
    
    const matchesAccommodation = accommodation === "" || retreat.accommodation === accommodation;
    
    const matchesMealPlan = mealPlan === "" || retreat.mealPlan === mealPlan;
    
    const matchesFeatures = selectedFeatures.length === 0 || 
      selectedFeatures.every(feature => retreat.features.includes(feature));
    
    const matchesRating = minRating === "" || retreat.rating >= parseFloat(minRating);

    // Advanced filters
    const matchesAdvancedInstructors = advancedFilters.instructors.length === 0 ||
      advancedFilters.instructors.includes(retreat.instructor);
    
    const matchesAdvancedStyles = advancedFilters.styles.length === 0 ||
      advancedFilters.styles.includes(retreat.style);
    
    const matchesAdvancedTags = advancedFilters.tags.length === 0 ||
      advancedFilters.tags.some(tag => retreat.features.includes(tag));
    
    return matchesSearch && matchesLocation && matchesDuration && matchesPrice && 
           matchesType && matchesLevel && matchesAccommodation && matchesMealPlan &&
           matchesFeatures && matchesRating && matchesAdvancedInstructors && 
           matchesAdvancedStyles && matchesAdvancedTags;
  });

  return (
    <div className="min-h-screen bg-[#fff6f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-forest-green mb-4">
            Незабываемые ретриты по йоге 2025
          </h1>
          <p className="text-lg text-soft-gray max-w-2xl mx-auto">
            Найдите и забронируйте идеальный ретрит из нашей коллекции проверенных программ
          </p>
          <div className="flex justify-center items-center gap-6 mt-6 text-sm text-soft-gray">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-warm-orange fill-current" />
              <span>4.6★ средний рейтинг</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-sage-green" />
              <span>15,000+ довольных участников</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-warm-orange" />
              <span>95% рекомендуют нас</span>
            </div>
          </div>
        </div>

        {/* Search Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          {/* Main Search Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-soft-gray mb-2">Место проведения</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-soft-gray" />
                <Input 
                  placeholder="Куда хотите поехать?" 
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-soft-gray mb-2">Дата начала</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-soft-gray" />
                <Input 
                  type="date" 
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-soft-gray mb-2">Продолжительность</label>
              <Select value={searchDuration} onValueChange={setSearchDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="Любая" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Любая</SelectItem>
                  <SelectItem value="1-3">1-3 дня</SelectItem>
                  <SelectItem value="4-7">4-7 дней</SelectItem>
                  <SelectItem value="1-2w">1-2 недели</SelectItem>
                  <SelectItem value="2w+">Больше 2 недель</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button className="flex-1 bg-warm-orange hover:bg-warm-orange/90 text-black font-semibold">
                <Search className="w-4 h-4 mr-2" />
                Искать
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="border-sage-green text-forest-green hover:bg-sage-green/10"
              >
                <Filter className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="border-warm-orange text-warm-orange hover:bg-warm-orange/10"
              >
                Расширенные
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-semibold text-forest-green mb-4">Дополнительные фильтры</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-soft-gray mb-2">Цена за день</label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Любая" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Любая</SelectItem>
                      <SelectItem value="0-50">До $50</SelectItem>
                      <SelectItem value="50-100">$50 - $100</SelectItem>
                      <SelectItem value="100-200">$100 - $200</SelectItem>
                      <SelectItem value="200+">Свыше $200</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-soft-gray mb-2">Тип ретрита</label>
                  <Select value={retreatType} onValueChange={setRetreatType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Все типы" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Все типы</SelectItem>
                      <SelectItem value="hatha">Хатха йога</SelectItem>
                      <SelectItem value="vinyasa">Виньяса</SelectItem>
                      <SelectItem value="ashtanga">Аштанга</SelectItem>
                      <SelectItem value="yin">Инь йога</SelectItem>
                      <SelectItem value="meditation">Медитация</SelectItem>
                      <SelectItem value="detox">Детокс</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-soft-gray mb-2">Уровень подготовки</label>
                  <Select value={skillLevel} onValueChange={setSkillLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Любой" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Любой</SelectItem>
                      <SelectItem value="beginner">Начинающий</SelectItem>
                      <SelectItem value="intermediate">Средний</SelectItem>
                      <SelectItem value="advanced">Продвинутый</SelectItem>
                      <SelectItem value="all-levels">Все уровни</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-soft-gray mb-2">Размещение</label>
                  <Select value={accommodation} onValueChange={setAccommodation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Любое" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Любое</SelectItem>
                      <SelectItem value="shared">Общая комната</SelectItem>
                      <SelectItem value="private">Отдельная комната</SelectItem>
                      <SelectItem value="luxury">Люкс</SelectItem>
                      <SelectItem value="camping">Кемпинг</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-soft-gray mb-2">Минимальный рейтинг</label>
                  <Select value={minRating} onValueChange={setMinRating}>
                    <SelectTrigger>
                      <SelectValue placeholder="Любой" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Любой</SelectItem>
                      <SelectItem value="4.5">4.5+ звезд</SelectItem>
                      <SelectItem value="4.0">4.0+ звезд</SelectItem>
                      <SelectItem value="3.5">3.5+ звезд</SelectItem>
                      <SelectItem value="3.0">3.0+ звезд</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-semibold text-soft-gray mb-3">Особенности</label>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {[
                    'Питание включено',
                    'Массаж',
                    'Экскурсии',
                    'Бассейн',
                    'Пляж рядом',
                    'Горы',
                    'Вегетарианское меню',
                    'Spa-процедуры',
                    'Трансфер',
                    'Wi-Fi',
                    'Йога для начинающих',
                    'Сертификат'
                  ].map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox 
                        id={feature}
                        checked={selectedFeatures.includes(feature)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedFeatures([...selectedFeatures, feature]);
                          } else {
                            setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
                          }
                        }}
                      />
                      <label htmlFor={feature} className="text-sm text-soft-gray cursor-pointer">
                        {feature}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Advanced Filters Modal */}
        {showAdvancedFilters && (
          <div className="border-t pt-6 mt-6">
            <AdvancedFilters
              filters={advancedFilters}
              onFiltersChange={setAdvancedFilters}
              onClose={() => setShowAdvancedFilters(false)}
            />
          </div>
        )}

        {/* Results Header */}
        {!isLoading && filteredRetreats.length > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <p className="text-soft-gray">
                Показано <span className="font-semibold text-forest-green">{filteredRetreats.length}</span> из 500+ ретритов
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedFeatures.map((feature) => (
                  <Badge key={feature} variant="secondary" className="bg-sage-green/20 text-forest-green">
                    {feature}
                    <button 
                      onClick={() => setSelectedFeatures(selectedFeatures.filter(f => f !== feature))}
                      className="ml-2 text-forest-green hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-soft-gray">Сортировать:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Рекомендуемые</SelectItem>
                  <SelectItem value="price-low">Цена: по возрастанию</SelectItem>
                  <SelectItem value="price-high">Цена: по убыванию</SelectItem>
                  <SelectItem value="rating">Рейтинг</SelectItem>
                  <SelectItem value="date">Ближайшие даты</SelectItem>
                  <SelectItem value="duration">Продолжительность</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredRetreats.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-sage-green/20 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-sage-green" />
              </div>
              <h3 className="text-xl font-semibold text-forest-green mb-2">Ретриты не найдены</h3>
              <p className="text-soft-gray mb-6">Попробуйте изменить критерии поиска или сбросить фильтры</p>
              <Button 
                onClick={() => {
                  setSearchLocation("");
                  setSearchDate("");
                  setSearchDuration("");
                  setPriceRange("");
                  setRetreatType("");
                  setSkillLevel("");
                  setAccommodation("");
                  setSelectedFeatures([]);
                }}
                className="bg-warm-orange hover:bg-warm-orange/90 text-black"
              >
                Сбросить фильтры
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRetreats.map((retreat: Retreat) => (
              <div key={retreat.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img 
                    src={retreat.imageUrl || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"} 
                    alt={retreat.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-warm-orange fill-current" />
                      <span className="text-sm font-semibold">{retreat.rating || 4.5}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-forest-green mb-2">{retreat.title}</h3>
                  <div className="flex items-center gap-2 text-soft-gray mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{retreat.location}</span>
                  </div>
                  <p className="text-soft-gray text-sm mb-4 line-clamp-2">{retreat.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {retreat.features?.slice(0, 3).map((feature) => (
                      <Badge key={feature} variant="secondary" className="bg-sage-green/20 text-forest-green text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-forest-green">${retreat.price}</span>
                      <span className="text-sm text-soft-gray">/день</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-soft-gray">{retreat.duration} дней</div>
                      <Button className="mt-2 bg-warm-orange hover:bg-warm-orange/90 text-black font-semibold">
                        Подробнее
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trust Signals Section */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-forest-green mb-4">Путешественники доверяют нам</h2>
            <p className="text-soft-gray">Более 15,000 участников выбрали YogaRetreatPro для своих незабываемых путешествий</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-warm-orange mb-2">15,000+</div>
              <div className="text-sm text-soft-gray">Довольных участников</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-warm-orange mb-2">95%</div>
              <div className="text-sm text-soft-gray">Рекомендуют нас друзьям</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-warm-orange mb-2">4.6★</div>
              <div className="text-sm text-soft-gray">Средний рейтинг организаторов</div>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-sage-green/10 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-warm-orange rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-forest-green mb-2">Почему выбирают нас?</h3>
                <ul className="text-sm text-soft-gray space-y-1">
                  <li>✓ Тщательно отобранные ретриты и проверенные организаторы</li>
                  <li>✓ Реальные отзывы от участников</li>
                  <li>✓ Лучшие цены и гарантия возврата средств</li>
                  <li>✓ Поддержка 24/7 на русском языке</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
