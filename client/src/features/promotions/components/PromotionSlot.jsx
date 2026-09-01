import { useMemo, useState } from 'react';
import useSlotPromotions from '../hooks/useSlotPromotions';
import { getSlotConfig } from '../constants/promotionSlots';
import { getPromotionImageUrl } from '../utils/promotionUtils';

/**
 * Drops one promotion into a named slot.
 *
 * Usage: <PromotionSlot slot="collegeDetail:sidebar" />
 *
 * Renders nothing at all when there is no eligible promotion, when the fetch
 * fails, or when the image will not load. A content page must never show an
 * empty bordered box where a banner was supposed to be.
 */
const PromotionSlot = ({ slot, className = '' }) => {
    const { promotions, isLoading } = useSlotPromotions(slot);
    console.log(promotions);
    const [imageFailed, setImageFailed] = useState(false);
    const config = getSlotConfig(slot);

    /**
     * The server sorts by priority, so the first entry's priority is the
     * highest. Pick at random from everything sharing it — that rotates
     * evenly between advertisers who paid the same, with no server state and
     * no session tracking.
     *
     * Keyed on the array identity so it settles once per fetch rather than
     * reshuffling on every parent render.
     */
    const promotion = useMemo(() => {
        if (!promotions.length) return null;

        const topPriority = promotions[0].priority ?? 0;
        const band = promotions.filter(
            item => (item.priority ?? 0) === topPriority
        );

        return band[Math.floor(Math.random() * band.length)];
    }, [promotions]);

    if (isLoading || !promotion || imageFailed) return null;

    const imageUrl = getPromotionImageUrl(promotion);
    console.log(imageUrl);
    if (!imageUrl) return null;

    return (
        <section className={className} aria-label="Partner content">
            <p className="mb-1.5 text-[10px] uppercase tracking-widest text-[var(--muted)] font-semibold">
                Partner
                {console.log("rendered promotion slot")}
            </p>

            <a
                href={promotion.targetUrl}
                target="_blank"
                /**
                 * noopener is mandatory with target="_blank" — without it the
                 * destination gets a handle on this window via opener.
                 * sponsored is the correct rel for a paid placement.
                 */
                rel="noopener noreferrer nofollow sponsored"
                className="block overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--color-ink-50)] transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ink-800)]"
                /* The ratio is applied before the image resolves, so nothing
                   below this element moves when the bytes arrive. */
                style={{ aspectRatio: config?.ratio || '16 / 5' }}
            >
                <img
                    src={imageUrl}
                    alt={promotion.label}
                    loading="lazy"
                    onError={() => setImageFailed(true)}
                    className="w-full h-full object-cover"
                />
            </a>
        </section>
    );
};

export default PromotionSlot;