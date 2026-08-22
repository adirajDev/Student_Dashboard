import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import apiClient from '@/services/apiClient';
import { toImageSrc, toInitials } from '../components/util/media.js';

const formatMemberSince = value => {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
};

const normalizeBlogger = blogger => {
    const user = blogger?.user ?? {};
    const name = user?.name ?? 'Unknown blogger';

    return {
        id: blogger?._id ?? user?._id,
        userId: user?._id ?? null,
        name,
        initials: toInitials(name),
        email: user?.email ?? null,
        phone: user?.phone ?? null,
        about: blogger?.about ?? '',
        achievements: Array.isArray(blogger?.achievements)
            ? blogger.achievements
            : [],
        specializations: Array.isArray(blogger?.specializations)
            ? blogger.specializations
            : [],
        postCount:
            typeof blogger?.postCount === 'number' ? blogger.postCount : 0,
        avatar: toImageSrc(blogger?.profileImage),
        memberSince: formatMemberSince(blogger?.createdAt),
    };
};

export const useBloggerProfile = userId => {
    const [raw, setRaw] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const controllerRef = useRef(null);

    const fetchBlogger = useCallback(async () => {
        if (!userId) {
            setIsLoading(false);
            setNotFound(true);
            return;
        }

        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;

        setIsLoading(true);
        setError(null);
        setNotFound(false);

        try {
            const { data } = await apiClient.get(`/blogger/${userId}`, {
                signal: controller.signal,
            });
            setRaw(data?.data ?? data ?? null);

            // todo: remove after debugging
            console.log(raw);
        } catch (err) {
            if (err?.code === 'ERR_CANCELED') return;
            if (err?.response?.status === 404) {
                setNotFound(true);
                return;
            }
            setError(
                err?.response?.data?.message ??
                    "We couldn't load this profile. Check your connection and try again."
            );
        } finally {
            if (!controller.signal.aborted) setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchBlogger();
        return () => controllerRef.current?.abort();
    }, [fetchBlogger]);

    const blogger = useMemo(() => (raw ? normalizeBlogger(raw) : null), [raw]);

    return { blogger, isLoading, error, notFound, refetch: fetchBlogger };
};

export default useBloggerProfile;
