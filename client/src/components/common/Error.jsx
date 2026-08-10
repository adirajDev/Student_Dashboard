const Error = ({ error }) => {
    return (
        <div className="bg-[var(--color-danger)]/5 p-6 rounded-[var(--radius-xl)] border border-[var(--color-danger)]/20 h-full min-h-75 flex items-center justify-center text-center">
            <div>
                <svg
                    className="w-12 h-12 text-red-400 mx-auto mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                </svg>
                <h3 className="text-lg text-[var(--color-danger)] font-display">
                    Failed to load data
                </h3>
                <p className="text-[var(--color-danger)] mt-1 opacity-80">
                    {error}
                </p>
            </div>
        </div>
    );
};

export default Error;
