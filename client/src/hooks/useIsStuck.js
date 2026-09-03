import { useEffect, useState } from 'react';

/**
 * Detects when a sticky element has actually stuck.
 *
 * CSS gives no way to style a `position: sticky` element differently once it
 * pins, so the usual trick is a zero-height sentinel placed immediately above
 * it. Once the sentinel scrolls past the pin line, the element is stuck.
 *
 * `offset` is the distance from the top of the viewport where the element
 * pins — 80px here, matching the fixed Topbar that PublicLayout clears with
 * its pt-20.
 *
 * `sentinelRef` is a CALLBACK ref, not a useRef, and that matters. The page
 * returns <Loading /> before the sentinel exists, so with a useRef the effect
 * would run once against a null node, bail out, and never re-run once the
 * real markup mounted — the observer would never attach. Holding the node in
 * state re-runs the effect the moment it appears.
 *
 * Usage:
 *   const { sentinelRef, isStuck } = useIsStuck(80);
 *   <div ref={sentinelRef} aria-hidden="true" className="h-px" />
 */
const useIsStuck = (offset = 80) => {
    const [sentinel, setSentinel] = useState(null);
    const [isStuck, setIsStuck] = useState(false);

    useEffect(() => {
        if (!sentinel) return;

        if (typeof IntersectionObserver === 'undefined') {
            // Old browser: fall back to measuring on scroll.
            const onScroll = () =>
                setIsStuck(sentinel.getBoundingClientRect().top <= offset);
            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll();
            return () => window.removeEventListener('scroll', onScroll);
        }

        const observer = new IntersectionObserver(
            ([entry]) => setIsStuck(!entry.isIntersecting),
            {
                // Shrink the observation area down from the top by the pin
                // offset, so the sentinel "leaves" exactly as it slides under
                // the Topbar rather than when it leaves the viewport.
                rootMargin: `-${offset + 1}px 0px 0px 0px`,
                threshold: 0,
            }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [sentinel, offset]);

    return { sentinelRef: setSentinel, isStuck };
};

export default useIsStuck;
