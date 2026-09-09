import { renderDiff } from './primitives.jsx';

// Placement figures are stored as free-text strings, so format both sides
// identically before comparing or an unchanged value reads as a change.
const lpa = v => (v === undefined || v === null || v === '' ? '' : `₹${v} LPA`);
const pct = v => (v === undefined || v === null || v === '' ? '' : `${v}%`);

export const buildPlacementDiff = (current = {}, proposed = {}) =>
    [
        proposed.averagePackage !== undefined &&
            renderDiff(
                'Average Package',
                lpa(current?.averagePackage),
                lpa(proposed.averagePackage),
                'pd-avg'
            ),
        proposed.highestPackage !== undefined &&
            renderDiff(
                'Highest Package',
                lpa(current?.highestPackage),
                lpa(proposed.highestPackage),
                'pd-high'
            ),
        proposed.placementPercentage !== undefined &&
            renderDiff(
                'Placement %',
                pct(current?.placementPercentage),
                pct(proposed.placementPercentage),
                'pd-pct'
            ),
    ].filter(Boolean);
