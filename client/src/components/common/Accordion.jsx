import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Reusable accordion.
 *
 * items: [{ id, title, content }]
 *   - id      unique and stable; used as the React key and open-state value
 *   - title   the always-visible header (string or node)
 *   - content the collapsible body (string or node)
 *
 * allowMultiple  false (default) closes the previous panel when a new one opens
 * defaultOpenId  opens one panel on mount
 */
const Accordion = ({ items, allowMultiple = false, defaultOpenId = null }) => {
    const [openIds, setOpenIds] = useState(
        defaultOpenId !== null ? [defaultOpenId] : []
    );

    if (!items || items.length === 0) return null;

    const toggle = id => {
        setOpenIds(prev => {
            const isOpen = prev.includes(id);
            if (allowMultiple) {
                return isOpen ? prev.filter(i => i !== id) : [...prev, id];
            }
            return isOpen ? [] : [id];
        });
    };

    return (
        <div className="flex flex-col gap-3">
            {items.map(item => {
                const isOpen = openIds.includes(item.id);

                return (
                    <div
                        key={item.id}
                        className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border)] overflow-hidden transition-colors"
                    >
                        <button
                            type="button"
                            onClick={() => toggle(item.id)}
                            aria-expanded={isOpen}
                            className="w-full flex items-start justify-between gap-4 p-4 text-left hover:bg-[var(--color-ink-50)] transition-colors"
                        >
                            <span className="text-[var(--foreground)] font-semibold">
                                {item.title}
                            </span>
                            <ChevronDown
                                className={`w-5 h-5 text-[var(--color-ink-400)] shrink-0 mt-0.5 transition-transform duration-200 ${
                                    isOpen ? 'rotate-180' : ''
                                }`}
                            />
                        </button>

                        {isOpen && (
                            <div className="px-4 py-4 -mt-1">
                                {item.content}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default Accordion;
