import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/services/apiClient';
import { getErrorMessage } from '../utils/newsUtils';

// status: 'loading' | 'ready' | 'notFound' | 'error'
const useNewsBySlug = slug => {
    const [news, setNews] = useState(null);
    const [status, setStatus] = useState('loading');
    const [error, setError] = useState(null);

    const fetchNews = useCallback(async () => {
        if (!slug) {
            setStatus('notFound');
            return;
        }

        setStatus('loading');
        setError(null);

        try {
            const { data } = await apiClient.get(
                `/news/slug/${encodeURIComponent(slug)}`
            );

            setNews(data.data);
            setStatus('ready');
        } catch (err) {
            if (err?.response?.status === 404) {
                setNews(null);
                setStatus('notFound');
                return;
            }
            setError(getErrorMessage(err, 'Could not load this article.'));
            setStatus('error');
        }
    }, [slug]);

    useEffect(() => {
        fetchNews();
    }, [fetchNews]);

    return { news, status, error, retry: fetchNews };
};

export default useNewsBySlug;