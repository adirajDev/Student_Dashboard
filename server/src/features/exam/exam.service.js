import AppError from "../../common/utils/AppError.js";
import {validateExam} from "../../common/utils/validateExam.util.js";
import Exam from "./exam.model.js";

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