import {
    LayoutDashboard,
    Users,
    GraduationCap,
    School,
    BookOpen,
    FileText,
    Loader2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useOverviewStats from '../hooks/useOverviewStats';

const OverviewSection = ({ user, shouldFetch }) => {
    const { stats, isLoading, error } = useOverviewStats(shouldFetch);
    const navigate = useNavigate();

    if (!shouldFetch) return null;

    return (
        <div className="mb-8 animate-fade-in">
            <h2 className="text-3xl mb-2">
                Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h2>
            <p className="text-[var(--ring)]">
                Here is an overview of your management portal.
            </p>

            {isLoading ? (
                <div className="mt-8 flex justify-center items-center min-h-[300px]">
                    <Loader2 className="w-8 h-8 animate-spin text-[var(--ring)]" />
                </div>
            ) : error ? (
                <div className="mt-8 p-8 border-2 border-dashed border-red-200 rounded-3xl text-center text-red-500 flex flex-col items-center justify-center min-h-[300px]">
                    <p>{error}</p>
                </div>
            ) : stats ? (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div
                        className="card-interactive flex items-center gap-5"
                        onClick={() => navigate('?tab=students')}
                        role="button"
                        tabIndex={0}
                    >
                        <div className="p-4 bg-[var(--color-ink-50)] text-[var(--color-ink-600)] rounded-[var(--radius-lg)]">
                            <Users className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="stat-label">Total Students</p>
                            <h3 className="stat-figure text-3xl mt-1">
                                {stats.students}
                            </h3>
                        </div>
                    </div>
                    <div
                        className="card-interactive flex items-center gap-5"
                        onClick={() => navigate('?tab=editors')}
                        role="button"
                        tabIndex={0}
                    >
                        <div className="p-4 bg-[var(--color-ink-50)] text-[var(--color-ink-600)] rounded-[var(--radius-lg)]">
                            <GraduationCap className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="stat-label">Total Editors</p>
                            <h3 className="stat-figure text-3xl mt-1">
                                {stats.editors}
                            </h3>
                        </div>
                    </div>

                    <div
                        className="card-interactive flex items-center gap-5"
                        onClick={() => navigate('?tab=bloggers')}
                        role="button"
                        tabIndex={0}
                    >
                        <div className="p-4 bg-[var(--color-ink-50)] text-[var(--color-ink-600)] rounded-[var(--radius-lg)]">
                            <GraduationCap className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="stat-label">Total Bloggers</p>
                            <h3 className="stat-figure text-3xl mt-1">
                                {stats.bloggers}
                            </h3>
                        </div>
                    </div>
                    <div
                        className="card-interactive flex items-center gap-5"
                        onClick={() => navigate('?tab=colleges')}
                        role="button"
                        tabIndex={0}
                    >
                        <div className="p-4 bg-[var(--color-ink-50)] text-[var(--color-ink-600)] rounded-[var(--radius-lg)]">
                            <School className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="stat-label">Total Colleges</p>
                            <h3 className="stat-figure text-3xl mt-1">
                                {stats.colleges}
                            </h3>
                        </div>
                    </div>
                    <div
                        className="card-interactive flex items-center gap-5"
                        onClick={() => navigate('?tab=courses')}
                        role="button"
                        tabIndex={0}
                    >
                        <div className="p-4 bg-[var(--color-ink-50)] text-[var(--color-ink-600)] rounded-[var(--radius-lg)]">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="stat-label">Total Courses</p>
                            <h3 className="stat-figure text-3xl mt-1">
                                {stats.courses}
                            </h3>
                        </div>
                    </div>
                    <div
                        className="card-interactive flex items-center gap-5"
                        onClick={() => navigate('?tab=exams')}
                        role="button"
                        tabIndex={0}
                    >
                        <div className="p-4 bg-[var(--color-ink-50)] text-[var(--color-ink-600)] rounded-[var(--radius-lg)]">
                            <FileText className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="stat-label">Total Exams</p>
                            <h3 className="stat-figure text-3xl mt-1">
                                {stats.exams}
                            </h3>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mt-8 p-8 border-2 border-dashed border-slate-200 rounded-3xl text-center text-[var(--ring)] flex flex-col items-center justify-center min-h-[300px]">
                    <LayoutDashboard className="w-12 h-12 mb-4 text-slate-300" />
                    <p className="text-lg">
                        Select an option from the sidebar to manage users.
                    </p>
                </div>
            )}
        </div>
    );
};

export default OverviewSection;
