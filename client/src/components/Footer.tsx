import { Link } from "wouter";
import { Clover, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white text-black border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Логотип и описание */}
          <div className="lg:col-span-1">
            <div className="flex items-center text-2xl font-bold mb-4 text-forest-green">
              <Clover className="mr-2 text-sage-green" />
              YogaRetreat
            </div>
            <p className="text-gray-700 text-sm mb-6 leading-relaxed">
              Найдите идеальный ретрит по йоге для трансформации тела, разума и души. 
              Проверенные организаторы, реальные отзывы, лучшие цены.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-warm-orange transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-warm-orange transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-warm-orange transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-warm-orange transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Для путешественников */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Для путешественников</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/retreats" className="text-gray-700 hover:text-warm-orange transition-colors">
                  Найти ретрит
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-700 hover:text-warm-orange transition-colors">
                  Категории
                </Link>
              </li>
              <li>
                <Link href="/my-bookings" className="text-gray-700 hover:text-warm-orange transition-colors">
                  Мои бронирования
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-warm-orange transition-colors">
                  Подарочные карты
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-warm-orange transition-colors">
                  Отзывы
                </a>
              </li>
            </ul>
          </div>

          {/* Для организаторов */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Для организаторов</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/organizer/add-retreat" className="text-gray-700 hover:text-warm-orange transition-colors">
                  Добавить ретрит
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-warm-orange transition-colors">
                  Стать партнером
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-warm-orange transition-colors">
                  Руководство для хостов
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-warm-orange transition-colors">
                  Маркетинговые инструменты
                </a>
              </li>
            </ul>
          </div>

          {/* Поддержка и контакты */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Поддержка</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/support" className="text-gray-700 hover:text-warm-orange transition-colors">
                  Центр помощи
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-warm-orange transition-colors">
                  Политика отмены
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-warm-orange transition-colors">
                  Безопасность
                </a>
              </li>
            </ul>
            
            <div className="mt-6 space-y-2">
              <div className="flex items-center text-gray-700 text-sm">
                <Mail className="w-4 h-4 mr-2" />
                support@yogaretreat.com
              </div>
              <div className="flex items-center text-gray-700 text-sm">
                <Phone className="w-4 h-4 mr-2" />
                +7 (800) 555-0123
              </div>
            </div>
          </div>
        </div>

        {/* Нижняя часть */}
        <div className="border-t border-gray-300 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
              <a href="#" className="text-gray-700 hover:text-warm-orange transition-colors">
                О нас
              </a>
              <a href="#" className="text-gray-700 hover:text-warm-orange transition-colors">
                Блог
              </a>
              <a href="#" className="text-gray-700 hover:text-warm-orange transition-colors">
                Пресса
              </a>
              <a href="#" className="text-gray-700 hover:text-warm-orange transition-colors">
                Карьера
              </a>
              <a href="#" className="text-gray-700 hover:text-warm-orange transition-colors">
                Условия использования
              </a>
              <a href="#" className="text-gray-700 hover:text-warm-orange transition-colors">
                Политика конфиденциальности
              </a>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-700">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-sage-green rounded-full mr-2"></div>
                <span>Углеродно-нейтральная платформа</span>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-6 text-sm text-gray-600">
            © 2025 YogaRetreatPro. Все права защищены.
          </div>
        </div>
      </div>
    </footer>
  );
}
