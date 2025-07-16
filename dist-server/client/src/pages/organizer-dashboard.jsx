var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
import { z } from "zod";
var createRetreatSchema = insertRetreatSchema.extend({
    startDate: z.string(),
    endDate: z.string(),
});
export default function OrganizerDashboard() {
    var _this = this;
    var _a = useState(false), isCreateOpen = _a[0], setIsCreateOpen = _a[1];
    var toast = useToast().toast;
    var _b = useQuery({
        queryKey: ["/api/organizer/retreats"],
    }), _c = _b.data, retreats = _c === void 0 ? [] : _c, isLoading = _b.isLoading;
    var createRetreatMutation = useMutation({
        mutationFn: function (data) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiRequest("POST", "/api/retreats", data)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ["/api/organizer/retreats"] });
            setIsCreateOpen(false);
            toast({
                title: "Успех",
                description: "Ретрит успешно создан",
            });
        },
        onError: function (error) {
            toast({
                title: "Ошибка",
                description: error.message || "Не удалось создать ретрит",
                variant: "destructive",
            });
        },
    });
    var form = useForm({
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
    var onSubmit = function (data) {
        createRetreatMutation.mutate(data);
    };
    var totalRetreats = retreats.length;
    var activeRetreats = retreats.filter(function (r) { return r.isActive; }).length;
    var totalParticipants = retreats.reduce(function (sum, r) { return sum + r.currentParticipants; }, 0);
    return (<div className="min-h-screen bg-soft-white">
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
                <Plus className="w-4 h-4 mr-2"/>
                Создать ретрит
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Создать новый ретрит</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField control={form.control} name="title" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
                        <FormLabel>Название ретрита</FormLabel>
                        <FormControl>
                          <Input placeholder="Введите название" {...field}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>);
        }}/>

                  <FormField control={form.control} name="description" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
                        <FormLabel>Описание</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Опишите ваш ретрит" {...field}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>);
        }}/>

                  <FormField control={form.control} name="location" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
                        <FormLabel>Место проведения</FormLabel>
                        <FormControl>
                          <Input placeholder="Город, страна" {...field}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>);
        }}/>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="startDate" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
                          <FormLabel>Дата начала</FormLabel>
                          <FormControl>
                            <Input type="date" {...field}/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>);
        }}/>

                    <FormField control={form.control} name="endDate" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
                          <FormLabel>Дата окончания</FormLabel>
                          <FormControl>
                            <Input type="date" {...field}/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>);
        }}/>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="price" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
                          <FormLabel>Цена (€)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field}/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>);
        }}/>

                    <FormField control={form.control} name="maxParticipants" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
                          <FormLabel>Макс. участников</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} onChange={function (e) { return field.onChange(parseInt(e.target.value) || 0); }}/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>);
        }}/>
                  </div>

                  <FormField control={form.control} name="imageUrl" render={function (_a) {
            var _b;
            var field = _a.field;
            return (<FormItem>
                        <FormLabel>URL изображения (необязательно)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} value={(_b = field.value) !== null && _b !== void 0 ? _b : ""}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>);
        }}/>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={function () { return setIsCreateOpen(false); }}>
                      Отмена
                    </Button>
                    <Button type="submit" disabled={createRetreatMutation.isPending} className="bg-forest-green hover:bg-forest-green/90">
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
                <CalendarDays className="w-8 h-8 text-forest-green"/>
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
                <MapPin className="w-8 h-8 text-sage-green"/>
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
                <Users className="w-8 h-8 text-warm-orange"/>
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
            {isLoading ? (<div className="space-y-4">
                {[1, 2, 3].map(function (i) { return (<div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>); })}
              </div>) : retreats.length === 0 ? (<div className="text-center py-8">
                <p className="text-soft-gray">У вас пока нет ретритов</p>
                <Button className="mt-4 bg-warm-orange hover:bg-warm-orange/90" onClick={function () { return setIsCreateOpen(true); }}>
                  <Plus className="w-4 h-4 mr-2"/>
                  Создать первый ретрит
                </Button>
              </div>) : (<div className="space-y-4">
                {retreats.map(function (retreat) {
                var startDate = new Date(retreat.startDate);
                var availableSpots = retreat.maxParticipants - retreat.currentParticipants;
                return (<div key={retreat.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
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
                              <MapPin className="w-4 h-4 mr-1"/>
                              {retreat.location}
                            </div>
                            <div className="flex items-center">
                              <CalendarDays className="w-4 h-4 mr-1"/>
                              {startDate.toLocaleDateString('ru-RU')}
                            </div>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1"/>
                              {retreat.currentParticipants}/{retreat.maxParticipants}
                            </div>
                            <div className="flex items-center">
                              <Euro className="w-4 h-4 mr-1"/>
                              {parseFloat(retreat.price).toFixed(0)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={"text-sm font-medium ".concat(availableSpots > 0 ? 'text-green-600' : 'text-red-600')}>
                            {availableSpots > 0 ? "".concat(availableSpots, " \u043C\u0435\u0441\u0442") : 'Заполнен'}
                          </span>
                        </div>
                      </div>
                    </div>);
            })}
              </div>)}
          </CardContent>
        </Card>
      </div>
    </div>);
}
