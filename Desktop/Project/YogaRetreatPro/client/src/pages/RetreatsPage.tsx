import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Filter, MapPin, Calendar, Users, Star, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Retreat {
  id: number
  title: string
  location: string
  price: number
  duration: number
  image: string
  rating: number
  reviews: number
  interested: number
  features: string[]
  type?: string
  style?: string
}

const RetreatsPage = () => {
  const [searchParams] = useSearchParams()
  const [retreats, setRetreats] = useState<Retreat[]>([])
  const [filteredRetreats, setFilteredRetreats] = useState<Retreat[]>([])
  const [loading, setLoading] = useState(true)

  // Get filter parameters from URL
  const destination = searchParams.get('destination')
  const type = searchParams.get('type')
  const style = searchParams.get('style')

  // Mock data - in real app this would come from API
  const allRetreats: Retreat[] = [
    {
      id: 1,
      title: "8 Day Spirit Awakening with Ayahuasca and Cacao in Puerto Viejo de Talamanca",
      location: "Costa Rica",
      price: 3350,
      duration: 8,
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
      rating: 4.9,
      reviews: 23,
      interested: 12,
      features: ["Airport transfer available", "All meals included", "Instructed in English"],
      type: "Spiritual Retreat",
      style: "Meditation"
    },
    {
      id: 2,
      title: "5 Day Yoga Retreat in Tulum Caribbean Beach, Discovering the Magical Sacred Mayan Cenotes in Mexico",
      location: "Mexico",
      price: 2240,
      duration: 5,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      rating: 4.9,
      reviews: 23,
      interested: 5,
      features: ["Airport transfer available", "All meals included", "Instructed in English"],
      type: "Yoga Retreat",
      style: "Vinyasa Flow"
    },
    {
      id: 3,
      title: "4 Day Revive and Thrive: Serene Caribbean Healing Haven in Samana, Dominican Republic",
      location: "Dominican Republic",
      price: 1100,
      duration: 4,
      image: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=300&fit=crop",
      rating: 4.9,
      reviews: 44,
      interested: 6,
      features: ["Airport transfer available", "All meals included", "Vegetarian friendly", "Instructed in English"],
      type: "Wellness Retreat",
      style: "Restorative Yoga"
    },
    {
      id: 4,
      title: "7 Day Hatha Yoga and Meditation Retreat in Rishikesh, India",
      location: "India",
      price: 899,
      duration: 7,
      image: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=300&fit=crop",
      rating: 4.8,
      reviews: 156,
      interested: 23,
      features: ["All meals included", "Vegetarian friendly", "Instructed in English", "Yoga certification"],
      type: "Yoga Retreat",
      style: "Hatha Yoga"
    },
    {
      id: 5,
      title: "10 Day Vinyasa Flow Retreat in Ubud, Bali with Sacred Temples Tour",
      location: "Indonesia",
      price: 1850,
      duration: 10,
      image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop",
      rating: 4.9,
      reviews: 89,
      interested: 18,
      features: ["Airport transfer available", "All meals included", "Cultural activities", "Instructed in English"],
      type: "Yoga Retreat",
      style: "Vinyasa Flow"
    },
    {
      id: 6,
      title: "6 Day Detox and Wellness Retreat in Algarve, Portugal",
      location: "Portugal",
      price: 1450,
      duration: 6,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      rating: 4.7,
      reviews: 67,
      interested: 14,
      features: ["Spa treatments included", "All meals included", "Organic food", "Instructed in English"],
      type: "Detox Retreat",
      style: "Yin Yoga"
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRetreats(allRetreats)
      setLoading(false)
    }, 500)
  }, [])

  useEffect(() => {
    let filtered = [...retreats]

    if (destination) {
      filtered = filtered.filter(retreat => 
        retreat.location.toLowerCase().includes(destination.toLowerCase())
      )
    }

    if (type) {
      filtered = filtered.filter(retreat => 
        retreat.type?.toLowerCase().includes(type.toLowerCase())
      )
    }

    if (style) {
      filtered = filtered.filter(retreat => 
        retreat.style?.toLowerCase().includes(style.toLowerCase())
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
              <div className="relative">
                <img
                  src={retreat.image}
                  alt={retreat.title}
                  className="w-full h-48 object-cover"
                />
                <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50">
                  <Heart className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              
              <div className="p-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <MapPin className="h-4 w-4" />
                  {retreat.location}
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {retreat.title}
                </h3>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {retreat.duration} days
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {retreat.rating} ({retreat.reviews})
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {retreat.features.slice(0, 2).map((feature, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">
                      ${retreat.price}
                    </span>
                    <span className="text-sm text-gray-600 ml-1">
                      / {retreat.duration} days
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    {retreat.interested} interested
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
