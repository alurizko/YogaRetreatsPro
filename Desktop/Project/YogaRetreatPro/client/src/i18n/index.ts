import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Define translations inline
const resources = {
  en: {
    translation: {
      // Navigation
      nav: {
        destinations: 'Destinations',
        typeOfRetreat: 'Type of Retreat',
        yogaStyles: 'Yoga Styles',
        retreats: 'Retreats',
        about: 'About',
        help: 'Help',
        featured: 'Featured',
        wishlist: 'Wishlist',
        addRetreat: 'Add Retreat',
        login: 'Login',
        createAccount: 'Create Account',
        logout: "Logout",
        profile: "Profile",
        dashboard: "Dashboard"
      },
      
      // Home page
      home: {
        hero: {
          title: 'Unforgettable yoga retreats 2025',
          subtitle: 'Book yoga retreats, holidays and courses from 2845 organizers worldwide'
        },
        popularSearches: 'Popular Searches',
        destinations: 'Destinations:',
        categories: 'Categories:',
        selectDuration: 'Select duration or date',
        arrivalMonth: 'Arrival month',
        search: 'Search',
        showingResults: 'Showing 500+ results',
        interested: 'interested',
        viewDetails: 'View Details',
        nextPage: 'Next page',
        from: 'from'
      },
      hero: {
        title: "Find Your Perfect Yoga Retreat",
        subtitle: "Discover transformative yoga experiences around the world",
        searchPlaceholder: "Where do you want to go?",
        searchButton: "Search Retreats",
        trustBadge: "Trusted by 100,000+ yogis worldwide"
      },
      categories: {
        title: "Browse by Category",
        yoga: "Yoga",
        wellness: "Wellness",
        meditation: "Meditation",
        detox: "Detox",
        spiritual: "Spiritual",
        mentalHealth: "Mental Health",
        womens: "Women's",
        adventure: "Adventure",
        luxury: "Luxury",
        budget: "Budget"
      },
      common: {
        loading: "Loading...",
        error: "Error",
        success: "Success",
        cancel: "Cancel",
        save: "Save",
        edit: "Edit",
        delete: "Delete",
        confirm: "Confirm",
        close: "Close",
        next: "Next",
        previous: "Previous",
        search: "Search",
        noResults: "No retreats found",
        tryAgain: "Try Again",
        contactSupport: "Contact Support"
      }
      ,
      retreatsPage: {
        title: 'Find Your Perfect Retreat',
        found: '{{count}} retreats found',
        activeFilters: 'Active filters:',
        placeholders: {
          retreat: 'Search retreat title or description',
          instructor: 'Search instructor',
          location: 'Search location',
          priceMin: 'Min $',
          priceMax: 'Max $'
        },
        sort: {
          relevance: 'Sort: Relevance',
          priceAsc: 'Price: Low to High',
          priceDesc: 'Price: High to Low',
          newest: 'Newest'
        },
        submit: 'your request',
        emptyHint: 'Try adjusting your search criteria or browse all retreats.'
      }
    }
  },
  ru: {
    translation: {
      nav: {
        destinations: 'Направления',
        typeOfRetreat: 'Тип ретрита',
        yogaStyles: 'Стили йоги',
        retreats: 'Ретриты',
        about: 'О нас',
        help: 'Помощь',
        featured: 'Рекомендуемые',
        wishlist: 'Избранное',
        addRetreat: 'Добавить ретрит',
        login: 'Войти',
        createAccount: 'Создать аккаунт',
        logout: "Выйти",
        profile: "Профиль",
        dashboard: "Панель управления"
      },
      
      // Home page
      home: {
        hero: {
          title: 'Незабываемые йога-ретриты 2025',
          subtitle: 'Бронируйте йога-ретриты, отпуск и курсы от 2845 организаторов по всему миру'
        },
        popularSearches: 'Популярные запросы',
        destinations: 'Направления:',
        categories: 'Категории:',
        selectDuration: 'Выберите продолжительность или дату',
        arrivalMonth: 'Месяц прибытия',
        search: 'Поиск',
        showingResults: 'Показано 500+ результатов',
        interested: 'заинтересованы',
        viewDetails: 'Подробнее',
        nextPage: 'Следующая страница',
        from: 'от'
      },
      hero: {
        title: "Найдите свой идеальный йога-ретрит",
        subtitle: "Откройте для себя трансформирующие йога-практики по всему миру",
        searchPlaceholder: "Куда вы хотите поехать?",
        searchButton: "Найти ретриты",
        trustBadge: "Нам доверяют более 100,000 йогов по всему миру"
      },
      categories: {
        title: "Поиск по категориям",
        yoga: "Йога",
        wellness: "Велнес",
        meditation: "Медитация",
        detox: "Детокс",
        spiritual: "Духовные",
        mentalHealth: "Ментальное здоровье",
        womens: "Женские",
        adventure: "Приключения",
        luxury: "Люкс",
        budget: "Бюджетные"
      },
      common: {
        loading: "Загрузка...",
        error: "Ошибка",
        success: "Успешно",
        cancel: "Отмена",
        save: "Сохранить",
        edit: "Редактировать",
        delete: "Удалить",
        confirm: "Подтвердить",
        close: "Закрыть",
        next: "Далее",
        previous: "Назад",
        search: "Поиск",
        noResults: "Ретриты не найдены",
        tryAgain: "Попробовать снова",
        contactSupport: "Связаться с поддержкой"
      }
      ,
      retreatsPage: {
        title: 'Найдите свой идеальный ретрит',
        found: '{{count}} ретритов найдено',
        activeFilters: 'Активные фильтры:',
        placeholders: {
          retreat: 'Поиск по названию или описанию ретрита',
          instructor: 'Поиск инструктора',
          location: 'Поиск по местоположению',
          priceMin: 'Мин $',
          priceMax: 'Макс $'
        },
        sort: {
          relevance: 'Сортировка: По релевантности',
          priceAsc: 'Цена: по возрастанию',
          priceDesc: 'Цена: по убыванию',
          newest: 'Сначала новые'
        },
        submit: 'your request',
        emptyHint: 'Попробуйте изменить параметры поиска или просмотреть все ретриты.'
      }
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  })

export default i18n
