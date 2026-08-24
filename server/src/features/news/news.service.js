import News from './news.model.js';
import AppError from '../../common/errors/AppError.js';

export const getNews = async () => {
    return News.find({}).sort({ createdAt: -1 }).lean();
};

export const getNewsById = async id => {
    return News.findById(id).lean();
};

export const createNews = async payload => {
    const news = await new News(payload);
    return await news.save();
};

export const updateNewsById = async (id, payload) => {
    const news = await News.findById(id);
    if (!news) {
        throw new AppError('No news is found with this id', 404);
    }
    await news.set(payload);
    return await news.save();
};

export const deleteNewsById = async id => {
    const news = await News.findById(id);
    if (!news) {
        throw new AppError('No news is found with this id', 404);
    }
    return news.deleteOne();
};
