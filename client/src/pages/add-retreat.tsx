import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { MapPin, Users, Calendar, Star, Heart, Leaf } from "lucide-react";

export default function AddRetreat() {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    price: "",
    duration: "",
    capacity: "",
    email: "",
    phone: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log("Отправляем данные ретрита:", formData);

      // Преобразуем строковые значения в числа для числовых полей
      const dataToSend = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        duration: parseInt(formData.duration) || 0,
        capacity: parseInt(formData.capacity) || 0,
      };

      const response = await fetch("/api/retreat-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert("Заявка успешно отправлена! Мы свяжемся с вами в течение 24 часов.");
        // Очищаем форму после успешной отправки
        setFormData({
          name: "",
          location: "",
          description: "",
          price: "",
          duration: "",
          capacity: "",
          email: "",
          phone: ""
        });
      } else {
        throw new Error(result.message || "Ошибка при отправке заявки");
      }
    } catch (error) {
      console.error("Ошибка при отправке заявки:", error);
      alert("Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fff6f0]">
      {/* Header Section */}
      <div className="bg-[#fff6f0] py-12 border-b border-sage-green-200">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-forest-green mb-6">
            Поделитесь своим ретритом с миром
          </h1>
          <p className="text-lg text-soft-gray mb-8 max-w-3xl mx-auto">
            Присоединяйтесь к нашему сообществу организаторов и помогите людям найти свой путь к внутренней гармонии
          </p>
          <div className="flex justify-center space-x-8 text-sm">
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              <span>Тысячи участников</span>
            </div>
            <div className="flex items-center">
              <Star className="w-5 h-5 mr-2" />
              <span>Высокие рейтинги</span>
            </div>
            <div className="flex items-center">
              <Heart className="w-5 h-5 mr-2" />
              <span>Поддержка 24/7</span>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Почему стоит работать с нами?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-sage-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-forest-green" />
                </div>
                <CardTitle className="text-xl text-gray-800">Широкая аудитория</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Доступ к тысячам потенциальных участников, ищущих духовное развитие и оздоровление
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-sage-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-forest-green" />
                </div>
                <CardTitle className="text-xl text-gray-800">Простое управление</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Интуитивная платформа для управления бронированиями, участниками и отзывами
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-sage-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-forest-green" />
                </div>
                <CardTitle className="text-xl text-gray-800">Поддержка экспертов</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Персональная поддержка от нашей команды экспертов по развитию ретрит-бизнеса
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main CTA Section */}
      <div className="py-20 px-4 bg-[#fff6f0]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-forest-green">
            Готовы начать?
          </h2>
          <p className="text-xl text-soft-gray mb-12 max-w-2xl mx-auto">
            Заполните форму ниже, и мы свяжемся с вами в течение 24 часов для обсуждения деталей вашего ретрита
          </p>

          {/* Main CTA Button */}
          <Button
            onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-warm-orange hover:bg-warm-orange/90 text-black text-xl font-bold py-6 px-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Leaf className="w-6 h-6 mr-3" />
            Добавьте свой ретрит
          </Button>
        </div>
      </div>

      {/* Contact Form Section */}
      <div id="contact-form" className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold text-gray-800">
                Расскажите о своем ретрите
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Мы поможем вам создать незабываемый опыт для участников
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                      Название ретрита *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Например: Йога-ретрит в горах"
                      className="mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="location" className="text-sm font-semibold text-gray-700">
                      Местоположение *
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Город, страна"
                      className="mt-2"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                    Описание ретрита *
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Расскажите о программе, целях и особенностях вашего ретрита..."
                    className="mt-2 min-h-[120px]"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="price" className="text-sm font-semibold text-gray-700">
                      Цена (грн.) *
                    </Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="5000 грн"
                      className="mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration" className="text-sm font-semibold text-gray-700">
                      Длительность (дней) *
                    </Label>
                    <Input
                      id="duration"
                      name="duration"
                      type="number"
                      value={formData.duration}
                      onChange={handleInputChange}
                      placeholder="7"
                      className="mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="capacity" className="text-sm font-semibold text-gray-700">
                      Максимальное количество участников *
                    </Label>
                    <Input
                      id="capacity"
                      name="capacity"
                      type="number"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      placeholder="20"
                      className="mt-2"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                      Email для связи *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className="mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                      Телефон
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+38 (099) 123-45-67"
                      className="mt-2"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-warm-orange hover:bg-warm-orange/90 text-black font-bold py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Отправить заявку
                </Button>
                
                {/* Примечание об обязательных полях */}
                <p className="text-sm text-gray-500 text-center mt-4">
                  * Поля, отмеченные звездочкой, обязательны для заполнения
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-[#fff6f0] py-16 px-4 border-t border-sage-green-200">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4 text-forest-green">
            Начните свое путешествие уже сегодня
          </h3>
          <p className="text-lg mb-8 text-soft-gray">
            Присоединяйтесь к сообществу организаторов, которые меняют жизни людей к лучшему
          </p>
          <div className="flex justify-center space-x-8 text-sm text-forest-green">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              <span>Более 50 стран</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span>Круглогодично</span>
            </div>
            <div className="flex items-center">
              <Leaf className="w-5 h-5 mr-2" />
              <span>Экологично</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
