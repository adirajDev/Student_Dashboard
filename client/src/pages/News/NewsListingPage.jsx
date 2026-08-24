import { useNavigate } from 'react-router-dom';
import { Filter, Newspaper } from 'lucide-react';
import NewsCard from '@/features/news/components/NewsCard';
import useNews from '@/features/news/hooks/useNews';
import useNewsFilters from '@/features/news/hooks/useNewsFilters';
import SearchBar from '@/features/search/components/SearchBar';
import Loading from '@/components/common/Loading';
import Error from '@/components/common/Error';
import NoResultsFound from '@/components/common/NoResultsFound';

const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
];

const NewsListingPage = () => {
    const navigate = useNavigate();
    const { news, isLoading, error } = useNews(true);
    const { filters, setFilters, results, hasActiveFilters, clearFilters } =
        useNewsFilters(news);

    const handleNewsClick = item => {
        navigate(`/news/${item._id}`);
    };

    return (
        <div className="min-h-screen surface-paper animate-fade-in pt-2 pb-8">
            <main className="max-w-6xl mx-auto px-4 mt-4">
                <div className="mb-8">
                    <h1 className="text-3xl text-[var(--foreground)] font-display mb-2">
                        Latest News
                    </h1>
                    <p className="text-[var(--muted)]">
                        Announcements, updates and notices in one place
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main List Column */}
                    <div className="flex-1">
                        {/*
                        <div className="mb-4">
                            <SearchBar
                                value={filters.query}
                                onChange={val =>
                                    setFilters({ ...filters, query: val })
                                }
                                onClear={() =>
                                    setFilters({ ...filters, query: '' })
                                }
                                placeholder="Search news..."
                            />
                        </div>

                        <div className="mb-4 flex justify-between items-center text-sm font-medium text-[var(--muted)]">
                            <span>Showing {results.length} articles</span>
                        </div>
                        */}

                        {error && <Error error={error} />}

                        {isLoading ? (
                            <Loading />
                        ) : results.length > 0 ? (
                            <div className="flex flex-col gap-6">
                                {results.map(item => (
                                    <NewsCard
                                        key={item._id}
                                        news={item}
                                        onClick={handleNewsClick}
                                    />
                                ))}
                            </div>
                        ) : filters.query ? (
                            <NoResultsFound searchTerm={filters.query} />
                        ) : (
                            <div className="card-interactive p-10 flex flex-col items-center text-center">
                                <div className="w-14 h-14 mb-4 bg-[var(--color-ink-50)] border border-[var(--border)] rounded-[var(--radius-md)] flex items-center justify-center text-[var(--color-ink-600)]">
                                    <Newspaper className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-display text-[var(--foreground)] mb-1">
                                    Nothing here yet
                                </h3>
                                <p className="text-[var(--muted)] text-sm">
                                    {hasActiveFilters
                                        ? 'No articles match these filters.'
                                        : 'News articles will show up here once they are published.'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar for Filters */}
                    <div className="w-full lg:w-80 shrink-0">
                        <div className="sticky top-[100px]">
                            <div className="">
                                <div className="flex items-center gap-2 mb-6 border-b border-[var(--border)] pb-4">
                                    <Filter className="w-5 h-5 text-[var(--color-ink-600)]" />
                                    <h3 className="text-lg text-[var(--foreground)] font-display">
                                        Filter News
                                    </h3>
                                </div>

                                <div className="space-y-8">
                                    {/* Sort (Segmented Control) */}
                                    <div>
                                        <label className="block text-sm font-semibold text-[var(--foreground)] mb-3">
                                            Sort By
                                        </label>
                                        <div className="flex bg-[var(--color-ink-50)] p-1 rounded-[var(--radius-md)]">
                                            {SORT_OPTIONS.map(option => (
                                                <button
                                                    key={option.value}
                                                    onClick={() =>
                                                        setFilters({
                                                            ...filters,
                                                            sort: option.value,
                                                        })
                                                    }
                                                    className={`flex-1 py-2 text-sm font-medium rounded-[var(--radius-sm)] transition-all ${
                                                        filters.sort ===
                                                        option.value
                                                            ? 'bg-[var(--card)] text-[var(--color-ink-700)] shadow-sm'
                                                            : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                                                    }`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Month (Select Dropdown) */}
                                    <div>
                                        <label className="block text-sm font-semibold text-[var(--foreground)] mb-3">
                                            Published Month
                                        </label>
                                        <select
                                            value={filters.month || 'all'}
                                            onChange={e =>
                                                setFilters({
                                                    ...filters,
                                                    month: e.target.value,
                                                })
                                            }
                                            className="w-full bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-md)] px-4 py-3 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--color-ink-500)] focus:ring-1 focus:ring-[var(--color-ink-500)] transition-colors"
                                        >
                                            <option value="all">
                                                Any Month
                                            </option>
                                            {MONTHS.map((m, i) => (
                                                <option
                                                    key={i}
                                                    value={i.toString()}
                                                >
                                                    {m}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {hasActiveFilters && (
                                        <button
                                            onClick={clearFilters}
                                            className="w-full py-3 mt-4 rounded-[var(--radius-md)] text-sm font-medium text-[var(--color-danger)] bg-red-50 hover:bg-[var(--color-danger)]/10 transition-colors"
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

export default NewsListingPage;