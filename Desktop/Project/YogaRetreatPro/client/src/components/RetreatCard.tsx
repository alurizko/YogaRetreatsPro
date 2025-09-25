// client/src/components/RetreatCard.tsx
import { Retreat } from '../lib/db'
import { formatPrice, formatDate } from '../lib/helpers'

interface RetreatCardProps {
  retreat: Retreat
}

const RetreatCard: React.FC<RetreatCardProps> = ({ retreat }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img 
        src={retreat.image_url} 
        alt={retreat.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{retreat.title}</h3>
        <p className="text-gray-600 mb-2">{retreat.description.substring(0, 100)}...</p>
        <div className="flex justify-between items-center">
          <span className="text-indigo-600 font-bold">{formatPrice(retreat.price)}</span>
          <span className="text-gray-500">{retreat.duration} дней</span>
        </div>
      </div>
    </div>
  )
}

export default RetreatCard