import { BookOpen } from 'lucide-react';
import CourseCard from './CourseCard';

const CourseList = ({ courses }) => {
    return (
        <div className="card mb-8">
            <h2 className="text-2xl mb-6 text-[var(--foreground)] flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                Offered Courses ({courses?.length || 0})
            </h2>

            {courses && courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courses.map(course => (
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
