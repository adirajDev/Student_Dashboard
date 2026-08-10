import { Calendar } from 'lucide-react';

const CourseCard = ({ course, fee }) => {
    return (
        <div
            id={`course-${course._id}`}
            className="card-interactive p-6 flex flex-col h-full"
        >
            <div className="flex-1">
                <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="text-lg text-[var(--foreground)] font-display line-clamp-2">
                        {course.name}
                    </h3>
                    {course.shortName && (
                        <span className="shrink-0 px-2.5 py-1 text-xs font-semibold rounded-[var(--radius-sm)] bg-[var(--color-amber-50)] text-[var(--color-amber-700)]">
                            {course.shortName}
                        </span>
                    )}
                </div>

                {course.specialization && (
                    <p className="text-sm text-[var(--muted)] mb-3 line-clamp-1">
                        {course.specialization}
                    </p>
                )}
            </div>

            <div className="mt-auto pt-4 flex items-center justify-between border-t border-[var(--border)]">
                <div className="text-sm font-medium text-[var(--muted)] flex items-center">
                    <Calendar className="w-4 h-4 mr-1.5" />
                    <span>
                        {course.duration
                            ? `${Math.floor(course.duration / 12) > 0 ? `${Math.floor(course.duration / 12)} Yrs ` : ''}${course.duration % 12 > 0 ? `${course.duration % 12} Mos` : ''}`
                            : 'N/A'}
                    </span>
                </div>

                {fee !== undefined && (
                    <div className="inline-flex items-baseline px-2.5 py-1 bg-[var(--color-success)]/10 text-[var(--color-success)] rounded-[var(--radius-sm)] text-sm font-semibold">
                        ₹{Number(fee).toLocaleString()}
                        <span className="text-[10px] font-medium opacity-80 ml-1 uppercase tracking-wider">
                            Total
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseCard;
