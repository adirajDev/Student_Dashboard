const Error = ({ error }) => {
    return (
        <div className="bg-red-50 p-6 rounded-xl border border-red-200 h-full min-h-75 flex items-center justify-center text-center">
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
                <h3 className="text-lg text-red-800">Failed to load data</h3>
                <p className="text-red-600 mt-1">{error}</p>
            </div>
        </div>
    );
};

export default Error;
