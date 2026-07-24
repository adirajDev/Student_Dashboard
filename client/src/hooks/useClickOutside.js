import { useEffect, useRef, useState } from 'react';

const useClickOutside = (initialState = false) => {
    const [isOpen, setIsOpen] = useState(initialState);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return { ref, isOpen, setIsOpen };
};

export default useClickOutside;
