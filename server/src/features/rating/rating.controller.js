import * as ratingService from './rating.service.js';
import asyncHandler from '../../common/utils/asyncHandler.js';

export const addRating = asyncHandler(async (req, res) => {
    const rating = await ratingService.addRating(req.user._id, req.body);
    res.status(201).json(rating);
});

export const updateRating = asyncHandler(async (req, res) => {
    const rating = await ratingService.updateRating(req.user._id, req.params.ratingId, req.body);
    res.status(200).json(rating);
});

export const deleteRating = asyncHandler(async (req, res) => {
    await ratingService.deleteRating(req.user._id, req.params.ratingId);
    res.status(200).json({ message: "Rating deleted successfully" });
});
