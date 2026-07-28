const NoResultsFound = ({ searchTerm }) => (
    <div className="bg-[var(--card)] p-12 rounded-xl shadow-sm border border-[var(--border)] h-full min-h-75 flex flex-col items-center justify-center text-center">
        <svg
            className="w-16 h-16 text-[var(--ring)] mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
            />
        </svg>
        <h3 className="text-lg text-[var(--foreground)]">No matches found</h3>
        <p className="text-[var(--ring)] mt-1 max-w-sm">
            No students match "{searchTerm}". Try a different name or clear the
            search.
        </p>
    </div>
);

export default NoResultsFound;
