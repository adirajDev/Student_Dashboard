const LINE_WIDTHS = [100, 96, 88, 99, 74, 93, 60];

const PostSkeleton = () => (
    <div
        className="mx-auto max-w-3xl animate-pulse px-5 py-16 motion-reduce:animate-none"
        role="status"
        aria-label="Loading article"
    >
        <div className="h-4 w-28 rounded-[var(--radius-sm)] bg-[var(--color-ink-100)]" />
        <div className="mt-8 h-10 w-11/12 rounded-[var(--radius-sm)] bg-[var(--color-ink-100)]" />
        <div className="mt-3 h-10 w-3/5 rounded-[var(--radius-sm)] bg-[var(--color-ink-100)]" />

        <div className="mt-8 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[var(--color-ink-100)]" />
            <div className="h-4 w-40 rounded-[var(--radius-sm)] bg-[var(--color-ink-100)]" />
        </div>

        <div className="mt-10 aspect-[16/9] w-full rounded-[var(--radius-lg)] bg-[var(--color-ink-100)]" />

        <div className="mt-10 space-y-3">
            {LINE_WIDTHS.map((width, i) => (
                <div
                    key={i}
                    className="h-4 rounded-[var(--radius-sm)] bg-[var(--color-ink-100)]"
                    style={{ width: `${width}%` }}
                />
            ))}
        </div>
    </div>
);

export default PostSkeleton;
