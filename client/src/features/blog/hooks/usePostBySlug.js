import { useCallback, useEffect, useState } from 'react';
import apiClient from '@/services/apiClient.js';

const isCanceled = err =>
    err?.code === 'ERR_CANCELED' ||
    err?.name === 'CanceledError' ||
    err?.name === 'AbortError';

/**
 * Fetches GET /posts/slug/:slug
 * status: 'loading' | 'ready' | 'notFound' | 'error'
 */
const usePostBySlug = slug => {
    const [post, setPost] = useState(null);
    const [status, setStatus] = useState('loading');
    const [attempt, setAttempt] = useState(0);

    const retry = useCallback(() => setAttempt(n => n + 1), []);

    useEffect(() => {
        if (!slug) {
            setStatus('notFound');
            return undefined;
        }

        const controller = new AbortController();
        setStatus('loading');
        setPost(null);

        apiClient
            .get(`/posts/slug/${slug}`, { signal: controller.signal })
            .then(({ data }) => {
                // Tolerates { post }, { data }, or a bare post object.
                const doc = data?.post ?? data?.data ?? data;
                if (!doc?.title) {
                    setStatus('notFound');
                    return;
                }
                setPost(doc);
                setStatus('ready');
            })
            .catch(err => {
                if (isCanceled(err)) return;
                setStatus(err.response?.status === 404 ? 'notFound' : 'error');
            });

        return () => controller.abort();
    }, [slug, attempt]);

    return { post, status, retry };
};

export default usePostBySlug;
