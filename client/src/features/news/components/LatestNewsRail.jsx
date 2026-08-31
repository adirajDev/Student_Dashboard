import { Link } from 'react-router-dom';
import { Newspaper, ArrowRight } from 'lucide-react';
import useLatestNews from '../hooks/useLatestNews';
import { getImageSrc, formatPublishedDate } from '../utils/newsUtils';

/**
 * Compact "Latest News" rail for detail-page sidebars.
 *
 * Deliberately not built on NewsCard: that card is a horizontal 220px-cover
 * layout that collapses to a full-width 16/9 block below `sm`, so five of
 * them in a 320px column would run several screens tall. This is a 64px
 * thumb + two-line title row instead.
 *
 * Takes no props and owns its own fetch, so dropping it into any page is a
 * one-line change.
 */

const NewsRow = ({ item }) => {
    const imageSrc = getImageSrc(item.coverImage);

    return (
        <li>
            <Link
                to={`/news/${item._id}`}
                className="group flex gap-3 items-start rounded-[var(--radius-md)] p-2 -m-2 transition-colors hover:bg-[var(--color-ink-50)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ink-800)]"
            >
                <div className="w-16 h-16 shrink-0 rounded-[var(--radius-sm)] overflow-hidden bg-[var(--color-ink-50)] border border-[var(--border)]">
                    {imageSrc ? (
                        <img
                            src={imageSrc}
                            alt=""
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--color-ink-400)]">
                            <Newspaper className="w-5 h-5" />
                        </div>
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-semibold leading-snug text-[var(--foreground)] line-clamp-2 group-hover:text-[var(--color-ink-950)]">
                        {item.title}
                    </h4>
                    <span className="block mt-1.5 text-xs text-[var(--muted)] font-medium">
                        {formatPublishedDate(item)}
                    </span>
                </div>
            </Link>
        </li>
    );
};

const RowSkeleton = () => (
    <li className="flex gap-3 items-start animate-pulse">
        <div className="w-16 h-16 shrink-0 rounded-[var(--radius-sm)] bg-[var(--color-ink-100)]" />
        <div className="flex-1 min-w-0 pt-1">
            <div className="h-3 rounded bg-[var(--color-ink-100)]" />
            <div className="h-3 mt-2 w-4/5 rounded bg-[var(--color-ink-100)]" />
            <div className="h-2.5 mt-3 w-1/2 rounded bg-[var(--color-ink-100)]" />
        </div>
    </li>
);

const LatestNewsRail = () => {
    const { news, isLoading, error, refetch } = useLatestNews();

    return (
        <section
            aria-labelledby="latest-news-heading"
            className="card p-5 sm:p-6"
        >
            <div className="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-2 min-w-0">
                    <Newspaper className="w-5 h-5 shrink-0 text-[var(--color-ink-600)]" />
                    <h3
                        id="latest-news-heading"
                        className="text-lg text-[var(--foreground)] font-display truncate"
                    >
                        Latest News
                    </h3>
                </div>

                <Link
                    to="/news"
                    className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-ink-600)] hover:text-[var(--foreground)] transition-colors"
                >
                    View all
                    <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>

            {isLoading ? (
                <ul className="space-y-5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <RowSkeleton key={i} />
                    ))}
                </ul>
            ) : error ? (
                <div className="py-2">
                    <p className="text-sm text-[var(--muted)]">{error}</p>
                    <button
                        type="button"
                        onClick={refetch}
                        className="mt-2 text-sm font-semibold text-[var(--foreground)] underline underline-offset-4 hover:no-underline"
                    >
                        Try again
                    </button>
                </div>
            ) : news.length === 0 ? (
                <p className="py-2 text-sm text-[var(--muted)]">
                    No news published yet. Check back soon.
                </p>
            ) : (
                <ul className="space-y-4">
                    {news.map(item => (
                        <NewsRow key={item._id} item={item} />
                    ))}
                </ul>
            )}
        </section>
    );
};

export default LatestNewsRail;