import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Calendar, MapPin, Users, Clock, CreditCard, Download, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Booking {
  id: string
  retreatTitle: string
  location: string
  startDate: string
  endDate: string
  participants: number
  totalPrice: number
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
  image: string
  organizer: string
}

export default function UserBookings() {
  const { t } = useTranslation()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for now
    const mockBookings: Booking[] = [
      {
        id: '1',
        retreatTitle: '7 Day Yoga & Meditation Retreat in Bali',
        location: 'Ubud, Bali, Indonesia',
        startDate: '2024-03-15',
        endDate: '2024-03-22',
        participants: 2,
        totalPrice: 3700,
        status: 'confirmed',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
        organizer: 'Maya Wellness Center'
      },
      {
        id: '2',
        retreatTitle: '5 Day Detox & Wellness Retreat',
        location: 'Tulum, Mexico',
        startDate: '2024-04-10',
        endDate: '2024-04-15',
        participants: 1,
        totalPrice: 2240,
        status: 'pending',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        organizer: 'Tulum Retreat Center'
      },
      {
        id: '3',
        retreatTitle: '10 Day Mindfulness Retreat',
        location: 'Rishikesh, India',
        startDate: '2024-02-01',
        endDate: '2024-02-11',
        participants: 1,
        totalPrice: 1299,
        status: 'completed',
        image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=300&fit=crop',
        organizer: 'Himalayan Yoga Institute'
      }
    ]

    setTimeout(() => {
      setBookings(mockBookings)
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed'
      case 'pending':
        return 'Pending'
      case 'cancelled':
        return 'Cancelled'
      case 'completed':
        return 'Completed'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading your bookings...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage your retreat bookings and view upcoming trips</p>
        </div>

        {bookings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
              <p className="text-gray-600 mb-6">Start your wellness journey by booking your first retreat</p>
              <Button className="bg-orange-500 hover:bg-orange-600">
                Browse Retreats
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden">
                <div className="md:flex">
                  {/* Image */}
                  <div className="md:w-48 h-48 md:h-auto">
                    <img
                      src={booking.image}
                      alt={booking.retreatTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <Badge className={`mb-2 ${getStatusColor(booking.status)}`}>
                          {getStatusText(booking.status)}
                        </Badge>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {booking.retreatTitle}
                        </h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{booking.location}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Organized by {booking.organizer}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          ${booking.totalPrice.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.participants} {booking.participants === 1 ? 'person' : 'people'}
                        </div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium">Check-in</div>
                          <div className="text-sm text-gray-600">
                            {new Date(booking.startDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium">Check-out</div>
                          <div className="text-sm text-gray-600">
                            {new Date(booking.endDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium">Participants</div>
                          <div className="text-sm text-gray-600">
                            {booking.participants} {booking.participants === 1 ? 'person' : 'people'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                      {booking.status === 'confirmed' && (
                        <>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download Voucher
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Contact Organizer
                          </Button>
                        </>
                      )}
                      {booking.status === 'pending' && (
                        <>
                          <Button variant="outline" size="sm">
                            <CreditCard className="w-4 h-4 mr-2" />
                            Complete Payment
                          </Button>
                          <Button variant="outline" size="sm">
                            Cancel Booking
                          </Button>
                        </>
                      )}
                      {booking.status === 'completed' && (
                        <>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download Certificate
                          </Button>
                          <Button variant="outline" size="sm">
                            Write Review
                          </Button>
                        </>
                      )}
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
