export const BloggerProfileSkeleton = () => (
    <div className="animate-pulse space-y-8">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="h-20 w-20 rounded-full bg-[var(--color-ink-100)] md:h-24 md:w-24" />
            <div className="space-y-3">
                <div className="h-3 w-20 rounded-[var(--radius-sm)] bg-[var(--color-ink-100)]" />
                <div className="h-7 w-56 rounded-[var(--radius-sm)] bg-[var(--color-ink-100)]" />
                <div className="h-3 w-40 rounded-[var(--radius-sm)] bg-[var(--color-ink-100)]" />
            </div>
        </div>
        {[0, 1].map(i => (
            <div key={i} className="card space-y-3">
                <div className="h-4 w-28 rounded-[var(--radius-sm)] bg-[var(--color-ink-100)]" />
                <div className="h-3 w-full rounded-[var(--radius-sm)] bg-[var(--color-ink-100)]" />
                <div className="h-3 w-4/5 rounded-[var(--radius-sm)] bg-[var(--color-ink-100)]" />
            </div>
        ))}
    </div>
);

export const BloggerNotFound = () => (
    <div className="card text-center">
        <h2 className="text-lg">This blogger doesn&apos;t exist</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted)]">
            The profile may have been removed, or the link is wrong.
        </p>
    </div>
);

export const BloggerProfileError = ({ message, onRetry }) => (
    <div className="card text-center" role="alert">
        <h2 className="text-lg text-[var(--color-danger)]">
            Couldn&apos;t load this profile
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted)]">
            {message}
        </p>
        <button type="button" onClick={onRetry} className="btn-primary mt-6">
            Try again
        </button>
    </div>
);
