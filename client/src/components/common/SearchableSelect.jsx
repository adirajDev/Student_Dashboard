import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';

const SearchableSelect = ({ options, value, onChange, name, placeholder = "Select an option..." }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef(null);

    // Find the currently selected option's name for display when closed
    const selectedOption = value === 'others' 
        ? { name: 'Others (Type your college)' } 
        : options.find(opt => opt._id === value);

    const displayValue = isOpen ? searchTerm : (selectedOption?.name || '');

    // Handle clicking outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm(''); // Reset search term when closing
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter options based on search term
    const filteredOptions = options.filter(opt => 
        opt.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (selectedValue, optionName) => {
        onChange({ target: { name, id: name, value: selectedValue } });
        setSearchTerm('');
        setIsOpen(false);
    };

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
                    onChange={(e) => {
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
                    {isOpen ? <Search className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-xl max-h-60 overflow-y-auto animate-fade-in">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map(opt => (
                            <div
                                key={opt._id}
                                onClick={() => handleSelect(opt._id, opt.name)}
                                className={`px-4 py-2.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${value === opt._id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium' : 'text-[var(--foreground)]'}`}
                            >
                                {opt.name}
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-3 text-sm text-[var(--ring)] text-center">
                            No matching colleges found.
                        </div>
                    )}
                    
                    {/* Persistent 'Others' option */}
                    <div className="border-t border-[var(--border)]">
                        <div
                            onClick={() => handleSelect('others', 'Others (Type your college)')}
                            className={`px-4 py-2.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${value === 'others' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium' : 'text-[var(--foreground)]'}`}
                        >
                            Others <span className="text-xs text-[var(--ring)] ml-1">(Type your college)</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchableSelect;
