import asyncHandler from '../../common/utils/asyncHandler.js';
import AppError from '../../common/errors/AppError.js';
import * as adService from './ads.service.js';
import { AD_SLOTS, AD_SLOT_IDS } from './ads.constants.js';

/**
 * Public. The slot registry, so the client never has to guess a slot id.
 * Cheap and static — safe to cache at the edge for a while.
 */
export const getSlots = asyncHandler(async (req, res) => {
    res.set('Cache-Control', 'public, max-age=3600');
    res.status(200).json({ success: true, data: AD_SLOTS });
});

/**
 * Public. Active ads for one slot.
 *
 * The slot is checked against the registry before it reaches the database.
 * Without this an arbitrary string reaches the query and every unknown slot
 * costs a full index probe for nothing.
 */
export const getAdsForSlot = asyncHandler(async (req, res) => {
    const { slot } = req.params;

    if (!AD_SLOT_IDS.includes(slot)) {
        throw new AppError(`Unknown ad slot: ${slot}`, 400);
    }

    const ads = await adService.getActiveAdsForSlot(slot);

    // Short and shared. Long enough that a burst of page views hits the cache,
    // short enough that pausing an ad takes effect within a minute.
    res.set('Cache-Control', 'public, max-age=60');
    res.status(200).json({ success: true, data: ads });
});

/**
 * Public. The image bytes.
 *
 * Stored as base64 text, served as binary, so the browser caches the decoded
 * image on its own rather than re-downloading it inside a JSON payload on
 * every navigation.
 *
 * The ETag folds in updatedAt because an admin can replace the image on an
 * existing ad, leaving the id unchanged. Pair this with the `?v=<updatedAt>`
 * query the list response emits: the URL itself changes when the image does,
 * so `immutable` stays honest.
 */
export const serveAdImage = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const ad = await adService.getAdImage(id);

    if (!ad.image?.data) {
        throw new AppError('This ad has no image', 404);
    }

    const version = ad.updatedAt ? new Date(ad.updatedAt).getTime() : 0;
    const etag = `"ad-${id}-${version}"`;

    if (req.headers['if-none-match'] === etag) {
        return res.status(304).end();
    }

    // Mongoose stores this field as a String, so it arrives as base64 text
    // whether or not the write went through a data URL. Strip a prefix if one
    // slipped through, then decode.
    const raw = ad.image.data.replace(/^data:[^,]*,/, '').replace(/\s/g, '');
    const bytes = Buffer.from(raw, 'base64');

    if (bytes.length === 0) {
        throw new AppError('Ad image data is empty', 404);
    }

    res.set({
        'Content-Type': ad.image.mimeType || 'image/jpeg',
        'Content-Length': bytes.length,
        'Cache-Control': 'public, max-age=31536000, immutable',
        ETag: etag,
    });
    res.send(bytes);
});

/** Admin. */
export const getAds = asyncHandler(async (req, res) => {
    const ads = await adService.getAds({
        slot: req.query.slot,
        status: req.query.status,
    });
    res.status(200).json({ success: true, data: ads });
});

export const getAdById = asyncHandler(async (req, res) => {
    const ad = await adService.getAdById(req.params.id);
    res.status(200).json({ success: true, data: ad });
});

export const createAd = asyncHandler(async (req, res) => {
    const ad = await adService.createAd(req.body);
    res.status(201).json({ success: true, data: ad });
});

export const updateAd = asyncHandler(async (req, res) => {
    const ad = await adService.updateAdById(req.params.id, req.body);
    res.status(200).json({ success: true, data: ad });
});

export const deleteAd = asyncHandler(async (req, res) => {
    await adService.deleteAdById(req.params.id);
    res.status(200).json({ success: true, data: 'deleted successfully' });
});
