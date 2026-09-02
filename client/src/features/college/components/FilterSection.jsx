import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Collapsible wrapper for one filter block. Owns the header, the chevron and
 * the open/closed state; the group components inside own their options.
 *
 * `badge` is a short summary of the current selection, shown in the header so
 * a collapsed section still tells you whether it's doing anything.
 */
const FilterSection = ({ label, badge, defaultOpen = true, children }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const sectionId = `filter-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

    return (
        <div className="border-b border-[var(--border)] pb-4 last:border-b-0">
            <button
                type="button"
                onClick={() => setIsOpen(open => !open)}
                aria-expanded={isOpen}
                aria-controls={sectionId}
                className="w-full flex items-center gap-2 py-1 text-left group"
            >
                <span className="text-sm font-semibold text-[var(--foreground)] flex-1">
                    {label}
                </span>
                {badge && (
                    <span className="text-xs font-medium text-[var(--muted)] truncate max-w-[8rem]">
                        {badge}
                    </span>
                )}
                <ChevronDown
                    className={`w-4 h-4 shrink-0 text-[var(--color-ink-500)] transition-transform group-hover:text-[var(--foreground)] ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                />
            </button>

            {isOpen && (
                <div id={sectionId} className="mt-3">
                    {children}
                </div>
            )}
        </div>
    );
};

export default FilterSection;