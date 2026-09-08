// Mirrors server/src/common/utils/slug.util.js. Kept in sync by hand —
// the server is the authority, this is only for the live preview in the
// admin and college-admin forms.
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugify(input) {
    if (typeof input !== 'string') return '';

    return input
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/['\u2018\u2019\u02bc`]/g, '')
        .replace(/&/g, ' and ')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Permissive version for keystroke-by-keystroke input. Deliberately does
// NOT trim trailing hyphens — slugify() would delete the hyphen the moment
// you typed it, making multi-word slugs impossible to type.
export function normaliseSlugInput(input) {
    return String(input)
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
}
