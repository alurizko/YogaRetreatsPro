import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, DollarSign, BookOpen, MessageSquare, Gift, Heart } from "lucide-react";

const supportItems = [
  {
    id: 1,
    title: "Вопросы и ответы",
    description: "Найдите ответы на часто задаваемые вопросы о бронировании, отмене и проведении ретритов",
    icon: HelpCircle,
    href: "/support/faq"
  },
  {
    id: 2,
    title: "Вид валюты",
    description: "Настройки валюты для отображения цен и проведения платежей",
    icon: DollarSign,
    href: "/support/currency"
  },
  {
    id: 3,
    title: "Журнал",
    description: "История ваших действий, бронирований и изменений в системе",
    icon: BookOpen,
    href: "/support/journal"
  },
  {
    id: 4,
    title: "Предложения",
    description: "Отправьте нам свои идеи и предложения по улучшению платформы",
    icon: MessageSquare,
    href: "/support/suggestions"
  },
  {
    id: 5,
    title: "Подарочные карты",
    description: "Покупайте и используйте подарочные карты для ретритов",
    icon: Gift,
    href: "/support/gift-cards"
  },
  {
    id: 6,
    title: "Избранное",
    description: "Управляйте списком ваших любимых ретритов и организаторов",
    icon: Heart,
    href: "/support/favorites"
  }
];

export default function Support() {
  return (
    <div className="min-h-screen bg-[#fff6f0]">
      {/* Header Section */}
      <div className="bg-[#fff6f0] py-8 border-b border-sage-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-forest-green mb-4">Поддержка</h1>
            <p className="text-soft-gray max-w-2xl mx-auto">
              Мы здесь, чтобы помочь вам получить максимум от использования нашей платформы
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Support Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {supportItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Card key={item.id} className="hover:shadow-lg transition-shadow bg-white border-sage-green-200 group">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-sage-green rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-warm-orange transition-colors">
                    <IconComponent className="w-8 h-8 text-forest-green group-hover:text-black transition-colors" />
                  </div>
                  <CardTitle className="text-xl text-forest-green">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-soft-gray mb-6">
                    {item.description}
                  </p>
                  <Link href={item.href}>
                    <Button 
                      variant="outline" 
                      className="w-full border-sage-green-200 hover:bg-warm-orange hover:text-black hover:border-warm-orange transition-colors"
                    >
                      Перейти
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Contact Support Section */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-white border-sage-green-200">
            <CardHeader>
              <CardTitle className="text-2xl text-forest-green">Нужна дополнительная помощь?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-soft-gray mb-6">
                Если вы не нашли ответ на свой вопрос, наша команда поддержки готова помочь вам 24/7
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:support@yogaretreat.pro">
                  <Button className="bg-warm-orange hover:bg-warm-orange/90 text-black font-semibold">
                    Написать в поддержку
                  </Button>
                </a>
                <Link href="/inquiries">
                  <Button variant="outline" className="border-sage-green-200 hover:bg-sage-green hover:text-forest-green">
                    Мои обращения
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
