import { useMemo, useState } from 'react';
import CourseCard from '../parts/CourseCard';

/**
 * Replaces the old CourseList.jsx.
 *
 * Two changes from the old version: it takes `college` rather than
 * `courses` (uniform panel props), and the outer `.card` wrapper and
 * <h2> are gone — the tab strip already tells the user where they are.
 *
 * Fees live on the association (College.availableCourses[].fee), which is
 * why there is no separate Fees tab.
 */
const CoursesTab = ({ college }) => {
    const courses = college.availableCourses || [];
    const [level, setLevel] = useState('all');

    const normalised = useMemo(
        () =>
            courses.map(item => ({
                key: item._id || item.course?._id || item.name,
                fee: item.fee,
                course:
                    item.course && typeof item.course === 'object'
                        ? item.course
                        : item,
            })),
        [courses]
    );

    const levels = useMemo(() => {
        const set = new Set(
            normalised.map(item => item.course?.level).filter(Boolean)
        );
        return Array.from(set);
    }, [normalised]);

    const visible =
        level === 'all'
            ? normalised
            : normalised.filter(item => item.course?.level === level);

    if (courses.length === 0) {
        return (
            <div className="p-8 text-center border border-[var(--border)] border-dashed rounded-[var(--radius-xl)] text-[var(--muted)]">
                This college currently has no courses listed.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-[var(--muted)] font-medium">
                    {visible.length} of {courses.length} course
                    {courses.length === 1 ? '' : 's'}
                </p>

                {levels.length > 1 && (
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => setLevel('all')}
                            className={`px-3 py-1.5 rounded-[var(--radius-sm)] text-sm font-medium border transition-colors ${
                                level === 'all'
                                    ? 'bg-[var(--color-ink-800)] text-white border-[var(--color-ink-800)]'
                                    : 'surface-wash text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--color-ink-50)]'
                            }`}
                        >
                            All
                        </button>
                        {levels.map(item => (
                            <button
                                key={item}
                                type="button"
                                onClick={() => setLevel(item)}
                                className={`px-3 py-1.5 rounded-[var(--radius-sm)] text-sm font-medium border transition-colors ${
                                    level === item
                                        ? 'bg-[var(--color-ink-800)] text-white border-[var(--color-ink-800)]'
                                        : 'surface-wash text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--color-ink-50)]'
                                }`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {visible.map(item => (
                    <CourseCard
                        key={item.key}
                        course={item.course}
                        fee={item.fee}
                    />
                ))}
            </div>
        </div>
    );
};

export default CoursesTab;
