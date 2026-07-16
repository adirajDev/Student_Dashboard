import { BookOpen } from 'lucide-react';
import CourseCard from './CourseCard';

const CourseList = ({ courses }) => {
    return (
        <div>
            <div className="flex items-center gap-2 mb-6">
                <BookOpen className="w-6 h-6 text-blue-500" />
                <h2 className="text-2xl font-bold text-[var(--foreground)]">
                    Offered Courses ({courses?.length || 0})
                </h2>
            </div>

            {courses && courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courses.map((course) => (
                        <CourseCard key={course._id} course={course} />
                    ))}
                </div>
            ) : (
                <div className="p-8 text-center border border-[var(--border)] border-dashed rounded-xl text-[var(--ring)]">
                    This college currently has no courses listed.
                </div>
            )}
        </div>
    );
};

export default CourseList;
