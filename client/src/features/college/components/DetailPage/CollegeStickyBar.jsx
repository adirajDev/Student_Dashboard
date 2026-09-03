import { CheckCircle, Loader2, Send, Star } from 'lucide-react';
import CollegeTabNav from './CollegeTabNav';

/**
 * The sticky region below the Topbar: a condensed college row that appears
 * once the full header scrolls away, plus the tab strip.
 *
 * Owns the sticky positioning — CollegeTabNav is now just the tab row, so
 * both can pin together as one surface. Border, radius and shadow mirror
 * `.card` so it reads as the bottom of CollegeHeader, which renders with
 * `rounded-b-none border-b-0` to meet it.
 *
 * `apply` comes from a single useApplyToCollege instance lifted into the
 * page. Calling that hook here as well would give this bar its own copy of
 * `status`, so applying from one place would leave the other stale.
 *
 * `top` is the measured Topbar height rather than a Tailwind class, so the
 * bar pins flush beneath it instead of leaving a strip of background.
 */
const CollegeStickyBar = ({
    college,
    tabs,
    activeTab,
    onChange,
    apply,
    isCondensed,
    top = 0,
}) => {
    const { status, isApplying, apply: onApply } = apply || {};
    const hasRating = college.totalRatings > 0;

    return (
        <div
            style={{ top }}
            className="sticky z-30 bg-[var(--card)]/95 backdrop-blur-md border border-t-0 border-[var(--border)] rounded-b-[var(--radius-lg)] shadow-[0_1px_2px_rgba(16,26,40,0.04),0_8px_24px_-8px_rgba(16,26,40,0.08)]"
        >
            {/* Collapsed to zero height until the header scrolls out. The
                grid-rows 0fr -> 1fr trick animates to the row's natural
                height without hardcoding a pixel value. */}
            <div
                aria-hidden={!isCondensed}
                className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                    isCondensed
                        ? 'grid-rows-[1fr] opacity-100'
                        : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                }`}
            >
                <div className="overflow-hidden">
                    <div className="flex items-center gap-4 px-6 sm:px-8 pt-3">
                        <div className="min-w-0 flex-1">
                            <h2 className="text-base sm:text-lg font-semibold text-[var(--foreground)] truncate">
                                {college.name}
                            </h2>
                            {hasRating && (
                                <span className="hidden sm:flex items-center gap-1.5 text-xs text-[var(--muted)] font-medium mt-0.5">
                                    <Star className="w-3.5 h-3.5 fill-[var(--color-amber-500)] text-[var(--color-amber-500)]" />
                                    <span className="text-[var(--foreground)] font-semibold">
                                        {Number(college.averageRating).toFixed(
                                            1
                                        )}
                                    </span>
                                    <span>
                                        /5 ({college.totalRatings} review
                                        {college.totalRatings === 1 ? '' : 's'})
                                    </span>
                                </span>
                            )}
                        </div>

                        <div className="shrink-0">
                            {status === 'applied' ? (
                                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/20 text-sm font-semibold">
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="hidden sm:inline">
                                        Applied
                                    </span>
                                </span>
                            ) : (
                                <button
                                    type="button"
                                    onClick={onApply}
                                    disabled={isApplying}
                                    tabIndex={isCondensed ? 0 : -1}
                                    className="inline-flex items-center justify-center gap-2 bg-[var(--color-amber-500)] text-[var(--color-ink-950)] hover:bg-[var(--color-amber-400)] px-4 py-2 rounded-[var(--radius-md)] text-sm font-semibold tracking-tight transition-all active:scale-[0.97]"
                                >
                                    {isApplying ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                    <span className="hidden sm:inline">
                                        {isApplying
                                            ? 'Applying...'
                                            : 'Apply Now'}
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <CollegeTabNav
                tabs={tabs}
                activeTab={activeTab}
                onChange={onChange}
            />
        </div>
    );
};

export default CollegeStickyBar;
