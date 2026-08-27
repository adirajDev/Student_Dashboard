import { useMemo, useState } from 'react';
import { getPublishedDate, stripMarkup } from '../utils/postUtils';

export const DEFAULT_FILTERS = {
    query: '',
    sort: 'newest',
    month: 'all',
};

// Everything is client-side: GET /posts returns the full list with no query
// params, so there is nothing to push to the server.
const usePostFilters = posts => {
    const [filters, setFilters] = useState(DEFAULT_FILTERS);

    const results = useMemo(() => {
        const query = filters.query.trim().toLowerCase();

        const filtered = (posts || []).filter(post => {
            if (query) {
                const haystack = [
                    post.title,
                    post.subtitle,
                    post.excerpt,
                    post.category,
                    post.authorName,
                    ...(Array.isArray(post.tags) ? post.tags : []),
                    stripMarkup(post.content || ''),
                ]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();

                if (!haystack.includes(query)) return false;
            }

            if (filters.month !== 'all') {
                const date = getPublishedDate(post);
                if (!date || date.getMonth() !== Number(filters.month)) {
                    return false;
                }
            }

            return true;
        });

        return filtered.sort((a, b) => {
            const aTime = getPublishedDate(a)?.getTime() || 0;
            const bTime = getPublishedDate(b)?.getTime() || 0;
            return filters.sort === 'oldest' ? aTime - bTime : bTime - aTime;
        });
    }, [posts, filters]);

    const hasActiveFilters =
        Boolean(filters.query) ||
        filters.sort !== DEFAULT_FILTERS.sort ||
        filters.month !== 'all';

    const clearFilters = () => setFilters(DEFAULT_FILTERS);

    return { filters, setFilters, results, hasActiveFilters, clearFilters };
};

export default usePostFilters;
