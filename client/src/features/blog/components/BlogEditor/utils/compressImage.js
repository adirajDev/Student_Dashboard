const DEFAULT_MAX_BYTES = 200 * 1024; // matches server IMAGE_SIZE_LIMIT_BYTES
const OUTPUT_MIME = 'image/jpeg';
const MIN_QUALITY = 0.4;
const MIN_DIMENSION = 320;

const loadImage = file =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Could not read image file.'));
        img.src = URL.createObjectURL(file);
    });

const canvasToDataUrl = (canvas, quality) =>
    canvas.toDataURL(OUTPUT_MIME, quality);

const dataUrlByteLength = dataUrl => {
    const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1);
    const padding = (base64.match(/=+$/) || [''])[0].length;
    return Math.ceil((base64.length * 3) / 4) - padding;
};

export const compressImage = async (
    file,
    { maxBytes = DEFAULT_MAX_BYTES } = {}
) => {
    const img = await loadImage(file);

    let width = img.width;
    let height = img.height;
    let dataUrl;

    for (;;) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);

        let quality = 0.9;
        dataUrl = canvasToDataUrl(canvas, quality);

        while (dataUrlByteLength(dataUrl) > maxBytes && quality > MIN_QUALITY) {
            quality -= 0.1;
            dataUrl = canvasToDataUrl(canvas, quality);
        }

        if (dataUrlByteLength(dataUrl) <= maxBytes || width <= MIN_DIMENSION) {
            break;
        }

        width = Math.round(width * 0.75);
        height = Math.round(height * 0.75);
    }

    URL.revokeObjectURL(img.src);

    const sizeBytes = dataUrlByteLength(dataUrl);
    if (sizeBytes > maxBytes) {
        throw new Error(
            `Image could not be compressed below ${Math.round(maxBytes / 1024)}KB.`
        );
    }

    return {
        dataUrl,
        base64: dataUrl.slice(dataUrl.indexOf(',') + 1),
        mimeType: OUTPUT_MIME,
        sizeBytes,
    };
};

export default compressImage;
