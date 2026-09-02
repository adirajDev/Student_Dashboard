/**
 * Must stay in sync with COLLEGE_TYPE in
 * server/src/features/college/college.constants.js, which backs the `type`
 * enum on the College schema.
 *
 * Order here is the order the filter sidebar renders them in.
 */
export const COLLEGE_TYPES = ['Government', 'Private', 'Deemed'];

/**
 * Rating buckets for the sidebar. `value` is the inclusive lower bound
 * compared against `College.averageRating`; 0 means "no filter".
 *
 * Colleges with no reviews yet carry averageRating 0, so any non-zero bucket
 * excludes them — which is the intended behaviour.
 */
export const RATING_BUCKETS = [
    { value: 0, label: 'Any rating' },
    { value: 4.5, label: '4.5 & above' },
    { value: 4, label: '4.0 & above' },
    { value: 3, label: '3.0 & above' },
    { value: 2, label: '2.0 & above' },
];