import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Pencil, Trash2 } from 'lucide-react';
import useRatings from '../hooks/useRatings';
import RatingFormModal from './RatingFormModal';
import DeleteConfirmModal from '../../../components/common/DeleteConfirmModal';
import Loading from '../../../components/common/Loading';

const MyRatingsSection = () => {
    const { ratings, isLoading, getMyRatings, updateRating, deleteRating } =
        useRatings();

    const [editingRating, setEditingRating] = useState(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [deletingRating, setDeletingRating] = useState(null);

    useEffect(() => {
        getMyRatings();
    }, [getMyRatings]);

    const handleFormClose = success => {
        setShowFormModal(false);
        setEditingRating(null);
        if (success) {
            getMyRatings();
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
        <div className="animate-fade-in">
            {!ratings || ratings.length === 0 ? (
                <div className="bg-[var(--card)] p-8 rounded-3xl border border-dashed border-[var(--border)] flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4 text-blue-500">
                        <Star className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg text-[var(--foreground)] mb-2">
                        No Reviews Yet
                    </h4>
                    <p className="text-[var(--ring)] max-w-sm">
                        You haven't shared your experience yet. Visit your
                        college's page to write a review!
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
                                    <Link
                                        to={`/college/${rating.college?._id}`}
                                        className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline mb-1 inline-block"
                                    >
                                        {rating.college?.name ||
                                            'Unknown College'}
                                    </Link>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star
                                                    key={star}
                                                    className={`w-4 h-4 ${star <= rating.stars ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'}`}
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
                                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
                                        title="Edit Review"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() =>
                                            setDeletingRating(rating)
                                        }
                                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                                        title="Delete Review"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {rating.comment ? (
                                <p className="text-slate-800 dark:text-slate-200 text-base leading-relaxed mt-2 flex-grow">
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
