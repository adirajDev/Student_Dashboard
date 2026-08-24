// Adjust this path to wherever compressImage lives in your tree —
// in BlogEditor it is imported as './utils/compressImage'.
import { compressImage } from '@/features/blog/components/BlogEditor/utils/compressImage.js';

export const IMAGE_SIZE_LIMIT_BYTES = 500 * 1024; // 500KB — must match the model

// The browser (and canvas encoders) report image/jpeg, but the news schema enum
// only accepts image/jpg — normalise before sending anything to the API.
const MIME_ALIASES = {
    'image/jpeg': 'image/jpg',
};

// Mirrors the enum on the News model.
export const ALLOWED_MIME_TYPES = [
    'image/jpg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/gif',
];

// What compressImage can actually decode/re-encode — same list BlogEditor uses.
export const ACCEPTED_FILE_TYPES = 'image/jpeg,image/png,image/webp';

export const normalizeMimeType = mimeType => MIME_ALIASES[mimeType] || mimeType;

export const formatBytes = bytes => {
    if (!bytes && bytes !== 0) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// The API stores raw base64, not a data URL — strip the prefix if one is present.
export const stripDataUrlPrefix = (value = '') =>
    value.startsWith('data:') ? value.slice(value.indexOf(',') + 1) : value;

const estimateBytes = base64 => Math.round((base64.length * 3) / 4);

// Compresses, then returns the exact coverImage sub-document the API expects:
// { data, mimeType, sizeBytes }. Throws with a user-facing message on failure.
export const prepareCoverImage = async file => {
    const { base64, mimeType, sizeBytes } = await compressImage(file);

    const data = stripDataUrlPrefix(base64);
    const normalizedMimeType = normalizeMimeType(mimeType);
    const bytes = sizeBytes ?? estimateBytes(data);

    if (!ALLOWED_MIME_TYPES.includes(normalizedMimeType)) {
        throw new Error('Use a JPG, PNG, WebP, AVIF or GIF image.');
    }

    if (bytes > IMAGE_SIZE_LIMIT_BYTES) {
        throw new Error(
            `That image is still ${formatBytes(bytes)} after compression. The limit is ${formatBytes(
                IMAGE_SIZE_LIMIT_BYTES
            )} — try a smaller one.`
        );
    }

    return { data, mimeType: normalizedMimeType, sizeBytes: bytes };
};

// Works whether the stored data is raw base64 or a full data URL.
export const getImageSrc = coverImage => {
    if (!coverImage?.data) return null;
    if (coverImage.data.startsWith('data:')) return coverImage.data;
    return `data:${coverImage.mimeType || 'image/png'};base64,${coverImage.data}`;
};

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

// createdAt only exists if the schema is given { timestamps: true }; fall back
// to the timestamp embedded in the ObjectId so the UI never shows a blank.
export const getPublishedDate = news => {
    if (news?.createdAt) return new Date(news.createdAt);
    if (news?._id && news._id.length === 24) {
        const seconds = parseInt(news._id.substring(0, 8), 16);
        if (!Number.isNaN(seconds)) return new Date(seconds * 1000);
    }
    return null;
};

export const formatPublishedDate = (news, options) => {
    const date = getPublishedDate(news);
    if (!date) return '—';
    return date.toLocaleDateString(
        'en-US',
        options || { month: 'short', day: 'numeric', year: 'numeric' }
    );
};

// Always hand the UI a string — React cannot render an Error object.
export const getErrorMessage = (err, fallback = 'Something went wrong.') =>
    err?.response?.data?.message || err?.message || fallback;