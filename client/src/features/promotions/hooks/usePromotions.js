import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/services/apiClient.js';
import { getErrorMessage } from '../utils/promotionUtils';

const ENDPOINT = '/promotions';

/**
 * Admin-side CRUD. Same shape as useNews so PromotionManagementSection reads
 * the same way as NewsManagementSection.
 *
 * Note that responses never carry image bytes — the server strips
 * `image.data` from every read. The table renders images through the
 * dedicated image route instead.
 */
const usePromotions = (shouldFetch = true) => {
    const [promotions, setPromotions] = useState([]);
    const [isLoading, setIsLoading] = useState(shouldFetch);
    const [error, setError] = useState(null);

    const fetchPromotions = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const { data } = await apiClient.get(ENDPOINT);
            setPromotions(data?.data || []);
        } catch (err) {
            setError(getErrorMessage(err, 'Failed to load promotions'));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (shouldFetch) fetchPromotions();
    }, [shouldFetch, fetchPromotions]);

    const addPromotion = useCallback(async payload => {
        const { data } = await apiClient.post(ENDPOINT, payload);
        const created = data?.data;
        setPromotions(prev => [created, ...prev]);
        return created;
    }, []);

    const updatePromotion = useCallback(async (id, payload) => {
        const { data } = await apiClient.put(`${ENDPOINT}/${id}`, payload);
        const updated = data?.data;
        setPromotions(prev =>
            prev.map(item => (item._id === id ? { ...item, ...updated } : item))
        );
        return updated;
    }, []);

    const deletePromotion = useCallback(async id => {
        await apiClient.delete(`${ENDPOINT}/${id}`);
        setPromotions(prev => prev.filter(item => item._id !== id));
    }, []);

    return {
        promotions,
        isLoading,
        error,
        addPromotion,
        updatePromotion,
        deletePromotion,
        refetch: fetchPromotions,
    };
};

export default usePromotions;
