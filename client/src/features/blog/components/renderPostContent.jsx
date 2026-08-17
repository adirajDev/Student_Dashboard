// Read-only renderer for a Tiptap JSON doc. Handles exactly the node/mark set
// server/src/features/blog/post/post.content-validator.js allows — no more, no less.
import './tiptapContent.css';

const applyMarks = (text, marks = []) => {
    return marks.reduce((node, mark) => {
        switch (mark.type) {
            case 'bold':
                return <strong>{node}</strong>;
            case 'italic':
                return <em>{node}</em>;
            case 'underline':
                return <u>{node}</u>;
            case 'strike':
                return <s>{node}</s>;
            case 'code':
                return (
                    <code className="px-1 py-0.5 bg-[var(--color-ink-100)] rounded text-sm">
                        {node}
                    </code>
                );
            case 'link':
                return (
                    <a
                        href={mark.attrs?.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[var(--color-amber-700)] underline"
                    >
                        {node}
                    </a>
                );
            default:
                return node;
        }
    }, text);
};

const renderNode = (node, key) => {
    if (!node || typeof node !== 'object') return null;

    switch (node.type) {
        case 'doc':
            return (
                <div key={key}>
                    {(node.content || []).map((child, i) =>
                        renderNode(child, i)
                    )}
                </div>
            );
        case 'paragraph':
            return (
                <p key={key} className="mb-3">
                    {(node.content || []).map((child, i) =>
                        renderNode(child, i)
                    )}
                </p>
            );
        case 'text':
            return <span key={key}>{applyMarks(node.text, node.marks)}</span>;
        case 'heading': {
            const Tag = `h${node.attrs?.level || 2}`;
            return (
                <Tag key={key} className="mt-4 mb-2">
                    {(node.content || []).map((child, i) =>
                        renderNode(child, i)
                    )}
                </Tag>
            );
        }
        case 'bulletList':
            return (
                <ul key={key} className="list-disc pl-6 mb-3">
                    {(node.content || []).map((child, i) =>
                        renderNode(child, i)
                    )}
                </ul>
            );
        case 'orderedList':
            return (
                <ol key={key} className="list-decimal pl-6 mb-3">
                    {(node.content || []).map((child, i) =>
                        renderNode(child, i)
                    )}
                </ol>
            );
        case 'listItem':
            return (
                <li key={key}>
                    {(node.content || []).map((child, i) =>
                        renderNode(child, i)
                    )}
                </li>
            );
        case 'blockquote':
            return (
                <blockquote
                    key={key}
                    className="border-l-4 border-[var(--color-amber-300)] pl-4 italic text-[var(--muted)] mb-3"
                >
                    {(node.content || []).map((child, i) =>
                        renderNode(child, i)
                    )}
                </blockquote>
            );
        case 'horizontalRule':
            return <hr key={key} className="my-6 border-[var(--border)]" />;
        case 'hardBreak':
            return <br key={key} />;
        case 'image':
            return (
                <img
                    key={key}
                    src={node.attrs?.src}
                    alt=""
                    className="rounded-[var(--radius-md)] max-w-full my-4"
                />
            );
        case 'youtube':
            return (
                <div
                    key={key}
                    className="aspect-video rounded-[var(--radius-md)] overflow-hidden my-4"
                >
                    <iframe
                        src={`https://www.youtube.com/embed/${node.attrs?.videoId}`}
                        title="YouTube video"
                        frameBorder="0"
                        allowFullScreen
                        className="w-full h-full"
                    />
                </div>
            );
        default:
            return null;
    }
};

const renderPostContent = content => renderNode(content, 'root');

export default renderPostContent;
