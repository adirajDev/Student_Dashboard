import { Star } from 'lucide-react';
import FilterSection from './FilterSection.jsx';

/**
 * Single-select counterpart to FilterCheckboxGroup, used for the rating
 * buckets. Rating thresholds are mutually exclusive — picking "4.0 & above"
 * and "3.0 & above" together would just mean 3.0 — so checkboxes would be
 * the wrong control here.
 *
 * `options` is `[{ value, label, count }]`. Options whose count is 0 are
 * disabled rather than hidden, so the list doesn't reflow as other filters
 * change. The set is short enough that it never needs truncating.
 */
const FilterRadioGroup = ({
    label,
    name,
    options = [],
    value,
    onChange,
    defaultOpen = true,
    defaultValue = 0,
    showStars = false,
}) => {
    if (!options.length) return null;

    const active = options.find(o => o.value === value);
    const badge = value !== defaultValue && active ? active.label : null;

    return (
        <FilterSection label={label} badge={badge} defaultOpen={defaultOpen}>
            <div className="space-y-3">
                {options.map(option => {
                    const isSelected = value === option.value;
                    const isEmpty =
                        option.count === 0 && option.value !== defaultValue;

                    return (
                        <label
                            key={option.value}
                            className={`flex items-center gap-3 group ${
                                isEmpty
                                    ? 'cursor-not-allowed opacity-50'
                                    : 'cursor-pointer'
                            }`}
                        >
                            <input
                                type="radio"
                                name={name}
                                className="sr-only"
                                checked={isSelected}
                                disabled={isEmpty}
                                onChange={() => onChange(option.value)}
                            />
                            <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                                    isSelected
                                        ? 'bg-[var(--color-ink-800)] border-[var(--color-ink-800)]'
                                        : 'border border-[var(--color-ink-300)] bg-[var(--card)] group-hover:border-[var(--color-ink-500)]'
                                }`}
                            >
                                {isSelected && (
                                    <span className="w-2 h-2 rounded-full bg-white" />
                                )}
                            </div>

                            <span className="flex items-center gap-1.5 text-sm font-medium text-[var(--foreground)] flex-1 truncate">
                                {showStars && option.value > 0 && (
                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                                )}
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
        </FilterSection>
    );
};

export default FilterRadioGroup;
