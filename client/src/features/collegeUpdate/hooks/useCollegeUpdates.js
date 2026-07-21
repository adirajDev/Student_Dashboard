import { useState, useCallback } from 'react';
import apiClient from '../../../services/apiClient';

const useCollegeUpdates = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const submitUpdate = async (proposedChanges) => {
        setLoading(true);
        setError('');
        try {
            const res = await apiClient.post('/college-updates/submit', proposedChanges);
            return res.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit update');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getMyUpdates = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await apiClient.get('/college-updates/me');
            return res.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch your updates');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const getAllUpdates = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await apiClient.get('/college-updates');
            return res.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch pending updates');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const approveUpdate = async (id) => {
        setLoading(true);
        setError('');
        try {
            const res = await apiClient.put(`/college-updates/${id}/approve`);
            return res.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to approve update');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const rejectUpdate = async (id, adminFeedback) => {
        setLoading(true);
        setError('');
        try {
            const res = await apiClient.put(`/college-updates/${id}/reject`, { adminFeedback });
            return res.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reject update');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        submitUpdate,
        getMyUpdates,
        getAllUpdates,
        approveUpdate,
        rejectUpdate
    };
};

export default useCollegeUpdates;
