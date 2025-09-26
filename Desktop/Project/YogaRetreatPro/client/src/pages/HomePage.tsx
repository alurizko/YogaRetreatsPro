import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Star, MapPin, Calendar, Users, Heart, Gift, Shield, Clock, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { fetchRetreats } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

const HomePage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user } = useAuth()
  const [searchDuration, setSearchDuration] = useState('')
  const [searchMonth, setSearchMonth] = useState('')
  const [featuredRetreats, setFeaturedRetreats] = useState([])
  const [loading, setLoading] = useState(true)

  // Получаем данные из Supabase при загрузке компонента
  useEffect(() => {
    async function loadRetreats() {
      try {
        const { data, error } = await fetchRetreats({ featured: true, limit: 9 })
        if (error) {
          console.error('Error fetching retreats:', error)
        } else {
          setFeaturedRetreats(data)
        }
      } catch (error) {
        console.error('Error fetching retreats:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadRetreats()
  }, [])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchDuration) params.append('duration', searchDuration)
    if (searchMonth) params.append('month', searchMonth)
    navigate(`/retreats?${params.toString()}`)
  }

  // Popular sections replaced with direct actions per requirements

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

        {/* Popular Actions */}
        <div className="mb-12">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">{t('home.popularSearches')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Retreats quick access */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">{t('home.sections.retreatsTitle')}</h4>
                <Link to="/retreats">
                  <Button variant="outline" size="sm" className="text-sm">
                    {t('nav.retreats')}
                  </Button>
                </Link>
              </div>

              {/* Wishlist or Login dropdown */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">{t('home.sections.wishlistTitle')}</h4>
                {user ? (
                  <Link to="/wishlist">
                    <Button variant="outline" size="sm" className="text-sm">
                      {t('nav.wishlist')}
                    </Button>
                  </Link>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="text-sm">
                        {t('nav.login')}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
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
            </div>
          </div>
        </div>

        {/* Search Filters */}
        <div className="mb-12">
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('home.selectDuration')}
                </label>
                <Select value={searchDuration} onValueChange={setSearchDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('home.placeholders.duration')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2-days">2 days</SelectItem>
                    <SelectItem value="3-7-days">From 3 to 7 days</SelectItem>
                    <SelectItem value="1-2-weeks">From 1 to 2 weeks</SelectItem>
                    <SelectItem value="2-weeks-plus">More than 2 weeks</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('home.arrivalMonth')}
                </label>
                <Select value={searchMonth} onValueChange={setSearchMonth}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('home.placeholders.month')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025-09">2025 September</SelectItem>
                    <SelectItem value="2025-10">2025 October</SelectItem>
                    <SelectItem value="2025-11">2025 November</SelectItem>
                    <SelectItem value="2025-12">2025 December</SelectItem>
                    <SelectItem value="2026-01">2026 January</SelectItem>
                    <SelectItem value="2026-02">2026 February</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button onClick={handleSearch} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  <Search className="w-4 h-4 mr-2" />
                  {t('home.search')}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('home.showingResults')}</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="text-lg text-gray-600">Loading retreats...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRetreats.map((retreat) => (
                <Card key={retreat.id} className="overflow-hidden hover:shadow-lg transition-shadow border-0 shadow-md">
                  <div className="relative">
                    <div className="aspect-[4/3] bg-gray-200">
                      <img
                        src={retreat.images?.[0] || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop'}
                        alt={retreat.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                      <Heart className="w-4 h-4 text-gray-600" />
                    </button>
                    <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded text-sm font-medium">
                      {retreat.location}
                    </div>
                    <div className="absolute bottom-3 left-3 bg-white px-2 py-1 rounded text-sm text-gray-600">
                      12 interested
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-sm font-medium">4.9</span>
                        <span className="text-sm text-gray-500 ml-1">(23)</span>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 leading-tight">
                      {retreat.title}
                    </h3>
                    
                    <div className="space-y-1 mb-4">
                      <div className="text-sm text-gray-600">
                        Airport transfer available
                      </div>
                      <div className="text-sm text-gray-600">
                        All meals included
                      </div>
                      <div className="text-sm text-gray-600">
                        Instructed in English
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>1 person</span>
                        <span>{retreat.duration_days || 7} days</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm text-gray-500">{t('home.from')}</span>
                          <div className="text-xl font-bold text-gray-900">
                            US$ {(retreat.price_from || 0).toLocaleString()}
                          </div>
                        </div>
                        <Link to={`/retreat/${retreat.id}`}>
                          <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                            {t('home.viewDetails')}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {/* Pagination */}
          <div className="flex justify-center mt-8 space-x-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((page) => (
              <Button
                key={page}
                variant={page === 1 ? "default" : "outline"}
                size="sm"
                className={page === 1 ? "bg-orange-500 hover:bg-orange-600" : ""}
              >
                {page}
              </Button>
            ))}
            <Button variant="outline" size="sm">{t('home.nextPage')}</Button>
          </div>
        </div>

        {/* Gift Card Section */}
        <div className="mb-12">
          <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">{t('home.gift.title')}</h2>
              <p className="text-lg mb-6 opacity-90">
                {t('home.gift.desc')}
              </p>
              <Button variant="secondary" size="lg" className="text-purple-600">
                {t('home.gift.cta')}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Trust Section */}
        <div className="mb-12">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                {t('home.trust.title')}
              </h2>
              <p className="text-center text-gray-600 mb-8">
                {t('home.trust.subtitle')}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-orange-500 mb-2">300,000+</div>
                  <div className="text-gray-600">{t('home.trust.trips')}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-500 mb-2">93%</div>
                  <div className="text-gray-600">{t('home.trust.recommend')}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-500 mb-2">84,000+</div>
                  <div className="text-gray-600">{t('home.trust.reviews')}<br/>{t('home.trust.score')}</div>
                </div>
              </div>
              
              <div className="mt-8 text-center text-gray-600">
                <p>
                  {t('footer.company1')}
                </p>
                <p className="mt-4">
                  {t('footer.company2')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default HomePage