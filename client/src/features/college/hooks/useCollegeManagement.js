import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../../services/apiClient';

const useCollegeManagement = (shouldFetch = true) => {
    const [colleges, setColleges] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [minRating, setMinRating] = useState('0');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleMinRatingChange = (val) => {
        setMinRating(val);
        setPage(1);
    };

    const fetchColleges = useCallback(async () => {
        if (!shouldFetch) return;

        setIsLoading(true);
        setError('');
        try {
            const res = await apiClient.get(`/colleges?page=${page}&limit=10&search=${encodeURIComponent(debouncedSearchTerm)}&minRating=${minRating}`);
            const data = Array.isArray(res.data) ? res.data : res.data.data;
            const sortedColleges = data.sort((a, b) =>
                a.name.toLowerCase().localeCompare(b.name.toLowerCase())
            );
            setColleges(sortedColleges);
            if (res.data.totalPages) {
                setTotalPages(res.data.totalPages);
            }
        } catch (err) {
            setError('Failed to load colleges');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [shouldFetch, page, debouncedSearchTerm, minRating]);

    useEffect(() => {
        fetchColleges();
    }, [fetchColleges]);

    const addCollege = async collegeData => {
        try {
            const res = await apiClient.post(
                '/colleges/create-college',
                collegeData
            );
            setColleges(prev =>
                [...prev, res.data.college].sort((a, b) =>
                    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
                )
            );
            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || 'Failed to add college',
            };
        }
    };

    const updateCollege = async (id, collegeData) => {
        try {
            const res = await apiClient.patch(
                `/colleges/update-college/${id}`,
                collegeData
            );
            setColleges(prev =>
                prev
                    .map(c => (c._id === id ? res.data : c))
                    .sort((a, b) =>
                        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
                    )
            );
            return { success: true };
        } catch (err) {
            return {
                success: false,
                error:
                    err.response?.data?.message || 'Failed to update college',
            };
        }
    };

    const deleteCollege = async id => {
        try {
            await apiClient.delete(`/colleges/delete-college/${id}`);
            setColleges(prev => prev.filter(c => c._id !== id));
            return { success: true };
        } catch (err) {
            console.error('Failed to delete college:', err);
            return {
                success: false,
                error:
                    err.response?.data?.message || 'Failed to delete college',
            };
        }
    };

    return {
        colleges,
        isLoading,
        error,
        page,
        totalPages,
        setPage,
        searchTerm,
        setSearchTerm,
        minRating,
        setMinRating: handleMinRatingChange,
        addCollege,
        updateCollege,
        deleteCollege,
        refreshColleges: fetchColleges,
    };
};

export default useCollegeManagement;
