import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Loader2, Star } from 'lucide-react';
import FormField from '../../../components/common/FormField';

const RatingFormModal = ({ onAdd, onUpdate, editingRating, collegeId, onClose }) => {
    const [formData, setFormData] = useState({
        stars: 0,
        comment: ''
    });
    const [hoveredStar, setHoveredStar] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (editingRating) {
            setFormData({
                stars: editingRating.stars || 0,
                comment: editingRating.comment || ''
            });
        }
    }, [editingRating]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.stars === 0) {
            setError('Please select a star rating');
            return;
        }

        setLoading(true);
        setError('');

        let res;
        if (editingRating) {
            res = await onUpdate(editingRating._id, { stars: formData.stars, comment: formData.comment });
        } else {
            res = await onAdd({ collegeId, stars: formData.stars, comment: formData.comment });
        }

        if (res?.success) {
            onClose(true); // pass true to indicate success so parent can refresh if needed
        } else {
            setError(res?.error || 'Failed to save review');
            setLoading(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-lg bg-[var(--card)] rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
                
                <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
                    <h2 className="text-xl text-[var(--foreground)]">{editingRating ? 'Edit Review' : 'Write a Review'}</h2>
                    <button 
                        onClick={() => onClose()}
                        className="p-2 text-[var(--ring)] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl text-sm border border-red-100 dark:border-red-900/30">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col items-center justify-center py-4">
                            <label className="block text-sm font-medium text-[var(--foreground)] mb-3">
                                Tap to Rate
                            </label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        type="button"
                                        onMouseEnter={() => setHoveredStar(star)}
                                        onMouseLeave={() => setHoveredStar(0)}
                                        onClick={() => setFormData({ ...formData, stars: star })}
                                        className="focus:outline-none"
                                    >
                                        <Star 
                                            className={`w-10 h-10 transition-colors ${
                                                star <= (hoveredStar || formData.stars) 
                                                ? 'fill-amber-400 text-amber-400' 
                                                : 'text-slate-300 dark:text-slate-600'
                                            }`} 
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="comment" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                                Share details of your own experience at this college
                            </label>
                            <textarea
                                id="comment"
                                name="comment"
                                value={formData.comment}
                                onChange={handleChange}
                                placeholder="What is the faculty like? How are the placements? (Optional)"
                                rows={4}
                                maxLength={500}
                                className="input-field resize-none"
                            />
                            <div className="text-right text-xs text-[var(--ring)] mt-1">
                                {formData.comment.length} / 500
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <button
                                type="button"
                                onClick={() => onClose()}
                                className="px-6 py-2.5 rounded-full border border-[var(--border)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || formData.stars === 0}
                                className="btn-primary px-8 py-2.5 flex items-center gap-2 disabled:opacity-50"
                            >
                                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                Post Review
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default RatingFormModal;
