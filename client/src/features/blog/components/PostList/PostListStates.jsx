export const PostCardSkeleton = () => (
    <div className="card animate-pulse">
        <div className="h-5 w-4/5 rounded-[var(--radius-sm)] bg-[var(--color-ink-100)]" />
        <div className="mt-4 space-y-2">
            <div className="h-3 w-full rounded-[var(--radius-sm)] bg-[var(--color-ink-100)]" />
            <div className="h-3 w-11/12 rounded-[var(--radius-sm)] bg-[var(--color-ink-100)]" />
            <div className="h-3 w-2/3 rounded-[var(--radius-sm)] bg-[var(--color-ink-100)]" />
        </div>
        <div className="mt-6 flex items-center gap-3 border-t border-[var(--border)] pt-4">
            <div className="h-9 w-9 rounded-full bg-[var(--color-ink-100)]" />
            <div className="h-3 w-28 rounded-[var(--radius-sm)] bg-[var(--color-ink-100)]" />
        </div>
    </div>
);

export const PostListSkeleton = ({ count = 6 }) => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }, (_, i) => (
            <PostCardSkeleton key={i} />
        ))}
    </div>
);

export const PostListEmpty = () => (
    <div className="card text-center">
        <h3 className="text-lg">No posts published yet</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted)]">
            New writing from our counsellors and student bloggers will appear
            here as soon as it goes live.
        </p>
    </div>
);

export const PostListError = ({ message, onRetry }) => (
    <div className="card text-center" role="alert">
        <h3 className="text-lg text-[var(--color-danger)]">
            Couldn&apos;t load posts
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted)]">
            {message}
        </p>
        <button type="button" onClick={onRetry} className="btn-primary mt-6">
            Try again
        </button>
    </div>
);
