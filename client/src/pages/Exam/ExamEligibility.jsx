import { GraduationCap } from 'lucide-react';

const ExamEligibility = ({ requirement }) => {
    return (
        <div className="md:col-span-2 order-1 bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-emerald-500" />
                Eligibility Criteria
            </h2>
            <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 rounded-2xl">
                <p className="whitespace-pre-line text-[var(--foreground)] font-medium text-lg leading-relaxed">
                    {requirement}
                </p>
            </div>
        </div>
    );
};

export default ExamEligibility;
