import { Calendar } from 'lucide-react';

const CourseCard = ({ course }) => {
    return (
        <div
            id={`course-${course._id}`}
            className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
        >
            <div className="flex justify-between items-start mb-2 gap-2">
                <h3 className="text-lg text-[var(--foreground)] font-medium line-clamp-2">
                    {course.name}
                </h3>
                {course.shortName && (
                    <span className="shrink-0 px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                        {course.shortName}
                    </span>
                )}
            </div>
            
            {course.specialization && (
                <p className="text-sm text-[var(--ring)] mb-4 line-clamp-1">
                    {course.specialization}
                </p>
            )}

            <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center">
                    <Calendar className="w-4 h-4 mr-1.5" />
                    <span>
                        {course.duration 
                            ? `${Math.floor(course.duration / 12) > 0 ? `${Math.floor(course.duration / 12)} Yrs ` : ''}${course.duration % 12 > 0 ? `${course.duration % 12} Mos` : ''}`
                            : 'N/A'
                        }
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
