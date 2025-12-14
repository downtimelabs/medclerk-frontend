import { Star } from 'lucide-react';
import { useState } from 'react';

interface StarRatingProps {
    rating: number; // Current rating (0-5)
    maxRating?: number;
    size?: number;
    readOnly?: boolean;
    onChange?: (rating: number) => void;
    className?: string;
}

const StarRating = ({
    rating,
    maxRating = 5,
    size = 20,
    readOnly = false,
    onChange,
    className = ''
}: StarRatingProps) => {
    const [hoverRating, setHoverRating] = useState<number | null>(null);

    // Defensive check
    const safeRating = (typeof rating === 'number' && !isNaN(rating)) ? rating : 0;
    const displayRating = hoverRating !== null ? hoverRating : safeRating;

    return (
        <div className={`flex gap-1 items-center ${className}`}>
            {Array.from({ length: maxRating }).map((_, index) => {
                const starValue = index + 1;
                const isFilled = displayRating >= starValue;
                const isHalf = !isFilled && displayRating > index && displayRating < starValue;

                return (
                    <button
                        key={index}
                        type="button"
                        disabled={readOnly}
                        onClick={() => !readOnly && onChange?.(starValue)}
                        onMouseEnter={() => !readOnly && setHoverRating(starValue)}
                        onMouseLeave={() => !readOnly && setHoverRating(null)}
                        className={`
              relative transition-colors border-none p-0 bg-transparent
              ${!readOnly ? "cursor-pointer hover:scale-110" : "cursor-default"}
            `}
                    >
                        {/* Base Star (Backing) */}
                        <Star
                            size={size}
                            className={`
                ${isFilled ? "fill-yellow-400 text-yellow-400" : "text-slate-300 fill-slate-100"}
                transition-colors duration-200
              `}
                        />

                        {/* Half Star Overlay */}
                        {isHalf && (
                            <div className="absolute top-0 left-0 w-1/2 overflow-hidden pointer-events-none">
                                <Star size={size} className="fill-yellow-400 text-yellow-400" />
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default StarRating;
