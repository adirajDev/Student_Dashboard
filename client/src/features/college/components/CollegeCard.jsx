import { MapPin, BookOpen, Star, Building2 } from 'lucide-react';

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

const CollegeCard = ({ college, query = '', onClick }) => {
    return (
        <div
            onClick={() => onClick(college)}
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-[var(--border)] hover:border-indigo-500 dark:hover:border-indigo-400 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
        >
            {/* Top Header Section */}
            <div className="flex items-start gap-4 mb-4">
                {/* Generic Logo Placeholder */}
                <div className="w-14 h-14 shrink-0 bg-slate-50  border border-slate-100 dark:border-slate-700 rounded-xl flex items-center justify-center text-indigo-500">
                    <Building2 className="w-7 h-7" />
                </div>
                
                {/* Title, Location & Rating */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-xl text-indigo-700 text-[var(--foreground)] truncate">
                        {college.name}
                    </h3>
                    <div className="flex items-center gap-4 mt-1">
                        {college.location && (
                            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                                <MapPin className="w-4 h-4 mr-1" />
                                {college.location}
                            </div>
                        )}
                        {college.averageRating > 0 && (
                            <div className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300">
                                <Star className="w-4 h-4 text-amber-400 mr-1 fill-amber-400" />
                                {college.averageRating.toFixed(1)}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <hr className="border-[var(--border)] mb-4" />

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
                {/* Courses */}
                <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Courses Offered</p>
                    <div className="flex items-center text-[var(--foreground)] font-medium">
                        <span>{college.availableCourses?.length || 0} Courses</span>
                    </div>
                </div>

                {/* Median Package */}
                {college.placementDetails?.averagePackage && (
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Median Package</p>
                        <div className="flex items-center text-[var(--foreground)] font-medium truncate">
                            <span>{formatPackage(college.placementDetails.averagePackage)}</span>
                        </div>
                    </div>
                )}

                {/* Highest Package */}
                {college.placementDetails?.highestPackage && (
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Highest Package</p>
                        <div className="flex items-center text-[var(--foreground)] font-medium truncate">
                            <span>{formatPackage(college.placementDetails.highestPackage)}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Matching Courses (Only shown if searching) */}
            {college.availableCourses && college.availableCourses.length > 0 && query && (
                <div className="mt-5 pt-4 border-t border-[var(--border)]">
                    <div className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                        <BookOpen className="w-4 h-4 mr-2 text-slate-400 dark:text-slate-500" />
                        Matching Courses:
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {college.availableCourses.map(course => {
                            const isMatch = course.name
                                .toLowerCase()
                                .includes(query.toLowerCase());
                            if (!isMatch) return null;
                            return (
                                <span
                                    key={course._id}
                                    className="text-sm px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                                >
                                    {course.name}
                                </span>
                            );
                        })}
                        {college.availableCourses.filter(
                            c =>
                                !c.name
                                    .toLowerCase()
                                    .includes(query.toLowerCase())
                        ).length > 0 && (
                            <span className="text-sm px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-[var(--border)]">
                                +
                                {
                                    college.availableCourses.filter(
                                        c =>
                                            !c.name
                                                .toLowerCase()
                                                .includes(query.toLowerCase())
                                    ).length
                                }{' '}
                                other courses
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CollegeCard;
