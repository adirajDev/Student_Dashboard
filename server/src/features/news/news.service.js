import News from './news.model.js';
import AppError from '../../common/errors/AppError.js';
import { slugify } from '../../common/utils/slug.util.js';
import { assertUniqueFields, throwIfDuplicate } from './news.error.js';

export const getNews = async () => {
    return News.find({}).sort({ createdAt: -1 }).lean();
};

export const getLatestFiveNews = async () => {
    return News.find({}).sort({ createdAt: -1 }).limit(5).lean();
};

export const getNewsById = async id => {
    return News.findById(id).lean();
};

export const createNews = async payload => {
    const finalSlug = slugify(payload.slug || payload.title);
    if (!finalSlug) {
        throw new AppError(
            'Could not derive a valid URL slug from the news title',
            400
        );
    }

    const value = { ...payload, slug: finalSlug };

    await assertUniqueFields(value);

    const news = new News(value);

    try {
        await news.save();
    } catch (error) {
        throwIfDuplicate(error);
    }

    return news;
};

export const updateNewsById = async (id, payload) => {
    const value = { ...payload };

    // Absent means "leave the existing slug alone"; present but blank is a
    // client bug, not a request to clear it.
    if (value.slug !== undefined) {
        const normalised = slugify(value.slug);
        if (!normalised) {
            throw new AppError('Slug cannot be empty', 400);
        }
        value.slug = normalised;
    }

    const news = await News.findById(id);
    if (!news) {
        throw new AppError('No news is found with this id', 404);
    }

    await assertUniqueFields(value, id);

    news.set(value);

    try {
        return await news.save();
    } catch (error) {
        throwIfDuplicate(error);
    }
};

export const deleteNewsById = async id => {
    const news = await News.findById(id);
    if (!news) {
        throw new AppError('No news is found with this id', 404);
    }
    return news.deleteOne();
};
