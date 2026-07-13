const EmptyTable = () => {
    return (
        <div className="bg-[var(--card)] p-12 rounded-xl shadow-sm border border-[var(--border)] h-full min-h-75 flex flex-col items-center justify-center text-center">
            <svg className="w-16 h-16 text-[var(--ring)] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            <h3 className="text-lg font-medium text-[var(--foreground)]">No records available</h3>
            <p className="text-[var(--ring)] mt-1 max-w-sm">There are currently no students enrolled. Use the form to add a new student.</p>
        </div>
    );
}

export default EmptyTable
