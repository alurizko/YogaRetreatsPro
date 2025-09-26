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
            createAccount: 'Create account',
            retreats: 'Retreats'
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
            nextPage: 'Next page',
            placeholders: {
              duration: 'Duration',
              month: 'Select month'
            },
            sections: {
              retreatsTitle: 'Retreats',
              wishlistTitle: 'Wishlist'
            },
            gift: {
              title: 'Gift Card: Great for all Occasions',
              desc: 'A Tripaneer gift card is the perfect present for anyone interested in wellness, culture, and adventure. For any journey, near or far, choose between 17,500 experiences worldwide.',
              cta: 'Buy a gift card'
            },
            trust: {
              title: 'Travelers love us, and the feeling is mutual',
              subtitle: 'Over 260k travelers like you have chosen Tripaneer so far. Hear what they have to say about us!',
              trips: 'trips enjoyed through Tripaneer',
              recommend: 'of our customers recommend booking with us',
              reviews: 'verified reviews',
              score: '4.6 star average organizer score'
            }
          }
          ,
          footer: {
            tripaneer: 'Tripaneer',
            contactUs: 'Contact Us',
            aboutUs: 'About us',
            giftCards: 'Gift cards',
            groupTravel: 'Group travel',
            becomePartner: 'Become a Partner',
            affiliateProgram: 'Join the Affiliate Program',
            siteMap: 'Site Map',
            careers: 'Careers',
            customerCare: 'Customer Care',
            termsPrivacy: 'Terms and Privacy',
            otherThemes: 'Our Other Themes',
            recentArticles: 'Recent Blog Articles',
            article1: 'Why Should You Go on a Yoga Retreat in Nature?',
            article2: '2025 International Yoga Day',
            article3: 'My Bali Yoga Retreat Experience',
            article4: 'Top 20 Affordable Yoga Retreats [2025]',
            article5: 'All About Yoga & Surf Retreats',
            company1: "We're the world's leading marketplace to explore and book unforgettable travel experiences.",
            company2: "We love to travel and connect you with local organizers to enrich your life with unforgettable trips.",
            copyright: 'Copyright © 2025 Tripaneer. All rights reserved.'
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
            createAccount: 'Создать аккаунт',
            retreats: 'Ретриты'
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
            nextPage: 'Следующая страница',
            placeholders: {
              duration: 'Длительность',
              month: 'Выберите месяц'
            },
            sections: {
              retreatsTitle: 'Ретриты',
              wishlistTitle: 'Избранное'
            },
            gift: {
              title: 'Подарочная карта: Отлично для любых случаев',
              desc: 'Подарочная карта Tripaneer — идеальный подарок для всех, кто интересуется здоровьем, культурой и приключениями. Для любого путешествия, близкого или далёкого, выберите из 17 500 впечатлений по всему миру.',
              cta: 'Купить подарочную карту'
            },
            trust: {
              title: 'Путешественники любят нас — и это взаимно',
              subtitle: 'Более 260 тысяч путешественников уже выбрали Tripaneer. Узнайте, что они говорят о нас!',
              trips: 'поездок совершено через Tripaneer',
              recommend: 'наших клиентов рекомендуют бронировать у нас',
              reviews: 'подтверждённых отзывов',
              score: 'средняя оценка организаторов — 4.6 звезды'
            }
          }
          ,
          footer: {
            tripaneer: 'Tripaneer',
            contactUs: 'Свяжитесь с нами',
            aboutUs: 'О нас',
            giftCards: 'Подарочные карты',
            groupTravel: 'Групповые поездки',
            becomePartner: 'Стать партнёром',
            affiliateProgram: 'Партнёрская программа',
            siteMap: 'Карта сайта',
            careers: 'Карьера',
            customerCare: 'Поддержка клиентов',
            termsPrivacy: 'Условия и конфиденциальность',
            otherThemes: 'Наши другие проекты',
            recentArticles: 'Недавние статьи в блоге',
            article1: 'Почему стоит поехать на йога-ретрит на природе?',
            article2: 'Всемирный день йоги 2025',
            article3: 'Мой опыт йога-ретрита на Бали',
            article4: 'Топ‑20 доступных йога‑ретритов [2025]',
            article5: 'Всё о йога‑ и серф‑ретритах',
            company1: 'Мы — ведущая площадка для поиска и бронирования незабываемых путешествий.',
            company2: 'Мы любим путешествовать и хотим поделиться этим с вами, соединяя вас с локальными организаторами.',
            copyright: 'Copyright © 2025 Tripaneer. Все права защищены.'
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

// Дополнительные ключи для форм аутентификации
i18n.addResources('en', 'auth', {
  welcomeBack: 'Welcome back!',
  loginSuccessTitle: 'Welcome back!',
  loginSuccessDesc: 'You have successfully logged in.',
  loginFailedTitle: 'Login failed',
  loginFailedDesc: 'Please check your credentials and try again.',
  signinTitle: 'Welcome Back',
  signinSubtitle: 'Sign in to your YogaRetreatPro account',
  emailLabel: 'Email Address',
  emailPlaceholder: 'Enter your email',
  passwordLabel: 'Password',
  passwordPlaceholder: 'Enter your password',
  signingIn: 'Signing In...',
  signIn: 'Sign In',
  noAccount: "Don't have an account?",
  createAccount: 'Create Account'
})

i18n.addResources('ru', 'auth', {
  welcomeBack: 'С возвращением!',
  loginSuccessTitle: 'С возвращением!',
  loginSuccessDesc: 'Вы успешно вошли в систему.',
  loginFailedTitle: 'Не удалось войти',
  loginFailedDesc: 'Проверьте учетные данные и попробуйте снова.',
  signinTitle: 'С возвращением',
  signinSubtitle: 'Войдите в свой аккаунт YogaRetreatPro',
  emailLabel: 'Адрес электронной почты',
  emailPlaceholder: 'Введите ваш email',
  passwordLabel: 'Пароль',
  passwordPlaceholder: 'Введите ваш пароль',
  signingIn: 'Входим...',
  signIn: 'Войти',
  noAccount: 'Нет аккаунта?',
  createAccount: 'Создать аккаунт'
})

// Синхронизируем атрибут lang у <html>
i18n.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng
    try { localStorage.setItem('i18nextLng', lng) } catch {}
  }
})

export default i18n