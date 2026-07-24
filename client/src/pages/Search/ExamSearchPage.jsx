import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, Search } from 'lucide-react';
import useExamSearch from '../../features/search/hooks/useExamSearch';
import ExamGlobalSearch from '../../features/search/components/ExamGlobalSearch';
import PopularExamSearches from '../../features/search/components/PopularExamSearches';
import ExamResultCard from '../../features/search/components/ExamResultCard';

const ExamSearchPage = () => {
    const [searchParams] = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    const navigate = useNavigate();

    const { 
        query, 
        setQuery, 
        filters, 
        setFilters, 
        results, 
        latestLiveExams, 
        isLoading, 
        error 
    } = useExamSearch();

    useEffect(() => {
        if (initialQuery && !query) {
            setQuery(initialQuery);
        }
    }, [initialQuery, setQuery, query]);

    const handleResultClick = exam => {
        navigate(`/exam/${exam._id}`);
    };

    const isSearching = query.trim() || filters.status !== 'all' || filters.mode !== 'all';

    return (
        <main className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
            <div className="flex justify-center mb-10">
                <ExamGlobalSearch 
                    query={query}
                    setQuery={setQuery}
                    filters={filters}
                    setFilters={setFilters}
                />
            </div>

            {!isSearching ? (
                <PopularExamSearches latestLiveExams={latestLiveExams} />
            ) : (
                <div className="mt-4">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-medium text-[var(--ring)]">
                            {query ? (
                                <>
                                    Search results for{' '}
                                    <span className="text-[var(--foreground)] font-semibold">
                                        "{query}"
                                    </span>
                                </>
                            ) : (
                                <>Filtered Exams</>
                            )}
                        </h2>
                        <span className="text-sm text-[var(--ring)]">
                            {results.length} {results.length === 1 ? 'result' : 'results'} found
                        </span>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center p-12 text-[var(--ring)]">
                            <Loader2 className="w-8 h-8 animate-spin mb-4" />
                            <p className="text-lg">
                                Searching exams...
                            </p>
                        </div>
                    ) : error ? (
                        <div className="p-8 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-3xl border border-red-200 dark:border-red-800 text-center">
                            <p className="text-lg">{error}</p>
                        </div>
                    ) : results.length > 0 ? (
                        <div className="grid gap-4">
                            {results.map(exam => (
                                <ExamResultCard
                                    key={exam._id}
                                    exam={exam}
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
                                No exams found
                            </h3>
                            <p className="text-[var(--ring)]">
                                Try adjusting your search query or removing some filters.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </main>
    );
};

export default ExamSearchPage;
