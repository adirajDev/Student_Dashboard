// Mirrors features/news/utils/newsUtils.js.
// Image helpers deliberately live elsewhere for posts — keep using
// toImageSrc / toInitials from '@/features/blogger/components/util/media'.

export const stripMarkup = (content = '') =>
    content
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

export const getExcerpt = (content, length = 160) => {
    const text = stripMarkup(content);
    if (text.length <= length) return text;
    return `${text.slice(0, length).trimEnd()}…`;
};

export const getReadingTime = (content = '') => {
    const words = stripMarkup(content).split(' ').filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
};

// Posts carry different date fields depending on the API shape. Try each in
// priority order, then fall back to the timestamp embedded in the ObjectId so
// the UI never shows a blank — same trick newsUtils uses.
const DATE_FIELDS = ['publishedAt', 'publishedOn', 'createdAt', 'date'];

export const getPublishedDate = post => {
    if (!post) return null;

    for (const field of DATE_FIELDS) {
        const raw = post[field];
        if (!raw) continue;
        const date = new Date(raw);
        if (!Number.isNaN(date.getTime())) return date;
    }

    const id = post._id || post.id;
    if (typeof id === 'string' && id.length === 24) {
        const seconds = parseInt(id.substring(0, 8), 16);
        if (!Number.isNaN(seconds)) return new Date(seconds * 1000);
    }

    return null;
};

export const formatPublishedDate = (post, options) => {
    const date = getPublishedDate(post);
    if (!date) return '—';
    return date.toLocaleDateString(
        'en-US',
        options || { month: 'short', day: 'numeric', year: 'numeric' }
    );
};

// Always hand the UI a string — React cannot render an Error object.
export const getErrorMessage = (err, fallback = 'Something went wrong.') =>
    err?.response?.data?.message || err?.message || fallback;