import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export default function StarRating({ 
  rating, 
  maxRating = 5, 
  size = "md", 
  showNumber = true,
  interactive = false,
  onRatingChange 
}: StarRatingProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4", 
    lg: "w-5 h-5"
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  const handleStarClick = (starRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[...Array(maxRating)].map((_, index) => {
          const starRating = index + 1;
          const isFilled = starRating <= rating;
          const isPartiallyFilled = starRating - 0.5 <= rating && rating < starRating;
          
          return (
            <button
              key={index}
              type="button"
              className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
              onClick={() => handleStarClick(starRating)}
              disabled={!interactive}
            >
              <Star 
                className={`${sizeClasses[size]} ${
                  isFilled 
                    ? 'text-warm-orange fill-warm-orange' 
                    : isPartiallyFilled
                    ? 'text-warm-orange fill-warm-orange/50'
                    : 'text-gray-300'
                }`}
              />
            </button>
          );
        })}
      </div>
      {showNumber && (
        <span className={`${textSizeClasses[size]} font-medium text-gray-700 ml-1`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
