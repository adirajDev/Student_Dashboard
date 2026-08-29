/**
 * Tab definitions for the college detail page.
 *
 * Pure data — no component imports. `useCollegeTab` needs this list to
 * validate the `?tab=` param, and it should not have to pull in every
 * panel's JSX just to check a string.
 *
 * The `id` must match the key in `components/DetailPage/tabs/index.js`
 * and the filename stem of the panel (`info` -> `InfoTab.jsx`).
 */

export const DEFAULT_TAB = 'info';

const hasPlacementFigures = college =>
    Boolean(
        college?.placementDetails &&
        (college.placementDetails.averagePackage ||
            college.placementDetails.highestPackage ||
            college.placementDetails.placementPercentage)
    );

export const COLLEGE_TABS = [
    {
        id: 'info',
        label: 'College Info',
        isAvailable: () => true,
    },
    {
        id: 'courses',
        label: 'Courses',
        isAvailable: college => (college?.availableCourses?.length || 0) > 0,
    },
    {
        id: 'placements',
        label: 'Placements',
        isAvailable: college =>
            hasPlacementFigures(college) ||
            (college?.recruiters?.length || 0) > 0,
    },
    {
        id: 'faculty',
        label: 'Faculty',
        isAvailable: college => (college?.faculty?.length || 0) > 0,
    },
    {
        id: 'gallery',
        label: 'Gallery',
        isAvailable: college =>
            (college?.images?.length || 0) + (college?.videos?.length || 0) > 0,
    },
    {
        id: 'reviews',
        // Always shown: a college with no reviews yet still needs somewhere
        // for the first student to leave one.
        label: 'Reviews',
        isAvailable: () => true,
    },
    {
        id: 'faqs',
        label: 'FAQs',
        isAvailable: college => (college?.faqs?.length || 0) > 0,
    },
];

/** Tabs that actually have something to show for this college. */
export const getAvailableTabs = college =>
    college ? COLLEGE_TABS.filter(tab => tab.isAvailable(college)) : [];

export { hasPlacementFigures };
