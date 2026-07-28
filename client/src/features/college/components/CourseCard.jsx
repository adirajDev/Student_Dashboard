import { Calendar } from 'lucide-react';

const CourseCard = ({ course, fee }) => {
    return (
        <div
            id={`course-${course._id}`}
            className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full justify-between"
        >
            <div>
                <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="text-lg text-[var(--foreground)] font-medium line-clamp-2">
                        {course.name}
                    </h3>
                    {course.shortName && (
                        <span className="shrink-0 px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700">
                            {course.shortName}
                        </span>
                    )}
                </div>

                {course.specialization && (
                    <p className="text-sm text-slate-600 mb-3 line-clamp-1">
                        {course.specialization}
                    </p>
                )}

            {fee !== undefined && (
                <div className="mb-4 inline-flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-semibold">
                    Fee: ₹{Number(fee).toLocaleString()}
                </div>
            )}
            </div>

            <div className="mt-4 pt-4 flex items-center justify-between border-t border-slate-100">
                <div className="text-sm font-medium text-slate-500 flex items-center">
                    <Calendar className="w-4 h-4 mr-1.5" />
                    <span>
                        {course.duration
                            ? `${Math.floor(course.duration / 12) > 0 ? `${Math.floor(course.duration / 12)} Yrs ` : ''}${course.duration % 12 > 0 ? `${course.duration % 12} Mos` : ''}`
                            : 'N/A'}
                    </span>
                </div>

                {course.level && (
                    <span className="text-xs font-medium text-slate-400">
                        {course.level}
                    </span>
                )}
            </div>
        </div>
    );
};

export default CourseCard;
