/**
 * The registry of ad slots that actually exist in the UI.
 *
 * A slot id is `page:position`. It is one field rather than two because not
 * every page has every position — two orthogonal fields would let an admin
 * save `landing:sidebar`, which renders nowhere and fails silently.
 *
 * `ratio` is consumed by the client's AdSlot component to reserve space
 * before the image loads, so the page does not reflow. Keep it in sync with
 * client/src/features/ads/constants/adSlots.js.
 */
export const AD_SLOTS = [
    {
        id: 'collegeDetail:sidebar',
        label: 'College detail — sidebar',
        ratio: '3/4',
    },
    {
        id: 'collegeListing:inline',
        label: 'College listing — mid-list',
        ratio: '16/5',
    },
    {
        id: 'newsListing:sidebar',
        label: 'News listing — sidebar',
        ratio: '3/4',
    },
    {
        id: 'newsDetail:inline',
        label: 'News article — below body',
        ratio: '16/5',
    },
    {
        id: 'examDetail:sidebar',
        label: 'Exam detail — sidebar',
        ratio: '3/4',
    },
];

export const AD_SLOT_IDS = AD_SLOTS.map(slot => slot.id);

/**
 * Status is intent, not schedule. There is deliberately no `expired` value —
 * expiry is derived from `endsAt` at query time, so the stored status can
 * never contradict the clock.
 */
export const AD_STATUSES = ['draft', 'active', 'archived'];

// How many ads one slot will ever return. The client picks one from the list;
// the cap just stops a runaway slot shipping fifty rows.
export const MAX_ADS_PER_SLOT = 10;
