const Loading = () => {
    return (
        <div className="bg-[var(--card)] p-12 rounded-xl shadow-sm border border-[var(--border)] flex flex-col items-center justify-center h-full min-h-75">
            <div className="w-10 h-10 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin mb-4"></div>
            <p className="text-[var(--ring)] font-medium">Fetching student records...</p>
        </div>
    )
}

export default Loading
