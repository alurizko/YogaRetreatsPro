import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Users, Star } from "lucide-react";
import type { Retreat } from "@shared/schema";

interface RetreatCardProps {
  retreat: Retreat;
}

export default function RetreatCard({ retreat }: RetreatCardProps) {
  const startDate = new Date(retreat.startDate);
  const endDate = new Date(retreat.endDate);
  const availableSpots = retreat.maxParticipants - retreat.currentParticipants;
  const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img 
        src={retreat.imageUrl || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"}
        alt={retreat.title}
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-forest-green">{retreat.title}</h3>
          <div className="flex items-center text-warm-orange">
            <Star className="w-4 h-4 mr-1 fill-current" />
            <span className="text-sm">4.8</span>
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

        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold text-forest-green">
            от €{parseFloat(retreat.price).toFixed(0)}
          </div>
          <Link href={`/retreat/${retreat.id}`}>
            <Button className="bg-sage-green text-white hover:bg-sage-green/90">
              Подробнее
            </Button>
          </Link>
        </div>

        {availableSpots <= 5 && availableSpots > 0 && (
          <Badge variant="destructive" className="mt-2 text-xs">
            Осталось мало мест!
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
