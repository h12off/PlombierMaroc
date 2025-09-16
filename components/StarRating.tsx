import React, { useState } from 'react';
import { StarIcon } from './IconComponents';

interface StarRatingProps {
  rating: number;
  onRate: (rating: number) => void;
  size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRate, size = 6 }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex justify-center items-center" onMouseLeave={() => setHoverRating(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className={`text-yellow-400 transition-transform duration-200 hover:scale-125 focus:outline-none`}
          onClick={() => onRate(star)}
          onMouseEnter={() => setHoverRating(star)}
          aria-label={`Rate ${star} stars`}
        >
          <StarIcon 
            className={`w-${size} h-${size}`} 
            filled={hoverRating >= star || (!hoverRating && rating >= star)}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;