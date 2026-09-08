import { Link } from 'react-router-dom';

/**
 * In-layout "this thing doesn't exist" state, for when a route matched but
 * the record behind it didn't. Distinct from <Error /> on purpose: a stale
 * or mistyped slug is not a system failure, so it isn't styled as one.
 *
 * Not the same as the top-level WrongUrl page, which handles no route
 * matching at all and renders outside any layout.
 */
const NotFoundState = ({
                           heading = '',
                           message = 'This page may have moved or the link may be out of date.',
                           to,
                           actionLabel,
                           children,
                       }) => (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-display text-[var(--foreground)] mb-3">
            {heading} not found.
        </h1>

        {message && (
            <p className="text-[var(--muted)] mb-8">{message}</p>
        )}

        {children ??
            (to && actionLabel ? (
                <Link to={to} className="btn-primary">
                    Browse all {actionLabel}
                </Link>
            ) : null)}
    </div>
);

export default NotFoundState;