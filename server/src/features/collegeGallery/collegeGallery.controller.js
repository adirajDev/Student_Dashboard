import * as collegeGalleryService from './collegeGallery.service.js';
import asyncHandler from '../../common/utils/asyncHandler.js';

const checkOwnership = (user, collegeId) => {
    if (user.role === 'admin') return true;

    const userCollegeId =
        typeof user.college === 'object'
            ? user.college?._id?.toString()
            : user.college?.toString();

    if (user.role === 'college' && userCollegeId === collegeId) return true;
    return false;
};

export const addImages = asyncHandler(async (req, res) => {
    if (!checkOwnership(req.user, req.params.collegeId)) {
        return res
            .status(403)
            .json({
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
    const image = await collegeGalleryService.getImage(
        req.params.collegeId,
        req.params.imageId
    );
    res.set('Content-Type', image.contentType);
    res.send(image.data);
});
