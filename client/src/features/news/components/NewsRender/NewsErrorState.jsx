import { Link } from 'react-router-dom';
import { Newspaper, AlertTriangle } from 'lucide-react';

const NewsErrorState = ({ notFound, message, onRetry }) => {
    return (
        <div className="surface-paper min-h-screen flex items-center justify-center px-5 py-24">
            <div className="card-interactive p-10 max-w-md w-full flex flex-col items-center text-center">
                <div className="w-14 h-14 mb-4 bg-[var(--color-ink-50)] border border-[var(--border)] rounded-[var(--radius-md)] flex items-center justify-center text-[var(--color-ink-600)]">
                    {notFound ? (
                        <Newspaper className="w-7 h-7" />
                    ) : (
                        <AlertTriangle className="w-7 h-7 text-[var(--color-danger)]" />
                    )}
                </div>

                <h2 className="text-2xl font-display text-[var(--foreground)] mb-2">
                    {notFound ? 'Article not found' : 'Something went wrong'}
                </h2>
                <p className="text-sm text-[var(--muted)] mb-6">
                    {notFound
                        ? 'This article may have been removed or the link is wrong.'
                        : message || 'Could not load this article right now.'}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                    {!notFound && onRetry && (
                        <button
                            type="button"
                            onClick={onRetry}
                            className="btn-secondary"
                        >
                            Try again
                        </button>
                    )}
                    <Link to="/news" className="btn-primary">
                        Browse all news
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NewsErrorState;
