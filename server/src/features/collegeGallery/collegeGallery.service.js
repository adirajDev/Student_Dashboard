import College from '../college/college.model.js';
import AppError from '../../common/errors/AppError.js';

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

export const getImage = async (collegeId, imageId) => {
    const college = await College.findById(collegeId).select('images');
    if (!college) throw new AppError('College not found', 404);

    const image = college.images.id(imageId);
    if (!image) throw new AppError('Image not found', 404);

    return image;
};
