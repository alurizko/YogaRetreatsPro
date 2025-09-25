import { useLanguage } from '@/contexts/LanguageContext'

const LanguageTest = () => {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className="p-4 border">
      <p>Current language: {language}</p>
      <button 
        onClick={() => setLanguage('ru')}
        className="mr-2 px-3 py-1 bg-blue-500 text-white rounded"
      >
        RU
      </button>
      <button 
        onClick={() => setLanguage('en')}
        className="px-3 py-1 bg-blue-500 text-white rounded"
      >
        EN
      </button>
      <p className="mt-2">Translated text: {t('home')}</p>
    </div>
  )
}

export default LanguageTest