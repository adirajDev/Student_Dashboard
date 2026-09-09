/**
 * Shared building blocks for rendering a proposed-change diff.
 * Everything here is presentational and free of domain knowledge.
 */

const Blank = () => <span className="italic text-xs opacity-70">Empty</span>;

export const isSame = (a, b) =>
    JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

const toText = v => (v === undefined || v === null ? '' : String(v));

// `undefined` means "not part of this request" -> render nothing.
// `''` means "cleared" -> must still render, so the admin sees the removal.
export const renderDiff = (label, currentVal, proposedVal, key) => {
    if (proposedVal === undefined) return null;

    const before = toText(currentVal);
    const after = toText(proposedVal);
    if (before === after) return null;

    return (
        <div className="mb-4" key={key || label}>
            <span className="block text-xs font-semibold text-[var(--ring)] uppercase mb-1">
                {label}
            </span>
            <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                <div className="flex-1 bg-red-50 border border-red-200 p-3 rounded-xl line-through text-red-800 opacity-60 break-words">
                    {before === '' ? <Blank /> : before}
                </div>
                <div className="flex-1 bg-green-50 border border-green-200 p-3 rounded-xl text-green-800 break-words">
                    {after === '' ? <Blank /> : after}
                </div>
            </div>
        </div>
    );
};

export const Card = ({ icon, title, children }) => (
    <div className="border border-[var(--border)] rounded-2xl p-5 bg-white shadow-sm">
        <div className="flex items-center gap-2 mb-2 text-[var(--foreground)] font-semibold border-b border-[var(--border)] pb-3">
            {icon} {title}
        </div>
        {children}
    </div>
);
