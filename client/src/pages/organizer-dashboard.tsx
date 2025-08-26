import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, CalendarDays, MapPin, Users, Euro } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertRetreatSchema } from "../../../shared/schema";
import type { Retreat } from "@shared/schema";
import { z } from "zod";

const createRetreatSchema = insertRetreatSchema.extend({
  startDate: z.string(),
  endDate: z.string(),
});

export default function OrganizerDashboard() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { toast } = useToast();

  const { data: retreats = [], isLoading } = useQuery<Retreat[]>({
    queryKey: ["/api/organizer/retreats"],
  });

  const createRetreatMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createRetreatSchema>) => {
      await apiRequest("POST", "/api/retreats", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/organizer/retreats"] });
      setIsCreateOpen(false);
      toast({
        title: "Успех",
        description: "Ретрит успешно создан",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось создать ретрит",
        variant: "destructive",
      });
    },
  });

  const form = useForm<z.infer<typeof createRetreatSchema>>({
    resolver: zodResolver(createRetreatSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      startDate: "",
      endDate: "",
      price: "",
      maxParticipants: 0,
      imageUrl: "",
      cancellationPolicy: "Полный возврат при отмене за 30+ дней, 50% возврат при отмене за 7-30 дней, без возврата при отмене менее чем за 7 дней",
    },
  });

  const onSubmit = (data: z.infer<typeof createRetreatSchema>) => {
    createRetreatMutation.mutate(data);
  };

  const totalRetreats = retreats.length;
  const activeRetreats = retreats.filter((r: Retreat) => r.isActive).length;
  const totalParticipants = retreats.reduce((sum: number, r: Retreat) => sum + r.currentParticipants, 0);

  return (
    <div className="min-h-screen bg-[#fff6f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-forest-green">Панель организатора</h1>
            <p className="text-soft-gray mt-2">Управляйте своими ретритами</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-warm-orange hover:bg-warm-orange/90">
                <Plus className="w-4 h-4 mr-2" />
                Создать ретрит
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Создать новый ретрит</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Название ретрита</FormLabel>
                        <FormControl>
                          <Input placeholder="Введите название" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Описание</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Опишите ваш ретрит" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Место проведения</FormLabel>
                        <FormControl>
                          <Input placeholder="Город, страна" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Дата начала</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Дата окончания</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Цена (€)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxParticipants"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Макс. участников</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="0" 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL изображения (необязательно)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsCreateOpen(false)}
                    >
                      Отмена
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createRetreatMutation.isPending}
                      className="bg-warm-orange hover:bg-warm-orange/90 text-black"
                    >
                      {createRetreatMutation.isPending ? "Создание..." : "Создать ретрит"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-soft-gray">Всего ретритов</p>
                  <p className="text-2xl font-bold text-forest-green">{totalRetreats}</p>
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
                  <p className="text-2xl font-bold text-sage-green">{activeRetreats}</p>
                </div>
                <MapPin className="w-8 h-8 text-sage-green" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-soft-gray">Всего участников</p>
                  <p className="text-2xl font-bold text-warm-orange">{totalParticipants}</p>
                </div>
                <Users className="w-8 h-8 text-warm-orange" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Retreats List */}
        <Card>
          <CardHeader>
            <CardTitle>Ваши ретриты</CardTitle>
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
            ) : retreats.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-soft-gray">У вас пока нет ретритов</p>
                <Button 
                  className="mt-4 bg-warm-orange hover:bg-warm-orange/90"
                  onClick={() => setIsCreateOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Создать первый ретрит
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {retreats.map((retreat: Retreat) => {
                  const startDate = new Date(retreat.startDate);
                  const availableSpots = retreat.maxParticipants - retreat.currentParticipants;
                  
                  return (
                    <div key={retreat.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-forest-green">{retreat.title}</h3>
                            <Badge variant={retreat.isActive ? "default" : "secondary"}>
                              {retreat.isActive ? "Активный" : "Неактивный"}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-soft-gray">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {retreat.location}
                            </div>
                            <div className="flex items-center">
                              <CalendarDays className="w-4 h-4 mr-1" />
                              {startDate.toLocaleDateString('ru-RU')}
                            </div>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {retreat.currentParticipants}/{retreat.maxParticipants}
                            </div>
                            <div className="flex items-center">
                              <Euro className="w-4 h-4 mr-1" />
                              {parseFloat(retreat.price).toFixed(0)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium ${availableSpots > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {availableSpots > 0 ? `${availableSpots} мест` : 'Заполнен'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
