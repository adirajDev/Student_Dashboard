import { useEffect, useRef } from 'react';
import { Search, MapPin, BookOpen, Loader2, X } from 'lucide-react';
import useGlobalSearch from '../../hooks/useGlobalSearch';

const GlobalSearch = () => {
    const { query, setQuery, results, isLoading, error, isOpen, setIsOpen } = useGlobalSearch();
    const searchRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setIsOpen]);

    return (
        <div className="relative w-full max-w-xl mx-4" ref={searchRef}>
            {/* Search Input */}
            <div className="relative flex items-center">
                <Search className="absolute left-3 w-5 h-5 text-[var(--ring)]" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder="Search courses and colleges..."
                    className="w-full pl-10 pr-10 py-2 rounded-full border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                />
                {query && (
                    <button 
                        onClick={() => {
                            setQuery('');
                            setIsOpen(false);
                        }}
                        className="absolute right-3 p-1 rounded-full text-[var(--ring)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Dropdown Results */}
            {isOpen && query.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-xl overflow-hidden z-50 max-h-[70vh] overflow-y-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center p-8 text-[var(--ring)]">
                            <Loader2 className="w-6 h-6 animate-spin mr-2" />
                            <span>Searching...</span>
                        </div>
                    ) : error ? (
                        <div className="p-4 text-red-500 text-center">{error}</div>
                    ) : results.length > 0 ? (
                        <div className="py-2">
                            <div className="px-4 py-2 text-xs font-semibold text-[var(--ring)] uppercase tracking-wider bg-slate-50 dark:bg-slate-800/50">
                                Matching Colleges
                            </div>
                            {results.map((college) => (
                                <div key={college._id} className="px-4 py-3 border-b border-[var(--border)] last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <h4 className="font-semibold text-[var(--foreground)]">{college.name}</h4>
                                    
                                    {college.location && (
                                        <div className="flex items-center text-sm text-[var(--ring)] mt-1">
                                            <MapPin className="w-3.5 h-3.5 mr-1" />
                                            {college.location}
                                        </div>
                                    )}
                                    
                                    {college.availableCourses && college.availableCourses.length > 0 && (
                                        <div className="mt-2">
                                            <div className="flex items-center text-xs text-[var(--ring)] mb-1">
                                                <BookOpen className="w-3 h-3 mr-1" />
                                                Offered Courses:
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                                {college.availableCourses.map((course) => {
                                                    // Highlight if course name matches query
                                                    const isMatch = course.name.toLowerCase().includes(query.toLowerCase());
                                                    return (
                                                        <span 
                                                            key={course._id} 
                                                            className={`text-xs px-2 py-1 rounded-md ${
                                                                isMatch 
                                                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800' 
                                                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                                            }`}
                                                        >
                                                            {course.name}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-[var(--ring)]">
                            No colleges or courses found for "{query}".
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GlobalSearch;
