import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/services/apiClient.js'; // swap for whatever useExams uses

const NEWS_ENDPOINT = '/news';

const useNews = (shouldFetch = true) => {
    const [news, setNews] = useState([]);
    const [isLoading, setIsLoading] = useState(shouldFetch);
    const [error, setError] = useState(null);

    const fetchNews = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const { data } = await apiClient.get(NEWS_ENDPOINT);

            setNews(data?.data || []);
        } catch (err) {
            setError('Failed to load news');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (shouldFetch) fetchNews();
    }, [shouldFetch, fetchNews]);

    const addNews = useCallback(async payload => {
        const { data } = await apiClient.post(NEWS_ENDPOINT, payload);
        const created = data?.data;
        setNews(prev => [created, ...prev]);
        return created;
    }, []);

    const updateNews = useCallback(async (id, payload) => {
        const { data } = await apiClient.put(`${NEWS_ENDPOINT}/${id}`, payload);
        const updated = data?.data;
        setNews(prev =>
            prev.map(item =>
                item._id === id ? { ...item, ...updated } : item
            )
        );
        return updated;
    }, []);

    const deleteNews = useCallback(async id => {
        await apiClient.delete(`${NEWS_ENDPOINT}/${id}`);
        setNews(prev => prev.filter(item => item._id !== id));
    }, []);

    return {
        news,
        isLoading,
        error,
        addNews,
        updateNews,
        deleteNews,
        refetch: fetchNews,
    };
};

export default useNews;