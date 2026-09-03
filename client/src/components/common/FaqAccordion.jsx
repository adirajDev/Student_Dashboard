import { useMemo } from 'react';
import Accordion from './Accordion';

/**
 * Renders a sorted FAQ list as an accordion. Entity-agnostic — used by
 * college, exam, news and post detail pages.
 */
const FaqAccordion = ({
    faqs = [],
    emptyMessage = 'No frequently asked questions yet.',
}) => {
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
                {emptyMessage}
            </div>
        );
    }

    return <Accordion items={items} defaultOpenId={items[0].id} />;
};

export default FaqAccordion;
