import { BookOpen } from 'lucide-react';
import CourseCard from './CourseCard';

const CourseList = ({ courses }) => {
    return (
        <div className="card mb-8">
            <h2 className="text-2xl mb-6 text-[var(--foreground)] font-display flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-[var(--color-ink-500)]" />
                Offered Courses ({courses?.length || 0})
            </h2>

            {courses && courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courses.map(item => {
                        const courseData =
                            item.course && typeof item.course === 'object'
                                ? item.course
                                : item;
                        return (
                            <CourseCard
                                key={item._id || courseData._id}
                                course={courseData}
                                fee={item.fee}
                            />
                        );
                    })}
                </div>
            ) : (
                <div className="p-8 text-center border border-[var(--border)] border-dashed rounded-[var(--radius-xl)] text-[var(--muted)]">
                    This college currently has no courses listed.
                </div>
            )}
        </div>
    );
};

export default CourseList;
