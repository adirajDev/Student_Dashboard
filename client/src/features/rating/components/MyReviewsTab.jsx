import { useEffect, useState } from 'react';
import { GraduationCap, Edit3 } from 'lucide-react';
import MyRatingsSection from './MyRatingsSection';
import RatingFormModal from './RatingFormModal';
import useRatings from '../hooks/useRatings';
import { getApplicationColleges } from '@/features/rating/utils/ratingEligibility.js';

const MyReviewsTab = ({ user }) => {
    const {
        addRating,
        ratings,
        isLoading,
        getMyRatings,
        updateRating,
        deleteRating,
    } = useRatings();

    const [showFormModal, setShowFormModal] = useState(false);

    useEffect(() => {
        getMyRatings();
    }, [getMyRatings]);

    const handleFormClose = success => {
        setShowFormModal(false);
        if (success) {
            getMyRatings();
        }
    };

    // Colleges the user has applied to but not yet reviewed.
    const ratedIds = new Set(
        ratings.map(r => (r.college?._id || r.college)?.toString())
    );
    const reviewable = getApplicationColleges(user).filter(
        c => !ratedIds.has((c._id || c)?.toString())
    );
    const nextToReview = reviewable[0] || null;

    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h2 className="text-3xl font-display mb-2">My Reviews</h2>
                <p className="text-[var(--muted)]">
                    Manage the reviews you have left for colleges.
                </p>
            </div>

            {/* Prompt to review a college the user applied to */}
            {nextToReview && (
                <div className=" card rounded-[var(--radius-xl)] p-6 md:p-8 shadow-md mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                            <GraduationCap className="w-8 h-8 " />
                        </div>
                        <div>
                            <h3 className="text-2xl font-display mb-1">
                                Rate a college you applied to
                            </h3>
                            <p className="text-ink-500  text-md">
                                Share your experience at{' '}
                                <span className="font-semibold">
                                    {nextToReview.name || 'this college'}
                                </span>{' '}
                                to help future students!
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowFormModal(true)}
                        className="bg-amber-200 text-[var(--color-ink-950)] hover:bg-[var(--color-amber-400)] px-6 py-3 rounded-[var(--radius-md)] font-semibold transition-colors whitespace-nowrap flex items-center gap-2 shadow-sm"
                    >
                        <Edit3 className="w-5 h-5" />
                        Write a Review
                    </button>
                </div>
            )}

            <div className="w-full">
                <MyRatingsSection
                    ratings={ratings}
                    isLoading={isLoading}
                    updateRating={updateRating}
                    deleteRating={deleteRating}
                    onRefresh={getMyRatings}
                />
            </div>

            {showFormModal && nextToReview && (
                <RatingFormModal
                    collegeId={(nextToReview._id || nextToReview).toString()}
                    editingRating={null} // To edit, use the pencil icon on the card below
                    onAdd={addRating}
                    onClose={handleFormClose}
                />
            )}
        </div>
    );
};

export default MyReviewsTab;
