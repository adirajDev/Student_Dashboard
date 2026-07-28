import { useState } from 'react';
import {
    useParams,
    useLocation,
    useNavigate,
    useOutletContext,
} from 'react-router-dom';
import { Briefcase, Users, Building, Percent, TrendingUp } from 'lucide-react';
import Loading from '../../components/common/Loading';
import Error from '../../components/common/Error';
import CollegeHeader from '../../features/college/components/CollegeHeader';
import CourseList from '../../features/college/components/CourseList';
import RatingList from '../../features/rating/components/RatingList';
import useCollegeDetails from '../../features/college/hooks/useCollegeDetails';
import GalleryModal from '../../features/collegeGallery/components/GalleryModal';

const formatPackage = pkg => {
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
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

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
        <>
            <div className="max-w-5xl mx-auto px-4 pb-8 animate-fade-in">
                <CollegeHeader college={college} onOpenGallery={() => setIsGalleryOpen(true)} />

            {/* Dynamic Bento Box / Masonry Layout */}
            <div className="columns-1 lg:columns-2 gap-8 space-y-8 mb-8">
                {/* Overview Section */}
                {college.overview && (
                    <div className="card break-inside-avoid">
                        <h2 className="text-2xl mb-4 text-[var(--foreground)] flex items-center">
                            <Building className="w-5 h-5 mr-2 text-blue-500" />
                            Overview
                        </h2>
                        <div className="prose max-w-none text-[var(--foreground)] opacity-90 whitespace-pre-wrap">
                            {college.overview}
                        </div>
                    </div>
                )}

                {/* Placement Details */}
                {hasPlacements && (
                    <div className="card break-inside-avoid">
                        <h2 className="text-2xl mb-6 text-[var(--foreground)] flex items-center">
                            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                            Placement Statistics
                        </h2>
                        <div className="flex flex-col sm:flex-row items-stretch divide-y sm:divide-y-0 sm:divide-x divide-slate-200 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden">
                            {college.placementDetails.averagePackage && (
                                <div className="flex-1 p-5 text-center">
                                    <p className="text-sm text-slate-500 mb-1 font-medium">
                                        Median Package
                                    </p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {formatPackage(college.placementDetails.averagePackage)}
                                    </p>
                                </div>
                            )}
                            {college.placementDetails.highestPackage && (
                                <div className="flex-1 p-5 text-center bg-white sm:bg-transparent">
                                    <p className="text-sm text-slate-500 mb-1 font-medium">
                                        Highest Package
                                    </p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {formatPackage(college.placementDetails.highestPackage)}
                                    </p>
                                </div>
                            )}
                            {college.placementDetails.placementPercentage && (
                                <div className="flex-1 p-5 text-center">
                                    <p className="text-sm text-slate-500 mb-1 font-medium">
                                        Placement Rate
                                    </p>
                                    <p className="text-2xl font-bold text-purple-600">
                                        {college.placementDetails.placementPercentage}%
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Recruiters */}
                {college.recruiters && college.recruiters.length > 0 && (
                    <div className="card break-inside-avoid">
                        <h2 className="text-xl sm:text-2xl mb-6 text-[var(--foreground)] flex items-center shrink-0">
                            <Briefcase className="w-5 h-5 mr-2 text-blue-500" />
                            Top Recruiters
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {college.recruiters.map((recruiter, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium border border-blue-200 shadow-sm"
                                >
                                    {recruiter}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Faculty */}
                {college.faculty && college.faculty.length > 0 && (
                    <div className="card break-inside-avoid">
                        <h2 className="text-xl sm:text-2xl mb-6 text-[var(--foreground)] flex items-center shrink-0">
                            <Users className="w-5 h-5 mr-2 text-blue-500" />
                            Notable Faculty
                        </h2>
                        <div className="flex flex-col gap-3">
                            {college.faculty.map((member, idx) => (
                                <div
                                    key={idx}
                                    className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4 transition-colors hover:bg-slate-100"
                                >
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-200 flex items-center justify-center text-lg font-bold text-slate-500 shrink-0">
                                        {member.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="text-[var(--foreground)] font-semibold">
                                            {member.name}
                                        </h4>
                                        {member.department && (
                                            <p className="text-sm text-slate-600 font-medium">
                                                {member.department}
                                            </p>
                                        )}
                                        {member.role && (
                                            <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                                                {member.role}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <CourseList courses={college.availableCourses} />

            <RatingList collegeId={college._id} currentUser={user} />
            </div>

            <GalleryModal 
                isOpen={isGalleryOpen} 
                onClose={() => setIsGalleryOpen(false)} 
                collegeId={college._id}
                images={college.images}
                videos={college.videos}
            />
        </>
    );
};

export default CollegeDetails;
