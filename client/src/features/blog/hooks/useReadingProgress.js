import { useEffect, useState } from 'react';

/**
 * Percentage (0–100) of the way through the referenced element.
 * Pass `enabled: false` while the article isn't mounted yet.
 */
const useReadingProgress = (targetRef, enabled = true) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!enabled) return undefined;

        let frame = null;

        const measure = () => {
            frame = null;
            const el = targetRef.current;
            if (!el) return;

            const start = el.offsetTop;
            const scrollable = el.offsetHeight - window.innerHeight;

            if (scrollable <= 0) {
                setProgress(window.scrollY > start ? 100 : 0);
                return;
            }

            const seen = ((window.scrollY - start) / scrollable) * 100;
            setProgress(Math.min(100, Math.max(0, seen)));
        };

        const onScroll = () => {
            if (frame === null) frame = window.requestAnimationFrame(measure);
        };

        measure();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);

        return () => {
            if (frame !== null) window.cancelAnimationFrame(frame);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, [targetRef, enabled]);

    return progress;
};

export default useReadingProgress;
