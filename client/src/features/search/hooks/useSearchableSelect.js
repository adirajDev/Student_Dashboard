import { useState, useRef, useEffect } from 'react';

const useSearchableSelect = ({ options, value, customOption, onChange, name }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef(null);

    // Find the currently selected option's name for display when closed
    const isCustomOptionSelected = customOption && value === customOption.value;
    const selectedOption = isCustomOptionSelected 
        ? { name: customOption.label } 
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

    const handleSelect = (selectedValue) => {
        onChange({ target: { name, id: name, value: selectedValue } });
        setSearchTerm('');
        setIsOpen(false);
    };

    return {
        isOpen,
        setIsOpen,
        searchTerm,
        setSearchTerm,
        wrapperRef,
        displayValue,
        filteredOptions,
        handleSelect
    };
};

export default useSearchableSelect;
