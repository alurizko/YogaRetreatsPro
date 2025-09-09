import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MapPin, Calendar, Star, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      title: "Bali Sunrise Yoga Retreat",
      location: "Ubud, Bali",
      price: 1299,
      duration: 7,
      difficulty: "Beginner",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
      rating: 4.9,
      reviews: 124,
      startDate: "2024-03-15"
    },
    {
      id: 2,
      title: "Costa Rica Jungle Wellness",
      location: "Manuel Antonio, Costa Rica",
      price: 1599,
      duration: 10,
      difficulty: "Intermediate",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      rating: 4.8,
      reviews: 89,
      startDate: "2024-04-01"
    }
  ])

  const removeFromWishlist = (id: number) => {
    setWishlistItems(items => items.filter(item => item.id !== id))
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">Start exploring and save retreats you love</p>
          <Link to="/search">
            <Button>Explore Retreats</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Wishlist</h1>
          <p className="text-lg text-gray-600">
            {wishlistItems.length} saved retreat{wishlistItems.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((retreat) => (
            <Card key={retreat.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={retreat.image}
                  alt={retreat.title}
                  className="w-full h-48 object-cover"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  onClick={() => removeFromWishlist(retreat.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{retreat.title}</CardTitle>
                  <Badge variant="secondary">{retreat.difficulty}</Badge>
                </div>
                <CardDescription className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {retreat.location}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center mb-4">
                  <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                  <span className="text-sm font-medium">{retreat.rating}</span>
                  <span className="text-sm text-gray-500 ml-1">({retreat.reviews} reviews)</span>
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Starts {retreat.startDate}</span>
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
                  <Link to={`/retreat/${retreat.id}`}>
                    <Button size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default WishlistPage
