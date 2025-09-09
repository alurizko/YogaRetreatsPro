import { Link } from 'react-router-dom'
import { Search, MapPin, Calendar, Users, Star, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const HomePage = () => {
  const featuredRetreats = [
    {
      id: 1,
      title: "Bali Sunrise Yoga Retreat",
      location: "Ubud, Bali",
      price: 1299,
      duration: 7,
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
      rating: 4.9,
      reviews: 124
    },
    {
      id: 2,
      title: "Costa Rica Jungle Wellness",
      location: "Manuel Antonio, Costa Rica",
      price: 1599,
      duration: 10,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      rating: 4.8,
      reviews: 89
    },
    {
      id: 3,
      title: "Himalayan Mountain Retreat",
      location: "Rishikesh, India",
      price: 899,
      duration: 14,
      image: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=300&fit=crop",
      rating: 4.7,
      reviews: 156
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect
              <span className="block">Yoga Retreat</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Discover transformative yoga experiences in breathtaking destinations around the world
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/search">
                <Button size="lg" variant="secondary" className="text-purple-600">
                  <Search className="w-5 h-5 mr-2" />
                  Explore Retreats
                </Button>
              </Link>
              <Link to="/add-retreat">
                <Button size="lg" variant="secondary" className="text-purple-600">
                  List Your Retreat
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose YogaRetreatPro?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We make it easy to find and book the perfect yoga retreat for your journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Global Destinations</h3>
              <p className="text-gray-600">
                Discover retreats in stunning locations worldwide, from tropical beaches to mountain sanctuaries
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Teachers</h3>
              <p className="text-gray-600">
                Learn from certified yoga instructors and wellness experts with years of experience
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Booking</h3>
              <p className="text-gray-600">
                Easy booking process with flexible dates and secure payment options
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Retreats */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Retreats</h2>
              <p className="text-lg text-gray-600">
                Handpicked experiences for your wellness journey
              </p>
            </div>
            <Link to="/search">
              <Button variant="outline">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredRetreats.map((retreat) => (
              <Card key={retreat.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200">
                  <img
                    src={retreat.image}
                    alt={retreat.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{retreat.title}</CardTitle>
                  <CardDescription className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {retreat.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium">{retreat.rating}</span>
                      <span className="text-sm text-gray-500 ml-1">({retreat.reviews} reviews)</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {retreat.duration} days
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold text-purple-600">
                      ${retreat.price}
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
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8">
            Join thousands of others who have transformed their lives through yoga retreats
          </p>
          <Link to="/search">
            <Button size="lg" variant="secondary" className="text-purple-600">
              Find Your Retreat Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage
