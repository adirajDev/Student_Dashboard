import { useState, useEffect } from 'react';

const useScroll = (threshold = 50) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > threshold);
        };
        window.addEventListener('scroll', handleScroll);
        // Set initial state
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [threshold]);

    return scrolled;
};

export default useScroll;
