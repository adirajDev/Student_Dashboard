import { useState, useEffect } from 'react';
import apiClient from '../../../services/apiClient';

const useExamSearch = (initialQuery = '') => {
    const [query, setQuery] = useState(initialQuery);
    const [filters, setFilters] = useState({
        status: 'all', // 'all', 'live', 'upcoming'
        mode: 'all', // 'all', 'Online', 'Offline'
    });

    const [allExams, setAllExams] = useState([]);
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all exams once on mount
    useEffect(() => {
        const fetchExams = async () => {
            setIsLoading(true);
            try {
                const res = await apiClient.get('/exams');
                setAllExams(res.data);
            } catch (err) {
                setError('Failed to fetch exams.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchExams();
    }, []);

    // Filter exams whenever query, filters, or allExams change
    useEffect(() => {
        if (!allExams.length) {
            setResults([]);
            return;
        }

        let filtered = [...allExams];

        // Apply text query
        if (query.trim()) {
            const q = query.toLowerCase();
            filtered = filtered.filter(exam =>
                exam.name.toLowerCase().includes(q)
            );
        }

        // Apply status filter
        if (filters.status !== 'all') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            filtered = filtered.filter(exam => {
                if (!exam.regStartingDate || !exam.regEndingDate) return false;
                const start = new Date(exam.regStartingDate);
                const end = new Date(exam.regEndingDate);

                if (filters.status === 'live') {
                    return today >= start && today <= end;
                } else if (filters.status === 'upcoming') {
                    return today < start;
                }
                return true;
            });
        }

        // Apply mode filter
        if (filters.mode !== 'all') {
            filtered = filtered.filter(exam => exam.examMode === filters.mode);
        }

        setResults(filtered);
    }, [query, filters, allExams]);

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
    };
};

export default useExamSearch;
