const Loading = () => {
    return (
        <div className="bg-[var(--card)] p-12 rounded-[var(--radius-xl)] shadow-sm border border-[var(--border)] flex flex-col items-center justify-center h-full min-h-75">
            <div className="w-10 h-10 border-4 border-[var(--color-ink-200)] border-t-[var(--color-ink-600)] rounded-full animate-spin mb-4"></div>
            <p className="text-[var(--muted)] font-medium">
                Fetching student records...
            </p>
        </div>
    );
};

export default Loading;
