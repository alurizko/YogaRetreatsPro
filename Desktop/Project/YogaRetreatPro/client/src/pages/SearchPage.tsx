import { useState } from 'react'
import { Search, Filter, MapPin, Calendar, Users, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    country: '',
    difficulty: '',
    priceRange: '',
    duration: ''
  })

  // Mock data - in real app this would come from API
  const retreats = [
    {
      id: 1,
      title: "Bali Sunrise Yoga Retreat",
      location: "Ubud, Bali",
      country: "Indonesia",
      price: 1299,
      duration: 7,
      difficulty: "Beginner",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
      rating: 4.9,
      reviews: 124,
      startDate: "2024-03-15",
      maxParticipants: 20,
      yogaStyles: ["Hatha", "Vinyasa"]
    },
    {
      id: 2,
      title: "Costa Rica Jungle Wellness",
      location: "Manuel Antonio, Costa Rica",
      country: "Costa Rica",
      price: 1599,
      duration: 10,
      difficulty: "Intermediate",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      rating: 4.8,
      reviews: 89,
      startDate: "2024-04-01",
      maxParticipants: 15,
      yogaStyles: ["Vinyasa", "Yin"]
    },
    {
      id: 3,
      title: "Himalayan Mountain Retreat",
      location: "Rishikesh, India",
      country: "India",
      price: 899,
      duration: 14,
      difficulty: "Advanced",
      image: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=300&fit=crop",
      rating: 4.7,
      reviews: 156,
      startDate: "2024-05-10",
      maxParticipants: 12,
      yogaStyles: ["Ashtanga", "Meditation"]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Perfect Retreat</h1>
          <p className="text-lg text-gray-600">
            Discover yoga retreats that match your preferences and goals
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search destinations, styles, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <select
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={filters.country}
              onChange={(e) => setFilters({...filters, country: e.target.value})}
            >
              <option value="">All Countries</option>
              <option value="Indonesia">Indonesia</option>
              <option value="Costa Rica">Costa Rica</option>
              <option value="India">India</option>
              <option value="Thailand">Thailand</option>
            </select>

            <select
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={filters.difficulty}
              onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            <Button className="flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Refine Your Search</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Price Range</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="radio" name="price" className="mr-2" />
                      <span className="text-sm">Under $1,000</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="price" className="mr-2" />
                      <span className="text-sm">$1,000 - $1,500</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="price" className="mr-2" />
                      <span className="text-sm">$1,500+</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Duration</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">3-7 days</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">8-14 days</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">15+ days</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Yoga Styles</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">Hatha</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">Vinyasa</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">Ashtanga</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">Yin</span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-gray-600">{retreats.length} retreats found</p>
              <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                <option>Sort by: Relevance</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating</option>
                <option>Duration</option>
              </select>
            </div>

            {retreats.map((retreat) => (
              <Card key={retreat.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img
                      src={retreat.image}
                      alt={retreat.title}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold">{retreat.title}</h3>
                      <Badge variant="secondary">{retreat.difficulty}</Badge>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{retreat.location}</span>
                    </div>

                    <div className="flex items-center mb-4">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium">{retreat.rating}</span>
                      <span className="text-sm text-gray-500 ml-1">({retreat.reviews} reviews)</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {retreat.yogaStyles.map((style) => (
                        <Badge key={style} variant="outline" className="text-xs">
                          {style}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-2xl font-bold text-purple-600">
                          ${retreat.price}
                        </div>
                        <div className="text-sm text-gray-500">
                          {retreat.duration} days
                        </div>
                      </div>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm">
                          Save
                        </Button>
                        <Button size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchPage
