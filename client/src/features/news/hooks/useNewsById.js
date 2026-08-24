import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/services/apiClient'; // same client the other news hooks use
import { getErrorMessage } from '../utils/newsUtils';

// status: 'loading' | 'ready' | 'notFound' | 'error'
const useNewsById = id => {
    const [news, setNews] = useState(null);
    const [status, setStatus] = useState('loading');
    const [error, setError] = useState(null);

    const fetchNews = useCallback(async () => {
        if (!id) {
            setStatus('notFound');
            return;
        }

        setStatus('loading');
        setError(null);

        try {
            const { data } = await apiClient.get(`/news/${id}`);

            // The controller answers 200 with data: null for a missing id,
            // so an empty payload is a not-found, not a success.
            if (!data?.data) {
                setNews(null);
                setStatus('notFound');
                return;
            }

            setNews(data.data);
            setStatus('ready');
        } catch (err) {
            if (err?.response?.status === 404) {
                setStatus('notFound');
                return;
            }
            setError(getErrorMessage(err, 'Could not load this article.'));
            setStatus('error');
        }
    }, [id]);

    useEffect(() => {
        fetchNews();
    }, [fetchNews]);

    return { news, status, error, retry: fetchNews };
};

export default useNewsById;