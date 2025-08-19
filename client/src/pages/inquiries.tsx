import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";

type Inquiry = {
  id: string;
  guest: string;
  departure: string;
  arrival: string;
  message: string;
  requestDate: string;
  labels: string[];
};

const DEMO_INQUIRIES: Inquiry[] = [
  {
    id: "1",
    guest: "Анна Петрова",
    departure: "15.03.2025",
    arrival: "22.03.2025", 
    message: "Интересует ретрит по хатха-йоге в Индии. Есть ли вегетарианское питание?",
    requestDate: "10.01.2025",
    labels: ["Новый", "Индия"]
  },
  {
    id: "2",
    guest: "Михаил Сидоров",
    departure: "01.04.2025",
    arrival: "08.04.2025",
    message: "Хочу забронировать место на ретрите в Тоскане. Какие условия размещения?",
    requestDate: "12.01.2025",
    labels: ["В работе", "Италия"]
  },
  {
    id: "3",
    guest: "Елена Козлова",
    departure: "20.02.2025",
    arrival: "27.02.2025",
    message: "Подскажите, включены ли экскурсии в программу ретрита на Бали?",
    requestDate: "08.01.2025",
    labels: ["Ответ отправлен", "Бали"]
  }
];

export default function InquiriesPage() {
  const [query, setQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const filtered = useMemo(() => {
    let base = DEMO_INQUIRIES;
    
    // Filter by search query
    const q = query.trim().toLowerCase();
    if (q) {
      base = base.filter(
        (i) =>
          i.guest.toLowerCase().includes(q) ||
          i.message.toLowerCase().includes(q)
      );
    }
    
    return base;
  }, [query]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-[#fff6f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-forest-green mb-2">Входящие</h1>
          <p className="text-soft-gray">
            Данные в таблице отсутствуют.
          </p>
        </div>

        {/* Filters */}
        <Card className="bg-white rounded-xl shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative">
                  <Search className="w-4 h-4 text-soft-gray absolute left-3 top-3" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Фильтрация по..."
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-48">
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Выбрать дату" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все даты</SelectItem>
                    <SelectItem value="today">Сегодня</SelectItem>
                    <SelectItem value="week">Эта неделя</SelectItem>
                    <SelectItem value="month">Этот месяц</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="border-sage-green text-forest-green hover:bg-sage-green/10">
                  <Filter className="w-4 h-4 mr-2" />
                  Фильтры
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="bg-white rounded-xl shadow-lg">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-sage-green/10 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold text-forest-green">Гость</th>
                    <th className="text-left p-4 font-semibold text-forest-green">Отступление</th>
                    <th className="text-left p-4 font-semibold text-forest-green">Прибытие</th>
                    <th className="text-left p-4 font-semibold text-forest-green">Сообщение</th>
                    <th className="text-left p-4 font-semibold text-forest-green">Дата запроса</th>
                    <th className="text-left p-4 font-semibold text-forest-green">Этикетки</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12">
                        <div className="text-soft-gray">
                          <p className="text-lg mb-2">Данные в таблице отсутствуют.</p>
                          <p className="text-sm">Здесь будут отображаться входящие запросы от гостей.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((inquiry, index) => (
                      <tr key={inquiry.id} className={index % 2 === 0 ? "bg-white" : "bg-sage-green/5"}>
                        <td className="p-4">
                          <div className="font-medium text-forest-green">{inquiry.guest}</div>
                        </td>
                        <td className="p-4 text-soft-gray">{inquiry.departure}</td>
                        <td className="p-4 text-soft-gray">{inquiry.arrival}</td>
                        <td className="p-4">
                          <div className="max-w-xs truncate text-soft-gray" title={inquiry.message}>
                            {inquiry.message}
                          </div>
                        </td>
                        <td className="p-4 text-soft-gray">{inquiry.requestDate}</td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {inquiry.labels.map((label, idx) => (
                              <Badge 
                                key={idx} 
                                variant={label === "Новый" ? "default" : "secondary"}
                                className={label === "Новый" ? "bg-warm-orange text-black" : "bg-sage-green/20 text-forest-green"}
                              >
                                {label}
                              </Badge>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filtered.length > 0 && (
              <div className="flex items-center justify-between p-4 border-t">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-soft-gray">
                    Показано {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filtered.length)} из {filtered.length}
                  </span>
                  <Select value={itemsPerPage.toString()} onValueChange={(v) => setItemsPerPage(Number(v))}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


