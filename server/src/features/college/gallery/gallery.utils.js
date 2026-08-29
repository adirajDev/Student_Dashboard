/**
 * College gallery images are declared as `data: Buffer`, but Mongoose casts an
 * assigned String to a Buffer as UTF-8 — not base64. So a seed or import that
 * wrote a base64 string stored the literal text "/9j/4AAQ..." as bytes, and
 * serving it under image/jpeg gives the browser garbage.
 *
 * This normalises either shape into real image bytes. Multer uploads already
 * arrive as proper Buffers and pass straight through the sniff.
 */

const MAGIC = [
    [0, Buffer.from([0xff, 0xd8, 0xff])], // jpeg
    [0, Buffer.from([0x89, 0x50, 0x4e, 0x47])], // png
    [0, Buffer.from('GIF8', 'ascii')], // gif
    [0, Buffer.from('RIFF', 'ascii')], // webp container
    [4, Buffer.from('ftyp', 'ascii')], // avif / heif
    [0, Buffer.from('<svg', 'ascii')],
    [0, Buffer.from('<?xml', 'ascii')],
];

const looksLikeImageBytes = buf =>
    MAGIC.some(
        ([offset, sig]) =>
            buf.length >= offset + sig.length &&
            buf.subarray(offset, offset + sig.length).equals(sig)
    );

const stripDataUrlPrefix = str => str.replace(/^data:[^,]*,/, '');

/**
 * Some rows were JSON-stringified before being written, so the value arrives
 * wrapped in double quotes: "/9j/4AAQSkZJRgA...". Node's base64 decoder skips
 * characters outside the alphabet so these would mostly survive anyway, but
 * relying on that is not worth it.
 */
const clean = str =>
    stripDataUrlPrefix(str.trim().replace(/^["']|["']$/g, ''))
        .replace(/\s/g, '');

export const toImageBuffer = data => {
    if (!data) return null;

    // Plain base64 string (or data URL) straight off the document. This is the
    // branch that fires when the stored BSON type is String rather than Binary
    // — .lean() skips Mongoose casting, so it arrives as a JS string.
    if (typeof data === 'string') {
        return Buffer.from(clean(data), 'base64');
    }

    const buf = Buffer.isBuffer(data)
        ? data
        : Buffer.from(data.buffer ?? data.data ?? data);

    if (looksLikeImageBytes(buf)) return buf;

    // Buffer holding base64 text — decode it back to the real bytes.
    const decoded = Buffer.from(clean(buf.toString('utf8')), 'base64');

    // If decoding produced something that isn't an image either, fall back to
    // the original bytes rather than serving an empty response.
    return decoded.length > 0 ? decoded : buf;
};

export default toImageBuffer;