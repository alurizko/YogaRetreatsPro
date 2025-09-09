import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock, Star } from "lucide-react";

type Booking = {
  id: string;
  retreatName: string;
  location: string;
  dates: string;
  duration: string;
  participants: number;
  status: "confirmed" | "pending" | "cancelled";
  price: number;
  image: string;
  rating?: number;
};

const DEMO_BOOKINGS: Booking[] = [
  {
    id: "1",
    retreatName: "Хатха-йога в Гималаях",
    location: "Ришикеш, Индия",
    dates: "15-22 марта 2025",
    duration: "7 дней",
    participants: 2,
    status: "confirmed",
    price: 85000,
    image: "/api/placeholder/300/200",
    rating: 4.8
  },
  {
    id: "2", 
    retreatName: "Медитативный ретрит на Бали",
    location: "Убуд, Бали",
    dates: "10-17 апреля 2025",
    duration: "7 дней",
    participants: 1,
    status: "pending",
    price: 95000,
    image: "/api/placeholder/300/200"
  },
  {
    id: "3",
    retreatName: "Виньяса-йога в Тоскане",
    location: "Флоренция, Италия", 
    dates: "5-12 мая 2025",
    duration: "7 дней",
    participants: 2,
    status: "cancelled",
    price: 120000,
    image: "/api/placeholder/300/200"
  }
];

export default function MyBookingsPage() {
  const [filter, setFilter] = useState<"all" | "confirmed" | "pending" | "cancelled">("all");

  const filteredBookings = DEMO_BOOKINGS.filter(booking => {
    if (filter === "all") return true;
    return booking.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed": return "Подтверждено";
      case "pending": return "Ожидает";
      case "cancelled": return "Отменено";
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-[#fff6f0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-forest-green mb-2">Мои бронирования</h1>
          <p className="text-soft-gray">
            Управляйте своими бронированиями ретритов и отслеживайте их статус.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 flex-wrap">
            {[
              { key: "all", label: "Все" },
              { key: "confirmed", label: "Подтверждено" },
              { key: "pending", label: "Ожидает" },
              { key: "cancelled", label: "Отменено" }
            ].map(({ key, label }) => (
              <Button
                key={key}
                variant={filter === key ? "default" : "outline"}
                onClick={() => setFilter(key as any)}
                className={filter === key ? "bg-forest-green hover:bg-forest-green/90" : "border-sage-green text-forest-green hover:bg-sage-green/10"}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {filteredBookings.length === 0 ? (
            <Card className="bg-white rounded-xl shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="text-soft-gray">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-sage-green" />
                  <h3 className="text-xl font-semibold mb-2">Нет бронирований</h3>
                  <p className="mb-6">У вас пока нет бронирований в выбранной категории.</p>
                  <Button className="bg-warm-orange hover:bg-warm-orange/90 text-black font-semibold">
                    Найти ретрит
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredBookings.map((booking) => (
              <Card key={booking.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="md:flex">
                  {/* Image */}
                  <div className="md:w-1/3">
                    <img
                      src={booking.image}
                      alt={booking.retreatName}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="md:w-2/3 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-forest-green mb-2">
                          {booking.retreatName}
                        </h3>
                        <div className="flex items-center gap-4 text-soft-gray text-sm mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {booking.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {booking.dates}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {booking.duration}
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {getStatusText(booking.status)}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-soft-gray">
                          <Users className="w-4 h-4" />
                          <span>{booking.participants} участник{booking.participants > 1 ? 'а' : ''}</span>
                        </div>
                        {booking.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{booking.rating}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-forest-green mb-2">
                          {booking.price.toLocaleString()} ₽
                        </div>
                        <div className="flex gap-2">
                          {booking.status === "confirmed" && (
                            <>
                              <Button variant="outline" size="sm" className="border-sage-green text-forest-green hover:bg-sage-green/10">
                                Детали
                              </Button>
                              <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
                                Отменить
                              </Button>
                            </>
                          )}
                          {booking.status === "pending" && (
                            <Button variant="outline" size="sm" className="border-sage-green text-forest-green hover:bg-sage-green/10">
                              Отслеживать
                            </Button>
                          )}
                          {booking.status === "cancelled" && (
                            <Button variant="outline" size="sm" className="border-sage-green text-forest-green hover:bg-sage-green/10">
                              Забронировать снова
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
