/**
 * One-off migration: backfill `slug` on every College document.
 *
 * Usage:
 *   node scripts/backfill-college-slugs.js --dry-run     # print, change nothing
 *   node scripts/backfill-college-slugs.js               # write
 *   node scripts/backfill-college-slugs.js --regenerate  # also re-slug docs that already have one
 *
 * Writes through the raw driver, not the Mongoose model, so it is not blocked
 * by `slug: { required: true }` while the data is still missing slugs.
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import { slugify } from '../common/utils/slug.util.js';

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
const DRY_RUN = process.argv.includes('--dry-run');
const REGENERATE = process.argv.includes('--regenerate');

async function main() {
    if (!MONGO_URI) throw new Error('MONGO_URI is not set');

    await mongoose.connect(MONGO_URI);
    const colleges = mongoose.connection.collection('colleges');

    const docs = await colleges
        .find({}, { projection: { name: 1, slug: 1 } })
        .toArray();

    // Slugs already in use that we are not going to touch.
    const taken = new Set(
        REGENERATE ? [] : docs.filter(d => d.slug).map(d => d.slug)
    );

    const ops = [];
    const report = [];

    for (const doc of docs) {
        if (doc.slug && !REGENERATE) continue;

        const base = slugify(doc.name);
        if (!base) {
            console.error(
                `Cannot slugify name for ${doc._id}: ${JSON.stringify(doc.name)}`
            );
            process.exitCode = 1;
            continue;
        }

        let slug = base;
        let n = 2;
        while (taken.has(slug)) {
            slug = `${base}-${n++}`;
        }

        taken.add(slug);
        report.push({
            _id: String(doc._id),
            name: doc.name,
            from: doc.slug ?? null,
            to: slug,
        });
        ops.push({
            updateOne: { filter: { _id: doc._id }, update: { $set: { slug } } },
        });
    }

    console.table(report);
    console.log(`${docs.length} colleges scanned, ${ops.length} to update.`);

    if (!ops.length) {
        await finish();
        return;
    }

    if (DRY_RUN) {
        console.log('Dry run: nothing written.');
        await finish();
        return;
    }

    const res = await colleges.bulkWrite(ops, { ordered: false });
    console.log(`Modified ${res.modifiedCount} documents.`);

    // The unique index cannot build while several docs share a missing slug,
    // so create it only after the backfill.
    try {
        await colleges.createIndex(
            { slug: 1 },
            { unique: true, name: 'slug_1' }
        );
        console.log('Unique index slug_1 is in place.');
    } catch (err) {
        console.error('Index creation failed:', err.message);
        console.error('Resolve the duplicates listed above, then re-run.');
    }

    await finish();
}

async function finish() {
    await mongoose.disconnect();
}

main().catch(async err => {
    console.error(err);
    await mongoose.disconnect();
    process.exit(1);
});
