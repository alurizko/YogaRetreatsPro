import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, Filter, MapPin, Calendar, Users, Star, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { fetchRetreats } from '@/lib/api'
import { useTranslation } from 'react-i18next'

// Shape from DB (retreats table); simplify typing for now
interface RetreatRow {
  id: string
  title: string
  location?: string | null
  price_from?: number | null
  duration_days?: number | null
  images?: string[] | null
  retreat_instructors?: Array<{ instructor?: { id: string, first_name?: string | null, last_name?: string | null, photo_url?: string | null } | null }>
}

const RetreatsPage = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const [retreats, setRetreats] = useState<RetreatRow[]>([])
  const [filteredRetreats, setFilteredRetreats] = useState<RetreatRow[]>([])
  const [loading, setLoading] = useState(true)

  // Local search form state
  const [retreatQuery, setRetreatQuery] = useState('')
  const [instructorQuery, setInstructorQuery] = useState('')
  const [locationQuery, setLocationQuery] = useState('')
  const [priceMin, setPriceMin] = useState<string>('')
  const [priceMax, setPriceMax] = useState<string>('')
  const [sort, setSort] = useState<'relevance' | 'price_asc' | 'price_desc' | 'created_desc'>('relevance')

  // Get filter parameters from URL
  const destination = searchParams.get('destination')
  const type = searchParams.get('type')
  const style = searchParams.get('style')

  // Load real data from Supabase
  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data, error } = await fetchRetreats({})
      if (!error) {
        setRetreats(data as unknown as RetreatRow[])
      }
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    let filtered = [...retreats]

    if (destination) {
      filtered = filtered.filter(retreat => 
        (retreat.location || '').toLowerCase().includes(destination.toLowerCase())
      )
    }

    setFilteredRetreats(filtered)
  }, [retreats, destination, type, style])

  const getActiveFilters = () => {
    const filters = []
    if (destination) filters.push(`Destination: ${destination}`)
    if (type) filters.push(`Type: ${type}`)
    if (style) filters.push(`Style: ${style}`)
    return filters
  }

  const handleSubmitSearch = async () => {
    setLoading(true)
    const { data, error } = await fetchRetreats({
      search: retreatQuery || undefined,
      instructorName: (instructorQuery || '').trim() ? instructorQuery : (retreatQuery || undefined),
      location: locationQuery || undefined,
      priceMin: priceMin !== '' ? Number(priceMin) : undefined,
      priceMax: priceMax !== '' ? Number(priceMax) : undefined,
      sort: sort !== 'relevance' ? sort : undefined,
    })
    let rows = (data as unknown as RetreatRow[]) || []
    // Client-side instructor name filter
    if (instructorQuery.trim() || retreatQuery.trim()) {
      const q = (instructorQuery.trim() || retreatQuery.trim()).toLowerCase()
      rows = rows.filter(r =>
        (r.retreat_instructors || []).some(ri => {
          const fn = ri.instructor?.first_name?.toLowerCase() || ''
          const ln = ri.instructor?.last_name?.toLowerCase() || ''
          return `${fn} ${ln}`.includes(q) || fn.includes(q) || ln.includes(q)
        })
      )
    }
    if (!error) {
      setRetreats(rows)
      setFilteredRetreats(rows)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t('retreatsPage.title')}
          </h1>
          
          {/* Active Filters */}
          {getActiveFilters().length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">{t('retreatsPage.activeFilters')}</p>
              <div className="flex flex-wrap gap-2">
                {getActiveFilters().map((filter, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800"
                  >
                    {filter}
                  </span>
                ))}
              </div>
            </div>
          )}

          <p className="text-gray-600">
            {t('retreatsPage.found', { count: filteredRetreats.length })}
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Retreat keyword */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={retreatQuery}
                  onChange={(e) => setRetreatQuery(e.target.value)}
                  placeholder={t('retreatsPage.placeholders.retreat')}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Instructor */}
            <input
              type="text"
              value={instructorQuery}
              onChange={(e) => setInstructorQuery(e.target.value)}
              placeholder={t('retreatsPage.placeholders.instructor')}
              className="w-full pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />

            {/* Location */}
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              placeholder={t('retreatsPage.placeholders.location')}
              className="w-full pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />

            {/* Price range */}
            <div className="flex gap-2">
              <input
                type="number"
                min={0}
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                placeholder={t('retreatsPage.placeholders.priceMin')}
                className="w-full pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <input
                type="number"
                min={0}
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                placeholder={t('retreatsPage.placeholders.priceMax')}
                className="w-full pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Sort */}
            <select
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
            >
              <option value="relevance">{t('retreatsPage.sort.relevance')}</option>
              <option value="price_asc">{t('retreatsPage.sort.priceAsc')}</option>
              <option value="price_desc">{t('retreatsPage.sort.priceDesc')}</option>
              <option value="created_desc">{t('retreatsPage.sort.newest')}</option>
            </select>

            {/* Submit */}
            <div className="md:col-span-1 flex items-stretch">
              <Button onClick={handleSubmitSearch} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                {t('retreatsPage.submit')}
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRetreats.map((retreat) => (
            <div key={retreat.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
              <Link to={`/retreats/${retreat.id}`} className="block">
                <div className="relative">
                  <img
                    src={retreat.images?.[0] || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop'}
                    alt={retreat.title}
                    className="w-full h-48 object-cover"
                  />
                  <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50">
                    <Heart className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </Link>
              
              <div className="p-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <MapPin className="h-4 w-4" />
                  {retreat.location || ''}
                </div>
                
                <Link to={`/retreats/${retreat.id}`} className="hover:text-orange-600">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {retreat.title}
                  </h3>
                </Link>

                {/* Instructor pill */}
                {retreat.retreat_instructors && retreat.retreat_instructors[0]?.instructor && (
                  <div className="flex items-center gap-2 mb-3">
                    <img
                      src={retreat.retreat_instructors[0].instructor!.photo_url || 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2d?w=80&h=80&fit=crop'}
                      alt="instructor"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-sm text-gray-700">
                      {[retreat.retreat_instructors[0].instructor!.first_name, retreat.retreat_instructors[0].instructor!.last_name].filter(Boolean).join(' ')}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {(retreat.duration_days || 0)} days
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    4.9 (23)
                  </div>
                </div>
                
                {/* Optional feature tags could be rendered here when available */}
                <div className="mb-3" />
                
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">
                      ${retreat.price_from || 0}
                    </span>
                    <span className="text-sm text-gray-600 ml-1">
                      / {(retreat.duration_days || 0)} days
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    12 interested
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRetreats.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('common.noResults')}
            </h3>
            <p className="text-gray-600">
              {t('retreatsPage.emptyHint')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RetreatsPage

