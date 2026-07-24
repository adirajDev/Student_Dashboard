import { Calendar } from 'lucide-react';

const CourseCard = ({ course }) => {
    return (
        <div
            id={`course-${course._id}`}
            className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
        >
            <h3 className="font-semibold text-lg text-[var(--foreground)] mb-2">
                {course.name}
            </h3>
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                <span>Regular Program</span>
            </div>
        </div>
    );
};

export default CourseCard;
