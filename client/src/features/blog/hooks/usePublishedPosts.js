import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import apiClient from '@/services/apiClient';

/**
 * Turns one raw post document into the exact shape the UI renders.
 * Keeping this here means PostCard never touches `author.bloggerProfile?.x`.
 */
const toInitials = (name = '') =>
    name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(part => part[0])
        .join('')
        .toUpperCase() || '?';

/**
 * profileImage is stored as base64 in Mongo, so it arrives either as a bare
 * base64 string (no `data:` prefix — unusable as an <img src>) or as a
 * serialized Buffer `{ data: [...], contentType }`. Both become a data URI here.
 */
const BASE64_SIGNATURES = [
    ['/9j/', 'image/jpeg'],
    ['iVBOR', 'image/png'],
    ['R0lGOD', 'image/gif'],
    ['UklGR', 'image/webp'],
    ['PHN2Zw', 'image/svg+xml'],
    ['PD94bWw', 'image/svg+xml'],
];

const toImageSrc = value => {
    if (!value) return null;

    // Already a usable URL or data URI (http, https, blob, data:)
    if (typeof value === 'string' && /^(data:|https?:|blob:|\/)/i.test(value)) {
        return value;
    }

    // Serialized Buffer / GridFS-ish object
    if (typeof value === 'object') {
        const mime = value.contentType ?? value.mimeType ?? 'image/jpeg';
        const raw = value.base64 ?? value.data ?? value.buffer;

        if (typeof raw === 'string') return `data:${mime};base64,${raw}`;
        if (Array.isArray(raw) || raw?.type === 'Buffer') {
            const bytes = Array.isArray(raw) ? raw : raw.data;
            const binary = Uint8Array.from(bytes).reduce(
                (acc, byte) => acc + String.fromCharCode(byte),
                ''
            );
            return `data:${mime};base64,${window.btoa(binary)}`;
        }
        return null;
    }

    if (typeof value !== 'string') return null;

    // Bare base64 — sniff the type from its magic prefix
    const cleaned = value.replace(/\s/g, '');
    const match = BASE64_SIGNATURES.find(([sig]) => cleaned.startsWith(sig));
    return `data:${match?.[1] ?? 'image/jpeg'};base64,${cleaned}`;
};

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
