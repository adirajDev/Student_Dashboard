import { Calendar } from 'lucide-react';

const CourseCard = ({ course, fee }) => {
    return (
        <div
            id={`course-${course._id}`}
            className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
        >
            <div className="flex-1">
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

            </div>

            <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
                <div className="text-sm font-medium text-slate-500 flex items-center">
                    <Calendar className="w-4 h-4 mr-1.5" />
                    <span>
                        {course.duration
                            ? `${Math.floor(course.duration / 12) > 0 ? `${Math.floor(course.duration / 12)} Yrs ` : ''}${course.duration % 12 > 0 ? `${course.duration % 12} Mos` : ''}`
                            : 'N/A'}
                    </span>
                </div>

                {fee !== undefined && (
                    <div className="inline-flex items-baseline px-2.5 py-1 bg-green-100 text-green-800 rounded-lg text-sm font-semibold">
                        ₹{Number(fee).toLocaleString()}
                        <span className="text-[10px] font-medium opacity-80 ml-1 uppercase tracking-wider">Total</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseCard;
