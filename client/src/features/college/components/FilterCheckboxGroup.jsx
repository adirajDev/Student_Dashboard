import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';

/**
 * One labelled block of checkboxes in the college filter sidebar.
 *
 * `options` is `[{ value, label, count }]`. `value` is what goes into the
 * filter array — for courses that's the course id, not its name — so the
 * component never assumes label and value are the same thing.
 *
 * A search box appears once the list passes `searchThreshold`, which in
 * practice means courses get one and states usually don't.
 */
const FilterCheckboxGroup = ({
                                 label,
                                 options = [],
                                 selected = [],
                                 onToggle,
                                 searchThreshold = 10,
                                 searchPlaceholder = 'Search…',
                             }) => {
    const [term, setTerm] = useState('');

    const visible = useMemo(() => {
        if (!term.trim()) return options;
        const t = term.trim().toLowerCase();
        return options.filter(o => o.label.toLowerCase().includes(t));
    }, [options, term]);

    if (!options.length) return null;

    const selectedSet = new Set(selected);
    const showSearch = options.length > searchThreshold;

    return (
        <div>
            <label className="block text-sm font-semibold text-[var(--foreground)] mb-3">
                {label}
                {selectedSet.size > 0 && (
                    <span className="ml-2 font-normal text-[var(--muted)]">
                        ({selectedSet.size} selected)
                    </span>
                )}
            </label>

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

            <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
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
        </div>
    );
};

export default FilterCheckboxGroup;