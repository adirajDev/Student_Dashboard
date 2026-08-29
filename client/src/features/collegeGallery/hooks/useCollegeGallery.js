import { useEffect, useState } from 'react';
import apiClient from '@/services/apiClient';

/**
 * Gallery metadata for the public college page.
 *
 * `GET /colleges/:id` returns only the cover image now, so the full media
 * list comes from `GET /college-gallery/:id/gallery` — fetched when the
 * Gallery tab opens, or prefetched on idle once the page has settled.
 *
 * In-flight promises are cached per college id, so a prefetch that is still
 * running when the user clicks the tab is reused rather than duplicated.
 */
const cache = new Map();

const toEmbedUrl = (url = '') => {
    if (url.includes('/embed/')) return url;
    if (url.includes('watch?v='))
        return url.replace('watch?v=', 'embed/').split('&')[0];
    if (url.includes('youtu.be/'))
        return url
            .replace('youtu.be/', 'www.youtube.com/embed/')
            .split('?')[0];
    return url;
};

const normalise = (collegeId, data) => {
    const images = data?.images || [];
    const videos = data?.videos || [];

    // One flat list so the filmstrip and viewer index into a single array.
    const media = [
        ...images.map((image, index) => ({
            key: image._id,
            type: 'image',
            src: `${apiClient.defaults.baseURL}/college-gallery/${collegeId}/gallery/images/${image._id}`,
            label: `Photo ${index + 1}`,
        })),
        ...videos.map((video, index) => ({
            key: video._id || `video-${index}`,
            type: 'video',
            src: toEmbedUrl(video.url),
            label: `Video ${index + 1}`,
        })),
    ];

    return { images, videos, media };
};

const load = collegeId => {
    if (cache.has(collegeId)) return cache.get(collegeId);

    const promise = apiClient
        .get(`/college-gallery/${collegeId}/gallery`)
        .then(res => normalise(collegeId, res.data))
        .catch(err => {
            cache.delete(collegeId); // let the next attempt retry
            throw err;
        });

    cache.set(collegeId, promise);
    return promise;
};

/** Fire-and-forget warm-up. Safe to call repeatedly. */
export const prefetchCollegeGallery = collegeId => {
    if (!collegeId) return;
    load(collegeId).catch(() => {});
};

/** Drop the cached list after an upload or delete. */
export const invalidateCollegeGallery = collegeId => {
    cache.delete(collegeId);
};

const useCollegeGallery = (collegeId, { enabled = true } = {}) => {
    const [state, setState] = useState({
        media: [],
        images: [],
        videos: [],
        isLoading: enabled,
        error: null,
    });

    useEffect(() => {
        if (!enabled || !collegeId) return;

        let cancelled = false;
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        load(collegeId)
            .then(data => {
                if (cancelled) return;
                setState({ ...data, isLoading: false, error: null });
            })
            .catch(err => {
                if (cancelled) return;
                setState({
                    media: [],
                    images: [],
                    videos: [],
                    isLoading: false,
                    error:
                        err.response?.data?.message ||
                        'Failed to load the gallery.',
                });
            });

        return () => {
            cancelled = true;
        };
    }, [collegeId, enabled]);

    return state;
};

export default useCollegeGallery;