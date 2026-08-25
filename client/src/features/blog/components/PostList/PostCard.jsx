import { Link } from 'react-router-dom';
import AuthorAvatar from './AuthorAvatar';

const formatDate = value => {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

const PostCard = ({ post, index = 0 }) => {
    const eyebrow = post.category || post.kind || 'Article';
    const published = formatDate(post.publishedAt || post.createdAt);

    return (
        <article
            className="card-interactive stagger-in group relative flex flex-col p-6 md:p-7 focus-within:ring-2 focus-within:ring-[var(--ring)]/40"
            style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
        >
            {/* Eyebrow */}
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-amber-700)]">
                <span>{eyebrow}</span>
                {published && (
                    <>
                        <span
                            aria-hidden="true"
                            className="h-1 w-1 rounded-full bg-[var(--border)]"
                        />
                        <span className="font-medium tracking-[0.08em] text-[var(--muted)]">
                            {published}
                        </span>
                    </>
                )}
            </div>

            {/* Headline */}
            <h2 className="mt-2.5 font-display text-2xl leading-[1.15] tracking-[-0.01em] text-[var(--color-ink-900,var(--foreground))] md:text-3xl">
                <Link
                    to={post.href}
                    className="line-clamp-1 outline-none transition-colors after:absolute after:inset-0 after:content-[''] group-hover:text-[var(--color-amber-700)]"
                >
                    {post.title}
                </Link>
            </h2>

            {post.excerpt && (
                <p className="mt-2.5 line-clamp-2 max-w-[62ch] text-sm leading-relaxed text-[var(--muted)]">
                    {post.excerpt}
                </p>
            )}

            {/* Byline */}
            <div className="mt-5 flex items-center gap-3 border-t border-[var(--border)] pt-3.5">
                <AuthorAvatar
                    src={post.authorImage}
                    initials={post.authorInitials}
                    name={post.authorName}
                />
                <div className="min-w-0 flex-1 leading-tight">
                    <p className="truncate text-sm font-semibold text-[var(--color-ink-800)]">
                        {post.authorName}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-[var(--muted)]">
                        {post.authorRole || 'Author'}
                    </p>
                </div>
                {post.authorPostCount !== null &&
                    post.authorPostCount !== undefined && (
                        <p className="shrink-0 text-xs text-[var(--muted)]">
                            <span className="stat-figure--accent text-sm">
                                {post.authorPostCount}
                            </span>{' '}
                            {post.authorPostCount === 1 ? 'post' : 'posts'}
                        </p>
                    )}
            </div>
        </article>
    );
};

export default PostCard;