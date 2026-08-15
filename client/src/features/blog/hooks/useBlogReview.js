import { useState, useCallback } from 'react';
import apiClient from '../../../services/apiClient';

const useBlogReview = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const getPendingPosts = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await apiClient.get(`/posts/admin/pending?page=${page}&limit=10`);
            if (res.data.totalPages) setTotalPages(res.data.totalPages);
            return res.data.data || [];
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch pending posts');
            return [];
        } finally {
            setLoading(false);
        }
    }, [page]);

    const approvePost = async id => {
        setLoading(true);
        setError('');
        try {
            const res = await apiClient.patch(`/posts/${id}/approve`);
            return res.data.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to approve post');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const rejectPost = async (id, reviewNote) => {
        setLoading(true);
        setError('');
        try {
            const res = await apiClient.patch(`/posts/${id}/reject`, { reviewNote });
            return res.data.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reject post');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        page,
        setPage,
        totalPages,
        getPendingPosts,
        approvePost,
        rejectPost,
    };
};

export default useBlogReview;
