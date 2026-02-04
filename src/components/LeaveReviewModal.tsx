import React, { useState } from 'react';
import { Star, Send, Loader, AlertCircle } from 'lucide-react';
import { api } from '@/services/api';

interface LeaveReviewModalProps {
  reservationId: string;
  apartmentTitle: string;
  apartmentImage?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const LeaveReviewModal: React.FC<LeaveReviewModalProps> = ({
  reservationId,
  apartmentTitle,
  apartmentImage,
  onClose,
  onSuccess
}) => {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [categories, setCategories] = useState({
    cleanliness: 5,
    communication: 5,
    checkIn: 5,
    accuracy: 5,
    location: 5,
    value: 5
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
      setError('Veuillez entrer un titre pour votre avis');
      return;
    }
    if (!comment.trim()) {
      setError('Veuillez entrer votre commentaire');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/reviews', {
        reservationId,
        rating,
        title,
        comment,
        categories
      });

      if (response.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.error || 'Erreur lors de la soumission de l\'avis');
      }
    } catch (err: any) {
      console.error('Review submission error:', err);
      setError(
        err?.response?.data?.error || 
        err?.message || 
        'Erreur réseau. Veuillez réessayer.'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (value: number, onChange: (val: number) => void) => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onChange(star)}
            type="button"
            className="transition-all"
          >
            <Star
              size={28}
              className={star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Share Your Experience</h2>
            <p className="text-gray-600 mt-1">{apartmentTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Overall Rating */}
          <div>
            <label className="block text-lg font-bold mb-3">
              How would you rate your stay?
            </label>
            {renderStars(rating, setRating)}
            <p className="text-sm text-gray-500 mt-2">
              {rating === 5 && 'Excellent!'}
              {rating === 4 && 'Very good'}
              {rating === 3 && 'Good'}
              {rating === 2 && 'Fair'}
              {rating === 1 && 'Poor'}
            </p>
          </div>

          {/* Category Ratings */}
          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <h3 className="font-bold text-lg mb-4">Rate specific aspects:</h3>
            {Object.entries(categories).map(([category, value]) => (
              <div key={category}>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-medium capitalize">{category}</label>
                  <span className="text-sm text-gray-600">{value}/5</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() =>
                        setCategories({
                          ...categories,
                          [category]: star
                        })
                      }
                      type="button"
                    >
                      <Star
                        size={20}
                        className={
                          star <= value
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Review Title */}
          <div>
            <label className="block font-bold mb-2">Review Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience in one sentence"
              maxLength={100}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {title.length}/100
            </p>
          </div>

          {/* Review Comment */}
          <div>
            <label className="block font-bold mb-2">Your Review</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share more details about your stay. What did you like? What could be improved?"
              rows={6}
              maxLength={5000}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {comment.length}/5000
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-bold hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title || !comment}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Submit Review
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveReviewModal;
