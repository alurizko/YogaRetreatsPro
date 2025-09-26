import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MapPin, Calendar, Users, Star, Heart, Share2, Clock, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { fetchRetreatById } from '@/lib/api'

type Instructor = {
  id: string
  first_name?: string | null
  last_name?: string | null
  bio?: string | null
  photo_url?: string | null
}

const RetreatDetailPage = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [retreat, setRetreat] = useState<any>(null)
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    async function load() {
      if (!id) return
      setLoading(true)
      const { data } = await fetchRetreatById(id)
      setRetreat(data)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>
    )
  }

  if (!retreat) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">Retreat not found</div>
    )
  }

  const images: string[] = retreat.images || []
  const mainImage = images[0] || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&h=800&fit=crop'
  const instructors: Instructor[] = (retreat.retreat_instructors || [])
    .map((ri: any) => ri.instructor)
    .filter(Boolean)
  const reviews = retreat.reviews || []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2">
            <img
              src={mainImage}
              alt={retreat.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
            {images.slice(1).map((image: string, index: number) => (
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
                    <span>{retreat.location || ''}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                      <span className="font-medium">{retreat.average_rating ?? '4.9'}</span>
                      <span className="text-gray-500 ml-1">({reviews.length} reviews)</span>
                    </div>
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
                <p className="text-gray-700 leading-relaxed">{retreat.description || 'No description yet.'}</p>
              </CardContent>
            </Card>

            {/* Instructors */}
            {instructors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Instructor</CardTitle>
                  <CardDescription>Meet your guide</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {instructors.map((ins) => (
                      <div key={ins.id} className="flex items-start gap-4">
                        <img
                          src={ins.photo_url || 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2d?w=200&h=200&fit=crop'}
                          alt={(ins.first_name||'') + ' ' + (ins.last_name||'')}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">
                            {[ins.first_name, ins.last_name].filter(Boolean).join(' ')}
                          </div>
                          <p className="text-sm text-gray-700 whitespace-pre-line">{ins.bio || ''}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews ({reviews.length})</CardTitle>
                <CardDescription>What people say about this retreat</CardDescription>
              </CardHeader>
              <CardContent>
                {reviews.length === 0 ? (
                  <div className="text-gray-500">No reviews yet.</div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((rv: any) => (
                      <div key={rv.id} className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{rv.rating ?? rv.overall_rating ?? '5.0'}</span>
                          <span className="text-gray-500 text-sm">{rv.created_at?.slice(0,10)}</span>
                        </div>
                        <div className="text-sm text-gray-800 whitespace-pre-line">{rv.comment || rv.text || ''}</div>
                        {rv.author_name && (
                          <div className="text-xs text-gray-500 mt-2">— {rv.author_name}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-purple-600">
                  ${retreat.price_from || retreat.price || 0}
                </CardTitle>
                <CardDescription>per person</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                    <span>Duration</span>
                  </div>
                  <span className="font-medium">{retreat.duration_days || retreat.duration || 0} days</span>
                </div>

                {retreat.organizer && (
                  <div className="border-t pt-4">
                    <div className="text-sm text-gray-600 mb-2">Organized by</div>
                    <div className="font-medium">{retreat.organizer}</div>
                  </div>
                )}

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
