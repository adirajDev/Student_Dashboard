import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import FilterSection from './FilterSection.jsx';

/**
 * One collapsible block of checkboxes in the college filter sidebar.
 *
 * `options` is `[{ value, label, count }]`. `value` is what goes into the
 * filter array — for courses that's the course id, not its name — so the
 * component never assumes label and value are the same thing.
 *
 * Long lists are truncated to `initialVisible` with a "Show N more" toggle
 * rather than given their own scrollbar. A nested scroll area inside a
 * sticky sidebar inside a scrolling page is three layers deep and hard to
 * hit accurately with a trackpad.
 */
const FilterCheckboxGroup = ({
    label,
    options = [],
    selected = [],
    onToggle,
    defaultOpen = true,
    initialVisible = 6,
    searchThreshold = 10,
    searchPlaceholder = 'Search…',
}) => {
    const [term, setTerm] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    const selectedSet = useMemo(() => new Set(selected), [selected]);

    const matching = useMemo(() => {
        if (!term.trim()) return options;
        const t = term.trim().toLowerCase();
        return options.filter(o => o.label.toLowerCase().includes(t));
    }, [options, term]);

    /**
     * While searching, show every match — the search is the truncation.
     * Otherwise cap the list, but always keep checked options visible so a
     * selection can't hide behind "Show more" once you collapse the list.
     */
    const visible = useMemo(() => {
        if (term.trim() || isExpanded) return matching;
        return matching.filter(
            (option, index) =>
                index < initialVisible || selectedSet.has(option.value)
        );
    }, [matching, term, isExpanded, initialVisible, selectedSet]);

    if (!options.length) return null;

    const hiddenCount = matching.length - visible.length;
    const showSearch = options.length > searchThreshold;
    const badge = selectedSet.size > 0 ? `${selectedSet.size} selected` : null;

    return (
        <FilterSection label={label} badge={badge} defaultOpen={defaultOpen}>
            {showSearch && (
                <div className="relative mb-3">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                    <input
                        type="text"
                        value={term}
                        onChange={e => setTerm(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--color-ink-500)]"
                    />
                </div>
            )}

            <div className="space-y-3">
                {visible.length === 0 && (
                    <p className="text-sm text-[var(--muted)]">No matches.</p>
                )}

                {visible.map(option => {
                    const isChecked = selectedSet.has(option.value);
                    return (
                        <label
                            key={option.value}
                            className="flex items-center gap-3 cursor-pointer group"
                        >
                            <input
                                type="checkbox"
                                className="sr-only"
                                checked={isChecked}
                                onChange={() => onToggle(option.value)}
                            />
                            <div
                                className={`w-5 h-5 rounded-[var(--radius-sm)] flex items-center justify-center transition-colors shrink-0 ${
                                    isChecked
                                        ? 'bg-[var(--color-ink-800)] border-[var(--color-ink-800)]'
                                        : 'border border-[var(--color-ink-300)] bg-[var(--card)] group-hover:border-[var(--color-ink-500)]'
                                }`}
                            >
                                {isChecked && (
                                    <svg
                                        className="w-3 h-3 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={3}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                )}
                            </div>
                            <span
                                className="text-sm font-medium text-[var(--foreground)] truncate flex-1"
                                title={option.label}
                            >
                                {option.label}
                            </span>
                            {typeof option.count === 'number' && (
                                <span className="text-xs text-[var(--muted)] shrink-0">
                                    {option.count}
                                </span>
                            )}
                        </label>
                    );
                })}
            </div>

            {!term.trim() && (hiddenCount > 0 || isExpanded) && (
                <button
                    type="button"
                    onClick={() => setIsExpanded(expanded => !expanded)}
                    className="mt-3 w-full py-2 text-sm font-medium text-[var(--color-ink-600)] hover:text-[var(--foreground)] transition-colors"
                >
                    {isExpanded ? 'Show less' : `Show ${hiddenCount} more`}
                </button>
            )}
        </FilterSection>
    );
};

export default FilterCheckboxGroup;
