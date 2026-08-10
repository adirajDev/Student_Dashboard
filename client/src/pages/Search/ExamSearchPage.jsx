import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import ExamGlobalSearch from '../../features/search/components/ExamGlobalSearch';
import ExamCard from '../../features/exam/components/ExamCard';
import useExamSearch from '../../features/search/hooks/useExamSearch';
import Error from '../../components/common/Error';
import ExamSearchLoading from './ExamSearchLoading';
import ExamSearchEmpty from './ExamSearchEmpty';

const TOP_SEARCHES = ['GATE', 'JEE', 'UPSC', 'CAT', 'NEET'];

const ExamSearchPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialQuery = searchParams.get('q') || '';

    const { query, setQuery, filters, setFilters, results, isLoading, error } =
        useExamSearch(initialQuery);

    const handleExamClick = exam => {
        navigate(`/exam/${exam._id}`);
    };

    return (
        <div className="min-h-screen surface-paper animate-fade-in">
            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex justify-center mb-10">
                    <ExamGlobalSearch
                        query={query}
                        setQuery={setQuery}
                        filters={filters}
                        setFilters={setFilters}
                    />
                </div>

                {!query.trim() &&
                filters.status === 'all' &&
                filters.mode === 'all' ? (
                    <div className="mt-8">
                        <h2 className="text-2xl mb-6 font-display text-[var(--foreground)]">
                            Top Searches
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {TOP_SEARCHES.map((term, i) => (
                                <button
                                    key={i}
                                    onClick={() => setQuery(term)}
                                    className="px-5 py-3 rounded-[var(--radius-md)] bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--color-ink-50)] transition-colors shadow-sm flex items-center gap-2"
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="mt-4">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-display text-[var(--foreground)]">
                                {query ||
                                filters.status !== 'all' ||
                                filters.mode !== 'all'
                                    ? 'Search Results'
                                    : 'All Exams'}
                            </h2>
                            <span className="px-4 py-1.5 bg-[var(--color-ink-50)] rounded-[var(--radius-sm)] text-sm font-semibold text-[var(--color-ink-600)]">
                                {results.length} found
                            </span>
                        </div>

                        {error && <Error error={error} />}

                        {isLoading ? (
                            <ExamSearchLoading />
                        ) : results.length > 0 ? (
                            <div className="grid gap-4">
                                {results.map(exam => (
                                    <ExamCard
                                        key={exam._id}
                                        exam={exam}
                                        onClick={handleExamClick}
                                    />
                                ))}
                            </div>
                        ) : (
                            <ExamSearchEmpty query={query} filters={filters} />
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default ExamSearchPage;
