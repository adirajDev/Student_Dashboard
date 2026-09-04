const Loading = ({ message = 'Loading…', inline = false }) => {
    const spinner = (
        <div
            className={`${
                inline ? 'w-5 h-5 border-2' : 'w-10 h-10 border-4'
            } border-[var(--color-ink-200)] border-t-[var(--color-ink-600)] rounded-full animate-spin`}
        />
    );

    if (inline) {
        return (
            <div className="flex items-center justify-center gap-3 py-6 text-[var(--muted)]">
                {spinner}
                {message && (
                    <span className="text-sm font-medium">{message}</span>
                )}
            </div>
        );
    }

    return (
        <div className="bg-[var(--card)] p-12 rounded-[var(--radius-xl)] shadow-sm border border-[var(--border)] flex flex-col items-center justify-center h-full min-h-75">
            {spinner}
            <p className="text-[var(--muted)] font-medium mt-4">{message}</p>
        </div>
    );
};

export default Loading;
