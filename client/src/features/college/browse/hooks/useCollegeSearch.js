import { useState, useEffect, useMemo, useCallback } from 'react';
import apiClient from '@/services/apiClient.js';
import { STATES } from '@/constants/states.js';
import { COLLEGE_TYPES, RATING_BUCKETS } from '@/constants/collegeTypes.js';
import {
    getCourseId,
    courseLabel,
} from '@/features/college/utils/collegeFormatters.js';

const EMPTY_FILTERS = { state: [], course: [], type: [], minRating: 0 };

const useCollegeSearch = (initialQuery = '') => {
    const [query, setQuery] = useState(initialQuery);
    const [filters, setFilters] = useState(EMPTY_FILTERS);

    const [allColleges, setAllColleges] = useState([]);
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all colleges once on mount
    useEffect(() => {
        const fetchColleges = async () => {
            setIsLoading(true);
            try {
                const res = await apiClient.get('/colleges?limit=1000');
                setAllColleges(res.data.data || res.data || []);
            } catch (err) {
                setError('Failed to fetch colleges.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchColleges();
    }, []);

    // Filter colleges whenever query, filters, or allColleges change
    useEffect(() => {
        if (!allColleges.length) {
            setResults([]);
            return;
        }

        let filtered = allColleges;

        // Text query — matches name, city or state
        if (query.trim()) {
            const q = query.trim().toLowerCase();
            filtered = filtered.filter(
                college =>
                    college.name?.toLowerCase().includes(q) ||
                    college.city?.toLowerCase().includes(q) ||
                    college.state?.toLowerCase().includes(q)
            );
        }

        // State / union territory — exact match against the enum value
        if (filters.state?.length) {
            const wanted = new Set(filters.state);
            filtered = filtered.filter(college => wanted.has(college.state));
        }

        // Ownership type — Government / Private / Deemed
        if (filters.type?.length) {
            const wanted = new Set(filters.type);
            filtered = filtered.filter(college => wanted.has(college.type));
        }

        // Rating — inclusive lower bound. Unrated colleges sit at 0 and so
        // drop out of every bucket above "Any".
        if (filters.minRating > 0) {
            filtered = filtered.filter(
                college => (college.averageRating || 0) >= filters.minRating
            );
        }

        // Course — matched by id, not by name, so "MBA (Finance)" and
        // "MBA (Marketing)" stay distinct instead of both matching "MBA"
        if (filters.course?.length) {
            const wanted = new Set(filters.course);
            filtered = filtered.filter(college =>
                (college.availableCourses || []).some(entry =>
                    wanted.has(getCourseId(entry))
                )
            );
        }

        setResults(filtered);
    }, [query, filters, allColleges]);

    useEffect(() => {
        if (initialQuery) {
            setQuery(initialQuery);
        }
    }, [initialQuery]);

    /**
     * Only regions that actually have colleges are offered, so the sidebar
     * doesn't list 36 checkboxes that all return zero results. Order comes
     * from the STATES constant, so states come before union territories.
     */
    const stateOptions = useMemo(() => {
        const counts = new Map();
        allColleges.forEach(college => {
            if (!college.state) return;
            counts.set(college.state, (counts.get(college.state) || 0) + 1);
        });

        return STATES.filter(state => counts.has(state)).map(state => ({
            value: state,
            label: state,
            count: counts.get(state),
        }));
    }, [allColleges]);

    const typeOptions = useMemo(() => {
        const counts = new Map();
        allColleges.forEach(college => {
            if (!college.type) return;
            counts.set(college.type, (counts.get(college.type) || 0) + 1);
        });

        return COLLEGE_TYPES.filter(type => counts.has(type)).map(type => ({
            value: type,
            label: type,
            count: counts.get(type),
        }));
    }, [allColleges]);

    /**
     * Buckets are static, but the counts are not — showing how many colleges
     * clear each threshold stops the user picking a bucket that empties the
     * list. "Any rating" counts everything, including unrated colleges.
     */
    const ratingOptions = useMemo(
        () =>
            RATING_BUCKETS.map(bucket => ({
                ...bucket,
                count:
                    bucket.value === 0
                        ? allColleges.length
                        : allColleges.filter(
                              c => (c.averageRating || 0) >= bucket.value
                          ).length,
            })),
        [allColleges]
    );

    const courseOptions = useMemo(() => {
        const byId = new Map();

        allColleges.forEach(college => {
            (college.availableCourses || []).forEach(entry => {
                const value = getCourseId(entry);
                const label = courseLabel(entry);
                // Unpopulated references have an id but no label — skip them
                // rather than render a raw ObjectId in the sidebar.
                if (!value || !label) return;

                const existing = byId.get(value);
                byId.set(value, {
                    value,
                    label,
                    count: (existing?.count || 0) + 1,
                });
            });
        });

        return [...byId.values()].sort((a, b) =>
            a.label.localeCompare(b.label)
        );
    }, [allColleges]);

    /** For the multi-select filters: adds or removes one value. */
    const toggleFilter = useCallback((key, value) => {
        setFilters(prev => {
            const current = Array.isArray(prev[key]) ? prev[key] : [];
            return {
                ...prev,
                [key]: current.includes(value)
                    ? current.filter(v => v !== value)
                    : [...current, value],
            };
        });
    }, []);

    /** For the single-value filters, currently just minRating. */
    const setFilter = useCallback((key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    }, []);

    const clearFilters = useCallback(() => setFilters(EMPTY_FILTERS), []);

    const activeFilterCount =
        (filters.state?.length || 0) +
        (filters.course?.length || 0) +
        (filters.type?.length || 0) +
        (filters.minRating > 0 ? 1 : 0);

    return {
        query,
        setQuery,
        filters,
        setFilters,
        toggleFilter,
        setFilter,
        clearFilters,
        activeFilterCount,
        stateOptions,
        typeOptions,
        ratingOptions,
        courseOptions,
        results,
        isLoading,
        error,
        allColleges,
    };
};

export default useCollegeSearch;
