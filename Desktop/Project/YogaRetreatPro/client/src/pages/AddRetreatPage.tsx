import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Building2, MapPin, Calendar, Users, DollarSign, Clock, Star, Globe } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent } from '../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'

interface RetreatFormData {
  title: string
  shortDescription: string
  description: string
  country: string
  location: string
  address: string
  price: number
  originalPrice: number
  duration: number
  maxParticipants: number
  startDate: string
  endDate: string
  category: string
  yogaStyle: string
  difficulty: string
  organizerName: string
  organizerEmail: string
  organizerPhone: string
  features: string[]
  accommodation: string
  meals: string
}

const AddRetreatPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<RetreatFormData>({
    title: '',
    shortDescription: '',
    description: '',
    country: '',
    location: '',
    address: '',
    price: 0,
    originalPrice: 0,
    duration: 7,
    maxParticipants: 20,
    startDate: '',
    endDate: '',
    category: '',
    yogaStyle: '',
    difficulty: '',
    organizerName: '',
    organizerEmail: '',
    organizerPhone: '',
    features: [],
    accommodation: '',
    meals: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Validation
      if (!formData.title || !formData.country || !formData.location) {
        throw new Error('Please fill in all required fields')
      }

      if (formData.price <= 0) {
        throw new Error('Price must be greater than 0')
      }

      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        throw new Error('End date must be after start date')
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert('Retreat submitted successfully! We will review and publish it within 24 hours.')
      navigate('/')

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">List Your Retreat</h1>
            <p className="text-gray-600 mb-8">
              Join thousands of retreat organizers who trust BookYogaRetreats to connect with travelers worldwide.
            </p>
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">Why list with us?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-orange-500" />
                  <span>Global reach & marketing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-orange-500" />
                  <span>300,000+ active travelers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-orange-500" />
                  <span>Verified reviews system</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-orange-500" />
                  <span>Secure payment processing</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <Link to="/login">
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  Sign In to List Your Retreat
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" className="w-full">
                  Create Organizer Account
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">List Your Retreat</h1>
            <p className="text-gray-600">
              Share your amazing retreat with travelers from around the world
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  <span className={`ml-2 text-sm ${
                    currentStep >= step ? 'text-orange-500 font-medium' : 'text-gray-500'
                  }`}>
                    {step === 1 && 'Basic Info'}
                    {step === 2 && 'Details'}
                    {step === 3 && 'Review'}
                  </span>
                  {step < 3 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      currentStep > step ? 'bg-orange-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Card>
            <CardContent className="p-8">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Retreat Title *
                      </label>
                      <Input
                        name="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., 7 Days Yoga & Meditation Retreat in Bali"
                        className="w-full"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Short Description *
                      </label>
                      <textarea
                        name="shortDescription"
                        value={formData.shortDescription}
                        onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Brief description that will appear in search results..."
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <MapPin className="w-4 h-4 inline mr-1" />
                          Country *
                        </label>
                        <Select value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="indonesia">Indonesia</SelectItem>
                            <SelectItem value="thailand">Thailand</SelectItem>
                            <SelectItem value="india">India</SelectItem>
                            <SelectItem value="costa-rica">Costa Rica</SelectItem>
                            <SelectItem value="mexico">Mexico</SelectItem>
                            <SelectItem value="portugal">Portugal</SelectItem>
                            <SelectItem value="greece">Greece</SelectItem>
                            <SelectItem value="italy">Italy</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location *
                        </label>
                        <Input
                          name="location"
                          value={formData.location}
                          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="e.g., Ubud, Bali"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Clock className="w-4 h-4 inline mr-1" />
                          Duration (days) *
                        </label>
                        <Input
                          type="number"
                          name="duration"
                          value={formData.duration}
                          onChange={(e) => setFormData(prev => ({ ...prev, duration: Number(e.target.value) }))}
                          min="1"
                          max="30"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <DollarSign className="w-4 h-4 inline mr-1" />
                          Price (USD) *
                        </label>
                        <Input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                          min="1"
                          placeholder="1299"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Users className="w-4 h-4 inline mr-1" />
                          Max Participants *
                        </label>
                        <Input
                          type="number"
                          name="maxParticipants"
                          value={formData.maxParticipants}
                          onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: Number(e.target.value) }))}
                          min="1"
                          max="100"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          Start Date *
                        </label>
                        <Input
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          End Date *
                        </label>
                        <Input
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Additional Details */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-6">Additional Details</h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Detailed description of your retreat, what's included, daily schedule, etc..."
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category *
                        </label>
                        <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yoga">Yoga</SelectItem>
                            <SelectItem value="wellness">Wellness</SelectItem>
                            <SelectItem value="meditation">Meditation</SelectItem>
                            <SelectItem value="detox">Detox</SelectItem>
                            <SelectItem value="spiritual">Spiritual</SelectItem>
                            <SelectItem value="womens">Women's</SelectItem>
                            <SelectItem value="adventure">Adventure</SelectItem>
                            <SelectItem value="luxury">Luxury</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Yoga Style
                        </label>
                        <Select value={formData.yogaStyle} onValueChange={(value) => setFormData(prev => ({ ...prev, yogaStyle: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hatha">Hatha</SelectItem>
                            <SelectItem value="vinyasa">Vinyasa Flow</SelectItem>
                            <SelectItem value="ashtanga">Ashtanga</SelectItem>
                            <SelectItem value="yin">Yin</SelectItem>
                            <SelectItem value="kundalini">Kundalini</SelectItem>
                            <SelectItem value="restorative">Restorative</SelectItem>
                            <SelectItem value="hot">Hot Yoga</SelectItem>
                            <SelectItem value="iyengar">Iyengar</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Difficulty Level *
                        </label>
                        <Select value={formData.difficulty} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                            <SelectItem value="all-levels">All Levels</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Accommodation Type
                        </label>
                        <Input
                          name="accommodation"
                          value={formData.accommodation}
                          onChange={(e) => setFormData(prev => ({ ...prev, accommodation: e.target.value }))}
                          placeholder="e.g., Shared rooms, Private villa"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Meals Included
                        </label>
                        <Input
                          name="meals"
                          value={formData.meals}
                          onChange={(e) => setFormData(prev => ({ ...prev, meals: e.target.value }))}
                          placeholder="e.g., 3 vegetarian meals daily"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Review & Submit */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-6">Review & Submit</h2>
                    
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-semibold text-lg mb-4">{formData.title}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Location:</span> {formData.location}, {formData.country}
                        </div>
                        <div>
                          <span className="font-medium">Duration:</span> {formData.duration} days
                        </div>
                        <div>
                          <span className="font-medium">Price:</span> ${formData.price}
                        </div>
                        <div>
                          <span className="font-medium">Max Participants:</span> {formData.maxParticipants}
                        </div>
                        <div>
                          <span className="font-medium">Start Date:</span> {formData.startDate}
                        </div>
                        <div>
                          <span className="font-medium">End Date:</span> {formData.endDate}
                        </div>
                      </div>
                      {formData.shortDescription && (
                        <div className="mt-4">
                          <span className="font-medium">Description:</span>
                          <p className="text-gray-600 mt-1">{formData.shortDescription}</p>
                        </div>
                      )}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• We'll review your retreat within 24 hours</li>
                        <li>• Once approved, it will be live on our platform</li>
                        <li>• You'll receive booking notifications via email</li>
                        <li>• Our support team is here to help you succeed</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </Button>
                  {currentStep === 3 ? (
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      {isLoading ? 'Submitting...' : 'Submit Retreat'}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      Next Step
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default AddRetreatPage
