import asyncHandler from '../../common/utils/asyncHandler.js';
import * as newsService from './news.service.js';

export const getNews = asyncHandler(async (req, res) => {
    const allNews = await newsService.getNews();
    res.status(200).json({ success: true, data: allNews });
});

export const getLatestFiveNews = asyncHandler(async (req, res) => {
    const latestFiveNews = await newsService.getLatestFiveNews();
    res.status(200).json({ success: true, data: latestFiveNews });
});

export const getNewsById = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const news = await newsService.getNewsById(id);
    res.status(200).json({ success: true, data: news });
});

export const createNews = asyncHandler(async (req, res) => {
    const news = await newsService.createNews(req.body);
    res.status(200).json({ success: true, data: news });
});

export const updateNews = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const updatedNews = await newsService.updateNewsById(id, req.body);
    res.status(200).json({ success: true, data: updatedNews });
});

export const deleteNewsById = asyncHandler(async (req, res) => {
    const id = req.params.id;
    await newsService.deleteNewsById(id);
    res.status(200).json({ success: true, data: 'deleted successfully' });
});
