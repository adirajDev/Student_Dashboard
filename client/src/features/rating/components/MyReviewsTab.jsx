import { useState } from 'react';
import { GraduationCap, Edit3 } from 'lucide-react';
import MyRatingsSection from './MyRatingsSection';
import RatingFormModal from './RatingFormModal';
import useRatings from '../hooks/useRatings';

const MyReviewsTab = ({ user }) => {
    const { addRating, ratings } = useRatings();
    const [showFormModal, setShowFormModal] = useState(false);

    const handleFormClose = (success) => {
        setShowFormModal(false);
        if (success) {
            // Force a refresh of the MyRatingsSection
            window.location.reload(); 
        }
    };

    // Determine if the user has already rated their current college
    // user.college could be an object if populated, or a string ID.
    const userCollegeId = typeof user.college === 'object' ? user.college?._id : user.college;
    const userCollegeName = typeof user.college === 'object' ? user.college?.name : 'Your Enrolled College';

    const hasRatedCollege = ratings?.some(r => r.college?._id === userCollegeId || r.college === userCollegeId);

    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h2 className="text-3xl mb-2">My Reviews</h2>
                <p className="text-[var(--ring)]">Manage the reviews you have left for colleges.</p>
            </div>

            {/* Banner for Current College */}
            {userCollegeId && !hasRatedCollege && (
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-6 md:p-8 text-white shadow-md mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                            <GraduationCap className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-1">Rate your current college</h3>
                            <p className="text-blue-100 text-sm">
                                Share your experience at <span className="font-semibold">{userCollegeName}</span> to help future students!
                            </p>
                        </div>
                    </div>
                    
                    <button
                        onClick={() => setShowFormModal(true)}
                        className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-full font-medium transition-colors whitespace-nowrap flex items-center gap-2"
                    >
                        <Edit3 className="w-5 h-5" />
                        Write a Review
                    </button>
                </div>
            )}

            <div className="bg-[var(--card)] rounded-3xl border border-[var(--border)] p-6 md:p-8 shadow-sm">
                <MyRatingsSection />
            </div>

            {showFormModal && userCollegeId && (
                <RatingFormModal 
                    collegeId={userCollegeId}
                    editingRating={null} // To edit, they can use the pencil icon on the card below
                    onAdd={addRating}
                    onClose={handleFormClose}
                />
            )}
        </div>
    );
};

export default MyReviewsTab;
