import {
    useParams,
    useLocation,
    useNavigate,
    useOutletContext,
} from 'react-router-dom';
import {
    Briefcase,
    Users,
    Building,
    Percent,
    TrendingUp,
} from 'lucide-react';
import Loading from '../../components/common/Loading';
import Error from '../../components/common/Error';
import CollegeHeader from '../../features/college/components/CollegeHeader';
import CourseList from '../../features/college/components/CourseList';
import RatingList from '../../features/rating/components/RatingList';
import useCollegeDetails from '../../features/college/hooks/useCollegeDetails';

const formatPackage = (pkg) => {
    if (!pkg) return null;
    let str = String(pkg).trim();
    const hasLetters = /[a-zA-Z]/.test(str);
    const hasCurrency = str.includes('₹') || str.toLowerCase().includes('rs');
    let result = str;
    if (!hasCurrency) result = `₹${result}`;
    if (!hasLetters) result = `${result} LPA`;
    return result;
};

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

    // Check if placement details exist and have at least one field
    const hasPlacements =
        college.placementDetails &&
        (college.placementDetails.averagePackage ||
            college.placementDetails.highestPackage ||
            college.placementDetails.placementPercentage);

    return (
        <div className="max-w-5xl mx-auto px-4 pb-8 animate-fade-in">
            <CollegeHeader college={college} />

            {/* Two-Column Grid for Overview and Placements */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Overview Section */}
                {college.overview && (
                    <div className="card h-full">
                        <h2 className="text-2xl mb-4 text-[var(--foreground)] flex items-center">
                            <Building className="w-5 h-5 mr-2 text-blue-500" />
                            Overview
                        </h2>
                        <div className="prose dark:prose-invert max-w-none text-[var(--foreground)] opacity-90 whitespace-pre-wrap">
                            {college.overview}
                        </div>
                    </div>
                )}

                {/* Placement Details */}
                {hasPlacements && (
                    <div className="card h-full">
                        <h2 className="text-2xl mb-6 text-[var(--foreground)] flex items-center">
                            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                            Placement Statistics
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {college.placementDetails.averagePackage && (
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
                                    <p className="text-sm text-[var(--ring)] mb-1">
                                        Median Package
                                    </p>
                                    <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                                        {formatPackage(college.placementDetails.averagePackage)}
                                    </p>
                                </div>
                            )}
                            {college.placementDetails.highestPackage && (
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
                                    <p className="text-sm text-[var(--ring)] mb-1">
                                        Highest Package
                                    </p>
                                    <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                                        {formatPackage(college.placementDetails.highestPackage)}
                                    </p>
                                </div>
                            )}
                            {college.placementDetails.placementPercentage && (
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 sm:col-span-2">
                                    <p className="text-sm text-[var(--ring)] mb-1">
                                        Placement Rate
                                    </p>
                                    <p className="text-2xl font-semibold text-purple-600 dark:text-purple-400 flex items-center">
                                        {college.placementDetails.placementPercentage}
                                        <Percent className="w-5 h-5 ml-1" />
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Recruiters */}
            {college.recruiters && college.recruiters.length > 0 && (
                <div className="card mb-8">
                    <h2 className="text-2xl mb-6 text-[var(--foreground)] flex items-center">
                        <Briefcase className="w-5 h-5 mr-2 text-blue-500" />
                        Top Recruiters
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {college.recruiters.map((recruiter, idx) => (
                            <span
                                key={idx}
                                className="px-4 py-2 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 rounded-full text-sm font-medium border border-blue-100 dark:border-blue-800"
                            >
                                {recruiter}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <CourseList courses={college.availableCourses} />

            {/* Faculty */}
            {college.faculty && college.faculty.length > 0 && (
                <div className="card mb-8">
                    <h2 className="text-2xl mb-6 text-[var(--foreground)] flex items-center">
                        <Users className="w-5 h-5 mr-2 text-blue-500" />
                        Notable Faculty
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {college.faculty.map((member, idx) => (
                            <div
                                key={idx}
                                className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-start gap-4"
                            >
                                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-lg font-semibold text-[var(--ring)] shrink-0">
                                    {member.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="text-[var(--foreground)]">
                                        {member.name}
                                    </h4>
                                    {member.department && (
                                        <p className="text-sm text-[var(--ring)]">
                                            {member.department}
                                        </p>
                                    )}
                                    {member.role && (
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 capitalize">
                                            {member.role}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <RatingList collegeId={college._id} currentUser={user} />
        </div>
    );
};

export default CollegeDetails;
