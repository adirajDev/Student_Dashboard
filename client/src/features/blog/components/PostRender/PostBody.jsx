import renderPostContent from '../renderPostContent.jsx';

const PostBody = ({ content }) => (
    <div className="tiptap-content pt-4 text-[1.0625rem] leading-8 text-[var(--color-ink-800)]">
        {content ? (
            renderPostContent(content)
        ) : (
            <p className="text-[var(--muted)]">
                This article has no content yet.
            </p>
        )}
    </div>
);

export default PostBody;
