import { Book, Monitor, Building, Calendar, ExternalLink } from 'lucide-react';

const ExamHeader = ({ exam, handleApply }) => {
    return (
        <div className="card mb-8 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-ink-500)]/5 rounded-bl-full -z-10"></div>

            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="w-20 h-20 bg-[var(--color-ink-100)] text-[var(--color-ink-600)] rounded-[var(--radius-xl)] flex items-center justify-center shrink-0">
                    <Book className="w-10 h-10" />
                </div>
                <div className="flex-1">
                    <h1 className="text-4xl text-[var(--foreground)] font-display mb-2 tracking-tight">
                        {exam.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium mt-4">
                        {exam.examMode === 'Online' ? (
                            <span className="px-3 py-1.5 bg-[var(--color-success)]/10 text-[var(--color-success)] rounded-[var(--radius-sm)] flex items-center gap-2">
                                <Monitor className="w-4 h-4" /> Online Test
                            </span>
                        ) : (
                            <span className="px-3 py-1.5 bg-[var(--color-ink-100)] text-[var(--color-ink-700)] rounded-[var(--radius-sm)] flex items-center gap-2">
                                <Building className="w-4 h-4" /> Offline Center
                            </span>
                        )}
                        <span className="px-3 py-1.5 bg-[var(--color-amber-50)] text-[var(--color-amber-700)] rounded-[var(--radius-sm)] flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(exam.regStartingDate).toLocaleDateString(
                                'en-GB',
                                {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                }
                            )}{' '}
                            -{' '}
                            {new Date(exam.regEndingDate).toLocaleDateString(
                                'en-GB',
                                {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                }
                            )}
                        </span>
                    </div>
                </div>

                {exam.examLink && (
                    <div className="mt-6 md:mt-0 md:ml-auto">
                        <a
                            href={
                                exam.examLink.startsWith('http')
                                    ? exam.examLink
                                    : `https://${exam.examLink}`
                            }
                            onClick={handleApply}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary py-2.5 px-6 rounded-[var(--radius-md)]"
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
