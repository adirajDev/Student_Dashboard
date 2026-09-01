import Ads from './ads.model.js';
import AppError from '../../common/errors/AppError.js';
import { MAX_ADS_PER_SLOT } from './ads.constants.js';

/**
 * `image.data` is a base64 string on the document, so it must be excluded
 * from every lean read. The schema's toJSON transform does not run on lean
 * results — only on hydrated documents — so this is the only thing standing
 * between a twenty-row admin table and a multi-megabyte JSON response.
 */
const WITHOUT_IMAGE_DATA = '-image.data';

/**
 * Expiry is derived, never stored. A null bound means "open-ended", so both
 * halves have to accept null and a date on the right side of now.
 */
const liveWindow = (now = new Date()) => ({
    $and: [
        { $or: [{ startsAt: null }, { startsAt: { $lte: now } }] },
        { $or: [{ endsAt: null }, { endsAt: { $gte: now } }] },
    ],
});

/**
 * Public. Everything currently eligible to render in one slot, best first.
 *
 * Returns the whole eligible set rather than picking a winner, so rotation
 * between advertisers is a client-side decision that needs no server state
 * and no session tracking.
 */
export const getActiveAdsForSlot = async slot => {
    return Ads.find({ slot, status: 'active', ...liveWindow() })
        .sort({ priority: -1, updatedAt: -1 })
        .limit(MAX_ADS_PER_SLOT)
        .select(WITHOUT_IMAGE_DATA)
        .lean();
};

/** Admin. Every ad regardless of status, optionally narrowed by slot. */
export const getAds = async ({ slot, status } = {}) => {
    const filter = {};
    if (slot) filter.slot = slot;
    if (status) filter.status = status;

    return Ads.find(filter)
        .sort({ createdAt: -1 })
        .select(WITHOUT_IMAGE_DATA)
        .lean();
};

export const getAdById = async id => {
    const ad = await Ads.findById(id).select(WITHOUT_IMAGE_DATA).lean();
    if (!ad) throw new AppError('No ad is found with this id', 404);
    return ad;
};

/**
 * Only the fields the image route needs. `updatedAt` is part of the ETag —
 * unlike a gallery image, an ad's bytes can be replaced in place under a
 * stable id, so the id alone is not a safe cache key.
 */
export const getAdImage = async id => {
    const ad = await Ads.findById(id).select('image updatedAt').lean();
    if (!ad) throw new AppError('No ad is found with this id', 404);
    return ad;
};

export const createAd = async payload => {
    const ad = new Ads(payload);
    return ad.save();
};

export const updateAdById = async (id, payload) => {
    const ad = await Ads.findById(id);
    if (!ad) throw new AppError('No ad is found with this id', 404);

    ad.set(payload);
    return ad.save();
};

export const deleteAdById = async id => {
    const ad = await Ads.findById(id);
    if (!ad) throw new AppError('No ad is found with this id', 404);
    return ad.deleteOne();
};
