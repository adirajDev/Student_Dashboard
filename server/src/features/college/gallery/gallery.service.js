import College from '../college.model.js';
import AppError from '../../../common/errors/AppError.js';

/**
 * Gallery metadata only — ids, mime types and video urls, no buffers.
 *
 * This is what both the public gallery tab and the college dashboard read.
 * `GET /colleges/:id` now returns only the cover image, so neither can go
 * back to reading `college.images` from the detail payload.
 */
export const getGalleryMeta = async collegeId => {
    const college = await College.findById(collegeId)
                                 .select('images._id images.contentType videos')
                                 .lean();

    if (!college) throw new AppError('College not found', 404);

    return {
        images: college.images || [],
        videos: college.videos || [],
    };
};

export const addImages = async (collegeId, files) => {
    const college = await College.findById(collegeId);
    if (!college) throw new AppError('College not found', 404);

    const newImages = files.map(file => ({
        data: file.buffer,
        contentType: file.mimetype,
    }));

    college.images.push(...newImages);
    await college.save();
    return college;
};

export const deleteImage = async (collegeId, imageId) => {
    const college = await College.findById(collegeId);
    if (!college) throw new AppError('College not found', 404);

    college.images = college.images.filter(
        img => img._id.toString() !== imageId
    );
    await college.save();
    return college;
};

export const addVideo = async (collegeId, url) => {
    const college = await College.findById(collegeId);
    if (!college) throw new AppError('College not found', 404);

    college.videos.push({ url });
    await college.save();
    return college;
};

export const deleteVideo = async (collegeId, videoId) => {
    const college = await College.findById(collegeId);
    if (!college) throw new AppError('College not found', 404);

    college.videos = college.videos.filter(
        vid => vid._id.toString() !== videoId
    );
    await college.save();
    return college;
};

/**
 * Positional projection — `images.$` returns only the matching subdocument.
 *
 * The previous version was `.findById(collegeId).select('images')`, which
 * pulled every buffer in the college out of Mongo to serve one image. A
 * 20-image gallery did 20 full-gallery reads to render 20 thumbnails.
 */
export const getImage = async (collegeId, imageId) => {
    const college = await College.findOne(
        { _id: collegeId, 'images._id': imageId },
        { 'images.$': 1 }
    ).lean();

    const image = college?.images?.[0];
    if (!image) throw new AppError('Image not found', 404);

    return image;
};