import { Link } from 'react-router-dom';
import { initialsOf } from './utils/postFormatters';

/**
 * Foot-of-article attribution. Renders nothing when the author wasn't
 * populated — an empty card is worse than no card.
 */
const PostAuthorCard = ({ author }) => {
    if (!author.name) return null;

    const hasCount = typeof author.postCount === 'number';

    return (
        <aside className="card mt-12 flex flex-wrap items-center gap-5">
            {author.avatar ? (
                <img
                    src={author.avatar}
                    alt=""
                    className="h-16 w-16 shrink-0 rounded-full border border-[var(--border)] object-cover"
                />
            ) : (
                <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[var(--color-ink-800)] font-display text-lg font-semibold text-[var(--color-amber-200)]">
                    {initialsOf(author.name)}
                </span>
            )}

            <div className="min-w-0 flex-1">
                <p className="stat-label">Written by</p>
                <h2 className="mt-1 text-xl">{author.name}</h2>
                {hasCount && (
                    <p className="mt-1 text-sm text-[var(--muted)]">
                        <span className="stat-figure--accent">
                            {author.postCount}
                        </span>{' '}
                        {author.postCount === 1 ? 'article' : 'articles'}{' '}
                        published
                    </p>
                )}
            </div>

            {author.id && (
                <Link
                    to={`/blog?author=${author.id}`}
                    className="btn-secondary py-2 text-sm"
                >
                    See their articles
                </Link>
            )}
        </aside>
    );
};

export default PostAuthorCard;
