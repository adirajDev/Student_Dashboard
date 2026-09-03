import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/services/apiClient';
import { getErrorMessage } from '../utils/newsUtils';

const useLatestNews = (shouldFetch = true) => {
    const [news, setNews] = useState([]);
    const [isLoading, setIsLoading] = useState(shouldFetch);
    const [error, setError] = useState(null);

    const fetchLatest = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data } = await apiClient.get('/news/latest-five');
            setNews(Array.isArray(data?.data) ? data.data : []);
        } catch (err) {
            setError(getErrorMessage(err, 'Could not load the latest news.'));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (shouldFetch) fetchLatest();
    }, [shouldFetch, fetchLatest]);

    return { news, isLoading, error, refetch: fetchLatest };
};

export default useLatestNews;
