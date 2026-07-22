import {
    useParams,
    useLocation,
    useNavigate,
    useOutletContext,
} from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Loading from '../../components/common/Loading';
import Error from '../../components/common/Error';
import useCollegeDetails from '../../features/college/hooks/useCollegeDetails';
import CollegeHeader from '../../features/college/components/CollegeHeader';
import CourseList from '../../features/college/components/CourseList';
import RatingList from '../../features/rating/components/RatingList';

const CollegeDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useOutletContext();

    const { college, isLoading, error } = useCollegeDetails(id, location.hash);

    if (isLoading) return <Loading />;
    if (error) return <Error error={error} />;
    if (!college)
        return (
            <div className="p-8 text-center text-[var(--ring)]">
                College not found.
            </div>
        );

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-sm font-medium text-[var(--ring)] hover:text-[var(--foreground)] transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
            </button>

            <CollegeHeader college={college} />
            <CourseList courses={college.availableCourses} />
            <RatingList collegeId={college._id} currentUser={user} />
        </div>
    );
};

export default CollegeDetails;
