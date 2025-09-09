import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { MapPin, Calendar, Users, Star, Heart, Share2, Clock, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const RetreatDetailPage = () => {
  const { id } = useParams()
  const [isWishlisted, setIsWishlisted] = useState(false)

  // Mock data - in real app this would be fetched from API
  const retreat = {
    id: 1,
    title: "Bali Sunrise Yoga Retreat",
    location: "Ubud, Bali",
    price: 1299,
    duration: 7,
    difficulty: "Beginner",
    images: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&h=600&fit=crop"
    ],
    rating: 4.9,
    reviews: 124,
    startDate: "2024-03-15",
    endDate: "2024-03-22",
    maxParticipants: 20,
    currentParticipants: 12,
    yogaStyles: ["Hatha", "Vinyasa", "Meditation"],
    organizer: "Sacred Valley Retreats",
    description: "Immerse yourself in the spiritual heart of Bali with our transformative 7-day yoga retreat. Wake up to stunning sunrises over the rice terraces, practice yoga in open-air pavilions, and discover inner peace through meditation and mindfulness.",
    included: [
      "7 nights accommodation in shared rooms",
      "Daily yoga and meditation sessions",
      "All vegetarian meals",
      "Airport transfers",
      "Cultural excursions",
      "Spa treatment"
    ],
    notIncluded: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Additional spa treatments"
    ],
    amenities: [
      "Swimming Pool",
      "Spa",
      "Organic Garden",
      "Library",
      "Wi-Fi",
      "Laundry Service"
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2">
            <img
              src={retreat.images[0]}
              alt={retreat.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
            {retreat.images.slice(1).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${retreat.title} ${index + 2}`}
                className="w-full h-44 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{retreat.title}</h1>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{retreat.location}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                      <span className="font-medium">{retreat.rating}</span>
                      <span className="text-gray-500 ml-1">({retreat.reviews} reviews)</span>
                    </div>
                    <Badge variant="secondary">{retreat.difficulty}</Badge>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
                    Save
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Retreat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{retreat.description}</p>
              </CardContent>
            </Card>

            {/* Yoga Styles */}
            <Card>
              <CardHeader>
                <CardTitle>Yoga Styles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {retreat.yogaStyles.map((style) => (
                    <Badge key={style} variant="outline">
                      {style}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* What's Included */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">What's Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {retreat.included.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Not Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {retreat.notIncluded.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0">×</span>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {retreat.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-purple-600">
                  ${retreat.price}
                </CardTitle>
                <CardDescription>per person</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    <div>
                      <div className="font-medium">Check-in</div>
                      <div className="text-gray-600">{retreat.startDate}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    <div>
                      <div className="font-medium">Check-out</div>
                      <div className="text-gray-600">{retreat.endDate}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                    <span>Duration</span>
                  </div>
                  <span className="font-medium">{retreat.duration} days</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-gray-500" />
                    <span>Availability</span>
                  </div>
                  <span className="font-medium">
                    {retreat.maxParticipants - retreat.currentParticipants} spots left
                  </span>
                </div>

                <div className="border-t pt-4">
                  <div className="text-sm text-gray-600 mb-2">Organized by</div>
                  <div className="font-medium">{retreat.organizer}</div>
                </div>

                <Button className="w-full" size="lg">
                  Book Now
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Free cancellation up to 30 days before the retreat
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RetreatDetailPage
