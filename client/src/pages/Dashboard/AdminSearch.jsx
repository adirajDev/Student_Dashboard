import { useState, useEffect } from 'react';
import { Search, MapPin, BookOpen, Loader2, ArrowRight } from 'lucide-react';
import useGlobalSearch from '../../hooks/useGlobalSearch';
import { useNavigate } from 'react-router-dom';

const POPULAR_SEARCHES = [
    "Computer Science",
    "Engineering",
    "Medical",
    "Business Administration",
    "Arts & Humanities",
    "Delhi",
    "Mumbai"
];

const AdminSearch = () => {
    const [inputValue, setInputValue] = useState('');
    const { setQuery, results, isLoading, error } = useGlobalSearch();
    const navigate = useNavigate();

    useEffect(() => {
        setQuery(inputValue);
    }, [inputValue, setQuery]);

    const handleResultClick = (college) => {
        const matchedCourse = college.availableCourses?.find(
            course => course.name.toLowerCase().includes(inputValue.toLowerCase())
        );
        
        if (matchedCourse) {
            navigate(`/college/${college._id}#course-${matchedCourse._id}`);
        } else {
            navigate(`/college/${college._id}`);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-4">
            <div className="relative flex items-center mb-10">
                <Search className="absolute left-4 w-6 h-6 text-[var(--ring)] pointer-events-none" />
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Search courses and colleges..."
                    className="w-full pl-14 pr-6 py-4 rounded-full border-2 border-[var(--border)] bg-[var(--card)] text-lg text-[var(--foreground)] focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                />
            </div>

            {!inputValue.trim() ? (
                <div className="mt-8 animate-fade-in">
                    <h2 className="text-2xl font-semibold mb-6 text-[var(--foreground)]">Popular Searches</h2>
                    <div className="flex flex-wrap gap-3">
                        {POPULAR_SEARCHES.map((term, i) => (
                            <button
                                key={i}
                                onClick={() => setInputValue(term)}
                                className="px-5 py-3 rounded-full bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-2"
                            >
                                {term}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="animate-fade-in">
                    <h2 className="text-xl font-medium text-[var(--ring)] mb-6">
                        Search results for <span className="text-[var(--foreground)] font-semibold">"{inputValue}"</span>
                    </h2>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center p-12 text-[var(--ring)]">
                            <Loader2 className="w-8 h-8 animate-spin mb-4" />
                            <p className="text-lg">Searching colleges and courses...</p>
                        </div>
                    ) : error ? (
                        <div className="p-8 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-3xl border border-red-200 dark:border-red-800 text-center">
                            <p className="text-lg">{error}</p>
                        </div>
                    ) : results.length > 0 ? (
                        <div className="grid gap-4">
                            {results.map(college => (
                                <div 
                                    key={college._id}
                                    onClick={() => handleResultClick(college)}
                                    className="p-6 bg-[var(--card)] rounded-3xl border border-[var(--border)] shadow-sm hover:shadow-md transition-all cursor-pointer group"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">
                                                {college.name}
                                            </h3>
                                            {college.location && (
                                                <div className="flex items-center text-[var(--ring)] mt-2">
                                                    <MapPin className="w-4 h-4 mr-1" />
                                                    {college.location}
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-[var(--ring)] group-hover:text-blue-500 transition-colors">
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                    
                                    {college.availableCourses && college.availableCourses.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-[var(--border)]">
                                            <div className="flex items-center text-sm text-[var(--ring)] mb-2">
                                                <BookOpen className="w-4 h-4 mr-1.5" />
                                                Matching Courses:
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {college.availableCourses.map((course) => {
                                                    const isMatch = course.name.toLowerCase().includes(inputValue.toLowerCase());
                                                    if (!isMatch) return null;
                                                    return (
                                                        <span 
                                                            key={course._id} 
                                                            className="text-sm px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                                                        >
                                                            {course.name}
                                                        </span>
                                                    );
                                                })}
                                                {college.availableCourses.filter(c => !c.name.toLowerCase().includes(inputValue.toLowerCase())).length > 0 && (
                                                    <span className="text-sm px-3 py-1.5 rounded-lg bg-slate-50 text-[var(--ring)] dark:bg-slate-800 border border-[var(--border)]">
                                                        +{college.availableCourses.filter(c => !c.name.toLowerCase().includes(inputValue.toLowerCase())).length} other courses
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center bg-[var(--card)] rounded-3xl border border-[var(--border)]">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-[var(--ring)]" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">No results found</h3>
                            <p className="text-[var(--ring)]">We couldn't find any colleges or courses matching your search.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminSearch;
