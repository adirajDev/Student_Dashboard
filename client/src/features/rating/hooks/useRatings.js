import { useState, useCallback } from 'react';
import apiClient from '../../../services/apiClient';

const useRatings = () => {
    const [ratings, setRatings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filterStars, setFilterStars] = useState(0);

    const getRatingsByCollege = useCallback(
        async collegeId => {
            if (!collegeId) return;
            setIsLoading(true);
            setError(null);
            try {
                const res = await apiClient.get(
                    `/ratings/college/${collegeId}?page=${page}&limit=10&stars=${filterStars}`
                );
                setRatings(res.data.data || res.data);
                if (res.data.totalPages) setTotalPages(res.data.totalPages);
                return res.data;
            } catch (err) {
                setError(
                    err.response?.data?.message || 'Failed to fetch ratings'
                );
            } finally {
                setIsLoading(false);
            }
        },
        [page, filterStars]
    );

    const getMyRatings = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await apiClient.get(`/ratings/my-ratings`);
            setRatings(res.data.data || res.data);
            return res.data;
        } catch (err) {
            setError(
                err.response?.data?.message || 'Failed to fetch your ratings'
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addRating = async data => {
        try {
            const res = await apiClient.post('/ratings/add-rating', data);
            setRatings(prev => [res.data, ...prev]);
            return { success: true, data: res.data };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || 'Failed to add rating',
            };
        }
    };

    const updateRating = async (ratingId, data) => {
        try {
            const res = await apiClient.patch(
                `/ratings/update-rating/${ratingId}`,
                data
            );
            setRatings(prev =>
                prev.map(r => (r._id === ratingId ? { ...r, ...res.data } : r))
            );
            return { success: true, data: res.data };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || 'Failed to update rating',
            };
        }
    };

    const deleteRating = async ratingId => {
        try {
            await apiClient.delete(`/ratings/delete-rating/${ratingId}`);
            setRatings(prev => prev.filter(r => r._id !== ratingId));
            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || 'Failed to delete rating',
            };
        }
    };

    return {
        ratings,
        isLoading,
        error,
        page,
        setPage,
        totalPages,
        filterStars,
        setFilterStars,
        getRatingsByCollege,
        getMyRatings,
        addRating,
        updateRating,
        deleteRating,
    };
};

export default useRatings;
