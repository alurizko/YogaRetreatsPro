import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Users, Star, Heart, Award, Wifi, Coffee } from "lucide-react";
import type { Retreat } from "@shared/schema";

interface RetreatCardProps {
  retreat: Retreat;
}

export default function RetreatCard({ retreat }: RetreatCardProps) {
  const startDate = new Date(retreat.startDate);
  const endDate = new Date(retreat.endDate);
  const availableSpots = retreat.maxParticipants - retreat.currentParticipants;
  const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Mock data for enhanced features (in real app, this would come from API)
  const rating = 4.6 + Math.random() * 0.4; // 4.6-5.0
  const reviewCount = Math.floor(Math.random() * 150) + 20; // 20-170 reviews
  const isPopular = Math.random() > 0.7;
  const hasFreeCancellation = Math.random() > 0.5;
  const features = ['Питание включено', 'Wi-Fi', 'Массаж', 'Экскурсии'].filter(() => Math.random() > 0.5);

  return (
    <Card className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative">
      {isPopular && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-warm-orange text-black font-semibold">
            <Award className="w-3 h-3 mr-1" />
            Популярный
          </Badge>
        </div>
      )}
      {hasFreeCancellation && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-sage-green text-white font-semibold">
            Бесплатная отмена
          </Badge>
        </div>
      )}
      <div className="relative">
        <img 
          src={retreat.imageUrl || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"}
          alt={retreat.title}
          className="w-full h-48 object-cover"
        />
        <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
          <Heart className="w-4 h-4 text-soft-gray hover:text-warm-orange" />
        </button>
      </div>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-forest-green line-clamp-2">{retreat.title}</h3>
          <div className="flex flex-col items-end">
            <div className="flex items-center text-warm-orange">
              <Star className="w-4 h-4 mr-1 fill-current" />
              <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-soft-gray">{reviewCount} отзывов</span>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-soft-gray text-sm">
            <MapPin className="w-4 h-4 mr-2" />
            {retreat.location}
          </div>
          <div className="flex items-center text-soft-gray text-sm">
            <CalendarDays className="w-4 h-4 mr-2" />
            {startDate.toLocaleDateString('ru-RU')} ({duration} дн{duration > 1 ? 'ей' : 'ь'})
          </div>
          <div className="flex items-center text-soft-gray text-sm">
            <Users className="w-4 h-4 mr-2" />
            {availableSpots} мест доступно
          </div>
        </div>

        <p className="text-sm text-soft-gray mb-4 line-clamp-2">
          {retreat.description}
        </p>

        {features.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {features.slice(0, 3).map((feature) => (
              <Badge key={feature} variant="outline" className="text-xs border-sage-green text-sage-green">
                {feature}
              </Badge>
            ))}
            {features.length > 3 && (
              <Badge variant="outline" className="text-xs border-sage-green text-sage-green">
                +{features.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="flex justify-between items-center">
          <div>
            <div className="text-lg font-bold text-forest-green">
              от €{parseFloat(retreat.price).toFixed(0)}
            </div>
            <div className="text-xs text-soft-gray">за день</div>
          </div>
          <Link href={`/retreat/${retreat.id}`}>
            <Button className="bg-warm-orange hover:bg-warm-orange/90 text-black font-semibold">
              Подробнее
            </Button>
          </Link>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center text-xs text-soft-gray">
            <span>Последнее бронирование: 2 часа назад</span>
            {availableSpots <= 5 && availableSpots > 0 ? (
              <Badge variant="destructive" className="text-xs">
                Осталось {availableSpots} мест!
              </Badge>
            ) : (
              <span className="text-sage-green">✓ Места доступны</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
