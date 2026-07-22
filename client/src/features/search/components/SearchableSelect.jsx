import { ChevronDown, Search } from 'lucide-react';
import useSearchableSelect from '../hooks/useSearchableSelect';

const SearchableSelect = ({
    options,
    value,
    onChange,
    name,
    placeholder = 'Select an option...',
    customOption = null,
}) => {
    const {
        isOpen,
        setIsOpen,
        searchTerm,
        setSearchTerm,
        wrapperRef,
        displayValue,
        filteredOptions,
        handleSelect,
    } = useSearchableSelect({ options, value, customOption, onChange, name });

    return (
        <div ref={wrapperRef} className="relative w-full">
            <div
                className="relative cursor-text"
                onClick={() => {
                    if (!isOpen) {
                        setIsOpen(true);
                        setSearchTerm('');
                    }
                }}
            >
                <input
                    type="text"
                    className="input-field pr-10 cursor-text"
                    placeholder={placeholder}
                    value={displayValue}
                    onChange={e => {
                        setSearchTerm(e.target.value);
                        if (!isOpen) setIsOpen(true);
                    }}
                    onFocus={() => {
                        setIsOpen(true);
                        setSearchTerm('');
                    }}
                    required={!value} // HTML5 validation: required if no value is set
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ring)] pointer-events-none">
                    {isOpen ? (
                        <Search className="w-4 h-4" />
                    ) : (
                        <ChevronDown className="w-4 h-4" />
                    )}
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-xl max-h-60 overflow-y-auto animate-fade-in">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map(opt => (
                            <div
                                key={opt._id}
                                onClick={() => handleSelect(opt._id)}
                                className={`px-4 py-2.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${value === opt._id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium' : 'text-[var(--foreground)]'}`}
                            >
                                {opt.name}
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-3 text-sm text-[var(--ring)] text-center">
                            No options found.
                        </div>
                    )}

                    {/* Optional Persistent Custom Option */}
                    {customOption && (
                        <div className="border-t border-[var(--border)]">
                            <div
                                onClick={() => handleSelect(customOption.value)}
                                className={`px-4 py-2.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${value === customOption.value ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium' : 'text-[var(--foreground)]'}`}
                            >
                                {customOption.displayLabel ||
                                    customOption.label}
                                {customOption.subLabel && (
                                    <span className="text-xs text-[var(--ring)] ml-1">
                                        {customOption.subLabel}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchableSelect;
