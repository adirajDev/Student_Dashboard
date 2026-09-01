import * as collegeGalleryService from './gallery.service.js';
import asyncHandler from '../../../common/utils/asyncHandler.js';
import { toImageBuffer } from '../../../common/utils/image.utils.js';

const checkOwnership = (user, collegeId) => {
    if (user.role === 'admin') return true;

    const userCollegeId =
        typeof user.college === 'object'
            ? user.college?._id?.toString()
            : user.college?.toString();

    if (user.role === 'college' && userCollegeId === collegeId) return true;
    return false;
};

/** Public. Image ids + mime types + video urls. No buffers. */
export const getGallery = asyncHandler(async (req, res) => {
    const gallery = await collegeGalleryService.getGalleryMeta(
        req.params.collegeId
    );
    res.status(200).json(gallery);
});

export const addImages = asyncHandler(async (req, res) => {
    if (!checkOwnership(req.user, req.params.collegeId)) {
        return res.status(403).json({
            message: 'Access denied. You can only modify your own college.',
        });
    }
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files provided' });
    }
    const college = await collegeGalleryService.addImages(
        req.params.collegeId,
        req.files
    );
    res.status(200).json({ message: 'Images added successfully', college });
});

export const deleteImage = asyncHandler(async (req, res) => {
    if (!checkOwnership(req.user, req.params.collegeId)) {
        return res.status(403).json({ message: 'Access denied.' });
    }
    const college = await collegeGalleryService.deleteImage(
        req.params.collegeId,
        req.params.imageId
    );
    res.status(200).json({ message: 'Image deleted successfully', college });
});

export const addVideo = asyncHandler(async (req, res) => {
    if (!checkOwnership(req.user, req.params.collegeId)) {
        return res.status(403).json({ message: 'Access denied.' });
    }
    if (!req.body.url) {
        return res.status(400).json({ message: 'Video URL is required' });
    }
    const college = await collegeGalleryService.addVideo(
        req.params.collegeId,
        req.body.url
    );
    res.status(200).json({ message: 'Video added successfully', college });
});

export const deleteVideo = asyncHandler(async (req, res) => {
    if (!checkOwnership(req.user, req.params.collegeId)) {
        return res.status(403).json({ message: 'Access denied.' });
    }
    const college = await collegeGalleryService.deleteVideo(
        req.params.collegeId,
        req.params.videoId
    );
    res.status(200).json({ message: 'Video deleted successfully', college });
});

export const serveImage = asyncHandler(async (req, res) => {
    const { collegeId, imageId } = req.params;

    // An image's bytes never change for a given subdocument id — editing the
    // gallery pushes a new id and deleting one orphans the old. So the id
    // alone is a valid ETag, and the response can be cached indefinitely.
    const etag = `"college-image-${imageId}"`;

    // Answered before touching the database.
    if (req.headers['if-none-match'] === etag) {
        return res.status(304).end();
    }

    const image = await collegeGalleryService.getImage(collegeId, imageId);

    // Legacy rows may hold base64 text rather than binary — normalise both.
    const bytes = toImageBuffer(image.data);
    if (!bytes) {
        return res.status(404).json({ message: 'Image data is empty' });
    }

    res.set({
        'Content-Type': image.contentType || 'image/jpeg',
        'Content-Length': bytes.length,
        'Cache-Control': 'public, max-age=31536000, immutable',
        ETag: etag,
    });
    res.send(bytes);
});
