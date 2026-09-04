import { MapPin, BookOpen, Star, Building2 } from 'lucide-react';
import { formatLocation } from '@/constants/states.js';

const formatPackage = pkg => {
    if (!pkg) return null;
    let str = String(pkg).trim();

    const hasLetters = /[a-zA-Z]/.test(str);
    const hasCurrency = str.includes('₹') || str.toLowerCase().includes('rs');

    let result = str;
    if (!hasCurrency) result = `₹${result}`;
    if (!hasLetters) result = `${result} LPA`;

    return result;
};

const CollegeCard = ({ college, query = '', onClick }) => {
    return (
        <div
            onClick={() => onClick(college)}
            className="card-interactive p-5 cursor-pointer group flex flex-col"
        >
            {/* Top Header Section */}
            <div className="flex items-start gap-4 mb-4">
                {/* Generic Logo Placeholder */}
                <div className="w-14 h-14 shrink-0 bg-[var(--color-ink-50)] border border-[var(--border)] rounded-[var(--radius-md)] flex items-center justify-center text-[var(--color-ink-600)]">
                    <Building2 className="w-7 h-7" />
                </div>

                {/* Title, Location & Rating */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-xl text-[var(--foreground)] font-display truncate">
                        {college.name}
                    </h3>
                    <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center text-sm text-[var(--muted)]">
                            <MapPin className="w-4 h-4 mr-1" />
                            {formatLocation(college)}
                        </div>
                        {college.averageRating > 0 && (
                            <div className="flex items-center text-sm font-medium text-[var(--foreground)]">
                                <Star className="w-4 h-4 text-amber-400 mr-1 fill-amber-400" />
                                {college.averageRating.toFixed(1)}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <hr className="border-[var(--border)] mb-4" />

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
                {/* Courses */}
                <div>
                    <p className="text-sm text-[var(--muted)] mb-1">
                        Courses Offered
                    </p>
                    <div className="flex items-center text-[var(--foreground)] font-medium">
                        <span>
                            {college.availableCourses?.length || 0} Courses
                        </span>
                    </div>
                </div>

                {/* Median Package */}
                {college.placementDetails?.averagePackage && (
                    <div>
                        <p className="text-sm text-[var(--muted)] mb-1">
                            Median Package
                        </p>
                        <div className="flex items-center text-[var(--foreground)] font-medium truncate">
                            <span>
                                {formatPackage(
                                    college.placementDetails.averagePackage
                                )}
                            </span>
                        </div>
                    </div>
                )}

                {/* Highest Package */}
                {college.placementDetails?.highestPackage && (
                    <div>
                        <p className="text-sm text-[var(--muted)] mb-1">
                            Highest Package
                        </p>
                        <div className="flex items-center text-[var(--foreground)] font-medium truncate">
                            <span>
                                {formatPackage(
                                    college.placementDetails.highestPackage
                                )}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Matching Courses (Only shown if searching) */}
            {college.availableCourses &&
                college.availableCourses.length > 0 &&
                query && (
                    <div className="mt-5 pt-4 border-t border-[var(--border)]">
                        <div className="flex items-center text-sm font-medium text-[var(--muted)] mb-2">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Matching Courses:
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {college.availableCourses.map(course => {
                                const isMatch = course.name
                                    .toLowerCase()
                                    .includes(query.toLowerCase());
                                if (!isMatch) return null;
                                return (
                                    <span
                                        key={course._id}
                                        className="text-sm px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--color-ink-50)] text-[var(--color-ink-700)] border border-[var(--color-ink-200)]"
                                    >
                                        {course.name}
                                    </span>
                                );
                            })}
                            {college.availableCourses.filter(
                                c =>
                                    !c.name
                                        .toLowerCase()
                                        .includes(query.toLowerCase())
                            ).length > 0 && (
                                <span className="text-sm px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--background)] text-[var(--muted)] border border-[var(--border)]">
                                    +
                                    {
                                        college.availableCourses.filter(
                                            c =>
                                                !c.name
                                                    .toLowerCase()
                                                    .includes(
                                                        query.toLowerCase()
                                                    )
                                        ).length
                                    }{' '}
                                    other courses
                                </span>
                            )}
                        </div>
                    </div>
                )}
        </div>
    );
};

export default CollegeCard;
