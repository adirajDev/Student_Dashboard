import { useState, useRef, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import SearchBar from './SearchBar';

const ExamGlobalSearch = ({ query, setQuery, filters, setFilters }) => {
    const [showFilters, setShowFilters] = useState(false);
    const filterRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = e => {
            if (filterRef.current && !filterRef.current.contains(e.target)) {
                setShowFilters(false);
            }
        };
        if (showFilters) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showFilters]);

    return (
        <div className="relative w-full max-w-2xl mx-4 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
                <SearchBar
                    value={query}
                    onChange={setQuery}
                    onClear={() => setQuery('')}
                    placeholder="Search exams by name..."
                    className="relative w-full"
                />
            </div>

            <div className="relative" ref={filterRef}>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`h-[50px] px-6 rounded-full font-medium flex items-center justify-center gap-2 transition-all border ${
                        showFilters ||
                        filters.status !== 'all' ||
                        filters.mode !== 'all'
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md hover:bg-indigo-700'
                            : 'bg-[var(--card)] text-[var(--foreground)] border-[var(--border)] hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                    {(filters.status !== 'all' || filters.mode !== 'all') && (
                        <span className="w-2 h-2 rounded-full bg-white ml-1"></span>
                    )}
                </button>

                {/* Filter Popup */}
                {showFilters && (
                    <div className="absolute right-0 mt-3 w-72 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-3xl p-6 z-50 animate-fade-in-up">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-[var(--foreground)]">
                                Filter Exams
                            </h3>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--ring)] transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                                    Registration Status
                                </label>
                                <select
                                    value={filters.status}
                                    onChange={e =>
                                        setFilters({
                                            ...filters,
                                            status: e.target.value,
                                        })
                                    }
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="live">Live Now</option>
                                    <option value="upcoming">Upcoming</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                                    Exam Mode
                                </label>
                                <select
                                    value={filters.mode}
                                    onChange={e =>
                                        setFilters({
                                            ...filters,
                                            mode: e.target.value,
                                        })
                                    }
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                                >
                                    <option value="all">All Modes</option>
                                    <option value="Online">Online</option>
                                    <option value="Offline">Offline</option>
                                </select>
                            </div>

                            <button
                                onClick={() => {
                                    setFilters({ status: 'all', mode: 'all' });
                                }}
                                className="w-full mt-2 py-2 text-sm text-[var(--ring)] hover:text-indigo-600 transition-colors font-medium"
                            >
                                Clear all filters
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExamGlobalSearch;
