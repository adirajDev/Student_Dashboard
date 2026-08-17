import { useState, useCallback } from 'react';
import apiClient from '../../../services/apiClient';

const useBlogPosts = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const createPost = async payload => {
        setLoading(true);
        setError('');
        try {
            const res = await apiClient.post('/posts', payload);
            return res.data.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create post');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updatePost = async (id, payload) => {
        setLoading(true);
        setError('');
        try {
            const res = await apiClient.put(`/posts/${id}`, payload);
            return res.data.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update post');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const submitForReview = async id => {
        setLoading(true);
        setError('');
        try {
            const res = await apiClient.patch(`/posts/${id}/submit`);
            return res.data.data;
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    'Failed to submit post for review'
            );
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const unpublishPost = async id => {
        setLoading(true);
        setError('');
        try {
            const res = await apiClient.patch(`/posts/${id}/unpublish`);
            return res.data.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to unpublish post');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deletePost = async id => {
        setLoading(true);
        setError('');
        try {
            await apiClient.delete(`/posts/${id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete post');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getMyPosts = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await apiClient.get('/posts/mine');
            return res.data.data || [];
        } catch (err) {
            setError(
                err.response?.data?.message || 'Failed to fetch your posts'
            );
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const getPostById = useCallback(async id => {
        setLoading(true);
        setError('');
        try {
            const res = await apiClient.get(`/posts/${id}`);
            return res.data.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch post');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const getPublishedPosts = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await apiClient.get(`/posts?page=${page}&limit=10`);
            if (res.data.totalPages) setTotalPages(res.data.totalPages);
            return res.data.data || [];
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch posts');
            return [];
        } finally {
            setLoading(false);
        }
    }, [page]);

    return {
        loading,
        error,
        page,
        setPage,
        totalPages,
        createPost,
        updatePost,
        submitForReview,
        unpublishPost,
        deletePost,
        getMyPosts,
        getPostById,
        getPublishedPosts,
    };
};

export default useBlogPosts;
