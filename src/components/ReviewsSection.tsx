import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, MessageCircle, Loader } from 'lucide-react';
import { api } from '@/services/api';

interface Review {
  _id: string;
  rating: number;
  title: string;
  comment: string;
  authorName: string;
  createdAt: string;
  categories?: {
    cleanliness: number;
    communication: number;
    checkIn: number;
    accuracy: number;
    location: number;
    value: number;
  };
  helpful: number;
  response?: {
    text: string;
    authorName: string;
    createdAt: string;
  };
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  categories: {
    cleanliness: number;
    communication: number;
    checkIn: number;
    accuracy: number;
    location: number;
    value: number;
  };
}

export const ReviewsSection: React.FC<{ apartmentId: number }> = ({ apartmentId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating'>('recent');
  const [expandedReview, setExpandedReview] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const params = new URLSearchParams({
          sortBy,
          status: 'approved'
        });
        const response = await api.get(`/reviews/apartment/${apartmentId}?${params.toString()}`);
        
        if (response.success && response.data) {
          setReviews(response.data.reviews || []);
          setStats(response.data.stats || null);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [apartmentId, sortBy]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  const renderCategoryStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${
              i < rating ? 'bg-yellow-400' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6">⭐ Guest Reviews</h2>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Left: Overall Rating */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-lg">
                <div className="flex items-start gap-4">
                  <div>
                    <div className="text-5xl font-bold text-gray-900">
                      {stats.averageRating.toFixed(1)}
                    </div>
                    <div className="flex gap-1 my-2">{renderStars(Math.round(stats.averageRating))}</div>
                    <p className="text-gray-600">
                      Based on {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: Category Breakdown */}
              <div className="space-y-4">
                {Object.entries(stats.categories).map(([category, rating]) => (
                  <div key={category}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium capitalize">{category}</span>
                      <span className="text-sm text-gray-600">{rating.toFixed(1)}</span>
                    </div>
                    <div className="flex gap-0.5">
                      {renderCategoryStars(Math.round(rating))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sort Controls */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setSortBy('recent')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                sortBy === 'recent'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Most Recent
            </button>
            <button
              onClick={() => setSortBy('helpful')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                sortBy === 'helpful'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Most Helpful
            </button>
            <button
              onClick={() => setSortBy('rating')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                sortBy === 'rating'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Highest Rated
            </button>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div
                key={review._id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                {/* Review Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg mb-2">{review.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="font-medium">{review.authorName}</span>
                      <span>
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">{renderStars(review.rating)}</div>
                </div>

                {/* Review Comment */}
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {expandedReview === review._id
                    ? review.comment
                    : review.comment.length > 300
                    ? review.comment.substring(0, 300) + '...'
                    : review.comment}
                </p>

                {review.comment.length > 300 && (
                  <button
                    onClick={() =>
                      setExpandedReview(
                        expandedReview === review._id ? null : review._id
                      )
                    }
                    className="text-blue-600 hover:underline text-sm font-medium mb-4"
                  >
                    {expandedReview === review._id ? 'Show less' : 'Show more'}
                  </button>
                )}

                {/* Category Ratings */}
                {review.categories && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(review.categories).map(([cat, rating]) => (
                      <div key={cat}>
                        <p className="text-xs text-gray-600 capitalize mb-1">{cat}</p>
                        <div className="flex gap-0.5">
                          {renderCategoryStars(rating)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Response from owner */}
                {review.response && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 rounded-r">
                    <p className="text-sm font-bold text-blue-900 mb-2">
                      <MessageCircle className="inline mr-2" size={16} />
                      Response from {review.response.authorName}
                    </p>
                    <p className="text-sm text-gray-700">{review.response.text}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(review.response.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {/* Helpful Button */}
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors text-sm">
                    <ThumbsUp size={16} />
                    Helpful ({review.helpful})
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
