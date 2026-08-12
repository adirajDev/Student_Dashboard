import College from './college.model.js';
import Rating from '../rating/rating.model.js';
import AppError from '../../common/errors/AppError.js';

import Course from '../course/course.model.js';

export const getColleges = async (
    skip = 0,
    limit = 0,
    search = '',
    minRating = 0
) => {
    const queryObj = {};

    if (minRating) {
        queryObj.averageRating = { $gte: Number(minRating) };
    }

    const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (search) {
        const searchRegex = { $regex: escapeRegex(search), $options: 'i' };
        const matchingCourses = await Course.find({ name: searchRegex }).select(
            '_id'
        );
        const courseIds = matchingCourses.map(c => c._id);

        queryObj.$or = [
            { name: searchRegex },
            { location: searchRegex },
            { 'availableCourses.course': { $in: courseIds } },
        ];
    }

    const query = College.find(queryObj);
    const [data, totalCount] = await Promise.all([
        query
            .clone()
            .select('-images.data')
            .populate(
                'availableCourses.course',
                'name level shortName specialization duration'
            )
            .sort({ name: 1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        College.countDocuments(queryObj),
    ]);
    return { data, totalCount };
};

export const getCollegeById = async id => {
    const college = await College.findById(id)
        .select('-images.data')
        .populate({
            path: 'availableCourses.course',
            select: 'name level shortName specialization duration',
            model: 'Course',
        })
        .lean();
    if (!college) {
        throw new AppError('College not found', 404);
    }
    return college;
};

export const createCollege = async data => {
    const { name, type, location, description, collegeId } = data;

    if (!name) {
        throw new AppError('Name is required', 400);
    }

    const existingCollege = await College.findOne({ name });
    if (existingCollege) {
        throw new AppError('College already exists', 400);
    }

    const college = new College({
        name,
        type,
        location,
        description,
        collegeId,
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
    })
        .select('-images.data')
        .populate({
            path: 'availableCourses.course',
            select: 'name shortName level',
            model: 'Course',
        })
        .lean();

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
