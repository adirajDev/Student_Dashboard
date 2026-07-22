import { MapPin, ArrowRight, BookOpen } from 'lucide-react';

const CollegeResultCard = ({ college, query, onClick }) => {
    return (
        <div
            onClick={() => onClick(college)}
            className="p-6 bg-[var(--card)] rounded-3xl border border-[var(--border)] shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">
                        {college.name}
                    </h3>
                    {college.location && (
                        <div className="flex items-center text-[var(--ring)] mt-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            {college.location}
                        </div>
                    )}
                </div>
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-[var(--ring)] group-hover:text-blue-500 transition-colors">
                    <ArrowRight className="w-5 h-5" />
                </div>
            </div>

            {college.availableCourses &&
                college.availableCourses.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-[var(--border)]">
                        <div className="flex items-center text-sm text-[var(--ring)] mb-2">
                            <BookOpen className="w-4 h-4 mr-1.5" />
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
                                        className="text-sm px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
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
                                <span className="text-sm px-3 py-1.5 rounded-lg bg-slate-50 text-[var(--ring)] dark:bg-slate-800 border border-[var(--border)]">
                                    +
                                    {
                                        college.availableCourses.filter(
                                            c =>
                                                !c.name
                                                    .toLowerCase()
                                                    .includes(
                                                        query.toLowerCase()
                                                    )
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

export default CollegeResultCard;
