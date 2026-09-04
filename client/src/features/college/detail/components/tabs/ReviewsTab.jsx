import RatingList from '@/features/rating/components/RatingList.jsx';

/**
 * RatingList fetches on mount, so rendering only the active tab means
 * reviews are lazy-loaded for free — no request until someone opens this tab.
 */
const ReviewsTab = ({ college, user }) => (
    <RatingList collegeId={college._id} currentUser={user} />
);

export default ReviewsTab;
