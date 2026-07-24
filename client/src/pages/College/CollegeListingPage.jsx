import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Loader2 } from 'lucide-react';
import CollegeCard from '../../features/college/components/CollegeCard';
import useCollegeSearch from '../../features/college/hooks/useCollegeSearch';
import Error from '../../components/common/Error';

const CollegeListingPage = () => {
    const navigate = useNavigate();
    const {
        filters,
        setFilters,
        results,
        isLoading,
        error,
        allColleges,
    } = useCollegeSearch('');

    const handleCollegeClick = college => {
        navigate(`/college/${college._id}`);
    };

    const handleLocationChange = locValue => {
        const currentLocs = Array.isArray(filters.location) ? filters.location : [];
        if (currentLocs.includes(locValue)) {
            setFilters({ ...filters, location: currentLocs.filter(l => l !== locValue) });
        } else {
            setFilters({ ...filters, location: [...currentLocs, locValue] });
        }
    };

    const handleCourseChange = courseValue => {
        const currentCourses = Array.isArray(filters.course) ? filters.course : [];
        if (currentCourses.includes(courseValue)) {
            setFilters({ ...filters, course: currentCourses.filter(c => c !== courseValue) });
        } else {
            setFilters({ ...filters, course: [...currentCourses, courseValue] });
        }
    };

    const uniqueLocations = useMemo(() => {
        const locs = allColleges.map(c => c.location).filter(Boolean);
        return [...new Set(locs)].sort();
    }, [allColleges]);

    const uniqueCourses = useMemo(() => {
        const courses = [];
        allColleges.forEach(c => {
            if (c.availableCourses) {
                c.availableCourses.forEach(ac => {
                    if (ac.name) courses.push(ac.name);
                });
            }
        });
        return [...new Set(courses)].sort();
    }, [allColleges]);

    return (
        <div className="min-h-screen bg-[var(--background)] animate-fade-in pb-12">
            <main className="max-w-6xl mx-auto px-4 mt-8">
                <div className="mb-8">
                    <h1 className="text-3xl text-[var(--foreground)] mb-2">
                        Top Colleges
                    </h1>
                    <p className="text-[var(--ring)]">
                        Explore and apply for top institutions
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main List Column */}
                    <div className="flex-1">
                        <div className="mb-4 flex justify-between items-center text-sm font-medium text-slate-600 dark:text-slate-400">
                            <span>Showing {results.length} colleges</span>
                        </div>

                        {error && <Error error={error} />}

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center p-12 text-[var(--ring)]">
                                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                                <p className="text-lg">Loading colleges...</p>
                            </div>
                        ) : results.length > 0 ? (
                            <div className="grid gap-6">
                                {results.map(college => (
                                    <CollegeCard
                                        key={college._id}
                                        college={college}
                                        onClick={handleCollegeClick}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center bg-[var(--card)] rounded-3xl border border-[var(--border)]">
                                <h3 className="text-xl font-semibold mb-2 text-[var(--foreground)]">
                                    No colleges found
                                </h3>
                                <p className="text-[var(--ring)]">
                                    Try adjusting your filters to see more results.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar for Filters */}
                    <div className="w-full lg:w-80 shrink-0">
                        <div className="sticky top-[100px]">
                            <div className="">
                                <div className="flex items-center gap-2 mb-6 border-b border-[var(--border)] pb-4">
                                    <Filter className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                    <h3 className="text-lg text-[var(--foreground)]">
                                        Filter Colleges
                                    </h3>
                                </div>

                                <div className="space-y-8">
                                    {/* Location (Checkboxes) */}
                                    {uniqueLocations.length > 0 && (
                                        <div>
                                            <label className="block text-sm font-semibold text-[var(--foreground)] mb-3">
                                                Location
                                            </label>
                                            <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                                {uniqueLocations.map(locValue => {
                                                    const isChecked = Array.isArray(filters.location) && filters.location.includes(locValue);
                                                    return (
                                                        <label key={locValue} className="flex items-center gap-3 cursor-pointer group">
                                                            <input 
                                                                type="checkbox" 
                                                                className="hidden" 
                                                                checked={isChecked}
                                                                onChange={() => handleLocationChange(locValue)}
                                                            />
                                                            <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors shrink-0 ${
                                                                isChecked 
                                                                    ? 'bg-indigo-600 border-indigo-600' 
                                                                    : 'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 group-hover:border-indigo-400'
                                                            }`}>
                                                                {isChecked && (
                                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                            <span className="text-sm font-medium text-[var(--foreground)] truncate" title={locValue}>{locValue}</span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Course (Checkboxes) */}
                                    {uniqueCourses.length > 0 && (
                                        <div>
                                            <label className="block text-sm font-semibold text-[var(--foreground)] mb-3">
                                                Course
                                            </label>
                                            <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                                {uniqueCourses.map(courseValue => {
                                                    const isChecked = Array.isArray(filters.course) && filters.course.includes(courseValue);
                                                    return (
                                                        <label key={courseValue} className="flex items-center gap-3 cursor-pointer group">
                                                            <input 
                                                                type="checkbox" 
                                                                className="hidden" 
                                                                checked={isChecked}
                                                                onChange={() => handleCourseChange(courseValue)}
                                                            />
                                                            <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors shrink-0 ${
                                                                isChecked 
                                                                    ? 'bg-indigo-600 border-indigo-600' 
                                                                    : 'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 group-hover:border-indigo-400'
                                                            }`}>
                                                                {isChecked && (
                                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                            <span className="text-sm font-medium text-[var(--foreground)] truncate" title={courseValue}>{courseValue}</span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {((Array.isArray(filters.location) && filters.location.length > 0) || (Array.isArray(filters.course) && filters.course.length > 0)) && (
                                        <button
                                            onClick={() => {
                                                setFilters({
                                                    location: [],
                                                    course: [],
                                                });
                                            }}
                                            className="w-full py-3 mt-4 rounded-xl text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/40 transition-colors"
                                        >
                                            Clear all filters
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CollegeListingPage;
