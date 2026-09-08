export function slugify(input) {
    if (!input) return '';
    return String(input)
        .replace(/[\(\[\{][^\)\]\}]*[\)\]\}]/g, ' ') // drop bracketed content
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '') // strip accents
        .replace(/['’`]/g, '') // drop apostrophes instead of turning them into hyphens
        .replace(/&/g, ' and ')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-{2,}/g, '-')
        .replace(/^-+|-+$/g, '');
}

export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
