import AppError from '../../../common/errors/AppError.js';
import { IMAGE_SIZE_LIMIT_BYTES, MAX_IMAGES_PER_BLOG } from './post.model.js';

const ALLOWED_NODE_TYPES = [
    'doc',
    'paragraph',
    'text',
    'heading',
    'bulletList',
    'orderedList',
    'listItem',
    'blockquote',
    'horizontalRule',
    'hardBreak',
    'image',
    'youtube',
];

const ALLOWED_MARK_TYPES = [
    'bold',
    'italic',
    'underline',
    'strike',
    'code',
    'link',
];

const IMAGE_SRC_PATTERN =
    /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/;
const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const YOUTUBE_VIDEO_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;
const SIZE_TOLERANCE_BYTES = 2 * 1024;

const validateImageNode = (node, issues) => {
    const attrs = node.attrs || {};
    const match =
        typeof attrs.src === 'string'
            ? attrs.src.match(IMAGE_SRC_PATTERN)
            : null;

    if (!match) {
        issues.push(
            'Image node has an invalid or missing src (must be a base64 data URL).'
        );
    }

    if (!IMAGE_MIME_TYPES.includes(attrs.mimeType)) {
        issues.push(`Image node has an invalid mimeType: ${attrs.mimeType}.`);
    }

    if (
        typeof attrs.sizeBytes !== 'number' ||
        attrs.sizeBytes <= 0 ||
        attrs.sizeBytes > IMAGE_SIZE_LIMIT_BYTES
    ) {
        issues.push(
            `Image node sizeBytes must be a number between 1 and ${IMAGE_SIZE_LIMIT_BYTES}.`
        );
    }

    if (match) {
        const actualBytes = Buffer.byteLength(match[2], 'base64');
        if (
            typeof attrs.sizeBytes === 'number' &&
            Math.abs(actualBytes - attrs.sizeBytes) > SIZE_TOLERANCE_BYTES
        ) {
            issues.push(
                'Image node sizeBytes does not match the actual decoded image size.'
            );
        }
    }
};

const validateYoutubeNode = (node, issues) => {
    const attrs = node.attrs || {};
    if (
        typeof attrs.videoId !== 'string' ||
        !YOUTUBE_VIDEO_ID_PATTERN.test(attrs.videoId)
    ) {
        issues.push(`Youtube node has an invalid videoId: ${attrs.videoId}.`);
    }
};

const walk = (node, issues, counters) => {
    if (!node || typeof node !== 'object') {
        issues.push('Encountered a malformed content node.');
        return;
    }

    if (!ALLOWED_NODE_TYPES.includes(node.type)) {
        issues.push(`Unsupported node type: ${node.type}.`);
    }

    if (Array.isArray(node.marks)) {
        for (const mark of node.marks) {
            if (!ALLOWED_MARK_TYPES.includes(mark?.type)) {
                issues.push(`Unsupported mark type: ${mark?.type}.`);
            }
        }
    }

    if (node.type === 'image') {
        counters.imageCount += 1;
        validateImageNode(node, issues);
    }

    if (node.type === 'youtube') {
        validateYoutubeNode(node, issues);
    }

    if (Array.isArray(node.content)) {
        for (const child of node.content) {
            walk(child, issues, counters);
        }
    }
};

export const validatePostContent = content => {
    const issues = [];
    const counters = { imageCount: 0 };

    walk(content, issues, counters);

    if (counters.imageCount > MAX_IMAGES_PER_BLOG) {
        issues.push(
            `Content contains ${counters.imageCount} images, exceeding the limit of ${MAX_IMAGES_PER_BLOG}.`
        );
    }

    if (issues.length) {
        throw new AppError(issues.join('; '), 400);
    }

    return { imageCount: counters.imageCount };
};

export const validateCoverImage = coverImage => {
    if (coverImage === undefined || coverImage === null) {
        return;
    }

    const issues = [];
    const { data, mimeType, sizeBytes } = coverImage;

    if (
        typeof data !== 'string' ||
        !data.length ||
        !/^[A-Za-z0-9+/=]+$/.test(data)
    ) {
        issues.push('Cover image data must be a non-empty base64 string.');
    }

    if (!IMAGE_MIME_TYPES.includes(mimeType)) {
        issues.push(`Cover image has an invalid mimeType: ${mimeType}.`);
    }

    if (
        typeof sizeBytes !== 'number' ||
        sizeBytes <= 0 ||
        sizeBytes > IMAGE_SIZE_LIMIT_BYTES
    ) {
        issues.push(
            `Cover image sizeBytes must be a number between 1 and ${IMAGE_SIZE_LIMIT_BYTES}.`
        );
    }

    if (typeof data === 'string' && /^[A-Za-z0-9+/=]+$/.test(data)) {
        const actualBytes = Buffer.byteLength(data, 'base64');
        if (
            typeof sizeBytes === 'number' &&
            Math.abs(actualBytes - sizeBytes) > SIZE_TOLERANCE_BYTES
        ) {
            issues.push(
                'Cover image sizeBytes does not match the actual decoded image size.'
            );
        }
    }

    if (issues.length) {
        throw new AppError(issues.join('; '), 400);
    }
};
