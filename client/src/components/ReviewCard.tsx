import { User, ThumbsUp, Flag } from "lucide-react";
import StarRating from "./StarRating";

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  helpful: number;
  verified: boolean;
  retreatDate?: string;
}

interface ReviewCardProps {
  review: Review;
  onHelpful?: (reviewId: string) => void;
  onReport?: (reviewId: string) => void;
}

export default function ReviewCard({ review, onHelpful, onReport }: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sage-green/20 rounded-full flex items-center justify-center">
            {review.userAvatar ? (
              <img 
                src={review.userAvatar} 
                alt={review.userName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-sage-green" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">{review.userName}</h4>
              {review.verified && (
                <span className="bg-sage-green text-white text-xs px-2 py-1 rounded-full">
                  Подтвержден
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <StarRating rating={review.rating} size="sm" showNumber={false} />
              <span>•</span>
              <span>{formatDate(review.date)}</span>
              {review.retreatDate && (
                <>
                  <span>•</span>
                  <span>Посетил в {formatDate(review.retreatDate)}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => onReport?.(review.id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
          title="Пожаловаться"
        >
          <Flag className="w-4 h-4" />
        </button>
      </div>

      {/* Review Content */}
      <div className="mb-4">
        <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
        <p className="text-gray-700 leading-relaxed">{review.content}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          onClick={() => onHelpful?.(review.id)}
          className="flex items-center gap-2 text-gray-500 hover:text-sage-green transition-colors"
        >
          <ThumbsUp className="w-4 h-4" />
          <span className="text-sm">Полезно ({review.helpful})</span>
        </button>
        <div className="text-xs text-gray-400">
          ID: {review.id.slice(0, 8)}
        </div>
      </div>
    </div>
  );
}
