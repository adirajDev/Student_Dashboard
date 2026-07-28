import { Book, Monitor, Building, Calendar, ExternalLink } from 'lucide-react';

const ExamHeader = ({ exam, handleApply }) => {
    return (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 mb-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-bl-full -z-10"></div>

            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                    <Book className="w-10 h-10" />
                </div>
                <div className="flex-1">
                    <h1 className="text-4xl text-[var(--foreground)] mb-2 tracking-tight">
                        {exam.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium mt-4">
                        {exam.examMode === 'Online' ? (
                            <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full flex items-center gap-2">
                                <Monitor className="w-4 h-4" /> Online Test
                            </span>
                        ) : (
                            <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full flex items-center gap-2">
                                <Building className="w-4 h-4" /> Offline Center
                            </span>
                        )}
                        <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(exam.regStartingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} - {new Date(exam.regEndingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
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
                            className="inline-flex items-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 font-medium py-2.5 px-6 rounded-full transition-colors shadow-sm"
                        >
                            Register Now
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExamHeader;
