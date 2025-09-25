import { useTranslation } from 'react-i18next'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ru' ? 'en' : 'ru'
    i18n.changeLanguage(newLang)
  }

  const currentLang = i18n.language || 'en'
  const displayText = currentLang === 'ru' ? 'RU Русский' : 'EN English'

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors border border-gray-300 rounded hover:border-orange-500"
    >
      🌐 {displayText}
    </button>
  )
}