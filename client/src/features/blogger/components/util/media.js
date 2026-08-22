/**
 * Images are stored as base64 in Mongo, so they arrive either as
 * `{ data, mimeType }`, a serialized Buffer `{ data: [...], contentType }`,
 * or a bare base64 string with no `data:` prefix. All become a data URI here.
 */
const BASE64_SIGNATURES = [
    ['/9j/', 'image/jpeg'],
    ['iVBOR', 'image/png'],
    ['R0lGOD', 'image/gif'],
    ['UklGR', 'image/webp'],
    ['PHN2Zw', 'image/svg+xml'],
    ['PD94bWw', 'image/svg+xml'],
];

export const toImageSrc = value => {
    if (!value) return null;

    // Already a usable URL or data URI (http, https, blob, data:)
    if (typeof value === 'string' && /^(data:|https?:|blob:|\/)/i.test(value)) {
        return value;
    }

    // { data, mimeType } or a serialized Buffer
    if (typeof value === 'object') {
        const mime = value.mimeType ?? value.contentType ?? 'image/jpeg';
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

export const toInitials = (name = '') =>
    name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(part => part[0])
        .join('')
        .toUpperCase() || '?';
