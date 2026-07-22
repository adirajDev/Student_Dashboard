import { useOutletContext, useSearchParams } from 'react-router-dom';
import { User as UserIcon, BookOpen, Phone, Mail } from 'lucide-react';
import MyReviewsTab from '../../features/rating/components/MyReviewsTab';

const StudentDashboard = () => {
    const { user } = useOutletContext();
    const [searchParams] = useSearchParams();

    const activeTab = searchParams.get('tab') || 'overview';

    return (
        <main className="max-w-5xl mx-auto px-4 py-8">
            {activeTab === 'overview' && (
                <div className="animate-fade-in">
                    <div className="mb-8">
                        <h2 className="text-3xl mb-2">
                            Welcome back, {user.name.split(' ')[0]}! 👋
                        </h2>
                        <p className="text-[var(--ring)]">
                            Here is an overview of your student profile.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                        <div className="bg-[var(--card)] p-5 md:p-6 rounded-3xl border border-[var(--border)] shadow-sm hover:shadow-md transition-all group">
                            <div className="flex items-center gap-3 mb-2 text-[var(--ring)] group-hover:text-[var(--foreground)] transition-colors">
                                <UserIcon className="w-5 h-5" />
                                <span className="text-sm font-medium">
                                    Full Name
                                </span>
                            </div>
                            <p className="text-xl font-semibold text-[var(--foreground)]">
                                {user.name}
                            </p>
                        </div>

                        <div className="bg-[var(--card)] p-5 md:p-6 rounded-3xl border border-[var(--border)] shadow-sm hover:shadow-md transition-all group">
                            <div className="flex items-center gap-3 mb-2 text-[var(--ring)] group-hover:text-[var(--foreground)] transition-colors">
                                <Mail className="w-5 h-5" />
                                <span className="text-sm font-medium">
                                    Email Address
                                </span>
                            </div>
                            <p
                                className="text-xl font-semibold text-[var(--foreground)] truncate"
                                title={user.email}
                            >
                                {user.email}
                            </p>
                        </div>

                        <div className="bg-[var(--card)] p-5 md:p-6 rounded-3xl border border-[var(--border)] shadow-sm hover:shadow-md transition-all group">
                            <div className="flex items-center gap-3 mb-2 text-[var(--ring)] group-hover:text-[var(--foreground)] transition-colors">
                                <BookOpen className="w-5 h-5" />
                                <span className="text-sm font-medium">
                                    Enrolled Course
                                </span>
                            </div>
                            <p className="text-xl font-semibold text-[var(--foreground)]">
                                {user.course?.name || user.course || 'N/A'}
                            </p>
                        </div>

                        <div className="bg-[var(--card)] p-5 md:p-6 rounded-3xl border border-[var(--border)] shadow-sm hover:shadow-md transition-all group">
                            <div className="flex items-center gap-3 mb-2 text-[var(--ring)] group-hover:text-[var(--foreground)] transition-colors">
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    />
                                </svg>
                                <span className="text-sm font-medium">
                                    College
                                </span>
                            </div>
                            <p className="text-xl font-semibold text-[var(--foreground)]">
                                {user.college?.name || user.college || 'N/A'}
                            </p>
                        </div>

                        <div className="bg-[var(--card)] p-5 md:p-6 rounded-3xl border border-[var(--border)] shadow-sm hover:shadow-md transition-all group">
                            <div className="flex items-center gap-3 mb-2 text-[var(--ring)] group-hover:text-[var(--foreground)] transition-colors">
                                <Phone className="w-5 h-5" />
                                <span className="text-sm font-medium">
                                    Phone Number
                                </span>
                            </div>
                            <p className="text-xl font-semibold text-[var(--foreground)]">
                                {user.phone}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'reviews' && <MyReviewsTab user={user} />}
        </main>
    );
};

export default StudentDashboard;
