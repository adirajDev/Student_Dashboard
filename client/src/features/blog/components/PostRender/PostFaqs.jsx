import FaqAccordion from '@/components/common/FaqAccordion';

/**
 * Foot-of-article FAQ block. Renders nothing when the post has no FAQs —
 * an empty heading is worse than no section (same rule as PostAuthorCard).
 */
const PostFaqs = ({ faqs = [] }) => {
    if (faqs.length === 0) return null;

    return (
        <section className="mt-12 border-t border-[var(--border)] pt-8">
            <h2 className="mb-6 text-2xl text-[var(--foreground)]">
                Frequently Asked Questions
            </h2>
            <FaqAccordion faqs={faqs} />
        </section>
    );
};

export default PostFaqs;