// src/components/RetreatsList.tsx
import { useState, useEffect } from 'react'
import { supabase, Retreat } from '../../utils/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const RetreatsList = () => {
  const [retreats, setRetreats] = useState<Retreat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRetreats = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase.from('retreats').select('*')
        if (error) throw error
        setRetreats(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchRetreats()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Retreats</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {retreats.map((retreat) => (
          <Card key={retreat.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{retreat.title}</CardTitle>
              <CardDescription>{retreat.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Location:</strong> {retreat.location}</p>
                <p><strong>Duration:</strong> {retreat.start_date} to {retreat.end_date}</p>
                <p><strong>Price:</strong> ${retreat.price}</p>
                <p><strong>Max Participants:</strong> {retreat.max_participants}</p>
              </div>
              <Button className="w-full mt-4">
                Book Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default RetreatsList