import { useState, useEffect, useMemo } from 'react';
import { Star, Pencil, Trash2, Edit3 } from 'lucide-react';
import useRatings from '../hooks/useRatings';
import RatingFormModal from './RatingFormModal';
import DeleteConfirmModal from '../../../components/common/DeleteConfirmModal';
import Loading from '../../../components/common/Loading';
import Pagination from '../../../components/common/Pagination';

const RatingList = ({ collegeId, currentUser }) => {
    const {
        ratings,
        isLoading,
        page,
        setPage,
        totalPages,
        filterStars,
        setFilterStars,
        getRatingsByCollege,
        addRating,
        updateRating,
        deleteRating,
    } = useRatings();

    const [showFormModal, setShowFormModal] = useState(false);
    const [editingRating, setEditingRating] = useState(null);
    const [deletingRating, setDeletingRating] = useState(null);

    useEffect(() => {
        if (collegeId) {
            getRatingsByCollege(collegeId);
        }
    }, [collegeId, getRatingsByCollege]);

    useEffect(() => {
        if (collegeId) {
            getRatingsByCollege(collegeId);
        }
    }, [collegeId, getRatingsByCollege]);

    // Check if current user has already rated
    const userRating = useMemo(() => {
        if (!currentUser) return null;
        return ratings.find(
            r =>
                r.student?._id === currentUser._id ||
                r.student === currentUser._id
        );
    }, [ratings, currentUser]);

    // Check if the current user is eligible to rate (must be a student of this college)
    const canRate =
        currentUser?.role === 'student' &&
        currentUser.college === collegeId &&
        !userRating;

    const handleFormClose = success => {
        setShowFormModal(false);
        setEditingRating(null);
        if (success) {
            getRatingsByCollege(collegeId); // Refresh ratings to get populated student name etc.
        }
    };

    const handleDelete = async () => {
        if (deletingRating) {
            await deleteRating(deletingRating._id);
            setDeletingRating(null);
        }
    };

    if (isLoading) return <Loading />;

    return (
        <div className="mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h3 className="text-2xl font-display">Student Reviews</h3>
                    <p className="text-[var(--muted)] text-sm mt-1">
                        {ratings.length}{' '}
                        {ratings.length === 1 ? 'review' : 'reviews'}
                    </p>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                    {/* Star Filter */}
                    <div className="relative w-full sm:w-48">
                        <select
                            value={filterStars}
                            onChange={e => {
                                setFilterStars(Number(e.target.value));
                                setPage(1);
                            }}
                            className="w-full px-4 py-2.5 bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-md)] shadow-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--color-ink-500)] focus:ring-1 focus:ring-[var(--color-ink-500)] appearance-none text-sm font-medium"
                        >
                            <option value={0}>All Stars</option>
                            <option value={5}>5 Stars only</option>
                            <option value={4}>4 Stars only</option>
                            <option value={3}>3 Stars only</option>
                            <option value={2}>2 Stars only</option>
                            <option value={1}>1 Star only</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[var(--muted)]">
                            <svg
                                className="fill-current h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>

                    {/* Rate Button */}
                    {canRate && (
                        <button
                            onClick={() => setShowFormModal(true)}
                            className="btn-primary flex items-center gap-2 whitespace-nowrap"
                        >
                            <Edit3 className="w-4 h-4" />
                            Write a Review
                        </button>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {!ratings || ratings.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-[var(--border)] rounded-[var(--radius-xl)] bg-[var(--card)] text-[var(--muted)]">
                        {filterStars > 0
                            ? `No ${filterStars}-star reviews yet.`
                            : 'No reviews yet. Be the first to rate!'}
                    </div>
                ) : (
                    ratings.map(rating => (
                        <div
                            key={rating._id}
                            className="card-interactive p-6 transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1 pr-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star
                                                    key={star}
                                                    className={`w-4 h-4 ${star <= rating.stars ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                                                />
                                            ))}
                                        </div>
                                        {rating.isEdited && (
                                            <span className="text-xs text-[var(--muted)] italic">
                                                (Edited)
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                                        <span className="font-display text-[var(--foreground)]">
                                            {rating.student?.name ||
                                                'Anonymous User'}
                                        </span>
                                        <span>•</span>
                                        <span>
                                            {new Date(
                                                rating.createdAt
                                            ).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions if this is the current user's rating */}
                                {currentUser &&
                                    (rating.student?._id === currentUser._id ||
                                        rating.student === currentUser._id) && (
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <button
                                                onClick={() => {
                                                    setEditingRating(rating);
                                                    setShowFormModal(true);
                                                }}
                                                className="p-2 text-[var(--color-ink-600)] hover:bg-[var(--color-ink-50)] rounded-[var(--radius-sm)] transition-colors"
                                                title="Edit Review"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setDeletingRating(rating)
                                                }
                                                className="p-2 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 rounded-[var(--radius-sm)] transition-colors"
                                                title="Delete Review"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                            </div>

                            {rating.comment && (
                                <p className="text-[var(--muted)] whitespace-pre-wrap text-base leading-relaxed mt-2">
                                    {rating.comment}
                                </p>
                            )}
                        </div>
                    ))
                )}
            </div>

            {ratings && ratings.length > 0 && (
                <div className="mt-6 border-t border-[var(--border)] pt-4">
                    <Pagination
                        currentPage={page || 1}
                        totalPages={totalPages || 1}
                        onPageChange={setPage}
                    />
                </div>
            )}

            {showFormModal && (
                <RatingFormModal
                    collegeId={collegeId}
                    editingRating={editingRating}
                    onAdd={addRating}
                    onUpdate={updateRating}
                    onClose={handleFormClose}
                />
            )}

            {deletingRating && (
                <DeleteConfirmModal
                    studentName="this review"
                    onConfirm={handleDelete}
                    onClose={() => setDeletingRating(null)}
                />
            )}
        </div>
    );
};

export default RatingList;
