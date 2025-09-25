// src/components/RetreatDetail.tsx
import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Star, MapPin, Calendar, Users, Heart, Share2, Clock, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { supabase } from '@/utils/supabase'

interface Retreat {
  id: string
  title: string
  description: string
  location: string
  price: number
  duration: number
  image_url: string
  rating: number
  reviews: number
  created_at: string
  updated_at: string
}

export default function RetreatDetail() {
  const { id } = useParams()
  const { t } = useTranslation()
  const [retreat, setRetreat] = useState<Retreat | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRetreat() {
      try {
        if (!id) throw new Error('Missing retreat id')
        const { data, error } = await supabase
          .from('retreats')
          .select('*')
          .eq('id', id)
          .single()

        if (error || !data) throw error || new Error('Not found')

        // Приводим к форме интерфейса компонента
        const mapped: Retreat = {
          id: data.id,
          title: data.title,
          description: data.description ?? '',
          location: data.location ?? '',
          price: data.price_from ?? 0,
          duration: data.duration_days ?? 0,
          image_url: Array.isArray(data.images) && data.images.length > 0 ? data.images[0] : '',
          rating: 0,
          reviews: 0,
          created_at: data.created_at,
          updated_at: data.updated_at,
        }

        setRetreat(mapped)
      } catch (err) {
        console.error('Error fetching retreat:', err)
        setError('Failed to load retreat details')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchRetreat()
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading retreat details...</div>
      </div>
    )
  }

  if (error || !retreat) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">{error || 'Retreat not found'}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gray-900">
        <img
          src={retreat.image_url}
          alt={retreat.title}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="absolute bottom-8 left-8 text-white">
          <h1 className="text-4xl font-bold mb-2">{retreat.title}</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-1" />
              <span>{retreat.location}</span>
            </div>
            <div className="flex items-center">
              <Star className="w-5 h-5 mr-1 text-yellow-400 fill-current" />
              <span>{retreat.rating} ({retreat.reviews} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">About This Retreat</h2>
                <p className="text-gray-600 leading-relaxed">{retreat.description}</p>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                    <span>{retreat.duration} days retreat</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-gray-400" />
                    <span>Max 12 people</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-gray-400" />
                    <span>Daily yoga sessions</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="w-5 h-5 mr-2 text-gray-400" />
                    <span>Certified instructors</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900">
                    ${retreat.price.toLocaleString()}
                  </div>
                  <div className="text-gray-500">per person</div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                      <span>Duration</span>
                    </div>
                    <span className="font-medium">{retreat.duration} days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 mr-2 text-gray-400" />
                      <span>Group size</span>
                    </div>
                    <span className="font-medium">Max 12 people</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link to={`/retreat/${retreat.id}/book`}>
                    <Button className="w-full bg-orange-500 hover:bg-orange-600">
                      Book Now
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full">
                    <Heart className="w-4 h-4 mr-2" />
                    Add to Wishlist
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}