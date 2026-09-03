export const INDIAN_STATES = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
];

export const UNION_TERRITORIES = [
    'Andaman and Nicobar Islands',
    'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi',
    'Jammu and Kashmir',
    'Ladakh',
    'Lakshadweep',
    'Puducherry',
];

/**
 * Canonical order: 28 states, then 8 union territories. Filter option lists
 * are built by walking this array, so the sidebar always shows regions in the
 * same order regardless of what the API happens to return.
 *
 * Must stay in sync with server/src/features/college/college.constants.js,
 * which backs the `state` enum on the College schema.
 */
export const STATES = [...INDIAN_STATES, ...UNION_TERRITORIES];

export const formatLocation = c =>
    [c?.city, c?.state].filter(Boolean).join(', ');
