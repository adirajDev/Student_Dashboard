import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Pencil, Trash2 } from 'lucide-react';
import RatingFormModal from './RatingFormModal';
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal';
import Loading from '@/components/common/Loading';

const MyRatingsSection = ({
    ratings,
    isLoading,
    updateRating,
    deleteRating,
    onRefresh,
}) => {
    const [editingRating, setEditingRating] = useState(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [deletingRating, setDeletingRating] = useState(null);

    const handleFormClose = success => {
        setShowFormModal(false);
        setEditingRating(null);
        if (success) {
            onRefresh();
        }
    };

    const handleDelete = async () => {
        if (deletingRating) {
            await deleteRating(deletingRating._id);
            setDeletingRating(null);
        }
    };

    if (isLoading) return <Loading inline message="Loading your reviews…" />;

    return (
        <div className="animate-fade-in">
            {!ratings || ratings.length === 0 ? (
                <div className="bg-[var(--card)] p-8 rounded-3xl border border-dashed border-[var(--border)] flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-500">
                        <Star className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg text-[var(--foreground)] mb-2">
                        No Reviews Yet
                    </h4>
                    <p className="text-[var(--ring)] max-w-sm">
                        You haven't shared your experience yet. Review any
                        college you've applied to and help future students!
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {ratings.map(rating => (
                        <div
                            key={rating._id}
                            className="bg-[var(--card)] p-6 rounded-3xl border border-[var(--border)] shadow-sm flex flex-col h-full"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1 pr-4">
                                    {rating.college?._id ? (
                                        <Link
                                            to={`/college/${rating.college._id}`}
                                            className="text-lg font-semibold text-blue-600 hover:underline mb-1 inline-block"
                                        >
                                            {rating.college.name ||
                                                'Unknown College'}
                                        </Link>
                                    ) : (
                                        <span className="text-lg font-semibold text-[var(--muted)] mb-1 inline-block">
                                            Unknown College
                                        </span>
                                    )}
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star
                                                    key={star}
                                                    className={`w-4 h-4 ${star <= rating.stars ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-xs text-slate-400">
                                            {new Date(
                                                rating.createdAt
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 flex-shrink-0">
                                    <button
                                        onClick={() => {
                                            setEditingRating(rating);
                                            setShowFormModal(true);
                                        }}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                        title="Edit Review"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() =>
                                            setDeletingRating(rating)
                                        }
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                        title="Delete Review"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {rating.comment ? (
                                <p className="text-slate-800 text-base leading-relaxed mt-2 flex-grow">
                                    {rating.comment}
                                </p>
                            ) : (
                                <p className="text-slate-400 text-base italic mt-2 flex-grow">
                                    No comment provided.
                                </p>
                            )}

                            {rating.isEdited && (
                                <div className="mt-4 text-xs text-slate-400">
                                    Edited
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {showFormModal && (
                <RatingFormModal
                    collegeId={editingRating?.college?._id}
                    editingRating={editingRating}
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

export default MyRatingsSection;
