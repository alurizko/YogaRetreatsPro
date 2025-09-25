// client/src/contexts/LanguageContext.tsx
import { createContext, useState, useContext, ReactNode } from 'react'

interface LanguageContextType {
  language: string
  setLanguage: (lang: string) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState('ru')

  const translations = {
    ru: {
      // Навигация
      home: 'Главная',
      retreats: 'Ретриты',
      destinations: 'Направления',
      about: 'О нас',
      contact: 'Контакты',
      
      // Хедер
      wishlist: 'Избранное',
      addRetreat: 'Добавить ретрит',
      login: 'Войти',
      createAccount: 'Создать аккаунт',
      logout: 'Выйти',
      
      // Футер
      contactUs: 'Связаться с нами',
      aboutUs: 'О нас',
      giftCards: 'Подарочные карты',
      groupTravel: 'Групповые поездки',
      partners: 'Стать партнером',
      affiliates: 'Партнерская программа',
      siteMap: 'Карта сайта',
      careers: 'Карьера',
      customerCare: 'Поддержка',
      termsAndPrivacy: 'Условия и конфиденциальность',
      
      // Блог
      recentBlogArticles: 'Последние статьи',
      copyright: '© 2024 YogaRetreatPro. Все права защищены.'
    },
    en: {
      // Navigation
      home: 'Home',
      retreats: 'Retreats',
      destinations: 'Destinations',
      about: 'About',
      contact: 'Contact',
      
      // Header
      wishlist: 'Wishlist',
      addRetreat: 'Add Retreat',
      login: 'Login',
      createAccount: 'Create Account',
      logout: 'Logout',
      
      // Footer
      contactUs: 'Contact Us',
      aboutUs: 'About us',
      giftCards: 'Gift cards',
      groupTravel: 'Group travel',
      partners: 'Become a Partner',
      affiliates: 'Join the Affiliate Program',
      siteMap: 'Site Map',
      careers: 'Careers',
      customerCare: 'Customer Care',
      termsAndPrivacy: 'Terms and Privacy',
      
      // Blog
      recentBlogArticles: 'Recent Blog Articles',
      copyright: '© 2024 YogaRetreatPro. All rights reserved.'
    }
  }

  const t = (key: string) => {
    return translations[language as keyof typeof translations]?.[key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}