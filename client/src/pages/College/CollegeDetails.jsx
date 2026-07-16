import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, BookOpen, ArrowLeft, Building2, Calendar } from 'lucide-react';
import apiClient from '../../services/apiClient';
import Loading from '../../components/common/Loading';
import Error from '../../components/common/Error';

const CollegeDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [college, setCollege] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch college data
    useEffect(() => {
        const fetchCollege = async () => {
            setIsLoading(true);
            try {
                const response = await apiClient.get(`/data/colleges/${id}`);
                setCollege(response.data);
            } catch (err) {
                console.error("Failed to fetch college:", err);
                setError(err.response?.data?.message || "Failed to load college details.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCollege();
    }, [id]);

    // Handle scroll to hash
    useEffect(() => {
        if (!isLoading && college && location.hash) {
            // Remove the '#' character
            const elementId = location.hash.substring(1);
            const element = document.getElementById(elementId);
            
            if (element) {
                // Short timeout to ensure DOM is fully painted
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Highlight the element briefly
                    element.classList.add('ring-4', 'ring-blue-500', 'ring-opacity-50', 'bg-blue-50', 'dark:bg-blue-900/20');
                    setTimeout(() => {
                        element.classList.remove('ring-4', 'ring-blue-500', 'ring-opacity-50', 'bg-blue-50', 'dark:bg-blue-900/20');
                    }, 2000);
                }, 100);
            }
        }
    }, [isLoading, college, location.hash]);

    if (isLoading) return <Loading />;
    if (error) return <Error error={error} />;
    if (!college) return <div className="p-8 text-center">College not found.</div>;

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center text-sm font-medium text-[var(--ring)] hover:text-[var(--foreground)] transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
            </button>

            <div className="card mb-8 relative overflow-hidden">
                              
                <div className="relative z-10">
                    <h1 className="text-4xl font-bold text-[var(--foreground)] mb-2">{college.name}</h1>
                    
                    <div className="flex flex-wrap items-center gap-4 text-[var(--ring)] mb-6">
                        {college.location && (
                            <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1.5 text-blue-500" />
                                <span>{college.location}</span>
                            </div>
                        )}
                        <div className="flex items-center">
                            <Building2 className="w-4 h-4 mr-1.5 text-blue-500" />
                            <span>Institution ID: {college.collegeID || college._id.substring(0, 8)}</span>
                        </div>
                    </div>

                    <div className="prose dark:prose-invert max-w-none text-[var(--foreground)] opacity-90">
                        <p>{college.description || "No description available for this institution."}</p>
                    </div>
                </div>
            </div>

            <div>
                <div className="flex items-center gap-2 mb-6">
                    <BookOpen className="w-6 h-6 text-blue-500" />
                    <h2 className="text-2xl font-bold text-[var(--foreground)]">Offered Courses ({college.availableCourses?.length || 0})</h2>
                </div>

                {college.availableCourses && college.availableCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {college.availableCourses.map((course) => (
                            <div 
                                key={course._id} 
                                id={`course-${course._id}`}
                                className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <h3 className="font-semibold text-lg text-[var(--foreground)] mb-2">{course.name}</h3>
                                <div className="text-sm text-[var(--ring)] flex items-center">
                                    <Calendar className="w-3.5 h-3.5 mr-1" />
                                    <span>Regular Program</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center border border-[var(--border)] border-dashed rounded-xl text-[var(--ring)]">
                        This college currently has no courses listed.
                    </div>
                )}
            </div>
        </div>
    );
};

export default CollegeDetails;
