import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, Filter, MapPin, Calendar, Users, Star, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { fetchRetreats } from '@/lib/api'

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
  const [searchParams] = useSearchParams()
  const [retreats, setRetreats] = useState<RetreatRow[]>([])
  const [filteredRetreats, setFilteredRetreats] = useState<RetreatRow[]>([])
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading retreats...</p>
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
            Find Your Perfect Retreat
          </h1>
          
          {/* Active Filters */}
          {getActiveFilters().length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Active filters:</p>
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
            {filteredRetreats.length} retreat{filteredRetreats.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search retreats..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
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
              No retreats found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or browse all retreats.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RetreatsPage
