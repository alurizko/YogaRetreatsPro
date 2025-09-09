import { useState } from "react";
import { X, Send } from "lucide-react";
import StarRating from "./StarRating";

interface ReviewFormProps {
  retreatId: string;
  retreatTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: ReviewFormData) => void;
}

export interface ReviewFormData {
  rating: number;
  title: string;
  content: string;
  retreatId: string;
}

export default function ReviewForm({ retreatId, retreatTitle, isOpen, onClose, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0 || !title.trim() || !content.trim()) {
      alert("Пожалуйста, заполните все поля и поставьте оценку");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        rating,
        title: title.trim(),
        content: content.trim(),
        retreatId
      });
      
      // Reset form
      setRating(0);
      setTitle("");
      setContent("");
      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Ошибка при отправке отзыва. Попробуйте еще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setRating(0);
      setTitle("");
      setContent("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Написать отзыв</h2>
            <p className="text-gray-600 mt-1">{retreatTitle}</p>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Общая оценка *
            </label>
            <StarRating
              rating={rating}
              size="lg"
              interactive={true}
              showNumber={false}
              onRatingChange={setRating}
            />
            {rating > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {rating === 1 && "Очень плохо"}
                {rating === 2 && "Плохо"}
                {rating === 3 && "Нормально"}
                {rating === 4 && "Хорошо"}
                {rating === 5 && "Отлично"}
              </p>
            )}
          </div>

          {/* Title */}
          <div>
            <label htmlFor="review-title" className="block text-sm font-medium text-gray-700 mb-2">
              Заголовок отзыва *
            </label>
            <input
              id="review-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Кратко опишите ваш опыт"
              maxLength={100}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-green focus:border-transparent"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">{title.length}/100</p>
          </div>

          {/* Content */}
          <div>
            <label htmlFor="review-content" className="block text-sm font-medium text-gray-700 mb-2">
              Подробный отзыв *
            </label>
            <textarea
              id="review-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Расскажите подробно о своем опыте: что понравилось, что можно улучшить, рекомендации для других участников..."
              rows={6}
              maxLength={1000}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-green focus:border-transparent resize-none"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">{content.length}/1000</p>
          </div>

          {/* Guidelines */}
          <div className="bg-sage-green/10 rounded-lg p-4">
            <h4 className="font-medium text-sage-green mb-2">Рекомендации для написания отзыва:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Будьте честны и конструктивны</li>
              <li>• Опишите конкретные аспекты: размещение, питание, программу</li>
              <li>• Укажите, кому бы вы рекомендовали этот ретрит</li>
              <li>• Избегайте личных нападок на организаторов</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSubmitting || rating === 0 || !title.trim() || !content.trim()}
              className="flex-1 px-4 py-2 bg-sage-green text-white rounded-md hover:bg-sage-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Опубликовать отзыв
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
