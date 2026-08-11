import * as dataService from './data.service.js';
import asyncHandler from '../../common/utils/asyncHandler.js';

export const globalSearch = asyncHandler(async (req, res) => {
    const results = await dataService.globalSearch(req.query.q);
    res.status(200).json(results);
});

export const getStats = asyncHandler(async (req, res) => {
    const stats = await dataService.getStats();
    res.status(200).json(stats);
});
