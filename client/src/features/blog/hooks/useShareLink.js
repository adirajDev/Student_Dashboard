import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Native share sheet where available, clipboard copy everywhere else.
 * `copied` flips back to false after 2s so the button label can reset.
 */
const useShareLink = title => {
    const [copied, setCopied] = useState(false);
    const timer = useRef(null);

    useEffect(() => () => clearTimeout(timer.current), []);

    const share = useCallback(async () => {
        const url = window.location.href;
        try {
            if (navigator.share) {
                await navigator.share({ title, url });
                return;
            }
            await navigator.clipboard.writeText(url);
            setCopied(true);
            clearTimeout(timer.current);
            timer.current = setTimeout(() => setCopied(false), 2000);
        } catch {
            // Share sheet dismissed, or clipboard blocked — nothing to report.
        }
    }, [title]);

    return { share, copied };
};

export default useShareLink;
