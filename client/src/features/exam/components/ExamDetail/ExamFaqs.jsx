import { HelpCircle } from 'lucide-react';
import FaqAccordion from '@/components/common/FaqAccordion';

const ExamFaqs = ({ faqs = [] }) => {
    if (faqs.length === 0) return null;

    return (
        <div className="md:col-span-2 order-4 card p-8">
            <h2 className="text-2xl font-display mb-6 flex items-center gap-3">
                <HelpCircle className="w-6 h-6 text-[var(--color-success)]" />
                Frequently Asked Questions
            </h2>
            <FaqAccordion faqs={faqs} />
        </div>
    );
};

export default ExamFaqs;
