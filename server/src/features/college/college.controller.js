import * as collegeService from './college.service.js';
import asyncHandler from '../../common/utils/asyncHandler.js';

export const getColleges = asyncHandler(async (req, res) => {
    const colleges = await collegeService.getColleges();
    res.json(colleges);
});

export const getCollegeById = asyncHandler(async (req, res) => {
    const college = await collegeService.getCollegeById(req.params.id);
    res.json(college);
});

export const createCollege = asyncHandler(async (req, res) => {
    const college = await collegeService.createCollege(req.body);
    res.status(201).json({ message: 'College created successfully', college });
});

export const updateCollege = asyncHandler(async (req, res) => {
    const college = await collegeService.updateCollege(
        req.params.collegeId,
        req.body
    );
    res.status(200).json(college);
});

export const deleteCollege = asyncHandler(async (req, res) => {
    await collegeService.deleteCollege(req.params.collegeId);
    res.status(200).json({ message: 'College deleted successfully' });
});
