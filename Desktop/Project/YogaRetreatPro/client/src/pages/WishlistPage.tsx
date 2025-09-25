import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Star, MapPin, Calendar, Users, Trash2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'

// Mock data for wishlist retreats
const mockWishlistRetreats = [
  {
    id: 1,
    title: "7 Days Yoga & Meditation Retreat in Bali",
    location: "Ubud, Bali",
    country: "Indonesia",
    price: 899,
    originalPrice: 1299,
    duration: 7,
    rating: 4.8,
    reviewCount: 156,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    features: ["Daily Yoga", "Meditation", "Healthy Meals", "Spa Treatments"],
    dates: "Mar 15-22, 2024",
    instructor: "Sarah Johnson",
    difficulty: "All Levels"
  },
  {
    id: 2,
    title: "10 Days Detox & Wellness Retreat in Costa Rica",
    location: "Manuel Antonio, Costa Rica",
    country: "Costa Rica",
    price: 1599,
    originalPrice: 2199,
    duration: 10,
    rating: 4.9,
    reviewCount: 89,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
    features: ["Detox Program", "Organic Food", "Beach Yoga", "Nature Walks"],
    dates: "Apr 5-15, 2024",
    instructor: "Maria Rodriguez",
    difficulty: "Beginner"
  }
]

const WishlistPage = () => {
  const { user } = useAuth()
  const [wishlistRetreats, setWishlistRetreats] = useState(mockWishlistRetreats)
  const [loading, setLoading] = useState(false)

  const removeFromWishlist = (retreatId: number) => {
    setWishlistRetreats(prev => prev.filter(retreat => retreat.id !== retreatId))
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign in to view your wishlist</h1>
            <p className="text-gray-600 mb-8">
              Save your favorite retreats and access them anytime by signing in to your account.
            </p>
            <div className="space-y-3">
              <Link to="/login">
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" className="w-full">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-200 rounded-lg h-96"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600">
            {wishlistRetreats.length} retreat{wishlistRetreats.length !== 1 ? 's' : ''} saved
          </p>
        </div>

        {wishlistRetreats.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start exploring our amazing retreats and save your favorites to easily find them later.
            </p>
            <Link to="/retreats">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3">
                Explore Retreats
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistRetreats.map((retreat) => (
              <Card key={retreat.id} className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                <div className="relative">
                  <img
                    src={retreat.image}
                    alt={retreat.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={() => removeFromWishlist(retreat.id)}
                    className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                    Save ${retreat.originalPrice - retreat.price}
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{retreat.location}</span>
                  </div>
                  
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                    {retreat.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{retreat.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({retreat.reviewCount} reviews)</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{retreat.duration} days</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{retreat.difficulty}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {retreat.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900">${retreat.price}</span>
                      <span className="text-sm text-gray-500 line-through">${retreat.originalPrice}</span>
                    </div>
                    <Link to={`/retreat/${retreat.id}`}>
                      <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default WishlistPage