import { Calendar, Monitor, Book, Clock } from 'lucide-react';
import useExamStatus from '../../search/hooks/useExamStatus';

const ExamCard = ({ exam, onClick }) => {
    const { statusText, statusClass } = useExamStatus(exam);

    return (
        <div
            onClick={() => onClick(exam)}
            className="p-6 bg-[var(--card)] rounded-3xl border border-[var(--border)] hover:border-indigo-500 dark:hover:border-indigo-400 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
        >
            <div className="flex items-stretch justify-between h-full">
                <div className="flex flex-col">
                    <h3 className="text-xl text-[var(--foreground)]">
                        {exam.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-5 text-sm font-medium text-slate-600 dark:text-slate-400 mt-4">
                        {exam.examDate && (
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-slate-400 dark:text-slate-500" />
                                {new Date(exam.examDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                        )}
                        {exam.examMode && (
                            <div className="flex items-center">
                                {exam.examMode === 'Online' ? (
                                    <Monitor className="w-4 h-4 mr-2 text-slate-400 dark:text-slate-500" />
                                ) : (
                                    <Book className="w-4 h-4 mr-2 text-slate-400 dark:text-slate-500" />
                                )}
                                {exam.examMode}
                            </div>
                        )}
                        {exam.examDuration && (
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2 text-slate-400 dark:text-slate-500" />
                                {exam.examDuration >= 60 && `${Math.floor(exam.examDuration / 60)} Hour${Math.floor(exam.examDuration / 60) > 1 ? 's' : ''} `}
                                {exam.examDuration % 60 > 0 && `${exam.examDuration % 60} Minutes`}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col items-end ml-4">
                    <div
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold ${statusClass}`}
                    >
                        {statusText}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamCard;
