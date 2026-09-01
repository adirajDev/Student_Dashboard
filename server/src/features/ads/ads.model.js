import mongoose from 'mongoose';
import { AD_SLOT_IDS, AD_STATUSES } from './ads.constants.js';

const adsSchema = new mongoose.Schema(
    {
        label: { type: String, required: true, trim: true, maxLength: 120 },
        slot: { type: String, required: true, enum: AD_SLOT_IDS },
        image: {
            data: Buffer,
            contentType: String,
            sizeBytes: Number,
        },
        targetUrl: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: AD_STATUSES,
            default: 'draft',
        },
        priority: { type: Number, default: 0 },
        startsAt: { type: Date, default: null },
        endsAt: { type: Date, default: null },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (doc, ret) => {
                if (ret.image) delete ret.image.data;
                return ret;
            },
        },
    }
);

adsSchema.index({ slot: 1, status: 1, priority: -1 });

const Ads = mongoose.model('Ads', adsSchema);
export default Ads;
