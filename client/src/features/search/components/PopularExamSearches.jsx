import { useNavigate } from 'react-router-dom';
import { Calendar, Monitor, Book } from 'lucide-react';

const POPULAR_SEARCHES = [
    'JEE Main',
    'NEET',
    'GATE',
    'CAT',
    'UPSC',
    'CLAT',
    'BITSAT',
];

const PopularExamSearches = ({ latestLiveExams }) => {
    const navigate = useNavigate();

    return (
        <div className="mt-8 space-y-12">
            <div>
                <h2 className="text-2xl font-semibold mb-6 text-[var(--foreground)]">
                    Popular Searches
                </h2>
                <div className="flex flex-wrap gap-3">
                    {POPULAR_SEARCHES.map((term, i) => (
                        <button
                            key={i}
                            onClick={() =>
                                navigate(`/exams?q=${encodeURIComponent(term)}`)
                            }
                            className="px-5 py-3 rounded-full bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-2"
                        >
                            {term}
                        </button>
                    ))}
                </div>
            </div>

            {latestLiveExams && latestLiveExams.length > 0 && (
                <div>
                    <h2 className="text-2xl font-semibold mb-6 text-[var(--foreground)]">
                        Latest Live Postings
                    </h2>
                    <div className="grid gap-4">
                        {latestLiveExams.map(exam => (
                            <div
                                key={exam._id}
                                onClick={() => navigate(`/exam/${exam._id}`)}
                                className="p-6 bg-[var(--card)] rounded-3xl border border-[var(--border)] shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            >
                                <div>
                                    <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">
                                        {exam.name}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-[var(--ring)]">
                                        <div className="flex items-center gap-1.5 font-medium">
                                            <Calendar className="w-4 h-4 text-indigo-500" />
                                            Reg Ends:{' '}
                                            {new Date(
                                                exam.regEndingDate
                                            ).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            {exam.examMode === 'Online' ? (
                                                <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                                    <Monitor className="w-4 h-4" />{' '}
                                                    Online
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                                                    <Book className="w-4 h-4" />{' '}
                                                    Offline
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <span className="px-4 py-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-sm font-semibold shrink-0 animate-pulse">
                                        Live Now
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PopularExamSearches;
