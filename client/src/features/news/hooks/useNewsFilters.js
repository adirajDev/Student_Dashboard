import { useMemo, useState } from 'react';
import { getPublishedDate, stripMarkup } from '../utils/newsUtils';

export const DEFAULT_FILTERS = {
    query: '',
    sort: 'newest',
    month: 'all',
    withCover: false,
};

// Everything is client-side: GET /news returns the full list with no query
// params, so there is nothing to push to the server.
const useNewsFilters = news => {
    const [filters, setFilters] = useState(DEFAULT_FILTERS);

    const results = useMemo(() => {
        const query = filters.query.trim().toLowerCase();

        const filtered = (news || []).filter(item => {
            if (query) {
                const haystack = `${item.title} ${stripMarkup(
                    item.content
                )}`.toLowerCase();
                if (!haystack.includes(query)) return false;
            }

            if (filters.month !== 'all') {
                const date = getPublishedDate(item);
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
    }, [news, filters]);

    const hasActiveFilters =
        Boolean(filters.query) ||
        filters.sort !== DEFAULT_FILTERS.sort ||
        filters.month !== 'all';

    const clearFilters = () => setFilters(DEFAULT_FILTERS);

    return { filters, setFilters, results, hasActiveFilters, clearFilters };
};

export default useNewsFilters;
