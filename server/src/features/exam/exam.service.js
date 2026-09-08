import AppError from '../../common/errors/AppError.js';
import { validateExam, validateExamUpdate } from './exam.validation.js';
import Exam from './exam.model.js';
import { assertUniqueFields, throwIfDuplicate } from './exam.error.js';
import { slugify } from '../../common/utils/slug.util.js';


export const getAllExams = async () => {
    return Exam.find();
};

export const getExamById = async id => {
    return Exam.findById(id);
};

export const createExam = async data => {
    const value = validateExam(data);

    const finalSlug = slugify(value.slug || value.name);
    if (!finalSlug) {
        throw new AppError(
            'Could not derive a valid URL slug from the exam name',
            400
        );
    }
    value.slug = finalSlug;

    await assertUniqueFields(value);

    const exam = new Exam(value);

    try {
        await exam.save();
    } catch (error) {
        throwIfDuplicate(error);
    }

    return exam;
};

export const updateExam = async (data, id) => {
    const value = validateExamUpdate(data);

    if (value.slug !== undefined) {
        const normalised = slugify(value.slug);
        if (!normalised) {
            throw new AppError('Slug cannot be empty', 400);
        }
        value.slug = normalised;
    }

    await assertUniqueFields(value, id);

    let exam;
    try {
        exam = await Exam.findByIdAndUpdate(id, value, {
            returnDocument: 'after',
            runValidators: true,
        });
    } catch (error) {
        throwIfDuplicate(error);
    }

    if (!exam) {
        throw new AppError('Exam not found', 404);
    }

    return exam;
};

export const deleteExam = async id => {
    const exam = await Exam.findByIdAndDelete(id);

    if (!exam) {
        throw new AppError('Exam not found', 400);
    }

    return exam;
};
