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
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, MapPin, Users, ArrowLeft } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
var stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY
    ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
    : null;
var CheckoutForm = function (_a) {
    var retreat = _a.retreat, participants = _a.participants;
    var stripe = useStripe();
    var elements = useElements();
    var toast = useToast().toast;
    var _b = useLocation(), setLocation = _b[1];
    var confirmBookingMutation = useMutation({
        mutationFn: function (data) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiRequest("POST", "/api/confirm-booking", data)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
            toast({
                title: "Успех!",
                description: "Ваше бронирование подтверждено",
            });
            setLocation('/participant/dashboard');
        },
        onError: function (error) {
            toast({
                title: "Ошибка",
                description: error.message || "Не удалось подтвердить бронирование",
                variant: "destructive",
            });
        },
    });
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, error, paymentIntent;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    e.preventDefault();
                    if (!stripe || !elements) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, stripe.confirmPayment({
                            elements: elements,
                            confirmParams: {
                                return_url: window.location.origin + '/participant/dashboard',
                            },
                            redirect: 'if_required',
                        })];
                case 1:
                    _a = _b.sent(), error = _a.error, paymentIntent = _a.paymentIntent;
                    if (error) {
                        toast({
                            title: "Ошибка платежа",
                            description: error.message,
                            variant: "destructive",
                        });
                    }
                    else if (paymentIntent && paymentIntent.status === 'succeeded') {
                        confirmBookingMutation.mutate({
                            paymentIntentId: paymentIntent.id,
                            retreatId: retreat.id,
                            participants: participants,
                        });
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    return (<form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button type="submit" disabled={!stripe || confirmBookingMutation.isPending} className="w-full bg-warm-orange hover:bg-warm-orange/90 text-white py-3">
        {confirmBookingMutation.isPending ? "Обработка..." : "\u041E\u043F\u043B\u0430\u0442\u0438\u0442\u044C \u20AC".concat((parseFloat(retreat.price) * participants).toFixed(2))}
      </Button>
    </form>);
};
export default function Checkout() {
    var retreatId = useParams().retreatId;
    var _a = useState(""), clientSecret = _a[0], setClientSecret = _a[1];
    var _b = useState(1), participants = _b[0], setParticipants = _b[1];
    var toast = useToast().toast;
    // Get participants from URL params
    useEffect(function () {
        var urlParams = new URLSearchParams(window.location.search);
        var urlParticipants = urlParams.get('participants');
        if (urlParticipants) {
            setParticipants(parseInt(urlParticipants));
        }
    }, []);
    var _c = useQuery({
        queryKey: ["/api/retreats/".concat(retreatId)],
        enabled: !!retreatId,
    }), retreat = _c.data, isLoading = _c.isLoading;
    useEffect(function () {
        if (retreat && participants > 0) {
            apiRequest("POST", "/api/create-payment-intent", {
                retreatId: parseInt(retreatId),
                participants: participants
            })
                .then(function (res) { return res.json(); })
                .then(function (data) {
                setClientSecret(data.clientSecret);
            })
                .catch(function (error) {
                toast({
                    title: "Ошибка",
                    description: "Не удалось создать платежную сессию",
                    variant: "destructive",
                });
            });
        }
    }, [retreat, participants, retreatId, toast]);
    if (isLoading) {
        return (<div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"/>
      </div>);
    }
    if (!retreat) {
        return (<div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-forest-green mb-4">Ретрит не найден</h1>
          <Link href="/retreats">
            <Button>Вернуться к поиску</Button>
          </Link>
        </div>
      </div>);
    }
    if (!stripePromise) {
        return (<div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-forest-green mb-4">Платежи временно недоступны</h1>
          <p className="text-soft-gray mb-6">
            Извините, функция оплаты временно недоступна. Пожалуйста, свяжитесь с поддержкой для завершения бронирования.
          </p>
          <Link href="/retreats">
            <Button>Вернуться к поиску</Button>
          </Link>
        </div>
      </div>);
    }
    if (!clientSecret) {
        return (<div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"/>
      </div>);
    }
    var startDate = new Date(retreat.startDate);
    var endDate = new Date(retreat.endDate);
    var totalAmount = parseFloat(retreat.price) * participants;
    return (<div className="min-h-screen bg-soft-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href={"/retreat/".concat(retreatId)}>
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2"/>
              Назад к ретриту
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-forest-green">Оформление бронирования</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Детали заказа</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-forest-green">{retreat.title}</h3>
                <div className="flex items-center text-gray-600 mt-2">
                  <MapPin className="w-4 h-4 mr-1"/>
                  <span>{retreat.location}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <CalendarDays className="w-4 h-4 mr-2"/>
                  <span>{startDate.toLocaleDateString('ru-RU')} - {endDate.toLocaleDateString('ru-RU')}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-4 h-4 mr-2"/>
                  <span>{participants} участник{participants > 1 ? 'ов' : ''}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span>Цена за человека:</span>
                  <span>€{parseFloat(retreat.price).toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Количество участников:</span>
                  <span>{participants}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-forest-green border-t pt-2">
                  <span>Итого:</span>
                  <span>€{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-700">
                  <strong>Политика отмены:</strong><br />
                  • Полный возврат при отмене за 30+ дней<br />
                  • 50% возврат при отмене за 7-30 дней<br />
                  • Без возврата при отмене менее чем за 7 дней
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle>Оплата</CardTitle>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise} options={{ clientSecret: clientSecret }}>
                <CheckoutForm retreat={retreat} participants={participants}/>
              </Elements>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>);
}
