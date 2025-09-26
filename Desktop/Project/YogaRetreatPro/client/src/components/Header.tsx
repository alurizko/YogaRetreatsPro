import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Menu, X, User, Heart, Plus, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useAuth } from '@/contexts/AuthContext'
import { LanguageSwitcher } from './LanguageSwitcher'
import HeroVideo from '@/components/HeroVideo'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const { user, logout } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  // Закрываем меню при изменении маршрута
  useEffect(() => {
    setIsMenuOpen(false)
    setActiveDropdown(null)
  }, [navigate])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const destinations = [
    { name: 'Bali, Indonesia', count: 245 },
    { name: 'Costa Rica', count: 189 },
    { name: 'India', count: 167 },
    { name: 'Thailand', count: 134 },
    { name: 'Mexico', count: 98 },
    { name: 'Portugal', count: 76 },
    { name: 'Greece', count: 65 },
    { name: 'Italy', count: 54 }
  ]

  const retreatTypes = [
    { name: 'Yoga Retreat', count: 456 },
    { name: 'Wellness Retreat', count: 234 },
    { name: 'Meditation Retreat', count: 189 },
    { name: 'Detox Retreat', count: 123 },
    { name: 'Spiritual Retreat', count: 98 },
    { name: 'Women\'s Retreat', count: 87 },
    { name: 'Adventure Retreat', count: 65 },
    { name: 'Luxury Retreat', count: 43 }
  ]

  const yogaStyles = [
    { name: 'Hatha Yoga', count: 234 },
    { name: 'Vinyasa Flow', count: 189 },
    { name: 'Ashtanga Yoga', count: 156 },
    { name: 'Yin Yoga', count: 134 },
    { name: 'Kundalini Yoga', count: 98 },
    { name: 'Restorative Yoga', count: 76 },
    { name: 'Hot Yoga', count: 54 },
    { name: 'Iyengar Yoga', count: 43 }
  ]

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown)
  }

  const closeAllDropdowns = () => {
    setActiveDropdown(null)
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">Y</span>
            </div>
            <span className="text-xl font-bold text-gray-900">YogaRetreatPro</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/retreats" className="text-gray-700 hover:text-orange-500 transition-colors flex items-center">
              {t('nav.retreats')}
            </Link>
          </nav>

          {/* Right side - Currency and Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-gray-700 font-medium"></div>
            <LanguageSwitcher />
            {user ? (
              <>
                <Link to="/wishlist">
                  <Button variant="ghost" size="sm">
                    <Heart className="w-4 h-4 mr-2" />
                    {t('nav.wishlist')}
                  </Button>
                </Link>
                <Link to="/add-retreat">
                  <Button variant="ghost" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    {t('nav.addRetreat')}
                  </Button>
                </Link>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm text-gray-700">{user.email}</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  {t('nav.logout')}
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-gray-700 hover:text-orange-500">
                    {t('nav.login')}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/login">{t('nav.login')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/register">{t('nav.createAccount')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/wishlist">{t('nav.wishlist')}</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link
                to="/retreats"
                className="text-gray-700 hover:text-orange-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.retreats')}
              </Link>
              {user ? (
                <>
                  <Link
                    to="/wishlist"
                    className="text-gray-700 hover:text-orange-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.wishlist')}
                  </Link>
                  <Link
                    to="/add-retreat"
                    className="text-gray-700 hover:text-orange-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.addRetreat')}
                  </Link>
                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-600 mb-2">Hello, {user.email}!</p>
                    <Button variant="outline" size="sm" onClick={handleLogout} className="w-full">
                      {t('nav.logout')}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="pt-2 border-t space-y-2">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full">
                      {t('nav.login')}
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button size="sm" className="w-full bg-orange-500 hover:bg-orange-600">
                      {t('nav.createAccount')}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Hero video only on home page */}
      {isHome && (
        <div className="pt-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <HeroVideo />
          </div>
        </div>
      )}
    </header>
  )
}

export default memo(Header)