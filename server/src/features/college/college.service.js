import College from './college.model.js';
import Rating from '../rating/rating.model.js';
import AppError from '../../common/utils/AppError.js';

export const getColleges = async () => {
    return await College.find({})
        .populate('availableCourses', 'name level')
        .sort({ name: 1 });
};

export const getCollegeById = async id => {
    const college = await College.findById(id).populate('availableCourses');
    if (!college) {
        throw new AppError('College not found', 404);
    }
    return college;
};

export const createCollege = async data => {
    const { name, location, description, collegeId, availableCourses } = data;

    if (!name) {
        throw new AppError('Name is required', 400);
    }

    const existingCollege = await College.findOne({ name });
    if (existingCollege) {
        throw new AppError('College already exists', 400);
    }

    const college = new College({
        name,
        location,
        description,
        collegeId,
        availableCourses,
    });

    await college.save();
    return college;
};

export const updateCollege = async (id, data) => {
    const updateData = { ...data };
    delete updateData.averageRating;
    delete updateData.totalRatings;

    const college = await College.findByIdAndUpdate(id, updateData, {
        returnDocument: 'after',
        runValidators: true,
    }).populate('availableCourses', 'name level');

    if (!college) {
        throw new AppError('College not found', 404);
    }

    return college;
};

export const deleteCollege = async id => {
    const college = await College.findByIdAndDelete(id);
    if (!college) {
        throw new AppError('College not found', 404);
    }

    await Rating.deleteMany({ college: id });
    return college;
};
