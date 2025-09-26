// src/i18n.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          nav: {
            destinations: 'Destinations',
            typeOfRetreat: 'Type of Retreat',
            yogaStyles: 'Yoga Styles',
            wishlist: 'Wishlist',
            addRetreat: 'Add Retreat',
            logout: 'Logout',
            login: 'Log in',
            createAccount: 'Create account'
          },
          home: {
            hero: {
              title: 'Find and book your perfect yoga retreat',
              subtitle: 'Explore thousands of retreats around the world'
            },
            popularSearches: 'Popular searches',
            destinations: 'Destinations',
            categories: 'Categories',
            selectDuration: 'Select duration',
            arrivalMonth: 'Arrival month',
            search: 'Search',
            showingResults: 'Showing results',
            from: 'From',
            viewDetails: 'View details',
            nextPage: 'Next page'
          }
        }
      },
      ru: {
        translation: {
          nav: {
            destinations: 'Направления',
            typeOfRetreat: 'Тип ретрита',
            yogaStyles: 'Стили йоги',
            wishlist: 'Избранное',
            addRetreat: 'Добавить ретрит',
            logout: 'Выйти',
            login: 'Войти',
            createAccount: 'Создать аккаунт'
          },
          home: {
            hero: {
              title: 'Найдите и забронируйте идеальный йога-ретрит',
              subtitle: 'Исследуйте тысячи ретритов по всему миру'
            },
            popularSearches: 'Популярные запросы',
            destinations: 'Направления',
            categories: 'Категории',
            selectDuration: 'Выберите длительность',
            arrivalMonth: 'Месяц прибытия',
            search: 'Искать',
            showingResults: 'Результаты поиска',
            from: 'От',
            viewDetails: 'Подробнее',
            nextPage: 'Следующая страница'
          }
        }
      }
    },
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },
    interpolation: { escapeValue: false }
  })

// Синхронизируем атрибут lang у <html>
i18n.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng
    try { localStorage.setItem('i18nextLng', lng) } catch {}
  }
})

export default i18n