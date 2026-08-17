const VIDEO_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

const YOUTUBE_URL_PATTERNS = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
];

export const extractYoutubeVideoId = url => {
    if (!url || typeof url !== 'string') return null;

    const trimmed = url.trim();

    if (VIDEO_ID_PATTERN.test(trimmed)) return trimmed;

    for (const pattern of YOUTUBE_URL_PATTERNS) {
        const match = trimmed.match(pattern);
        if (match) return match[1];
    }

    return null;
};

export default extractYoutubeVideoId;
