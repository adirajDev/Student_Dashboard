/**
 * Mirror of server/src/features/ads/ad.constants.js — AD_SLOTS.
 *
 * Duplicated rather than fetched so the admin form can render its dropdown on
 * first paint with no request. If you add a slot, add it in both files.
 *
 * `ratio` is what PromotionSlot uses to reserve space before the image loads,
 * so an arriving banner never pushes the page around.
 */
export const PROMOTION_SLOTS = [
    {
        id: 'collegeDetail:sidebar',
        label: 'College detail — sidebar',
        ratio: '1 / 1',
    },
    {
        id: 'collegeListing:inline',
        label: 'College listing — mid-list',
        ratio: '4 / 1',
    },
    {
        id: 'newsListing:sidebar',
        label: 'News listing — sidebar',
        ratio: '1 / 1',
    },
    {
        id: 'newsDetail:inline',
        label: 'News article — below body',
        ratio: '4 / 1',
    },
    {
        id: 'examDetail:sidebar',
        label: 'Exam detail — sidebar',
        ratio: '1 / 1',
    },
];

export const PROMOTION_SLOT_IDS = PROMOTION_SLOTS.map(slot => slot.id);

export const getSlotConfig = id =>
    PROMOTION_SLOTS.find(slot => slot.id === id) || null;

/**
 * The page half of `page:position`, title-cased for the form's optgroups.
 * `collegeDetail:sidebar` becomes `College Detail`.
 */
export const getSlotPageLabel = id =>
    (id.split(':')[0] || '')
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, c => c.toUpperCase())
        .trim();

export const PROMOTION_STATUSES = [
    { value: 'draft', label: 'Draft' },
    { value: 'active', label: 'Active' },
    { value: 'archived', label: 'Archived' },
];