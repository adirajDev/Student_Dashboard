import AppError from "../../common/utils/AppError.js";
import {validateExam} from "../../common/utils/validateExam.util.js";
import Exam from "./exam.model.js";

export const getAllExams = async () => {
    return await Exam.find({})
}

export const getExamById = async id => {
    return await Exam.findById(id);
}

export const createExam = async data => {
    const {
        name,
        requirement,
        regStartingDate,
        regEndingDate,
        examMode,
        examDescription,
        examLink
    } = data;

    validateExam(data)

    const existingExam = await Exam.findOne({name})
    if (existingExam) {
        throw new AppError('Exam name already exists', 400)
    }

    const exam = new Exam({
        name,
        requirement,
        regStartingDate,
        regEndingDate,
        examMode,
        examDescription,
        examLink,
    });

    await exam.save();
    return exam;
}