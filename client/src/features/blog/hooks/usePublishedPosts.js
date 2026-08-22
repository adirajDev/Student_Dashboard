import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import apiClient from '@/services/apiClient';
import {
    toImageSrc,
    toInitials,
} from '@/features/blogger/components/util/media';

const normalizePost = post => {
    const author = post?.author ?? {};
    const profile = author?.bloggerProfile ?? {};
    const authorName = author?.name ?? 'Unknown author';

    return {
        id: post?._id ?? post?.id ?? post?.slug,
        title: post?.title ?? 'Untitled',
        slug: post?.slug ?? '',
        excerpt: post?.excerpt ?? '',
        href: `/blog/${post?.slug ?? ''}`,
        authorName,
        authorInitials: toInitials(authorName),
        authorImage: toImageSrc(profile?.profileImage),
        authorPostCount:
            typeof profile?.postCount === 'number' ? profile.postCount : null,
    };
};

/** Accepts `[...]`, `{ data: [...] }` or `{ data: { posts: [...] } }`. */
const extractList = payload => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.posts)) return payload.posts;
    if (Array.isArray(payload?.data?.posts)) return payload.data.posts;
    return [];
};

export const usePublishedPosts = () => {
    const [rawPosts, setRawPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const controllerRef = useRef(null);

    const fetchPosts = useCallback(async () => {
        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;

        setIsLoading(true);
        setError(null);

        try {
            const { data } = await apiClient.get('/posts', {
                signal: controller.signal,
            });
            setRawPosts(extractList(data));
        } catch (err) {
            if (err?.code === 'ERR_CANCELED') return;
            setError(
                err?.response?.data?.message ??
                    "We couldn't load the posts. Check your connection and try again."
            );
        } finally {
            if (!controller.signal.aborted) setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts();
        return () => controllerRef.current?.abort();
    }, [fetchPosts]);

    const posts = useMemo(() => rawPosts.map(normalizePost), [rawPosts]);

    return {
        posts,
        isLoading,
        error,
        isEmpty: !isLoading && !error && posts.length === 0,
        refetch: fetchPosts,
    };
};

export default usePublishedPosts;
