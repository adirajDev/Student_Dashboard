import { Calendar, Monitor, Book, Clock, FileText } from 'lucide-react';
import useExamStatus from '../../search/hooks/useExamStatus';

const ExamCard = ({ exam, onClick }) => {
    const { statusText, statusClass } = useExamStatus(exam);

    return (
        <div
            onClick={() => onClick(exam)}
            className="card-interactive p-4 sm:p-5 cursor-pointer flex flex-col group h-full"
        >
            {/* Top Header Section */}
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-4">
                {/* Generic Logo Placeholder */}
                <div
                    className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 bg-[var(--color-ink-50)] border border-[var(--border)] rounded-[var(--radius-md)] flex items-center justify-center text-[var(--color-ink-600)]">
                    <FileText className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>

                {/* Title & Badge: badge drops under the title on phones */}
                <div
                    className="flex-1 min-w-0 flex flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <h3
                        className="w-full sm:w-auto sm:flex-1 min-w-0 text-lg sm:text-xl text-[var(--foreground)] font-display line-clamp-2 sm:line-clamp-1 break-words"
                        title={exam.name}
                    >
                        {exam.name}
                    </h3>
                    <div
                        className={`shrink-0 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold ${statusClass}`}
                    >
                        {statusText}
                    </div>
                </div>
            </div>

            <hr className="border-[var(--border)] mb-4" />

            {/* Stats Grid: 2 columns on phones so dates and durations fit */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
                {/* Exam Date */}
                {exam.examDate && (
                    <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-[var(--muted)] mb-1">
                            Exam Date
                        </p>
                        <div className="text-sm sm:text-base text-[var(--foreground)] font-medium truncate">
                            {new Date(exam.examDate).toLocaleDateString(
                                'en-US',
                                {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                }
                            )}
                        </div>
                    </div>
                )}

                {/* Exam Mode */}
                {exam.examMode && (
                    <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-[var(--muted)] mb-1">
                            Mode
                        </p>
                        <div className="text-sm sm:text-base text-[var(--foreground)] font-medium truncate">
                            {exam.examMode}
                        </div>
                    </div>
                )}

                {/* Exam Duration */}
                {exam.examDuration && (
                    <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-[var(--muted)] mb-1">
                            Duration
                        </p>
                        <div className="text-sm sm:text-base text-[var(--foreground)] font-medium sm:truncate">
                            {exam.examDuration >= 60 &&
                                `${Math.floor(exam.examDuration / 60)} Hour${Math.floor(exam.examDuration / 60) > 1 ? 's' : ''} `}
                            {exam.examDuration % 60 > 0 &&
                                `${exam.examDuration % 60} Minutes`}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExamCard;
