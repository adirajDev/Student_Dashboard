import { GraduationCap } from 'lucide-react';

const ExamEligibility = ({ requirement }) => {
    return (
        <div className="md:col-span-2 order-1 card p-8">
            <h2 className="text-2xl font-display mb-6 flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-[var(--color-success)]" />
                Eligibility Criteria
            </h2>
            <div className="p-6 bg-[var(--color-success)]/10 border border-[var(--border)] rounded-[var(--radius-xl)]">
                <p className="whitespace-pre-line text-[var(--foreground)] font-medium text-lg leading-relaxed">
                    {requirement}
                </p>
            </div>
        </div>
    );
};

export default ExamEligibility;
