import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Search, Check, MapPin, Clover } from "lucide-react";
import RetreatCard from "@/components/RetreatCard";
export default function Home() {
    var _a = useState(""), searchLocation = _a[0], setSearchLocation = _a[1];
    var _b = useState(""), searchDate = _b[0], setSearchDate = _b[1];
    var _c = useState(""), searchDuration = _c[0], setSearchDuration = _c[1];
    var _d = useQuery({
        queryKey: ["/api/retreats"],
    }), _e = _d.data, retreats = _e === void 0 ? [] : _e, isLoading = _d.isLoading;
    var featuredRetreats = retreats.slice(0, 3);
    return (<main className="bg-soft-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-forest-green to-sage-green">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=800')",
            backgroundSize: "cover",
            backgroundPosition: "center"
        }} className="relative h-96 md:h-[500px] flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white relative z-10">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              Найдите свой идеальный<br />
              <span className="text-warm-orange">ретрит по йоге</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Присоединяйтесь к тысячам практикующих в уникальных местах по всему миру
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* Кнопки 'Найти ретрит' и 'Стать организатором' удалены из hero-секции */}
            </div>
          </div>
        </div>
      </section>

      {/* Search Filters */}
      <section className="bg-[#fff6f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-4 gap-[40px] items-end w-full bg-[#fff6f0] rounded-2xl py-8 px-6 justify-items-center">
            {/* 1. Место проведения */}
            <div className="flex flex-col items-center text-center w-full">
              <label className="block text-sm font-semibold text-soft-gray mb-2">Место проведения</label>
              <Input className="bg-warm-orange text-black w-full" placeholder="Куда хотите поехать?" value={searchLocation} onChange={function (e) { return setSearchLocation(e.target.value); }}/>
            </div>
            {/* 2. Дата начала */}
            <div className="flex flex-col items-center text-center w-full">
              <label className="block text-sm font-semibold text-soft-gray mb-2">Дата начала</label>
              <Input className="bg-warm-orange text-black w-full" type="date" value={searchDate} onChange={function (e) { return setSearchDate(e.target.value); }}/>
            </div>
            {/* 3. Продолжительность */}
            <div className="flex flex-col items-center text-center w-full">
              <label className="block text-sm font-semibold text-soft-gray mb-2">Продолжительность</label>
              <Select value={searchDuration} onValueChange={setSearchDuration}>
                <SelectTrigger className="bg-warm-orange text-black w-full">
                  <SelectValue placeholder="Любая"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Любая</SelectItem>
                  <SelectItem value="1-3">1-3 дня</SelectItem>
                  <SelectItem value="4-7">4-7 дней</SelectItem>
                  <SelectItem value="1-2w">1-2 недели</SelectItem>
                  <SelectItem value="2w+">Больше 2 недель</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* 4. Кнопка поиска */}
            <div className="flex items-end justify-center w-full">
              <Link href="/retreats" className="w-full">
                <Button className="w-full bg-warm-orange hover:bg-warm-orange/90 text-black font-semibold">
                  <Search className="w-4 h-4 mr-2"/>
                  Искать
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Retreats */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-[#fff6f0]">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-forest-green mb-4">Популярные ретриты</h2>
          <p className="text-lg text-soft-gray max-w-2xl mx-auto">
            Откройте для себя лучшие ретриты по йоге от проверенных организаторов
          </p>
        </div>

        {isLoading ? (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {[1, 2, 3].map(function (i) { return (<div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
              </div>); })}
          </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {featuredRetreats.map(function (retreat) { return (<RetreatCard key={retreat.id} retreat={retreat}/>); })}
          </div>)}

        <div className="text-center">
          <Link href="/retreats">
            <Button size="lg" className="bg-warm-orange hover:bg-warm-orange/90 text-black px-8 py-3 text-lg font-semibold">
              Посмотреть все ретриты
            </Button>
          </Link>
        </div>
      </section>

      {/* For Organizers */}
      <section className="bg-[#fff6f0] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" alt="Yoga instructor teaching" className="rounded-xl shadow-lg w-full h-auto"/>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-forest-green mb-6">
                Станьте организатором ретритов
              </h2>
              <p className="text-lg text-soft-gray mb-8">
                Делитесь своими знаниями йоги и создавайте незабываемые впечатления для практикующих со всего мира
              </p>
              <div className="space-y-4 mb-8">
                {[
            "Простое управление бронированиями",
            "Автоматическая обработка платежей",
            "Гибкая система возвратов",
            "Поддержка 24/7"
        ].map(function (feature, index) { return (<div key={index} className="flex items-center">
                    <Check className="text-sage-green mr-3 w-5 h-5"/>
                    <span>{feature}</span>
                  </div>); })}
              </div>
              <Button size="lg" className="bg-warm-orange hover:bg-warm-orange/90 text-black px-8 py-3 text-lg font-semibold" onClick={function () { return window.location.href = "/api/login"; }}>
                Начать организовывать
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-[#fff6f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-forest-green mb-4">Как это работает</h2>
            <p className="text-lg text-soft-gray max-w-2xl mx-auto">
              Простой процесс от поиска до участия в ретрите
            </p>
          </div>

          <div className="grid grid-cols-5 gap-8">
            {/* 1. Найдите ретрит — под 'Ретриты' */}
            <div className="col-start-1 col-end-2 text-center">
              <div className={"bg-sage-green bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"}>
                <Search className={"text-2xl w-8 h-8"}/>
              </div>
              <h3 className="text-xl font-semibold text-forest-green mb-3">1. Найдите ретрит</h3>
              <p className="text-soft-gray">Используйте наши фильтры для поиска идеального ретрита по местоположению, дате и стилю йоги</p>
            </div>
            {/* 2. Пусто */}
            <div></div>
            {/* 3. Забронируйте место — по центру */}
            <div className="col-start-3 col-end-4 text-center">
              <div className={"bg-warm-orange bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"}>
                <MapPin className={"text-2xl w-8 h-8"}/>
              </div>
              <h3 className="text-xl font-semibold text-forest-green mb-3">2. Забронируйте место</h3>
              <p className="text-soft-gray">Безопасная оплата через Stripe с возможностью возврата средств при необходимости</p>
                </div>
            {/* 4. Пусто */}
            <div></div>
            {/* 5. Наслаждайтесь — под 'Войти' */}
            <div className="col-start-5 col-end-6 text-center">
              <div className={"bg-forest-green bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"}>
                <Clover className={"text-2xl w-8 h-8"}/>
              </div>
              <h3 className="text-xl font-semibold text-forest-green mb-3">3. Наслаждайтесь</h3>
              <p className="text-soft-gray">Погрузитесь в практику йоги и получите незабываемые впечатления</p>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full border-t-2 border-sage-green-200 my-0 bg-[#fff6f0]"></div>

      {/* Footer */}
      <footer className="bg-[#fff6f0] text-forest-green py-12">
        <div className="max-w-7xl mx-auto px-[40px]">
          <div className="grid grid-cols-5" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
            {/* 1. Логотип — строго по левому краю */}
            <div className="flex flex-col items-start text-left">
              <div className="text-2xl font-bold mb-4 flex items-center">
                <Clover className="mr-2"/>
                YogaRetreat
              </div>
              <p className="text-forest-green mb-4 max-w-md text-left">
                Ваша платформа для поиска и организации ретритов по йоге. Соединяем практикующих с лучшими инструкторами и местами по всему миру.
              </p>
            </div>
            {/* 2. Пусто */}
            <div></div>
            {/* 3. Быстрые ссылки — строго по центру футера */}
            <div className="flex flex-col items-center text-center">
              <h4 className="text-lg font-semibold mb-4 text-center">Быстрые ссылки</h4>
              <ul className="space-y-2 text-center">
                <li><Link href="/retreats" className="text-forest-green hover:text-warm-orange transition-colors">Найти ретрит</Link></li>
                <li><a href="/api/login" className="text-forest-green hover:text-warm-orange transition-colors">Стать организатором</a></li>
                <li><Link href="/" className="text-forest-green hover:text-warm-orange transition-colors">О нас</Link></li>
              </ul>
            </div>
            {/* 4. Пусто */}
            <div></div>
            {/* 5. Поддержка — строго по правому краю */}
            <div className="flex flex-col items-end text-right">
              <h4 className="text-lg font-semibold mb-4 text-right">Поддержка</h4>
              <ul className="space-y-2 text-right">
                <li><Link href="/" className="text-forest-green hover:text-warm-orange transition-colors">Политика возврата</Link></li>
                <li><Link href="/" className="text-forest-green hover:text-warm-orange transition-colors">Условия использования</Link></li>
                <li><Link href="/" className="text-forest-green hover:text-warm-orange transition-colors">Политика конфиденциальности</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-sage-green-200 pt-8 mt-8 text-center">
            <p className="text-forest-green font-medium">
              &copy; 2024 YogaRetreat. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </main>);
}
