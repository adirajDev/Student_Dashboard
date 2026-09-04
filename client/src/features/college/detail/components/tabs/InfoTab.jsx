import { useState } from 'react';
import { Building, MapPin, BookOpen, Star, Hash } from 'lucide-react';
import { formatLocation } from '@/constants/states.js';

const Fact = ({ icon: Icon, label, value }) => {
    if (!value && value !== 0) return null;
    return (
        <div className="flex items-start gap-3 p-4 surface-wash border border-[var(--border)] rounded-[var(--radius-md)]">
            <Icon className="w-4 h-4 mt-0.5 text-[var(--color-ink-400)] shrink-0" />
            <div className="min-w-0">
                <p className="text-xs uppercase tracking-wider text-[var(--muted)] font-semibold mb-0.5">
                    {label}
                </p>
                <p className="text-sm text-[var(--foreground)] font-medium break-words">
                    {value}
                </p>
            </div>
        </div>
    );
};

const InfoTab = ({ college }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const hasOverview = Boolean(college.overview);
    const courseCount = college.availableCourses?.length || 0;

    return (
        <div className="space-y-8">
            {hasOverview && (
                <section className="card">
                    <h2 className="text-2xl mb-4 text-[var(--foreground)] font-display flex items-center">
                        <Building className="w-5 h-5 mr-2 text-[var(--color-ink-500)]" />
                        Overview
                    </h2>
                    <div
                        className={`prose max-w-none text-[var(--foreground)] opacity-90 whitespace-pre-wrap ${
                            !isExpanded ? 'line-clamp-6' : ''
                        }`}
                    >
                        {college.overview}
                    </div>
                    {college.overview.length > 300 && (
                        <button
                            type="button"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="mt-3 text-[var(--color-amber-600)] font-medium hover:text-[var(--color-amber-700)] hover:underline transition-all text-sm"
                        >
                            {isExpanded ? 'Show Less' : 'Read full overview →'}
                        </button>
                    )}
                </section>
            )}

            <section className="card">
                <h2 className="text-2xl mb-6 text-[var(--foreground)] font-display">
                    Quick Facts
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Fact
                        icon={Building}
                        label="Institute Type"
                        value={college.type}
                    />
                    <Fact
                        icon={MapPin}
                        label="Location"
                        value={formatLocation(college)}
                    />
                    <Fact
                        icon={Hash}
                        label="College ID"
                        value={
                            college.collegeId || college._id?.substring(0, 8)
                        }
                    />
                    <Fact
                        icon={BookOpen}
                        label="Courses Offered"
                        value={courseCount > 0 ? courseCount : null}
                    />
                    <Fact
                        icon={Star}
                        label="Rating"
                        value={
                            college.totalRatings > 0
                                ? `${Number(college.averageRating).toFixed(1)} / 5 (${college.totalRatings} reviews)`
                                : null
                        }
                    />
                </div>
            </section>

            {!hasOverview && (
                <p className="text-center text-[var(--muted)] py-4">
                    This college has not published a detailed overview yet.
                </p>
            )}
        </div>
    );
};

export default InfoTab;
