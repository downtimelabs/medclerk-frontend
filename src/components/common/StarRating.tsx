import { Star } from 'lucide-react';

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
    // Helpers for hover state if we want strict interactions (optional, simple version first)

    return (
        <div className={`flex items-center gap-1 ${className}`}>
            {Array.from({ length: maxRating }).map((_, index) => {
                const starValue = index + 1;
                const isFilled = starValue <= Math.round(rating);
                // We could do half stars if needed, but keeping it simple for input first.
                // For display, the backend returns average, which might be float (4.8).
                // Let's handle simple filled/empty for now, or partial logic if needed.

                // For display consistency with avg like 4.8, usually we fill 5 stars if >= 4.5
                // Let's stick to simple integer stars for input.

                return (
                    <button
                        key={index}
                        type="button"
                        disabled={readOnly}
                        onClick={() => !readOnly && onChange?.(starValue)}
                        className={`${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'
                            } focus:outline-none`}
                    >
                        <Star
                            size={size}
                            className={`${isFilled
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'fill-transparent text-slate-300'
                                } transition-colors duration-200`}
                        />
                    </button>
                );
            })}
        </div>
    );
};

export default StarRating;
