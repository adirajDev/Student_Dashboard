import { useOutletContext } from 'react-router-dom';
import MyReviewsTab from '@/features/rating/components/MyReviewsTab';

const StudentDashboard = () => {
    const { user } = useOutletContext();

    return (
        <main className="max-w-5xl mx-auto px-4 py-8">
            <MyReviewsTab user={user} />
        </main>
    );
};

export default StudentDashboard;
