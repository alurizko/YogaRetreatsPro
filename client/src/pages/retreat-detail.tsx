import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Users, Star, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import BookingForm from "@/components/BookingForm";
import type { Retreat } from "@shared/schema";

export default function RetreatDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();

  const { data: retreat, isLoading } = useQuery({
    queryKey: [`/api/retreats/${id}`],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!retreat) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-forest-green mb-4">Ретрит не найден</h1>
          <Link href="/retreats">
            <Button>Вернуться к поиску</Button>
          </Link>
        </div>
      </div>
    );
  }

  const availableSpots = retreat.maxParticipants - retreat.currentParticipants;
  const startDate = new Date(retreat.startDate);
  const endDate = new Date(retreat.endDate);
  const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-soft-white">
      {/* Hero Image */}
      <div className="relative h-64 md:h-96">
        <img 
          src={retreat.imageUrl || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400"}
          alt={retreat.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4">
          <Link href="/retreats">
            <Button variant="outline" size="sm" className="bg-black/50 border-white text-white hover:bg-black/70">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h1 className="text-3xl font-bold text-forest-green mb-4">{retreat.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center text-warm-orange">
                  <Star className="w-5 h-5 mr-1 fill-current" />
                  <span className="font-semibold">4.8</span>
                  <span className="text-gray-600 ml-1">(127 отзывов)</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{retreat.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <CalendarDays className="w-4 h-4 mr-1" />
                  <span>{startDate.toLocaleDateString('ru-RU')} - {endDate.toLocaleDateString('ru-RU')}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{availableSpots} мест доступно</span>
                </div>
              </div>

              <div className="prose max-w-none mb-6">
                <p className="text-gray-700 leading-relaxed">
                  {retreat.description}
                </p>
              </div>

              {/* Schedule Preview */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-forest-green mb-3">Программа дня</h3>
                <div className="space-y-2 text-sm">
                  {[
                    { time: "6:00 - 7:30", activity: "Утренняя медитация и пранаяма" },
                    { time: "8:00 - 9:00", activity: "Завтрак" },
                    { time: "10:00 - 11:30", activity: "Хатха-йога" },
                    { time: "16:00 - 17:30", activity: "Виньяса-йога" },
                    { time: "19:00 - 20:00", activity: "Вечерняя медитация" }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <span className="font-medium">{item.time}</span>
                      <span className="text-gray-600">{item.activity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cancellation Policy */}
              <div>
                <h3 className="text-xl font-semibold text-forest-green mb-3">Политика отмены</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Полный возврат при отмене за 30+ дней</p>
                  <p>• 50% возврат при отмене за 7-30 дней</p>
                  <p>• Без возврата при отмене менее чем за 7 дней</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-xl p-6 sticky top-4">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-forest-green mb-2">
                  от €{parseFloat(retreat.price).toFixed(0)}
                </div>
                <p className="text-sm text-gray-600">за человека</p>
              </div>

              {availableSpots > 0 ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                  <div className="flex items-center">
                    <Users className="text-green-600 mr-2 w-4 h-4" />
                    <span className="text-sm text-green-700">
                      {availableSpots} мест доступно
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                  <span className="text-sm text-red-700">Нет доступных мест</span>
                </div>
              )}

              {isAuthenticated ? (
                availableSpots > 0 ? (
                  <BookingForm retreat={retreat} />
                ) : (
                  <Button disabled className="w-full">
                    Места закончились
                  </Button>
                )
              ) : (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Войдите, чтобы забронировать место
                  </p>
                  <Button 
                    className="w-full bg-forest-green hover:bg-forest-green/90"
                    onClick={() => window.location.href = "/api/login"}
                  >
                    Войти
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
