// src/i18n.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ru: {
        translation: {
          // Ваши переводы
        }
      },
      en: {
        translation: {
          // Ваши переводы
        }
      }
    },
    lng: 'ru',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n