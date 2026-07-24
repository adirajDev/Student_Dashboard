import { useState, useEffect } from 'react';
import apiClient from '../../../services/apiClient';

const useCollegeSearch = (initialQuery = '') => {
    const [query, setQuery] = useState(initialQuery);
    const [filters, setFilters] = useState({
        location: [],
        course: [],
    });

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

        let filtered = [...allColleges];

        // Apply text query
        if (query.trim()) {
            const q = query.toLowerCase();
            filtered = filtered.filter(college =>
                college.name.toLowerCase().includes(q) ||
                (college.location && college.location.toLowerCase().includes(q))
            );
        }

        // Apply location filter
        if (filters.location && filters.location.length > 0) {
            filtered = filtered.filter(college => 
                college.location && filters.location.includes(college.location)
            );
        }

        // Apply course filter
        if (filters.course && filters.course.length > 0) {
            filtered = filtered.filter(college => {
                if (!college.availableCourses) return false;
                // if any course name includes any selected course filter
                return filters.course.some(courseFilter => 
                    college.availableCourses.some(c => c.name.toLowerCase().includes(courseFilter.toLowerCase()))
                );
            });
        }

        setResults(filtered);
    }, [query, filters, allColleges]);

    useEffect(() => {
        if (initialQuery) {
            setQuery(initialQuery);
        }
    }, [initialQuery]);

    return {
        query,
        setQuery,
        filters,
        setFilters,
        results,
        isLoading,
        error,
        allColleges,
    };
};

export default useCollegeSearch;
