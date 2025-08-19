import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Star, ChevronDown, Filter } from "lucide-react";

// Mock data for trips - в реальном приложении это будет из API
const mockTrips = [
  {
    id: 1,
    title: "Йога-ретрит в Гоа",
    location: "Гоа, Индия",
    dates: "15-22 марта 2024",
    status: "upcoming",
    price: "€850",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    organizer: "Анна Петрова",
    participants: 12,
    maxParticipants: 15
  },
  {
    id: 2,
    title: "Медитативный ретрит в Альпах",
    location: "Швейцария",
    dates: "10-17 января 2024",
    status: "completed",
    price: "€1200",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    organizer: "Михаил Соколов",
    participants: 8,
    maxParticipants: 10,
    rating: 5
  },
  {
    id: 3,
    title: "Пляжная йога в Таиланде",
    location: "Пхукет, Таиланд",
    dates: "5-12 ноября 2023",
    status: "cancelled",
    price: "€650",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    organizer: "Елена Иванова",
    participants: 0,
    maxParticipants: 20
  }
];

export default function MyTrips() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-sage-green text-forest-green">Предстоящий</Badge>;
      case "completed":
        return <Badge className="bg-forest-green text-white">Завершен</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Отменен</Badge>;
      default:
        return null;
    }
  };

  const filteredTrips = mockTrips.filter(trip => 
    statusFilter === "all" || trip.status === statusFilter
  );

  return (
    <div className="min-h-screen bg-[#fff6f0]">
      {/* Header Section */}
      <div className="bg-[#fff6f0] py-8 border-b border-sage-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-forest-green">Мои поездки</h1>
              <p className="text-soft-gray mt-2">Управляйте своими бронированиями ретритов</p>
            </div>
            <Link href="/retreats">
              <Button className="bg-warm-orange hover:bg-warm-orange/90 text-black font-semibold">
                Найти новый ретрит
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-forest-green" />
            <span className="text-forest-green font-medium">Фильтры:</span>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 bg-white border-sage-green-200">
              <SelectValue placeholder="Статус поездки" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все поездки</SelectItem>
              <SelectItem value="upcoming">Предстоящие</SelectItem>
              <SelectItem value="completed">Завершенные</SelectItem>
              <SelectItem value="cancelled">Отмененные</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48 bg-white border-sage-green-200">
              <SelectValue placeholder="Сортировать по" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">По дате</SelectItem>
              <SelectItem value="price">По цене</SelectItem>
              <SelectItem value="location">По местоположению</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Trips List */}
        {filteredTrips.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-sage-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-forest-green" />
            </div>
            <h3 className="text-xl font-semibold text-forest-green mb-2">
              Данные в таблице отсутствуют
            </h3>
            <p className="text-soft-gray mb-6">
              У вас пока нет забронированных ретритов. Найдите идеальный ретрит для себя!
            </p>
            <Link href="/retreats">
              <Button className="bg-warm-orange hover:bg-warm-orange/90 text-black font-semibold">
                Найти ретрит
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Table Header */}
            <div className="hidden md:grid md:grid-cols-7 gap-4 px-6 py-4 bg-sage-green-100 rounded-lg font-semibold text-forest-green">
              <div className="col-span-2">Дата бронирования</div>
              <div>Отступления</div>
              <div>Вариант размещения</div>
              <div>Цена ретрита</div>
              <div>Статус</div>
              <div>Дата начала ретрита</div>
            </div>

            {/* Trip Cards */}
            {filteredTrips.map((trip) => (
              <Card key={trip.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-white border-sage-green-200">
                <CardContent className="p-0">
                  <div className="md:grid md:grid-cols-7 gap-4 items-center">
                    {/* Mobile Layout */}
                    <div className="md:hidden p-6">
                      <div className="flex items-start gap-4">
                        <img 
                          src={trip.image} 
                          alt={trip.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-forest-green mb-1">{trip.title}</h3>
                          <div className="flex items-center text-soft-gray text-sm mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            {trip.location}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-forest-green">{trip.price}</span>
                            {getStatusBadge(trip.status)}
                          </div>
                          <div className="text-sm text-soft-gray mt-2">{trip.dates}</div>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:grid md:col-span-7 md:grid-cols-7 gap-4 items-center px-6 py-4">
                      {/* Date Booking */}
                      <div className="col-span-2">
                        <div className="flex items-start gap-3">
                          <img 
                            src={trip.image} 
                            alt={trip.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div>
                            <h3 className="font-semibold text-forest-green text-sm mb-1">{trip.title}</h3>
                            <div className="flex items-center text-soft-gray text-xs">
                              <MapPin className="w-3 h-3 mr-1" />
                              {trip.location}
                            </div>
                            <div className="text-xs text-soft-gray mt-1">
                              Организатор: {trip.organizer}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Retreat Type */}
                      <div className="text-sm text-forest-green">
                        Стандартный
                      </div>

                      {/* Accommodation */}
                      <div className="text-sm text-forest-green">
                        Двухместный номер
                      </div>

                      {/* Price */}
                      <div className="font-semibold text-forest-green">
                        {trip.price}
                      </div>

                      {/* Status */}
                      <div>
                        {getStatusBadge(trip.status)}
                        {trip.status === "completed" && trip.rating && (
                          <div className="flex items-center mt-1">
                            {[...Array(trip.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-warm-orange text-warm-orange" />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Start Date */}
                      <div className="text-sm text-forest-green">
                        {trip.dates.split('-')[0].trim()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Pagination */}
            <div className="flex items-center justify-between pt-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-soft-gray">Показать</span>
                <Select defaultValue="25">
                  <SelectTrigger className="w-20 h-8 bg-white border-sage-green-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-soft-gray">записей</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled className="border-sage-green-200">
                  ‹
                </Button>
                <Button variant="outline" size="sm" className="bg-warm-orange text-black border-warm-orange">
                  1
                </Button>
                <Button variant="outline" size="sm" disabled className="border-sage-green-200">
                  ›
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
