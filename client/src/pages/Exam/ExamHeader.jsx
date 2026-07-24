import { Book, Monitor, Building, Calendar, Link as LinkIcon } from 'lucide-react';

const ExamHeader = ({ exam, handleApply }) => {
    return (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 mb-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-bl-full -z-10"></div>

            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center shrink-0">
                    <Book className="w-10 h-10" />
                </div>
                <div className="flex-1">
                    <h1 className="text-4xl font-extrabold text-[var(--foreground)] mb-2 tracking-tight">
                        {exam.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium mt-4">
                        {exam.examMode === 'Online' ? (
                            <span className="px-3 py-1.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full flex items-center gap-2">
                                <Monitor className="w-4 h-4" /> Online Test
                            </span>
                        ) : (
                            <span className="px-3 py-1.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-full flex items-center gap-2">
                                <Building className="w-4 h-4" /> Offline Center
                            </span>
                        )}
                        <span className="px-3 py-1.5 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-full flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(exam.regStartingDate).toLocaleDateString()} - {new Date(exam.regEndingDate).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {exam.examLink && (
                    <div className="mt-6 md:mt-0 md:ml-auto">
                        <a
                            href={exam.examLink.startsWith('http') ? exam.examLink : `https://${exam.examLink}`}
                            onClick={handleApply}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 font-medium py-2.5 px-6 rounded-xl transition-colors shadow-sm"
                        >
                            <LinkIcon className="w-4 h-4" />
                            Register Now
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExamHeader;
