import { useCallback, useEffect, useState } from 'react';

/**
 * Decides whether to render the image or the initials monogram.
 * Falls back to initials if the src is missing or fails to load.
 */
export const useAvatar = src => {
    const [hasFailed, setHasFailed] = useState(false);

    useEffect(() => {
        setHasFailed(false);
    }, [src]);

    const handleError = useCallback(() => setHasFailed(true), []);

    return {
        showImage: Boolean(src) && !hasFailed,
        handleError,
    };
};

export default useAvatar;
