const NewsSkeleton = () => {
    return (
        <div className="surface-paper pb-24 animate-pulse">
            <div className="mx-auto max-w-3xl px-5 pt-10 pb-8">
                <div className="h-4 w-24 rounded-full bg-[var(--color-ink-50)]" />
                <div className="mt-6 h-10 w-11/12 rounded-[var(--radius-md)] bg-[var(--color-ink-50)]" />
                <div className="mt-3 h-10 w-2/3 rounded-[var(--radius-md)] bg-[var(--color-ink-50)]" />
                <div className="mt-5 flex gap-6">
                    <div className="h-4 w-28 rounded-full bg-[var(--color-ink-50)]" />
                    <div className="h-4 w-24 rounded-full bg-[var(--color-ink-50)]" />
                </div>
            </div>

            <div className="mx-auto max-w-3xl px-5">
                <div className="mb-10 aspect-[16/9] w-full rounded-[var(--radius-xl)] bg-[var(--color-ink-50)]" />
                <div className="space-y-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-4 rounded-full bg-[var(--color-ink-50)]"
                            style={{ width: index % 4 === 3 ? '62%' : '100%' }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NewsSkeleton;