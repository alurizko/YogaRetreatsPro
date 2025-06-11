import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Euro, MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Booking, Retreat } from "@shared/schema";
import { z } from "zod";

const refundRequestSchema = z.object({
  reason: z.string().min(10, "Причина должна содержать минимум 10 символов"),
});

export default function ParticipantDashboard() {
  const [isRefundOpen, setIsRefundOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const { toast } = useToast();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["/api/bookings"],
  });

  const createRefundMutation = useMutation({
    mutationFn: async (data: { bookingId: number; reason: string }) => {
      await apiRequest("POST", "/api/refund-requests", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      setIsRefundOpen(false);
      setSelectedBooking(null);
      toast({
        title: "Успех",
        description: "Запрос на возврат отправлен",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось отправить запрос на возврат",
        variant: "destructive",
      });
    },
  });

  const form = useForm<z.infer<typeof refundRequestSchema>>({
    resolver: zodResolver(refundRequestSchema),
    defaultValues: {
      reason: "",
    },
  });

  const onSubmitRefund = (data: z.infer<typeof refundRequestSchema>) => {
    if (selectedBooking) {
      createRefundMutation.mutate({
        bookingId: selectedBooking.id,
        reason: data.reason,
      });
    }
  };

  const openRefundDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsRefundOpen(true);
    form.reset();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Подтверждено</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Отменено</Badge>;
      case 'refunded':
        return <Badge className="bg-blue-100 text-blue-800">Возвращено</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const confirmedBookings = bookings.filter((b: Booking) => b.status === 'confirmed');
  const totalSpent = bookings
    .filter((b: Booking) => b.status === 'confirmed')
    .reduce((sum: number, b: Booking) => sum + parseFloat(b.totalAmount), 0);

  return (
    <div className="min-h-screen bg-soft-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-forest-green">Мои бронирования</h1>
          <p className="text-soft-gray mt-2">Управляйте своими ретритами</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-soft-gray">Всего бронирований</p>
                  <p className="text-2xl font-bold text-forest-green">{bookings.length}</p>
                </div>
                <CalendarDays className="w-8 h-8 text-forest-green" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-soft-gray">Активные ретриты</p>
                  <p className="text-2xl font-bold text-sage-green">{confirmedBookings.length}</p>
                </div>
                <MapPin className="w-8 h-8 text-sage-green" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-soft-gray">Потрачено</p>
                  <p className="text-2xl font-bold text-warm-orange">€{totalSpent.toFixed(0)}</p>
                </div>
                <Euro className="w-8 h-8 text-warm-orange" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings List */}
        <Card>
          <CardHeader>
            <CardTitle>Ваши бронирования</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-soft-gray">У вас пока нет бронирований</p>
                <Button className="mt-4 bg-sage-green hover:bg-sage-green/90">
                  Найти ретрит
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking: Booking) => {
                  const bookingDate = new Date(booking.bookingDate!);
                  
                  return (
                    <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-forest-green">
                              Ретрит #{booking.retreatId}
                            </h3>
                            {getStatusBadge(booking.status)}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-soft-gray">
                            <div className="flex items-center">
                              <CalendarDays className="w-4 h-4 mr-1" />
                              {bookingDate.toLocaleDateString('ru-RU')}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {booking.participants} участник{booking.participants > 1 ? 'ов' : ''}
                            </div>
                            <div className="flex items-center">
                              <Euro className="w-4 h-4 mr-1" />
                              €{parseFloat(booking.totalAmount).toFixed(0)}
                            </div>
                            <div className="flex items-center">
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                ID: {booking.id}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {booking.status === 'confirmed' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openRefundDialog(booking)}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <MessageSquare className="w-4 h-4 mr-1" />
                              Возврат
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Refund Request Dialog */}
        <Dialog open={isRefundOpen} onOpenChange={setIsRefundOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Запрос на возврат средств</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitRefund)} className="space-y-4">
                <div className="text-sm text-gray-600">
                  <p>Бронирование: #{selectedBooking?.id}</p>
                  <p>Сумма: €{selectedBooking ? parseFloat(selectedBooking.totalAmount).toFixed(2) : '0'}</p>
                </div>

                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Причина возврата</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Опишите причину запроса на возврат средств..."
                          className="min-h-24"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsRefundOpen(false)}
                  >
                    Отмена
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createRefundMutation.isPending}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {createRefundMutation.isPending ? "Отправка..." : "Отправить запрос"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
