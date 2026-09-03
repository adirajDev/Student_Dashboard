import AppError from '../../common/errors/AppError.js';
import { validateExam, validateExamUpdate } from './exam.validation.js';
import Exam from './exam.model.js';

export const getAllExams = async () => {
    return Exam.find();
};

export const getExamById = async id => {
    return Exam.findById(id);
};

export const createExam = async data => {
    const value = validateExam(data);

    const existingExam = await Exam.findOne({ name: value.name });
    if (existingExam) {
        throw new AppError('Exam name already exists', 400);
    }

    const exam = new Exam(value);

    await exam.save();
    return exam;
};

// TODO: add validation for updateExam
export const updateExam = async (data, id) => {
    const value = validateExamUpdate(data);

    const exam = await Exam.findByIdAndUpdate(id, value, {
        returnDocument: 'after',
        runValidators: true,
    });

    if (!exam) {
        throw new AppError('Exam not found', 400);
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
