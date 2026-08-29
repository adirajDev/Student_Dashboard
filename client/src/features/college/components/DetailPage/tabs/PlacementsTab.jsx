import { Briefcase, TrendingUp } from 'lucide-react';
import PlacementStats from '../parts/PlacementStats';
import RecruiterChips from '../parts/RecruiterChips';
import { hasPlacementFigures } from '@/features/college/constants/collegeTabs';

const PlacementsTab = ({ college }) => {
    const showStats = hasPlacementFigures(college);
    const recruiters = college.recruiters || [];

    return (
        <div className="space-y-8">
            {showStats && (
                <section className="card">
                    <h2 className="text-2xl mb-6 text-[var(--foreground)] font-display flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-[var(--color-ink-500)]" />
                        Placement Statistics
                    </h2>
                    <PlacementStats details={college.placementDetails} />
                </section>
            )}

            {recruiters.length > 0 && (
                <section className="card">
                    <h2 className="text-xl sm:text-2xl mb-6 text-[var(--foreground)] font-display flex items-center">
                        <Briefcase className="w-5 h-5 mr-2 text-[var(--color-ink-500)]" />
                        Top Recruiters ({recruiters.length})
                    </h2>
                    <RecruiterChips recruiters={recruiters} />
                </section>
            )}
        </div>
    );
};

export default PlacementsTab;
