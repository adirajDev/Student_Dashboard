import { formatPackage } from '@/features/college/utils/collegeFormatters';

const PlacementStats = ({ details }) => {
    if (!details) return null;

    return (
        <div className="flex flex-col sm:flex-row items-stretch divide-y sm:divide-y-0 sm:divide-x divide-[var(--border)] surface-wash border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden">
            {details.averagePackage && (
                <div className="flex-1 p-5 text-center">
                    <p className="text-sm text-[var(--muted)] mb-1 font-medium">
                        Median Package
                    </p>
                    <p className="text-2xl font-bold text-[var(--color-success)]">
                        {formatPackage(details.averagePackage)}
                    </p>
                </div>
            )}

            {details.highestPackage && (
                <div className="flex-1 p-5 text-center bg-[var(--background)] sm:bg-transparent">
                    <p className="text-sm text-[var(--muted)] mb-1 font-medium">
                        Highest Package
                    </p>
                    <p className="text-2xl font-bold text-[var(--color-amber-600)]">
                        {formatPackage(details.highestPackage)}
                    </p>
                </div>
            )}

            {details.placementPercentage && (
                <div className="flex-1 p-5 text-center">
                    <p className="text-sm text-[var(--muted)] mb-1 font-medium">
                        Placement Rate
                    </p>
                    <p className="text-2xl font-bold text-[var(--color-ink-600)]">
                        {details.placementPercentage}%
                    </p>
                </div>
            )}
        </div>
    );
};

export default PlacementStats;
