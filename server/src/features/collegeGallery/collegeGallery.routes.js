import express from 'express';
import multer from 'multer';
import { requireAuth } from '../../common/middleware/auth.middleware.js';
import { requireRole } from '../../common/middleware/role.middleware.js';
import {
    addImages,
    deleteImage,
    addVideo,
    deleteVideo,
    serveImage
} from './collegeGallery.controller.js';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
});

const router = express.Router();

// Public route for fetching images
router.get('/:collegeId/gallery/images/:imageId', serveImage);

router.use(requireAuth);

// Gallery Routes (Admin & College Admin)
router.post('/:collegeId/gallery/images', requireRole('admin', 'college'), upload.array('images', 10), addImages);
router.delete('/:collegeId/gallery/images/:imageId', requireRole('admin', 'college'), deleteImage);
router.post('/:collegeId/gallery/videos', requireRole('admin', 'college'), addVideo);
router.delete('/:collegeId/gallery/videos/:videoId', requireRole('admin', 'college'), deleteVideo);

export default router;
