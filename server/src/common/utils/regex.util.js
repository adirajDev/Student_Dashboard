const MAX_SEARCH_LENGTH = 100;

export const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const buildSearchRegex = search => {
    if (typeof search !== 'string') return null;

    const trimmed = search.trim();
    if (!trimmed) return null;

    return {
        $regex: escapeRegex(trimmed.slice(0, MAX_SEARCH_LENGTH)),
        $options: 'i'
    };
};