import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import apiClient from '@/services/apiClient';
import {
    toImageSrc,
    toInitials,
} from '@/features/blogger/components/util/media';
import { getExcerpt, getErrorMessage } from '../utils/postUtils';

const normalizePost = post => {
    const author = post?.author ?? {};
    const profile = author?.bloggerProfile ?? {};
    const authorName = author?.name ?? 'Unknown author';

    return {
        // Keep the raw id AND the display id — postUtils falls back to the
        // ObjectId timestamp when no date field is present.
        _id: post?._id ?? null,
        id: post?._id ?? post?.id ?? post?.slug,
        title: post?.title ?? 'Untitled',
        slug: post?.slug ?? '',
        excerpt: post?.excerpt || getExcerpt(post?.content ?? ''),
        href: `/blog/${post?.slug ?? ''}`,

        // Filterable fields — usePostFilters searches and sorts on these, so
        // they have to survive normalisation.
        subtitle: post?.subtitle ?? '',
        category: post?.category ?? '',
        tags: Array.isArray(post?.tags) ? post.tags : [],
        content: post?.content ?? '',
        publishedAt: post?.publishedAt ?? null,
        publishedOn: post?.publishedOn ?? null,
        createdAt: post?.createdAt ?? null,
        date: post?.date ?? null,

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

export const usePublishedPosts = (shouldFetch = true) => {
    const [rawPosts, setRawPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(shouldFetch);
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
                getErrorMessage(
                    err,
                    "We couldn't load the posts. Check your connection and try again."
                )
            );
        } finally {
            if (!controller.signal.aborted) setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (shouldFetch) fetchPosts();
        return () => controllerRef.current?.abort();
    }, [shouldFetch, fetchPosts]);

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