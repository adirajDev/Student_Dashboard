import { useLayoutEffect, useState } from 'react';

/**
 * Measures the fixed Topbar so sticky elements can pin flush beneath it.
 *
 * Hardcoding this is a trap: the Topbar's height is the sum of its padding,
 * its tallest child and its border, and it swaps py-5 for py-3 when scrolled
 * in transparent mode. Any literal drifts the moment the Topbar is touched,
 * and the failure is a silent strip of background rather than an error.
 *
 * Returns 0 until the first measurement lands, so callers should treat 0 as
 * "not measured yet" rather than a real offset.
 */
const useTopbarHeight = () => {
    const [height, setHeight] = useState(0);

    useLayoutEffect(() => {
        const el =
            document.querySelector('[data-topbar]') ||
            document.querySelector('header');

        if (!el) return;

        const measure = () => setHeight(el.getBoundingClientRect().height);
        measure();

        if (typeof ResizeObserver === 'undefined') {
            window.addEventListener('resize', measure);
            return () => window.removeEventListener('resize', measure);
        }

        const observer = new ResizeObserver(measure);
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return height;
};

export default useTopbarHeight;