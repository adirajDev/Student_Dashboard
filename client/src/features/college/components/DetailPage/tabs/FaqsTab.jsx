import { useMemo } from 'react';
import Accordion from '@/components/common/Accordion';

/**
 * Replaces the old FaqSection.jsx. Takes `college` instead of `faqs`, and
 * the `.card` wrapper plus heading are gone — the tab supplies the context.
 */
const FaqsTab = ({ college }) => {
    const faqs = college.faqs || [];

    const items = useMemo(
        () =>
            [...faqs]
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                .map((faq, idx) => ({
                    id: faq._id || `faq-${idx}`,
                    title: faq.question,
                    content: (
                        <p className="text-sm text-[var(--muted)] leading-relaxed whitespace-pre-wrap">
                            {faq.answer}
                        </p>
                    ),
                })),
        [faqs]
    );

    if (items.length === 0) {
        return (
            <div className="p-8 text-center border border-[var(--border)] border-dashed rounded-[var(--radius-xl)] text-[var(--muted)]">
                No frequently asked questions yet.
            </div>
        );
    }

    return <Accordion items={items} defaultOpenId={items[0].id} />;
};

export default FaqsTab;
