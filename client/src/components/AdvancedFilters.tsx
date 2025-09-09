import { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { X, Filter, Star, User, Tag } from "lucide-react";

interface AdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterState) => void;
  currentFilters: FilterState;
}

export interface FilterState {
  instructors: string[];
  styles: string[];
  tags: string[];
  minRating: string;
  priceRange: string;
  duration: string;
  location: string;
  intensity: string;
  accommodation: string;
  mealPlan: string;
  language: string;
  groupSize: string;
}

interface Instructor {
  id: string;
  name: string;
  specialization: string[];
  rating: number;
  retreatCount: number;
}

interface YogaStyle {
  id: string;
  name: string;
  category: string;
  difficulty: string;
}

interface Tag {
  id: string;
  name: string;
  category: string;
  color: string;
}

export default function AdvancedFilters({ isOpen, onClose, onApplyFilters, currentFilters }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(currentFilters);
  const [searchInstructor, setSearchInstructor] = useState("");
  const [searchTag, setSearchTag] = useState("");

  const instructors: Instructor[] = [
    { id: "1", name: "Анна Петрова", specialization: ["Хатха", "Медитация"], rating: 4.9, retreatCount: 24 },
    { id: "2", name: "Михаил Волков", specialization: ["Виньяса", "Аштанга"], rating: 4.8, retreatCount: 31 },
    { id: "3", name: "Елена Смирнова", specialization: ["Инь йога", "Пранаяма"], rating: 4.7, retreatCount: 18 },
    { id: "4", name: "Дмитрий Козлов", specialization: ["Кундалини", "Мантры"], rating: 4.9, retreatCount: 22 },
    { id: "5", name: "Мария Иванова", specialization: ["Виньяса", "Детокс"], rating: 4.6, retreatCount: 15 }
  ];

  const yogaStyles: YogaStyle[] = [
    { id: "hatha", name: "Хатха йога", category: "Классическая", difficulty: "Начинающий" },
    { id: "vinyasa", name: "Виньяса флоу", category: "Динамическая", difficulty: "Средний" },
    { id: "ashtanga", name: "Аштанга", category: "Традиционная", difficulty: "Продвинутый" },
    { id: "yin", name: "Инь йога", category: "Медитативная", difficulty: "Все уровни" },
    { id: "kundalini", name: "Кундалини", category: "Духовная", difficulty: "Средний" },
    { id: "iyengar", name: "Айенгар", category: "Терапевтическая", difficulty: "Все уровни" },
    { id: "bikram", name: "Бикрам", category: "Горячая", difficulty: "Средний" },
    { id: "restorative", name: "Восстановительная", category: "Релаксация", difficulty: "Начинающий" }
  ];

  const tags: Tag[] = [
    { id: "beachfront", name: "У океана", category: "Локация", color: "bg-blue-500" },
    { id: "mountains", name: "В горах", category: "Локация", color: "bg-green-500" },
    { id: "luxury", name: "Люкс", category: "Размещение", color: "bg-purple-500" },
    { id: "budget", name: "Бюджетный", category: "Цена", color: "bg-orange-500" },
    { id: "organic-food", name: "Органическая еда", category: "Питание", color: "bg-green-600" },
    { id: "detox", name: "Детокс", category: "Программа", color: "bg-teal-500" },
    { id: "meditation", name: "Медитация", category: "Практика", color: "bg-indigo-500" },
    { id: "spa", name: "СПА", category: "Услуги", color: "bg-pink-500" },
    { id: "adventure", name: "Приключения", category: "Активности", color: "bg-red-500" },
    { id: "silent", name: "Молчание", category: "Формат", color: "bg-gray-500" },
    { id: "women-only", name: "Только женщины", category: "Участники", color: "bg-rose-500" },
    { id: "beginner-friendly", name: "Для новичков", category: "Уровень", color: "bg-yellow-500" }
  ];

  const filteredInstructors = instructors.filter(instructor =>
    instructor.name.toLowerCase().includes(searchInstructor.toLowerCase())
  );

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTag.toLowerCase())
  );

  const handleInstructorToggle = (instructorId: string) => {
    setFilters(prev => ({
      ...prev,
      instructors: prev.instructors.includes(instructorId)
        ? prev.instructors.filter(id => id !== instructorId)
        : [...prev.instructors, instructorId]
    }));
  };

  const handleStyleToggle = (styleId: string) => {
    setFilters(prev => ({
      ...prev,
      styles: prev.styles.includes(styleId)
        ? prev.styles.filter(id => id !== styleId)
        : [...prev.styles, styleId]
    }));
  };

  const handleTagToggle = (tagId: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
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
  };

  const applyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const getActiveFiltersCount = () => {
    return filters.instructors.length + 
           filters.styles.length + 
           filters.tags.length + 
           Object.values(filters).filter(value => 
             typeof value === 'string' && value !== ''
           ).length;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center gap-3">
            <Filter className="w-6 h-6 text-sage-green" />
            <h2 className="text-xl font-semibold text-forest-green">Расширенные фильтры</h2>
            {getActiveFiltersCount() > 0 && (
              <Badge className="bg-warm-orange text-black">
                {getActiveFiltersCount()} активных
              </Badge>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Instructors */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-sage-green" />
                <h3 className="text-lg font-semibold text-forest-green">Инструкторы</h3>
              </div>
              
              <Input
                placeholder="Поиск инструктора..."
                value={searchInstructor}
                onChange={(e) => setSearchInstructor(e.target.value)}
                className="mb-4"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                {filteredInstructors.map((instructor) => (
                  <div
                    key={instructor.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      filters.instructors.includes(instructor.id)
                        ? "border-sage-green bg-sage-green/10"
                        : "border-gray-200 hover:border-sage-green"
                    }`}
                    onClick={() => handleInstructorToggle(instructor.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{instructor.name}</span>
                      <Checkbox
                        checked={filters.instructors.includes(instructor.id)}
                        onChange={() => handleInstructorToggle(instructor.id)}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Star className="w-3 h-3 text-warm-orange fill-current" />
                      <span>{instructor.rating}</span>
                      <span>•</span>
                      <span>{instructor.retreatCount} ретритов</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {instructor.specialization.map((spec, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Yoga Styles */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-forest-green mb-4">Стили йоги</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {yogaStyles.map((style) => (
                  <div
                    key={style.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      filters.styles.includes(style.id)
                        ? "border-sage-green bg-sage-green/10"
                        : "border-gray-200 hover:border-sage-green"
                    }`}
                    onClick={() => handleStyleToggle(style.id)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{style.name}</span>
                      <Checkbox
                        checked={filters.styles.includes(style.id)}
                        onChange={() => handleStyleToggle(style.id)}
                      />
                    </div>
                    <div className="text-xs text-gray-600">
                      <div>{style.category}</div>
                      <div>{style.difficulty}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-5 h-5 text-sage-green" />
                <h3 className="text-lg font-semibold text-forest-green">Теги</h3>
              </div>
              
              <Input
                placeholder="Поиск тегов..."
                value={searchTag}
                onChange={(e) => setSearchTag(e.target.value)}
                className="mb-4"
              />

              <div className="space-y-4">
                {Object.entries(
                  filteredTags.reduce((acc, tag) => {
                    if (!acc[tag.category]) acc[tag.category] = [];
                    acc[tag.category].push(tag);
                    return acc;
                  }, {} as Record<string, Tag[]>)
                ).map(([category, categoryTags]) => (
                  <div key={category}>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">{category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {categoryTags.map((tag) => (
                        <Badge
                          key={tag.id}
                          className={`cursor-pointer transition-colors ${
                            filters.tags.includes(tag.id)
                              ? `${tag.color} text-white`
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                          onClick={() => handleTagToggle(tag.id)}
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Filters */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-forest-green mb-4">Дополнительные фильтры</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Интенсивность</label>
                  <Select value={filters.intensity} onValueChange={(value) => setFilters(prev => ({ ...prev, intensity: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Любая" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Любая</SelectItem>
                      <SelectItem value="low">Низкая</SelectItem>
                      <SelectItem value="medium">Средняя</SelectItem>
                      <SelectItem value="high">Высокая</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Язык проведения</label>
                  <Select value={filters.language} onValueChange={(value) => setFilters(prev => ({ ...prev, language: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Любой" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Любой</SelectItem>
                      <SelectItem value="russian">Русский</SelectItem>
                      <SelectItem value="english">Английский</SelectItem>
                      <SelectItem value="multilingual">Многоязычный</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Размер группы</label>
                  <Select value={filters.groupSize} onValueChange={(value) => setFilters(prev => ({ ...prev, groupSize: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Любой" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Любой</SelectItem>
                      <SelectItem value="small">Малая (до 10)</SelectItem>
                      <SelectItem value="medium">Средняя (10-20)</SelectItem>
                      <SelectItem value="large">Большая (20+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 sticky bottom-0 bg-white">
          <Button
            variant="outline"
            onClick={clearAllFilters}
            className="flex-1"
          >
            Очистить все
          </Button>
          <Button
            onClick={applyFilters}
            className="flex-1 bg-sage-green hover:bg-sage-green/90 text-white"
          >
            Применить фильтры ({getActiveFiltersCount()})
          </Button>
        </div>
      </div>
    </div>
  );
}
