import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import StarRating from './StarRating';
import { submitRating } from '../../api/rating';
import { Button } from '../../components/ui/Button';

interface RatingModalProps {
    isOpen: boolean;
    onClose: () => void;
    targetName: string;
    targetId: string;
    onSuccess: () => void;
}

const RatingModal = ({ isOpen, onClose, targetName, targetId, onSuccess }: RatingModalProps) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await submitRating(targetId, rating, comment);
            onSuccess();
            onClose();
            // Reset form
            setRating(0);
            setComment('');
        } catch (err: any) {
            console.error('Failed to submit rating:', err);
            let errorMessage = 'Failed to submit rating';
            if (err.response?.data?.error) {
                errorMessage = typeof err.response.data.error === 'string'
                    ? err.response.data.error
                    : JSON.stringify(err.response.data.error);
            } else if (err.response?.data?.message) {
                errorMessage = typeof err.response.data.message === 'string'
                    ? err.response.data.message
                    : JSON.stringify(err.response.data.message);
            } else if (err.message) {
                errorMessage = err.message;
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Rate {targetName}</h3>
                                <button
                                    onClick={onClose}
                                    className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <X size={20} className="text-slate-500" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="flex flex-col items-center gap-2">
                                        <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                            How was your experience?
                                        </label>
                                        <StarRating
                                            rating={rating}
                                            onChange={setRating}
                                            size={32}
                                            className="gap-2"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                            Additional Comments (Optional)
                                        </label>
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Share details about your experience..."
                                            className="w-full h-24 px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0277BD]/20 resize-none dark:text-white"
                                        />
                                    </div>

                                    {error && (
                                        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
                                            {error}
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={onClose}
                                            className="flex-1"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1"
                                        >
                                            {loading ? (
                                                <div className="flex items-center gap-2">
                                                    <Loader2 size={16} className="animate-spin" />
                                                    Submitting...
                                                </div>
                                            ) : (
                                                'Submit Rating'
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default RatingModal;
