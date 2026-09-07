import mongoose from 'mongoose';
import College from './college.model.js';
import Rating from '../rating/rating.model.js';
import AppError from '../../common/errors/AppError.js';
import Course from '../course/course.model.js';
import { buildSearchRegex } from '../../common/utils/regex.util.js';
import CollegeUpdate from './update/update.model.js';
import User from '../user/user.model.js';
import {
    FIELD_LABELS,
    throwIfDuplicate,
    UNIQUE_FIELDS,
} from './college.error.js';
import { slugify } from '../../common/utils/slug.util.js';

const assertUniqueFields = async (data, excludeId = null) => {
    const conditions = UNIQUE_FIELDS.filter(
        f => data[f] !== undefined || data[f] !== null || data[f] !== ''
    ).map(f => ({ [f]: data[f] }));

    if (conditions.length === 0) return;

    const query = { $or: conditions };
    if (excludeId) query._id = { $ne: excludeId };

    const clash = await College.findOne(query)
        .select('name slug collegeId')
        .lean();

    if (!clash) return;

    const field = UNIQUE_FIELDS.find(
        f => data[f] !== undefined && clash[f] === data[f]
    );

    if (!field) {
        throw new AppError('A college with these details already exists', 409);
    }

    throw new AppError(
        `"${clash.name}" already uses the ${FIELD_LABELS[field]} "${data[field]}"`,
        409
    );
};

const COLLEGE_DETAIL_COURSE_POPULATE = {
    path: 'availableCourses.course',
    select: 'name level shortName specialization duration',
    model: 'Course',
};

// Shared by getCollegeById and getCollegeBySlug so the public detail page
// renders identically whichever route served it.
const findCollegeDetail = async query => {
    const college = await query
        .select('-images.data')
        .populate(COLLEGE_DETAIL_COURSE_POPULATE)
        .lean();

    if (!college) {
        throw new AppError('College not found', 404);
    }

    const images = college.images || [];
    const videos = college.videos || [];

    // Cover image only. The full list is served by
    // GET /college-gallery/:collegeId/gallery when the tab opens.
    return {
        ...college,
        images: images.slice(0, 1),
        imageCount: images.length,
        videoCount: videos.length,
    };
};

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

    const searchRegex = buildSearchRegex(search);
    if (searchRegex) {
        const matchingCourses = await Course.find({ name: searchRegex }).select(
            '_id'
        );
        const courseIds = matchingCourses.map(c => c._id);

        queryObj.$or = [
            { name: searchRegex },
            { city: searchRegex },
            { state: searchRegex },
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

export const getCollegeById = async id => findCollegeDetail(College.findById(id));

export const getCollegeBySlug = async slug => {
    const normalised = String(slug ?? '')
        .trim()
        .toLowerCase();

    if (!normalised) {
        throw new AppError('College not found', 404);
    }

    return findCollegeDetail(College.findOne({ slug: normalised }));
}

export const createCollege = async payload => {
    if (!payload.name) {
        throw new AppError('Name is required', 400);
    }

    const existingCollege = await College.findOne({ name: payload.name });
    if (existingCollege) {
        throw new AppError('College already exists', 400);
    }

    const finalSlug = slugify(payload.slug || payload.name);
    if (!finalSlug) {
        throw new AppError(
            'Could not derive a valid URL slug from the college name',
            400
        );
    }
    payload.slug = finalSlug;

    await assertUniqueFields(payload);

    const college = new College(payload);
    //     name,
    //     type,
    //     finalSlug,
    //     state,
    //     city,
    //     description,
    //     collegeId,
    // });

    try {
        await college.save();
    } catch (error) {
        throwIfDuplicate(error);
    }
    return college;
};

export const updateCollege = async (id, data) => {
    const updateData = { ...data };
    delete updateData.averageRating;
    delete updateData.totalRatings;

    if (updateData.slug !== undefined) {
        const normalised = slugify(updateData.slug);
        if (!normalised) {
            throw new AppError('Slug cannot be empty', 400);
        }
        updateData.slug = normalised;
    }

    await assertUniqueFields(updateData, id);

    try {
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
    } catch (error) {
        throwIfDuplicate(error);
    }

    if (!college) {
        throw new AppError('College not found', 404);
    }

    return college;
};

export const deleteCollege = async id => {
    const session = await mongoose.startSession();
    try {
        let deleted;
        await session.withTransaction(async () => {
            const linkedUsers = await User.countDocuments({
                college: id,
            }).session(session);
            if (linkedUsers > 0) {
                throw new AppError(
                    'Remove or reassign the college accounts linked to this college before deleting it.',
                    409
                );
            }

            deleted = await College.findByIdAndDelete(id, { session });
            if (!deleted) {
                throw new AppError('College not found', 404);
            }

            await Rating.deleteMany({ college: id }, { session });
            await CollegeUpdate.deleteMany({ college: id }, { session });
            await User.updateMany(
                { 'applications.college': id },
                { $pull: { applications: { college: id } } },
                { session }
            );
        });
        return deleted;
    } finally {
        await session.endSession();
    }
};
