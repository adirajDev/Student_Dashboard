import { formatDate, initialsOf } from './utils/postFormatters';

/**
 * `author` is the shape returned by authorOf() — name, avatar, postCount.
 * postCount only appears once there's more than one post; "1 article" next to
 * the article you're reading tells the reader nothing.
 */
const PostByline = ({ author, publishedAt }) => {
    const name = author.name || 'Editorial desk';
    const date = formatDate(publishedAt);
    const showCount = author.postCount > 1;

    return (
        <div className="flex items-center gap-3">
            {author.avatar ? (
                <img
                    src={author.avatar}
                    alt=""
                    className="h-10 w-10 rounded-full border border-[var(--border)] object-cover"
                />
            ) : (
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-ink-800)] font-display text-sm font-semibold text-[var(--color-amber-200)]">
                    {initialsOf(name)}
                </span>
            )}

            <div className="leading-tight">
                <p className="text-sm font-semibold text-[var(--color-ink-800)]">
                    {name}
                </p>
                {(date || showCount) && (
                    <p className="text-sm text-[var(--muted)]">
                        {date}
                        {date && showCount && (
                            <span aria-hidden="true"> · </span>
                        )}
                        {showCount && `${author.postCount} articles`}
                    </p>
                )}
            </div>
        </div>
    );
};

export default PostByline;
