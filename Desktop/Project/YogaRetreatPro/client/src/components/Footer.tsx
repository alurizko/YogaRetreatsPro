import { Link } from 'react-router-dom'
import { Facebook, Instagram, Youtube, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

const Footer = () => {
  const { t } = useTranslation()
  return (
    <footer className="bg-gray-50 text-gray-700 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Tripaneer Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">{t('footer.tripaneer')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/customer-service" className="text-gray-600 hover:text-orange-500 transition-colors">
                  {t('footer.contactUs')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-orange-500 transition-colors">
                  {t('footer.aboutUs')}
                </Link>
              </li>
              <li>
                <Link to="/gift-cards" className="text-gray-600 hover:text-orange-500 transition-colors">
                  {t('footer.giftCards')}
                </Link>
              </li>
              <li>
                <Link to="/group-travel" className="text-gray-600 hover:text-orange-500 transition-colors">
                  {t('footer.groupTravel')}
                </Link>
              </li>
              <li>
                <Link to="/partners" className="text-gray-600 hover:text-orange-500 transition-colors">
                  {t('footer.becomePartner')}
                </Link>
              </li>
              <li>
                <Link to="/affiliates" className="text-gray-600 hover:text-orange-500 transition-colors">
                  {t('footer.affiliateProgram')}
                </Link>
              </li>
              <li>
                <Link to="/site-map" className="text-gray-600 hover:text-orange-500 transition-colors">
                  {t('footer.siteMap')}
                </Link>
              </li>
              <li>
                <a href="https://tripaneer.recruitee.com/" className="text-gray-600 hover:text-orange-500 transition-colors">
                  {t('footer.careers')}
                </a>
              </li>
              <li>
                <Link to="/customer-service" className="text-gray-600 hover:text-orange-500 transition-colors">
                  {t('footer.customerCare')}
                </Link>
              </li>
              <li>
                <Link to="/terms-and-privacy" className="text-gray-600 hover:text-orange-500 transition-colors">
                  {t('footer.termsPrivacy')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Other Themes */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">{t('footer.otherThemes')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://www.tripaneer.com" className="text-gray-600 hover:text-orange-500 transition-colors">
                  Tripaneer
                </a>
              </li>
              <li>
                <a href="https://www.booksurfcamps.com" className="text-gray-600 hover:text-orange-500 transition-colors">
                  BookSurfCamps
                </a>
              </li>
              <li>
                <a href="https://www.bookhorseridingholidays.com" className="text-gray-600 hover:text-orange-500 transition-colors">
                  BookHorseRidingHolidays
                </a>
              </li>
              <li>
                <a href="https://www.bookyogateachertraining.com" className="text-gray-600 hover:text-orange-500 transition-colors">
                  BookYogaTeacherTraining
                </a>
              </li>
              <li>
                <a href="https://www.bookallsafaris.com" className="text-gray-600 hover:text-orange-500 transition-colors">
                  BookAllSafaris
                </a>
              </li>
            </ul>
          </div>

          {/* Recent Blog Articles */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              <Link to="/news" className="hover:text-orange-500 transition-colors">
                {t('footer.recentArticles')}
              </Link>
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/news/yoga-retreats-nature" className="text-gray-600 hover:text-orange-500 transition-colors">
                  {t('footer.article1')}
                </Link>
              </li>
              <li>
                <Link to="/news/international-yoga-day-2025" className="text-gray-600 hover:text-orange-500 transition-colors">
                  {t('footer.article2')}
                </Link>
              </li>
              <li>
                <Link to="/news/yoga-retreat-experience" className="text-gray-600 hover:text-orange-500 transition-colors">
                  {t('footer.article3')}
                </Link>
              </li>
              <li>
                <Link to="/news/affordable-yoga-retreats" className="text-gray-600 hover:text-orange-500 transition-colors">
                  {t('footer.article4')}
                </Link>
              </li>
              <li>
                <Link to="/news/yoga-surf-retreats" className="text-gray-600 hover:text-orange-500 transition-colors">
                  {t('footer.article5')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Description */}
          <div>
            <p className="text-sm text-gray-600 mb-4">
              {t('footer.company1')}
            </p>
            <p className="text-sm text-gray-600 mb-6">
              {t('footer.company2')}
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/book_yoga_retreats/" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/bookyogaretreats" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.youtube.com/bookyogaretreats" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="https://www.tiktok.com/@bookyogaretreats" className="text-gray-400 hover:text-orange-500 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              {t('footer.copyright')}
            </p>
          </div>
        </div>

        {/* Кнопка прокрутки вверх */}
        <div className="fixed bottom-8 right-8 z-50">
          <Button
            variant="default"
            size="sm"
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <ChevronUp className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </footer>
  )
}

export default Footer