import { useEffect, useState } from 'react';

/**
 * Tracks a CSS media query. Used where rendering both a mobile and a desktop
 * version and hiding one with CSS would mount the same inputs twice.
 */
const useMediaQuery = query => {
    const [matches, setMatches] = useState(
        () => typeof window !== 'undefined' && window.matchMedia(query).matches
    );

    useEffect(() => {
        const mql = window.matchMedia(query);
        const onChange = e => setMatches(e.matches);
        setMatches(mql.matches);
        mql.addEventListener('change', onChange);
        return () => mql.removeEventListener('change', onChange);
    }, [query]);

    return matches;
};

export default useMediaQuery;