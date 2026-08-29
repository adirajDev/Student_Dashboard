import { useState } from 'react';

const VISIBLE = 24;

/**
 * Inline expand instead of the old ListModal — a full tab has the room,
 * and one fewer modal to manage.
 */
const RecruiterChips = ({ recruiters = [] }) => {
    const [showAll, setShowAll] = useState(false);

    if (recruiters.length === 0) return null;

    const visible = showAll ? recruiters : recruiters.slice(0, VISIBLE);
    const hidden = recruiters.length - visible.length;

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
                {visible.map((recruiter, idx) => (
                    <span
                        key={`${recruiter}-${idx}`}
                        className="px-3 py-1.5 bg-[var(--color-ink-50)] text-[var(--color-ink-700)] rounded-[var(--radius-sm)] text-sm font-medium border border-[var(--color-ink-200)] shadow-sm"
                    >
                        {recruiter}
                    </span>
                ))}
            </div>

            {(hidden > 0 || showAll) && (
                <button
                    type="button"
                    onClick={() => setShowAll(!showAll)}
                    className="text-[var(--color-amber-600)] font-medium hover:text-[var(--color-amber-700)] hover:underline transition-all text-sm"
                >
                    {showAll ? 'Show fewer' : `+${hidden} more recruiters`}
                </button>
            )}
        </div>
    );
};

export default RecruiterChips;
