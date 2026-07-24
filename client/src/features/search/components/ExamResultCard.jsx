import { ArrowRight, Calendar, Monitor, Book, Clock } from 'lucide-react';

const ExamResultCard = ({ exam, onClick }) => {
    // Determine status
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = exam.regStartingDate ? new Date(exam.regStartingDate) : null;
    const end = exam.regEndingDate ? new Date(exam.regEndingDate) : null;

    let statusText = 'Unknown';
    let statusClass =
        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';

    if (start && end) {
        if (today >= start && today <= end) {
            statusText = 'Registration Live';
            statusClass =
                'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800';
        } else if (today < start) {
            statusText = 'Registration Upcoming';
            statusClass =
                'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800';
        } else if (today > end) {
            statusText = 'Registration Closed';
            statusClass =
                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800';
        }
    }

    return (
        <div
            onClick={() => onClick(exam)}
            className="p-6 bg-[var(--card)] rounded-3xl border border-[var(--border)] shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">
                        {exam.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--ring)] mt-3">
                        {exam.examDate && (
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1.5 text-indigo-500" />
                                Exam Date:{' '}
                                {new Date(exam.examDate).toLocaleDateString()}
                            </div>
                        )}
                        {exam.examMode && (
                            <div className="flex items-center">
                                {exam.examMode === 'Online' ? (
                                    <Monitor className="w-4 h-4 mr-1.5 text-green-500" />
                                ) : (
                                    <Book className="w-4 h-4 mr-1.5 text-purple-500" />
                                )}
                                Mode: {exam.examMode}
                            </div>
                        )}
                        {exam.examDuration && (
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1.5 text-orange-500" />
                                Duration:{' '}
                                {exam.examDuration >= 60
                                    ? `${Math.floor(exam.examDuration / 60)}hr `
                                    : ''}
                                {exam.examDuration % 60
                                    ? `${exam.examDuration % 60}m`
                                    : ''}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                    <div
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClass}`}
                    >
                        {statusText}
                    </div>
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-[var(--ring)] group-hover:text-blue-500 transition-colors">
                        <ArrowRight className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamResultCard;
