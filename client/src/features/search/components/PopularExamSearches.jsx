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
                <h2 className="text-2xl font-display mb-6 text-[var(--foreground)]">
                    Popular Searches
                </h2>
                <div className="flex flex-wrap gap-3">
                    {POPULAR_SEARCHES.map((term, i) => (
                        <button
                            key={i}
                            onClick={() =>
                                navigate(`/exams?q=${encodeURIComponent(term)}`)
                            }
                            className="px-5 py-3 rounded-[var(--radius-md)] bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--color-ink-50)] transition-colors shadow-sm flex items-center gap-2"
                        >
                            {term}
                        </button>
                    ))}
                </div>
            </div>

            {latestLiveExams && latestLiveExams.length > 0 && (
                <div>
                    <h2 className="text-2xl font-display mb-6 text-[var(--foreground)]">
                        Latest Live Postings
                    </h2>
                    <div className="grid gap-4">
                        {latestLiveExams.map(exam => (
                            <div
                                key={exam._id}
                                onClick={() => navigate(`/exam/${exam._id}`)}
                                className="p-6 bg-[var(--card)] rounded-[var(--radius-xl)] border border-[var(--border)] shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            >
                                <div>
                                    <h3 className="text-lg text-[var(--color-ink-600)] font-display group-hover:underline">
                                        {exam.name}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-[var(--muted)]">
                                        <div className="flex items-center gap-1.5 font-medium">
                                            <Calendar className="w-4 h-4 text-[var(--color-ink-500)]" />
                                            Reg Ends:{' '}
                                            {new Date(
                                                exam.regEndingDate
                                            ).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            {exam.examMode === 'Online' ? (
                                                <span className="flex items-center gap-1 text-[var(--color-success)]">
                                                    <Monitor className="w-4 h-4" />{' '}
                                                    Online
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-[var(--color-ink-600)]">
                                                    <Book className="w-4 h-4" />{' '}
                                                    Offline
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <span className="px-4 py-2 bg-[var(--color-success)]/10 text-[var(--color-success)] rounded-full text-sm font-semibold shrink-0 animate-pulse">
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
