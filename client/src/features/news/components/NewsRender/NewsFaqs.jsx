import FaqAccordion from '@/components/common/FaqAccordion';

/**
 * Foot-of-article FAQ block for a news item. Renders nothing when there
 * are no FAQs — most announcements will not have any.
 */
const NewsFaqs = ({ faqs = [] }) => {
    if (faqs.length === 0) return null;

    return (
        <section className="mt-10 border-t border-[var(--border)] pt-8">
            <h2 className="mb-6 text-2xl text-[var(--foreground)]">
                Frequently Asked Questions
            </h2>
            <FaqAccordion faqs={faqs} />
        </section>
    );
};

export default NewsFaqs;
