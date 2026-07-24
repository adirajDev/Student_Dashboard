const SearchBar = ({
    value,
    onChange,
    placeholder = 'Search...',
    onClear,
    className = 'relative mb-4',
}) => {
    return (
        <div className={className}>
            <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--ring)] pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                />
            </svg>

            <input
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-11 pr-11 py-3 bg-[var(--card)] border border-[var(--border)] rounded-full shadow-sm text-[var(--foreground)] placeholder-[var(--ring)] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />

            {value && (
                <button
                    onClick={onClear}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--ring)] hover:text-[var(--foreground)] transition"
                    aria-label="Clear search"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default SearchBar;
