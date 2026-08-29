import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Sticky tab strip for the college detail page.
 *
 * Sticks below the fixed Topbar. PublicLayout gives <main> a pt-20 (80px)
 * to clear that Topbar, so `top-20` parks this strip flush underneath it.
 * z-30 sits below the Topbar (z-50) and below GalleryModal (z-[100]).
 *
 * Width, border, radius and shadow deliberately mirror `.card` so this reads
 * as the bottom edge of CollegeHeader, which renders with `rounded-b-none
 * border-b-0` to meet it. Horizontal padding matches the header's
 * `px-6 sm:px-8` so the labels line up with the college name.
 *
 * NOTE: this must not be rendered inside CollegeHeader's root element —
 * that card has `overflow-hidden`, which silently disables position:sticky
 * for everything inside it.
 */
const CollegeTabNav = ({ tabs, activeTab, onChange }) => {
    const scrollerRef = useRef(null);
    const [overflow, setOverflow] = useState({ left: false, right: false });

    const measure = () => {
        const el = scrollerRef.current;
        if (!el) return;
        const maxScroll = el.scrollWidth - el.clientWidth;
        setOverflow({
            left: el.scrollLeft > 4,
            right: el.scrollLeft < maxScroll - 4,
        });
    };

    useEffect(() => {
        measure();
        const el = scrollerRef.current;
        if (!el) return;
        el.addEventListener('scroll', measure, { passive: true });
        window.addEventListener('resize', measure);
        return () => {
            el.removeEventListener('scroll', measure);
            window.removeEventListener('resize', measure);
        };
    }, [tabs]);

    // Keep the active tab visible on narrow screens.
    useEffect(() => {
        const el = scrollerRef.current;
        if (!el) return;
        const button = el.querySelector(`[data-tab-id="${activeTab}"]`);
        button?.scrollIntoView({
            behavior: 'smooth',
            inline: 'nearest',
            block: 'nearest',
        });
    }, [activeTab]);

    const nudge = direction => {
        scrollerRef.current?.scrollBy({
            left: direction * 220,
            behavior: 'smooth',
        });
    };

    if (!tabs || tabs.length === 0) return null;

    return (
        <div className="sticky top-20 z-30 bg-[var(--card)]/95 backdrop-blur-md border border-t-0 border-[var(--border)] rounded-b-[var(--radius-lg)] shadow-[0_1px_2px_rgba(16,26,40,0.04),0_8px_24px_-8px_rgba(16,26,40,0.08)]">
            <div className="relative">
                {overflow.left && (
                    <button
                        type="button"
                        aria-label="Scroll tabs left"
                        onClick={() => nudge(-1)}
                        className="absolute left-1 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-[var(--card)] border border-[var(--border)] shadow-sm text-[var(--foreground)] hover:bg-[var(--color-ink-50)] transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                )}

                <div
                    ref={scrollerRef}
                    role="tablist"
                    aria-label="College sections"
                    className="flex items-stretch gap-1 px-6 sm:px-8 overflow-x-auto scroll-smooth snap-x college-tabs-scroller"
                    style={{ scrollbarWidth: 'none' }}
                    onKeyDown={event => {
                        if (
                            event.key !== 'ArrowRight' &&
                            event.key !== 'ArrowLeft'
                        )
                            return;
                        event.preventDefault();
                        const index = tabs.findIndex(t => t.id === activeTab);
                        const delta = event.key === 'ArrowRight' ? 1 : -1;
                        const next =
                            (index + delta + tabs.length) % tabs.length;
                        onChange(tabs[next].id);
                    }}
                >
                    {tabs.map(tab => {
                        const isActive = tab.id === activeTab;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                role="tab"
                                data-tab-id={tab.id}
                                aria-selected={isActive}
                                aria-controls={`panel-${tab.id}`}
                                tabIndex={isActive ? 0 : -1}
                                onClick={() => onChange(tab.id)}
                                className={`shrink-0 snap-start whitespace-nowrap px-4 py-4 text-sm sm:text-base font-medium border-b-2 transition-colors ${
                                    isActive
                                        ? 'border-[var(--color-amber-600)] text-[var(--foreground)] font-semibold'
                                        : 'border-transparent text-[var(--muted)] hover:text-[var(--foreground)]'
                                }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {overflow.right && (
                    <button
                        type="button"
                        aria-label="Scroll tabs right"
                        onClick={() => nudge(1)}
                        className="absolute right-1 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-[var(--card)] border border-[var(--border)] shadow-sm text-[var(--foreground)] hover:bg-[var(--color-ink-50)] transition-colors"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                )}
            </div>

            <style
                dangerouslySetInnerHTML={{
                    __html: `.college-tabs-scroller::-webkit-scrollbar { display: none; }`,
                }}
            />
        </div>
    );
};

export default CollegeTabNav;
