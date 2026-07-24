import { Clock, Calendar } from 'lucide-react';

const ExamSidebar = ({ exam, formatTimeRange }) => {
    return (
        <div className="md:col-span-1 md:row-span-2 order-2 md:sticky md:top-24 self-start space-y-8 w-full">
            {/* Important Dates */}
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 shadow-sm">
                <h3 className="text-lg mb-6 pb-4 border-b border-[var(--border)]">
                    Important Dates
                </h3>
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-xl flex flex-col items-center justify-center shrink-0">
                            <span className="text-xs font-bold uppercase">
                                {new Date(exam.regStartingDate).toLocaleString('default', { month: 'short' })}
                            </span>
                            <span className="text-lg font-black leading-none">
                                {new Date(exam.regStartingDate).getDate()}
                            </span>
                        </div>
                        <div>
                            <h4 className="text-[var(--foreground)]">
                                Registration Opens
                            </h4>
                            <p className="text-sm text-[var(--ring)]">
                                {new Date(exam.regStartingDate).getFullYear()}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl flex flex-col items-center justify-center shrink-0">
                            <span className="text-xs font-bold uppercase">
                                {new Date(exam.regEndingDate).toLocaleString('default', { month: 'short' })}
                            </span>
                            <span className="text-lg font-black leading-none">
                                {new Date(exam.regEndingDate).getDate()}
                            </span>
                        </div>
                        <div>
                            <h4 className="text-[var(--foreground)]">
                                Registration Closes
                            </h4>
                            <p className="text-sm text-[var(--ring)]">
                                {new Date(exam.regEndingDate).getFullYear()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Exam Schedule */}
            {exam.examDate && (
                <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 shadow-sm">
                    <h3 className="text-lg mb-6 pb-4 border-b border-[var(--border)] flex items-center gap-2">
                        <Clock className="w-5 h-5 text-indigo-500" />
                        Exam Schedule
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 rounded-xl flex items-center justify-center shrink-0">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-[var(--foreground)]">
                                    Exam Date
                                </h4>
                                <p className="text-sm font-medium text-[var(--ring)]">
                                    {new Date(exam.examDate).toLocaleDateString(undefined, {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 text-purple-500 rounded-xl flex items-center justify-center shrink-0">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-[var(--foreground)]">
                                    Timing
                                </h4>
                                <p className="text-sm font-medium text-[var(--ring)]">
                                    {formatTimeRange(exam.examTime, exam.examDuration)}
                                    <span className="text-xs ml-2 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full">
                                        {exam.examDuration >= 60 ? `${Math.floor(exam.examDuration / 60)}hr ` : ''}
                                        {exam.examDuration % 60 ? `${exam.examDuration % 60}m` : ''}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamSidebar;
