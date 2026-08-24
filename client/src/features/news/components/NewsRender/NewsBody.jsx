const toParagraphs = (content = '') =>
    content
        .split(/\n\s*\n/)
        .map(block => block.trim())
        .filter(Boolean);

const NewsBody = ({ content }) => {
    const paragraphs = toParagraphs(content);

    if (paragraphs.length === 0) return null;

    return (
        <div className="space-y-5 text-lg leading-relaxed text-[var(--foreground)]">
            {paragraphs.map((paragraph, index) => (
                <p key={index} className="whitespace-pre-line">
                    {paragraph}
                </p>
            ))}
        </div>
    );
};

export default NewsBody;