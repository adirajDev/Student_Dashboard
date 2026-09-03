import apiClient from '@/services/apiClient.js';

/**
 * The image helpers are shared with News rather than duplicated. This is the
 * only file that reaches across features for them, so if they later move to a
 * neutral home (@/utils/imageUtils) this is the single import to update.
 */
export {
    prepareCoverImage as preparePromotionImage,
    getImageSrc as getLocalPreviewSrc,
    formatBytes,
    getErrorMessage,
    ACCEPTED_FILE_TYPES,
    IMAGE_SIZE_LIMIT_BYTES,
} from '@/features/news/utils/newsUtils';

/**
 * The server never sends image bytes in JSON — it serves them from a separate
 * route so the browser can cache the decoded image on its own.
 *
 * The `v` parameter is load-bearing. That route replies with
 * `Cache-Control: immutable, max-age=31536000`, so without a token that
 * changes when the image does, replacing a banner would leave every returning
 * visitor on the old one for a year. `updatedAt` is that token.
 */
export const getPromotionImageUrl = promotion => {
    if (!promotion?._id) return null;

    const base = apiClient.defaults.baseURL?.replace(/\/$/, '') || '';
    const version = promotion.updatedAt
        ? new Date(promotion.updatedAt).getTime()
        : 0;

    return `${base}/promotions/${promotion._id}/image?v=${version}`;
};

/**
 * Four display states out of three stored ones.
 *
 * `expired` and `scheduled` are computed from the dates rather than stored,
 * so the badge can never disagree with the clock — which is exactly what
 * would happen if `expired` were a value in the enum with nothing to flip it.
 */
export const derivePromotionState = promotion => {
    if (!promotion) return 'draft';
    if (promotion.status === 'draft') return 'draft';
    if (promotion.status === 'archived') return 'archived';

    const now = Date.now();
    if (promotion.endsAt && new Date(promotion.endsAt).getTime() < now) {
        return 'expired';
    }
    if (promotion.startsAt && new Date(promotion.startsAt).getTime() > now) {
        return 'scheduled';
    }
    return 'live';
};

export const PROMOTION_STATE_STYLES = {
    live: { label: 'Live', className: 'bg-emerald-100 text-emerald-700' },
    scheduled: { label: 'Scheduled', className: 'bg-sky-100 text-sky-700' },
    draft: { label: 'Draft', className: 'bg-slate-100 text-slate-600' },
    expired: { label: 'Expired', className: 'bg-amber-100 text-amber-700' },
    archived: { label: 'Archived', className: 'bg-slate-100 text-slate-500' },
};

/**
 * <input type="datetime-local"> will not accept an ISO string with a timezone,
 * and emits a local-time string with no zone. These two convert both ways.
 */
export const toDateTimeLocal = value => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    // Shift by the offset so toISOString() yields local wall-clock time.
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
};

export const fromDateTimeLocal = value => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

export const formatWindow = promotion => {
    const fmt = value =>
        value
            ? new Date(value).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
              })
            : null;

    const start = fmt(promotion.startsAt);
    const end = fmt(promotion.endsAt);

    if (!start && !end) return 'Always on';
    if (start && !end) return `From ${start}`;
    if (!start && end) return `Until ${end}`;
    return `${start} — ${end}`;
};
