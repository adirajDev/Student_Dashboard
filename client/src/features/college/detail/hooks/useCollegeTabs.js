import { useCallback, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    DEFAULT_TAB,
    getAvailableTabs,
} from '@/features/college/detail/constants/collegeTabs.js';

/**
 * Owns the active tab for the college detail page.
 *
 * State lives in the URL (`?tab=courses`) rather than useState, so the
 * back button works and a tab is shareable. An unknown or unavailable
 * tab id falls back to `info` instead of rendering nothing.
 *
 * Returns `navRef` — attach it to the sticky tab strip's wrapper. On tab
 * change, if the user has scrolled past the strip, the page scrolls back
 * so the new panel starts at the top.
 */
const useCollegeTab = college => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navRef = useRef(null);

    const tabs = useMemo(() => getAvailableTabs(college), [college]);

    const requested = searchParams.get('tab');
    const activeTab = tabs.some(tab => tab.id === requested)
        ? requested
        : DEFAULT_TAB;

    const setTab = useCallback(
        id => {
            setSearchParams(
                prev => {
                    const next = new URLSearchParams(prev);
                    if (id === DEFAULT_TAB) next.delete('tab');
                    else next.set('tab', id);
                    return next;
                },
                { replace: false }
            );

            // Wait for the new panel to paint before measuring.
            requestAnimationFrame(() => {
                const el = navRef.current;
                if (!el) return;
                const { top } = el.getBoundingClientRect();
                // Negative top means the strip is stuck and we are scrolled
                // past its natural position — pull the page back up to it.
                if (top < 0) {
                    window.scrollTo({
                        top: window.scrollY + top - 8,
                        behavior: 'smooth',
                    });
                }
            });
        },
        [setSearchParams]
    );

    return { tabs, activeTab, setTab, navRef };
};

export default useCollegeTab;
