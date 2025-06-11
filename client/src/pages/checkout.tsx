import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Users, Euro, ArrowLeft } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ retreat, participants }: { retreat: any; participants: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const confirmBookingMutation = useMutation({
    mutationFn: async (data: { paymentIntentId: string; retreatId: number; participants: number }) => {
      await apiRequest("POST", "/api/confirm-booking", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({
        title: "Успех!",
        description: "Ваше бронирование подтверждено",
      });
      setLocation('/participant/dashboard');
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось подтвердить бронирование",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/participant/dashboard',
      },
      redirect: 'if_required',
    });

    if (error) {
      toast({
        title: "Ошибка платежа",
        description: error.message,
        variant: "destructive",
      });
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      confirmBookingMutation.mutate({
        paymentIntentId: paymentIntent.id,
        retreatId: retreat.id,
        participants,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || confirmBookingMutation.isPending}
        className="w-full bg-warm-orange hover:bg-warm-orange/90 text-white py-3"
      >
        {confirmBookingMutation.isPending ? "Обработка..." : `Оплатить €${(parseFloat(retreat.price) * participants).toFixed(2)}`}
      </Button>
    </form>
  );
};

export default function Checkout() {
  const { retreatId } = useParams();
  const [clientSecret, setClientSecret] = useState("");
  const [participants, setParticipants] = useState(1);
  const { toast } = useToast();

  // Get participants from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlParticipants = urlParams.get('participants');
    if (urlParticipants) {
      setParticipants(parseInt(urlParticipants));
    }
  }, []);

  const { data: retreat, isLoading } = useQuery({
    queryKey: [`/api/retreats/${retreatId}`],
    enabled: !!retreatId,
  });

  useEffect(() => {
    if (retreat && participants > 0) {
      apiRequest("POST", "/api/create-payment-intent", { 
        retreatId: parseInt(retreatId!), 
        participants 
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
        })
        .catch((error) => {
          toast({
            title: "Ошибка",
            description: "Не удалось создать платежную сессию",
            variant: "destructive",
          });
        });
    }
  }, [retreat, participants, retreatId, toast]);

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

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const startDate = new Date(retreat.startDate);
  const endDate = new Date(retreat.endDate);
  const totalAmount = parseFloat(retreat.price) * participants;

  return (
    <div className="min-h-screen bg-soft-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/retreat/${retreatId}`}>
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
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
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{retreat.location}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  <span>{startDate.toLocaleDateString('ru-RU')} - {endDate.toLocaleDateString('ru-RU')}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
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
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm retreat={retreat} participants={participants} />
              </Elements>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
