import { Calendar, Monitor, Book, Clock, FileText } from 'lucide-react';
import useExamStatus from '../../search/hooks/useExamStatus';

const ExamCard = ({ exam, onClick }) => {
    const { statusText, statusClass } = useExamStatus(exam);

    return (
        <div
            onClick={() => onClick(exam)}
            className="card-interactive p-5 cursor-pointer flex flex-col group h-full"
        >
            {/* Top Header Section */}
            <div className="flex items-center gap-4 mb-4">
                {/* Generic Logo Placeholder */}
                <div className="w-14 h-14 shrink-0 bg-[var(--color-ink-50)] border border-[var(--border)] rounded-[var(--radius-md)] flex items-center justify-center text-[var(--color-ink-600)]">
                    <FileText className="w-7 h-7" />
                </div>

                {/* Title & Badge */}
                <div className="flex-1 min-w-0 flex justify-between items-center">
                    <div className="flex-1 pr-4">
                        <h3 className="text-xl text-[var(--foreground)] font-display truncate">
                            {exam.name}
                        </h3>
                    </div>
                    <div
                        className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold ${statusClass}`}
                    >
                        {statusText}
                    </div>
                </div>
            </div>

            <hr className="border-[var(--border)] mb-4" />

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
                {/* Exam Date */}
                {exam.examDate && (
                    <div>
                        <p className="text-sm text-[var(--muted)] mb-1">
                            Exam Date
                        </p>
                        <div className="flex items-center text-[var(--foreground)] font-medium truncate">
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
                    <div>
                        <p className="text-sm text-[var(--muted)] mb-1">Mode</p>
                        <div className="flex items-center text-[var(--foreground)] font-medium truncate">
                            {exam.examMode}
                        </div>
                    </div>
                )}

                {/* Exam Duration */}
                {exam.examDuration && (
                    <div>
                        <p className="text-sm text-[var(--muted)] mb-1">
                            Duration
                        </p>
                        <div className="flex items-center text-[var(--foreground)] font-medium truncate">
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
