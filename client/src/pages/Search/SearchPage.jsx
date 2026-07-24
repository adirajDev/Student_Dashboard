import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, Search } from 'lucide-react';
import useGlobalSearch from '../../features/search/hooks/useGlobalSearch';
import GlobalSearch from '../../features/search/components/GlobalSearch';
import PopularSearches from '../../features/search/components/PopularSearches';
import CollegeCard from '../../features/college/components/CollegeCard';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const navigate = useNavigate();

    const { setQuery, results, isLoading, error } = useGlobalSearch();

    useEffect(() => {
        setQuery(query);
    }, [query, setQuery]);

    const handleResultClick = college => {
        const matchedCourse = college.availableCourses?.find(course =>
            course.name.toLowerCase().includes(query.toLowerCase())
        );

        if (matchedCourse) {
            navigate(`/college/${college._id}#course-${matchedCourse._id}`);
        } else {
            navigate(`/college/${college._id}`);
        }
    };

    return (
        <main className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
            <div className="flex justify-center mb-10">
                <GlobalSearch />
            </div>

            {!query.trim() ? (
                <PopularSearches />
            ) : (
                <div className="mt-4">
                    <h2 className="text-xl font-medium text-[var(--ring)] mb-6">
                        Search results for{' '}
                        <span className="text-[var(--foreground)] font-semibold">
                            "{query}"
                        </span>
                    </h2>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center p-12 text-[var(--ring)]">
                            <Loader2 className="w-8 h-8 animate-spin mb-4" />
                            <p className="text-lg">
                                Searching colleges and courses...
                            </p>
                        </div>
                    ) : error ? (
                        <div className="p-8 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-3xl border border-red-200 dark:border-red-800 text-center">
                            <p className="text-lg">{error}</p>
                        </div>
                    ) : results.length > 0 ? (
                        <div className="grid gap-4">
                            {results.map(college => (
                                <CollegeCard
                                    key={college._id}
                                    college={college}
                                    query={query}
                                    onClick={handleResultClick}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center bg-[var(--card)] rounded-3xl border border-[var(--border)]">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-[var(--ring)]" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                No results found
                            </h3>
                            <p className="text-[var(--ring)]">
                                We couldn't find any colleges or courses
                                matching your search.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </main>
    );
};

export default SearchPage;
