import * as ratingService from './rating.service.js';
import asyncHandler from '../../common/utils/asyncHandler.js';
import { getPaginationOptions, formatPaginatedResponse } from '../../common/utils/pagination.util.js';

export const addRating = asyncHandler(async (req, res) => {
    const rating = await ratingService.addRating(req.user, req.body);
    res.status(201).json(rating);
});

export const getRatingsByCollege = asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPaginationOptions(req);
    const stars = req.query.stars ? parseInt(req.query.stars, 10) : 0;
    const { data, totalCount } = await ratingService.getRatingsByCollege(
        req.params.collegeId, skip, limit, stars
    );
    res.status(200).json(formatPaginatedResponse(data, totalCount, page, limit));
});

export const getMyRatings = asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPaginationOptions(req);
    const { data, totalCount } = await ratingService.getMyRatings(req.user._id, skip, limit);
    res.status(200).json(formatPaginatedResponse(data, totalCount, page, limit));
});

export const updateRating = asyncHandler(async (req, res) => {
    const rating = await ratingService.updateRating(
        req.user._id,
        req.params.ratingId,
        req.body
    );
    res.status(200).json(rating);
});

export const deleteRating = asyncHandler(async (req, res) => {
    await ratingService.deleteRating(req.user._id, req.params.ratingId);
    res.status(200).json({ message: 'Rating deleted successfully' });
});
