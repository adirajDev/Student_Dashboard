// Pure formatters — no state, no effects. Kept out of hooks on purpose:
// these are plain functions and don't need React to run.

export const formatDate = value => {
    if (!value) return null;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

export const initialsOf = name =>
    (name || 'Editorial desk')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0].toUpperCase())
        .join('');

/**
 * Images in this schema are stored as { data: <base64>, mimeType } rather than
 * URLs, so the browser needs them reassembled into a data URL. Accepts an
 * already-complete data URL or a plain http(s) string too, in case
 * profileImage is stored differently from coverImage.
 */
export const imageSrc = image => {
    if (!image) return null;
    if (typeof image === 'string') {
        return image.startsWith('data:') || image.startsWith('http')
            ? image
            : null;
    }
    if (!image.data) return null;
    if (image.data.startsWith('data:')) return image.data;
    if (!image.mimeType) return null;
    return `data:${image.mimeType};base64,${image.data}`;
};

export const coverImageSrc = imageSrc;

/**
 * post.author is populated with { name, email, phone, bloggerProfile } —
 * or left as a bare ObjectId string if population was skipped.
 * email and phone are deliberately NOT returned: they're on the payload but
 * have no business rendering on a public page.
 */
export const authorOf = author => {
    if (!author || typeof author === 'string') {
        return { name: null, avatar: null, postCount: null, id: null };
    }

    const profile = author.bloggerProfile || {};

    return {
        id: author._id || null,
        name: author.name || null,
        avatar: imageSrc(profile.profileImage),
        postCount:
            typeof profile.postCount === 'number' ? profile.postCount : null,
    };
};

// Walks the Tiptap doc collecting text nodes.
const collectText = node => {
    if (!node || typeof node !== 'object') return '';
    if (node.type === 'text') return node.text || '';
    return (node.content || []).map(collectText).join(' ');
};

export const wordCountOf = doc =>
    collectText(doc).trim().split(/\s+/).filter(Boolean).length;
