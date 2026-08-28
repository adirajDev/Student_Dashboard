import { HelpCircle } from 'lucide-react';
import Accordion from '@/components/common/Accordion.jsx';

const FaqSection = ({ faqs }) => {
    if (!faqs || faqs.length === 0) return null;

    const items = [...faqs]
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((faq, idx) => ({
            id: faq._id || `faq-${idx}`,
            title: faq.question,
            content: (
                <p className="text-sm text-[var(--muted)] leading-relaxed whitespace-pre-wrap">
                    {faq.answer}
                </p>
            ),
        }));

    return (
        <div className="card flex flex-col h-full">
            <h2 className="text-xl sm:text-2xl mb-6 text-[var(--foreground)] font-display flex items-center shrink-0">
                <HelpCircle className="w-5 h-5 mr-2 text-[var(--color-ink-500)]" />
                Frequently Asked Questions
            </h2>

            <Accordion items={items} />
        </div>
    );
};

export default FaqSection;