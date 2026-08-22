import { Link } from 'react-router-dom';
import AuthorAvatar from './AuthorAvatar';

const PostCard = ({ post, index = 0 }) => (
    <article
        className="card-interactive stagger-in group relative flex flex-col focus-within:ring-2 focus-within:ring-[var(--ring)]/40"
        style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
        <h2 className="text-xl leading-snug md:text-2xl">
            <Link
                to={post.href}
                className="outline-none transition-colors after:absolute after:inset-0 after:content-[''] group-hover:text-[var(--color-amber-700)]"
            >
                {post.title}
            </Link>
        </h2>

        {post.excerpt && (
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[var(--muted)]">
                {post.excerpt}
            </p>
        )}

        <div className="mt-6 flex items-center gap-3 border-t border-[var(--border)] pt-4">
            <AuthorAvatar
                src={post.authorImage}
                initials={post.authorInitials}
                name={post.authorName}
            />

            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[var(--color-ink-800)]">
                    {post.authorName}
                </p>
                {post.authorPostCount !== null && (
                    <p className="text-xs text-[var(--muted)]">
                        <span className="stat-figure--accent text-sm">
                            {post.authorPostCount}
                        </span>{' '}
                        {post.authorPostCount === 1 ? 'post' : 'posts'}{' '}
                        published
                    </p>
                )}
            </div>
        </div>
    </article>
);

export default PostCard;
